/**
 * Optimized tool management - performance-focused CRUD operations
 */

import { useCallback, useMemo } from 'react';
import type { Tool, ToolTemplate } from '../../../types';
import { PREDEFINED_TOOLS } from '../../../types';
import type { CanvasSize, ToolManagementActions } from '../ToolCanvasV2.types';
import { createToolFromTemplate, getUsedToolNames } from '../utils/positioning';

interface UseToolManagementProps {
  tools: Tool[];
  setTools: (tools: Tool[] | ((prev: Tool[]) => Tool[])) => void;
  canvasSize: CanvasSize;
}

export const useToolManagement = ({ 
  tools, 
  setTools, 
  canvasSize 
}: UseToolManagementProps): ToolManagementActions & { availableTools: ToolTemplate[] } => {
  
  // Memoized available tools calculation
  const availableTools = useMemo(() => {
    const usedToolNames = getUsedToolNames(tools);
    return PREDEFINED_TOOLS.filter(tool => !usedToolNames.has(tool.name));
  }, [tools]);

  // Optimized add tool - always use functional update for better performance
  const addTool = useCallback((template: ToolTemplate) => {
    setTools(prev => {
      const newTool = createToolFromTemplate(template, prev, canvasSize);
      return [...prev, newTool];
    });
  }, [canvasSize, setTools]);

  // Optimized update tool - functional update pattern
  const updateTool = useCallback((id: string, updates: Partial<Tool>) => {
    setTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, ...updates } : tool
    ));
  }, [setTools]);

  // Optimized delete tool - functional update pattern
  const deleteTool = useCallback((id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  }, [setTools]);

  // Clear all tools with optimized confirmation
  const clearAllTools = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all tools?')) {
      setTools([]);
    }
  }, [setTools]);

  // Reorder tools for mobile drag & drop
  const reorderTools = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setTools(prev => {
      const newTools = [...prev];
      const [movedTool] = newTools.splice(fromIndex, 1);
      newTools.splice(toIndex, 0, movedTool);
      return newTools;
    });
  }, [setTools]);

  return {
    addTool,
    updateTool,
    deleteTool,
    clearAllTools,
    reorderTools,
    availableTools
  };
};
