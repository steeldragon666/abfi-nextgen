import React from 'react';
import RoleHeader from './components/RoleHeader';
import KPITile from './components/KPITile';
import NextStepCard from './components/NextStepCard';
import ListingCard from './components/ListingCard';
import ActivityFeedItem from './components/ActivityFeedItem';
import HelpResource from './components/HelpResource';

// Mock Data for demonstration
const mockKPIs = [
  {
    title: 'Visibility Score',
    value: 85,
    unit: '%',
    description: 'Your profile completeness and search ranking.',
    status: 'Verified' as const,
  },
  {
    title: 'Confidence Index',
    value: 7.2,
    unit: '/10',
    description: 'Buyer confidence based on past transactions.',
    status: 'Attention' as const,
  },
  {
    title: 'Inquiries Received',
    value: 12,
    description: 'New buyer inquiries this month.',
    status: 'Pending' as const,
  },
];

const mockListings = [
  {
    title: 'Premium Wheat Harvest',
    description: 'High-quality wheat, 500 tonnes available for immediate sale.',
    status: 'Verified' as const,
    price: '$350/tonne',
    onViewDetails: () => console.log('View Wheat Details'),
  },
  {
    title: 'Organic Barley Lot',
    description: 'Certified organic barley, 200 tonnes, contract pending.',
    status: 'Pending' as const,
    price: '$420/tonne',
    onViewDetails: () => console.log('View Barley Details'),
  },
  {
    title: 'Fertilizer Surplus',
    description: 'Excess nitrogen fertilizer, urgent sale required.',
    status: 'Risk' as const,
    price: '$150/bag',
    onViewDetails: () => console.log('View Fertilizer Details'),
  },
];

const mockActivity = [
  {
    time: '2 hours ago',
    activity: 'Buyer "AgriCorp" viewed your Wheat Harvest listing.',
    status: 'Verified' as const,
  },
  {
    time: 'Yesterday',
    activity: 'New inquiry received for Organic Barley Lot.',
    status: 'Attention' as const,
  },
  {
    time: '3 days ago',
    activity: 'Profile update submitted for review.',
    status: 'Pending' as const,
  },
  {
    time: '1 week ago',
    activity: 'Contract signed for 100 tonnes of Corn.',
    status: 'Verified' as const,
  },
];

const mockHelpResources = [
  {
    title: 'Listing Optimization Guide',
    description: 'Tips to improve your listing visibility.',
    link: '#',
  },
  {
    title: 'Platform Fee Structure',
    description: 'Detailed breakdown of all transaction costs.',
    link: '#',
  },
  {
    title: 'Contact Support',
    description: 'Get in touch with our grower support team.',
    link: '#',
  },
];

/**
 * The main Grower Dashboard page component.
 * Implements the required layout and integrates all sub-components.
 */
const GrowerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-10 text-[18px]">
      <div className="max-w-7xl mx-auto">
        <RoleHeader role="Grower" name="Alex Johnson" />

        {/* Main Content Grid: 3 columns for main content, 1 column for sidebar */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column (Main Content) - 9/12 width */}
          <div className="col-span-12 lg:col-span-9">
            {/* KPI Tiles - Max 3 metrics visible at once */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {mockKPIs.map((kpi, index) => (
                <KPITile key={index} {...kpi} />
              ))}
            </div>

            {/* Next Step Card */}
            <div className="mb-8">
              <NextStepCard
                title="Complete Your Profile Verification"
                description="To unlock full platform features and increase your Visibility Score, please complete the final step of your profile verification."
                ctaText="Verify Now"
                onCtaClick={() => console.log('Verify Now Clicked')}
              />
            </div>

            {/* Listings Cards Grid - Cards-first design */}
            <h2 className="text-black text-2xl font-semibold mb-6">
              Your Active Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {mockListings.map((listing, index) => (
                <ListingCard key={index} {...listing} />
              ))}
            </div>

            {/* Recent Activity Feed */}
            <h2 className="text-black text-2xl font-semibold mb-6">
              Recent Activity
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              {mockActivity.map((item, index) => (
                <ActivityFeedItem key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Right Column (Help Resources Sidebar) - 3/12 width */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-8">
              <h2 className="text-black text-2xl font-semibold mb-6">
                Help & Resources
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2">
                {mockHelpResources.map((resource, index) => (
                  <HelpResource key={index} {...resource} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowerDashboard;
