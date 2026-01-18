'use client';

import { useState, useCallback } from 'react';
import { TeamMember } from '@/types';

type AnalysisMode = 'roast' | 'praise';

interface UseTeamAnalysisReturn {
  analysis: string;
  oneLineSummary: string | null;
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

const METADATA_DELIMITER = '\n---\n';

export function useTeamAnalysis(): UseTeamAnalysisReturn {
  const [analysis, setAnalysis] = useState('');
  const [oneLineSummary, setOneLineSummary] = useState<string | null>(null);
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
      setOneLineSummary(null);
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
        let buffer = '';
        let metadataParsed = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          buffer += text;

          if (!metadataParsed) {
            const delimiterIndex = buffer.indexOf(METADATA_DELIMITER);
            if (delimiterIndex !== -1) {
              const metadataStr = buffer.slice(0, delimiterIndex);
              try {
                const metadata = JSON.parse(metadataStr);
                setOneLineSummary(metadata.oneLineSummary || null);
              } catch {
                console.error('Failed to parse metadata');
              }
              metadataParsed = true;
              const remaining = buffer.slice(delimiterIndex + METADATA_DELIMITER.length);
              if (remaining) {
                setAnalysis(remaining);
              }
              buffer = '';
            }
          } else {
            setAnalysis((prev) => prev + text);
            buffer = '';
          }
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
    setOneLineSummary(null);
    setMode(null);
    setIsLoading(false);
  }, []);

  return { analysis, oneLineSummary, isLoading, mode, generateAnalysis, resetAnalysis };
}
