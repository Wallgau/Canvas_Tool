/**
 * Custom hook for managing parameter editing state and logic
 */

import { useState, useCallback } from 'react';
import type { Tool } from '../../../types';
import { validateInput } from '../../../utils/inputSanitization';
import { getInputTypeForParam } from '../../../utils/inputTypeUtils';

interface UseParameterEditingProps {
  tool: Tool;
  onUpdate: (updatedTool: Tool) => void;
}

export const useParameterEditing = ({
  tool,
  onUpdate,
}: UseParameterEditingProps): {
  isEditing: boolean;
  editParams: Record<string, string>;
  editingParam: string | null;
  handleParamChange: (key: string, value: string) => void;
  startEditing: (paramKey: string) => void;
  handleKeyPress: (e: React.KeyboardEvent, paramKey: string) => void;
  handleSaveParams: () => void;
  handleCancelEdit: () => void;
} => {
  const [isEditing, setIsEditing] = useState(false);
  const [editParams, setEditParams] = useState(tool.params);
  const [editingParam, setEditingParam] = useState<string | null>(null);

  const handleParamChange = useCallback(
    (key: string, value: string) => {
      // Determine input type based on parameter name and tool type
      const inputType = getInputTypeForParam(key);

      // Sanitize and validate input
      const result = validateInput(value, inputType, {
        maxLength: 1000,
        trimWhitespace: true,
        escapeHtml: true,
      });

      // Update with sanitized value
      setEditParams(prev => ({
        ...prev,
        [key]: result.sanitizedValue,
      }));

      // Log warnings if any
      if (result.warnings.length > 0) {
        // Parameter warnings - silently handle
      }

      // Log errors if any (but still allow editing)
      if (result.errors.length > 0) {
        // Parameter errors - silently handle
      }
    },
    [tool.name]
  );

  const startEditing = useCallback((paramKey: string) => {
    setIsEditing(true);
    setEditingParam(paramKey);
  }, []);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent, paramKey: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        startEditing(paramKey);
      }
    },
    [startEditing]
  );

  const handleSaveParams = useCallback(() => {
    onUpdate({
      ...tool,
      params: editParams,
    });
    setIsEditing(false);
    setEditingParam(null);
  }, [tool, editParams, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditParams(tool.params);
    setIsEditing(false);
    setEditingParam(null);
  }, [tool.params]);

  return {
    isEditing,
    editParams,
    editingParam,
    handleParamChange,
    startEditing,
    handleKeyPress,
    handleSaveParams,
    handleCancelEdit,
  };
};
