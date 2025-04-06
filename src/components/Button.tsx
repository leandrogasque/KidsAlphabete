import React, { ButtonHTMLAttributes } from 'react';
import '../styles/Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  secondary?: boolean;
  small?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  primary = false,
  secondary = false,
  small = false,
  fullWidth = false,
  children,
  className,
  ...props
}) => {
  const getButtonClasses = () => {
    let classes = 'custom-button';
    
    if (primary) classes += ' primary';
    if (secondary) classes += ' secondary';
    if (small) classes += ' small';
    if (fullWidth) classes += ' full-width';
    if (props.disabled) classes += ' disabled';
    if (className) classes += ` ${className}`;
    
    return classes;
  };

  return (
    <button className={getButtonClasses()} {...props}>
      {children}
    </button>
  );
};

export default Button; 