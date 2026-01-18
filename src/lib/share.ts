import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { DREAM_TEAM_OPTIONS, TeamMember } from './roster';

export interface ShareData {
  t: number[];      // team indices (into DREAM_TEAM_OPTIONS)
  n: string;        // startupName
  s: string;        // oneLineSummary
  m: 'r' | 'p';     // mode (roast/praise)
  r: number;        // runway (months)
}

const idToIndex = new Map(DREAM_TEAM_OPTIONS.map((m, i) => [m.id, i]));

export function encodeShareData(teamIds: string[], startupName: string, oneLineSummary: string, mode: 'roast' | 'praise', runway: number): string {
  const data: ShareData = {
    t: teamIds.map(id => idToIndex.get(id) ?? -1).filter(i => i >= 0),
    n: startupName,
    s: oneLineSummary,
    m: mode === 'roast' ? 'r' : 'p',
    r: Math.round(runway * 100) / 100,
  };
  return compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodeShareData(encoded: string): ShareData | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as ShareData;
  } catch {
    return null;
  }
}

export function getTeamMembersFromIndices(indices: number[]): TeamMember[] {
  return indices
    .map(i => DREAM_TEAM_OPTIONS[i])
    .filter((m): m is TeamMember => m !== undefined);
}


export function formatRunwayForShare(runway: number): string {
  if (runway === Infinity) return 'forever';

  const years = Math.floor(runway / 12);
  const months = Math.floor(runway % 12);
  const days = Math.floor((runway % 1) * 30);

  if (years > 0) {
    return months > 0 ? `${years}y ${months}mo` : `${years} years`;
  }
  if (months >= 1) {
    return `${months} months`;
  }
  if (days > 0) {
    return `${days} days`;
  }
  const hours = Math.floor((runway * 30 * 24) % 24);
  if (hours > 0) {
    return `${hours} hours`;
  }
  const minutes = Math.floor((runway * 30 * 24 * 60) % 60);
  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  const seconds = Math.floor((runway * 30 * 24 * 60 * 60) % 60);
  if (seconds > 0) {
    return `${seconds} seconds`;
  }
  return 'moments';
}
