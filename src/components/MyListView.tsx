import React from 'react';
import { BookmarkPlus, Play, Star, X } from 'lucide-react';
import { VideoData } from '../types';

interface MyListViewProps {
  myList: number[];
  videos: VideoData[];
  onVideoSelect: (video: VideoData) => void;
  onRemoveFromList: (videoId: number) => void;
}

const MyListView: React.FC<MyListViewProps> = ({
  myList,
  videos,
  onVideoSelect,
  onRemoveFromList
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl">
          <BookmarkPlus className="w-6 h-6" />
        </div>
        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          My List
        </span>
        <span className="text-lg text-gray-400">({myList.length} {myList.length === 1 ? 'item' : 'items'})</span>
      </h2>
      
      {myList.length === 0 ? (
        <div className="text-center py-32">
          <div className="inline-block p-6 bg-white/5 rounded-3xl mb-6">
            <BookmarkPlus className="w-20 h-20 text-gray-600 mx-auto" />
          </div>
          <h3 className="text-3xl font-bold text-gray-400 mb-2">Your list is empty</h3>
          <p className="text-gray-500">Add videos to your list to watch them later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {myList.map(videoId => {
            const video = videos.find(v => v.id === videoId);
            if (!video) return null;
            
            return (
              <div
                key={video.id}
                className="group cursor-pointer relative"
              >
                <div 
                  onClick={() => onVideoSelect(video)}
                  className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-xl"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-75" />
                      <div className="relative w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-2 border-white">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">{video.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {video.rating}
                      </span>
                      <span>•</span>
                      <span>{video.year}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromList(video.id);
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyListView;

