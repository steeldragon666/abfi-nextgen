/**
 * TopNavigation - Horizontal navigation bar with ABFI branding
 * Based on ABFI design system navigation patterns
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { useIsMobile } from '@/hooks/useMobile';
import { getLoginUrl } from '@/const';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Compass,
  Leaf,
  Factory,
  TrendingUp,
  Search,
  ShoppingCart,
  FileText,
  Eye,
  BarChart3,
  Clock,
  Map,
  Globe,
  ShieldCheck,
  Truck,
  Calculator,
  BadgeCheck,
  TreeDeciduous,
  Users,
  Shield,
  Database,
  PieChart,
  LogOut,
  LogIn,
  Menu,
  ChevronDown,
  X,
  Bell,
} from 'lucide-react';

// Menu structure grouped by category
const menuGroups = {
  main: [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
  ],
  marketplace: {
    label: 'Marketplace',
    items: [
      { icon: Search, label: 'Browse Feedstocks', path: '/browse' },
      { icon: ShoppingCart, label: 'Futures Marketplace', path: '/futures' },
      { icon: FileText, label: 'Demand Signals', path: '/demand-signals' },
    ],
  },
  intelligence: {
    label: 'Intelligence',
    items: [
      { icon: Globe, label: 'Market Intelligence', path: '/market-intelligence' },
      { icon: Shield, label: 'Bankability Ratings', path: '/ratings' },
      { icon: Eye, label: 'Stealth Discovery', path: '/stealth-discovery' },
      { icon: TrendingUp, label: 'Lending Sentiment', path: '/lending-sentiment' },
      { icon: BarChart3, label: 'Feedstock Prices', path: '/feedstock-prices' },
      { icon: Clock, label: 'Policy & Carbon', path: '/policy-carbon' },
      { icon: Map, label: 'Australian Data', path: '/australian-data' },
    ],
  },
  platform: {
    label: 'Platform',
    items: [
      { icon: ShieldCheck, label: 'Evidence Vault', path: '/evidence-vault' },
      { icon: Truck, label: 'Supply Chain', path: '/supply-chain' },
      { icon: Calculator, label: 'Emissions', path: '/emissions' },
      { icon: BadgeCheck, label: 'Credentials', path: '/credentials' },
    ],
  },
  dashboards: {
    label: 'Dashboards',
    items: [
      { icon: Leaf, label: 'Grower Dashboard', path: '/grower/dashboard' },
      { icon: Factory, label: 'Developer Dashboard', path: '/developer/dashboard' },
      { icon: TrendingUp, label: 'Finance Dashboard', path: '/finance/dashboard' },
    ],
  },
};

const accountMenuItems = [
  { icon: TreeDeciduous, label: 'My Futures', path: '/supplier/futures' },
  { icon: FileText, label: 'My EOIs', path: '/buyer/eois' },
];

const adminMenuItems = [
  { icon: Shield, label: 'Assessor Workflow', path: '/admin/assessor-workflow' },
  { icon: Database, label: 'RSIE Dashboard', path: '/admin/rsie' },
  { icon: Clock, label: 'Monitoring Jobs', path: '/admin/monitoring-jobs' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: PieChart, label: 'Admin Dashboard', path: '/admin' },
];

interface TopNavigationProps {
  className?: string;
}

export function TopNavigation({ className }: TopNavigationProps) {
  const { user, logout, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location === path || location.startsWith(path + '/');

  const NavDropdown = ({
    label,
    items,
  }: {
    label: string;
    items: Array<{ icon: any; label: string; path: string }>;
  }) => {
    const hasActiveItem = items.some((item) => isActive(item.path));

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              'hover:bg-gray-100',
              hasActiveItem
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-gray-700'
            )}
          >
            {label}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-white border border-gray-200 shadow-lg">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={cn(
                'cursor-pointer',
                isActive(item.path) && 'bg-[#D4AF37]/10 text-[#D4AF37]'
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm',
        className
      )}
    >
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Logo & Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => setLocation('/')}
        >
          <div className="h-8 w-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
            <Leaf className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-gray-900">
              ABFI
            </span>
            {!isMobile && (
              <span className="text-[10px] text-gray-500 -mt-0.5">
                Biofuels Intelligence
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-1 ml-8">
            {/* Main items */}
            {menuGroups.main.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  'hover:bg-gray-100',
                  isActive(item.path)
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                    : 'text-gray-700'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}

            {/* Dropdown menus */}
            <NavDropdown
              label={menuGroups.marketplace.label}
              items={menuGroups.marketplace.items}
            />
            <NavDropdown
              label={menuGroups.intelligence.label}
              items={menuGroups.intelligence.items}
            />
            <NavDropdown
              label={menuGroups.platform.label}
              items={menuGroups.platform.items}
            />
            <NavDropdown
              label={menuGroups.dashboards.label}
              items={menuGroups.dashboards.items}
            />

            {/* Admin menu for admin users */}
            {user?.role === 'admin' && (
              <NavDropdown label="Admin" items={adminMenuItems} />
            )}
          </nav>
        )}

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Notifications (placeholder) */}
          {!isMobile && user && (
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4 text-gray-600" />
            </Button>
          )}

          {/* User menu / Login */}
          {loading ? (
            <div className="h-9 w-9 animate-pulse bg-gray-200 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-2 transition-colors">
                  <Avatar className="h-8 w-8 border border-gray-200 bg-[#D4AF37]/10">
                    <AvatarFallback className="text-xs font-bold text-[#D4AF37] bg-transparent">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!isMobile && (
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {accountMenuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => setLocation(item.path)}
                    className="cursor-pointer"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              className="bg-[#D4AF37] hover:bg-[#B8962F] text-white font-medium"
              size="sm"
            >
              <LogIn className="h-4 w-4 mr-1.5" />
              Sign In
            </Button>
          )}

          {/* Mobile menu toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobile && mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          {/* Main items */}
          {menuGroups.main.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setLocation(item.path);
                setMobileMenuOpen(false);
              }}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md',
                isActive(item.path)
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}

          {/* Marketplace */}
          <div className="pt-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {menuGroups.marketplace.label}
            </p>
            {menuGroups.marketplace.items.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md',
                  isActive(item.path)
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Intelligence */}
          <div className="pt-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {menuGroups.intelligence.label}
            </p>
            {menuGroups.intelligence.items.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md',
                  isActive(item.path)
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Platform */}
          <div className="pt-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {menuGroups.platform.label}
            </p>
            {menuGroups.platform.items.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md',
                  isActive(item.path)
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Dashboards */}
          <div className="pt-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {menuGroups.dashboards.label}
            </p>
            {menuGroups.dashboards.items.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md',
                  isActive(item.path)
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default TopNavigation;
