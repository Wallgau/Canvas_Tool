export interface CardAction {
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
}

export interface CardProps {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
  actions?: CardAction[];
  onUpdate?: (updates: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
  className?: string;
  children?: React.ReactNode;
}
