import React, { useState } from 'react';
import { Card } from '../reusable/Card/Card';
import Input from '../reusable/Input/Input';
import { ConfirmationModal } from '../reusable/ConfirmationModal/ConfirmationModal';
import { useParameterEditing } from './hooks/useParameterEditing';
import { getParameterSection } from './utils/parameterUtils';
import { getToolDisplayName } from '../../utils/toolUtils';
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

  // Parameter editing logic
  const {
    isEditing,
    editParams,
    editingParam,
    handleParamChange,
    handleKeyPress,
    handleSaveParams: originalHandleSaveParams,
    handleCancelEdit,
  } = useParameterEditing({ tool, onUpdate });

  const parameterSection = getParameterSection(tool, isEditing, editingParam);

  // Save confirmation handlers
  const handleSaveClick = (): void => {
    setShowSaveConfirmation(true);
  };

  const handleConfirmSave = (): void => {
    originalHandleSaveParams();
    setShowSaveConfirmation(false);
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
        {parameterSection.fields.map(field => (
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
            />
          </div>
        ))}
        <div className='flex gap-1 mt-3'>
          <button
            onClick={handleSaveClick}
            className='flex-1 px-2 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className='flex-1 px-2 py-1.5 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors'
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
        description="Are you sure you want to save these parameter changes?"
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
        confirmButtonText="Save"
        variant="success"
      />
    </>
  );
};
