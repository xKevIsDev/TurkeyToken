"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  level: number;
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
    // Fetch every 20 seconds
    const interval = setInterval(fetchScores, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div 
        className="fixed top-4 right-4 bg-black/80 p-4 rounded-lg text-white w-64 backdrop-blur-sm border border-blue-500/30 font-mono"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="text-center text-blue-400 animate-pulse">
          Loading Leaderboard...
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="fixed top-4 right-4 bg-black/80 p-4 rounded-lg text-white w-64 backdrop-blur-sm border border-red-500/30 font-mono"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="text-center text-red-400">
          {error}
        </div>
      </motion.div>
    );
  }

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
      <h2 className="text-xl font-bold text-blue-400 mb-4">Top Scores</h2>
      <div className="space-y-2">
        {scores.map((entry) => (
          <div 
            key={`${entry.name}-${entry.timestamp}`}
            className="flex justify-between items-center text-sm border-b border-blue-500/20 pb-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-400">#{entry.rank}</span>
              <span className="text-blue-100">{entry.name}</span>
            </div>
            <div className="text-right">
              <div className="text-blue-200">{entry.score}</div>
              <div className="text-xs text-blue-400/60">
                Level {entry.level}
              </div>
              <div className="text-xs text-blue-400/40">
                {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 