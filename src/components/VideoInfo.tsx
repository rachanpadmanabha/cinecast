import React from 'react';
import { Heart, Plus, Check, Share2, Download, Settings, Eye, Star, Clock, Tv } from 'lucide-react';
import { VideoData } from '../types';

interface VideoInfoProps {
  video: VideoData;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onShare: () => void;
  onDebugCast: () => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  video,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onShare,
  onDebugCast
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/20 shadow-2xl">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {video.title}
            </h2>
            {video.year && (
              <span className="text-2xl text-gray-500 font-bold">({video.year})</span>
            )}
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            {video.description}
          </p>
          <div className="flex items-center gap-6 text-sm flex-wrap mb-4">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold">{video.views} views</span>
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-semibold">{video.rating}/5</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold">{video.duration}</span>
            </span>
            {video.ageRating && (
              <span className="px-3 py-1 bg-amber-600/20 border border-amber-500/30 rounded-lg font-bold text-sm text-amber-300">
                {video.ageRating}
              </span>
            )}
            {video.type === 'series' && (
              <span className="flex items-center gap-1 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg font-semibold text-sm">
                <Tv className="w-4 h-4" />
                {video.seasons} Season{video.seasons! > 1 ? 's' : ''} • {video.episodes} Episodes
              </span>
            )}
          </div>
          {video.genres && video.genres.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {video.genres.map((genre, idx) => (
                <span key={idx} className="px-4 py-1.5 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-full font-bold text-sm">
                  {genre}
                </span>
              ))}
            </div>
          )}
          {video.director && (
            <p className="text-gray-400 mt-3 text-sm">
              <span className="font-semibold text-gray-300">Director:</span> {video.director}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleLike}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            isLiked 
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 shadow-lg shadow-pink-500/50' 
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? 'Liked' : 'Like'}
        </button>

        <button 
          onClick={onToggleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            isSaved 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/50' 
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isSaved ? 'Saved' : 'Watchlist'}
        </button>

        <button 
          onClick={onShare}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>

        <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all">
          <Download className="w-5 h-5" />
          Download
        </button>

        <button 
          onClick={onDebugCast}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600/20 hover:bg-orange-600/30 rounded-xl font-semibold transition-all text-orange-300"
        >
          <Settings className="w-5 h-5" />
          Debug Cast
        </button>
      </div>
    </div>
  );
};

export default VideoInfo;

