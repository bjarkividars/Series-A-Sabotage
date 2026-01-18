'use client';

import { useTeam } from '@/contexts/TeamContext';

export function Header() {
  const { startupName } = useTeam();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <h1 className="text-2xl font-serif text-highlight-yellow">
        Series A Sabotage: {startupName || 'Your Startup'}
      </h1>
      <p className="text-sm font-serif italic text-white/60 hidden md:block">
        Every hire is a decision. Every decision is a mistake.
      </p>
    </header>
  );
}
