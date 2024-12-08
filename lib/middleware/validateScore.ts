import { NextResponse } from 'next/server';

interface GameScore {
  score: number;
  level: number;
  timestamp: number;
}

const POINTS_PER_LEVEL = 100; // Adjust based on your game mechanics
const MAX_POSSIBLE_SCORE = 100000; // Set a reasonable maximum

export function validateScore(score: number, level: number): boolean {
  // Basic validation rules
  if (score < 0 || level < 1) return false;
  if (score > MAX_POSSIBLE_SCORE) return false;
  
  // Calculate theoretical maximum score for this level
  const theoreticalMaxScore = level * POINTS_PER_LEVEL * 2;
  
  // Check if score is within reasonable bounds
  if (score > theoreticalMaxScore) return false;
  
  return true;
} 