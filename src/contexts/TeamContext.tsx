'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { TeamMember } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface OnboardingData {
  startupName: string;
  startingCapital: number;
  hasCompletedOnboarding: boolean;
}

interface TeamContextValue {
  selectedTeam: TeamMember[];
  startupName: string;
  startingCapital: number;
  hasCompletedOnboarding: boolean;
  isClient: boolean;
  monthlyBurn: number;
  annualBurn: number;
  runway: number;
  selectedIds: Set<string>;
  addMember: (member: TeamMember) => void;
  removeMember: (memberId: string) => void;
  resetTeam: () => void;
  saveOnboarding: (startupName: string, startingCapital: number) => void;
  updateOnboarding: (startupName: string, startingCapital: number) => void;
  resetOnboarding: () => void;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

const TEAM_STORAGE_KEY = 'dream-team-selected';
const ONBOARDING_STORAGE_KEY = 'dream-team-onboarding';
const DEFAULT_ONBOARDING: OnboardingData = {
  startupName: '',
  startingCapital: 0,
  hasCompletedOnboarding: false,
};

export function TeamProvider({ children }: TeamProviderProps) {
  const [onboarding, setOnboarding, isClient] = useLocalStorage<OnboardingData>(
    ONBOARDING_STORAGE_KEY,
    DEFAULT_ONBOARDING
  );
  const [selectedTeam, setSelectedTeam] = useLocalStorage<TeamMember[]>(TEAM_STORAGE_KEY, []);

  const startupName = onboarding.startupName;
  const savedCapital = onboarding.startingCapital;
  const hasCompletedOnboarding = onboarding.hasCompletedOnboarding;
  const startingCapital = savedCapital > 0 ? savedCapital : 10_000_000;

  const { monthlyBurn, annualBurn, runway, selectedIds } = useMemo(() => {
    const annualBurn = selectedTeam.reduce(
      (sum, member) => sum + member.annualSalary,
      0
    );
    const monthlyBurn = annualBurn / 12;
    const runway = monthlyBurn > 0 ? startingCapital / monthlyBurn : Infinity;
    const selectedIds = new Set(selectedTeam.map((member) => member.id));

    return { monthlyBurn, annualBurn, runway, selectedIds };
  }, [selectedTeam, startingCapital]);

  const addMember = (member: TeamMember) => {
    setSelectedTeam((prev) => {
      if (prev.some((m) => m.id === member.id)) {
        return prev;
      }
      return [...prev, member];
    });
  };

  const removeMember = (memberId: string) => {
    setSelectedTeam((prev) => prev.filter((member) => member.id !== memberId));
  };

  const resetTeam = () => {
    setSelectedTeam([]);
  };

  const saveOnboarding = (name: string, capital: number) => {
    setOnboarding({
      startupName: name,
      startingCapital: capital,
      hasCompletedOnboarding: true,
    });
  };

  const updateOnboarding = (name: string, capital: number) => {
    setOnboarding((prev) => ({
      ...prev,
      startupName: name,
      startingCapital: capital,
    }));
  };

  const resetOnboarding = () => {
    setOnboarding(DEFAULT_ONBOARDING);
  };

  const value: TeamContextValue = {
    selectedTeam,
    startupName,
    startingCapital,
    hasCompletedOnboarding,
    isClient,
    monthlyBurn,
    annualBurn,
    runway,
    selectedIds,
    addMember,
    removeMember,
    resetTeam,
    saveOnboarding,
    updateOnboarding,
    resetOnboarding,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
