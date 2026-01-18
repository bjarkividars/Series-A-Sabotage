'use client';

import { Header } from '@/components/layout/Header';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { CountdownClock } from '@/components/countdown/CountdownClock';
import { RosterGrid } from '@/components/roster/RosterGrid';
import { FloatingTeamButton } from '@/components/team/FloatingTeamButton';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { useOnboardingState } from '@/hooks/useOnboardingState';

export default function Home() {
  const { hasCompletedOnboarding, saveOnboarding, isClient } = useOnboardingState();

  const showOnboarding = isClient && !hasCompletedOnboarding;

  return (
    <div className="relative h-screen overflow-y-auto">
      <AmbientBackground />

      <header className="border-b border-white/10">
        <Header />
      </header>

      <div className="container-dtr z-10">
        <CountdownClock />
        <div className="py-8">
          <RosterGrid />
        </div>
      </div>
      <FloatingTeamButton />
      <OnboardingModal
        open={showOnboarding}
        onComplete={saveOnboarding}
      />
    </div>
  );
}
