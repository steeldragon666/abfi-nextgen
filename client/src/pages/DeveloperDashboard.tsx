import React from 'react';

// Define the color constants for clarity and adherence to the design system
const COLOR_GOLD = '#D4AF37';
const COLOR_BLACK = '#000000';
const COLOR_WHITE = '#FFFFFF';

// Helper component for the primary gold button
const PrimaryButton: React.FC<{ children: React.ReactNode, onClick?: () => void }> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    // Large touch target (min 48px height) and gold primary style
    className="bg-[#D4AF37] text-black font-semibold py-3 px-6 rounded-lg min-h-[48px] transition duration-150 ease-in-out hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-[#D4AF37] focus:ring-opacity-50"
  >
    {children}
  </button>
);

// Helper component for the Metric Cards (Max 3 metrics visible at once)
interface MetricCardProps {
  title: string;
  value: string;
  status?: 'Verified' | 'Pending' | 'Attention' | 'Risk';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, status }) => {
  let statusClasses = '';
  let statusText = status;

  switch (status) {
    case 'Verified':
      statusClasses = 'bg-[#D4AF37] text-black'; // Gold bg
      break;
    case 'Pending':
      statusClasses = 'bg-gray-200 text-black';
      break;
    case 'Attention':
      statusClasses = 'bg-amber-500 text-white';
      break;
    case 'Risk':
      statusClasses = 'bg-red-500 text-white';
      break;
    default:
      statusText = '';
      statusClasses = 'hidden';
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition duration-150 ease-in-out hover:shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        {status && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusClasses}`}>
            {statusText}
          </span>
        )}
      </div>
      <p className="text-4xl font-semibold text-black">{value}</p>
    </div>
  );
};

// Helper component for Deal Pipeline Cards (Cards-first design)
interface DealCardProps {
  dealName: string;
  stage: string;
  bankabilityScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

const DealCard: React.FC<DealCardProps> = ({ dealName, stage, bankabilityScore, riskLevel }) => {
  const riskColor = riskLevel === 'High' ? 'text-red-500' : riskLevel === 'Medium' ? 'text-amber-500' : 'text-green-500';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition duration-150 ease-in-out hover:shadow-md cursor-pointer">
      <h4 className="text-xl font-semibold mb-2">{dealName}</h4>
      <p className="text-sm font-medium text-gray-500 mb-3">Stage: <span className="text-black">{stage}</span></p>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Bankability Score:</span>
          <span className="font-semibold">{bankabilityScore}%</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Risk Level:</span>
          <span className={`font-semibold ${riskColor}`}>{riskLevel}</span>
        </div>
      </div>
      
      {/* Large touch target for a secondary action */}
      <button className="mt-4 w-full text-black border border-black bg-white font-medium py-2 px-4 rounded-lg text-sm min-h-[48px] hover:bg-gray-50">
        View Deal Room
      </button>
    </div>
  );
};

// Main Developer Dashboard Component
const DeveloperDashboard: React.FC = () => {
  // Mock data for the dashboard
  const metricsData: MetricCardProps[] = [
    { title: 'Bankability Score', value: '85%', status: 'Verified' },
    { title: 'Supply Coverage', value: '12 / 15', status: 'Attention' },
    { title: 'Risk Surfacing', value: 'High', status: 'Risk' },
  ];

  const dealPipelineData: DealCardProps[] = [
    { dealName: 'Project Alpha Solar Farm', stage: 'Due Diligence', bankabilityScore: 78, riskLevel: 'Medium' },
    { dealName: 'Green Energy Fund Q4', stage: 'Term Sheet', bankabilityScore: 92, riskLevel: 'Low' },
    { dealName: 'Urban Wind Turbine Pilot', stage: 'Origination', bankabilityScore: 65, riskLevel: 'High' },
    { dealName: 'Hydro Power Plant Upgrade', stage: 'Closing', bankabilityScore: 95, riskLevel: 'Low' },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold text-black">Developer Dashboard</h1>
        {/* One primary gold CTA per screen */}
        <PrimaryButton>Start New Deal Workflow</PrimaryButton>
      </header>

      {/* Section 1: Key Metrics (Max 3 metrics visible at once) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricsData.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </section>

      {/* Section 2: Deal Pipeline (Cards-first design) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Deal Pipeline (4 Active)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealPipelineData.map((deal, index) => (
            <DealCard key={index} {...deal} />
          ))}
        </div>
      </section>

      {/* Section 3: Marketplace Browse Interface & Deal Room Workflow (Progressive Disclosure) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Marketplace & Workflow</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Marketplace Browse Interface Card */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-2xl font-semibold mb-4">Browse Marketplace</h3>
            <p className="text-base font-medium mb-4">Find new supply and financing opportunities.</p>
            
            {/* Form/Input for browsing - Large inputs, gold focus rings, black labels */}
            <label htmlFor="marketplace-search" className="block text-black font-medium mb-2">Search for Opportunities</label>
            <input 
              id="marketplace-search"
              type="text" 
              placeholder="e.g., Solar, Africa, $50M"
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-lg"
            />
            
            {/* Secondary CTA for browsing */}
            <button className="mt-4 w-full text-black border border-black bg-white font-medium py-3 px-4 rounded-lg min-h-[48px] hover:bg-gray-50">
              Search Marketplace
            </button>
          </div>

          {/* Deal Room Workflow Summary Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-2xl font-semibold mb-4">Deal Room Workflow</h3>
            <p className="text-base font-medium mb-4">Manage your active deal rooms and next steps.</p>
            
            <ul className="space-y-3 text-base">
              <li className="flex justify-between items-center">
                <span className="font-medium">Pending Approvals:</span>
                <span className="font-semibold text-amber-500">3</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium">Documents to Sign:</span>
                <span className="font-semibold text-red-500">1</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium">Next Milestone:</span>
                <span className="font-semibold">Project Alpha</span>
              </li>
            </ul>
            
            {/* Ghost Button for Progressive Disclosure */}
            <button className="mt-6 w-full text-black font-medium py-3 px-4 rounded-lg min-h-[48px] hover:bg-gray-100 transition duration-150 ease-in-out">
              Go to Workflow Manager
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeveloperDashboard;
