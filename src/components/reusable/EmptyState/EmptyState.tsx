import React from 'react';
import { Plus, Search } from 'lucide-react';
import Button from '../Button/Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className = '',
}): React.JSX.Element => {
  const defaultIcon = (
    <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
      <Search className='h-12 w-12 text-gray-400' />
    </div>
  );

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      role='status'
      aria-live='polite'
    >
      {icon || defaultIcon}

      <h3 className='mt-4 text-lg font-semibold text-gray-900'>{title}</h3>

      <p className='mt-2 text-sm text-gray-600 max-w-sm'>{description}</p>

      {actionText && onAction && (
        <div className='mt-6'>
          <Button
            onClick={onAction}
            description={actionText}
            className='inline-flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
