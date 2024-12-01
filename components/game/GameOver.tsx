import { motion } from 'framer-motion';
import { useGame } from './GameContext';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  onPlayAgain: () => Promise<void>;
}

export function GameOver({ onPlayAgain }: GameOverProps) {
  const { gameState } = useGame();

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg text-center space-y-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold">Game Over!</h2>
        <div className="space-y-2">
          <p className="text-xl">Final Score: {Math.floor(gameState.score)}</p>
          <p>Level Reached: {gameState.level}</p>
        </div>
        <Button onClick={onPlayAgain}>Play Again</Button>
      </motion.div>
    </motion.div>
  );
} 