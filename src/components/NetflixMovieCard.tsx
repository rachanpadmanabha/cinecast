/**
 * NetflixMovieCard Component
 * 
 * Individual video card with Netflix-signature hover effects.
 * Features:
 * - Scales to 1.25x on hover
 * - Shows expanded info section below thumbnail on hover
 * - Action buttons (Play, Add to List, Like, More Info)
 * - Opens full-screen preview modal on chevron click
 * - Top 10 ranking number support
 * - Age rating badges
 * - Match percentage display
 * 
 * Hover Behavior:
 * 1. Mouse enters → Card starts scaling after 400ms delay
 * 2. Card scales to 1.25x with shadow
 * 3. Info section expands below with dark background
 * 4. Action buttons and metadata appear
 * 
 * @component
 * @param {VideoData} video - Video data to display
 * @param {Function} onPlay - Callback when play button clicked
 * @param {Function} onAddToList - Callback to add/remove from My List
 * @param {boolean} isInMyList - Whether video is in user's My List
 * @param {number} rank - Optional Top 10 ranking (1-10)
 * @param {VideoData[]} allVideos - All videos for similar content
 */

import React, { useState } from 'react';
import { Play, Plus, Check, ChevronDown, ThumbsUp } from 'lucide-react';
import { VideoData } from '../types';
import NetflixPreview from './NetflixPreview';

interface NetflixMovieCardProps {
  video: VideoData;
  onPlay: (video: VideoData) => void;
  onAddToList: (videoId: number) => void;
  isInMyList: boolean;
  rank?: number; // For Top 10
  allVideos?: VideoData[];
}

const NetflixMovieCard: React.FC<NetflixMovieCardProps> = ({
  video,
  onPlay,
  onAddToList,
  isInMyList,
  rank,
  allVideos = []
}) => {
  /** Controls card scaling animation */
  const [isHovered, setIsHovered] = useState(false);
  
  /** Controls full-screen preview modal visibility */
  const [showPreview, setShowPreview] = useState(false);
  
  /** Tracks like state for this video */
  const [isLiked, setIsLiked] = useState(false);
  
  /** Timeout reference for hover delay (Netflix uses delay before showing details) */
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /** 
   * Filters and returns similar videos based on category and genres
   * Used for "More Like This" section in preview modal
   */
  const similarVideos = allVideos
    .filter(v => v.id !== video.id && (
      v.category === video.category || 
      v.genres?.some(g => video.genres?.includes(g))
    ))
    .slice(0, 3);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  return (
    <div 
      className="relative cursor-pointer transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        minWidth: rank ? '280px' : '280px',
        zIndex: isHovered ? 50 : 1
      }}
    >
      {/* Top 10 Number */}
      {rank && (
        <div className="absolute -left-14 -top-3 -bottom-3 flex items-center pointer-events-none" style={{ zIndex: 0 }}>
          <span 
            className="text-[180px] font-black leading-none select-none"
            style={{ 
              WebkitTextStroke: '3px #2a2a2a',
              color: 'transparent',
              textShadow: '0 0 12px rgba(0,0,0,0.9)'
            }}
          >
            {rank}
          </span>
        </div>
      )}

      {/* Card Container */}
      <div 
        className={`relative bg-zinc-900 transform transition-all duration-300 ${
          isHovered ? 'scale-125 shadow-2xl rounded-md' : 'scale-100 rounded-md'
        }`}
        style={{ marginLeft: rank ? '48px' : '0' }}
      >
        {/* Thumbnail */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full aspect-video object-cover ${isHovered ? 'rounded-t-md' : 'rounded-md'}`}
        />

        {/* Age Rating Badge (Always visible when not hovered) */}
        {!isHovered && video.ageRating && (
          <div className="absolute top-2 left-2">
            <span className="bg-black/70 border border-gray-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {video.ageRating}
            </span>
          </div>
        )}

        {/* Expanded Info Section (Appears on Hover) */}
        {isHovered && (
          <div className="bg-zinc-900 p-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(video);
                }}
                className="w-9 h-9 flex items-center justify-center bg-white hover:bg-white/90 rounded-full transition-all"
              >
                <Play className="w-4 h-4 text-black fill-current ml-0.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToList(video.id);
                }}
                className="w-9 h-9 flex items-center justify-center border-2 border-gray-500 hover:border-white bg-transparent hover:bg-white/10 rounded-full transition-all"
              >
                {isInMyList ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Plus className="w-4 h-4 text-white" />
                )}
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className={`w-9 h-9 flex items-center justify-center border-2 transition-all rounded-full ${
                  isLiked 
                    ? 'border-white bg-white' 
                    : 'border-gray-500 hover:border-white bg-transparent hover:bg-white/10'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'text-black fill-current' : 'text-white'}`} />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(true);
                }}
                className="ml-auto w-9 h-9 flex items-center justify-center border-2 border-gray-500 hover:border-white bg-transparent hover:bg-white/10 rounded-full transition-all"
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-1">
              {video.title}
            </h3>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="text-green-400 font-bold">{Math.floor(video.rating * 20)}% Match</span>
              {video.ageRating && (
                <span className="border border-gray-500 px-1 text-gray-400 text-[10px]">
                  {video.ageRating}
                </span>
              )}
              {video.duration && <span className="text-gray-400">{video.duration}</span>}
              {video.quality === '4K' && (
                <span className="border border-gray-500 px-1 text-gray-400 font-bold text-[10px]">4K</span>
              )}
            </div>

            {/* Genres */}
            {video.genres && video.genres.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400 flex-wrap">
                {video.genres.slice(0, 3).map((genre, idx) => (
                  <span key={idx}>
                    {genre}
                    {idx < Math.min(2, video.genres!.length - 1) && <span className="mx-1">•</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Netflix Preview (Full-screen modal) */}
      {showPreview && (
        <NetflixPreview
          video={video}
          isInMyList={isInMyList}
          isLiked={isLiked}
          onPlay={() => {
            setShowPreview(false);
            onPlay(video);
          }}
          onAddToList={() => onAddToList(video.id)}
          onToggleLike={() => setIsLiked(!isLiked)}
          onClose={() => setShowPreview(false)}
          onExpand={() => {
            setShowPreview(false);
            onPlay(video);
          }}
          similarVideos={similarVideos}
          onVideoSelect={(v) => {
            setShowPreview(false);
            onPlay(v);
          }}
        />
      )}
    </div>
  );
};

export default NetflixMovieCard;
