import React from 'react';
import { Search, Bell, User, PlayCircle, Tv, Film, BookmarkPlus } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: 'home' | 'series' | 'movies' | 'mylist';
  onTabChange: (tab: 'home' | 'series' | 'movies' | 'mylist') => void;
  myListCount: number;
  showTabs: boolean;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  myListCount,
  showTabs,
  onLogoClick
}) => {
  return (
    <header className="bg-black/50 backdrop-blur-2xl border-b border-indigo-500/20 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={onLogoClick}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-lg opacity-75 animate-pulse" />
              <div className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 p-2.5 rounded-2xl">
                <PlayCircle className="w-7 h-7" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CineCast
              </h1>
              <p className="text-xs text-gray-400 font-medium">Premium Streaming Experience</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="text"
                placeholder="Search videos, series, movies and more..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/5 border border-indigo-500/30 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
            <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        {showTabs && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('home')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onTabChange('series')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'series'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tv className="w-4 h-4" />
              Series
            </button>
            <button
              onClick={() => onTabChange('movies')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'movies'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              Movies
            </button>
            <button
              onClick={() => onTabChange('mylist')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'mylist'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              My List {myListCount > 0 && <span className="ml-1 px-2 py-0.5 bg-cyan-500 rounded-full text-xs">{myListCount}</span>}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

