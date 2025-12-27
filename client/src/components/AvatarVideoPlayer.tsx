import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';

interface AvatarVideoPlayerProps {
  videoSrc: string;
  title: string;
  description?: string;
  thumbnail?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const AvatarVideoPlayer: React.FC<AvatarVideoPlayerProps> = ({
  videoSrc,
  title,
  description,
  thumbnail,
  autoPlay = false,
  onComplete,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Title */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-white/80 text-sm mt-1">{description}</p>
        )}
      </div>

      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={thumbnail}
        className="w-full aspect-video"
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(isPlaying ? false : true)}
      />

      {/* Video Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4">
          {/* Progress Bar */}
          <div
            className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-[#D4AF37] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#D4AF37] hover:bg-[#B8941F] transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black" fill="black" />
                ) : (
                  <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                )}
              </button>

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Play Overlay (when paused) */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#D4AF37] hover:bg-[#B8941F] transition-all hover:scale-110">
            <Play className="w-10 h-10 text-black ml-1" fill="black" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarVideoPlayer;
