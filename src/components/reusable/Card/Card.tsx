import React, { useEffect, useRef } from 'react';
import Button from '../Button/Button';
import type { CardProps } from './Card.types';

export const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  content,
  actions = [],
  onDelete,
  isNew = false,
  className = '',
  children,
}): React.JSX.Element => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Focus the card when it's newly added
  useEffect(() => {
    if (isNew && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.focus();
      }, 100);
    }
  }, [isNew]);

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Delete' && onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role='article'
      aria-label={`${title} card`}
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1 min-w-0'>
          <h3 className='text-lg font-semibold text-gray-900 truncate'>
            {title}
          </h3>
          {description && (
            <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
              {description}
            </p>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className='ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0'
            aria-label={`Remove ${title}`}
            title='Remove'
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      {content && <div className='mb-4 text-gray-700'>{content}</div>}

      {children && <div className='mb-4'>{children}</div>}

      {/* Actions */}
      {actions.length > 0 && (
        <div className='flex gap-3 pt-4 border-t border-gray-100'>
          {actions.map(action => (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={action.onClick}
              disabled={action.disabled}
              description={action.label}
              aria-label={action['aria-label']}
            />
          ))}
        </div>
      )}
    </div>
  );
};
