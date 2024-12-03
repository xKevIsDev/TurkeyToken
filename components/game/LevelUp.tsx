"use client";

import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";

interface LevelUpProps {
  show: boolean;
  level: number;
}

export const LevelUp = memo(function LevelUp({ show, level }: LevelUpProps) {
  // Reduce number of particles based on device performance
  const particleCount = window.innerWidth < 768 ? 6 : 8;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {/* Simplified glow effect */}
            <motion.div
              className="absolute inset-0 bg-blue-500/20 blur-lg rounded-sm"
              animate={{
                opacity: [0.3, 0.6, 0],
              }}
              transition={{
                duration: 1,
                ease: "linear"
              }}
            />
            
            {/* Level up text */}
            <motion.div
              className="text-4xl md:text-6xl font-mono font-bold text-blue-400 text-center"
              style={{
                textShadow: '0 0 10px rgba(59,130,246,0.5)'
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1,
                ease: "easeOut"
              }}
            >
              Runtime Level {level}
            </motion.div>
            
            {/* Optimized binary particles */}
            <div className="absolute -inset-16">
              {[...Array(particleCount)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute font-mono text-blue-500/50"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * (360 / particleCount)}deg) translateY(-50px)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 0],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: i * 0.05,
                  }}
                >
                  {i % 2 ? '1' : '0'}
                </motion.div>
              ))}
            </div>

            {/* Simplified electric arcs */}
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={`arc-${i}`}
                className="absolute w-0.5 h-16 bg-blue-400/30 blur-sm"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 180}deg)`,
                  transformOrigin: '0 0'
                }}
                animate={{
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 0.4,
                  repeat: 2,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}); 