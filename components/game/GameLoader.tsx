"use client";

import { useEffect, useState } from "react";
import { Game } from "./Game";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { playSound } from "@/lib/game/sounds";
import { NameInput } from "./NameInput";
import { useGame } from "./GameContext";
import { ElectricText } from "@/components/ui/electric-text";

export function GameLoader() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { gameState, setPlayerName } = useGame();

  

  useEffect(() => {
    setMounted(true);
  }, []);

  const startLoading = () => {
    setHasInteracted(true);
    playSound('click', 0.5);
  };

    // Play running sound effect once when loading starts
    useEffect(() => {
      if (loading && hasInteracted) {
        playSound('electric', 0.3);
      }
    }, [hasInteracted]); // Only trigger when user first interacts

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (hasInteracted) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setLoading(false);
            setShowNameInput(true);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [hasInteracted]);

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNameInput(false);
    setGameStarted(true);
  };

  if (!mounted) return null;


  if (gameStarted) {
    return <Game />;
  }

  if (showNameInput) {
    return <NameInput onSubmit={handleNameSubmit} />;
  }

  if (!hasInteracted) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-black p-4"
        onClick={startLoading}
      >
        <motion.div
          className="relative text-center space-y-4 md:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ElectricText />
          <div className="space-y-2">
            <p className="text-base md:text-xl text-blue-300/80 font-mono">
              System Status: <span className="text-red-400">Memory Leak Detected</span>
            </p>
            <p className="text-sm md:text-lg text-blue-300/60 font-mono animate-pulse">
              Click to Initialize System Recovery_
            </p>
            <a href="https://x.com/KevIsDev" className="text-sm md:text-base text-blue-300/60 font-mono">
              Built by @KevIsDev
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-6 md:space-y-12 relative p-4">
              <motion.div
                className="text-3xl md:text-6xl font-mono font-bold text-blue-400 text-center"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                System Boot
              </motion.div>

              {/* Loading Progress */}
              <div className="relative w-full max-w-[320px] md:max-w-[384px] space-y-4">
                <div className="font-mono text-blue-300/80 text-xs md:text-sm">
                  Initializing Memory Recovery Protocol...
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 bg-blue-900/20" 
                />
                <div className="text-blue-400/60 font-mono text-xs md:text-sm">
                  Loading Core Components: {progress}%
                </div>
              </div>

              {/* Loading Tips */}
              <motion.div
                className="text-blue-300/60 font-mono text-xs md:text-sm max-w-[280px] md:max-w-md text-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                DEBUG: Collect language fragments to prevent system memory leaks
              </motion.div>

              {/* Credits Section */}
              <motion.div
                className="absolute bottom-4 text-white/40 text-[10px] md:text-xs text-center w-full px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0 }}
              >
                <p className="mb-1">Sound Credits:</p>
                <ul className="space-y-0.5">
                  <li className="line-clamp-1 hover:line-clamp-none">Electric Loading Effect by <a href="https://pixabay.com/users/freesound_community-46691455/">freesound_community</a> from Pixabay</li>
                  <li className="line-clamp-1 hover:line-clamp-none">Zap Effect by <a href="https://pixabay.com/users/rescopicsound-45188866/">Rescopic Sound</a> from Pixabay</li>
                </ul>
              </motion.div>

              {/* Binary Rain Effect - Reduced for mobile */}
              {[...Array(window.innerWidth < 768 ? 10 : 20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-blue-500/20 font-mono text-sm"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -100
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Game />
    </>
  );
} 