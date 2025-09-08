import React, { memo, forwardRef } from 'react';
import type { ButtonProps } from './Button.types';

// Types are now exported from src/types/components.ts

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = 'primary',
        size = 'md',
        isLoading = false,
        fullWidth = false,
        children,
        className = '',
        disabled,
        ...props
      },
      ref
    ): React.JSX.Element => {
      const getVariantClasses = () => {
        switch (variant) {
          case 'primary':
            return 'btn-primary';
          case 'secondary':
            return 'btn-secondary';
          case 'destructive':
            return 'btn-destructive';
          case 'outline':
            return 'btn-outline';
          case 'ghost':
            return 'btn-ghost';
          default:
            return 'btn-primary';
        }
      };

      const getSizeClasses = () => {
        switch (size) {
          case 'sm':
            return 'px-3 py-1.5 text-xs';
          case 'lg':
            return 'px-6 py-3 text-base';
          default:
            return 'px-4 py-2 text-sm';
        }
      };

      const buttonClasses = [
        getVariantClasses(),
        getSizeClasses(),
        fullWidth && 'w-full',
        isLoading && 'opacity-50 cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ');

      const isDisabled = disabled || isLoading;

      return (
        <button
          ref={ref}
          className={buttonClasses}
          disabled={isDisabled}
          aria-label={isLoading ? 'Loading...' : undefined}
          {...props}
        >
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden='true'>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}

          <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</span>
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

export default Button;
