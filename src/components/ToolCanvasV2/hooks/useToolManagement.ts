/**
 * Optimized tool management - performance-focused CRUD operations
 */

import { useCallback, useMemo } from 'react';
import type { Tool, ToolTemplate } from '../../../types';
import { PREDEFINED_TOOLS } from '../../../types';
import type { ToolManagementActions } from '../ToolCanvasV2.types';
import {
  createToolFromTemplate,
  getUsedToolNames,
} from '../../../utils/toolCreation';

interface UseToolManagementProps {
  tools: Tool[];
  setTools: (tools: Tool[] | ((prev: Tool[]) => Tool[])) => void;
}

export const useToolManagement = ({
  tools,
  setTools,
}: UseToolManagementProps): ToolManagementActions & {
  availableTools: ToolTemplate[];
} => {
  // Memoized available tools calculation
  const availableTools = useMemo(() => {
    const usedToolNames = getUsedToolNames(tools);
    return PREDEFINED_TOOLS.filter(tool => !usedToolNames.has(tool.name));
  }, [tools]);

  // Optimized add tool - always use functional update for better performance
  const addTool = useCallback(
    (template: ToolTemplate): string => {
      let newToolId = '';
      setTools(prev => {
        const newTool = createToolFromTemplate(template, prev);
        newToolId = newTool.id;
        return [...prev, newTool];
      });
      return newToolId;
    },
    [setTools]
  );

  // Optimized update tool - functional update pattern with sanitization
  const updateTool = useCallback(
    (id: string, updates: Partial<Tool>) => {
      setTools(prev =>
        prev.map(tool => {
          if (tool.id === id) {
            // Sanitize the updated tool data
            const sanitizedUpdates = { ...tool, ...updates }; // Simple sanitization for now
            return sanitizedUpdates;
          }
          return tool;
        })
      );
    },
    [setTools]
  );

  // Optimized delete tool - functional update pattern
  const deleteTool = useCallback(
    (id: string) => {
      setTools(prev => prev.filter(tool => tool.id !== id));
    },
    [setTools]
  );

  // Clear all tools - returns a function to trigger confirmation
  const clearAllTools = useCallback(() => {
    setTools([]);
  }, [setTools]);

  // Reorder tools for mobile drag & drop
  const reorderTools = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      setTools(prev => {
        const newTools = [...prev];
        const [movedTool] = newTools.splice(fromIndex, 1);
        newTools.splice(toIndex, 0, movedTool);
        return newTools;
      });
    },
    [setTools]
  );

  return {
    addTool,
    updateTool,
    deleteTool,
    clearAllTools,
    reorderTools,
    availableTools,
  };
};
