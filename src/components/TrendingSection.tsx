import React from 'react';
import { Flame, Play, Eye, Check } from 'lucide-react';
import { VideoData } from '../types';

interface TrendingSectionProps {
  videos: VideoData[];
  onVideoSelect: (video: VideoData) => void;
  myList: number[];
  filterByType?: 'movie' | 'series' | null;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  videos,
  onVideoSelect,
  myList,
  filterByType = null
}) => {
  const displayVideos = filterByType
    ? videos.filter(video => video.type === filterByType).slice(0, 5)
    : videos.slice(0, 5);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Trending Now
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {displayVideos.map((video, index) => (
          <div
            key={video.id}
            onClick={() => onVideoSelect(video)}
            className="group cursor-pointer relative"
          >
            <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center font-black text-lg shadow-lg z-10">
              {index + 1}
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-75" />
                  <div className="relative w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-2 border-white">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-bold text-sm mb-1 line-clamp-1">{video.title}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-cyan-500/20 backdrop-blur-sm rounded-full">{video.duration}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </span>
                </div>
              </div>

              {myList.includes(video.id) && (
                <div className="absolute top-3 right-3">
                  <div className="p-1.5 bg-emerald-600 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;

