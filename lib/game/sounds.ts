"use client";

// Cache audio instances
const audioCache: { [key: string]: HTMLAudioElement } = {};

export function playSound(soundName: string, volume: number = 1) {
  if (typeof window === 'undefined') return;

  // Create or get cached audio instance
  if (!audioCache[soundName]) {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.dataset.cached = "true"; // Mark as cached
    audioCache[soundName] = audio;
  }

  const audio = audioCache[soundName];
  audio.volume = volume;
  audio.currentTime = 0;
  
  audio.play().catch(err => console.log('Audio play failed:', err));
}

// Export the cache for muting
export const getAudioCache = () => audioCache; 