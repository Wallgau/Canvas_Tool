import React, { useState } from 'react';
import { Card } from '../reusable/Card/Card';
import Input from '../reusable/Input/Input';
import { ConfirmationModal } from '../reusable/ConfirmationModal/ConfirmationModal';
import { useParameterEditing } from './hooks/useParameterEditing';
import { getParameterSection } from './utils/parameterUtils';
import { getToolDisplayName } from '../../utils/toolUtils';
import { validateInput } from '../../utils/inputSanitization';
import { getInputTypeForParam } from '../../utils/inputTypeUtils';
import { useToast } from '../../hooks/use-toast';
import type { Tool } from '../../types';

export interface ToolCardProps {
  tool: Tool;
  onUpdate: (id: string, updates: Partial<Tool>) => void;
  onDelete: (toolId: string) => void;
  isNew?: boolean;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onUpdate,
  onDelete,
  isNew = false,
  className = '',
}): React.JSX.Element => {
  const displayName = getToolDisplayName(tool);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const { toast } = useToast();

  // Parameter editing logic
  const {
    isEditing,
    editParams,
    editingParam,
    validationErrors,
    hasChanges,
    handleParamChange,
    handleKeyPress,
    handleSaveParams: originalHandleSaveParams,
    handleCancelEdit,
    setValidationErrors,
  } = useParameterEditing({ tool, onUpdate });

  const parameterSection = getParameterSection(tool, isEditing, editingParam);

  // Save confirmation handlers
  const handleSaveClick = (): void => {
    // Validate all parameters before showing confirmation modal
    const validationErrors: Record<string, string[]> = {};

    Object.entries(editParams).forEach(([key, value]) => {
      const inputType = getInputTypeForParam(key);
      const validation = validateInput(value, inputType);

      if (!validation.isValid) {
        validationErrors[key] = validation.errors;
      }
    });

    // If there are validation errors, show them and don't show confirmation modal
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    // No errors, show confirmation modal
    setShowSaveConfirmation(true);
  };

  const handleConfirmSave = (): void => {
    originalHandleSaveParams();
    setShowSaveConfirmation(false);
    // Show success toast
    toast({
      title: 'Changes saved',
      description: 'Parameter changes have been saved successfully.',
      variant: 'success',
    });
  };

  const handleCancelSave = (): void => {
    setShowSaveConfirmation(false);
  };

  const renderParameters = (): React.ReactNode => {
    if (!parameterSection.hasParameters) {
      return null;
    }

    return (
      <div className='space-y-3'>
        {parameterSection.fields.map(field => {
          const fieldErrors = validationErrors[field.name] || [];
          const hasError = fieldErrors.length > 0;

          return (
            <div key={field.name} className='space-y-1'>
              <label
                htmlFor={field.id}
                className='block text-sm font-medium text-gray-600'
              >
                {field.name}
              </label>
              <Input
                id={field.id}
                type='text'
                value={editParams[field.name] || field.value}
                onChange={e => handleParamChange(field.name, e.target.value)}
                onKeyDown={e => handleKeyPress(e, field.name)}
                placeholder={`Enter ${field.name}`}
                className={
                  hasError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }
              />
              {hasError && (
                <div className='text-xs text-red-600 space-y-1'>
                  {fieldErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className='flex gap-1 mt-3'>
          <button
            onClick={handleSaveClick}
            disabled={!hasChanges}
            className={`flex-1 px-2 py-1.5 text-xs rounded transition-colors ${
              hasChanges
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={!hasChanges}
            className={`flex-1 px-2 py-1.5 text-xs rounded transition-colors ${
              hasChanges
                ? 'bg-gray-400 text-white hover:bg-gray-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card
        id={tool.id}
        title={displayName}
        content={renderParameters()}
        onDelete={onDelete}
        isNew={isNew}
        className={className}
      />
      <ConfirmationModal
        isVisible={showSaveConfirmation}
        description='Are you sure you want to save these parameter changes?'
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
        confirmButtonText='Save'
        variant='success'
      />
    </>
  );
};
