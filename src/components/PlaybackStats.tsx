import React from 'react';
import { Info } from 'lucide-react';
import { PlaybackStats as PlaybackStatsType } from '../types';

interface PlaybackStatsProps {
  stats: PlaybackStatsType;
}

const PlaybackStats: React.FC<PlaybackStatsProps> = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl">
          <Info className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Playback Analytics
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-gray-300 font-medium">Buffer Events</span>
          <span className="font-bold text-cyan-300 text-lg">{stats.bufferCount}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-gray-300 font-medium">Watch Time</span>
          <span className="font-bold text-cyan-300 text-lg">{stats.watchTime.toFixed(1)}s</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-gray-300 font-medium">Start Latency</span>
          <span className="font-bold text-cyan-300 text-lg">{stats.startLatency}ms</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-gray-300 font-medium">Avg Bitrate</span>
          <span className="font-bold text-cyan-300 text-lg">{stats.avgBitrate} kbps</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-gray-300 font-medium">Dropped Frames</span>
          <span className="font-bold text-cyan-300 text-lg">{stats.droppedFrames}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-gray-300 font-medium">Errors</span>
          <span className="font-bold text-cyan-300 text-lg">{stats.errors.length}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaybackStats;

