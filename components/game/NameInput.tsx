import { useState } from 'react';
import { motion } from 'framer-motion';

interface NameInputProps {
  onSubmit: (name: string) => void;
}

export function NameInput({ onSubmit }: NameInputProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        className="bg-black/80 p-8 rounded-lg space-y-4 border border-blue-500/30 backdrop-blur-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-mono font-bold text-blue-400">Initialize User</h2>
        <div className="space-y-2">
          <label className="text-blue-300/80 text-sm font-mono">Enter Username:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-black/50 border border-blue-500/30 rounded text-blue-100 font-mono 
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="user_123"
            maxLength={20}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500/20 border border-blue-500/50 text-blue-300 py-2 rounded 
                   hover:bg-blue-500/30 hover:text-blue-200 transition-all font-mono
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Initialize Program_
        </button>
      </motion.form>
    </motion.div>
  );
} 