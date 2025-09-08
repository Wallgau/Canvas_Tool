/**
 * SideMenu component types and interfaces
 */

export interface SideMenuOption<T = unknown> {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  value: T;
  disabled?: boolean;
}

export interface SideMenuProps<T = unknown> {
  options: SideMenuOption<T>[];
  isVisible: boolean;
  onSelect: (option: SideMenuOption<T>) => void;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right';
}

export type SideMenuPosition = 'left' | 'right';
