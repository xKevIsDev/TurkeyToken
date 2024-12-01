import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed top-4 right-4 bg-black/50 p-4 rounded-lg text-white w-64"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4">Global Leaderboard</h2>
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-4">{error}</div>
      ) : scores.length === 0 ? (
        <div className="text-center text-gray-400 py-4">No scores yet</div>
      ) : (
        <div className="space-y-2">
          {scores.map((entry) => (
            <div 
              key={`${entry.name}-${entry.timestamp}`}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-50">#{entry.rank}</span>
                <span className="font-medium truncate max-w-[120px]">{entry.name}</span>
              </div>
              <span className="font-mono">{entry.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
} 