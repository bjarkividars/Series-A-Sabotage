'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-serif text-highlight-yellow">
        {ROLE_LABELS[role]}
      </h2>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className={`
            hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 items-center justify-center rounded-full
            bg-royal-blue text-highlight-yellow
            hover:scale-110 active:scale-95
            transition-all duration-200
            ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

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

        <button
          onClick={() => scroll('right')}
          className={`
            hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 items-center justify-center rounded-full
            bg-royal-blue text-highlight-yellow
            hover:scale-110 active:scale-95
            transition-all duration-200
            ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
