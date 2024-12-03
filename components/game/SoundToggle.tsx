"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { getAudioCache } from "@/lib/game/sounds";

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Mute all regular audio elements
    const audioElements = document.getElementsByTagName('audio');
    Array.from(audioElements).forEach(audio => {
      audio.muted = newMutedState;
    });

    // Mute all cached audio elements
    const cachedAudios = Object.values(getAudioCache());
    cachedAudios.forEach(audio => {
      audio.muted = newMutedState;
    });
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-white" />
      ) : (
        <Volume2 className="w-6 h-6 text-white" />
      )}
    </button>
  );
} 