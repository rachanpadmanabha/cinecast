/**
 * NetflixHeader Component
 * 
 * Netflix-style header with minimal black design
 * Features:
 * - Red CINECAST branding (Netflix-style logo)
 * - Horizontal navigation menu
 * - Expandable search bar
 * - Notification bell with red dot indicator
 * - Profile dropdown
 * - Transitions from transparent to solid black on scroll
 * 
 * @component
 * @param {Function} onNavigate - Callback when navigation item is clicked
 * @param {string} activeSection - Currently active navigation section
 */

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface NetflixHeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

const NetflixHeader: React.FC<NetflixHeaderProps> = ({ onNavigate, activeSection }) => {
  /** Tracks if page has been scrolled (for header background transition) */
  const [isScrolled, setIsScrolled] = useState(false);
  
  /** Controls search bar visibility (expands on click) */
  const [showSearch, setShowSearch] = useState(false);
  
  /** Search query input value */
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Listens for page scroll to change header background
   * Transitions from gradient to solid black when scrolled
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** Navigation menu items (Netflix-style sections) */
  const navLinks = ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-12 py-5">
        {/* Netflix Logo */}
        <div className="flex items-center gap-10">
          <h1 
            className="text-red-600 font-black text-4xl tracking-tighter cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => onNavigate('Home')}
            style={{ fontFamily: 'Arial Black, sans-serif' }}
          >
            CINECAST
          </h1>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button
                key={link}
                onClick={() => onNavigate(link)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === link 
                    ? 'text-white font-bold' 
                    : 'text-gray-300 hover:text-gray-200'
                }`}
              >
                {link}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center gap-2 bg-black border border-white px-2 py-1">
                <Search className="w-5 h-5" />
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setShowSearch(false)}
                  autoFocus
                  className="bg-transparent outline-none text-sm w-60"
                />
              </div>
            ) : (
              <button onClick={() => setShowSearch(true)} className="hover:text-gray-300">
                <Search className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <button className="relative hover:text-gray-300">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold">U</span>
            </div>
            <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NetflixHeader;

