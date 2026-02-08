// Chrome Cast API type definitions
declare global {
  interface Window {
    chrome: {
      cast: {
        VERSION?: any;
        media: {
          DEFAULT_MEDIA_RECEIVER_APP_ID: string;
          MediaInfo: new (url: string, contentType: string) => MediaInfo;
          GenericMediaMetadata: new () => GenericMediaMetadata;
          LoadRequest: new (mediaInfo: MediaInfo) => LoadRequest;
        };
        framework?: {
          CastContext: {
            getInstance: () => CastContext;
          };
          AutoJoinPolicy: {
            ORIGIN_SCOPED: string;
          };
        };
      };
    };
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }

  interface MediaInfo {
    metadata: GenericMediaMetadata;
  }

  interface GenericMediaMetadata {
    title: string;
    subtitle: string;
  }

  interface LoadRequest {}

  interface CastContext {
    setOptions: (options: CastOptions) => void;
    requestSession: () => Promise<void>;
    getCurrentSession: () => CastSession;
    getCastState?: () => string;
  }

  interface CastOptions {
    receiverApplicationId: string;
    autoJoinPolicy: string;
  }

  interface CastSession {
    loadMedia: (request: LoadRequest) => Promise<void>;
  }
}

/**
 * VideoData Interface
 * 
 * Complete data structure for video content.
 * Includes all metadata needed for:
 * - Display (title, description, thumbnail)
 * - Playback (url, duration)
 * - Categorization (category, genres, type)
 * - User info (rating, views, trending)
 * - Content classification (ageRating, quality, year)
 * - Series information (seasons, episodes)
 */
export interface VideoData {
  /** Unique identifier for the video */
  id: number;
  
  /** Display title of the video */
  title: string;
  
  /** Full description/synopsis */
  description: string;
  
  /** URL to thumbnail image (for cards and previews) */
  thumbnail: string;
  
  /** URL to video file for playback */
  url: string;
  
  /** Formatted duration string (e.g., "2h 18m", "45m", "15s") */
  duration: string;
  
  /** Primary category (Nature, Action, Sci-Fi, etc.) */
  category: string;
  
  /** View count string (e.g., "12.5M", "3.2M") */
  views: string;
  
  /** Rating out of 5 (used for match percentage calculation) */
  rating: number;
  
  /** Whether video appears in "Trending Now" sections */
  trending: boolean;
  
  /** Video quality indicator (4K, HD, SD) */
  quality: string;
  
  /** Release year */
  year?: number;
  
  /** Age rating (G, PG, PG-13, TV-14, TV-MA, TV-Y, TV-Y7) */
  ageRating?: string;
  
  /** Array of genre tags (Action, Comedy, Drama, etc.) */
  genres?: string[];
  
  /** Cast members (for movie/series info) */
  cast?: string[];
  
  /** Director name */
  director?: string;
  
  /** Primary language */
  language?: string;
  
  /** Available subtitle languages */
  subtitles?: string[];
  
  /** Content type classification */
  type?: 'movie' | 'series' | 'documentary' | 'short';
  
  /** Number of seasons (for TV series) */
  seasons?: number;
  
  /** Total number of episodes (for TV series) */
  episodes?: number;
}

/**
 * WatchProgress Interface
 * 
 * Tracks user's viewing progress for "Continue Watching" feature.
 * Stores playback position and completion percentage.
 */
export interface WatchProgress {
  /** ID of the video being tracked */
  videoId: number;
  
  /** Completion percentage (0-100) */
  progress: number;
  
  /** Unix timestamp of last watch */
  timestamp: number;
  
  /** Exact playback position in seconds */
  currentTime: number;
  
  /** Total video duration in seconds */
  duration: number;
}

/**
 * UserProfile Interface
 * 
 * User profile data for multi-profile support.
 * Enables personalized recommendations and parental controls.
 */
export interface UserProfile {
  /** Unique profile ID */
  id: number;
  
  /** Profile display name */
  name: string;
  
  /** Avatar image or emoji */
  avatar: string;
  
  /** Whether this is a kids profile (for content filtering) */
  isKid: boolean;
}

/**
 * PlaybackStats Interface
 * 
 * Performance and analytics data for video playback.
 * Tracks quality metrics and errors for debugging.
 */
export interface PlaybackStats {
  /** Number of buffering events during playback */
  bufferCount: number;
  
  /** Total time watched in seconds */
  watchTime: number;
  
  /** Time from play click to video start (milliseconds) */
  startLatency: number;
  
  /** Array of error messages encountered */
  errors: string[];
  
  /** Average bitrate in kbps */
  avgBitrate: number;
  
  /** Number of frames dropped during playback */
  droppedFrames: number;
}

export {};