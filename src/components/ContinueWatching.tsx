import React from 'react';
import { History, Play, Star } from 'lucide-react';
import { VideoData, WatchProgress } from '../types';

interface ContinueWatchingProps {
  watchProgress: WatchProgress[];
  videos: VideoData[];
  onVideoSelect: (video: VideoData) => void;
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({
  watchProgress,
  videos,
  onVideoSelect
}) => {
  if (watchProgress.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl">
          <History className="w-6 h-6" />
        </div>
        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Continue Watching
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {watchProgress.slice(0, 4).map(progress => {
          const video = videos.find(v => v.id === progress.videoId);
          if (!video) return null;
          
          return (
            <div
              key={video.id}
              onClick={() => onVideoSelect(video)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-xl">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-75" />
                    <div className="relative w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-2 border-white">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-xs font-bold">
                    {Math.floor(progress.progress)}%
                  </span>
                </div>

                <div className="absolute bottom-6 left-3 right-3">
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">{video.title}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatching;

