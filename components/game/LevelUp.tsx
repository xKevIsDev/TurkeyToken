"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LevelUpProps {
  show: boolean;
  level: number;
}

export function LevelUp({ show, level }: LevelUpProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            />
            
            {/* Level up text */}
            <motion.div
              className="text-6xl font-bold text-yellow-400 text-center drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            >
              Level {level}!
            </motion.div>
            
            {/* Stars effect */}
            <motion.div
              className="absolute -inset-10"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                ease: "linear",
              }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-yellow-400"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 45}deg) translateY(-40px)`,
                    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 