'use client';

import { RoleCategory } from '@/types';
import { RoleSection } from './RoleSection';
import { groupByRole } from '@/lib/roster-utils';

export function RosterGrid() {
  const groupedMembers = groupByRole();
  const roleOrder: RoleCategory[] = ['CEO', 'Engineering', 'Design', 'Legal', 'Sales', 'COO', 'Dog', 'Vibe'];

  return (
    <div className="space-y-12">
      {roleOrder.map((role) => (
        <RoleSection
          key={role}
          role={role}
          members={groupedMembers[role] || []}
        />
      ))}
    </div>
  );
}
