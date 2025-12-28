import React, { useState } from 'react';
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";

// --- Design System Colors (Tailwind compatible) ---
// Gold: #D4AF37
// Black: #000000
// White: #FFFFFF

// --- Types and Interfaces ---

type StatusType = 'Verified' | 'Pending' | 'Attention' | 'Risk';

interface Metric {
  label: string;
  value: string;
  status?: StatusType;
}

interface FeedstockSpec {
  label: string;
  value: string;
}

interface BankabilityScore {
  overall: number; // e.g., 85
  breakdown: {
    label: string;
    score: number;
  }[];
}

interface FeedstockDetailData {
  name: string;
  metrics: Metric[];
  supplier: {
    name: string;
    contactPerson: string;
    verificationStatus: StatusType;
  };
  productionSpecs: FeedstockSpec[];
  bankability: BankabilityScore;
  location: {
    address: string;
    mapPlaceholder: string;
  };
  evidenceVault: {
    description: string;
  };
}

// --- Mock Data (for implementation) ---
const mockData: FeedstockDetailData = {
  name: "Sustainable Palm Oil Feedstock",
  metrics: [
    { label: "Bankability Score", value: "85/100", status: 'Verified' },
    { label: "Supplier Rating", value: "4.8/5.0" },
    { label: "Production Volume", value: "15,000 MT/year" },
  ],
  supplier: {
    name: "Agri-Sustain Corp",
    contactPerson: "Jane Doe",
    verificationStatus: 'Verified',
  },
  productionSpecs: [
    { label: "Origin", value: "Indonesia, Sumatra" },
    { label: "Certification", value: "RSPO Certified" },
    { label: "Processing Method", value: "Cold Pressed" },
    { label: "Quality Metrics", value: "FFA < 2%" },
  ],
  bankability: {
    overall: 85,
    breakdown: [
      { label: "Environmental", score: 90 },
      { label: "Social", score: 80 },
      { label: "Governance", score: 85 },
      { label: "Financial", score: 95 },
    ],
  },
  location: {
    address: "123 Palm Oil Rd, Sumatra, Indonesia",
    mapPlaceholder: "Interactive Map Placeholder",
  },
  evidenceVault: {
    description: "Access all audit reports and compliance documents.",
  },
};

// --- Helper Components (for reusability and clarity) ---

// Custom Gold Color Utility
const GOLD = '#D4AF37';

// Status Badge Component
const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  let colorClasses = '';
  switch (status) {
    case 'Verified':
      colorClasses = 'bg-[' + GOLD + '] text-black'; // Gold bg, Black text
      break;
    case 'Pending':
      colorClasses = 'bg-gray-200 text-black';
      break;
    case 'Attention':
      colorClasses = 'bg-amber-500 text-black';
      break;
    case 'Risk':
      colorClasses = 'bg-red-500 text-white';
      break;
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${colorClasses}`}>
      {status}
    </span>
  );
};

// Primary Button Component (Gold CTA)
const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    {...props}
    className={`h-12 px-6 py-3 text-black font-semibold rounded-xl transition-colors duration-200 
                bg-['${GOLD}'] hover:bg-opacity-90 active:bg-opacity-80
                focus:outline-none focus:ring-2 focus:ring-['${GOLD}'] focus:ring-offset-2 ${props.className}`}
    style={{ backgroundColor: GOLD }}
  >
    {children}
  </button>
);

// Secondary Button Component (White/Black Border)
const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    {...props}
    className={`h-12 px-6 py-3 text-black font-semibold rounded-xl border border-black bg-white 
                hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-black focus:ring-offset-2 ${props.className}`}
  >
    {children}
  </button>
);

// Ghost Button Component
const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button
    {...props}
    className={`h-12 px-6 py-3 text-black font-semibold rounded-xl bg-transparent 
                hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-black focus:ring-offset-2 ${props.className}`}
  >
    {children}
  </button>
);

// Card Component
const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-xl p-6 transition-shadow duration-300 ${className}`}>
    <h3 className="text-2xl font-semibold mb-6 text-black">{title}</h3>
    {children}
  </div>
);

// --- Main Page Component ---

const FeedstockDetailPage: React.FC = () => {
  const data = mockData;
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Helper function to scroll to the Inquiry Form
  const scrollToInquiry = () => {
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black text-[18px]">
      <div className="max-w-7xl mx-auto py-10 px-8">
        
        {/* 1. Header Section (Feedstock Overview) */}
        <header className="mb-10">
          <h1 className="text-4xl font-semibold mb-4 text-black">{data.name}</h1>
          
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {data.metrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                <p className="text-lg font-medium text-gray-600">{metric.label}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-3xl font-semibold text-black">{metric.value}</p>
                  {metric.status && <StatusBadge status={metric.status} />}
                </div>
              </div>
            ))}
          </div>

          {/* Primary CTA: "Inquire Now" */}
          <PrimaryButton onClick={scrollToInquiry} className="w-full md:w-auto">
            Inquire Now
          </PrimaryButton>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 2. Supplier Information Card */}
            <Card title="Supplier Details">
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="font-medium">Supplier Name:</span> <span className="font-semibold">{data.supplier.name}</span>
                </p>
                <p className="text-lg">
                  <span className="font-medium">Contact Person:</span> {data.supplier.contactPerson}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Verification Status:</span>
                  <StatusBadge status={data.supplier.verificationStatus} />
                </div>
                <GhostButton className="mt-4">
                  View Supplier Profile
                </GhostButton>
              </div>
            </Card>

            {/* 3. Production Specifications Card (Cards-first design) */}
            <Card title="Production Specifications">
              <div className="grid grid-cols-2 gap-4">
                {data.productionSpecs.map((spec, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">{spec.label}</p>
                    <p className="text-lg font-semibold text-black">{spec.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. Bankability Score Breakdown Section (Progressive Disclosure) */}
            <Card title="Bankability Score Breakdown">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xl font-medium">Overall Score:</p>
                <p className="text-4xl font-semibold text-black">{data.bankability.overall}/100</p>
              </div>
              
              <SecondaryButton onClick={() => setShowBreakdown(!showBreakdown)} className="mb-6">
                {showBreakdown ? 'Hide Details' : 'View Details'}
              </SecondaryButton>

              {showBreakdown && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  {data.bankability.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <p className="font-medium">{item.label}</p>
                      <p className="font-semibold text-xl">{item.score}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* 5. Location Map Card */}
            <Card title="Production Location">
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-500 font-medium">{data.location.mapPlaceholder}</p>
              </div>
              <p className="text-lg font-medium mb-4">{data.location.address}</p>
              <SecondaryButton>
                View Full Map
              </SecondaryButton>
            </Card>

            {/* 6. Evidence Vault Access Card */}
            <Card title="Evidence Vault">
              <p className="text-lg mb-6">{data.evidenceVault.description}</p>
              <SecondaryButton>
                Access Vault
              </SecondaryButton>
            </Card>
          </div>

          {/* Right Column (Inquiry Form - Sticky/Prominent) */}
          <div className="lg:col-span-1">
            <Card title="Contact Supplier" className="lg:sticky lg:top-10" id="inquiry-form">
              <form className="space-y-6">
                
                {/* Form Field: Name */}
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-black mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-['${GOLD}'] focus:border-transparent"
                    style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
                  />
                </div>

                {/* Form Field: Company */}
                <div>
                  <label htmlFor="company" className="block text-lg font-medium text-black mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Your Company"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-['${GOLD}'] focus:border-transparent"
                    style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
                  />
                </div>

                {/* Form Field: Email */}
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-['${GOLD}'] focus:border-transparent"
                    style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
                  />
                </div>

                {/* Form Field: Inquiry Details */}
                <div>
                  <label htmlFor="inquiry" className="block text-lg font-medium text-black mb-2">
                    Inquiry Details
                  </label>
                  <textarea
                    id="inquiry"
                    name="inquiry"
                    rows={4}
                    placeholder="Describe your inquiry..."
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-['${GOLD}'] focus:border-transparent"
                    style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
                  />
                </div>

                {/* Submit Button (The single primary gold CTA for the screen) */}
                <PrimaryButton type="submit" className="w-full">
                  Send Inquiry
                </PrimaryButton>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedstockDetailPage;
