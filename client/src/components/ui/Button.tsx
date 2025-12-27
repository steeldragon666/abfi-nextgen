import React, { ButtonHTMLAttributes, ReactNode } from 'react';

// Define the button variants based on the design system
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

// Extend standard button props and add the variant prop
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Common styles applied to all buttons
  const baseStyles =
    'transition-colors duration-200 font-semibold px-6 py-3 rounded-xl ' +
    'min-h-[48px] min-w-[48px] text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  let variantStyles = '';

  switch (variant) {
    case 'primary':
      // Primary (bg-[#D4AF37] text-black)
      variantStyles = 'bg-[#D4AF37] text-black hover:bg-opacity-90';
      break;
    case 'secondary':
      // Secondary (bg-white border-black)
      variantStyles =
        'bg-white text-black border border-black hover:bg-gray-100';
      break;
    case 'ghost':
      // Ghost (transparent, hover gray-100)
      variantStyles = 'bg-transparent text-black hover:bg-gray-100 border border-transparent';
      break;
    default:
      variantStyles = 'bg-[#D4AF37] text-black hover:bg-opacity-90';
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
