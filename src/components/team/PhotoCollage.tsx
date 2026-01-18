'use client';

import { useMemo } from 'react';
import { TeamMember } from '@/lib/roster';
import { CollagePhoto } from './CollagePhoto';
import { generatePositions, getCollageHeight } from '@/lib/collage-layout';

interface PhotoCollageProps {
  members: TeamMember[];
  onRemoveMember: (id: string) => void;
}

export function PhotoCollage({ members, onRemoveMember }: PhotoCollageProps) {
  const positions = useMemo(() => {
    return generatePositions(members.length);
  }, [members.length]);

  const height = useMemo(() => {
    return getCollageHeight(members.length);
  }, [members.length]);

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-royal-blue/60 text-lg text-center px-4">
          No team members yet. Add some from the roster!
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-visible"
      style={{ height: `${height}px` }}
    >
      {members.map((member, index) => (
        <CollagePhoto
          key={member.id}
          member={member}
          position={positions[index] || positions[0]}
          onRemove={onRemoveMember}
        />
      ))}
    </div>
  );
}
