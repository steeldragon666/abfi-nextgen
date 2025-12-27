import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart2,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  Settings,
  LogOut,
  Bell,
  Check,
  X,
} from 'lucide-react';

// --- Design System Colors and Constants ---
const GOLD_COLOR = '#D4AF37';
const GOLD_BG = 'bg-[#D4AF37]';
const GOLD_RING = 'focus:ring-4 focus:ring-offset-2 focus:ring-[#D4AF37]';
const BASE_TEXT_SIZE = 'text-[18px]'; // 18px base text

// --- Types and Mock Data ---

interface Metric {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  status: 'up' | 'down' | 'neutral';
}

interface VerificationQueueItem {
  id: string;
  user: string;
  type: 'Individual' | 'Business';
  status: 'Verified' | 'Pending' | 'Attention' | 'Risk';
  date: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Analyst' | 'User';
  status: 'Active' | 'Suspended';
}

const mockMetrics: Metric[] = [
  {
    id: 1,
    title: 'Total Users',
    value: '1,245',
    change: '+12%',
    icon: Users,
    status: 'up',
  },
  {
    id: 2,
    title: 'Verification Queue',
    value: '42 Pending',
    change: '0%',
    icon: Clock,
    status: 'neutral',
  },
  {
    id: 3,
    title: 'Compliance Score',
    value: '98.5%',
    change: '-0.2%',
    icon: CheckCircle,
    status: 'down',
  },
];

const mockQueue: VerificationQueueItem[] = [
  {
    id: 'V-1001',
    user: 'Anya Smith',
    type: 'Individual',
    status: 'Pending',
    date: '2025-12-26',
  },
  {
    id: 'V-1002',
    user: 'Global Corp Ltd',
    type: 'Business',
    status: 'Attention',
    date: '2025-12-26',
  },
  {
    id: 'V-1003',
    user: 'John Doe',
    type: 'Individual',
    status: 'Risk',
    date: '2025-12-25',
  },
  {
    id: 'V-1004',
    user: 'Verified User',
    type: 'Individual',
    status: 'Verified',
    date: '2025-12-24',
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 'L-001',
    timestamp: '2025-12-27 10:30',
    user: 'Admin User',
    action: 'User Role Update',
    details: 'Updated role for John Doe to Analyst',
  },
  {
    id: 'L-002',
    timestamp: '2025-12-27 10:25',
    user: 'System',
    action: 'Compliance Check',
    details: 'Daily compliance run completed successfully',
  },
  {
    id: 'L-003',
    timestamp: '2025-12-27 10:00',
    user: 'Anya Smith',
    action: 'Login Success',
    details: 'Successful login from IP 192.168.1.1',
  },
];

const mockUsers: User[] = [
  { id: 'U-001', name: 'Alice Johnson', role: 'Admin', status: 'Active' },
  { id: 'U-002', name: 'Bob Williams', role: 'Analyst', status: 'Active' },
  { id: 'U-003', name: 'Charlie Brown', role: 'User', status: 'Suspended' },
];

// --- Components ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, children, className = '', ...props }) => {
  let baseClasses = \`rounded-[8px] font-semibold transition-colors min-h-[48px] px-6 \${BASE_TEXT_SIZE}\`; // min-h-[48px] for large touch target

  switch (variant) {
    case 'primary':
      baseClasses += \` \${GOLD_BG} text-black hover:bg-opacity-90\`;
      break;
    case 'secondary':
      baseClasses += \` bg-white border border-black text-black hover:bg-gray-50\`;
      break;
    case 'ghost':
      baseClasses += \` transparent text-black hover:bg-gray-100\`;
      break;
  }

  return (
    <button className={\`\${baseClasses} \${className}\`} {...props}>
      {children}
    </button>
  );
};

const StatusBadge: React.FC<{ status: VerificationQueueItem['status'] }> = ({ status }) => {
  let classes = \`px-3 py-1 rounded-full font-medium text-sm\`;
  let text = status;

  switch (status) {
    case 'Verified':
      classes += \` \${GOLD_BG} text-black\`;
      break;
    case 'Pending':
      classes += \` bg-gray-200 text-black\`;
      break;
    case 'Attention':
      classes += \` bg-amber-500 text-white\`;
      break;
    case 'Risk':
      classes += \` bg-red-500 text-white\`;
      break;
  }

  return <span className={classes}>{text}</span>;
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  // Cards: White background, gray-200 border, shadow-sm, hover:shadow-md, border-radius: 12px (mid-scale)
  return (
    <div
      className={\`bg-white border border-gray-200 rounded-[12px] shadow-sm hover:shadow-md transition-shadow p-6 \${className}\`} // p-6 is 24px spacing
    >
      {children}
    </div>
  );
};

const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const Icon = metric.icon;
  const statusColor =
    metric.status === 'up'
      ? 'text-green-500'
      : metric.status === 'down'
      ? 'text-red-500'
      : 'text-gray-500';

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className={\`font-medium text-gray-600 \${BASE_TEXT_SIZE}\`}>{metric.title}</h3>
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <div className="mt-4">
        <p className="text-4xl font-semibold text-black">{metric.value}</p>
        <p className={\`mt-1 font-medium \${statusColor}\`}>{metric.change}</p>
      </div>
    </Card>
  );
};

const VerificationItemCard: React.FC<{ item: VerificationQueueItem }> = ({ item }) => {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className={\`font-semibold text-black \${BASE_TEXT_SIZE}\`}>{item.user}</p>
          <p className="text-sm text-gray-500">{item.type} Verification</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">Submitted: {item.date}</p>
        <Button variant="ghost" className="px-3 py-1 min-h-0">
          Review
        </Button>
      </div>
    </Card>
  );
};

const AuditLogsTable: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleLogs = isExpanded ? logs : logs.slice(0, 5); // Progressive disclosure

  return (
    <Card className="col-span-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className={\`font-semibold text-black \${BASE_TEXT_SIZE}\`}>Audit Logs</h2>
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)} className="min-h-0">
          {isExpanded ? (
            <>
              Collapse <ChevronUp className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              View All <ChevronDown className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Timestamp', 'User', 'Action', 'Details'].map((header) => (
                <th
                  key={header}
                  className={\`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider \${BASE_TEXT_SIZE}\`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleLogs.map((log) => (
              <tr key={log.id}>
                <td className={\`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 \${BASE_TEXT_SIZE}\`}>
                  {log.timestamp}
                </td>
                <td className={\`px-6 py-4 whitespace-nowrap text-sm text-gray-500 \${BASE_TEXT_SIZE}\`}>
                  {log.user}
                </td>
                <td className={\`px-6 py-4 whitespace-nowrap text-sm text-gray-500 \${BASE_TEXT_SIZE}\`}>
                  {log.action}
                </td>
                <td className={\`px-6 py-4 whitespace-nowrap text-sm text-gray-500 \${BASE_TEXT_SIZE}\`}>
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const SystemAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      message: 'High-risk transaction detected. Review immediately.',
      type: 'Risk',
      icon: AlertTriangle,
    },
    {
      id: 2,
      message: 'System maintenance scheduled for 02:00 UTC.',
      type: 'Attention',
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className={\`font-semibold text-black \${BASE_TEXT_SIZE}\`}>System Alerts</h2>
      {alerts.map((alert) => {
        const Icon = alert.icon;
        const colorClass = alert.type === 'Risk' ? 'bg-red-100 border-red-500' : 'bg-amber-100 border-amber-500';
        const iconColor = alert.type === 'Risk' ? 'text-red-500' : 'text-amber-500';

        return (
          <div
            key={alert.id}
            className={\`flex items-center p-4 border-l-4 rounded-[8px] \${colorClass}\`} // 8px border radius
          >
            <Icon className={\`w-6 h-6 mr-4 \${iconColor}\`} />
            <p className={\`font-medium text-black \${BASE_TEXT_SIZE}\`}>{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
};

const UserManagementInterface: React.FC<{ users: User[] }> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleUpdateRole = (role: User['role']) => {
    if (selectedUser) {
      console.log(\`Updating \${selectedUser.name}'s role to \${role}\`);
      setSelectedUser({ ...selectedUser, role });
    }
  };

  const handleToggleStatus = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'Active' ? 'Suspended' : 'Active';
      console.log(\`Toggling \${selectedUser.name}'s status to \${newStatus}\`);
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <h2 className={\`font-semibold text-black mb-6 \${BASE_TEXT_SIZE}\`}>User Management</h2>
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={\`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-[8px] text-black \${GOLD_RING} focus:border-[#D4AF37] \${BASE_TEXT_SIZE}\`} // Large input py-3 px-4, gold focus ring, 8px radius
        />
      </div>

      <div className="h-64 overflow-y-auto space-y-2 pr-2">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className={\`flex justify-between items-center p-3 rounded-[8px] cursor-pointer transition-colors \${
              selectedUser?.id === user.id ? \`bg-gray-100 border border-[#D4AF37]\` : 'hover:bg-gray-50'
            }\`}
          >
            <p className={\`font-medium text-black \${BASE_TEXT_SIZE}\`}>{user.name}</p>
            <StatusBadge status={user.status === 'Active' ? 'Verified' : 'Risk'} />
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="mt-6 p-4 border-t border-gray-200 space-y-4">
          <h3 className={\`font-semibold text-black \${BASE_TEXT_SIZE}\`}>
            Details for {selectedUser.name}
          </h3>
          <p className="text-sm">
            <span className="font-medium">Role:</span> {selectedUser.role}
          </p>
          <p className="text-sm">
            <span className="font-medium">Status:</span> {selectedUser.status}
          </p>

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => handleUpdateRole(selectedUser.role === 'Admin' ? 'Analyst' : 'Admin')}
              className="flex-1 min-h-[48px]"
            >
              Change Role
            </Button>
            <Button
              variant={selectedUser.status === 'Active' ? 'secondary' : 'primary'}
              onClick={handleToggleStatus}
              className="flex-1 min-h-[48px]"
            >
              {selectedUser.status === 'Active' ? 'Suspend' : 'Activate'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

const ComplianceMonitoring: React.FC = () => {
  const complianceItems = [
    {
      id: 1,
      title: 'AML Policy Adherence',
      score: 99,
      status: 'Verified',
      details: 'All checks passed in the last 24 hours.',
    },
    {
      id: 2,
      title: 'KYC Document Review',
      score: 85,
      status: 'Attention',
      details: '5 users require manual document review.',
    },
    {
      id: 3,
      title: 'Sanctions List Screening',
      score: 100,
      status: 'Verified',
      details: 'No matches found.',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className={\`font-semibold text-black \${BASE_TEXT_SIZE}\`}>Compliance Monitoring</h2>
      <div className="grid grid-cols-1 gap-4">
        {complianceItems.map((item) => (
          <Card key={item.id} className="flex justify-between items-center">
            <div>
              <p className={\`font-semibold text-black \${BASE_TEXT_SIZE}\`}>{item.title}</p>
              <p className="text-sm text-gray-500 mt-1">{item.details}</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-2xl font-bold text-black">{item.score}%</p>
              <StatusBadge status={item.status as VerificationQueueItem['status']} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <div className={\`min-h-screen bg-gray-50 p-10 \${BASE_TEXT_SIZE}\`}>
      {/* Header (Spacing: p-10 is 40px) */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-black">Admin Dashboard</h1>
        {/* FIGMA Principle: One primary gold CTA per screen */}
        <Button variant="primary">
          <Settings className="w-5 h-5 mr-2" />
          System Configuration
        </Button>
      </header>

      {/* Platform Health Metrics (Spacing: mb-8 is 32px) */}
      <section className="mb-8">
        <h2 className={\`font-semibold text-black mb-4 \${BASE_TEXT_SIZE}\`}>Platform Health</h2>
        {/* FIGMA Principle: Max 3 metrics visible at once */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      {/* Main Content Grid (Spacing: gap-8 is 32px) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Queue Cards (Cards-first design) */}
        <section className="lg:col-span-1 space-y-6">
          <h2 className={\`font-semibold text-black \${BASE_TEXT_SIZE}\`}>Verification Queue</h2>
          <div className="space-y-4">
            {mockQueue.map((item) => (
              <VerificationItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Compliance Monitoring and System Alerts */}
        <section className="lg:col-span-1 space-y-8">
          <ComplianceMonitoring />
          <SystemAlerts />
        </section>

        {/* User Management Interface */}
        <UserManagementInterface users={mockUsers} />

        {/* Audit Logs Table (The only required table) */}
        <AuditLogsTable logs={mockAuditLogs} />
      </div>
    </div>
  );
};

export default AdminDashboard;
