import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
}
