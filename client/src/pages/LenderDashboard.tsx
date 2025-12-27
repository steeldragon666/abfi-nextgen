import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  BarChart2,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

// --- Design System Colors and Constants ---
const GOLD = '#D4AF37';
const BLACK = '#000000';
const WHITE = '#FFFFFF';

// --- Utility Components ---

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon }) => {
  return (
    <div
      className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-lg transition-shadow"
      style={{ borderRadius: '12px' }} // 12px border radius
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500" style={{ fontSize: '18px', color: BLACK }}>
          {title}
        </div>
        <div className="p-2 rounded-full bg-gray-100 text-gray-600 h-12 w-12 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-semibold" style={{ color: BLACK }}>
          {value}
        </div>
        <p className="mt-1 text-sm text-gray-500" style={{ fontSize: '18px' }}>
          {description}
        </p>
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, children, className, ...props }) => {
  const baseClasses = 'h-12 px-6 rounded-lg font-semibold transition-colors min-w-[48px] min-h-[48px]'; // Large touch targets (48px min)
  let variantClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = `bg-[${GOLD}] text-black hover:bg-opacity-90`;
      break;
    case 'secondary':
      variantClasses = `bg-white border border-black text-black hover:bg-gray-50`;
      break;
    case 'ghost':
      variantClasses = `bg-transparent text-black hover:bg-gray-100`;
      break;
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Main Component ---

const LenderDashboard: React.FC = () => {
  // Mock Data for Portfolio Overview (Max 3 metrics visible at once)
  const portfolioMetrics = [
    {
      title: 'Total Portfolio Value',
      value: '$1.2B',
      description: 'Across 45 active borrowers',
      icon: <BarChart2 size={24} />,
    },
    {
      title: 'Average Risk Score',
      value: 'B+',
      description: 'Stable, low-to-moderate risk',
      icon: <ShieldCheck size={24} />,
    },
    {
      title: 'Breach Alerts (24h)',
      value: '2',
      description: 'Requires immediate attention',
      icon: <AlertTriangle size={24} color="red" />,
    },
  ];

  // Mock Data for Covenant Monitoring
  const covenants = [
    {
      id: 1,
      borrower: 'Alpha Corp',
      covenant: 'Debt Service Coverage Ratio (DSCR)',
      status: 'Verified',
      value: '1.45x (Min 1.25x)',
      lastCheck: '2025-12-20',
    },
    {
      id: 2,
      borrower: 'Beta Ltd',
      covenant: 'Liquidity Ratio',
      status: 'Attention',
      value: '0.95x (Min 1.00x)',
      lastCheck: '2025-12-26',
    },
    {
      id: 3,
      borrower: 'Gamma Inc',
      covenant: 'Leverage Ratio',
      status: 'Pending',
      value: '2.5x (Max 3.0x)',
      lastCheck: '2025-12-27',
    },
  ];

  // Mock Data for Risk Matrix Visualization (Simplified)
  const riskMatrixData = [
    { risk: 'High', count: 5, color: 'bg-red-500' },
    { risk: 'Medium', count: 12, color: 'bg-amber-500' },
    { risk: 'Low', count: 28, color: 'bg-green-500' },
  ];

  // Status mapping for visual compliance
  const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    let classes = '';
    let icon = null;

    switch (status) {
      case 'Verified':
        classes = `bg-[${GOLD}] text-black`;
        icon = <CheckCircle size={16} className="mr-1" />;
        break;
      case 'Pending':
        classes = 'bg-gray-200 text-black';
        icon = <Clock size={16} className="mr-1" />;
        break;
      case 'Attention':
        classes = 'bg-amber-500 text-black';
        icon = <AlertTriangle size={16} className="mr-1" />;
        break;
      case 'Risk':
        classes = 'bg-red-500 text-white';
        icon = <XCircle size={16} className="mr-1" />;
        break;
      default:
        classes = 'bg-gray-100 text-gray-600';
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${classes}`}
        style={{ fontSize: '18px' }}
      >
        {icon}
        {status}
      </span>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" style={{ fontSize: '18px' }}>
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: BLACK }}>
          Lender Dashboard
        </h1>
        {/* One primary gold CTA per screen */}
        <Button variant="primary">
          <span className="flex items-center">
            New Bankability Assessment
            <ArrowRight size={20} className="ml-2" />
          </span>
        </Button>
      </header>

      {/* Portfolio Overview (Max 3 cards) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {portfolioMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Covenant Monitoring */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: BLACK }}>
            Covenant Monitoring
          </h2>
          {/* Cards-first design over tables */}
          <div className="space-y-4">
            {covenants.map((covenant) => (
              <div
                key={covenant.id}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-lg flex justify-between items-center"
                style={{ borderRadius: '12px' }}
              >
                <div>
                  <p className="font-semibold" style={{ color: BLACK }}>
                    {covenant.covenant}
                  </p>
                  <p className="text-gray-600" style={{ fontSize: '18px' }}>
                    {covenant.borrower} - {covenant.value}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <StatusPill status={covenant.status} />
                  <Button variant="ghost" className="h-12 w-12 p-0">
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bankability Assessment Interface & Risk Matrix (Progressive Disclosure) */}
        <section className="lg:col-span-1 space-y-6">
          {/* Bankability Assessment Interface */}
          <div
            className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg"
            style={{ borderRadius: '12px' }}
          >
            <h2 className="text-2xl font-semibold mb-4" style={{ color: BLACK }}>
              Bankability Assessment
            </h2>
            <p className="text-gray-600 mb-4" style={{ fontSize: '18px' }}>
              Initiate a new assessment for a potential or existing borrower.
            </p>
            <Button variant="primary" className="w-full">
              <span className="flex items-center justify-center">
                Start Assessment
                <Activity size={20} className="ml-2" />
              </span>
            </Button>
          </div>

          {/* Risk Matrix Visualization (Simplified Card View) */}
          <div
            className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg"
            style={{ borderRadius: '12px' }}
          >
            <h2 className="text-2xl font-semibold mb-4" style={{ color: BLACK }}>
              Risk Matrix Overview
            </h2>
            <div className="space-y-3">
              {riskMatrixData.map((item) => (
                <div key={item.risk} className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: BLACK }}>
                    {item.risk} Risk Borrowers
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`w-4 h-4 rounded-full ${item.color}`}></span>
                    <span className="font-semibold" style={{ color: BLACK }}>
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full justify-start px-0">
              <span className="flex items-center">
                View Full Risk Matrix
                <ArrowRight size={20} className="ml-2" />
              </span>
            </Button>
          </div>
        </section>
      </div>

      {/* Breach Alerts and Audit Trail Access */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: BLACK }}>
          Breach Alerts & Audit Trail
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Breach Alerts */}
          <div
            className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg"
            style={{ borderRadius: '12px' }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center" style={{ color: BLACK }}>
              <AlertTriangle size={20} className="mr-2 text-red-500" />
              Recent Breach Alerts
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <p className="text-gray-600" style={{ fontSize: '18px' }}>
                  Alpha Corp - DSCR Breach
                </p>
                <StatusPill status="Risk" />
              </li>
              <li className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <p className="text-gray-600" style={{ fontSize: '18px' }}>
                  Beta Ltd - Liquidity Warning
                </p>
                <StatusPill status="Attention" />
              </li>
            </ul>
            <Button variant="ghost" className="mt-4 w-full justify-start px-0">
              <span className="flex items-center">
                View All Alerts
                <ArrowRight size={20} className="ml-2" />
              </span>
            </Button>
          </div>

          {/* Audit Trail Access */}
          <div
            className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg"
            style={{ borderRadius: '12px' }}
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center" style={{ color: BLACK }}>
              <FileText size={20} className="mr-2" />
              Audit Trail Access
            </h3>
            <p className="text-gray-600 mb-4" style={{ fontSize: '18px' }}>
              Access a full history of all platform actions and data changes.
            </p>
            <Button variant="secondary" className="w-full">
              <span className="flex items-center justify-center">
                Go to Audit Log
                <ArrowRight size={20} className="ml-2" />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LenderDashboard;
