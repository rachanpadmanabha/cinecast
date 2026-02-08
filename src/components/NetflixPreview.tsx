/**
 * NetflixPreview Component
 * 
 * Full-screen preview modal that appears when chevron down is clicked.
 * This is Netflix's signature "More Info" preview feature.
 * 
 * Features:
 * - Centered modal (900px wide) with dark backdrop
 * - Auto-playing video preview (muted, looping)
 * - All action buttons (Play, Add, Like, Expand)
 * - Full video metadata and description
 * - "More Like This" section with 3 similar videos
 * - Prevents background scrolling
 * - Uses React Portal for proper z-index layering
 * 
 * @component
 * @param {VideoData} video - Video to preview
 * @param {boolean} isInMyList - Whether video is in My List
 * @param {boolean} isLiked - Whether user has liked this video
 * @param {Function} onPlay - Opens full video player modal
 * @param {Function} onAddToList - Adds/removes from My List
 * @param {Function} onToggleLike - Toggles like state
 * @param {Function} onClose - Closes preview modal
 * @param {Function} onExpand - Opens full video modal
 * @param {VideoData[]} similarVideos - Similar content to show
 * @param {Function} onVideoSelect - Handles similar video selection
 */

import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Play, Plus, Check, ThumbsUp, Volume2, VolumeX, ChevronDown, Star } from 'lucide-react';
import { VideoData } from '../types';

interface NetflixPreviewProps {
  video: VideoData;
  isInMyList: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onAddToList: () => void;
  onToggleLike: () => void;
  onClose: () => void;
  onExpand: () => void;
  similarVideos?: VideoData[];
  onVideoSelect?: (video: VideoData) => void;
}

const NetflixPreview: React.FC<NetflixPreviewProps> = ({
  video,
  isInMyList,
  isLiked,
  onPlay,
  onAddToList,
  onToggleLike,
  onClose,
  onExpand,
  similarVideos = [],
  onVideoSelect
}) => {
  /** Whether preview video audio is muted */
  const [isMuted, setIsMuted] = React.useState(true);
  
  /** Reference to preview video element */
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Initializes preview modal:
   * - Auto-plays preview video (muted)
   * - Locks background page scrolling
   * - Restores scrolling on unmount
   */
  useEffect(() => {
    // Auto-play preview video
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore scrolling when modal closes
      document.body.style.overflow = 'unset';
    };
  }, []);

  const modalContent = (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/80"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      
      {/* Preview Modal */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-[90vw] max-h-[90vh] bg-zinc-900 rounded-lg shadow-2xl overflow-y-auto overflow-x-hidden animate-fadeIn"
        style={{ zIndex: 9999 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-2 right-2 float-right z-10 w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

      {/* Video Preview */}
      <div className="relative aspect-video bg-black -mt-10">
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          preload="auto"
          crossOrigin="anonymous"
        />
        
        {/* Mute Toggle */}
        <button
          onClick={() => {
            const newMuted = !isMuted;
            setIsMuted(newMuted);
            if (videoRef.current) {
              videoRef.current.muted = newMuted;
            }
          }}
          className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center border-2 border-white bg-black/60 rounded-full hover:bg-black/80 transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-900 to-transparent" />
      </div>

      {/* Info Section */}
      <div className="p-4">
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onPlay}
            className="w-9 h-9 flex items-center justify-center bg-white hover:bg-white/90 rounded-full transition-all"
          >
            <Play className="w-4 h-4 text-black fill-current ml-0.5" />
          </button>

          <button
            onClick={onAddToList}
            className="w-9 h-9 flex items-center justify-center border-2 border-gray-500 hover:border-white bg-transparent hover:bg-white/10 rounded-full transition-all"
          >
            {isInMyList ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
          </button>

          <button 
            onClick={onToggleLike}
            className={`w-9 h-9 flex items-center justify-center border-2 ${
              isLiked 
                ? 'border-white bg-white' 
                : 'border-gray-500 hover:border-white bg-transparent hover:bg-white/10'
            } rounded-full transition-all`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'text-black fill-current' : 'text-white'}`} />
          </button>

          <button 
            onClick={onExpand}
            className="ml-auto w-9 h-9 flex items-center justify-center border-2 border-gray-500 hover:border-white bg-transparent hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-base mb-2">
          {video.title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <span className="text-green-400 font-bold">{Math.floor(video.rating * 20)}% Match</span>
          {video.year && <span className="text-gray-400">{video.year}</span>}
          {video.ageRating && (
            <span className="border border-gray-500 px-1.5 py-0.5 text-xs text-gray-400">
              {video.ageRating}
            </span>
          )}
          {video.duration && <span className="text-gray-400">{video.duration}</span>}
          {video.quality === '4K' && (
            <span className="border border-gray-500 px-1.5 py-0.5 text-xs text-gray-400 font-bold">4K</span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* Genres */}
        {video.genres && video.genres.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {video.genres.slice(0, 3).map((genre, idx) => (
              <span key={idx}>
                {genre}
                {idx < Math.min(2, video.genres!.length - 1) && <span className="mx-1">•</span>}
              </span>
            ))}
          </div>
        )}

        {/* Similar Content */}
        {similarVideos && similarVideos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <h4 className="text-white font-semibold text-sm mb-3">More Like This</h4>
            <div className="grid grid-cols-3 gap-3">
              {similarVideos.slice(0, 3).map(similar => (
                <div
                  key={similar.id}
                  onClick={() => {
                    onClose();
                    onVideoSelect?.(similar);
                  }}
                  className="cursor-pointer group/similar"
                >
                  <div className="relative rounded overflow-hidden mb-2">
                    <img
                      src={similar.thumbnail}
                      alt={similar.title}
                      className="w-full aspect-video object-cover group-hover/similar:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/similar:bg-black/20 transition-colors" />
                  </div>
                  <h5 className="text-white text-xs font-medium line-clamp-1 group-hover/similar:text-gray-300">
                    {similar.title}
                  </h5>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span>{similar.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default NetflixPreview;

