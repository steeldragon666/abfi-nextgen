import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Scene {
  id: number;
  title: string;
  description: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  icon: React.ReactNode;
  color: string;
}

interface HeyGenExplainerVideoProps {
  videoId: string;
  title: string;
  description: string;
  scenes: Scene[];
  className?: string;
}

export function HeyGenExplainerVideo({
  videoId,
  title,
  description,
  scenes,
  className = '',
}: HeyGenExplainerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeScene, setActiveScene] = useState<number>(0);
  const [completedScenes, setCompletedScenes] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // HeyGen video URL - adjust if needed based on actual CDN structure
  const videoUrl = `https://files2.heygen.ai/video/v1/${videoId}/video.mp4`;
  const thumbnailUrl = `https://files2.heygen.ai/video/v1/${videoId}/thumbnail.jpg`;

  useEffect(() => {
    // Determine which scene is currently active based on playback time
    const scene = scenes.find(
      (s) => currentTime >= s.startTime && currentTime < s.endTime
    );
    if (scene) {
      setActiveScene(scene.id);

      // Mark scene as completed when we reach near the end
      if (currentTime >= scene.endTime - 0.5) {
        setCompletedScenes((prev) => new Set([...prev, scene.id]));
      }
    }
  }, [currentTime, scenes]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoaded(true);
    }
  };

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

  const jumpToScene = (scene: Scene) => {
    if (videoRef.current) {
      videoRef.current.currentTime = scene.startTime;
      setActiveScene(scene.id);
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      videoRef.current.currentTime = percentage * duration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSceneProgress = (scene: Scene) => {
    if (currentTime < scene.startTime) return 0;
    if (currentTime >= scene.endTime) return 100;
    return ((currentTime - scene.startTime) / (scene.endTime - scene.startTime)) * 100;
  };

  const overallProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          AI Avatar Explainer
        </Badge>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Video Player */}
        <div className="col-span-8">
          <Card className="overflow-hidden border-2">
            <div className="relative bg-black">
              {/* Video Element */}
              <video
                ref={videoRef}
                src={videoUrl}
                poster={thumbnailUrl}
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  setCompletedScenes(new Set(scenes.map((s) => s.id)));
                }}
              />

              {/* Play Overlay */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#D4AF37] hover:bg-[#B8941F] transition-all hover:scale-110">
                    <Play className="w-10 h-10 text-black ml-1" fill="black" />
                  </div>
                </div>
              )}

              {/* Scene Indicator */}
              {isLoaded && scenes[activeScene] && (
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge
                    className="text-white border-0"
                    style={{ backgroundColor: scenes[activeScene].color }}
                  >
                    Scene {activeScene + 1}: {scenes[activeScene].title}
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Badge>
                </div>
              )}

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                {/* Scene Progress Markers */}
                <div className="relative h-2 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={handleProgressClick}>
                  {/* Scene Divisions */}
                  {scenes.map((scene, idx) => (
                    <div
                      key={scene.id}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: `${(scene.startTime / duration) * 100}%`,
                        width: `${((scene.endTime - scene.startTime) / duration) * 100}%`,
                        borderRight: idx < scenes.length - 1 ? '2px solid rgba(255,255,255,0.5)' : 'none',
                      }}
                    />
                  ))}
                  {/* Progress Fill */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[#D4AF37] rounded-full transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                  {/* Scene Labels */}
                  {scenes.map((scene) => (
                    <div
                      key={`label-${scene.id}`}
                      className="absolute -top-5 text-[10px] text-white/70 transform -translate-x-1/2"
                      style={{ left: `${((scene.startTime + scene.endTime) / 2 / duration) * 100}%` }}
                    >
                      {scene.id + 1}
                    </div>
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#D4AF37] hover:bg-[#B8941F] transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-black" fill="black" />
                      ) : (
                        <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => videoRef.current?.requestFullscreen()}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Scene Navigation */}
        <div className="col-span-4 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
            Video Sections
          </h3>
          {scenes.map((scene) => {
            const isActive = activeScene === scene.id;
            const isCompleted = completedScenes.has(scene.id);
            const progress = getSceneProgress(scene);

            return (
              <Card
                key={scene.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isActive ? 'ring-2' : ''
                }`}
                style={{
                  borderColor: isActive ? scene.color : undefined,
                  // @ts-expect-error CSS custom property
                  '--tw-ring-color': scene.color,
                }}
                onClick={() => jumpToScene(scene)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${scene.color}20` }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" style={{ color: scene.color }} />
                      ) : (
                        <span style={{ color: scene.color }}>{scene.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {scene.title}
                        </h4>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: scene.color }} />
                        )}
                      </div>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
                        {scene.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={progress} className="h-1 flex-1" />
                        <span className="text-[10px] text-gray-500">
                          {formatTime(scene.endTime - scene.startTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Completion Status */}
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--text-tertiary)' }}>Progress</span>
              <span className="font-medium" style={{ color: 'var(--accent-gold)' }}>
                {completedScenes.size}/{scenes.length} scenes
              </span>
            </div>
            <Progress value={(completedScenes.size / scenes.length) * 100} className="h-2 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeyGenExplainerVideo;
