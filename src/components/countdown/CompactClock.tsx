'use client';

import { TimeUnit } from './TimeUnit';
import { TimeBreakdown } from '@/types';

interface CompactClockProps {
  time: TimeBreakdown;
}

export function CompactClock({ time }: CompactClockProps) {
  return (
    <div className="flex items-center justify-center gap-2 text-2xl md:text-4xl font-serif text-highlight-yellow">
      {time.years > 0 && (
        <>
          <TimeUnit value={time.years} unit="year" compact />
          <span className="opacity-50">:</span>
        </>
      )}
      {time.months > 0 && (
        <>
          <TimeUnit value={time.months} unit="month" compact />
          <span className="opacity-50">:</span>
        </>
      )}
      <TimeUnit value={time.days} unit="day" compact />
      <span className="opacity-50">:</span>
      <TimeUnit value={time.hours} unit="hour" compact />
      <span className="opacity-50">:</span>
      <TimeUnit value={time.minutes} unit="minute" compact />
    </div>
  );
}
