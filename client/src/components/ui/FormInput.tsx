import React from 'react';

// Define the Gold color as a constant for reusability and clarity
const GOLD_COLOR = '#D4AF37';

/**
 * Props for the FormInput component.
 * Extends standard HTML input attributes for flexibility.
 */
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The label text for the input field. */
  label: string;
  /** The unique ID for the input field, used to link the label. */
  id: string;
  /** An error message to display below the input. Triggers the error state styling. */
  error?: string;
  /** A boolean to indicate a successful validation state. */
  success?: boolean;
}

/**
 * A reusable Form Input component adhering to the ABFI platform design system.
 * It includes a label, the input field, and displays validation states (error/success).
 *
 * Design System Requirements Implemented:
 * - Label: black text, font-medium.
 * - Input: white background, gray-200 border, large size (py-3 px-4), gold focus ring (ring-[#D4AF37]).
 * - Validation: Error state uses red border/text; Success state uses gold border.
 * - Touch Target: Minimum height of 48px for large touch targets.
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  error,
  success,
  className,
  ...inputProps
}) => {
  // 1. Label Classes: black labels, font-medium
  const labelClasses = 'block text-black font-medium mb-1';

  // 2. Base Input Classes: white bg, gray-200 border, large size, gold focus ring, 48px min-height
  let inputClasses = `
    w-full
    bg-white
    border
    border-gray-200
    text-black
    py-3 px-4
    rounded-lg
    focus:outline-none
    focus:ring-2
    focus:ring-[${GOLD_COLOR}]
    focus:border-transparent
    transition duration-150 ease-in-out
    min-h-[48px]
    ${className || ''}
  `;

  // 3. Validation State Overrides
  let validationMessage = null;
  let validationClasses = '';

  if (error) {
    // Error State (Risk/Red)
    inputClasses = inputClasses.replace('border-gray-200', 'border-red-500');
    inputClasses = inputClasses.replace(`focus:ring-[${GOLD_COLOR}]`, 'focus:ring-red-500');
    validationMessage = <p className="mt-1 text-sm text-red-500">{error}</p>;
    validationClasses = 'text-red-500';
  } else if (success) {
    // Success State (Verified/Gold) - using border for subtlety
    inputClasses = inputClasses.replace('border-gray-200', `border-[${GOLD_COLOR}]`);
    validationClasses = `text-[${GOLD_COLOR}]`;
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className={`${labelClasses} ${validationClasses}`}>
        {label}
      </label>
      <input
        id={id}
        className={inputClasses.trim()}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {validationMessage}
    </div>
  );
};

export default FormInput;

// --- Example Usage (for demonstration, not part of the component) ---
/*
const ExampleForm = () => (
  <form className="p-8 max-w-md mx-auto bg-gray-50">
    <FormInput
      id="username"
      label="Username"
      type="text"
      placeholder="Enter your username"
    />
    <FormInput
      id="email"
      label="Email Address"
      type="email"
      placeholder="user@example.com"
      success
    />
    <FormInput
      id="password"
      label="Password"
      type="password"
      placeholder="••••••••"
      error="Password must be at least 8 characters long."
    />
    <button
      type="submit"
      className="w-full py-3 px-4 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-opacity-90 transition duration-150"
    >
      Submit Form
    </button>
  </form>
);
*/
