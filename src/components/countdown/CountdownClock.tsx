'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatedDigit } from './AnimatedDigit';
import { padDigits, calculateTimeRemaining } from '@/lib/time-calculations';
import { useMeasure } from '@/hooks/useMeasure';
import { useIsMobile } from '@/hooks/useIsMobile';
import { TimeBreakdown } from '@/types';
import { useTeam } from '@/contexts/TeamContext';
import { Infinity as InfinityIcon } from 'lucide-react';
import { CountdownAd } from './CountdownAd';

export function CountdownClock() {
  const { runway, annualBurn, startingCapital } = useTeam();
  const [isStuck, setIsStuck] = useState(false);
  const [time, setTime] = useState<TimeBreakdown | null>(null);

  const displayTime = time ?? {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  };

  const isMobile = useIsMobile();

  const getVisibleUnits = () => {
    if (!isMobile) {
      return { years: true, months: true, days: true, hours: true, minutes: true, seconds: true };
    }

    if (displayTime.years > 0) {
      return { years: true, months: true, days: true, hours: false, minutes: false, seconds: false };
    }
    if (displayTime.months > 0) {
      return { years: false, months: true, days: true, hours: true, minutes: false, seconds: false };
    }
    if (displayTime.days > 0) {
      return { years: false, months: false, days: true, hours: true, minutes: true, seconds: false };
    }
    return { years: false, months: false, days: false, hours: true, minutes: true, seconds: true };
  };

  const visible = getVisibleUnits();

  const stickyRef = useRef<HTMLDivElement>(null);
  const isStuckRef = useRef(false);

  useEffect(() => {
    const stickyEl = stickyRef.current;
    if (!stickyEl) return;

    let scrollContainer: HTMLElement | null = stickyEl.parentElement;
    while (scrollContainer) {
      const style = getComputedStyle(scrollContainer);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        break;
      }
      scrollContainer = scrollContainer.parentElement;
    }

    if (!scrollContainer) return;

    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        // Hysteresis to prevent jitter: different thresholds for sticking vs unsticking
        if (!isStuckRef.current && rect.top <= 16) {
          isStuckRef.current = true;
          setIsStuck(true);
        } else if (isStuckRef.current && rect.top > 50) {
          isStuckRef.current = false;
          setIsStuck(false);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTime(null);
    }, 0);

    if (runway === Infinity || annualBurn === 0) {
      return;
    }

    const secondsPerYear = 365.25 * 24 * 60 * 60;
    const runwayInSeconds = (startingCapital / annualBurn) * secondsPerYear;
    const targetDate = new Date(Date.now() + runwayInSeconds * 1000);

    const timeout = setTimeout(() => {
      setTime(calculateTimeRemaining(targetDate));
    }, 100);

    const interval = setInterval(() => {
      setTime(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [runway, annualBurn, startingCapital]);

  const getWarningClass = () => {
    if (runway < 3) return 'clock-critical';
    if (runway < 6) return 'clock-warning';
    return '';
  };

  return (
    <>
      <h1 className={`text-4xl md:text-6xl font-serif text-center pt-8 pb-4 ${runway < 6 ? 'text-highlight-yellow' : 'text-highlight-yellow'}`}>
        Runway Remaining
      </h1>

      <div className="min-h-36 md:min-h-44 sticky top-0 z-40 pt-4">
        <div className="flex flex-col items-center">
          <div
            ref={stickyRef}
            className={`
              py-4 flex items-center justify-center w-fit justify-self-center
              ${isStuck ? 'bg-royal-blue/60 backdrop-blur-md border-2 border-royal-blue px-4 py-2 rounded-full' : 'border-2 border-transparent'}
              ${getWarningClass()}
            `}
          >
            {runway === Infinity ? (
              <div className="flex items-center justify-center">
                <InfinityIcon
                  className={`
                    text-highlight-yellow transition-all duration-300
                    ${isStuck ? 'w-12 h-12 md:w-16 md:h-16' : 'w-20 h-20 md:w-24 md:h-24'}
                  `}
                  strokeWidth={1.5}
                />
              </div>
            ) : (
              <div className="flex items-baseline justify-center">
                {visible.years && displayTime.years > 0 && (
                  <TimeBlock value={displayTime.years} label={displayTime.years === 1 ? 'year' : 'years'} isStuck={isStuck} showSeparator={visible.months} />
                )}
                {visible.months && displayTime.months > 0 && (
                  <TimeBlock value={displayTime.months} label={displayTime.months === 1 ? 'month' : 'months'} isStuck={isStuck} showSeparator={visible.days} />
                )}
                {visible.days && displayTime.days > 0 && (
                  <TimeBlock value={displayTime.days} label={displayTime.days === 1 ? 'day' : 'days'} isStuck={isStuck} showSeparator={visible.hours} />
                )}
                {visible.hours && (
                  <TimeBlock value={displayTime.hours} label={displayTime.hours === 1 ? 'hour' : 'hours'} isStuck={isStuck} showSeparator={visible.minutes} />
                )}
                {visible.minutes && (
                  <TimeBlock value={displayTime.minutes} label={displayTime.minutes === 1 ? 'minute' : 'minutes'} isStuck={isStuck} showSeparator={visible.seconds} />
                )}
                {visible.seconds && (
                  <TimeBlock value={displayTime.seconds} label={displayTime.seconds === 1 ? 'second' : 'seconds'} isStuck={isStuck} showSeparator={false} />
                )}
              </div>
            )}
          </div>

          {time !== null && time.hours === 0 && time.minutes === 0 && time.seconds === 0 && runway !== Infinity && (
            <CountdownAd runway={runway} isStuck={isStuck} />
          )}
        </div>
      </div>
    </>
  );
}

function TimeBlock({
  value,
  label,
  isStuck,
  showSeparator = false
}: {
  value: number;
  label: string;
  isStuck: boolean;
  showSeparator?: boolean;
}) {
  const digits = padDigits(value, 2);
  const [labelRef, labelSize] = useMeasure<HTMLSpanElement>();
  const colonWidth = 12;

  const targetWidth = isStuck
    ? (showSeparator ? colonWidth : 0)
    : labelSize.width;

  return (
    <span className="inline-flex items-end">
      <span
        className={`
          inline-flex leading-none font-serif text-highlight-yellow
          transition-all duration-300
          ${isStuck ? 'text-4xl md:text-5xl' : 'text-6xl md:text-8xl'}
        `}
      >
        {digits.map((digit, index) => (
          <AnimatedDigit key={`${label}-${index}`} value={digit} digitIndex={index} />
        ))}
      </span>

      <span
        className="relative inline-block overflow-hidden transition-all duration-300 align-baseline"
        style={{ width: targetWidth }}
      >
        {/* Hidden measurement span */}
        <span
          ref={labelRef}
          className="absolute invisible whitespace-nowrap text-base md:text-lg pr-4"
          aria-hidden="true"
        >
          {label}
        </span>

        <span
          className={`
            inline-block whitespace-nowrap text-base md:text-lg text-white/60 pr-4
            transition-opacity duration-300 pb-1
            ${isStuck ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {label}
        </span>

        {showSeparator && (
          <span
            className={`
              absolute left-0 top-0 text-highlight-yellow text-base md:text-lg
              transition-opacity duration-300 px-1 flex items-center justify-center
              ${isStuck ? 'opacity-100' : 'opacity-0'}
            `}
          >
            :
          </span>
        )}
      </span>
    </span>
  );
}
