/**
 * ToolSelector component - uses our SideMenu component
 * Handles tool selection from available tools
 */

// ToolSelector component - pure UI
import React from 'react';
import SideMenu from '../../../shared/SideMenu/SideMenu';
import type { SideMenuOption } from '../../../shared/SideMenu/SideMenu.types';
import type { ToolTemplate } from '../../../../types';
import type { ToolSelectorProps } from '../../ToolCanvasV2.types';

export const ToolSelector = ({
  isVisible,
  availableTools,
  onSelectTool,
  onClose,
}: ToolSelectorProps): React.JSX.Element => {
  // Convert ToolTemplate to SideMenuOption
  const toolOptions: SideMenuOption<ToolTemplate>[] = availableTools.map(
    tool => ({
      id: tool.name,
      title: tool.displayName,
      description: tool.description,
      value: tool,
    })
  );

  const handleSelect = (option: SideMenuOption<ToolTemplate>): void => {
    onSelectTool(option.value);
    onClose();
  };

  return (
    <SideMenu
      options={toolOptions}
      isVisible={isVisible}
      onSelect={handleSelect}
      onClose={onClose}
      title='Select a tool to add'
      position='left'
    />
  );
};
