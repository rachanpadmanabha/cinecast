import React from 'react';
import { TrendingUp, Play, Star, Check } from 'lucide-react';
import { VideoData } from '../types';

interface SimilarVideosProps {
  videos: VideoData[];
  myList: number[];
  onVideoSelect: (video: VideoData) => void;
}

const SimilarVideos: React.FC<SimilarVideosProps> = ({
  videos,
  myList,
  onVideoSelect
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-cyan-400" />
        More Like This
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {videos.map(video => (
          <div
            key={video.id}
            onClick={() => onVideoSelect(video)}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-lg">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-2 border-white">
                  <Play className="w-6 h-6 ml-1" />
                </div>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="font-bold text-xs mb-1 line-clamp-2">{video.title}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {video.rating}
                  </span>
                  {video.year && <span className="text-gray-400">• {video.year}</span>}
                </div>
              </div>

              {myList.includes(video.id) && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarVideos;

