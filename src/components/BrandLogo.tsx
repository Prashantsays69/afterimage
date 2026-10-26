import React from 'react';

interface BrandLogoProps {
  /** If true, renders the "AFTERIMAGE" wordmark alongside the symbol */
  showWordmark?: boolean;
  /** Size in pixels for the square symbol (default 24) */
  size?: number;
  /** Surface color mode: 'light' (default) on Paper/White, 'dark' on Ink/black */
  variant?: 'light' | 'dark';
  /** Extra CSS class name */
  className?: string;
  /** Optional micro-badge text, e.g. "v1.0" */
  badgeText?: string;
}

/**
 * BrandLogo — The official Afterimage visual identity.
 *
 * Concept:
 * An original editorial color-separation symbol made from three sharp, offset,
 * overlapping geometric planes (Electric Blue #2457FF, Acid Lime #D7FF3F, Signal Red #FF593D)
 * anchored by an Ink #151515 structural boundary.
 * Represents an image leaving a residual impression through physical plate registration.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  showWordmark = true,
  size = 24,
  variant = 'light',
  className = '',
  badgeText,
}) => {
  const isDark = variant === 'dark';
  const strokeColor = isDark ? '#F2EFE8' : '#151515';
  const wordmarkColor = isDark ? 'text-paper' : 'text-ink';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 
        Geometric Color-Separation Symbol
        Layered offset planes:
        Plate 1 (Electric Blue #2457FF) offset bottom-left: x=2, y=9, w=14, h=14
        Plate 2 (Acid Lime #D7FF3F) offset center: x=7, y=6, w=14, h=14
        Plate 3 (Signal Red #FF593D) offset top-right: x=12, y=3, w=14, h=14
        Plus crisp Ink/Paper registration boundaries and optical residual apertures
      */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 brand-symbol-transition"
        aria-hidden="true"
      >
        {/* Registration backdrop frame */}
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          fill={isDark ? '#151515' : '#F2EFE8'}
          stroke={strokeColor}
          strokeWidth="1.5"
        />

        {/* Plate 1: Electric Blue (offset bottom-left) */}
        <rect
          x="3.5"
          y="10.5"
          width="12"
          height="12"
          fill="#2457FF"
          stroke={strokeColor}
          strokeWidth="1.2"
          className="brand-plane brand-plane-blue"
        />

        {/* Plate 2: Acid Lime (central overlapping registration) */}
        <rect
          x="8"
          y="7"
          width="12"
          height="12"
          fill="#D7FF3F"
          stroke={strokeColor}
          strokeWidth="1.2"
          className="brand-plane brand-plane-lime"
        />

        {/* Plate 3: Signal Red (offset top-right) */}
        <rect
          x="12.5"
          y="3.5"
          width="12"
          height="12"
          fill="#FF593D"
          stroke={strokeColor}
          strokeWidth="1.2"
          className="brand-plane brand-plane-red"
        />

        {/* Central Registration Core Crosshair */}
        <line x1="14" y1="11.5" x2="14" y2="14.5" stroke={strokeColor} strokeWidth="1.2" />
        <line x1="12.5" y1="13" x2="15.5" y2="13" stroke={strokeColor} strokeWidth="1.2" />
      </svg>

      {/* Editorial Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline gap-2">
          <span
            className={`font-display font-black text-lg md:text-xl tracking-tight transition-colors duration-fast ${wordmarkColor}`}
          >
            AFTERIMAGE
          </span>
          {badgeText && (
            <span
              className={`font-mono text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.2 border ${
                isDark ? 'border-paper/40 text-paper/70' : 'border-ink/30 text-ink/70'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
