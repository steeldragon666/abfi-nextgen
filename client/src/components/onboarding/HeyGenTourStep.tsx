import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';

interface HeyGenTourStepProps {
  title: string;
  description: string;
  videoUrl: string;
  onComplete: () => void;
}

export const HeyGenTourStep: React.FC<HeyGenTourStepProps> = ({
  title,
  description,
  videoUrl,
  onComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {!isPlaying && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <ChevronRight className="w-8 h-8 text-black ml-1" />
              </div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}
        
        {videoError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center p-4">
              <p className="text-white text-sm mb-2">Video not available yet</p>
              <p className="text-gray-400 text-xs">HeyGen videos are still processing</p>
            </div>
          </div>
        ) : (
          <video
            src={videoUrl}
            autoPlay
            muted
            playsInline
            onEnded={onComplete}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => {
            localStorage.setItem('abfi-has-seen-tour', 'true');
            onComplete();
          }}
          className="px-4 py-2 text-gray-600 hover:text-black text-sm font-medium transition-colors"
        >
          Skip Tour
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-semibold rounded-lg transition-colors text-sm"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
};
