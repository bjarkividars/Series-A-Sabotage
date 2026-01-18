'use client';

import { TimeUnit } from './TimeUnit';
import { TimeBreakdown } from '@/types';

interface ExpandedClockProps {
  time: TimeBreakdown;
}

export function ExpandedClock({ time }: ExpandedClockProps) {
  return (
    <div className="flex flex-col items-center space-y-8 py-12">
      <h1 className="clock text-6xl md:text-8xl font-serif text-highlight-yellow">
        Runway Remaining
      </h1>

      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {time.years > 0 && <TimeUnit value={time.years} unit="year" />}
        {time.months > 0 && <TimeUnit value={time.months} unit="month" />}
        {time.days > 0 && <TimeUnit value={time.days} unit="day" />}
        <TimeUnit value={time.hours} unit="hour" />
        <TimeUnit value={time.minutes} unit="minute" />
      </div>
    </div>
  );
}
