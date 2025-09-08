import React, { useEffect, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { SideMenuProps, SideMenuOption } from './SideMenu.types';
import Button from '../Button/Button';
import styles from './SideMenu.module.css';

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

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    const current = e.currentTarget;
    const optionsList = current.closest(`.${styles.optionsList}`);
    const allOptions = optionsList?.querySelectorAll(
      'button:not([disabled])'
    ) as NodeListOf<HTMLButtonElement>;
    const currentIndex = Array.from(allOptions).indexOf(current);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % allOptions.length;
        allOptions[nextIndex]?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex =
          currentIndex === 0 ? allOptions.length - 1 : currentIndex - 1;
        allOptions[prevIndex]?.focus();
        break;
      }
      case 'Home':
        e.preventDefault();
        allOptions[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        allOptions[allOptions.length - 1]?.focus();
        break;
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={sideMenuRef}
        className={`${styles.sideMenu} ${styles[position]}`}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role='dialog'
        aria-modal='true'
        aria-labelledby='side-menu-title'
        tabIndex={-1}
      >
        {/* Header */}
        <header className={styles.header}>
          <h3 id='side-menu-title' className={styles.title}>
            {title}
          </h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            aria-label='Close menu'
            className={styles.closeButton}
          >
            ×
          </Button>
        </header>

        {/* Options */}
        <div className={styles.content}>
          {options.length === 0 ? (
            <p className={styles.emptyState}>No options available</p>
          ) : (
            <div className={styles.optionsList}>
              {options.map((option: SideMenuOption<T>, index: number) => (
                <Button
                  key={option.id}
                  ref={index === 0 ? firstOptionRef : undefined}
                  variant='ghost'
                  onClick={() => handleSelect(option)}
                  onKeyDown={handleOptionKeyDown}
                  disabled={option.disabled}
                  className={`${styles.option} ${option.disabled ? styles.disabled : ''}`}
                  aria-label={`Select ${option.title}`}
                >
                  <div className={styles.optionContent}>
                    <div className={styles.optionTitle}>{option.title}</div>
                    {option.description && (
                      <div className={styles.optionDescription}>
                        {option.description}
                      </div>
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

export default SideMenu;
