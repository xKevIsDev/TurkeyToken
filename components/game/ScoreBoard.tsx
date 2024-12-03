"use client";

import { useGame } from "./GameContext";
import { motion } from 'framer-motion';

interface ScoreBoardProps {
  escapedCount: number;
  maxFragments: number;
  activeCount: number;
}

export function ScoreBoard({ escapedCount, maxFragments, activeCount }: ScoreBoardProps) {
  const { gameState } = useGame();

  return (
    <motion.div 
      className="fixed top-4 left-4 bg-black/80 p-4 rounded-lg text-white space-y-2 backdrop-blur-sm border border-blue-500/30 font-mono"
      initial={{ opacity: 0, x: -100 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        boxShadow: [
          '0 0 10px rgba(59,130,246,0.3)',
          '0 0 20px rgba(59,130,246,0.3)',
          '0 0 10px rgba(59,130,246,0.3)'
        ]
      }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-2xl font-bold text-blue-400"
        animate={{
          textShadow: [
            '0 0 5px #60A5FA',
            '0 0 8px #3B82F6',
            '0 0 5px #60A5FA'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        Bytes: {gameState.score}
      </motion.div>
      <div className="text-blue-300">Runtime Level: {gameState.level}</div>
      <div className="text-blue-300">Bytes to Compile: {gameState.tokensToNextLevel}</div>
      <div className="text-blue-300">Stack Size: {activeCount}/{maxFragments}</div>
      <div className="text-blue-300">Processing Speed: {gameState.multiplier.toFixed(1)}x</div>
      <div className="text-blue-300">Memory Leaks: {escapedCount}/5</div>
    </motion.div>
  );
}