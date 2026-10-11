import React from 'react';

interface PremiumLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PremiumLogo: React.FC<PremiumLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  onClick,
}) => {
  const getEmblemDimensions = () => {
    switch (size) {
      case 'sm':
        return { box: 'w-7 h-7', svg: 28, stroke: 1.5 };
      case 'lg':
        return { box: 'w-11 h-11', svg: 44, stroke: 2 };
      case 'xl':
        return { box: 'w-16 h-16', svg: 64, stroke: 2.2 };
      case 'md':
      default:
        return { box: 'w-9 h-9', svg: 36, stroke: 1.8 };
    }
  };

  const getWordmarkSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs tracking-[0.25em]';
      case 'lg':
        return 'text-base sm:text-lg tracking-[0.28em]';
      case 'xl':
        return 'text-xl sm:text-2xl tracking-[0.32em]';
      case 'md':
      default:
        return 'text-sm tracking-[0.26em]';
    }
  };

  const { box, svg, stroke } = getEmblemDimensions();

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* CRED-Style Minimalist Architectural Monolith Emblem */}
      <div
        className={`${box} relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-b from-[#1c1d22] via-[#101115] to-[#08080a] border border-white/[0.12] shadow-[0_4px_20px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.18)] transition-all duration-300 group-hover:border-white/30 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.12)]`}
      >
        <svg
          width={svg * 0.72}
          height={svg * 0.72}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle gradient definitions */}
          <defs>
            <linearGradient id="credGleam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="60%" stopColor="#d4d4d8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#71717a" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="accentGleam" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Interlocking Monolithic 'D' & '1' Geometric Facets */}
          {/* Outer Monolith Arc */}
          <path
            d="M6 5.5H16.5C22.299 5.5 27 10.201 27 16C27 21.799 22.299 26.5 16.5 26.5H6V5.5Z"
            stroke="url(#credGleam)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Geometric Movement Cut */}
          <path
            d="M12 11H16C18.7614 11 21 13.2386 21 16C21 18.7614 18.7614 21 16 21H12V11Z"
            stroke="url(#credGleam)"
            strokeWidth={stroke * 0.85}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.75"
          />

          {/* Sharp Vertical Dynamic 1 Pillar */}
          <line
            x1="12"
            y1="7.5"
            x2="12"
            y2="24.5"
            stroke="url(#credGleam)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Micro Kinetic Accent Dot */}
          <circle cx="16" cy="16" r="1.5" fill="url(#accentGleam)" />
        </svg>
      </div>

      {/* Typography: Razor-Sharp Letter-Spaced Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black uppercase text-white font-sans ${getWordmarkSize()}`}
            >
              DANCE<span className="text-[#a1a1aa] font-medium">ONE</span>
            </span>
          </div>
          {showTagline && (
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#71717a] mt-1">
              ALL ABOUT DANCE
            </span>
          )}
        </div>
      )}
    </div>
  );
};

