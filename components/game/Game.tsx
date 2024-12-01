"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Turkey } from "./Turkey";
import { Character } from "./Character";
import { ScoreBoard } from "./ScoreBoard";
import { useGame } from "./GameContext";
import { TurkeySprite, Character as CharacterType, Position } from "@/lib/game/types";
import { generateTurkey } from "@/lib/game/utils";
import { LevelUpSprite } from "./LevelUpSprite";
import { SoundToggle } from "./SoundToggle";
import { GameOver } from "./GameOver";
import { Leaderboard } from "./Leaderboard";

export function Game() {
  const [turkeys, setTurkeys] = useState<TurkeySprite[]>([]);
  const [mounted, setMounted] = useState(false);
  const [escapedCount, setEscapedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [character, setCharacter] = useState<CharacterType>({
    position: { x: 0, y: 0 },
    targetPosition: null,
    speed: 5,
  });
  
  const { gameState, submitScore, resetGame } = useGame();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const maxTurkeys = 5 + gameState.level;
  const spawnInterval = Math.max(2000 - (gameState.level * 100), 500);

  const updateCharacterPosition = useCallback((position: Position) => {
    setCharacter(prev => ({
      ...prev,
      position
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setCharacter(prev => ({
        ...prev,
        position: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
      }));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === gameContainer) {
        setCharacter(prev => ({
          ...prev,
          position: {
            x: Math.max(0, Math.min(window.innerWidth, prev.position.x + e.movementX)),
            y: Math.max(0, Math.min(window.innerHeight, prev.position.y + e.movementY))
          }
        }));
      }
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement !== gameContainer) {
        gameContainer.requestPointerLock();
      }
    };

    const handleClick = () => {
      if (document.pointerLockElement !== gameContainer) {
        gameContainer.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gameContainer.addEventListener('click', handleClick);

    gameContainer.requestPointerLock();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gameContainer.removeEventListener('click', handleClick);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || isGameOver) return;

    const interval = setInterval(() => {
      setTurkeys(prev => {
        if (prev.length >= maxTurkeys) return prev;
        return [...prev, generateTurkey(gameState.level)];
      });
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [mounted, isGameOver, gameState.level, maxTurkeys, spawnInterval]);

  const handleCatch = useCallback((turkeyId: string) => {
    setTurkeys(prev => prev.filter(t => t.id !== turkeyId));
  }, []);

  const handleEscape = useCallback((turkeyId: string) => {
    setTurkeys(prev => prev.filter(t => t.id !== turkeyId));
    setEscapedCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setIsGameOver(true);
      }
      return newCount;
    });
  }, []);

  const handleGameReset = async () => {
    submitScore().catch(error => {
      console.error('Failed to submit score on game over:', error);
    });
    resetGame();
    setEscapedCount(0);
    setIsGameOver(false);
    setTurkeys([]);
    setCharacter(prev => ({
      ...prev,
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      },
      targetPosition: null
    }));
  };

  if (!mounted) return null;

  return (
    <>
      <SoundToggle />
      <div 
        ref={gameContainerRef}
        className="game-container relative w-full h-screen overflow-hidden cursor-none"
        tabIndex={0}
      >
        <ScoreBoard escapedCount={escapedCount} maxTurkeys={maxTurkeys} activeCount={turkeys.length} />
        <Leaderboard />
        <LevelUpSprite show={gameState.showLevelUp} level={gameState.level} />
        <Character 
          character={character}
          onPositionUpdate={updateCharacterPosition}
        />
        {turkeys.map((turkey) => (
          <Turkey 
            key={turkey.id} 
            sprite={turkey} 
            onCatch={handleCatch}
            onEscape={handleEscape}
            characterPosition={character.position}
          />
        ))}
      </div>
      {isGameOver && <GameOver onPlayAgain={handleGameReset} />}
    </>
  );
}