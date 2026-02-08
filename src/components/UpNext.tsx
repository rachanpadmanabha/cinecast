import React from 'react';
import { Flame, Play, Eye } from 'lucide-react';
import { VideoData } from '../types';

interface UpNextProps {
  videos: VideoData[];
  currentVideoId: number;
  onVideoSelect: (video: VideoData) => void;
}

const UpNext: React.FC<UpNextProps> = ({ videos, currentVideoId, onVideoSelect }) => {
  const upNextVideos = videos.filter(v => v.id !== currentVideoId).slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/20 shadow-2xl">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-400" />
        Up Next
      </h3>
      <div className="space-y-4">
        {upNextVideos.map(video => (
          <div 
            key={video.id}
            onClick={() => onVideoSelect(video)}
            className="flex gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-28 h-20 object-cover rounded-xl group-hover:ring-2 ring-cyan-500 transition-all shadow-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1">
                {video.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{video.duration}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpNext;

