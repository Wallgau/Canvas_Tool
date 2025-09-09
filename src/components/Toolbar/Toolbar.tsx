/**
 * Toolbar - Reusable UI component for action toolbars
 * Pure UI component with no business logic
 */

import React from 'react';
import Button from '../reusable/Button/Button';
import type { ToolbarProps } from './Toolbar.types';

export const Toolbar: React.FC<ToolbarProps> = ({
  title = 'Tool Canvas',
  actions,
  className = '',
}): React.JSX.Element => {
  return (
    <header
      className={`flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 ${className}`}
      role='banner'
    >
      <h1 className='text-lg font-semibold text-white'>{title}</h1>
      <div
        className='flex items-center gap-2'
        role='toolbar'
        aria-label='Toolbar actions'
      >
        {actions.map(action => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.onClick}
            disabled={action.disabled}
            aria-label={action['aria-label']}
            aria-expanded={action['aria-expanded']}
            aria-haspopup={action['aria-haspopup']}
            description={action.label}
          />
        ))}
      </div>
    </header>
  );
};
