import React, { useState } from 'react';
import type { Tool } from '../../types';
import { PREDEFINED_TOOLS } from '../../types';
import { useDraggableResponsive } from './hooks/useDraggableResponsive';
// CSS inlined in index.html for optimal performance

interface ToolCardProps {
  tool: Tool;
  toolIndex?: number;
  onUpdate: (updatedTool: Tool) => void;
  onDelete: (toolId: string) => void;
  onMobileReorder?: (fromIndex: number, toIndex: number) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  toolIndex = 0, 
  onUpdate, 
  onDelete, 
  onMobileReorder 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editParams, setEditParams] = useState(tool.params);
  const [editingParam, setEditingParam] = useState<string | null>(null);
  
  // Get the display name for this tool
  const toolTemplate = PREDEFINED_TOOLS.find(t => t.name === tool.name);
  const displayName = toolTemplate?.displayName || tool.name;
  
  const { dragProps, isDragging, isMobileReordering } = useDraggableResponsive({
    initialPosition: tool.position,
    toolIndex,
    onDragEnd: (position) => {
      onUpdate({
        ...tool,
        position
      });
    },
    onMobileReorder
  });

  const handleParamChange = (key: string, value: string) => {
    setEditParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const startEditing = (paramKey: string) => {
    setIsEditing(true);
    setEditingParam(paramKey);
  };

  const handleKeyPress = (event: React.KeyboardEvent, paramKey: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      startEditing(paramKey);
    }
  };

  const handleSaveParams = () => {
    onUpdate({
      ...tool,
      params: editParams
    });
    setIsEditing(false);
    setEditingParam(null);
  };

  const handleCancelEdit = () => {
    setEditParams(tool.params);
    setIsEditing(false);
    setEditingParam(null);
  };

  return (
    <article 
      {...dragProps} 
      className={`toolCard ${isDragging ? 'dragging' : ''} ${isMobileReordering ? 'mobileReordering' : ''}`}
      role="group"
      aria-labelledby={`tool-${tool.id}-name`}
      aria-describedby={`tool-${tool.id}-params`}
    >
      <header className="toolHeader">
        <button 
          className="dragHandle drag-handle"
          type="button"
          aria-label={`Move ${displayName} tool`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Could implement keyboard-based repositioning here
            }
          }}
        >
          <div className="dragIcon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <h3 id={`tool-${tool.id}-name`} className="toolName">{displayName}</h3>
        <button 
          type="button"
          className="deleteBtn"
          onClick={() => onDelete(tool.id)}
          aria-label={`Delete ${displayName} tool`}
          title="Delete tool"
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>
      
      <div id={`tool-${tool.id}-params`} className="toolParams" role="group" aria-label="Tool parameters">
        {Object.entries(tool.params).map(([key, value]) => (
          <div key={key} className="paramRow">
            <label 
              className="paramLabel" 
              htmlFor={isEditing && editingParam === key ? `param-${tool.id}-${key}` : undefined}
            >
              {key}:
            </label>
            {isEditing && editingParam === key ? (
              <input
                id={`param-${tool.id}-${key}`}
                type="text"
                value={editParams[key] || ''}
                onChange={(e) => handleParamChange(key, e.target.value)}
                className="paramInput"
                aria-label={`Edit ${key} parameter`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveParams();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
              />
            ) : (
              <button 
                type="button"
                className="paramValue"
                onClick={() => startEditing(key)}
                onKeyDown={(e) => handleKeyPress(e, key)}
                aria-label={`${key}: ${value || 'empty'}. Press Enter or Space to edit`}
                title="Click to edit"
              >
                {value || '<empty>'}
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="editActions" role="group" aria-label="Edit actions">
          <button 
            type="button" 
            onClick={handleSaveParams} 
            className="saveBtn"
            aria-label="Save parameter changes"
          >
            Save
          </button>
          <button 
            type="button" 
            onClick={handleCancelEdit} 
            className="cancelBtn"
            aria-label="Cancel parameter changes"
          >
            Cancel
          </button>
        </div>
      )}
    </article>
  );
};