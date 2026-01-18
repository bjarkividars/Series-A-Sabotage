'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimationDirection } from '@/types';

interface AnimatedDigitProps {
  value: number; 
  digitIndex?: number;
  className?: string;
}

export function AnimatedDigit({ value, digitIndex = 0, className = '' }: AnimatedDigitProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<AnimationDirection>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      const newDirection = getDirection(value, prevValueRef.current);
      setDirection(newDirection);

      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 200);

      const clearTimer = setTimeout(() => {
        setDirection(null);
        prevValueRef.current = value;
      }, 400);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [value]);

  return (
    <div
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        width: '1ch',
        height: '1em',
      }}
    >
      <span
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-400 ease-smooth
          ${direction === 'up' ? 'animate-digit-slide-up' : ''}
          ${direction === 'down' ? 'animate-digit-slide-down' : ''}
        `}
        style={{
          animationDelay: `${digitIndex * 50}ms`,
        }}
      >
        {displayValue}
      </span>
    </div>
  );
}

function getDirection(current: number, previous: number): AnimationDirection {
  if (previous === 9 && current === 0) return 'up';
  if (previous === 0 && current === 9) return 'down';

  return current > previous ? 'up' : 'down';
}
