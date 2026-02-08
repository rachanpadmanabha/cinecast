/**
 * NetflixApp Component
 * 
 * Main application component for the Netflix-style streaming interface.
 * Provides a complete OTT (Over-The-Top) streaming experience with:
 * - Profile selection screen
 * - Hero banner with auto-playing video
 * - Multiple horizontal scrollable content rows
 * - Video preview modals
 * - Full-screen video player
 * - My List management
 * - Watch progress tracking
 * 
 * @component
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoData, PlaybackStats, WatchProgress } from './types';

// Import data and utilities
import { VIDEO_DATA } from './data/videos';
import { getSimilarVideos, filterVideos } from './utils/helpers';
import { INITIAL_WATCH_PROGRESS, INITIAL_MY_LIST } from './constants';

// Import Netflix-styled components
import NetflixHeader from './components/NetflixHeader';
import HeroBanner from './components/HeroBanner';
import ContentRow from './components/ContentRow';
import ProfileSelection from './components/ProfileSelection';
import NetflixVideoModal from './components/NetflixVideoModal';

const NetflixApp = () => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  /** Currently selected user profile */
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  
  /** Currently selected video for playback */
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  
  /** Whether the full-screen video modal is visible */
  const [showModal, setShowModal] = useState(false);
  
  /** Video playback state (playing/paused) */
  const [isPlaying, setIsPlaying] = useState(false);
  
  /** Current playback position in seconds */
  const [currentTime, setCurrentTime] = useState(0);
  
  /** Total video duration in seconds */
  const [duration, setDuration] = useState(0);
  
  /** Volume level (0-1) */
  const [volume, setVolume] = useState(1);
  
  /** Whether video audio is muted */
  const [isMuted, setIsMuted] = useState(true);
  
  /** Whether user has liked the current video */
  const [isLiked, setIsLiked] = useState(false);
  
  /** Whether video is currently seeking to a new position */
  const [isSeeking, setIsSeeking] = useState(false);
  
  /** Whether video is buffering/loading */
  const [isBuffering, setIsBuffering] = useState(false);
  
  /** Active navigation section (Home, TV Shows, Movies, etc.) */
  const [activeSection, setActiveSection] = useState('Home');
  
  /** Array of video IDs in user's saved list */
  const [myList, setMyList] = useState<number[]>(INITIAL_MY_LIST);
  
  /** Watch progress tracking for "Continue Watching" feature */
  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>(INITIAL_WATCH_PROGRESS);
  
  /** Playback analytics and performance metrics */
  const [playbackStats, setPlaybackStats] = useState<PlaybackStats>({
    bufferCount: 0,
    watchTime: 0,
    startLatency: 0,
    errors: [],
    avgBitrate: 0,
    droppedFrames: 0
  });

  /** Reference to the HTML video element for direct control */
  const videoRef = useRef<HTMLVideoElement>(null);

  // ========================================
  // CONTENT FILTERING & ORGANIZATION
  // ========================================
  
  /** Featured video displayed in hero banner (defaults to Shadowhunter Chronicles) */
  const heroBannerVideo = VIDEO_DATA.find(v => v.id === 13) || VIDEO_DATA[0];

  /** Trending content - videos marked as trending */
  const trendingVideos = VIDEO_DATA.filter(v => v.trending);
  
  /** Videos user has started watching - for "Continue Watching" row */
  const continueWatchingVideos = watchProgress
    .slice(0, 8)
    .map(p => VIDEO_DATA.find(v => v.id === p.videoId))
    .filter(Boolean) as VideoData[];
  
  /** Videos saved to user's My List */
  const myListVideos = myList
    .map(id => VIDEO_DATA.find(v => v.id === id))
    .filter(Boolean) as VideoData[];
  
  /** Top 10 most viewed videos - sorted by view count */
  const top10Videos = [...VIDEO_DATA]
    .sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
    .slice(0, 10);
  
  /** All movies from the video library */
  const movieVideos = VIDEO_DATA.filter(v => v.type === 'movie');
  
  /** All TV series from the video library */
  const seriesVideos = VIDEO_DATA.filter(v => v.type === 'series');
  
  /** Anime category content */
  const animeVideos = VIDEO_DATA.filter(v => v.category === 'Anime');
  
  /** Action genre content */
  const actionVideos = VIDEO_DATA.filter(v => v.genres?.includes('Action'));
  
  /** Comedy content (category or genre) */
  const comedyVideos = VIDEO_DATA.filter(v => v.category === 'Comedy' || v.genres?.includes('Comedy'));
  
  /** Documentary content */
  const documentaryVideos = VIDEO_DATA.filter(v => v.type === 'documentary');

  // ========================================
  // EVENT HANDLERS
  // ========================================
  
  /**
   * Handles video selection from preview or card
   * Opens video in modal and auto-plays with sound
   * @param video - The video to play
   */
  const handleVideoSelect = (video: VideoData) => {
    setSelectedVideo(video);
    setShowModal(true);
    setIsLiked(false);
    setIsMuted(false);
    // Auto-play when modal opens (100ms delay for element to mount)
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  /**
   * Handles direct "Play" button clicks
   * Opens video modal and starts playback immediately
   * @param video - The video to play
   */
  const handlePlayVideo = (video: VideoData) => {
    setSelectedVideo(video);
    setShowModal(true);
    setIsMuted(false);
    // Auto-play immediately (100ms delay for element to mount)
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  /**
   * Adds or removes video from user's My List
   * @param videoId - ID of the video to add/remove
   */
  const handleAddToList = (videoId: number) => {
    if (myList.includes(videoId)) {
      setMyList(myList.filter(id => id !== videoId));
    } else {
      setMyList([...myList, videoId]);
    }
  };

  /**
   * Toggles video playback between play and pause
   * Uses useCallback for performance optimization
   */
  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  /**
   * Handles seeking to a specific position in the video
   * Updates UI instantly for responsive feedback, then seeks video
   * @param e - Mouse click event on progress bar
   */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    // Update state IMMEDIATELY for instant visual feedback
    setCurrentTime(newTime);
    setIsSeeking(true);
    setIsBuffering(true);
    
    // Set video time (this triggers buffering)
    videoRef.current.currentTime = newTime;
  };

  /**
   * Handles volume slider changes
   * Updates both video element volume and UI state
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
   * Toggles video mute state
   * Restores previous volume when unmuting
   * Uses useCallback for performance
   */
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  /**
   * Toggles fullscreen mode for the video player modal
   * Enters or exits fullscreen based on current state
   */
  const toggleFullscreen = () => {
    const modalElement = document.getElementById('video-modal-container');
    if (modalElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        modalElement.requestFullscreen();
      }
    }
  };

  // ========================================
  // VIDEO EVENT LISTENERS
  // ========================================
  
  /**
   * Sets up video element event listeners for:
   * - Play/pause state tracking
   * - Time updates for progress bar
   * - Volume synchronization with system controls
   * - Seeking and buffering state management
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Sync volume with state immediately
    video.volume = volume;
    video.muted = isMuted;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      // Only update if not seeking to avoid visual jumps
      if (!isSeeking) {
        setCurrentTime(video.currentTime);
      }
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handleVolumeChange = () => {
      // Sync state with video element (for system controls)
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    
    // Seeking event handlers
    const handleSeeking = () => {
      setIsSeeking(true);
      setIsBuffering(true);
    };
    
    const handleSeeked = () => {
      setIsSeeking(false);
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [selectedVideo, volume, isMuted, isSeeking]);

  // Profile Selection Screen
  if (!selectedProfile) {
    return <ProfileSelection onSelectProfile={setSelectedProfile} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Netflix Header */}
      <NetflixHeader
        onNavigate={setActiveSection}
        activeSection={activeSection}
      />

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <NetflixVideoModal
          video={selectedVideo}
          videoRef={videoRef}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isLiked={isLiked}
          isInMyList={myList.includes(selectedVideo.id)}
          playbackStats={playbackStats}
          isSeeking={isSeeking}
          isBuffering={isBuffering}
          onClose={() => {
            setShowModal(false);
            setIsPlaying(false);
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }}
          onTogglePlay={togglePlayPause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleLike={() => setIsLiked(!isLiked)}
          onToggleList={() => handleAddToList(selectedVideo.id)}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {/* Main Content */}
      {!showModal && (
        <div>
          {/* Hero Banner */}
          <HeroBanner
            video={heroBannerVideo}
            onPlay={() => handlePlayVideo(heroBannerVideo)}
            onMoreInfo={() => handleVideoSelect(heroBannerVideo)}
          />

          {/* Content Rows */}
          <div className=" relative z-10 space-y-8 pb-20 overflow-visible" style={{ marginTop: '-120px' }}>
            {/* Trending Now */}
            <ContentRow
              title="Trending Now"
              videos={trendingVideos}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />

            {/* Top 10 */}
            <ContentRow
              title="Top 10 in Your Country Today"
              videos={top10Videos}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              isTop10={true}
              allVideos={VIDEO_DATA}
            />

            {/* My List */}
            {myListVideos.length > 0 && (
              <ContentRow
                title="My List"
                videos={myListVideos}
                onVideoSelect={handleVideoSelect}
                onAddToList={handleAddToList}
                myList={myList}
                allVideos={VIDEO_DATA}
              />
            )}

            {/* Popular on CineCast */}
            <ContentRow
              title="Popular on CineCast"
              videos={VIDEO_DATA.filter(v => v.rating >= 4.7)}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />

            {/* Movies */}
            <ContentRow
              title="Blockbuster Movies"
              videos={movieVideos}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />

            {/* TV Shows */}
            <ContentRow
              title="Binge-Worthy Series"
              videos={seriesVideos}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />

            {/* Anime */}
            {animeVideos.length > 0 && (
              <ContentRow
                title="Anime Collection"
                videos={animeVideos}
                onVideoSelect={handleVideoSelect}
                onAddToList={handleAddToList}
                myList={myList}
                allVideos={VIDEO_DATA}
              />
            )}

            {/* Action */}
            <ContentRow
              title="Action-Packed Adventures"
              videos={actionVideos}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />

            {/* Comedy */}
            <ContentRow
              title="Comedy & Feel-Good"
              videos={comedyVideos}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />

            {/* Documentaries */}
            <ContentRow
              title="Award-Winning Documentaries"
              videos={documentaryVideos}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />

            {/* New Releases */}
            <ContentRow
              title="New Releases"
              videos={VIDEO_DATA.filter(v => v.year === 2024)}
              onVideoSelect={handleVideoSelect}
              onAddToList={handleAddToList}
              myList={myList}
              allVideos={VIDEO_DATA}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetflixApp;

