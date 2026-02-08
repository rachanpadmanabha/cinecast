import React, { RefObject, useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, Plus, Check, ThumbsUp, Volume2, VolumeX, Settings, Maximize } from 'lucide-react';
import { VideoData, PlaybackStats as PlaybackStatsType } from '../types';
import { formatTime } from '../utils/helpers';
import { PLAYBACK_SPEEDS, QUALITY_OPTIONS } from '../constants';

interface NetflixVideoModalProps {
  video: VideoData;
  videoRef: RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLiked: boolean;
  isInMyList: boolean;
  playbackStats: PlaybackStatsType;
  isSeeking: boolean;
  isBuffering: boolean;
  onClose: () => void;
  onTogglePlay: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onToggleLike: () => void;
  onToggleList: () => void;
  onToggleFullscreen: () => void;
}

const NetflixVideoModal: React.FC<NetflixVideoModalProps> = ({
  video,
  videoRef,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLiked,
  isInMyList,
  playbackStats,
  isSeeking,
  isBuffering,
  onClose,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLike,
  onToggleList,
  onToggleFullscreen
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls logic
  useEffect(() => {
    if (!isPlaying) {
      // Always show controls when paused
      setShowControls(true);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
        hideControlsTimeout.current = null;
      }
      return;
    }

    // When video starts playing, start the hide timer
    const startHideTimer = () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    };

    startHideTimer();

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [isPlaying]);

  const handleMouseMove = () => {
    // Show controls on mouse movement
    setShowControls(true);
    
    // Reset hide timer if video is playing
    if (isPlaying) {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  };

  const handleChangeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleChangeQuality = (newQuality: string) => {
    setQuality(newQuality);
    // In a real implementation, this would switch video sources
  };

  return (
    <div 
      id="video-modal-container"
      className={`fixed inset-0 bg-black z-50 ${isFullscreen ? 'overflow-hidden' : 'overflow-y-auto'}`}
      onMouseMove={handleMouseMove}
    >
      {/* Back Button */}
      <button
        onClick={onClose}
        className={`absolute top-6 left-6 z-50 w-12 h-12 flex items-center justify-center bg-black/80 hover:bg-black rounded-full transition-all ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Video Player Section */}
      <div 
        className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full aspect-video'} bg-black cursor-pointer`}
        onClick={onTogglePlay}
      >
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full pointer-events-none"
          preload="auto"
          playsInline
          crossOrigin="anonymous"
          controlsList="nodownload nofullscreen"
          disablePictureInPicture
        />

        {/* Seeking/Buffering Indicator */}
        {(isSeeking || isBuffering) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
              <span className="text-white text-lg font-medium drop-shadow-lg">
                {isSeeking ? 'Seeking...' : 'Loading...'}
              </span>
            </div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        {!isPlaying && !isSeeking && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
            <div className="w-20 h-20 flex items-center justify-center bg-white/20 border-4 border-white rounded-full backdrop-blur-sm">
              <Play className="w-10 h-10 text-white fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-8 transition-opacity duration-300 pointer-events-none ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div 
            className="relative h-1 bg-gray-600 mb-4 cursor-pointer group pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onSeek(e);
            }}
          >
            <div 
              className="absolute h-full bg-red-600"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div 
              className="absolute w-4 h-4 bg-red-600 rounded-full top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlay();
                }} 
                className="text-white hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
              </button>

              <span className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                  }} 
                  className="text-white hover:scale-110 transition-transform"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={onVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-24 accent-red-600"
                />
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
                className="text-white hover:scale-110 transition-transform relative"
              >
                <Settings className="w-6 h-6" />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFullscreen();
                }} 
                className="text-white hover:scale-110 transition-transform"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div 
            className="absolute bottom-24 right-8 bg-slate-900/95 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-2xl min-w-[200px] z-40 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-bold text-sm mb-3 text-red-500">Playback Settings</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-2">Speed</p>
                <div className="flex gap-2 flex-wrap">
                  {PLAYBACK_SPEEDS.map(speed => (
                    <button
                      key={speed}
                      onClick={() => handleChangeSpeed(speed)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        playbackSpeed === speed
                          ? 'bg-gradient-to-r from-red-600 to-red-700'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Quality</p>
                <select 
                  value={quality}
                  onChange={(e) => handleChangeQuality(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-white/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500/50 cursor-pointer hover:bg-white/20 transition-all"
                >
                  {QUALITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info Section - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="max-w-6xl mx-auto px-12 py-12">
        <div className="grid grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-400 font-bold text-lg">{Math.floor(video.rating * 20)}% Match</span>
              {video.year && <span className="text-gray-400">{video.year}</span>}
              {video.ageRating && (
                <span className="border border-gray-500 px-2 py-0.5 text-gray-400">
                  {video.ageRating}
                </span>
              )}
              {video.type === 'series' && video.seasons && (
                <span className="text-gray-400">{video.seasons} Season{video.seasons > 1 ? 's' : ''}</span>
              )}
              <span className="border border-gray-500 px-2 py-0.5 text-gray-400">
                {video.quality}
              </span>
            </div>

            <p className="text-white text-lg leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-4 text-sm">
            {video.cast && video.cast.length > 0 && (
              <div>
                <span className="text-gray-400">Cast: </span>
                <span className="text-white">{video.cast.join(', ')}</span>
              </div>
            )}

            {video.genres && video.genres.length > 0 && (
              <div>
                <span className="text-gray-400">Genres: </span>
                <span className="text-white">{video.genres.join(', ')}</span>
              </div>
            )}

            {video.director && (
              <div>
                <span className="text-gray-400">Director: </span>
                <span className="text-white">{video.director}</span>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
              <button
                onClick={onToggleList}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isInMyList ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </button>
              <button
                onClick={onToggleLike}
                className={`transition-colors ${isLiked ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <ThumbsUp className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default NetflixVideoModal;

