import React from 'react';
import type { InputProps } from './Input.types';

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  className = '',
  placeholder,
  autoFocus = false,
  disabled = false,
  id,
  ...props
}): React.JSX.Element => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    onFocus={onFocus}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    autoFocus={autoFocus}
    disabled={disabled}
    className={`w-full px-3 text-base border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export default Input;
