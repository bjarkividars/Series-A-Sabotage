'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface WarpAdProps {
  mode: 'roast' | 'praise';
  visible: boolean;
  onDismiss: () => void;
}

export function WarpAd({ mode, visible, onDismiss }: WarpAdProps) {
  const headline =
    mode === 'praise'
      ? 'Build a team that actually works this well'
      : "Make sure you don't end up like this team";

  const cta =
    mode === 'praise'
      ? 'Plan your dream team with Warp'
      : 'Try it out';

  return (
    <div className={`bg-white absolute left-0 right-0 bottom-full mb-2 rounded-xl overflow-hidden z-10 transition-all duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
      <div
        className={`
          p-4 
          bg-linear-to-r from-royal-blue to-royal-blue/80
          text-white
          flex flex-col items-center md:items-start

          }
        `}
      >
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="
            absolute top-2 right-2
            w-6 h-6 rounded-full
            bg-white/20 hover:bg-white/30
            flex items-center justify-center
            transition-colors
          "
          aria-label="Dismiss"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="font-semibold text-base mb-2 pr-8 text-center md:text-left">{headline}</p>
        <p className="text-sm text-white/80 mb-3 text-center md:text-left">
          Warp&apos;s headcount planner helps you model hiring scenarios, track
          burn, and extend your runway.
        </p>
        <a
          href="https://www.joinwarp.com"
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
          {cta} <ExternalLink className="w-4 h-4" />
        </a>
        <div className='md:hidden mt-4'>
          <Image className="invert" src="/logos/warp-logo-full.svg" alt="Warp" width={60} height={20} />
        </div>
        <div className="hidden md:block absolute bottom-4 right-4">
          <Image className="invert" src="/logos/warp-logo-full.svg" alt="Warp" width={100} height={100} />
        </div>
      </div>
    </div>
  );
}
