"use client";

import { TurkeySprite } from "./types";

export function generateTurkey(level: number = 1): TurkeySprite {
  const id = Math.random().toString(36).substring(7);
  const side = Math.random() > 0.5 ? "left" : "right";
  
  // Default values for SSR
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
  
  const position = {
    x: side === "left" ? -50 : screenWidth,
    y: Math.random() * (screenHeight - 100),
  };

  // Increase base speed and randomness with level
  const baseSpeed = Math.min(2 + (level * 0.5), 8); // Cap at max speed
  const randomFactor = 1 + (level * 0.2); // Increase random movement with level
  
  const speed = {
    x: (side === "left" ? 1 : -1) * (baseSpeed + Math.random() * randomFactor),
    y: (Math.random() - 0.5) * (2 + level * 0.3), // Increase vertical movement with level
  };

  return {
    id,
    position,
    speed,
    changeDirectionInterval: Math.max(2000 - (level * 200), 500), // Decrease interval with level
  };
}