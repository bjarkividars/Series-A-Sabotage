'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useTeam } from '@/contexts/TeamContext';
import { getWarpUrl } from '@/lib/warp-url';

interface CountdownAdProps {
  runway: number;
  isStuck: boolean;
}

function formatRunway(runway: number): string {
  if (runway === Infinity) return 'infinite runway';

  const totalMonths = runway;
  const years = Math.floor(totalMonths / 12);
  const months = Math.floor(totalMonths % 12);
  const days = Math.floor((totalMonths % 1) * 30);
  const hours = Math.floor(((totalMonths % 1) * 30 % 1) * 24);
  const minutes = Math.floor((((totalMonths % 1) * 30 % 1) * 24 % 1) * 60);
  const seconds = Math.floor(((((totalMonths % 1) * 30 % 1) * 24 % 1) * 60 % 1) * 60);

  if (years > 0) {
    return months > 0 ? `${years} years, ${months} months` : `${years} years`;
  }
  if (months > 0) {
    return days > 0 ? `${months} months, ${days} days` : `${months} months`;
  }
  if (days > 0) {
    return hours > 0 ? `${days} days, ${hours} hours` : `${days} days`;
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours} hours, ${minutes} minutes` : `${hours} hours`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes} minutes, ${seconds} seconds` : `${minutes} minutes`;
  }
  return `${seconds} seconds`;
}

export function CountdownAd({ runway, isStuck }: CountdownAdProps) {
  const [dismissed, setDismissed] = useState(false);
  const { startingCapital } = useTeam();
  const formattedRunway = formatRunway(runway);

  if (dismissed) return null;

  return (
    <div className="relative mt-2">
      {/* Dismiss button - positioned outside the box */}
      <button
        onClick={() => setDismissed(true)}
        className="
          absolute -top-2 -right-2 z-10
          w-7 h-7 rounded-full
          bg-royal-blue border-2 border-highlight-yellow
          flex items-center justify-center
          hover:bg-royal-blue/80
          transition-colors
        "
        aria-label="Dismiss"
      >
        <svg className="w-3 h-3 text-highlight-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className={`
          text-center max-w-lg px-6 py-4 rounded-2xl
          ${isStuck ? 'bg-royal-blue/60 backdrop-blur-md border-2 border-royal-blue' : ''}
        `}
      >
        <p className="font-semibold text-base mb-2 text-highlight-yellow">
          Oops! You only had {formattedRunway} to build the startup of your dreams.
        </p>
        <p className="text-sm text-white/70 mb-3">
          Warp&apos;s headcount planner lets you model realistic hiring scenarios,
          understand burn, and see how every hire affects your runway—before it&apos;s too late.
        </p>
        <a
          href={getWarpUrl(startingCapital)}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2
            bg-highlight-yellow text-royal-blue
            font-semibold text-sm
            py-2 px-4 rounded-full
            hover:bg-highlight-yellow/90
            transition-colors
          "
        >
          Model a real team with Warp <ExternalLink className="w-4 h-4" />
        </a>
        <div className="mt-3">
          <Image
            className="invert opacity-50 mx-auto"
            src="/logos/warp-logo-full.svg"
            alt="Warp"
            width={50}
            height={16}
          />
        </div>
      </div>
    </div>
  );
}
