import React from 'react';
import { Play, Star, Eye, Clock, Check, Plus, Flame, Tv } from 'lucide-react';
import { VideoData } from '../types';

interface VideoGridProps {
  videos: VideoData[];
  viewMode: 'grid' | 'list';
  myList: number[];
  onVideoSelect: (video: VideoData) => void;
  onAddToList: (videoId: number) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  viewMode,
  myList,
  onVideoSelect,
  onAddToList
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map(video => (
          <div
            key={video.id}
            className="group cursor-pointer relative"
          >
            <div onClick={() => onVideoSelect(video)} className="relative overflow-hidden rounded-2xl mb-4 bg-white/5 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-xl">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-75" />
                  <div className="relative w-20 h-20 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-4 border-white">
                    <Play className="w-10 h-10 ml-1" />
                  </div>
                </div>
              </div>

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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToList(video.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      myList.includes(video.id)
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-black/80 hover:bg-white/20'
                    }`}
                    title={myList.includes(video.id) ? 'Remove from My List' : 'Add to My List'}
                  >
                    {myList.includes(video.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-bold">
                    {video.quality}
                  </span>
                </div>
              </div>

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
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {videos.map(video => (
        <div
          key={video.id}
          className="flex gap-6 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-indigo-500/20 hover:border-cyan-500/50 transition-all cursor-pointer group relative"
        >
          <div onClick={() => onVideoSelect(video)} className="relative w-64 flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-36 object-cover rounded-xl group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-2 border-white">
                <Play className="w-7 h-7 ml-1" />
              </div>
            </div>
            {video.ageRating && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-bold">
                  {video.ageRating}
                </span>
              </div>
            )}
          </div>
          
          <div onClick={() => onVideoSelect(video)} className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-2xl group-hover:text-cyan-300 transition-colors flex-1">
                {video.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToList(video.id);
                }}
                className={`ml-4 p-2 rounded-full backdrop-blur-md transition-all ${
                  myList.includes(video.id)
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title={myList.includes(video.id) ? 'Remove from My List' : 'Add to My List'}
              >
                {myList.includes(video.id) ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-gray-400 mb-4 line-clamp-2">{video.description}</p>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              {video.year && <span className="font-semibold">{video.year}</span>}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-cyan-400" />
                {video.views}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {video.rating}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-indigo-400" />
                {video.duration}
              </span>
              {video.type === 'series' && video.seasons && (
                <span className="px-3 py-1 bg-purple-600/20 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Tv className="w-4 h-4" />
                  {video.seasons} Season{video.seasons > 1 ? 's' : ''}
                </span>
              )}
              <span className="px-3 py-1 bg-indigo-600/20 rounded-full text-xs font-semibold">
                {video.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;

