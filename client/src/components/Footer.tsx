import React from 'react';

// Define the structure for a link item
interface FooterLink {
  label: string;
  href: string;
}

// Define the structure for a social link item (assuming simple text for now)
interface SocialLink extends FooterLink {
  icon: string; // Placeholder for an icon component or SVG
}

// Mock data for the footer content
const legalLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Security', href: '/security' },
];

const contactDetails: FooterLink[] = [
  { label: 'support@abfi.com', href: 'mailto:support@abfi.com' },
  { label: '+1 (800) 555-0199', href: 'tel:+18005550199' },
  { label: '123 ABFI Way, Suite 400, Financial District, NY', href: '#' },
];

const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://linkedin.com/abfi', icon: 'In' },
  { label: 'Twitter', href: 'https://twitter.com/abfi', icon: 'Tw' },
  { label: 'Facebook', href: 'https://facebook.com/abfi', icon: 'Fb' },
  { label: 'Instagram', href: 'https://instagram.com/abfi', icon: 'Ig' },
];

/**
 * A production-ready Footer component for the ABFI platform.
 * Adheres to the Black/White/Gold color scheme and specified typography/spacing.
 */
const Footer: React.FC = () => {
  // Tailwind utility for the Gold color: #D4AF37
  const GOLD_COLOR = '#D4AF37';

  return (
    <footer className="bg-black text-white pt-40 pb-24 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-32 border-b border-gray-700 pb-32">
          {/* Column 1: Company Info & Disclaimer */}
          <div className="col-span-1 md:col-span-2 space-y-24">
            <h3 className="text-2xl font-semibold text-white">ABFI Platform</h3>
            <p className="text-lg font-medium text-gray-300 max-w-lg">
              The leading platform for Advanced Business Financial Intelligence. Empowering
              institutions with real-time data and predictive analytics for superior decision-making.
            </p>
          </div>

          {/* Column 2: Legal Links */}
          <div className="space-y-16">
            <h4 className="text-lg font-semibold mb-16">Legal</h4>
            <ul className="space-y-12 text-lg font-medium">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`hover:text-[${GOLD_COLOR}] transition-colors duration-200`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-16">
            <h4 className="text-lg font-semibold mb-16">Contact</h4>
            <ul className="space-y-12 text-lg font-medium">
              {contactDetails.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`hover:text-[${GOLD_COLOR}] transition-colors duration-200`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright, Social Links, and Disclaimer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-24 space-y-24 md:space-y-0">
          {/* Copyright and Disclaimer */}
          <div className="text-sm font-medium text-gray-500 space-y-12">
            <p>&copy; {new Date().getFullYear()} ABFI Platform. All rights reserved.</p>
            <p className="max-w-3xl">
              Disclaimer: The information provided on this platform is for informational purposes only
              and does not constitute financial advice. Consult with a qualified professional before
              making any investment decisions.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-24">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className={`text-2xl font-semibold hover:text-[${GOLD_COLOR}] transition-colors duration-200`}
              >
                {/* Placeholder for an actual icon (e.g., <link.icon size={24} />) */}
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
