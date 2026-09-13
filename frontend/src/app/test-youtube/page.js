'use client';

import { useRef } from 'react';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { useEffect } from 'react';

export default function TestYouTubePage() {
  const containerRef = useRef(null);
  const {
    play,
    pause,
    seekTo,
    setVolume,
    getCurrentTime,
    getDuration,
    isPlaying,
    currentTime,
    duration,
  } = useYouTubePlayer('dQw4w9WgXcQ', containerRef);

  // Expose player to window for testing in development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.testPlayer = {
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
    return () => {
      if (typeof window !== 'undefined') {
        window.testPlayer = undefined;
      }
    };
  }, [play, pause, seekTo, setVolume, getCurrentTime, getDuration, isPlaying, currentTime, duration]);

  return (
    <div>
      <h1>YouTube Player Test</h1>
      <div ref={containerRef} style={{ width: 400, height: 300, margin: '20px 0' }} />
      <div>
        <p>isPlaying: {isPlaying.toString()}</p>
        <p>currentTime: {currentTime}</p>
        <p>duration: {duration}</p>
      </div>
    </div>
  );
}