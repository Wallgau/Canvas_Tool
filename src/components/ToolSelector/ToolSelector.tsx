/**
 * ToolSelector - Specific implementation for tool selection
 * Uses the generic ItemSelector component
 */

import React from 'react';
import { ItemSelector } from '../ItemSelector/ItemSelector';
import type { ToolTemplate } from '../../../types';

export interface ToolSelectorProps {
  isVisible: boolean;
  availableTools: ToolTemplate[];
  onSelectTool: (tool: ToolTemplate) => void;
  onClose: () => void;
  title?: string;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  isVisible,
  availableTools,
  onSelectTool,
  onClose,
  title = 'Select a tool to add',
}): React.JSX.Element => {
  // Convert ToolTemplate to SelectableItem format
  const selectableTools = availableTools.map(tool => ({
    id: tool.name,
    title: tool.displayName,
    description: tool.description,
  }));

  const handleSelect = (item: {
    id: string;
    title: string;
    description?: string;
  }): void => {
    const tool = availableTools.find(t => t.name === item.id);
    if (tool) {
      onSelectTool(tool);
    }
  };

  return (
    <ItemSelector
      isVisible={isVisible}
      items={selectableTools}
      onSelect={handleSelect}
      onClose={onClose}
      title={title}
      position='left'
      emptyMessage='No tools available'
    />
  );
};
