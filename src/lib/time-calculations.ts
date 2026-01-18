import { TimeBreakdown } from '@/types';

export function calculateTimeRemaining(targetDate: Date): TimeBreakdown {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
    };
  }

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const totalDays = Math.floor(hours / 24);

  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  return {
    years,
    months,
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    totalDays,
  };
}

export function padDigits(num: number, length: number): number[] {
  return num.toString().padStart(length, '0').split('').map(Number);
}

export function breakdownNumberToDigits(num: number): number[] {
  return num.toString().split('').map(Number);
}
