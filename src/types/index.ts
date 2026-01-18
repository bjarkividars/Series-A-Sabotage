export interface TimeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export type { TeamMember, RoleCategory } from '@/lib/roster';

export type AnimationDirection = 'up' | 'down' | null;
