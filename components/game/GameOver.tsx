import { motion } from 'framer-motion';
import { useGame } from './GameContext';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface GameOverProps {
  onPlayAgain: () => Promise<void>;
}

export function GameOver({ onPlayAgain }: GameOverProps) {
  const { gameState } = useGame();

  useEffect(() => {
    // Release pointer lock when game over screen appears
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }

    // Handle enter key press
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        await onPlayAgain();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayAgain]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Memory Leak Effect - Random floating 1s and 0s */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-500/30 font-mono text-xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100
          }}
          animate={{
            y: -100,
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </motion.div>
      ))}

      {/* Glitch Container */}
      <motion.div
        className="bg-black/80 p-8 rounded-lg text-center space-y-4 border border-red-500/50 relative backdrop-blur-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: [-2, 2, -2],
          boxShadow: [
            '0 0 10px rgba(239, 68, 68, 0.5)',
            '0 0 20px rgba(239, 68, 68, 0.5)',
            '0 0 10px rgba(239, 68, 68, 0.5)'
          ]
        }}
        transition={{
          duration: 0.5,
          x: {
            duration: 0.1,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
      >
        {/* Error Message */}
        <motion.div
          animate={{
            opacity: [1, 0.8, 1],
            color: ['#ef4444', '#ffffff', '#ef4444']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <h2 className="text-2xl font-mono font-bold mb-4">FATAL ERROR</h2>
          <div className="text-sm font-mono opacity-70 mb-4">
            MEMORY_LEAK_DETECTED: Process terminated
          </div>
        </motion.div>

        <div className="space-y-2 text-white/80 font-mono">
          <p className="text-xl">Bytes Processed: {Math.floor(gameState.score)}</p>
          <p>Runtime Level: {gameState.level}</p>
        </div>

        <Button 
          onClick={onPlayAgain}
          className="bg-red-500 hover:bg-red-600 text-white mt-4 font-mono"
        >
          REBOOT SYSTEM (Press Enter)
        </Button>

        {/* Glitch Lines */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(transparent 0%, rgba(239, 68, 68, 0.1) 50%, transparent 100%)',
              'linear-gradient(transparent 100%, rgba(239, 68, 68, 0.1) 200%, transparent 300%)'
            ]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </motion.div>
  );
} 