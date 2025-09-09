export interface ToolbarAction {
  id: string;
  label: string;
  variant:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  onClick: () => void;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: string;
}

export interface ToolbarProps {
  title?: string;
  actions: ToolbarAction[];
  className?: string;
}
