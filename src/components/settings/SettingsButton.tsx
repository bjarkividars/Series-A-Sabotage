'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { useTeam } from '@/contexts/TeamContext';

export function SettingsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { startupName, startingCapital, updateOnboarding } = useTeam();

  const handleSave = (name: string, capital: number) => {
    updateOnboarding(name, capital);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed bottom-8 left-8
          bg-white/10 text-white
          backdrop-blur-md
          rounded-full
          w-14 h-14
          flex items-center justify-center
          hover:bg-white/20
          transition-all duration-300
          hover:scale-110
          z-50
          border border-white/20
        "
        aria-label="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      <OnboardingModal
        open={isModalOpen}
        onComplete={handleSave}
        initialName={startupName}
        initialAmount={startingCapital}
        isEditing={true}
      />
    </>
  );
}
