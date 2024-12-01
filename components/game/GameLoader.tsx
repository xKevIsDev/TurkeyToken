"use client";

import { useEffect, useState } from "react";
import { Game } from "./Game";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { playSound } from "@/lib/game/sounds";
import { NameInput } from "./NameInput";
import { useGame } from "./GameContext";

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
        playSound('footsteps', 0.2);
        playSound('turkey', 0.1);
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
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        onClick={startLoading}
      >
        <div className="absolute inset-0 bg-black/30" />
        <motion.div
          className="relative text-white text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">Turkey Tokens</h1>
          <p className="text-xl drop-shadow-md font-thin animate-bounce">Dont let the turkeys escape!</p>
          <p className="text-xl drop-shadow-md font-thin">Click anywhere to start</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: "url('/backgrounds/background.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="flex flex-col items-center justify-center h-full space-y-12 relative">
              {/* Game Title */}
              <motion.div
                className="text-6xl font-bold text-white text-center"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Turkey Tokens
              </motion.div>

              {/* Loading Animation Container */}
              <div className="relative w-96 h-32">
                {/* Running path decoration */}
                <div className="absolute bottom-8 w-full h-[2px] bg-white/10" />
                
                {/* Turkey running animation */}
                <motion.div
                  initial={{ x: 100 }}
                  animate={{ x: progress * 4 }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  className="absolute bottom-10 z-10"
                >
                  <motion.img
                    src="/sprites/turkey.png"
                    alt="Turkey"
                    className="w-16 h-16 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    animate={{
                      y: [0, -15, 0],
                      scaleX: -1,
                    }}
                    transition={{
                      y: {
                        duration: 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    }}
                  />
                </motion.div>

                {/* Bolt character chasing */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: progress * 4 - 100 }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  className="absolute bottom-10 z-10"
                >
                  <motion.img
                    src="/sprites/bolt.png"
                    alt="Bolt"
                    className="w-16 h-16 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    animate={{
                      y: [0, -20, 0],
                      scale: 1.2,
                      scaleX: -1,
                    }}
                    transition={{
                      y: {
                        duration: 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    }}
                  />
                </motion.div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 w-full px-1">
                  <Progress 
                    value={progress} 
                    className="h-2 bg-white/10" 
                  />
                </div>
              </div>

              {/* Loading Text */}
              <motion.div
                className="text-white/80 text-xl"
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Loading... {progress}%
              </motion.div>

              {/* Loading Tips */}
              <motion.div
                className="text-white/60 text-sm max-w-md text-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Tip: Catch more turkeys to level up and increase your multiplier!
              </motion.div>

              {/* Credits Section */}
              <motion.div
                className="absolute bottom-4 text-white/40 text-xs text-center w-full px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0 }}
              >
                <p className="mb-1">Sound Credits:</p>
                <ul className="space-y-0.5">
                  <li>Footsteps: <a href="https://pixabay.com/users/mathias28-27838952/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=112647">Mathias28</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=112647">Pixabay</a></li>
                  <li>Footsteps & Catch Sound: <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=39222">freesound_community</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=39222">Pixabay</a></li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Game />
    </>
  );
} 