/**
 * Parameter editing utilities - abstract business logic
 */

import type { Tool } from '../../types';
import { validateInput } from '../../../utils/inputSanitization';
import { getInputTypeForParam } from '../../../utils/inputTypeUtils';

export interface ParameterEditingState {
  isEditing: boolean;
  editParams: Record<string, string>;
  editingParam: string | null;
}

export interface ParameterEditingActions {
  handleParamChange: (key: string, value: string) => void;
  startEditing: (paramKey: string) => void;
  handleKeyPress: (e: React.KeyboardEvent, paramKey: string) => void;
  handleSaveParams: () => void;
  handleCancelEdit: () => void;
}

export interface ParameterEditingConfig {
  tool: Tool;
  onUpdate: (id: string, updates: Partial<Tool>) => void;
  onStateChange?: (state: ParameterEditingState) => void;
}

/**
 * Create parameter editing state
 */
export const createParameterEditingState = (
  tool: Tool
): ParameterEditingState => ({
  isEditing: true,
  editParams: { ...tool.params },
  editingParam: null,
});

/**
 * Validate parameter value
 */
export const validateParameterValue = (
  paramName: string,
  value: string
): boolean => {
  const inputType = getInputTypeForParam(paramName);
  return validateInput(value, inputType);
};

/**
 * Create parameter editing actions
 */
export const createParameterEditingActions = (
  config: ParameterEditingConfig,
  state: ParameterEditingState,
  setState: (state: ParameterEditingState) => void
): ParameterEditingActions => {
  const { tool, onUpdate, onStateChange } = config;

  const updateState = (newState: Partial<ParameterEditingState>): void => {
    const updatedState = { ...state, ...newState };
    setState(updatedState);
    onStateChange?.(updatedState);
  };

  const handleParamChange = (key: string, value: string): void => {
    if (validateParameterValue(key, value)) {
      updateState({
        editParams: { ...state.editParams, [key]: value },
      });
    }
  };

  const startEditing = (paramKey: string): void => {
    updateState({
      isEditing: true,
      editingParam: paramKey,
      editParams: { ...tool.params },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSaveParams();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleSaveParams = (): void => {
    const updatedParams = { ...state.editParams };
    onUpdate(tool.id, { params: updatedParams });
    updateState({
      isEditing: false,
      editingParam: null,
    });
  };

  const handleCancelEdit = (): void => {
    updateState({
      isEditing: false,
      editingParam: null,
      editParams: { ...tool.params },
    });
  };

  return {
    handleParamChange,
    startEditing,
    handleKeyPress,
    handleSaveParams,
    handleCancelEdit,
  };
};
