/**
 * Custom hook for managing parameter editing state and logic
 */

import { useState } from 'react';
import type { Tool } from '../../../types';
import {
  createParameterEditingState,
  createParameterEditingActions,
  type ParameterEditingState,
  type ParameterEditingConfig,
} from '../utils/parameterEditing';

interface UseParameterEditingProps {
  tool: Tool;
  onUpdate: (id: string, updates: Partial<Tool>) => void;
}

export const useParameterEditing = ({
  tool,
  onUpdate,
}: UseParameterEditingProps): {
  isEditing: boolean;
  editParams: Record<string, string>;
  editingParam: string | null;
  validationErrors: Record<string, string[]>;
  hasChanges: boolean;
  handleParamChange: (key: string, value: string) => void;
  startEditing: (paramKey: string) => void;
  handleKeyPress: (e: React.KeyboardEvent, paramKey: string) => void;
  handleSaveParams: () => void;
  handleCancelEdit: () => void;
  setValidationErrors: (errors: Record<string, string[]>) => void;
} => {
  const [state, setState] = useState<ParameterEditingState>(() =>
    createParameterEditingState(tool)
  );

  const config: ParameterEditingConfig = {
    tool,
    onUpdate,
  };

  const actions = createParameterEditingActions(config, state, setState);

  const setValidationErrors = (errors: Record<string, string[]>): void => {
    setState(prev => ({
      ...prev,
      validationErrors: errors,
    }));
  };

  return {
    ...state,
    ...actions,
    setValidationErrors,
  };
};
