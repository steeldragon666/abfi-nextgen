import React, { useState, useMemo } from 'react';

// --- Design System Constants ---
const COLOR_GOLD = '#D4AF37';
const COLOR_BLACK = '#000000';
const COLOR_WHITE = '#FFFFFF';
const BASE_TEXT_SIZE = 'text-[18px]'; // 18px base text

// --- Types ---
type UserRole = 'Admin' | 'Analyst' | 'Client';

interface MenuItem {
  id: string;
  label: string;
  icon: string; // Placeholder for icon name (e.g., 'Home', 'Users')
  path: string;
  roles: UserRole[];
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
  collapsible: boolean;
}

interface NavigationSidebarProps {
  currentPath: string;
  userRole: UserRole;
  menuData: MenuSection[];
}

// --- Mock Data (Replace with actual data source) ---
const mockUserRole: UserRole = 'Admin';
const mockCurrentPath = '/management/users';
const mockMenu: MenuSection[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    collapsible: false,
    items: [
      { id: 'overview', label: 'Overview', icon: '🏠', path: '/dashboard', roles: ['Admin', 'Analyst', 'Client'] },
      { id: 'metrics', label: 'Key Metrics', icon: '📊', path: '/metrics', roles: ['Admin', 'Analyst'] },
    ],
  },
  {
    id: 'management',
    title: 'Management',
    collapsible: true,
    items: [
      { id: 'users', label: 'User Management', icon: '👥', path: '/management/users', roles: ['Admin'] },
      { id: 'roles', label: 'Role Permissions', icon: '🔒', path: '/management/roles', roles: ['Admin'] },
      { id: 'clients', label: 'Client Accounts', icon: '💼', path: '/management/clients', roles: ['Admin', 'Analyst'] },
    ],
  },
  {
    id: 'reports',
    title: 'Financial Reports',
    collapsible: true,
    items: [
      { id: 'pnl', label: 'P&L Statement', icon: '📈', path: '/reports/pnl', roles: ['Analyst', 'Client'] },
      { id: 'balance', label: 'Balance Sheet', icon: '🧾', path: '/reports/balance', roles: ['Analyst'] },
    ],
  },
];

// --- Sub-Components ---

/**
 * Renders a single menu item.
 * Adheres to 48px min touch target (py-3 px-4 gives 48px height with 18px text).
 */
const SidebarItem: React.FC<{ item: MenuItem; isActive: boolean }> = ({ item, isActive }) => {
  const activeClasses = isActive
    ? `bg-[${COLOR_GOLD}] text-[${COLOR_BLACK}] font-semibold border-l-4 border-[${COLOR_GOLD}]`
    : `text-gray-400 hover:bg-gray-800 hover:text-[${COLOR_WHITE}]`;

  return (
    <a
      href={item.path}
      className={`flex items-center gap-3 ${BASE_TEXT_SIZE} font-medium py-3 px-4 rounded-lg transition-colors ${activeClasses}`}
      style={{ minHeight: '48px' }} // Large touch targets (48px min)
    >
      <span className="text-xl">{item.icon}</span> {/* Icon Placeholder */}
      <span className="truncate">{item.label}</span> {/* Plain English labels */}
    </a>
  );
};

/**
 * Renders a collapsible section of the sidebar.
 * Implements Progressive Disclosure.
 */
const SidebarSection: React.FC<{ section: MenuSection; currentPath: string; userRole: UserRole }> = ({
  section,
  currentPath,
  userRole,
}) => {
  const [isOpen, setIsOpen] = useState(() => {
    // Open section by default if any item inside is active
    return section.items.some(item => item.path === currentPath);
  });

  const visibleItems = useMemo(() => {
    return section.items.filter(item => item.roles.includes(userRole));
  }, [section.items, userRole]);

  if (visibleItems.length === 0) {
    return null;
  }

  const isSectionActive = visibleItems.some(item => item.path === currentPath);

  const toggleIcon = isOpen ? '▼' : '▶'; // Placeholder for chevron icon

  return (
    <div className="space-y-1">
      {section.collapsible ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex justify-between items-center w-full py-2 px-4 ${BASE_TEXT_SIZE} font-semibold text-gray-300 hover:text-[${COLOR_WHITE}] transition-colors`}
          style={{ minHeight: '48px' }} // Large touch targets
        >
          <span className="truncate">{section.title.toUpperCase()}</span>
          <span className={`text-sm transition-transform ${isSectionActive ? `text-[${COLOR_GOLD}]` : ''}`}>{toggleIcon}</span>
        </button>
      ) : (
        <div className={`py-2 px-4 ${BASE_TEXT_SIZE} font-semibold text-gray-300`}>
          {section.title.toUpperCase()}
        </div>
      )}

      <div className={`overflow-hidden transition-all duration-300 ${isOpen || !section.collapsible ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="space-y-1 pl-2">
          {visibleItems.map(item => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={item.path === currentPath}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the user role indicator at the top of the sidebar.
 */
const SidebarHeader: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const roleIcon = userRole === 'Admin' ? '👑' : userRole === 'Analyst' ? '🔬' : '👤'; // Role indicator icons

  return (
    <div className={`p-4 border-b border-gray-700 mb-4 flex items-center gap-3`} style={{ minHeight: '48px' }}>
      <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-[${COLOR_GOLD}] text-[${COLOR_BLACK}] font-semibold`}>
        {roleIcon}
      </div>
      <div className="flex flex-col">
        <span className={`text-sm font-medium text-gray-400`}>Current Role</span>
        <span className={`${BASE_TEXT_SIZE} font-semibold text-[${COLOR_WHITE}]`}>{userRole}</span>
      </div>
    </div>
  );
};

/**
 * Main Navigation Sidebar Component.
 */
const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ currentPath, userRole, menuData }) => {
  return (
    <div
      className={`flex flex-col h-full w-64 bg-[${COLOR_BLACK}] text-[${COLOR_WHITE}] shadow-2xl`}
      style={{ width: '256px' }} // Standard sidebar width
    >
      {/* Role Indicator */}
      <SidebarHeader userRole={userRole} />

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {menuData.map(section => (
          <SidebarSection
            key={section.id}
            section={section}
            currentPath={currentPath}
            userRole={userRole}
          />
        ))}
      </nav>

      {/* Optional: Footer/Logout Section */}
      <div className="p-4 border-t border-gray-700">
        <button
          className={`w-full py-3 px-4 ${BASE_TEXT_SIZE} font-semibold text-center rounded-lg transition-colors bg-[${COLOR_GOLD}] text-[${COLOR_BLACK}] hover:opacity-90`}
          style={{ minHeight: '48px' }} // Primary CTA (Logout)
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// --- Export and Example Usage ---

export default NavigationSidebar;

// Example of how to use the component (for demonstration/testing)
export const ExampleSidebar = () => (
  <div className="h-screen flex">
    <NavigationSidebar
      currentPath={mockCurrentPath}
      userRole={mockUserRole}
      menuData={mockMenu}
    />
    <main className="flex-1 p-8 bg-gray-100">
      <h1 className="text-3xl font-bold">Main Content Area</h1>
      <p className="mt-4">Active path: {mockCurrentPath}</p>
      <p>User Role: {mockUserRole}</p>
    </main>
  </div>
);
