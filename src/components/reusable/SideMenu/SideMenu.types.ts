export interface SideMenuOption<T = unknown> {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  value: T;
  disabled?: boolean;
  isUsed?: boolean;
  isActive?: boolean;
}

export interface SideMenuProps<T = unknown> {
  options: SideMenuOption<T>[];
  isVisible: boolean;
  onSelect: (option: SideMenuOption<T>) => void;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right';
  'data-testid'?: string;
}

export type SideMenuPosition = 'left' | 'right';
