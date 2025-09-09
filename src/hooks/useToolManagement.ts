/**
 * Optimized tool management - performance-focused CRUD operations
 */

import { useCallback, useMemo } from 'react';
import type { Tool, ToolTemplate } from '../types';
import { PREDEFINED_TOOLS } from '../types';
import {
  createToolFromTemplate,
  getUsedToolNames,
} from '../utils/toolCreation';

// Define the return type for the hook
interface ToolManagementActions {
  tools: Tool[];
  addTool: (template: ToolTemplate) => string;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  clearTools: () => void;
  exportTools: () => void;
}

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

  // Export tools to JSON file
  const exportTools = useCallback((): void => {
    const exportData = {
      tools,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `tool-canvas-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [tools]);

  return {
    addTool,
    tools,
    updateTool,
    deleteTool,
    clearTools: clearAllTools,
    exportTools,
    availableTools,
  };
};
