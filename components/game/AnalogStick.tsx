import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Position } from '@/lib/game/types';

interface AnalogStickProps {
  onMove: (position: Position) => void;
}

export function AnalogStick({ onMove }: AnalogStickProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const baseSize = 120;
  const stickSize = 50;
  const maxDistance = baseSize / 2 - stickSize / 2;

  const handleDrag = useCallback((event: any, info: { offset: Position }) => {
    const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    const angle = Math.atan2(info.offset.y, info.offset.x);

    const clampedDistance = Math.min(distance, maxDistance);
    const newX = clampedDistance * Math.cos(angle);
    const newY = clampedDistance * Math.sin(angle);

    setPosition({ x: newX, y: newY });

    const speed = 15;
    const normalizedX = (newX / maxDistance) * speed;
    const normalizedY = (newY / maxDistance) * speed;
    
    onMove({ 
      x: normalizedX,
      y: normalizedY
    });
  }, [maxDistance, onMove]);

  return (
    <motion.div
      className="fixed bottom-16 left-8 touch-none z-50"
      style={{
        width: baseSize,
        height: baseSize,
      }}
    >
      {/* Base */}
      <div
        className="absolute rounded-full bg-black/40 border-2 border-white/30"
        style={{
          width: baseSize,
          height: baseSize,
        }}
      />
      
      {/* Stick */}
      <motion.div
        className="absolute bg-white/60 rounded-full touch-none"
        style={{
          width: stickSize,
          height: stickSize,
          left: baseSize / 2 - stickSize / 2,
          top: baseSize / 2 - stickSize / 2,
        }}
        drag
        dragConstraints={{
          left: -maxDistance,
          right: maxDistance,
          top: -maxDistance,
          bottom: maxDistance,
        }}
        dragElastic={0.1}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          setPosition({ x: 0, y: 0 });
          onMove({ x: 0, y: 0 });
        }}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 50
        }}
      />
    </motion.div>
  );
} 