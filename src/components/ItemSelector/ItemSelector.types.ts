export interface SelectableItem {
  id: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface ItemSelectorProps<T extends SelectableItem> {
  isVisible: boolean;
  items: T[];
  onSelect: (item: T) => void;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right';
  emptyMessage?: string;
}
