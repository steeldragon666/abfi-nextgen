import React from 'react';

// Placeholder for an illustration/icon
// Using a simple plus-circle icon as a generic "create" or "add" action illustration
const PlaceholderIllustration = () => (
  <svg
    className="w-24 h-24 text-gray-300 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5} // Using 1.5 for a slightly bolder look
      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

interface EmptyStateProps {
  title: string;
  message: string;
  ctaText: string;
  onCtaClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, ctaText, onCtaClick }) => {
  // Base text size is 18px. Tailwind's default text-lg is 18px (1.125rem) or text-xl is 20px.
  // We'll use a custom size for precision or text-lg for closest standard. Let's use text-[18px] for strict compliance.
  const baseTextSize = 'text-[18px]';

  return (
    <div className="text-center p-10 sm:p-16 border border-gray-200 rounded-xl bg-white shadow-sm">
      {/* Illustration - Spacing 32px (p-8) below */}
      <div className="mb-8">
        <PlaceholderIllustration />
      </div>

      {/* Heading - Black text, font-semibold, Spacing 16px (mb-4) below */}
      <h3 className={`text-black ${baseTextSize} font-semibold mb-4`}>
        {title}
      </h3>

      {/* Body Text - Gray text, 18px base text, Spacing 24px (mb-6) below */}
      <p className={`text-gray-600 ${baseTextSize} mb-6 max-w-md mx-auto`}>
        {message}
      </p>

      {/* CTA Button - Gold primary button, Large touch target (min 48px) */}
      <button
        type="button"
        onClick={onCtaClick}
        // Primary Button: bg-[#D4AF37] text-black, font-semibold
        // Large touch targets (48px min): py-3 px-6 gives a height of 48px+
        // Spacing: 8px border radius (rounded-lg)
        className="inline-flex items-center px-6 py-3 border border-transparent text-black text-lg font-semibold rounded-lg shadow-sm bg-[#D4AF37] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
      >
        {ctaText}
      </button>
    </div>
  );
};

// Example usage with encouraging message
const ExampleEmptyState = () => (
  <EmptyState
    title="You're all set to begin!"
    message="It looks like you haven't created any assets yet. Start by creating your first one to unlock the full potential of the ABFI platform. We're here to help you succeed."
    ctaText="Create First Asset"
    onCtaClick={() => console.log('CTA Clicked')}
  />
);

export default EmptyState;
export { ExampleEmptyState };
