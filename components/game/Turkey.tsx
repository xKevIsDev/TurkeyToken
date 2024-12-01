"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "./GameContext";
import { TurkeySprite, Position } from "@/lib/game/types";
import { playSound } from "@/lib/game/sounds";

interface TurkeyProps {
  sprite: TurkeySprite;
  onCatch: (id: string) => void;
  onEscape: (id: string) => void;
  characterPosition: Position;
}

export function Turkey({ sprite, onCatch, onEscape, characterPosition }: TurkeyProps) {
  const { addScore, decreaseToken, gameState } = useGame();
  const [position, setPosition] = useState(sprite.position);
  const [speed, setSpeed] = useState(sprite.speed);
  const [caught, setCaught] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [hasDecreasedToken, setHasDecreasedToken] = useState(false);
  const [hasEscaped, setHasEscaped] = useState(false);

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
      playSound('catch', 0.5);

      setTimeout(() => {
        setShowExplosion(true);
      }, 100);

      onCatch(sprite.id);
    }
  }, [caught, hasDecreasedToken, position, characterPosition, addScore, decreaseToken, onCatch, sprite.id]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
      }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    >
      {showExplosion ? (
        <img
          src="/sprites/explode.png"
          alt="Explosion"
          className="w-12 h-12 drop-shadow-lg"
        />
      ) : (
        <img
          src="/sprites/turkey.png"
          alt="Turkey"
          className="w-12 h-12 drop-shadow-lg"
          style={{
            transform: speed.x > 0 ? "scaleX(-1)" : "scaleX(1)",
          }}
        />
      )}
    </motion.div>
  );
}