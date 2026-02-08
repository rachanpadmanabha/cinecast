/**
 * HeroBanner Component
 * 
 * Large hero banner section at the top of Netflix home screen.
 * Features:
 * - Full-width background with auto-playing video preview
 * - Featured content title and metadata
 * - Play and More Info action buttons
 * - Mute toggle for background video
 * - Gradient overlays for text readability
 * - Smooth transition from image to video (Netflix-style)
 * 
 * @component
 * @param {VideoData} video - Featured video to display in banner
 * @param {Function} onPlay - Callback when Play button is clicked
 * @param {Function} onMoreInfo - Callback when More Info button is clicked
 */

import React, { useEffect, useState, useRef } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { VideoData } from '../types';

interface HeroBannerProps {
  video: VideoData;
  onPlay: () => void;
  onMoreInfo: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ video, onPlay, onMoreInfo }) => {
  /** Whether background audio is muted */
  const [isMuted, setIsMuted] = useState(true);
  
  /** Controls transition from static image to auto-playing video */
  const [showVideo, setShowVideo] = useState(false);
  
  /** Reference to background video element for control */
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Delays video loading to allow image to load first
   * Creates smooth Netflix-style transition: image → video
   */
  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 1500);
    return () => clearTimeout(timer);
  }, [video.id]);

  /**
   * Auto-plays background video when ready
   * Muted by default for better UX (Netflix pattern)
   */
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [showVideo]);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {showVideo ? (
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            autoPlay
            preload="auto"
            crossOrigin="anonymous"
          />
        ) : (
          <img 
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-32 px-16 z-20">
        <div className="max-w-xl space-y-4">
          {/* Netflix Original Badge */}
          {video.trending && (
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-black text-sm tracking-widest">CINECAST</span>
              <span className="text-gray-400 text-sm uppercase tracking-wider">Original</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl font-black text-white leading-tight drop-shadow-2xl">
            {video.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-base">
            <span className="text-green-400 font-bold">{Math.floor(video.rating * 20)}% Match</span>
            {video.year && <span className="text-gray-300">{video.year}</span>}
            {video.ageRating && (
              <span className="border border-gray-400 px-2 py-0.5 text-sm text-gray-300">
                {video.ageRating}
              </span>
            )}
            {video.type === 'series' && video.seasons && (
              <span className="text-gray-300">{video.seasons} Season{video.seasons > 1 ? 's' : ''}</span>
            )}
            <span className="border border-gray-400 px-2 py-0.5 text-xs text-gray-300">
              {video.quality}
            </span>
          </div>

          {/* Description */}
          <p className="text-white text-lg leading-normal max-w-lg line-clamp-3 drop-shadow-lg">
            {video.description}
          </p>

          {/* Genres */}
          {video.genres && video.genres.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              {video.genres.slice(0, 3).map((genre, idx) => (
                <span key={idx}>
                  {genre}
                  {idx < Math.min(2, video.genres!.length - 1) && <span className="mx-1">•</span>}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onPlay}
              className="flex items-center gap-2 bg-white hover:bg-white/80 text-black px-6 py-2 rounded font-bold text-base transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </button>

            <button
              onClick={onMoreInfo}
              className="flex items-center gap-2 bg-gray-500/70 hover:bg-gray-500/50 text-white px-6 py-2 rounded font-bold text-base transition-all"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>

            <button
              onClick={() => {
                const newMuted = !isMuted;
                setIsMuted(newMuted);
                if (videoRef.current) {
                  videoRef.current.muted = newMuted;
                }
              }}
              className="ml-auto w-12 h-12 flex items-center justify-center border-2 border-gray-400 hover:border-white hover:bg-white/10 rounded-full transition-all"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

