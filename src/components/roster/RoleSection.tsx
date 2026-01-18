'use client';

import { useRef, useCallback } from 'react';
import { TeamMember, RoleCategory } from '@/types';
import { TeamMemberCard } from './TeamMemberCard';
import { ROLE_LABELS } from '@/lib/roster-utils';
import { useScrollFade } from '@/hooks/useScrollFade';

interface RoleSectionProps {
  role: RoleCategory;
  members: TeamMember[];
}

export function RoleSection({ role, members }: RoleSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { registerCard, getCardStyle } = useScrollFade(scrollRef);

  const cardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    registerCard(index, el);
  }, [registerCard]);

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-serif text-highlight-yellow">
        {ROLE_LABELS[role]}
      </h2>

      <div
        ref={scrollRef}
        className="
          flex gap-4
          overflow-x-auto
          pb-4
          snap-x snap-mandatory
          scrollbar-thin
          w-screen
          -ml-[50vw]
          left-1/2
          relative
          px-[max(clamp(1.25rem,4vw,2.5rem),calc((100vw-87.5rem)/2+clamp(1.25rem,4vw,2.5rem)))]
          scroll-pl-[max(clamp(1.25rem,4vw,2.5rem),calc((100vw-87.5rem)/2+clamp(1.25rem,4vw,2.5rem)))]
        "
      >
        {members.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            ref={cardRef(index)}
            style={{
              animationDelay: `${index * 50}ms`,
              ...getCardStyle()
            }}
          />
        ))}
      </div>
    </section>
  );
}
