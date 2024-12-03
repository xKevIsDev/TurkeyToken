import { motion } from 'framer-motion';

export const ElectricText = () => {
  const textVariants = {
    initial: {
      textShadow: "0 0 8px #60A5FA, 0 0 12px #3B82F6, 0 0 16px #2563EB"
    },
    animate: {
      textShadow: [
        "0 0 8px #60A5FA, 0 0 12px #3B82F6, 0 0 16px #2563EB",
        "0 0 16px #60A5FA, 0 0 24px #3B82F6, 0 0 32px #2563EB",
        "0 0 8px #60A5FA, 0 0 12px #3B82F6, 0 0 16px #2563EB"
      ],
      x: [-1, 1, -1, 1, 0],
      y: [0, -1, 1, 0],
      transition: {
        x: {
          repeat: Infinity,
          duration: 0.2,
          ease: "linear"
        },
        y: {
          repeat: Infinity,
          duration: 0.3,
          ease: "linear"
        },
        textShadow: {
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <motion.h1
      className="text-6xl font-mono font-bold mb-4 text-blue-400"
      initial="initial"
      animate="animate"
      variants={textVariants}
    >
      Byte Blitz
    </motion.h1>
  );
};