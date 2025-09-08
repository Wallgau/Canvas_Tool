import React, { memo, forwardRef } from 'react';
import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';

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
      const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isLoading && styles.loading,
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
          {...props}
        >
          {isLoading && (
            <span className='spinner' aria-hidden='true'>
              <span className='spinnerIcon'></span>
            </span>
          )}

          <span className='content'>{children}</span>
        </button>
      );
    }
  )
);

Button.displayName = 'Button';

export default Button;
