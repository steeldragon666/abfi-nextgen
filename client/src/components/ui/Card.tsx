import React from 'react';

// Define the props for the Card component
interface CardProps {
  children: React.ReactNode;
  featured?: boolean; // Indicates if the card is a featured item
  className?: string; // Allows for custom classes to be passed
}

/**
 * A reusable Card component implementing ABFI platform design system specifications.
 * 
 * Design Specs:
 * - White background (bg-white)
 * - Gray-200 border (border border-gray-200)
 * - 12px border-radius (rounded-xl)
 * - Shadow-sm (shadow-sm)
 * - Hover shadow-md (hover:shadow-md)
 * - Gold border for featured items (border-2 border-[#D4AF37])
 */
const Card: React.FC<CardProps> = ({ children, featured = false, className = '' }) => {
  // Base classes for the card: white background, gray-200 border, 12px border-radius, shadow-sm, hover shadow-md
  // Added p-6 (24px padding) for standard card content spacing, as per the 4/8/12/16/24/32/40px scale.
  const baseClasses = 'p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow';

  // Featured classes: gold border. Using border-2 for emphasis and the arbitrary value for the gold color (#D4AF37).
  // The base border-gray-200 is overridden by the featured border color.
  const featuredClasses = featured
    ? 'border-2 border-[#D4AF37]' // Gold border for featured items
    : '';

  // Combine all classes
  const combinedClasses = `${baseClasses} ${featuredClasses} ${className}`;

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default Card;
