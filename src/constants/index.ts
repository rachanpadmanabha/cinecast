/**
 * Application Constants
 * 
 * Central location for all app-wide constants and configuration values:
 * - Initial user data (watch progress, My List)
 * - Player configuration (speeds, quality options)
 * - Default values for new users
 * 
 * @module constants
 */

import { WatchProgress } from '../types';

/**
 * Initial watch progress data
 * Simulates user's viewing history for "Continue Watching" feature
 * Each entry tracks:
 * - videoId: Which video was watched
 * - progress: Percentage completed (0-100)
 * - timestamp: When it was watched
 * - currentTime: Exact playback position (seconds)
 * - duration: Total video length (seconds)
 */
export const INITIAL_WATCH_PROGRESS: WatchProgress[] = [
  { videoId: 7, progress: 35, timestamp: Date.now(), currentTime: 210, duration: 596 },
  { videoId: 11, progress: 68, timestamp: Date.now() - 86400000, currentTime: 5670, duration: 8328 },
  { videoId: 17, progress: 15, timestamp: Date.now() - 172800000, currentTime: 522, duration: 3480 },
  { videoId: 28, progress: 42, timestamp: Date.now() - 259200000, currentTime: 605, duration: 1440 }
];

/**
 * Initial My List
 * Pre-populated list of saved videos (IDs)
 * Simulates user's previously saved content
 */
export const INITIAL_MY_LIST: number[] = [13, 28, 33];

/**
 * Available playback speed options
 * Standard video player speeds from 0.5x to 2x
 * Used in video player settings menu
 */
export const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2];

/**
 * Video quality options
 * Simulates quality selection (actual quality change requires different video sources)
 * Each option includes:
 * - value: Internal value for state management
 * - label: User-friendly display text
 */
export const QUALITY_OPTIONS = [
  { value: 'Auto', label: 'Auto (Recommended)' },
  { value: '4K', label: '4K Ultra HD (2160p)' },
  { value: 'HD', label: 'HD (1080p)' },
  { value: 'SD', label: 'SD (480p) - Data Saver' }
];

