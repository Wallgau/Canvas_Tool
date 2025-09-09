/**
 * Ultra-optimized tool persistence with minimal performance impact
 * Performance-focused: lazy loading, non-blocking saves, minimal re-renders
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Tool } from '../types';
import { STORAGE_KEYS, TOOL_IDS } from '../utils/constants';
import { getDefaultPosition } from '../utils/positioning';

export const useToolPersistence = (): {
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
  updateDefaultToolPosition: () => void;
  clearStorage: () => void;
  hasUnsavedChanges: () => boolean;
} => {
  // Track if this is initial load to prevent saving default data immediately
  const isInitialLoadRef = useRef(true);
  const lastSavedRef = useRef<string>('');
  const saveTimeoutRef = useRef<number | null>(null);

  // Start with empty array to avoid blocking render
  const [tools, setTools] = useState<Tool[]>([]);

  // Load from localStorage asynchronously using requestIdleCallback
  useEffect(() => {
    const loadTools = (): void => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.TOOL_CANVAS_STATE);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTools(parsed);
          }
        } else {
          // Add a default tool for testing if no tools exist
          const defaultTool: Tool = {
            id: 'test-tool-1',
            name: 'get_weather',
            params: { location: 'Durham, NC', date: 'tomorrow' },
            position: { x: 100, y: 100 },
          };
          setTools([defaultTool]);
        }
      } catch {
        // Failed to load tools from localStorage - silently fail
      }
    };

    // Use requestIdleCallback for non-blocking load with longer timeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadTools, { timeout: 1000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(loadTools, 100);
    }

    // Mark initial load as complete
    isInitialLoadRef.current = false;
  }, []);

  // Optimized debounced save - only when data actually changes and not empty
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    // Skip save if tools array is empty
    if (tools.length === 0) {
      // Clear localStorage if tools are empty
      if (lastSavedRef.current !== '') {
        localStorage.removeItem(STORAGE_KEYS.TOOL_CANVAS_STATE);
        lastSavedRef.current = '';
      }
      return;
    }

    const serialized = JSON.stringify(tools);

    // Skip if no actual changes
    if (serialized === lastSavedRef.current) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounced save with longer delay for better performance
    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        // Use requestIdleCallback for non-blocking save
        const saveOperation = (): void => {
          localStorage.setItem(STORAGE_KEYS.TOOL_CANVAS_STATE, serialized);
          lastSavedRef.current = serialized;
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(saveOperation, { timeout: 2000 });
        } else {
          saveOperation();
        }
      } catch {
        // Failed to save tools to localStorage - silently fail
      }
    }, 500); // Longer debounce for better performance

    return (): void => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [tools]);

  // Optimized default tool position updater
  const updateDefaultToolPosition = useCallback((): void => {
    setTools(prev => {
      const hasDefaultTool = prev.some(
        tool => tool.id === TOOL_IDS.DEFAULT_WEATHER_TOOL
      );
      if (!hasDefaultTool) return prev; // Early return if no default tool

      return prev.map(tool =>
        tool.id === TOOL_IDS.DEFAULT_WEATHER_TOOL
          ? { ...tool, position: getDefaultPosition() }
          : tool
      );
    });
  }, []);

  // Clear storage with cleanup
  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOOL_CANVAS_STATE);
    lastSavedRef.current = '';
  }, []);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    const current = JSON.stringify(tools);
    return current !== lastSavedRef.current;
  }, [tools]);

  return {
    tools,
    setTools,
    updateDefaultToolPosition,
    clearStorage,
    hasUnsavedChanges,
  };
};
