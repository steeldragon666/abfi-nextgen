import React from 'react';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

// --- Design System Constants ---
// Colors: Black (#000000), White (#FFFFFF), Gold (#D4AF37)
const COLOR_GOLD = '#D4AF37';
const COLOR_BLACK = '#000000';

// --- Types ---

interface StatTileProps {
  label: string;
  value: string;
  helperText: string;
  delta: number; // Percentage change, e.g., 5.2 for +5.2%
  actionLink: {
    text: string;
    href: string;
  };
}

interface StatsGridProps {
  stats: StatTileProps[];
}

// --- Sub-Components ---

const DeltaIndicator: React.FC<{ delta: number }> = ({ delta }) => {
  const isPositive = delta > 0;
  const isNegative = delta < 0;
  const deltaValue = Math.abs(delta).toFixed(1);

  let icon = null;
  let textColor = 'text-black'; // Default to black

  if (isPositive) {
    icon = <ArrowUp className="w-4 h-4" />;
    textColor = `text-[${COLOR_GOLD}]`; // Gold for positive status
  } else if (isNegative) {
    icon = <ArrowDown className="w-4 h-4" />;
    textColor = 'text-black'; // Black for negative status (relying on arrow for indication)
  } else {
    return <span className="text-sm text-black">No change</span>;
  }

  return (
    <div className={`flex items-center space-x-1 text-sm font-medium ${textColor}`}>
      {icon}
      <span>{deltaValue}%</span>
    </div>
  );
};

const StatTile: React.FC<StatTileProps> = ({ label, value, helperText, delta, actionLink }) => {
  // Card styling: White background, gray-200 border, shadow-sm, hover:shadow-md, border-radius: 12px
  return (
    <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Label and Delta */}
      <div className="flex justify-between items-start mb-2">
        {/* Label: font-medium */}
        <h3 className="text-lg font-medium text-black">{label}</h3>
        <DeltaIndicator delta={delta} />
      </div>

      {/* Large Value */}
      {/* Typography: Large values (text-5xl) */}
      <p className="text-5xl font-semibold text-black mb-1">{value}</p>

      {/* Helper Text */}
      {/* Typography: 18px base text (text-lg) */}
      <p className="text-lg text-gray-500 mb-6">{helperText}</p>

      {/* Action Link (Ghost Button style) */}
      {/* Large touch targets (48px min) - using padding to increase touch area */}
      <a
        href={actionLink.href}
        className="flex items-center justify-center h-12 px-4 text-black text-lg font-semibold rounded-lg transition-colors hover:bg-gray-100"
        style={{ minWidth: '48px', minHeight: '48px' }}
      >
        <span>{actionLink.text}</span>
        <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </div>
  );
};

// --- Main Component ---

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  // FIGMA Principle: Max 3 metrics visible at once
  const displayedStats = stats.slice(0, 3);

  // Spacing: 24px (p-6) and 32px (gap-8) scale used
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {displayedStats.map((stat, index) => (
        <StatTile key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;

// --- Example Usage (for testing/demonstration) ---
/*
const exampleStats: StatTileProps[] = [
  {
    label: 'Total AUM',
    value: '$12.4M',
    helperText: 'Assets Under Management as of today',
    delta: 5.2,
    actionLink: { text: 'View Portfolio', href: '/portfolio' },
  },
  {
    label: 'Active Clients',
    value: '87',
    helperText: 'Clients with active investment accounts',
    delta: -1.1,
    actionLink: { text: 'Manage Clients', href: '/clients' },
  },
  {
    label: 'Avg. Return (YTD)',
    value: '14.8%',
    helperText: 'Year-to-date average client return',
    delta: 0,
    actionLink: { text: 'Analyze Performance', href: '/performance' },
  },
  {
    label: 'This one is ignored',
    value: 'N/A',
    helperText: 'Only max 3 tiles are displayed',
    delta: 100,
    actionLink: { text: 'Ignored', href: '#' },
  },
];

const App = () => (
  <div className="p-10 bg-gray-50">
    <StatsGrid stats={exampleStats} />
  </div>
);
*/
