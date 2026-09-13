import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for YouTube IFrame Player API
 * @param {string} videoId - YouTube video ID
 * @param {React.RefObject<HTMLDivElement>} containerRef - Ref to the container div
 * @returns {Object} Player controls and state
 */
export function useYouTubePlayer(videoId, containerRef) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // Load YouTube IFrame API script only once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Cleanup on unmount
    return () => {
      // Note: We cannot remove the script as it may be used by other instances
      // but we can prevent duplicate loading by checking window.YT
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    // Callback for when API loads
    window.onYouTubeIframeAPIReady = () => {
      if (containerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId || '',
          playerVars: {
            controls: 0,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event) => {
              // Get duration after video is loaded
              const dur = event.target.getDuration();
              if (dur > 0) {
                setDuration(dur);
              }
            },
            onStateChange: (event) => {
              switch (event.data) {
                case window.YT.PlayerState.PLAYING:
                  setIsPlaying(true);
                  // Start interval to update currentTime
                  intervalRef.current = setInterval(() => {
                    const current = playerRef.current?.getCurrentTime() || 0;
                    setCurrentTime(current);
                  }, 500);
                  break;
                case window.YT.PlayerState.PAUSED:
                case window.YT.PlayerState.ENDED:
                  setIsPlaying(false);
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                  break;
                case window.YT.PlayerState.BUFFERING:
                  // Still consider playing when buffering
                  setIsPlaying(true);
                  break;
                default:
                  break;
              }
            },
            onError: (error) => {
              console.error('YouTube player error:', error);
            },
          },
        });
      }
    };
  }, [videoId, containerRef]);

  // Update player when videoId changes
  useEffect(() => {
    if (playerRef.current && videoId) {
      playerRef.current.loadVideoById(videoId);
      // Reset time when video changes
      setCurrentTime(0);
    }
  }, [videoId, playerRef]);

  // Play video
  const play = () => {
    playerRef.current?.playVideo();
  };

  // Pause video
  const pause = () => {
    playerRef.current?.pauseVideo();
  };

  // Seek to seconds
  const seekTo = (seconds) => {
    playerRef.current?.seekTo(seconds, true);
  };

  // Set volume (0-100)
  const setVolume = (volume) => {
    playerRef.current?.setVolume(volume);
  };

  // Get current time
  const getCurrentTime = () => {
    return playerRef.current ? playerRef.current.getCurrentTime() : 0;
  };

  // Get duration
  const getDuration = () => {
    return playerRef.current ? playerRef.current.getDuration() : 0;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  return {
    play,
    pause,
    seekTo,
    setVolume,
    getCurrentTime,
    getDuration,
    isPlaying,
    currentTime,
    duration,
  };
}