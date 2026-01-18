'use client';

import { AnimatedDigit } from './AnimatedDigit';
import { padDigits } from '@/lib/time-calculations';

interface TimeUnitProps {
  value: number;
  unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

export function TimeUnit({ value, unit, showLabel = true, compact = false, className = '' }: TimeUnitProps) {
  const digits = padDigits(value, 2);
  const label = getLabel(value, unit);

  if (compact) {
    return (
      <div className={`inline-flex items-baseline ${className}`}>
        {digits.map((digit, index) => (
          <AnimatedDigit key={`${unit}-${index}`} value={digit} digitIndex={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-baseline font-serif text-highlight-yellow">
        {digits.map((digit, index) => (
          <AnimatedDigit
            key={`${unit}-${index}`}
            value={digit}
            digitIndex={index}
            className="text-6xl md:text-8xl"
          />
        ))}
      </div>
      {showLabel && (
        <span className="mt-2 text-sm md:text-base text-white/80">
          {label}
        </span>
      )}
    </div>
  );
}

function getLabel(value: number, unit: string): string {
  const labels: Record<string, { singular: string; plural: string }> = {
    year: { singular: 'Year', plural: 'Years' },
    month: { singular: 'Month', plural: 'Months' },
    day: { singular: 'Day', plural: 'Days' },
    hour: { singular: 'Hour', plural: 'Hours' },
    minute: { singular: 'Minute', plural: 'Minutes' },
    second: { singular: 'Second', plural: 'Seconds' },
  };

  const label = labels[unit];
  return value === 1 ? label.singular : label.plural;
}
