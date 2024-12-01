"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface GameState {
  score: number;
  level: number;
  tokensToNextLevel: number;
  multiplier: number;
  turkeysNeeded: number;
  showLevelUp: boolean;
  playerName: string | null;
}

interface GameContextType {
  gameState: GameState;
  addScore: (points: number) => void;
  decreaseToken: () => void;
  resetGame: () => void;
  setPlayerName: (name: string) => void;
  submitScore: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const TOKENS_PER_LEVEL = 5; // Constant number of tokens needed per level

const INITIAL_STATE: GameState = {
  score: 0,
  level: 1,
  tokensToNextLevel: TOKENS_PER_LEVEL,
  multiplier: 1,
  turkeysNeeded: 1,
  showLevelUp: false,
  playerName: null,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [lastSubmittedScore, setLastSubmittedScore] = useState(0);

  const addScore = (points: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + points * prev.multiplier,
    }));
  };

  const decreaseToken = () => {
    setGameState((prev) => {
      const turkeysCaught = Math.floor(prev.score / 10);

      if (turkeysCaught >= prev.turkeysNeeded) {
        const newTokensToNextLevel = prev.tokensToNextLevel - 1;

        if (newTokensToNextLevel <= 0) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, showLevelUp: false }));
          }, 2000);

          return {
            ...prev,
            level: prev.level + 1,
            tokensToNextLevel: TOKENS_PER_LEVEL,
            multiplier: prev.multiplier + 0.2,
            turkeysNeeded: prev.turkeysNeeded + 1,
            showLevelUp: true,
          };
        }

        return {
          ...prev,
          tokensToNextLevel: newTokensToNextLevel,
        };
      }

      return prev;
    });
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

  const setPlayerName = (name: string) => {
    setGameState((prev) => ({
      ...prev,
      playerName: name,
    }));
  };

  const submitScore = async () => {
    if (!gameState.playerName) {
      console.log('Final score not submitted: No player name');
      return;
    }

    const finalScore = Math.floor(gameState.score);
    
    try {
      console.log('Submitting final score:', {
        name: gameState.playerName,
        score: finalScore,
        level: gameState.level
      });

      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: gameState.playerName,
          score: finalScore,
          level: gameState.level
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit score: ${response.statusText}`);
      }

      const data = await response.json();
      setLastSubmittedScore(finalScore);
      
      toast.success(`Game Over! Final Score: ${finalScore} - Rank: #${data.rank}`);
      return data;
    } catch (error) {
      console.error('Error submitting final score:', error);
      toast.error('Failed to submit final score');
      throw error;
    }
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      addScore, 
      decreaseToken, 
      resetGame,
      setPlayerName,
      submitScore
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}