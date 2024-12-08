"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Character } from "./Character";
import { ScoreBoard } from "./ScoreBoard";
import { useGame } from "./GameContext";
import { Character as CharacterType, Position, FragmentSprite } from "@/lib/game/types";
import { LevelUp } from "./LevelUp";
import { SoundToggle } from "./SoundToggle";
import { GameOver } from "./GameOver";
import { Leaderboard } from "./Leaderboard";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AnalogStick } from './AnalogStick';
import { PauseMenu } from './PauseMenu';
import { Fragment } from "./Fragment";
import { motion } from 'framer-motion';
import { generateFragment } from "@/lib/game/utils";
import { memo } from 'react';

export function Game() {
  const [fragments, setFragments] = useState<FragmentSprite[]>([]);
  const [mounted, setMounted] = useState(false);
  const [escapedCount, setEscapedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [character, setCharacter] = useState<CharacterType>({
    position: { x: 0, y: 0 },
    targetPosition: null,
    speed: 5,
  });
  const [isPaused, setIsPaused] = useState(false);
  
  const { gameState, submitScore, resetGame } = useGame();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const maxFragments = useMemo(() => 5 + gameState.level, [gameState.level]);
  const spawnInterval = useMemo(() => Math.max(2000 - (gameState.level * 100), 500), [gameState.level]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [analogPosition, setAnalogPosition] = useState<Position>({ x: 0, y: 0 });

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
    if (!mounted || isMobile) return;
    
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
      if (!isMobile && document.pointerLockElement !== gameContainer && !isGameOver) {
        gameContainer.requestPointerLock();
      }
    };

    const handleClick = () => {
      if (!isMobile && document.pointerLockElement !== gameContainer && !isGameOver) {
        gameContainer.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    gameContainer.addEventListener('click', handleClick);

    if (!isMobile && !isGameOver) {
      gameContainer.requestPointerLock();
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      gameContainer.removeEventListener('click', handleClick);
      
      if (document.pointerLockElement === gameContainer) {
        document.exitPointerLock();
      }
    };
  }, [mounted, isMobile, isGameOver]);

  useEffect(() => {
    if (!mounted || isGameOver) return;

    const interval = setInterval(() => {
      setFragments(prev => {
        if (prev.length >= maxFragments) return prev;
        return [...prev, generateFragment(gameState.level)];
      });
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [mounted, isGameOver, gameState.level, maxFragments, spawnInterval]);

  const handleCatch = useCallback((fragmentId: string) => {
    setFragments(prev => prev.filter(t => t.id !== fragmentId));
  }, []);

  const handleEscape = useCallback((fragmentId: string) => {
    setFragments(prev => prev.filter(t => t.id !== fragmentId));
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
    setFragments([]);
    setCharacter(prev => ({
      ...prev,
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      },
      targetPosition: null
    }));
  };

  const handleAnalogMove = useCallback((position: Position) => {
    if (isMobile) {
      const baseSpeed = 3; // Reduced from 5

      setCharacter(prev => ({
        ...prev,
        position: {
          x: Math.max(0, Math.min(window.innerWidth, prev.position.x + (position.x * baseSpeed))),
          y: Math.max(0, Math.min(window.innerHeight, prev.position.y + (position.y * baseSpeed)))
        }
      }));
    }
  }, [isMobile, gameState.level]);

  // Use requestAnimationFrame for smoother movement
  useEffect(() => {
    if (!isMobile || !analogPosition.x && !analogPosition.y) return;

    let animationFrame: number;
    const updatePosition = () => {
      handleAnalogMove(analogPosition);
      animationFrame = requestAnimationFrame(updatePosition);
    };

    animationFrame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrame);
  }, [isMobile, analogPosition, handleAnalogMove]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGameOver) {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameOver]);

  const handlePause = useCallback(() => setIsPaused(true), []);

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsPaused(false);
    handleGameReset();
  };

  const handleQuit = () => {
    window.location.href = '/';
  };

  const GridPattern = useMemo(() => (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, #1d4ed8 1px, transparent 1px),
          linear-gradient(to bottom, #1d4ed8 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
    />
  ), []);

  const GlowingCircles = useMemo(() => (
    [...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-blue-500/10 blur-xl"
        style={{
          width: '200px',
          height: '200px',
          left: `${i * 10}%`,
          top: `${i * 10}%`,
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      />
    ))
  ), []);

  const BinaryRain = useMemo(() => (
    [...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-blue-500/10 font-mono text-sm"
        style={{
          left: `${i * 6.66}%`,
        }}
        initial={{ y: -20 }}
        animate={{
          y: window.innerHeight + 20,
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "linear",
        }}
      >
        {i % 2 === 0 ? '1' : '0'}
      </motion.div>
    ))
  ), []);

  const GameElements = useMemo(() => (
    <>
      <ScoreBoard 
        escapedCount={escapedCount} 
        maxFragments={maxFragments} 
        activeCount={fragments.length} 
      />
      <Leaderboard />
      <LevelUp show={gameState.showLevelUp} level={gameState.level} />
      <Character 
        character={character}
        onPositionUpdate={updateCharacterPosition}
      />
      {!isPaused && fragments.map((fragment) => (
        <Fragment 
          key={fragment.id} 
          sprite={fragment} 
          onCatch={handleCatch}
          onEscape={handleEscape}
          characterPosition={character.position}
        />
      ))}
    </>
  ), [
    escapedCount, 
    maxFragments, 
    fragments, 
    gameState.showLevelUp, 
    gameState.level,
    character,
    isPaused,
    handleCatch,
    handleEscape,
    updateCharacterPosition
  ]);

  if (!mounted) return null;

  return (
    <>
      <SoundToggle />
      <PauseButton onClick={handlePause} />
      
      <div className="fixed inset-0 bg-black">
        {GridPattern}
        {GlowingCircles}
        {BinaryRain}
      </div>

      <div 
        ref={gameContainerRef}
        className="game-container relative w-full h-screen overflow-hidden"
        style={{ cursor: isMobile ? 'default' : 'none' }}
        tabIndex={0}
      >
        {GameElements}
        {isMobile && (
          <AnalogStick 
            onMove={handleAnalogMove}
            className="fixed bottom-16 left-8 z-50"
          />
        )}
      </div>
      
      <PauseMenu
        isOpen={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />
      
      {isGameOver && <GameOver onPlayAgain={handleGameReset} />}
    </>
  );
}

const PauseButton = memo(({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="fixed top-4 right-4 bg-black/50 p-3 rounded-full z-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-white"
    >
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  </button>
));