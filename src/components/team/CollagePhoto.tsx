'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TeamMember } from '@/lib/roster';
import { formatCurrency } from '@/lib/format-currency';
import { PhotoPosition } from '@/lib/collage-layout';

interface CollagePhotoProps {
  member: TeamMember;
  position: PhotoPosition;
  onRemove: (id: string) => void;
}

export function CollagePhoto({ member, position, onRemove }: CollagePhotoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const monthlyCost = member.annualSalary / 12;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-300"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) rotate(${position.rotation}deg) scale(${isHovered ? position.scale * 1.15 : position.scale})`,
        zIndex: isHovered ? 100 : position.zIndex,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Polaroid-style photo frame */}
      <div
        className={`
          relative
          w-24 h-28 md:w-28 md:h-32
          bg-white
          p-1.5 pb-4
          shadow-lg
          transition-shadow duration-300
          ${isHovered ? 'shadow-2xl' : ''}
        `}
      >
        {/* Image */}
        <div className="relative w-full h-full overflow-hidden bg-gray-100">
          <Image
            src={`/headshots/${member.avatar}`}
            alt={member.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 96px, 112px"
          />
        </div>
      </div>

      {/* Hover Tooltip - wrapper with padding to bridge the gap */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 top-full
          pt-2
          ${isHovered ? '' : 'pointer-events-none'}
        `}
        style={{ zIndex: 101 }}
      >
        <div
          className={`
            w-44 md:w-52
            bg-royal-blue text-white
            rounded-lg p-3
            shadow-xl
            transition-all duration-300
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}
          `}
        >
          <p className="font-serif text-base font-bold leading-tight">
            {member.name}
          </p>
          <p className="text-xs opacity-80 mt-0.5">{member.role}</p>
          <p className="text-highlight-yellow font-semibold mt-1 text-sm">
            {formatCurrency(monthlyCost)}/mo
          </p>

          {/* Remove button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(member.id);
            }}
            className="
              absolute -top-2 -right-2
              w-6 h-6
              bg-red-500 hover:bg-red-600
              rounded-full
              flex items-center justify-center
              text-white
              transition-colors
              shadow-md
            "
            aria-label={`Remove ${member.name}`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
