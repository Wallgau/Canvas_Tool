import { memo, forwardRef } from 'react';
import type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
// CSS inlined in index.html for optimal performance

// Re-export types for external use
export type { ButtonVariant, ButtonSize, ButtonProps };

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const buttonClasses = [
    'button',
    variant,
    size,
    fullWidth && 'fullWidth',
    isLoading && 'loading',
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <span className="spinner" aria-hidden="true">
          <span className="spinnerIcon"></span>
        </span>
      )}
      
      <span className="content">
        {children}
      </span>
    </button>
  );
}));

Button.displayName = 'Button';
