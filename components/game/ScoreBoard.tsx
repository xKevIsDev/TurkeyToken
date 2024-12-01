"use client";

import { useGame } from "./GameContext";

interface ScoreBoardProps {
  escapedCount: number;
  maxTurkeys: number;
  activeCount: number;
}

export function ScoreBoard({ escapedCount, maxTurkeys, activeCount }: ScoreBoardProps) {
  const { gameState } = useGame();

  return (
    <div className="fixed top-4 left-4 bg-black/50 p-4 rounded-lg text-white space-y-2">
      <div className="text-2xl font-bold">Score: {gameState.score}</div>
      <div>Level: {gameState.level}</div>
      <div>Tokens to next level: {gameState.tokensToNextLevel}</div>
      <div>Turkeys needed per token: {gameState.turkeysNeeded}</div>
      <div>Multiplier: {gameState.multiplier.toFixed(1)}x</div>
      <div>Active Turkeys: {activeCount}/{maxTurkeys}</div>
      <div>Escaped: {escapedCount}/5</div>
    </div>
  );
}