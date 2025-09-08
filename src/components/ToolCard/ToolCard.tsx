import React, { useEffect, useRef } from 'react';
import type { Tool } from '../../types';
import { useDraggableDesktop } from './hooks/useDraggableDesktop';
import { useParameterEditing } from './hooks/useParameterEditing';
import { getToolDisplayName } from '../../utils/toolUtils';
// import styles from './ToolCard.module.css';

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

  const { dragProps, isDragging } = useDraggableDesktop({
    initialPosition: tool.position,
    onDragEnd: position => {
      onUpdate({
        ...tool,
        position,
      });
    },
  });

  return (
    <div
      ref={toolCardRef}
      {...dragProps}
      className={`tool-card ${isDragging ? 'dragging' : ''}`}
      role='group'
      aria-labelledby={`tool-${tool.id}-name`}
      aria-describedby={`tool-${tool.id}-params`}
      tabIndex={0}
      aria-label={`${displayName} tool card`}
    >
      <header className="toolHeader">
        <button
          className="dragHandle"
          data-drag-handle='true'
          type='button'
          aria-label={`Move ${displayName} tool. Use arrow keys to reposition.`}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Could implement keyboard-based repositioning here
            }
          }}
        >
          <div className="dragIcon" aria-hidden='true'>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div
          id={`tool-${tool.id}-name`}
          className="toolName"
          role='heading'
          aria-level={3}
        >
          {displayName}
        </div>
        <button
          type='button'
          className="deleteBtn"
          onClick={() => onDelete(tool.id)}
          aria-label={`Delete ${displayName} tool`}
          title='Delete tool'
        >
          <span aria-hidden='true'>×</span>
        </button>
      </header>

      <div
        id={`tool-${tool.id}-params`}
        className="toolParams"
        role='group'
        aria-label='Tool parameters'
      >
        {Object.entries(tool.params).map(([key, value]) => (
          <div key={key} className="paramRow">
            <label
              className="paramLabel"
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
                className="paramInput"
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
                className="paramValue"
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
        <div
          className="editActions"
          role='group'
          aria-label='Edit actions'
        >
          <button
            type='button'
            onClick={handleSaveParams}
            className="saveBtn"
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
            className="cancelBtn"
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
