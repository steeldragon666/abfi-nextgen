import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { AvatarVideoPlayer } from './AvatarVideoPlayer';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  thumbnail?: string;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'grower' | 'developer' | 'financier' | 'admin';
}

const ONBOARDING_VIDEOS: Record<string, OnboardingStep[]> = {
  grower: [
    {
      id: 'welcome',
      title: 'Welcome to ABFI',
      description: 'Meet Sam, your guide to the platform',
      videoSrc: '/videos/welcome.mp4',
      thumbnail: '/assets/thumbnails/welcome.jpg',
    },
    {
      id: 'supplier-verification',
      title: 'How We Verify Suppliers',
      description: 'Learn about our rigorous verification process',
      videoSrc: '/videos/supplier-verification.mp4',
      thumbnail: '/assets/thumbnails/supplier-verification.jpg',
    },
    {
      id: 'request-quote',
      title: 'Requesting Quotes',
      description: 'Step-by-step guide to requesting quotes',
      videoSrc: '/videos/request-quote.mp4',
      thumbnail: '/assets/thumbnails/request-quote.jpg',
    },
  ],
  developer: [
    {
      id: 'welcome',
      title: 'Welcome to ABFI',
      description: 'Meet Sam, your guide to the platform',
      videoSrc: '/videos/welcome.mp4',
      thumbnail: '/assets/thumbnails/welcome.jpg',
    },
    {
      id: 'supplier-verification',
      title: 'Finding Verified Suppliers',
      description: 'How to find and evaluate suppliers',
      videoSrc: '/videos/supplier-verification.mp4',
      thumbnail: '/assets/thumbnails/supplier-verification.jpg',
    },
    {
      id: 'carbon-calculator',
      title: 'Carbon Calculator',
      description: 'Track your environmental impact',
      videoSrc: '/videos/carbon-calculator.mp4',
      thumbnail: '/assets/thumbnails/carbon-calculator.jpg',
    },
  ],
  financier: [
    {
      id: 'welcome',
      title: 'Welcome to ABFI',
      description: 'Meet Sam, your guide to the platform',
      videoSrc: '/videos/welcome.mp4',
      thumbnail: '/assets/thumbnails/welcome.jpg',
    },
    {
      id: 'supplier-verification',
      title: 'Supplier Due Diligence',
      description: 'Understanding our verification process',
      videoSrc: '/videos/supplier-verification.mp4',
      thumbnail: '/assets/thumbnails/supplier-verification.jpg',
    },
    {
      id: 'carbon-calculator',
      title: 'ESG Reporting Tools',
      description: 'Carbon tracking and reporting',
      videoSrc: '/videos/carbon-calculator.mp4',
      thumbnail: '/assets/thumbnails/carbon-calculator.jpg',
    },
  ],
  admin: [
    {
      id: 'welcome',
      title: 'Welcome to ABFI Admin',
      description: 'Platform overview for administrators',
      videoSrc: '/videos/welcome.mp4',
      thumbnail: '/assets/thumbnails/welcome.jpg',
    },
  ],
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  userRole = 'grower',
}) => {
  const steps = ONBOARDING_VIDEOS[userRole] || ONBOARDING_VIDEOS.grower;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const handleVideoComplete = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      localStorage.setItem('abfi_onboarding_completed', 'true');
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('abfi_onboarding_skipped', 'true');
    onClose();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-black">
              Getting Started with ABFI
            </h2>
            <p className="text-gray-600 mt-1">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-2 px-6 py-4 bg-gray-50">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-[#D4AF37]'
                    : 'bg-gray-200'
                }`}
                style={{
                  width: index === currentStep ? '50%' : index < currentStep ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div className="p-6">
          <AvatarVideoPlayer
            videoSrc={currentStepData.videoSrc}
            title={currentStepData.title}
            description={currentStepData.description}
            thumbnail={currentStepData.thumbnail}
            autoPlay={false}
            onComplete={handleVideoComplete}
            className="shadow-lg"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-black hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-lg transition-colors"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 pb-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-[#D4AF37] w-8'
                  : completedSteps.has(index)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
