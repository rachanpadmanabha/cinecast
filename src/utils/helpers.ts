/**
 * Utility Helper Functions
 * 
 * Collection of reusable helper functions for video operations:
 * - Time formatting for video players
 * - Content filtering and searching
 * - Similar content recommendations
 * - Category management
 * 
 * @module utils/helpers
 */

import { VideoData } from '../types';

/**
 * Formats time in seconds to MM:SS format
 * Used for video player time displays
 * 
 * @param time - Time in seconds
 * @returns Formatted string in MM:SS format
 * @example formatTime(125) // Returns "2:05"
 */
export const formatTime = (time: number): string => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Finds similar videos based on category, genres, and type
 * Used for "More Like This" recommendations
 * 
 * @param video - The reference video to find similarities for
 * @param allVideos - Complete video library to search through
 * @returns Array of up to 6 similar videos
 * @example getSimilarVideos(actionMovie, VIDEO_DATA)
 */
export const getSimilarVideos = (video: VideoData, allVideos: VideoData[]): VideoData[] => {
  return allVideos
    .filter(v => v.id !== video.id && (
      v.category === video.category || 
      v.genres?.some(g => video.genres?.includes(g)) ||
      v.type === video.type
    ))
    .slice(0, 6);
};

/**
 * Extracts all unique categories from video library
 * Returns categories with "All" prepended for filter dropdown
 * 
 * @param videos - Array of videos to extract categories from
 * @returns Array of unique category names with "All" first
 * @example getCategories(VIDEO_DATA) // ["All", "Action", "Comedy", ...]
 */
export const getCategories = (videos: VideoData[]): string[] => {
  return ['All', ...Array.from(new Set(videos.map(v => v.category)))];
};

/**
 * Filters videos based on multiple criteria
 * Handles search queries, category filtering, and tab-specific filtering
 * 
 * @param videos - Array of videos to filter
 * @param searchQuery - Text search query (searches title and description)
 * @param activeCategory - Selected category filter ("All" shows everything)
 * @param activeTab - Active tab (home, series, movies, mylist)
 * @param myList - User's My List video IDs (for mylist tab)
 * @returns Filtered array of videos matching all criteria
 */
export const filterVideos = (
  videos: VideoData[],
  searchQuery: string,
  activeCategory: string,
  activeTab: 'home' | 'series' | 'movies' | 'mylist',
  myList: number[]
): VideoData[] => {
  return videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
    const matchesTab = activeTab === 'home' ? true :
                      activeTab === 'series' ? video.type === 'series' :
                      activeTab === 'movies' ? video.type === 'movie' :
                      activeTab === 'mylist' ? myList.includes(video.id) : true;
    return matchesSearch && matchesCategory && matchesTab;
  });
};

/**
 * Gets trending videos from library
 * Filters videos marked as trending and limits results
 * 
 * @param videos - Array of videos to filter
 * @param limit - Maximum number of trending videos to return (default: 5)
 * @returns Array of trending videos
 * @example getTrendingVideos(VIDEO_DATA, 10)
 */
export const getTrendingVideos = (videos: VideoData[], limit: number = 5): VideoData[] => {
  return videos.filter(v => v.trending).slice(0, limit);
};

