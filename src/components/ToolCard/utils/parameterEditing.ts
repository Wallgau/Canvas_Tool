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
  validationErrors: Record<string, string[]>;
  hasChanges: boolean;
  originalParams: Record<string, string>;
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
  validationErrors: {},
  hasChanges: false,
  originalParams: { ...tool.params },
});

/**
 * Check if parameters have changed from original
 */
export const checkParametersChanged = (
  editParams: Record<string, string>,
  originalParams: Record<string, string>
): boolean => {
  // Compare each parameter value
  for (const [key, value] of Object.entries(editParams)) {
    if (value !== originalParams[key]) {
      return true;
    }
  }

  // Check if any original keys are missing in editParams
  for (const key of Object.keys(originalParams)) {
    if (!(key in editParams)) {
      return true;
    }
  }

  return false;
};

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
    // Always update the value so user can see what they're typing
    const newEditParams = { ...state.editParams, [key]: value };
    const hasChanges = checkParametersChanged(
      newEditParams,
      state.originalParams
    );

    updateState({
      editParams: newEditParams,
      hasChanges,
    });

    // Clear validation error for this field if it becomes valid
    if (state.validationErrors[key]) {
      const inputType = getInputTypeForParam(key);
      const validation = validateInput(value, inputType);

      if (validation.isValid) {
        const newValidationErrors = { ...state.validationErrors };
        delete newValidationErrors[key];
        updateState({
          validationErrors: newValidationErrors,
        });
      }
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
    // Validate all parameters when save is clicked
    const validationErrors: Record<string, string[]> = {};

    Object.entries(state.editParams).forEach(([key, value]) => {
      const inputType = getInputTypeForParam(key);
      const validation = validateInput(value, inputType);

      if (!validation.isValid) {
        validationErrors[key] = validation.errors;
      }
    });

    // If there are validation errors, show them and don't save
    if (Object.keys(validationErrors).length > 0) {
      updateState({
        validationErrors,
      });
      return;
    }

    // No errors, proceed with save
    const updatedParams = { ...state.editParams };
    onUpdate(tool.id, { params: updatedParams });
    updateState({
      isEditing: false,
      editingParam: null,
      validationErrors: {},
      hasChanges: false,
      originalParams: updatedParams,
    });
  };

  const handleCancelEdit = (): void => {
    updateState({
      isEditing: false,
      editingParam: null,
      editParams: { ...tool.params },
      validationErrors: {},
      hasChanges: false,
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
