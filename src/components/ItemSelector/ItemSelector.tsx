import React from 'react';
import SideMenu from '../reusable/SideMenu/SideMenu';
import type { SideMenuOption } from '../reusable/SideMenu/SideMenu.types';
import type { ItemSelectorProps, SelectableItem } from './ItemSelector.types';

export const ItemSelector = <T extends SelectableItem>({
  isVisible,
  items,
  onSelect,
  onClose,
  title = 'Select an item',
  position = 'left',
}: ItemSelectorProps<T>): React.JSX.Element => {
  // Convert items to SideMenuOption format
  const menuOptions: SideMenuOption<T>[] = items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    value: item,
    disabled: item.disabled,
  }));

  const handleSelect = (option: SideMenuOption<T>): void => {
    onSelect(option.value);
    onClose();
  };

  return (
    <SideMenu
      options={menuOptions}
      isVisible={isVisible}
      onSelect={handleSelect}
      onClose={onClose}
      title={title}
      position={position}
    />
  );
};
