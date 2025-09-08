import React, { useEffect, useRef } from 'react';
import type { Tool } from '../../types';
import { useParameterEditing } from './hooks/useParameterEditing';
import { getToolDisplayName } from '../../utils/toolUtils';

interface ToolCardProps {
  tool: Tool;
  onUpdate: (updatedTool: Tool) => void;
  onDelete: (toolId: string) => void;
  isNew?: boolean;
}

export const ToolCard = ({
  tool,
  onUpdate,
  onDelete,
  isNew = false,
}: ToolCardProps): React.JSX.Element => {
  const toolCardRef = useRef<HTMLDivElement>(null);

  // Get the display name for this tool
  const displayName = getToolDisplayName(tool);

  // Focus the tool card when it's newly added
  useEffect(() => {
    if (isNew && toolCardRef.current) {
      // Small delay to ensure the card is rendered
      setTimeout(() => {
        toolCardRef.current?.focus();
      }, 100);
    }
  }, [isNew]);

  // Parameter editing logic
  const {
    isEditing,
    editParams,
    editingParam,
    handleParamChange,
    startEditing,
    handleKeyPress,
    handleSaveParams,
    handleCancelEdit,
  } = useParameterEditing({ tool, onUpdate });

  // Note: Drag and drop is now handled by ReactFlow

  return (
    <div
      ref={toolCardRef}
      className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 min-w-72 hover:border-primary-500 hover:shadow-md transition-all"
      role='group'
      aria-labelledby={`tool-${tool.id}-name`}
      aria-describedby={`tool-${tool.id}-params`}
      tabIndex={0}
    >
      <header className="flex items-center justify-between mb-3">
        <div
          id={`tool-${tool.id}-name`}
          className="font-semibold text-lg text-gray-900"
          role='heading'
          aria-level={3}
        >
          {displayName}
        </div>
        <button
          type='button'
          className="text-red-500 hover:text-red-700 p-1 rounded"
          onClick={() => onDelete(tool.id)}
          aria-label={`Delete ${displayName} tool`}
          title='Delete tool'
        >
          <span aria-hidden='true'>×</span>
        </button>
      </header>

      <div
        id={`tool-${tool.id}-params`}
        className="space-y-2"
        role='group'
        aria-label='Tool parameters'
      >
        {Object.entries(tool.params).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <label
              className="text-sm font-medium text-gray-600 min-w-20"
              htmlFor={`param-${tool.id}-${key}`}
              id={`label-${tool.id}-${key}`}
            >
              {key}:
            </label>
            {isEditing && editingParam === key ? (
              <input
                id={`param-${tool.id}-${key}`}
                type='text'
                value={editParams[key] || ''}
                onChange={e => handleParamChange(key, e.target.value)}
                className="input flex-1"
                aria-label={`Edit ${key} parameter`}
                aria-describedby={`label-${tool.id}-${key}`}
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSaveParams();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
              />
            ) : (
              <button
                type='button'
                className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded flex-1 text-left hover:bg-gray-100"
                onClick={() => startEditing(key)}
                onKeyDown={e => handleKeyPress(e, key)}
                aria-label={`${key}: ${value || 'empty'}. Press Enter or Space to edit`}
                aria-describedby={`label-${tool.id}-${key}`}
                title='Click to edit'
              >
                {value || '<empty>'}
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200" role='group' aria-label='Edit actions'>
          <button
            type='button'
            onClick={handleSaveParams}
            className="btn-primary"
            aria-label='Save parameter changes'
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSaveParams();
              }
            }}
          >
            Save
          </button>
          <button
            type='button'
            onClick={handleCancelEdit}
            className="btn-secondary"
            aria-label='Cancel parameter changes'
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCancelEdit();
              }
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
