import { TeamMember, RoleCategory, DREAM_TEAM_OPTIONS } from './roster';

export function groupByRole(): Record<RoleCategory, TeamMember[]> {
  return DREAM_TEAM_OPTIONS.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<RoleCategory, TeamMember[]>);
}

export const ROLE_LABELS: Record<RoleCategory, string> = {
  CEO: "Chief Executive Officer",
  Engineering: "Engineering",
  Sales: "Sales & Marketing",
  Design: "Design",
  Legal: "Legal",
  COO: "Operations",
  Dog: "Office Dogs",
  Vibe: "Vibe Managers",
};
