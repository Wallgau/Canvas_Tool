import React, { useEffect, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { SideMenuProps, SideMenuOption } from './SideMenu.types';
import Button from '../Button/Button';

// Types are now exported from src/types/components.ts

/**
 * Super simple SideMenu - removed all unnecessary complexity
 */
const SideMenu = <T,>({
  options,
  isVisible,
  onSelect,
  onClose,
  title = 'Select an option',
  position = 'left',
}: SideMenuProps<T>): React.JSX.Element | null => {
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  // Focus management when menu opens/closes
  useEffect(() => {
    if (isVisible) {
      // Focus the first option when menu opens
      setTimeout(() => {
        if (firstOptionRef.current) {
          firstOptionRef.current.focus();
        } else if (sideMenuRef.current) {
          sideMenuRef.current.focus();
        }
      }, 0);

      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when menu closes
      document.body.style.overflow = 'unset';
    }

    return (): void => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleSelect = (option: SideMenuOption<T>): void => {
    if (option.disabled) return;
    onSelect(option);
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-start p-4'
      onClick={onClose}
    >
      <div
        ref={sideMenuRef}
        className={`bg-white rounded-lg shadow-xl w-fit max-w-md mt-20 ${
          position === 'right' ? 'ml-auto' : 'mr-auto'
        }`}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role='dialog'
        aria-modal='true'
        aria-labelledby='side-menu-title'
        tabIndex={-1}
      >
        {/* Header */}
        <header className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h3
            id='side-menu-title'
            className='text-xl font-semibold text-gray-900'
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label='Close menu'
            className='text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
            title='Close'
          >
            <svg
              width='20'
              height='20'
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
        </header>

        {/* Options */}
        <div className='p-6'>
          {options.length === 0 ? (
            <p className='text-base text-gray-500 text-center py-6'>
              No options available
            </p>
          ) : (
            <div className='space-y-3'>
              {options.map((option: SideMenuOption<T>) => (
                <Button
                  key={option.id}
                  variant='ghost'
                  onClick={() => handleSelect(option)}
                  disabled={option.disabled}
                  className={`w-full text-left justify-start p-4 border border-gray-200 rounded-lg transition-all duration-200 ${
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed border-gray-100'
                      : option.isUsed || option.isActive
                        ? 'border-2 border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  aria-label={`Select ${option.title}`}
                  description={option.description || ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
