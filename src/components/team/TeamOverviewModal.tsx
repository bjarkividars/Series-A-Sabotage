'use client';

import { useState, useEffect } from 'react';
import { useTeam } from '@/contexts/TeamContext';
import { Dialog } from '@/components/ui/Dialog';
import { PhotoCollage } from './PhotoCollage';
import { WarpAd } from './WarpAd';
import { useTeamAnalysis } from '@/hooks/useTeamAnalysis';

interface TeamOverviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamOverviewModal({ open, onOpenChange }: TeamOverviewModalProps) {
  const { selectedTeam, startupName, runway, removeMember, resetTeam } = useTeam();
  const { analysis, isLoading, mode, generateAnalysis, resetAnalysis } = useTeamAnalysis();
  const [showAd, setShowAd] = useState(false);

  const handleRemoveMember = (id: string) => {
    removeMember(id);
    if (selectedTeam.length === 1) {
      onOpenChange(false);
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const getRunwayDisplay = () => {
    if (runway === Infinity) return 'forever';

    const pluralize = (n: number, singular: string) =>
      n === 1 ? `${n} ${singular}` : `${n} ${singular}s`;

    const totalMonths = runway;
    const years = Math.floor(totalMonths / 12);
    const months = Math.floor(totalMonths % 12);
    const days = Math.floor((totalMonths % 1) * 30);
    const hours = Math.floor(((totalMonths % 1) * 30 % 1) * 24);
    const minutes = Math.floor((((totalMonths % 1) * 30 % 1) * 24 % 1) * 60);
    const seconds = Math.floor(((((totalMonths % 1) * 30 % 1) * 24 % 1) * 60 % 1) * 60);

    if (years > 0) {
      return months > 0 ? `${pluralize(years, 'year')}, ${pluralize(months, 'month')}` : pluralize(years, 'year');
    }
    if (months > 0) {
      return days > 0 ? `${pluralize(months, 'month')}, ${pluralize(days, 'day')}` : pluralize(months, 'month');
    }
    if (days > 0) {
      return hours > 0 ? `${pluralize(days, 'day')}, ${pluralize(hours, 'hour')}` : pluralize(days, 'day');
    }
    if (hours > 0) {
      return minutes > 0 ? `${pluralize(hours, 'hour')}, ${pluralize(minutes, 'minute')}` : pluralize(hours, 'hour');
    }
    if (minutes > 0) {
      return seconds > 0 ? `${pluralize(minutes, 'minute')}, ${pluralize(seconds, 'second')}` : pluralize(minutes, 'minute');
    }
    return pluralize(seconds, 'second');
  };

  const getRunwayColorClass = () => {
    if (runway === Infinity) return 'text-green-600';
    if (runway < 3) return 'text-red-600';
    if (runway < 6) return 'text-yellow-600';
    return 'text-royal-blue';
  };

  const handleRoast = () => {
    generateAnalysis(selectedTeam, 'roast', startupName, runway);
  };

  const handlePraise = () => {
    generateAnalysis(selectedTeam, 'praise', startupName, runway);
  };

  const handleStartOver = () => {
    resetTeam();
    resetAnalysis();
    setShowAd(false);
    onOpenChange(false);
  };

  const handleSwitchMode = () => {
    setShowAd(false);
    if (mode === 'roast') {
      handlePraise();
    } else {
      handleRoast();
    }
  };

  const hasStarted = mode !== null;
  const isComplete = !isLoading && analysis.length > 0;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowAd(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        description="View your assembled team"
        className="md:max-w-3xl"
      >
        <div className="text-center mb-4">
          <p className="text-base text-royal-blue/70">
            You can afford this team for
          </p>
          <p
            className={`font-serif text-4xl md:text-5xl font-bold ${getRunwayColorClass()}`}
          >
            {getRunwayDisplay()}
          </p>
        </div>

        <div className="mb-6">
          <PhotoCollage members={selectedTeam} onRemoveMember={handleRemoveMember} />
        </div>

        <div>
          {!hasStarted && selectedTeam.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleRoast}
                className="
                  flex-1 py-3 px-4 rounded-full font-semibold
                  bg-red-100 text-red-700 hover:bg-red-200
                  transition-colors
                "
              >
                Roast My Team
              </button>
              <button
                onClick={handlePraise}
                className="
                  flex-1 py-3 px-4 rounded-full font-semibold
                  bg-green-100 text-green-700 hover:bg-green-200
                  transition-colors
                "
              >
                Praise My Team
              </button>
            </div>
          )}

          {hasStarted && (
            <>
              <div className="relative">
                {isComplete && (
                  <WarpAd
                    mode={mode!}
                    visible={showAd}
                    onDismiss={() => setShowAd(false)}
                  />
                )}

                <div className='relative z-20 bg-highlight-yellow'>
                  <blockquote
                    className="
                      bg-royal-blue/5
                      border-l-4 border-royal-blue
                      rounded-r-lg
                      p-4 md:p-5
                      italic
                      text-royal-blue/80
                    "
                  >
                    <p className="text-base md:text-lg">
                      {analysis ? (
                        <>
                          &ldquo;{analysis}
                          {isLoading && <span className="animate-pulse">|</span>}
                          {!isLoading && <>&rdquo;</>}
                        </>
                      ) : (
                        <span className="animate-pulse">|</span>
                      )}
                    </p>
                  </blockquote>
                </div>
              </div>

              {isComplete && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handleStartOver}
                    className="
                      py-2 px-4 rounded-full font-semibold text-sm
                      bg-royal-blue/10 text-royal-blue hover:bg-royal-blue/20
                      transition-colors
                    "
                  >
                    Start Over
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSwitchMode}
                      className={`
                        py-2 px-4 rounded-full font-semibold text-sm
                        transition-colors
                        ${mode === 'roast'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }
                      `}
                    >
                      {mode === 'roast' ? 'Praise instead' : 'Roast instead'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="
                        py-2 px-4 rounded-full font-semibold text-sm
                        bg-royal-blue text-white hover:bg-royal-blue/90
                        transition-colors
                      "
                    >
                      Share
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
