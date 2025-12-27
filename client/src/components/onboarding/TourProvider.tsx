import React, { useState, useEffect } from 'react';
import { TourProvider as ReactTourProvider } from '@reactour/tour';
import { HeyGenTourStep } from './HeyGenTourStep';

interface TourStep {
  selector: string;
  title: string;
  description: string;
  videoUrl: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    selector: '[data-tour="dashboard"]',
    title: 'Your Command Center',
    description: 'Track prices, manage orders, and monitor your carbon credits in real-time',
    videoUrl: '/videos/welcome.mp4',
    position: 'bottom',
  },
  {
    selector: '[data-tour="marketplace"]',
    title: 'Verified Supplier Marketplace',
    description: 'Connect with 50+ certified Australian bioenergy suppliers',
    videoUrl: '/videos/supplier-verification.mp4',
    position: 'right',
  },
  {
    selector: '[data-tour="request-quote"]',
    title: 'Request Quotes in 60 Seconds',
    description: 'Get competitive quotes from multiple suppliers with one form',
    videoUrl: '/videos/request-quote.mp4',
    position: 'left',
  },
  {
    selector: '[data-tour="carbon-calculator"]',
    title: 'Carbon Credit Calculator',
    description: 'Calculate your Scope 1-3 emissions reductions for ESG reporting',
    videoUrl: '/videos/carbon-calculator.mp4',
    position: 'top',
  },
];

interface TourProviderProps {
  children: React.ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show tour on first visit (after onboarding modal is dismissed)
    const hasSeenTour = localStorage.getItem('abfi-has-seen-tour');
    const hasSeenOnboarding = localStorage.getItem('abfi_onboarding_completed');
    const hasSkippedOnboarding = localStorage.getItem('abfi_onboarding_skipped');
    
    if (!hasSeenTour && (hasSeenOnboarding || hasSkippedOnboarding)) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleClose = () => {
    localStorage.setItem('abfi-has-seen-tour', 'true');
    setIsOpen(false);
  };

  return (
    <ReactTourProvider
      steps={tourSteps.map(step => ({
        selector: step.selector,
        content: (
          <HeyGenTourStep
            title={step.title}
            description={step.description}
            videoUrl={step.videoUrl}
            onComplete={() => {
              if (currentStep < tourSteps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                handleClose();
              }
            }}
          />
        ),
        position: step.position,
      }))}
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={handleClose}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      showCloseButton={false}
      showNavigation={true}
      showBadge={true}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '500px',
          background: '#ffffff',
        }),
        helper: (base) => ({
          ...base,
          background: '#ffffff',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        }),
        badge: (base) => ({
          ...base,
          background: '#D4AF37',
          color: '#000000',
        }),
        dot: (base, state) => ({
          ...base,
          background: state.current ? '#D4AF37' : '#e5e7eb',
        }),
      }}
    >
      {children}
    </ReactTourProvider>
  );
};
