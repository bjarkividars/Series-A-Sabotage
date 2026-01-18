'use client';

import { useLocalStorage } from './useLocalStorage';

interface OnboardingData {
  startupName: string;
  startingCapital: number;
  hasCompletedOnboarding: boolean;
}

const ONBOARDING_STORAGE_KEY = 'dream-team-onboarding';
const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  startupName: '',
  startingCapital: 0,
  hasCompletedOnboarding: false,
};

export function useOnboardingState() {
  const [data, setData, isClient] = useLocalStorage<OnboardingData>(
    ONBOARDING_STORAGE_KEY,
    DEFAULT_ONBOARDING_DATA
  );

  const saveOnboarding = (startupName: string, startingCapital: number) => {
    setData({
      startupName,
      startingCapital,
      hasCompletedOnboarding: true,
    });
  };

  const updateOnboarding = (startupName: string, startingCapital: number) => {
    setData(prev => ({
      ...prev,
      startupName,
      startingCapital,
    }));
  };

  const resetOnboarding = () => {
    setData(DEFAULT_ONBOARDING_DATA);
  };

  return {
    startupName: data.startupName,
    startingCapital: data.startingCapital,
    hasCompletedOnboarding: data.hasCompletedOnboarding,
    isClient,
    saveOnboarding,
    updateOnboarding,
    resetOnboarding,
  };
}
