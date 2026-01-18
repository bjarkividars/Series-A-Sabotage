'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { TeamMember } from '@/types';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TeamContextValue {
  selectedTeam: TeamMember[];
  startupName: string;
  startingCapital: number;
  monthlyBurn: number;
  annualBurn: number;
  runway: number;
  selectedIds: Set<string>;
  addMember: (member: TeamMember) => void;
  removeMember: (memberId: string) => void;
  resetTeam: () => void;
}

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

interface TeamProviderProps {
  children: ReactNode;
}

const TEAM_STORAGE_KEY = 'dream-team-selected';

export function TeamProvider({ children }: TeamProviderProps) {
  const { startupName, startingCapital: savedCapital } = useOnboardingState();
  const [selectedTeam, setSelectedTeam] = useLocalStorage<TeamMember[]>(TEAM_STORAGE_KEY, []);

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

  const value: TeamContextValue = {
    selectedTeam,
    startupName,
    startingCapital,
    monthlyBurn,
    annualBurn,
    runway,
    selectedIds,
    addMember,
    removeMember,
    resetTeam,
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
