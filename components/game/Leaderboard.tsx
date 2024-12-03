import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  timestamp: number;
}

export function Leaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/leaderboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setScores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setError('Unable to load leaderboard');
        setScores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 20000);
    return () => clearInterval(interval);
  }, []);

  // TODO: Add a button to toggle the leaderboard for mobile

  return (
    <motion.div 
      className="hidden md:block fixed top-4 right-4 bg-black/80 p-4 rounded-lg text-white w-64 backdrop-blur-sm border border-blue-500/30 font-mono"
      initial={{ opacity: 0, x: 100 }}
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
      <motion.h2 
        className="text-xl font-bold mb-4 text-blue-400"
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
        Global Leaderboard
      </motion.h2>
      
      {loading ? (
        <div className="text-center py-4 text-blue-300">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-4">{error}</div>
      ) : scores.length === 0 ? (
        <div className="text-center text-blue-300/50 py-4">No scores yet</div>
      ) : (
        <div className="space-y-2">
          {scores.map((entry) => (
            <motion.div 
              key={`${entry.name}-${entry.timestamp}`}
              className="flex justify-between items-center text-blue-300"
              whileHover={{
                textShadow: '0 0 8px rgba(59,130,246,0.5)',
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-50">#{entry.rank}</span>
                <span className="font-medium truncate max-w-[120px]">{entry.name}</span>
              </div>
              <span className="font-mono">{entry.score.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
} 