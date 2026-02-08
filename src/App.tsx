/**
 * CineCast App Component (Original Version)
 * 
 * Modern OTT streaming platform with cyan/blue theme.
 * This is the original CineCast design (alternative to Netflix clone).
 * 
 * Features:
 * - Grid and List view modes
 * - Advanced video player with analytics
 * - Picture-in-Picture support
 * - Chromecast integration
 * - Continue Watching with progress tracking
 * - My List management
 * - Category filtering
 * - Search functionality
 * - Keyboard shortcuts
 * - Playback statistics
 * - Quality selection
 * - Playback speed control
 * 
 * @component
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { VideoData, PlaybackStats, WatchProgress } from './types';

// Import modularized code
import { VIDEO_DATA } from './data/videos';
import { getSimilarVideos, getCategories, filterVideos, getTrendingVideos } from './utils/helpers';
import { INITIAL_WATCH_PROGRESS, INITIAL_MY_LIST } from './constants';

// Import UI components
import Header from './components/Header';
import Toast from './components/Toast';
import VideoPlayer from './components/VideoPlayer';
import VideoInfo from './components/VideoInfo';
import PlaybackStatsComponent from './components/PlaybackStats';
import UpNext from './components/UpNext';
import ContinueWatching from './components/ContinueWatching';
import TrendingSection from './components/TrendingSection';
import MyListView from './components/MyListView';
import VideoGrid from './components/VideoGrid';
import CategoryFilters from './components/CategoryFilters';
import SimilarVideos from './components/SimilarVideos';
import EmptyState from './components/EmptyState';

const CineCast = () => {
  // ========================================
  // VIDEO PLAYER STATE
  // ========================================
  
  /** Currently selected video for playback */
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  
  /** Video playback state (playing/paused) */
  const [isPlaying, setIsPlaying] = useState(false);
  
  /** Current playback position in seconds */
  const [currentTime, setCurrentTime] = useState(0);
  
  /** Total video duration in seconds */
  const [duration, setDuration] = useState(0);
  
  /** Volume level (0-1) */
  const [volume, setVolume] = useState(1);
  
  /** Whether audio is muted */
  const [isMuted, setIsMuted] = useState(false);
  
  /** Whether video is currently buffering/loading */
  const [isBuffering, setIsBuffering] = useState(false);
  
  /** Whether video controls overlay is visible */
  const [showControls, setShowControls] = useState(true);
  
  /** Whether video is being cast to Chromecast device */
  const [isCasting, setIsCasting] = useState(false);
  
  /** Whether Chromecast SDK has finished loading */
  const [isCastSDKReady, setIsCastSDKReady] = useState(false);
  
  // ========================================
  // UI & NAVIGATION STATE
  // ========================================
  
  /** Search query for filtering videos */
  const [searchQuery, setSearchQuery] = useState('');
  
  /** Active category filter (All, Nature, Action, etc.) */
  const [activeCategory, setActiveCategory] = useState('All');
  
  /** View mode toggle (grid or list layout) */
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  /** Whether player settings menu is visible */
  const [showSettings, setShowSettings] = useState(false);
  
  /** Current playback speed (0.5x, 1x, 1.5x, 2x) */
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  /** Selected video quality (Auto, 4K, HD, SD) */
  const [quality, setQuality] = useState('Auto');
  
  /** Whether current video is liked by user */
  const [isLiked, setIsLiked] = useState(false);
  
  /** Whether current video is saved to My List */
  const [isSaved, setIsSaved] = useState(false);
  
  /** Whether toast notification is visible */
  const [showNotification, setShowNotification] = useState(false);
  
  /** Message to display in toast notification */
  const [notificationMsg, setNotificationMsg] = useState('');
  
  /** Playback performance analytics and metrics */
  const [playbackStats, setPlaybackStats] = useState<PlaybackStats>({
    bufferCount: 0,
    watchTime: 0,
    startLatency: 0,
    errors: [],
    avgBitrate: 0,
    droppedFrames: 0
  });
  
  // ========================================
  // OTT FEATURES STATE
  // ========================================
  
  /** Array of video IDs saved to user's My List */
  const [myList, setMyList] = useState<number[]>(INITIAL_MY_LIST);
  
  /** Watch progress tracking for Continue Watching feature */
  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>(INITIAL_WATCH_PROGRESS);
  
  /** Picture-in-Picture mode state */
  const [isPiP, setIsPiP] = useState(false);
  
  /** Active navigation tab (home, series, movies, mylist) */
  const [activeTab, setActiveTab] = useState<'home' | 'series' | 'movies' | 'mylist'>('home');
  
  // ========================================
  // REFS
  // ========================================
  
  /** Reference to video HTML element for direct control */
  const videoRef = useRef<HTMLVideoElement>(null);
  
  /** Timeout reference for auto-hiding controls */
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  /** Timestamp when video starts playing (for latency tracking) */
  const startTimeRef = useRef<number | null>(null);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  /**
   * Displays a toast notification message
   * Auto-dismisses after 3 seconds
   * @param message - Message to display
   */
  const showToast = (message: string) => {
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  /**
   * Saves user's watch progress for Continue Watching feature
   * Only saves if progress is between 10% and 95% (meaningful progress)
   * Updates existing progress or creates new entry
   */
  const saveWatchProgress = useCallback(() => {
    if (!selectedVideo || !videoRef.current) return;
    
    const progress = (currentTime / duration) * 100;
    const existingIndex = watchProgress.findIndex(p => p.videoId === selectedVideo.id);
    
    if (progress > 10 && progress < 95) { // Only save meaningful progress
      const newProgress: WatchProgress = {
        videoId: selectedVideo.id,
        progress,
        timestamp: Date.now(),
        currentTime,
        duration
      };
      
      if (existingIndex >= 0) {
        const updated = [...watchProgress];
        updated[existingIndex] = newProgress;
        setWatchProgress(updated);
      } else {
        setWatchProgress([newProgress, ...watchProgress]);
      }
    }
  }, [selectedVideo, currentTime, duration, watchProgress]);

  /**
   * Skips video forward or backward by specified seconds
   * Used for 10-second skip buttons and keyboard shortcuts
   * @param seconds - Positive to skip forward, negative to skip backward
   */
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  /**
   * Toggles video playback between play and pause
   * Handles play promise for better error handling
   * Uses useCallback for performance optimization
   */
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Ensure video is ready before trying to play
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Error playing video:', error);
            showToast('Unable to play video');
          });
        }
      }
    }
  }, [isPlaying]);

  /**
   * Toggles mute state
   * Restores previous volume level when unmuting
   * Uses useCallback for performance
   */
  const toggleMute = useCallback(() => {
    if (isMuted) {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
      setIsMuted(false);
    } else {
      if (videoRef.current) {
        videoRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  /**
   * Toggles fullscreen mode for video player
   * Enters or exits fullscreen based on current state
   */
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  /**
   * Toggles Picture-in-Picture mode
   * Allows video to play in floating window while browsing
   * Shows toast notifications for state changes
   * Uses useCallback for performance
   */
  const togglePictureInPicture = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
        showToast('Exited Picture-in-Picture');
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
        showToast('Entered Picture-in-Picture mode');
      }
    } catch (error) {
      showToast('Picture-in-Picture not supported');
    }
  }, []);

  // ========================================
  // CHROMECAST INTEGRATION
  // ========================================
  
  /**
   * Initializes Google Cast (Chromecast) SDK
   * Handles both modern framework API and legacy API
   * Requires HTTPS or localhost for security
   * Prevents multiple initialization attempts
   */
  useEffect(() => {
    // Cast SDK requires HTTPS in production
    const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    
    if (!isHTTPS) {
      console.warn('Cast SDK requires HTTPS or localhost');
      return;
    }

    // Prevent multiple initializations
    if ((window as any).__castInitialized || (window as any).__castInitializing) {
      return;
    }

    // Check if already initialized
    if (window.chrome?.cast?.framework?.CastContext) {
      (window as any).__castInitialized = true;
      return;
    }

    // Mark as initializing
    (window as any).__castInitializing = true;

    const initializeCastApi = () => {
      
      // Don't remove existing script if it's working
      const existingScript = document.querySelector('script[src*="cast_sender.js"]');
      if (existingScript) {
        return;
      }
      
      // Set up the callback only once
      if (!window['__onGCastApiAvailable']) {
        window['__onGCastApiAvailable'] = (isAvailable: boolean) => {
          (window as any).__castInitializing = false;
          
          if (isAvailable) {
            
            // The framework might take time to load after the API is available
            const waitForFramework = (attempt = 1, maxAttempts = 5) => {
              
              if (window.chrome?.cast?.framework?.CastContext) {
                try {
                  const context = window.chrome.cast.framework.CastContext.getInstance();
                  const options = {
                    receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                    autoJoinPolicy: window.chrome.cast.framework.AutoJoinPolicy.ORIGIN_SCOPED
                  };
                  context.setOptions(options);
                  (window as any).__castInitialized = true;
                } catch (error) {
                  console.error('Error initializing Cast context:', error);
                }
              } else if (attempt < maxAttempts) {
                setTimeout(() => waitForFramework(attempt + 1, maxAttempts), 2000);
              } else {
                
                // Try using the legacy Cast API instead of framework
                try {
                  if (window.chrome?.cast) {
                    const cast = window.chrome.cast as any;
                    
                    // Check if we have the basic Cast API methods
                    if (cast.initialize && cast.requestSession) {
                      
                      // Initialize with legacy API
                      const sessionRequest = new cast.SessionRequest(cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
                      const apiConfig = new cast.ApiConfig(
                        sessionRequest,
                        (session: any) => {
                          setIsCasting(true);
                        },
                        (availability: any) => {
                          setIsCasting(availability === 'available');
                        },
                        cast.AutoJoinPolicy.ORIGIN_SCOPED,
                        cast.DefaultActionPolicy.CREATE_SESSION
                      );
                      
                      cast.initialize(
                        apiConfig,
                        () => {
                          setIsCastSDKReady(true);
                        },
                        (error: any) => {
                          console.error('Legacy Cast API initialization failed:', error);
                          setIsCastSDKReady(false);
                        }
                      );
                    } else {
                    }
                  }
                } catch (legacyError) {
                  console.error('Legacy Cast API initialization failed:', legacyError);
                }
              }
            };
            
            // Start waiting for framework
            waitForFramework();
          } else {
            console.error('Cast API is not available');
          }
        };
      }

      // Load the Cast SDK script
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
      script.async = true;
      
      script.onload = () => {
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Cast script:', error);
        (window as any).__castInitializing = false;
      };

      document.head.appendChild(script);
    };

    // Initialize
    initializeCastApi();

    return () => {
      // Don't cleanup the global flags on component unmount
      // as Cast SDK should persist across component lifecycles
    };
  }, []);

  // ========================================
  // VIDEO EVENT LISTENERS
  // ========================================
  
  /**
   * Sets up video element event listeners
   * Tracks: play/pause, time updates, duration, buffering, errors
   * Calculates playback statistics for analytics
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      if (startTimeRef.current) {
        const latency = Date.now() - startTimeRef.current;
        setPlaybackStats(prev => ({ ...prev, startLatency: latency }));
      }
    };

    const handlePause = () => setIsPlaying(false);
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setPlaybackStats(prev => ({ 
        ...prev, 
        watchTime: prev.watchTime + 0.1 
      }));
    };
    
    const handleDurationChange = () => setDuration(video.duration);
    
    const handleLoadStart = () => {
      setIsBuffering(true);
      setCurrentTime(0);
      setDuration(0);
    };
    
    const handleLoadedData = () => {
      setIsBuffering(false);
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
      setPlaybackStats(prev => ({ 
        ...prev, 
        bufferCount: prev.bufferCount + 1 
      }));
    };
    
    const handleCanPlay = () => setIsBuffering(false);
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      setPlaybackStats(prev => ({ 
        ...prev, 
        errors: [...prev.errors, target.error?.message || 'Unknown error'] 
      }));
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [selectedVideo]);

  /**
   * Periodically saves watch progress while video is playing
   * Saves every 10 seconds to track Continue Watching progress
   */
  useEffect(() => {
    if (!isPlaying || !selectedVideo) return;
    
    const interval = setInterval(() => {
      saveWatchProgress();
    }, 10000); // Save every 10 seconds
    
    return () => clearInterval(interval);
  }, [isPlaying, selectedVideo, currentTime, duration, saveWatchProgress]);

  /**
   * Keyboard shortcuts for video control
   * 
   * Shortcuts:
   * - Space/K: Play/Pause
   * - J/Left Arrow: Skip back 10s
   * - L/Right Arrow: Skip forward 10s
   * - Up Arrow: Increase volume
   * - Down Arrow: Decrease volume
   * - M: Mute/Unmute
   * - F: Toggle fullscreen
   * - P: Toggle Picture-in-Picture
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedVideo) return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
          e.preventDefault();
          togglePictureInPicture();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedVideo, isPlaying, volume, togglePlayPause, toggleMute, togglePictureInPicture]);

  /**
   * Resets the auto-hide timer for video controls
   * Controls appear on mouse movement and hide after 3 seconds of inactivity
   */
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // ========================================
  // VIDEO SELECTION & PLAYBACK HANDLERS
  // ========================================
  
  /**
   * Handles video selection from library
   * - Saves progress of currently playing video
   * - Resets player state
   * - Loads new video
   * - Checks My List status
   * - Resumes from saved progress if available
   * @param video - The video to select and play
   */
  const handleVideoSelect = (video: VideoData) => {
    // Save progress of currently playing video
    if (selectedVideo) {
      saveWatchProgress();
    }
    
    // Pause current video if playing
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    
    // Check if video is in my list
    const inMyList = myList.includes(video.id);
    
    // Check for existing watch progress
    const existingProgress = watchProgress.find(p => p.videoId === video.id);
    
    // Reset all states
    setIsPlaying(false);
    setIsBuffering(false);
    setSelectedVideo(video);
    setCurrentTime(existingProgress?.currentTime || 0);
    setDuration(0);
    setIsLiked(false);
    setIsSaved(inMyList);
    setIsCasting(false);
    startTimeRef.current = Date.now();
    setPlaybackStats({
      bufferCount: 0,
      watchTime: 0,
      startLatency: 0,
      errors: [],
      avgBitrate: Math.floor(Math.random() * 3000) + 2000,
      droppedFrames: 0
    });
    
    // Reset video element after a short delay to ensure new source loads properly
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load(); // Force reload of the video element
        
        // Resume from saved progress if exists
        if (existingProgress) {
          videoRef.current.currentTime = existingProgress.currentTime;
          showToast(`Resuming from ${Math.floor(existingProgress.progress)}%`);
        }
      }
    }, 100);
  };

  /**
   * Handles seeking to specific position in video
   * Calculates position from click location on progress bar
   * @param e - Mouse event on progress bar
   */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  /**
   * Handles volume slider changes
   * Updates both video element and state
   * Auto-mutes if volume set to 0
   * @param e - Change event from volume slider
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  /**
   * Changes video playback speed
   * Updates video element playbackRate and shows notification
   * @param speed - Playback speed (0.5, 1, 1.5, 2)
   */
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
      if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    showToast(`Playback speed: ${speed}x`);
  };

  /**
   * Simulates quality change (requires different video sources for real implementation)
   * Maintains playback position during quality change
   * Shows user-friendly toast notification
   * @param newQuality - Quality setting (Auto, 4K, HD, SD)
   */
  const changeQuality = (newQuality: string) => {
    if (!videoRef.current || !selectedVideo) return;
    
    const currentTime = videoRef.current.currentTime;
    const wasPlaying = isPlaying;
    
    setQuality(newQuality);
    
    // In a real app, you'd have different URLs for different qualities
    // For demo purposes, we'll simulate quality change by adjusting playback
    if (newQuality === '4K') {
      // Simulating higher quality (in reality you'd load a different video source)
      showToast('🎬 Switched to 4K Ultra HD');
    } else if (newQuality === 'HD') {
      showToast('📺 Switched to HD (1080p)');
    } else if (newQuality === 'SD') {
      showToast('📱 Switched to SD (480p) - Lower bandwidth');
      } else {
      showToast('⚡ Auto quality - Adapting to your connection');
      }

    // Resume playback from same position
    setTimeout(() => {
    if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        if (wasPlaying) {
          videoRef.current.play();
        }
      }
    }, 100);
  };

  // ========================================
  // USER INTERACTION HANDLERS
  // ========================================
  
  /**
   * Toggles like state for current video
   * Shows toast notification for feedback
   */
  const toggleLike = () => {
    setIsLiked(!isLiked);
    showToast(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  /**
   * Toggles current video in My List
   * Updates both local state and My List array
   * Shows toast notification
   */
  const toggleSave = () => {
    if (!selectedVideo) return;
    
    const isInList = myList.includes(selectedVideo.id);
    if (isInList) {
      setMyList(myList.filter(id => id !== selectedVideo.id));
      setIsSaved(false);
      showToast('Removed from My List');
    } else {
      setMyList([...myList, selectedVideo.id]);
      setIsSaved(true);
      showToast('Added to My List');
    }
  };

  /**
   * Simulates video sharing
   * In real app, would copy share link to clipboard
   */
  const shareVideo = () => {
    showToast('Link copied to clipboard!');
  };

  /**
   * Adds or removes video from My List (used by video cards)
   * Alternative to toggleSave for use in video grid
   * @param videoId - ID of video to add/remove
   */
  const addToMyList = (videoId: number) => {
    if (myList.includes(videoId)) {
      setMyList(myList.filter(id => id !== videoId));
      showToast('Removed from My List');
      } else {
      setMyList([...myList, videoId]);
      showToast('Added to My List');
        }
  };

  /**
   * Debug function for Chromecast SDK troubleshooting
   * Attempts manual Cast Context creation if automatic initialization fails
   * Shows debug info in console
   */
  const debugCastSDK = () => {
    try {
      const cast = window.chrome?.cast as any;
      if (cast && cast.framework && cast.framework.CastContext) {
        const context = cast.framework.CastContext.getInstance();
        if (!context.getOptions || !context.getOptions()) {
          context.setOptions({
            receiverApplicationId: cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: cast.framework.AutoJoinPolicy.ORIGIN_SCOPED
          });
          (window as any).__castInitialized = true;
        }
      } else {
      }
    } catch (manualError) {
    }
    
    showToast('Check console for detailed Cast SDK debug info');
  };

  /**
   * Initiates casting current video to Chromecast device
   * Checks for HTTPS requirement and Cast API availability
   * Tries modern framework API first, falls back to legacy API
   */
  const castToDevice = () => {
    if (!selectedVideo) {
      showToast('No video selected');
      return;
    }

    // Check if we're on HTTPS or localhost (Cast SDK requirement)
    const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isHTTPS) {
      showToast('Cast requires HTTPS or localhost');
      return;
    }

    // Check if Chrome Cast API is available
    if (!window.chrome?.cast) {
      showToast('Cast API not loaded. Please refresh the page.');
      return;
    }

    // Try framework first, then fall back to legacy API
    if (window.chrome?.cast?.framework?.CastContext) {
      performFrameworkCast();
    } else {
      performLegacyCast();
    }
  };

  /**
   * Performs casting using modern Cast Framework API
   * Requests cast session and loads media to connected device
   */
  const performFrameworkCast = () => {
    if (!window.chrome?.cast?.framework?.CastContext || !selectedVideo) {
      showToast('Framework Cast not ready or no video selected');
      return;
    }

    try {
      const cast = window.chrome.cast;
      if (cast.framework && cast.framework.CastContext) {
        const context = cast.framework.CastContext.getInstance();
        
        context.requestSession().then(() => {
          const session = context.getCurrentSession();
          if (cast.media && selectedVideo) {
            const mediaInfo = new cast.media.MediaInfo(selectedVideo.url, 'video/mp4');
            mediaInfo.metadata = new cast.media.GenericMediaMetadata();
            mediaInfo.metadata.title = selectedVideo.title;
            mediaInfo.metadata.subtitle = selectedVideo.description;
            
            const request = new cast.media.LoadRequest(mediaInfo);
            session.loadMedia(request).then(
              () => {
                setIsCasting(true);
                showToast('Casting to TV');
              },
              (err: any) => {
                console.error('Error loading media:', err);
                showToast('Failed to load video on cast device');
              }
            );
          }
        }).catch((err: any) => {
          console.error('Error requesting session:', err);
          if (err.code === 'cancel') {
            showToast('Cast session cancelled');
          } else {
            showToast('No cast devices found or session failed');
          }
        });
      }
    } catch (error) {
      console.error('Framework cast error:', error);
      showToast('Framework cast functionality error');
    }
  };

  /**
   * Performs casting using legacy Cast API (fallback method)
   * Creates session request and loads media manually
   * Used when modern framework API is not available
   */
  const performLegacyCast = () => {
    if (!window.chrome?.cast || !selectedVideo) {
      showToast('Cast not ready or no video selected');
      return;
    }

    try {
      const cast = window.chrome.cast as any;
      
      // Check if Cast API is properly initialized
      if (!isCastSDKReady) {
        showToast('Cast SDK not ready. Please wait and try again.');
        return;
      }
      
      if (cast.requestSession) {
        
        // Create session request with the default media receiver
        const sessionRequest = new cast.SessionRequest(cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
        
        cast.requestSession(
          (session: any) => {
            
            if (session && session.loadMedia && selectedVideo) {
              // Create media info
              const mediaInfo = new cast.media.MediaInfo(selectedVideo.url, 'video/mp4');
              if (cast.media.GenericMediaMetadata) {
                mediaInfo.metadata = new cast.media.GenericMediaMetadata();
                mediaInfo.metadata.title = selectedVideo.title;
                mediaInfo.metadata.subtitle = selectedVideo.description;
              }
              
              // Load media
              const request = new cast.media.LoadRequest(mediaInfo);
              session.loadMedia(
                request,
                () => {
                  setIsCasting(true);
                  showToast('Casting to TV');
                },
                (err: any) => {
                  console.error('Legacy media load error:', err);
                  showToast('Failed to load video on cast device');
                }
              );
            } else {
              console.error('Session loadMedia method not available or no video selected');
              showToast('Cast session error');
            }
          },
          (err: any) => {
            console.error('Legacy session request error:', err);
            if (err.code === 'cancel') {
              showToast('Cast session cancelled');
            } else if (err.code === 'receiver_unavailable') {
              showToast('No cast devices found on your network');
            } else if (err.code === 'session_error') {
              showToast('Cast session error. Make sure you have a Chromecast device available.');
            } else {
              showToast('Cast error: ' + (err.description || err.code || 'Unknown error'));
            }
          },
          sessionRequest
        );
      } else {
        showToast('Cast API methods not available');
      }
    } catch (error) {
      console.error('Legacy cast error:', error);
      showToast('Legacy cast functionality error');
    }
  };

  // ========================================
  // DATA FILTERING & ORGANIZATION
  // ========================================
  
  /** All unique categories from video library (with "All" prepended) */
  const categories = getCategories(VIDEO_DATA);
  
  /** Videos filtered by search query, category, and active tab */
  const filteredVideos = filterVideos(VIDEO_DATA, searchQuery, activeCategory, activeTab, myList);
  
  /** Trending videos for "Trending Now" section (limited to 5) */
  const trendingVideos = getTrendingVideos(VIDEO_DATA, 5);

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Toast Notification */}
      <Toast message={notificationMsg} show={showNotification} />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        myListCount={myList.length}
        showTabs={!selectedVideo}
        onLogoClick={() => { setSelectedVideo(null); setActiveTab('home'); }}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {selectedVideo ? (
          /* Video Player View */
          <div className="space-y-6">
            <button
              onClick={() => setSelectedVideo(null)}
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-100 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Browse</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2 space-y-6">
                <VideoPlayer
                  video={selectedVideo}
                  videoRef={videoRef}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  volume={volume}
                  isMuted={isMuted}
                  isBuffering={isBuffering}
                  showControls={showControls}
                  isCasting={isCasting}
                  isCastSDKReady={isCastSDKReady}
                  isPiP={isPiP}
                  showSettings={showSettings}
                  playbackSpeed={playbackSpeed}
                  quality={quality}
                  onTogglePlayPause={togglePlayPause}
                  onSeek={handleSeek}
                  onVolumeChange={handleVolumeChange}
                  onToggleMute={toggleMute}
                  onSkipTime={skipTime}
                  onTogglePiP={togglePictureInPicture}
                  onCastToDevice={castToDevice}
                  onToggleFullscreen={toggleFullscreen}
                  onToggleSettings={() => setShowSettings(!showSettings)}
                  onChangeSpeed={changePlaybackSpeed}
                  onChangeQuality={changeQuality}
                  onMouseMove={resetControlsTimeout}
                  onMouseLeave={() => isPlaying && setShowControls(false)}
                  />

                {/* Video Info & Actions */}
                <VideoInfo
                  video={selectedVideo}
                  isLiked={isLiked}
                  isSaved={isSaved}
                  onToggleLike={toggleLike}
                  onToggleSave={toggleSave}
                  onShare={shareVideo}
                  onDebugCast={debugCastSDK}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <PlaybackStatsComponent stats={playbackStats} />
                <UpNext 
                  videos={VIDEO_DATA}
                  currentVideoId={selectedVideo.id}
                  onVideoSelect={handleVideoSelect}
                />
                    </div>
                  </div>
                  
            {/* Similar Videos Section */}
            <SimilarVideos
              videos={getSimilarVideos(selectedVideo, VIDEO_DATA)}
              myList={myList}
              onVideoSelect={handleVideoSelect}
            />
          </div>
        ) : (
          /* Video Grid View */
          <div>
            {/* Continue Watching Section */}
            {activeTab === 'home' && (
              <ContinueWatching
                watchProgress={watchProgress}
                videos={VIDEO_DATA}
                onVideoSelect={handleVideoSelect}
              />
            )}

            {/* My List View */}
            {activeTab === 'mylist' && (
              <MyListView
                myList={myList}
                videos={VIDEO_DATA}
                onVideoSelect={handleVideoSelect}
                onRemoveFromList={addToMyList}
              />
            )}

            {/* Trending Section */}
            {(activeTab === 'home' || activeTab === 'movies' || activeTab === 'series') && (
              <TrendingSection
                videos={trendingVideos}
                onVideoSelect={handleVideoSelect}
                myList={myList}
                filterByType={activeTab === 'movies' ? 'movie' : activeTab === 'series' ? 'series' : null}
              />
            )}

            {/* Category Filters */}
            {activeTab !== 'mylist' && (
              <CategoryFilters
                categories={categories}
                activeCategory={activeCategory}
                viewMode={viewMode}
                onCategoryChange={setActiveCategory}
                onViewModeChange={setViewMode}
              />
            )}

            {/* Video Grid/List */}
            {activeTab !== 'mylist' && (
              <VideoGrid
                videos={filteredVideos}
                viewMode={viewMode}
                myList={myList}
                onVideoSelect={handleVideoSelect}
                onAddToList={addToMyList}
              />
            )}

            {/* Empty State */}
            {filteredVideos.length === 0 && activeTab !== 'mylist' && <EmptyState />}
          </div>
        )}
      </div>
    </div>
  );
};

export default CineCast;
