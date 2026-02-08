/**
 * ContentRow Component
 * 
 * Netflix-signature horizontal scrollable row of video cards.
 * Features:
 * - Smooth horizontal scrolling
 * - Left/Right arrow navigation (appears on hover)
 * - Hidden scrollbars for clean look
 * - Support for Top 10 ranking badges
 * - Responsive width-based scrolling
 * 
 * This is the core Netflix UI pattern - multiple rows stacked vertically,
 * each containing horizontally scrollable content.
 * 
 * @component
 * @param {string} title - Row title (e.g., "Trending Now", "Top 10")
 * @param {VideoData[]} videos - Array of videos to display in this row
 * @param {Function} onVideoSelect - Callback when video is selected
 * @param {Function} onAddToList - Callback to add/remove from My List
 * @param {number[]} myList - Array of video IDs in user's My List
 * @param {boolean} isTop10 - Whether to show Top 10 ranking numbers
 * @param {VideoData[]} allVideos - All videos for similar content suggestions
 */

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoData } from '../types';
import NetflixMovieCard from './NetflixMovieCard';

interface ContentRowProps {
  title: string;
  videos: VideoData[];
  onVideoSelect: (video: VideoData) => void;
  onAddToList: (videoId: number) => void;
  myList: number[];
  isTop10?: boolean;
  allVideos?: VideoData[];
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  videos,
  onVideoSelect,
  onAddToList,
  myList,
  isTop10 = false,
  allVideos = []
}) => {
  /** Reference to scrollable container for programmatic scrolling */
  const rowRef = useRef<HTMLDivElement>(null);
  
  /** Controls visibility of left scroll arrow */
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  
  /** Controls visibility of right scroll arrow */
  const [showRightArrow, setShowRightArrow] = useState(true);

  /**
   * Scrolls the row left or right by ~80% of container width
   * Uses smooth scrolling for Netflix-like experience
   * @param direction - 'left' or 'right'
   */
  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? rowRef.current.scrollLeft - scrollAmount
        : rowRef.current.scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Updates arrow visibility based on scroll position
   * Left arrow: visible when scrolled from start
   * Right arrow: visible when more content is available
   */
  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 0);
      setShowRightArrow(
        rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.clientWidth - 10
      );
    }
  };

  return (
    <div className="relative group/row px-16 overflow-visible">
      {/* Row Title */}
      <h2 className="text-white text-xl font-bold mb-2 hover:text-gray-300 transition-colors cursor-pointer">
        {title}
      </h2>

      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-black/80 hover:bg-black flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Scrollable Content */}
      <div 
        ref={rowRef}
        onScroll={handleScroll}
        className="flex gap-1 overflow-x-scroll overflow-y-visible scrollbar-hide scroll-smooth py-10 -mx-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, index) => (
          <NetflixMovieCard
            key={video.id}
            video={video}
            onPlay={onVideoSelect}
            onAddToList={onAddToList}
            isInMyList={myList.includes(video.id)}
            rank={isTop10 ? index + 1 : undefined}
            allVideos={allVideos}
          />
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-black/80 hover:bg-black flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default ContentRow;

