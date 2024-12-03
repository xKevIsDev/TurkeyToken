import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Position } from '@/lib/game/types';

interface AnalogStickProps {
  onMove: (position: Position) => void;
  className?: string;
}

export function AnalogStick({ onMove, className = '' }: AnalogStickProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const baseSize = 140;
  const stickSize = 60;
  const maxDistance = baseSize / 2 - stickSize / 2;

  const handleDrag = useCallback((event: any, info: { offset: Position }) => {
    const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    const angle = Math.atan2(info.offset.y, info.offset.x);

    const clampedDistance = Math.min(distance, maxDistance);
    const newX = clampedDistance * Math.cos(angle);
    const newY = clampedDistance * Math.sin(angle);

    setPosition({ x: newX, y: newY });

    const normalizeWithThreshold = (value: number) => {
      const normalized = value / maxDistance;
      const threshold = 0.3;
      if (Math.abs(normalized) < threshold) {
        return normalized * (1/threshold) * 0.5;
      }
      return Math.sign(normalized) * 0.5;
    };

    const normalizedX = normalizeWithThreshold(newX);
    const normalizedY = normalizeWithThreshold(newY);
    
    const curve = (x: number) => Math.sign(x) * Math.pow(Math.abs(x), 1.1);
    
    onMove({ 
      x: curve(normalizedX),
      y: curve(normalizedY)
    });
  }, [maxDistance, onMove]);

  return (
    <motion.div
      className={`touch-none ${className}`}
      style={{
        width: baseSize,
        height: baseSize,
      }}
    >
      {/* Base */}
      <div
        className="absolute rounded-full bg-black/60 border-2 border-blue-500/50 backdrop-blur-md"
        style={{
          width: baseSize,
          height: baseSize,
        }}
      />
      
      {/* Direction indicators */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1/2 bg-blue-500/20 rounded-full transform -translate-y-2" />
        <div className="h-1 w-1/2 bg-blue-500/20 rounded-full transform -translate-x-2" />
      </div>
      
      {/* Stick */}
      <motion.div
        className="absolute bg-blue-400/80 rounded-full touch-none shadow-lg"
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
        dragElastic={0}
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
          scale: isDragging ? 1.2 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0.1,
          ease: "linear"
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/30 blur-md"
          animate={{
            scale: isDragging ? [1, 1.2, 1] : 1,
            opacity: isDragging ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
} 