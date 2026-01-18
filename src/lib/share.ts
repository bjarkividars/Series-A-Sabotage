import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { DREAM_TEAM_OPTIONS, TeamMember } from './roster';

export interface ShareData {
  t: number[];      // team indices (into DREAM_TEAM_OPTIONS)
  n: string;        // startupName
  s: string;        // oneLineSummary
  m: 'r' | 'p';     // mode (roast/praise)
  r: string;        // runway formatted string
}

const idToIndex = new Map(DREAM_TEAM_OPTIONS.map((m, i) => [m.id, i]));

export function encodeShareData(teamIds: string[], startupName: string, oneLineSummary: string, mode: 'roast' | 'praise', runwayText: string): string {
  const data: ShareData = {
    t: teamIds.map(id => idToIndex.get(id) ?? -1).filter(i => i >= 0),
    n: startupName,
    s: oneLineSummary,
    m: mode === 'roast' ? 'r' : 'p',
    r: runwayText,
  };
  const compressed = compressToEncodedURIComponent(JSON.stringify(data));
  return compressed.replace(/\+/g, '.');
}

export function decodeShareData(encoded: string): ShareData | null {
  try {
    const restored = encoded.replace(/\./g, '+');
    const json = decompressFromEncodedURIComponent(restored);
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
