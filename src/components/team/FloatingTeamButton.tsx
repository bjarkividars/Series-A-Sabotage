'use client';

import { useState } from 'react';
import { useTeam } from '@/contexts/TeamContext';
import { TeamOverviewModal } from './TeamOverviewModal';

export function FloatingTeamButton() {
  const { selectedTeam } = useTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedTeam.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed bottom-6 right-6 md:bottom-8 md:right-8
          bg-highlight-yellow text-royal-blue
          rounded-full
          px-5 py-3
          flex items-center justify-center gap-2
          font-bold text-base
          shadow-lg hover:shadow-xl
          transition-all duration-300
          hover:scale-105
          z-50
        "
        aria-label={`View team (${selectedTeam.length} members)`}
      >
        <span>Team</span>
        <span className="bg-royal-blue text-highlight-yellow rounded-full w-6 h-6 flex items-center justify-center text-sm">
          {selectedTeam.length}
        </span>
      </button>

      <TeamOverviewModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
