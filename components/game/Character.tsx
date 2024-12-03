"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Character as CharacterType, Position } from "@/lib/game/types";

interface CharacterProps {
  character: CharacterType;
  onPositionUpdate: (position: Position) => void;
}

export function Character({ character, onPositionUpdate }: CharacterProps) {
  useEffect(() => {
    onPositionUpdate(character.position);
  }, [character.position, onPositionUpdate]);

  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: character.position.x - 24,
        top: character.position.y - 24,
      }}
      animate={{
        scale: character.targetPosition ? 1.2 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Electric glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Character sprite with electric effect */}
      <motion.div
        animate={{
          filter: [
            'brightness(1) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
            'brightness(1.2) drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))',
            'brightness(1) drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
          ],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src="/sprites/fragment.png"
          alt="Electric Character"
          className="w-16 h-16 relative z-10 scale-2"
          style={{
            transform: `scaleX(${character.targetPosition && character.targetPosition.x < character.position.x ? 1 : -1})`,
            filter: 'brightness(1.1) contrast(1.1)',
          }}
        />
      </motion.div>

      {/* Electric particles */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              rotate: `${i * 60}deg`,
              translateX: '20px',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}