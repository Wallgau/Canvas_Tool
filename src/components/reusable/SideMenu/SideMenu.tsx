import React from 'react';
import type { SideMenuProps, SideMenuOption } from './SideMenu.types';
import Button from '../Button/Button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../ui/sheet';

// Types are now exported from src/types/components.ts

/**
 * SideMenu using shadcn Sheet component with smooth animations
 */
const SideMenu = <T,>({
  options,
  isVisible,
  onSelect,
  onClose,
  title = 'Select an option',
  position = 'left',
  'data-testid': dataTestId,
}: SideMenuProps<T>): React.JSX.Element | null => {
  const handleSelect = (option: SideMenuOption<T>): void => {
    if (option.disabled) return;
    onSelect(option);
  };

  return (
    <Sheet open={isVisible} onOpenChange={onClose}>
      <SheetContent
        side={position}
        className='w-[400px] sm:w-[540px]'
        data-testid={dataTestId}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Choose an option from the list below
          </SheetDescription>
        </SheetHeader>

        <div className='mt-6'>
          {options.length === 0 ? (
            <p className='text-base text-muted-foreground text-center py-6'>
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
                  className={`w-full text-left justify-start p-4 border border-border rounded-lg transition-all duration-200 ${
                    option.disabled
                      ? 'opacity-50 cursor-not-allowed border-muted'
                      : option.isUsed || option.isActive
                        ? 'border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20'
                        : 'hover:bg-accent hover:border-accent-foreground/20'
                  }`}
                  aria-label={`Select ${option.title}`}
                  description={option.title}
                  data-id={option.id || option.title}
                  data-testid={option.id}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
