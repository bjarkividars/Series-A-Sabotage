'use client';

import { forwardRef, useState, useRef } from 'react';
import Image from 'next/image';
import { TeamMember } from '@/types';
import { useTeam } from '@/contexts/TeamContext';
import { formatCurrency } from '@/lib/format-currency';
import { createExplosion } from '@/lib/particle-explosion';
import { playMemberAudio } from '@/lib/audio';
import { createFloatingQuote } from '@/lib/floating-quote';
import { createSnoopEffect } from '@/lib/snoop-effect';

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
  style?: React.CSSProperties;
}

export const TeamMemberCard = forwardRef<HTMLDivElement, TeamMemberCardProps>(
  function TeamMemberCard({ member, className = '', style }, ref) {
    const { addMember, removeMember, selectedIds } = useTeam();
    const isSelected = selectedIds.has(member.id);
    const displaySalary = `${formatCurrency(member.annualSalary)}/yr`;
    const [bounceTransform, setBounceTransform] = useState('scale(1) rotate(0deg)');
    const avatarRef = useRef<HTMLDivElement>(null);

    return (
      <div
        ref={ref}
        className={`
          card-dtr
          pb-14 md:pb-18
          min-w-[230px] max-w-[230px] md:min-w-[280px] md:max-w-[280px]
          snap-start
          ${className}
        `}
        style={style}
      >
        {/* Avatar */}
        <div
          ref={avatarRef}
          className="w-full h-40 md:h-56 rounded-t-lg flex items-center justify-center overflow-hidden relative"
          style={{
            transform: bounceTransform,
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {member.avatar ? (
            <Image
              src={`/headshots/${member.avatar}`}
              alt={member.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 220px, 280px"
            />
          ) : (
            <span className="text-6xl">{getEmoji(member.role)}</span>
          )}
        </div>

        <div className="py-3 md:p-4 space-y-3">
          <div>
            <h3 className="font-serif text-lg md:text-xl text-royal-blue font-bold">{member.name}</h3>
          </div>

          <p className="text-xl md:text-2xl font-bold text-royal-blue">{displaySalary}</p>

          <div className="space-y-2 text-xs text-royal-blue/80">
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">+</span>
              <span>{member.buff}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-600 font-bold">−</span>
              <span>{member.debuff}</span>
            </p>
          </div>

          <div className="absolute bottom-6 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
            <button
              className={`
              btn-primary w-full mt-4 flex items-center justify-center
            `}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  removeMember(member.id);
                } else if (member.id === 'dog-snoop' && avatarRef.current) {
                  createSnoopEffect(avatarRef.current, () => {
                    addMember(member);
                  });
                } else {
                  const randomScale = 1.02 + Math.random() * 0.06;
                  const randomRotation = (Math.random() - 0.5) * 16;

                  setBounceTransform(`scale(${randomScale}) rotate(${randomRotation}deg)`);
                  createExplosion(e.clientX, e.clientY);

                  if (member.audioPath) {
                    playMemberAudio(member.audioPath);
                  }
                  if (member.quote) {
                    createFloatingQuote(member.quote, e.clientX, e.clientY - 60);
                  }

                  addMember(member);

                  setTimeout(() => setBounceTransform('scale(1) rotate(0deg)'), 300);
                }
              }}
            >
              {isSelected ? 'Remove' : 'Add to Team'}
            </button>
          </div>
        </div>
      </div>
    );
  });

function getEmoji(role: string): string {
  const emojiMap: Record<string, string> = {
    CEO: '👔',
    ENGINEERING: '💻',
    DESIGN: '🎨',
    LEGAL: '⚖️',
    SALES: '📈',
    COO: '⚙️',
    DOG: '🐕',
    VIBE: '✨',
  };
  return emojiMap[role] || '👤';
}
