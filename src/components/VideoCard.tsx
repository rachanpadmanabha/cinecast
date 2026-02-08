import React from 'react';
import { Play, Star, Eye, Check, Plus, Flame, Tv } from 'lucide-react';
import { VideoData } from '../types';

interface VideoCardProps {
  video: VideoData;
  onVideoClick: () => void;
  onAddToList?: (e: React.MouseEvent) => void;
  isInMyList: boolean;
  showAddButton?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onVideoClick,
  onAddToList,
  isInMyList,
  showAddButton = true
}) => {
  return (
    <div className="group cursor-pointer relative">
      <div onClick={onVideoClick} className="relative overflow-hidden rounded-2xl mb-4 bg-white/5 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-75" />
            <div className="relative w-20 h-20 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-4 border-white">
              <Play className="w-10 h-10 ml-1" />
            </div>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-2">
            {video.trending && (
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Flame className="w-3 h-3" />
                Trending
              </span>
            )}
            {video.ageRating && (
              <span className="px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-bold">
                {video.ageRating}
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {showAddButton && onAddToList && (
              <button
                onClick={onAddToList}
                className={`p-2 rounded-full backdrop-blur-md transition-all ${
                  isInMyList
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-black/80 hover:bg-white/20'
                }`}
                title={isInMyList ? 'Remove from My List' : 'Add to My List'}
              >
                {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            )}
            <span className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-bold">
              {video.quality}
            </span>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-xs font-bold inline-block">
              {video.duration}
            </span>
            {video.type === 'series' && video.seasons && (
              <span className="px-2 py-1 bg-purple-600/80 backdrop-blur-sm rounded text-xs font-bold flex items-center gap-1">
                <Tv className="w-3 h-3" />
                {video.seasons}S
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Video Info */}
      <h3 className="font-bold text-xl mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
        {video.title}
      </h3>
      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
        {video.description}
      </p>
      
      <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
        {video.year && <span className="font-semibold">{video.year}</span>}
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {video.views}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          {video.rating}
        </span>
        <span className="px-3 py-1 bg-indigo-600/20 rounded-full text-xs font-semibold">
          {video.category}
        </span>
      </div>
    </div>
  );
};

export default VideoCard;

