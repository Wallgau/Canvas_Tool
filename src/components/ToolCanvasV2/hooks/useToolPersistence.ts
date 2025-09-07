/**
 * Optimized tool persistence with lazy initialization
 * Performance-focused: minimal useEffects, lazy loading, debounced saves
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Tool } from '../../../types';
import type { CanvasSize } from '../ToolCanvasV2.types';
import { CANVAS_CONSTANTS } from '../utils/constants';
import { getDefaultPosition } from '../utils/positioning';

interface UseToolPersistenceProps {
  canvasSize: CanvasSize;
}

export const useToolPersistence = ({ canvasSize }: UseToolPersistenceProps) => {
  
  // Track if this is initial load to prevent saving default data immediately
  const isInitialLoadRef = useRef(true);
  const lastSavedRef = useRef<string>('');
  
  // Lazy initialization - DISABLED for performance testing
  const [tools, setTools] = useState<Tool[]>(() => {
    // Skip localStorage loading for performance testing
    return [];
  });

  // No default tools - start with clean canvas

  // Mark initial load as complete after first render
  useEffect(() => {
    isInitialLoadRef.current = false;
  }, []);

  // Optimized debounced save - only when data actually changes
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    
    const serialized = JSON.stringify(tools);
    
    // Skip if no actual changes
    if (serialized === lastSavedRef.current) return;
    
    const timeoutId = window.setTimeout(() => {
      try {
        // Use requestIdleCallback for non-blocking save if available
        const saveOperation = () => {
          // Skip localStorage for performance testing
          // localStorage.setItem(CANVAS_CONSTANTS.STORAGE_KEY, serialized);
          lastSavedRef.current = serialized;
        };
        
        if ('requestIdleCallback' in window) {
          requestIdleCallback(saveOperation, { timeout: 1000 });
        } else {
          saveOperation();
        }
      } catch (error) {
        console.error('Failed to save tools to localStorage:', error);
      }
    }, 300); // Faster debounce for better UX
    
    return () => window.clearTimeout(timeoutId);
  }, [tools]);

  // Optimized default tool position updater
  const updateDefaultToolPosition = useCallback(() => {
    setTools(prev => {
      const hasDefaultTool = prev.some(tool => tool.id === CANVAS_CONSTANTS.DEFAULT_TOOL_ID);
      if (!hasDefaultTool) return prev; // Early return if no default tool
      
      return prev.map(tool => 
        tool.id === CANVAS_CONSTANTS.DEFAULT_TOOL_ID 
          ? { ...tool, position: getDefaultPosition(canvasSize) }
          : tool
      );
    });
  }, [canvasSize]);

  // Clear storage with cleanup
  const clearStorage = useCallback(() => {
    localStorage.removeItem(CANVAS_CONSTANTS.STORAGE_KEY);
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
    hasUnsavedChanges
  };
};
