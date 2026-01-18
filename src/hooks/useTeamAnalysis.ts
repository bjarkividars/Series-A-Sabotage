'use client';

import { useState, useCallback } from 'react';
import { TeamMember } from '@/types';

type AnalysisMode = 'roast' | 'praise';

interface UseTeamAnalysisReturn {
  analysis: string;
  isLoading: boolean;
  mode: AnalysisMode | null;
  generateAnalysis: (
    team: TeamMember[],
    mode: AnalysisMode,
    startupName: string,
    runway: number
  ) => Promise<void>;
  resetAnalysis: () => void;
}

export function useTeamAnalysis(): UseTeamAnalysisReturn {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AnalysisMode | null>(null);

  const generateAnalysis = useCallback(
    async (
      team: TeamMember[],
      analysisMode: AnalysisMode,
      startupName: string,
      runway: number
    ) => {
      setIsLoading(true);
      setAnalysis('');
      setMode(analysisMode);

      try {
        const response = await fetch('/api/team-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            team,
            mode: analysisMode,
            startupName,
            runway,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate analysis');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader available');
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          setAnalysis((prev) => prev + text);
        }
      } catch (error) {
        console.error('Error generating analysis:', error);
        setAnalysis('Failed to generate analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetAnalysis = useCallback(() => {
    setAnalysis('');
    setMode(null);
    setIsLoading(false);
  }, []);

  return { analysis, isLoading, mode, generateAnalysis, resetAnalysis };
}
