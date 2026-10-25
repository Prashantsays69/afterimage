import React, { useRef, useState, useCallback, useEffect } from 'react';
import { SampleImage } from '../data/samples';

interface HeroSpecimenProps {
  sample: SampleImage;
  onSelectSample: (sample: SampleImage) => void;
  className?: string;
}

/**
 * HeroSpecimen — The signature editorial color instrument.
 *
 * Art Direction:
 * - A single sculptural editorial specimen object rather than disjointed floating cards.
 * - Layer 0 (Background): Heavy archival mounting board with corner registration marks.
 * - Layer 1 (Middle Ground): Dominant source artwork plane (translateZ 24px) with crisp razor matting.
 * - Layer 2 (Foreground): Integrated chromatic instrumentation plate (translateZ 44px) anchoring the
 *   dominant tone, accent mass, and calibration spectrum into a cohesive architectural silhouette.
 * - Restrained CSS perspective (1200px) with pointer tilt clamped to ±3.8°.
 * - Zero React component re-renders during pointer movement (direct CSS custom property updates).
 * - Smooth 260ms return to neutral pose on pointer leave.
 * - Complete, intentional resting composition with disabled tilt on touch & reduced motion.
 */
export const HeroSpecimen: React.FC<HeroSpecimenProps> = ({
  sample,
  onSelectSample,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isTilted, setIsTilted] = useState(false);

  // Set CSS custom properties directly on the element — zero React component re-renders
  const setTiltVars = useCallback((rx: number, ry: number, nx: number, ny: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-rx', `${rx}deg`);
    el.style.setProperty('--tilt-ry', `${ry}deg`);
    el.style.setProperty('--tilt-x', `${nx}`);
    el.style.setProperty('--tilt-y', `${ny}`);
  }, []);

  // Detect fine pointer capability and respect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsInteractive(hasFinePointer && !prefersReducedMotion);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInteractive(hasFinePointer && !e.matches);
      if (e.matches) {
        setTiltVars(0, 0, 0, 0);
        setIsTilted(false);
      }
    };

    motionQuery.addEventListener('change', handleChange);
    return () => motionQuery.removeEventListener('change', handleChange);
  }, [setTiltVars]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteractive || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates from -1 to 1 centered on container
      const normX = Math.max(-1, Math.min(1, (x / rect.width - 0.5) * 2));
      const normY = Math.max(-1, Math.min(1, (y / rect.height - 0.5) * 2));

      // Clamp rotation to 3.8° max per axis (design.md §6, motion.md §4)
      const rx = Math.max(-3.8, Math.min(3.8, -normY * 3.6));
      const ry = Math.max(-3.8, Math.min(3.8, normX * 3.6));

      setTiltVars(
        Number(rx.toFixed(2)),
        Number(ry.toFixed(2)),
        Number(normX.toFixed(3)),
        Number(normY.toFixed(3))
      );
    },
    [isInteractive, setTiltVars]
  );

  const handlePointerEnter = useCallback(() => {
    if (!isInteractive) return;
    setIsTilted(true);
  }, [isInteractive]);

  const handlePointerLeave = useCallback(() => {
    if (!isInteractive) return;
    setTiltVars(0, 0, 0, 0);
    setIsTilted(false);
  }, [isInteractive, setTiltVars]);

  return (
    <div className={`animate-hero-artwork w-full h-full flex flex-col justify-between ${className}`}>
      <div
        ref={containerRef}
        className="hero-perspective-wrap h-full w-full flex flex-col justify-between"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          '--tilt-rx': '0deg',
          '--tilt-ry': '0deg',
          '--tilt-x': '0',
          '--tilt-y': '0',
        } as React.CSSProperties}
        role="region"
        aria-label="Color specimen composition"
      >
        {/* The unboxed broadsheet specimen plate */}
        <div
          className="hero-specimen h-full w-full flex flex-col justify-between relative bg-ink/10"
          style={{
            transform: isInteractive
              ? 'rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))'
              : undefined,
            transition: isTilted
              ? 'transform 75ms linear'
              : 'transform var(--motion-panel) var(--ease-enter)',
          }}
        >
          {/* Dominant Source Artwork Plane */}
          <div className="specimen-layer-image relative flex-1 h-full w-full overflow-hidden bg-ink/10 select-none">
            
            {/* Source Artwork Display — Visual Authority */}
            <div
              className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto w-full h-full overflow-hidden bg-ink/10 cursor-pointer group select-none"
              onClick={() => onSelectSample(sample)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSample(sample);
                }
              }}
              aria-label={`Open workspace with ${sample.title}`}
              title={`Open workspace with ${sample.title}`}
            >
              <img
                src={sample.metadata.dataUrl}
                alt={`Source artwork: ${sample.title}`}
                className="w-full h-full object-cover select-none block group-hover:scale-[1.01] transition-transform duration-panel"
                loading="eager"
                decoding="async"
              />

              {/* Dynamic light sheen responding to pointer position */}
              <div className="absolute inset-0 specimen-sheen" aria-hidden="true" />

              {/* Corner Registration Crosshairs for Archival Print Texture */}
              <div className="absolute top-2.5 left-2.5 pointer-events-none font-mono text-[10px] text-white/50 select-none leading-none">
                +
              </div>
              <div className="absolute bottom-2.5 right-2.5 pointer-events-none font-mono text-[10px] text-white/50 select-none leading-none">
                +
              </div>

              {/* Architectural Specimen Datum Annotations */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-ink/90 text-white px-2.5 py-1 font-mono text-[10px] sm:text-xs border border-white/20">
                <span className="uppercase font-semibold tracking-wider text-acid-lime">
                  {sample.category}
                </span>
                <span className="text-white/40 hidden sm:inline">
                  • {sample.metadata.width}×{sample.metadata.height} PX
                </span>
              </div>

              {/* Image Title & Specimen Datum Stamp */}
              <div className="absolute bottom-3 left-3 font-mono text-[10px] sm:text-xs text-white bg-ink/90 px-3 py-1.5 flex items-center gap-2 border border-white/20">
                <span className="w-1.5 h-1.5 bg-signal-red" aria-hidden="true" />
                <span className="font-bold uppercase tracking-wider">{sample.title}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/70 uppercase tracking-wider">Color Specimen</span>
              </div>

              {/* Subtle hover prompt */}
              <div className="absolute bottom-3 right-3 font-mono text-[10px] sm:text-xs text-white bg-ink/90 px-2.5 py-1.5 hidden sm:flex items-center gap-1.5 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Inspect in workspace →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export alias for backward compatibility
export const HeroArtworkCard = HeroSpecimen;
