"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "./GameContext";
import { Position, FragmentSprite } from "@/lib/game/types";
import { playSound } from "@/lib/game/sounds";

interface FragmentProps {
  sprite: FragmentSprite;
  onCatch: (id: string) => void;
  onEscape: (id: string) => void;
  characterPosition: Position;
}

export function Fragment({ sprite, onCatch, onEscape, characterPosition }: FragmentProps) {
  const { addScore, decreaseToken, gameState } = useGame();
  const [position, setPosition] = useState(sprite.position);
  const [speed, setSpeed] = useState(sprite.speed);
  const [caught, setCaught] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [hasDecreasedToken, setHasDecreasedToken] = useState(false);
  const [hasEscaped, setHasEscaped] = useState(false);

  const programmingIcons = [
    { icon: '/sprites/icons/typescript.png', color: '#3178C6', name: 'TypeScript', size: { width: 40, height: 40 } },
    { icon: '/sprites/icons/python.png', color: '#3776AB', name: 'Python', size: { width: 40, height: 40 } },
    { icon: '/sprites/icons/javascript.png', color: '#F7DF1E', name: 'JavaScript', size: { width: 40, height: 40 } },
    { icon: '/sprites/icons/react.png', color: '#61DAFB', name: 'React', size: { width: 40, height: 40 } },
    { icon: '/sprites/icons/nodejs.png', color: '#339933', name: 'Node.js', size: { width: 40, height: 40 } },
    { icon: '/sprites/icons/bolt.png', color: '#000000', name: 'Rust', size: { width: 40, height: 40 } }
  ];

  const [selectedIcon] = useState(() => 
    programmingIcons[Math.floor(Math.random() * programmingIcons.length)]
  );

  useEffect(() => {
    if (caught) return;

    const interval = setInterval(() => {
      setSpeed(prev => ({
        x: prev.x * (0.8 + Math.random() * 0.4),
        y: prev.y + (Math.random() - 0.5) * (1 + gameState.level * 0.2),
      }));
    }, sprite.changeDirectionInterval);

    return () => clearInterval(interval);
  }, [caught, sprite.changeDirectionInterval, gameState.level]);

  useEffect(() => {
    if (caught) return;

    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: prev.x + speed.x,
        y: Math.max(0, Math.min(window.innerHeight - 48, prev.y + speed.y)),
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [speed, caught]);

  useEffect(() => {
    if (caught) return;
    if (position.x < -100 || position.x > window.innerWidth + 100) {
      onEscape(sprite.id);
    }
  }, [position.x, caught, sprite.id, onEscape]);

  useEffect(() => {
    if (caught || hasDecreasedToken) return;

    const dx = position.x - characterPosition.x;
    const dy = position.y - characterPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 25) {
      addScore(10);
      decreaseToken();
      setHasDecreasedToken(true);
      setCaught(true);
      playSound('zap', 0.5);
      setShowExplosion(true);

      setTimeout(() => {
        onCatch(sprite.id);
      }, 1000);
    }
  }, [caught, hasDecreasedToken, position, characterPosition, addScore, decreaseToken, onCatch, sprite.id]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        width: '40px',
        height: '40px',
      }}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {showExplosion ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1.2, 1.5, 1.2],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: 2,
            ease: "easeOut"
          }}
          className="relative w-12 h-12"
        >
          <motion.div
            className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full"
            style={{
              width: '48px',
              height: '48px',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 0.3,
              repeat: 2,
              ease: "easeOut"
            }}
          />
          <img
            src="/sprites/zap.png"
            alt="Caught"
            width={48}
            height={48}
            className="w-12 h-12 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          />
        </motion.div>
      ) : (
        <motion.div className="relative w-10 h-10">
          <motion.div
            className="absolute inset-0 rounded-full blur-md"
            style={{ 
              backgroundColor: selectedIcon.color,
              opacity: 0.4,
              width: '40px',
              height: '40px',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <img
            src={selectedIcon.icon}
            alt={selectedIcon.name}
            width={40}
            height={40}
            className="w-10 h-10 relative z-10"
            style={{
              filter: `drop-shadow(0 0 8px ${selectedIcon.color})`
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}