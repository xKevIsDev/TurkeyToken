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
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.form
        className="bg-white p-6 rounded-lg space-y-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold">Enter Your Name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Your name"
          maxLength={20}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Start Game
        </button>
      </motion.form>
    </motion.div>
  );
} 