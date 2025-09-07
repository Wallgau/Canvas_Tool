import type { KeyboardEvent, MouseEvent } from 'react';
import type { SideMenuProps, SideMenuOption } from './SideMenu.types';
import { Button } from '../Button/Button';
// CSS inlined in index.html for optimal performance

// Re-export types for external use
export type { SideMenuOption, SideMenuProps };

/**
 * Super simple SideMenu - removed all unnecessary complexity
 */
export const SideMenu = <T,>({
  options,
  isVisible,
  onSelect,
  onClose,
  title = "Select an option",
  position = 'left'
}: SideMenuProps<T>) => {
  
  if (!isVisible) return null;

  const handleSelect = (option: SideMenuOption<T>) => {
    if (option.disabled) return;
    onSelect(option);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const current = e.currentTarget;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        (current.nextElementSibling as HTMLElement)?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        (current.previousElementSibling as HTMLElement)?.focus();
        break;
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div 
        className={`sideMenu ${position}`}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="menu"
        aria-label={title}
      >
        {/* Header */}
        <header className="header">
          <h3 className="title">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close menu"
            className="closeButton"
          >
            ×
          </Button>
        </header>
        
        {/* Options */}
        <div className="content">
          {options.length === 0 ? (
            <p className="emptyState">No options available</p>
          ) : (
            <div className="optionsList">
              {options.map((option) => (
                <Button
                  key={option.id}
                  variant="ghost"
                  onClick={() => handleSelect(option)}
                  onKeyDown={handleOptionKeyDown}
                  disabled={option.disabled}
                  className={`option ${option.disabled ? 'disabled' : ''}`}
                  aria-label={`Select ${option.title}`}
                >
                  <div className="optionContent">
                    <div className="optionTitle">{option.title}</div>
                    {option.description && (
                      <div className="optionDescription">{option.description}</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
