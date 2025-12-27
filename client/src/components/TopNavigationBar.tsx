import React, { useState } from 'react';

// --- Icons (Simple SVG for self-containment) ---

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// --- Component Parts ---

const SearchInput: React.FC = () => (
  <div className="relative flex items-center w-full max-w-md">
    <SearchIcon className="absolute left-4 text-gray-500 w-5 h-5" />
    <input
      type="text"
      placeholder="Search for assets, reports, or users..."
      className="w-full pl-12 pr-4 py-3 text-lg font-medium border border-gray-300 rounded-lg bg-white
                 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent
                 transition duration-150 ease-in-out"
      style={{ minHeight: '48px' }} // Large touch target (48px min)
    />
  </div>
);

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isPrimary?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, onClick, isPrimary = false }) => {
  const baseClasses = "flex items-center justify-center text-lg font-semibold rounded-lg transition duration-150 ease-in-out min-w-[48px] h-12 px-4";

  const primaryClasses = "bg-[#D4AF37] text-black hover:bg-opacity-90 shadow-md"; // Primary (Gold) CTA
  const ghostClasses = "bg-transparent text-black hover:bg-gray-100"; // Ghost button

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isPrimary ? primaryClasses : ghostClasses}`}
    >
      {children}
    </button>
  );
};

const NotificationBell: React.FC<{ count: number }> = ({ count }) => (
  <div className="relative min-w-[48px] h-12 flex items-center justify-center">
    <ActionButton onClick={() => console.log('Notifications clicked')}>
      <BellIcon className="w-6 h-6" />
    </ActionButton>
    {count > 0 && (
      <span
        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-xs font-medium text-black rounded-full"
        style={{ backgroundColor: '#D4AF37' }} // Status: Verified (gold bg)
      >
        {count}
      </span>
    )}
  </div>
);

const UserAvatarDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <ActionButton onClick={() => setIsOpen(!isOpen)} isPrimary={false}>
        <UserIcon className="w-6 h-6 mr-2" />
        <span className="hidden sm:inline">John Doe</span>
        <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </ActionButton>

      {/* Dropdown Menu (Progressive Disclosure) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
          <a href="#" className="block px-4 py-3 text-lg font-medium text-black hover:bg-gray-100 rounded-t-lg">Profile</a>
          <a href="#" className="block px-4 py-3 text-lg font-medium text-black hover:bg-gray-100">Settings</a>
          <a href="#" className="block px-4 py-3 text-lg font-medium text-black hover:bg-gray-100 rounded-b-lg">Sign Out</a>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

const TopNavigationBar: React.FC = () => {
  // Placeholder for dynamic data
  const notificationCount = 3;

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-6 py-3 flex items-center justify-between space-x-8"> {/* Spacing: 24px (px-6) and 32px (space-x-8) */}
        
        {/* Logo/Platform Name Placeholder */}
        <div className="text-2xl font-semibold text-black">
          ABFI Platform
        </div>

        {/* Search Input (Center) */}
        <div className="flex-grow flex justify-center">
          <SearchInput />
        </div>

        {/* Action Items (Right) */}
        <div className="flex items-center space-x-4"> {/* Spacing: 16px (space-x-4) */}
          
          {/* Quick Actions (Primary CTA) */}
          <ActionButton onClick={() => console.log('Quick Action clicked')} isPrimary={true}>
            <span className="hidden sm:inline">Quick Action</span>
            <span className="sm:hidden">+</span>
          </ActionButton>

          {/* Notifications Icon with Badge */}
          <NotificationBell count={notificationCount} />

          {/* User Avatar Dropdown */}
          <UserAvatarDropdown />
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar;
