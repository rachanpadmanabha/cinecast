import React, { RefObject } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Cast, Settings, Minimize, Maximize2, Sparkles, Zap } from 'lucide-react';
import { VideoData } from '../types';
import { formatTime } from '../utils/helpers';
import { PLAYBACK_SPEEDS, QUALITY_OPTIONS } from '../constants';

interface VideoPlayerProps {
  video: VideoData;
  videoRef: RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  showControls: boolean;
  isCasting: boolean;
  isCastSDKReady: boolean;
  isPiP: boolean;
  showSettings: boolean;
  playbackSpeed: number;
  quality: string;
  onTogglePlayPause: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onSkipTime: (seconds: number) => void;
  onTogglePiP: () => void;
  onCastToDevice: () => void;
  onToggleFullscreen: () => void;
  onToggleSettings: () => void;
  onChangeSpeed: (speed: number) => void;
  onChangeQuality: (quality: string) => void;
  onMouseMove: () => void;
  onMouseLeave: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  videoRef,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isBuffering,
  showControls,
  isCasting,
  isCastSDKReady,
  isPiP,
  showSettings,
  playbackSpeed,
  quality,
  onTogglePlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onSkipTime,
  onTogglePiP,
  onCastToDevice,
  onToggleFullscreen,
  onToggleSettings,
  onChangeSpeed,
  onChangeQuality,
  onMouseMove,
  onMouseLeave
}) => {
  return (
    <div 
      className="relative bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <video
        key={video.id}
        ref={videoRef}
        src={video.url}
        className="w-full aspect-video"
        onClick={onTogglePlayPause}
        preload="metadata"
        playsInline
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>
      )}

      {/* Center Play Button */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
          <button 
            onClick={onTogglePlayPause}
            className="group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-24 h-24 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border-4 border-white/50 group-hover:scale-110 group-hover:border-white transition-all">
                <Play className="w-12 h-12 ml-2" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Quality Badge */}
      <div className="absolute top-4 right-4 flex gap-2">
        <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
          <Sparkles className="w-3 h-3" />
          {video.quality}
        </span>
        {isCasting && (
          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
            <Cast className="w-3 h-3" />
            Casting
          </span>
        )}
      </div>

      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="px-8 pt-12">
          <div 
            className="relative h-2 bg-white/20 rounded-full cursor-pointer group"
            onClick={onSeek}
          >
            <div 
              className="absolute h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all shadow-lg shadow-cyan-500/50"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div 
              className="absolute w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full shadow-xl transform -translate-y-1/2 top-1/2 opacity-0 group-hover:opacity-100 transition-all ring-4 ring-white/30"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onSkipTime(-10)}
              className="hover:scale-110 active:scale-95 transition-transform"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button 
              onClick={onTogglePlayPause}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full hover:scale-110 active:scale-95 transition-transform shadow-2xl">
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </div>
            </button>
            
            <button 
              onClick={() => onSkipTime(10)}
              className="hover:scale-110 active:scale-95 transition-transform"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <span className="text-sm font-bold ml-2 bg-white/10 px-3 py-1.5 rounded-lg">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
              <button onClick={onToggleMute} className="hover:scale-110 active:scale-95 transition-transform">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={onVolumeChange}
                className="w-24 accent-cyan-500"
              />
            </div>

            <button 
              onClick={onToggleSettings}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all relative"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button 
              onClick={onTogglePiP}
              className={`p-2.5 hover:bg-white/10 rounded-xl transition-all ${isPiP ? 'text-cyan-400' : ''}`}
              title="Picture-in-Picture (P)"
            >
              {isPiP ? <Minimize className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            <button 
              onClick={onCastToDevice}
              className={`p-2.5 hover:bg-white/10 rounded-xl transition-all ${isCasting ? 'text-purple-400' : isCastSDKReady ? '' : 'opacity-50'}`}
              title={isCastSDKReady ? "Cast to TV" : "Cast SDK Loading..."}
              disabled={!isCastSDKReady}
            >
              <Cast className="w-5 h-5" />
            </button>

            <button 
              onClick={onToggleFullscreen}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all"
              title="Fullscreen (F)"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute bottom-24 right-8 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl min-w-[200px]">
          <h4 className="font-bold text-sm mb-3 text-cyan-400">Playback Settings</h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-2">Speed</p>
              <div className="flex gap-2">
                {PLAYBACK_SPEEDS.map(speed => (
                  <button
                    key={speed}
                    onClick={() => onChangeSpeed(speed)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      playbackSpeed === speed
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
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
                onChange={(e) => onChangeQuality(e.target.value)}
                className="w-full bg-white/10 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50 cursor-pointer hover:bg-white/20 transition-all"
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
  );
};

export default VideoPlayer;

