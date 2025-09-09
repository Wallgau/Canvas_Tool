import * as React from 'react';

interface ButtonProps {
  onClick?: () => void;
  description: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link';
  autoFocus?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  description,
  type = 'button',
  className,
  variant = 'primary',
  autoFocus = false,
  disabled = false,
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500';
      case 'destructive':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'outline':
        return 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500';
      case 'ghost':
        return 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      case 'link':
        return 'text-blue-600 underline hover:text-blue-800 focus:ring-blue-500';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  const baseClasses =
    'px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors';
  const variantClasses = getVariantClasses();
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className || ''}`}
      autoFocus={autoFocus}
      disabled={disabled}
    >
      {description}
    </button>
  );
};

export default Button;
