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
  const targetRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, nx: 0, ny: 0 });
  const currentRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, nx: 0, ny: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Set CSS custom properties directly on the element — zero React component re-renders
  const setTiltVars = useCallback((rx: number, ry: number, tx: number, ty: number, nx: number, ny: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--tilt-ry', `${ry.toFixed(2)}deg`);
    el.style.setProperty('--tilt-tx', `${tx.toFixed(1)}px`);
    el.style.setProperty('--tilt-ty', `${ty.toFixed(1)}px`);
    el.style.setProperty('--tilt-x', `${nx.toFixed(3)}`);
    el.style.setProperty('--tilt-y', `${ny.toFixed(3)}`);
  }, []);

  // Smooth dampening physics loop using requestAnimationFrame (buttery inertia)
  const startSpringLoop = useCallback(() => {
    if (rafIdRef.current !== null) return;

    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;

      // Spring lerp factor (0.12 gives physical inertia and natural glide)
      const factor = 0.12;
      cur.rx += (tgt.rx - cur.rx) * factor;
      cur.ry += (tgt.ry - cur.ry) * factor;
      cur.tx += (tgt.tx - cur.tx) * factor;
      cur.ty += (tgt.ty - cur.ty) * factor;
      cur.nx += (tgt.nx - cur.nx) * factor;
      cur.ny += (tgt.ny - cur.ny) * factor;

      setTiltVars(cur.rx, cur.ry, cur.tx, cur.ty, cur.nx, cur.ny);

      const dRx = Math.abs(tgt.rx - cur.rx);
      const dRy = Math.abs(tgt.ry - cur.ry);
      const dTx = Math.abs(tgt.tx - cur.tx);
      const dTy = Math.abs(tgt.ty - cur.ty);
      const dNx = Math.abs(tgt.nx - cur.nx);
      const dNy = Math.abs(tgt.ny - cur.ny);

      // Continue animating until settled within epsilon
      if (dRx > 0.005 || dRy > 0.005 || dTx > 0.02 || dTy > 0.02 || dNx > 0.002 || dNy > 0.002) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        cur.rx = tgt.rx;
        cur.ry = tgt.ry;
        cur.tx = tgt.tx;
        cur.ty = tgt.ty;
        cur.nx = tgt.nx;
        cur.ny = tgt.ny;
        setTiltVars(cur.rx, cur.ry, cur.tx, cur.ty, cur.nx, cur.ny);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, [setTiltVars]);

  // Clean up rAF loop on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
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
        targetRef.current = { rx: 0, ry: 0, tx: 0, ty: 0, nx: 0, ny: 0 };
        currentRef.current = { rx: 0, ry: 0, tx: 0, ty: 0, nx: 0, ny: 0 };
        setTiltVars(0, 0, 0, 0, 0, 0);
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

      // Controlled spatial orbit & inspection camera movement
      const rx = Math.max(-7.2, Math.min(7.2, -normY * 6.8));
      const ry = Math.max(-8.2, Math.min(8.2, normX * 7.8));
      const tx = normX * 18;
      const ty = normY * 14;

      targetRef.current = {
        rx,
        ry,
        tx,
        ty,
        nx: normX,
        ny: normY,
      };

      startSpringLoop();
    },
    [isInteractive, startSpringLoop]
  );

  const handlePointerEnter = useCallback(() => {
    if (!isInteractive) return;
    startSpringLoop();
  }, [isInteractive, startSpringLoop]);

  const handlePointerLeave = useCallback(() => {
    if (!isInteractive) return;
    targetRef.current = { rx: 0, ry: 0, tx: 0, ty: 0, nx: 0, ny: 0 };
    startSpringLoop();
  }, [isInteractive, startSpringLoop]);

  return (
    <div className={`animate-hero-artwork w-full h-full flex flex-col justify-between ${className}`}>
      <div
        ref={containerRef}
        className="hero-perspective-wrap h-full w-full flex flex-col justify-between relative p-4 sm:p-5 lg:p-6 bg-[#EAE7DF]"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          '--tilt-rx': '0deg',
          '--tilt-ry': '0deg',
          '--tilt-tx': '0px',
          '--tilt-ty': '0px',
          '--tilt-x': '0',
          '--tilt-y': '0',
        } as React.CSSProperties}
        role="region"
        aria-label="Color specimen composition"
      >
        {/* Archival Mount Bed Background Field (Layer 0) */}
        <div className="absolute inset-0 pointer-events-none select-none p-3 sm:p-4 flex flex-col justify-between" aria-hidden="true">
          <div className="flex justify-between items-start font-mono text-[9px] text-ink/35 tracking-widest uppercase">
            <span>+ REG: AF-01</span>
            <span className="hidden sm:inline">MOUNT // 800PX DRAFTING BED</span>
            <span>+</span>
          </div>
          <div className="flex justify-between items-end font-mono text-[9px] text-ink/35 tracking-widest uppercase">
            <span>+ [0,0,0]</span>
            <span className="hidden sm:inline">CALIBRATION FIELD // 100% NATIVE</span>
            <span>+</span>
          </div>
        </div>

        {/* The unboxed broadsheet specimen plate (Layer 1 + Layer 2) */}
        <div
          className="hero-specimen hero-specimen-plate h-full w-full flex flex-col justify-between relative border-2 border-ink bg-ink/10 cursor-pointer group"
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
          style={{
            transform: isInteractive
              ? 'translate3d(var(--tilt-tx, 0px), var(--tilt-ty, 0px), 0px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))'
              : undefined,
          }}
        >
          {/* Dominant Source Artwork Plane (Layer 1) */}
          <div className="specimen-artwork-plane relative flex-1 h-full w-full select-none overflow-hidden bg-ink/10">
            <div
              key={sample.id}
              className="study-content-fade relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto w-full h-full overflow-hidden bg-ink/10 select-none"
            >
              <img
                src={sample.metadata.dataUrl}
                alt={`Source artwork: ${sample.title}`}
                className="w-full h-full object-cover select-none block group-hover:scale-[1.01] transition-transform duration-panel"
                loading="eager"
                decoding="async"
              />

              {/* Dynamic specular sheen responding coherently to pointer position */}
              <div className="absolute inset-0 specimen-sheen" aria-hidden="true" />
            </div>
          </div>

          {/* Floating Chromatic Calibration Band (Layer 2) — Genuine middle-ground depth */}
          <div className="specimen-palette-band absolute bottom-12 left-3 right-3 hidden sm:flex items-center gap-1.5 p-1.5 bg-paper/90 border border-ink/40 backdrop-blur-sm pointer-events-none select-none">
            <span className="font-mono text-[9px] font-bold text-ink uppercase tracking-wider px-1">CHROMATIC MASS //</span>
            <div className="flex-1 flex h-3.5 border border-ink overflow-hidden">
              {sample.palette.slice(0, 5).map((swatch) => (
                <div
                  key={swatch.id}
                  className="h-full flex-1 border-r last:border-r-0 border-ink/30"
                  style={{ backgroundColor: swatch.hex }}
                  title={`${swatch.hex} (${swatch.percentage}%)`}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] font-bold text-signal-red px-1">CALIBRATED</span>
          </div>

          {/* Elevated Foreground Instrumentation Details Layer (Layer 3) — Unclipped 3D Perspective */}
          <div className="specimen-foreground-layer absolute inset-0 select-none pointer-events-none" aria-hidden="true">
            {/* Corner Registration Crosshairs */}
            <div className="specimen-crosshair animate-crosshair-stamp absolute top-2.5 left-2.5 font-mono text-[10px] text-white/70 leading-none">
              +
            </div>
            <div className="specimen-crosshair animate-crosshair-stamp absolute bottom-2.5 right-2.5 font-mono text-[10px] text-white/70 leading-none">
              +
            </div>

            {/* Architectural Specimen Datum Annotations */}
            <div className="specimen-datum-tag animate-datum-calibrate absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 font-mono text-[10px] sm:text-xs">
              <span className="uppercase font-semibold tracking-wider text-acid-lime">
                {sample.category}
              </span>
              <span className="text-white/40 hidden sm:inline">
                • {sample.metadata.width}×{sample.metadata.height} PX
              </span>
            </div>

            {/* Image Title & Specimen Datum Stamp */}
            <div className="specimen-datum-stamp animate-datum-calibrate absolute bottom-3 left-3 font-mono text-[10px] sm:text-xs px-3 py-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-signal-red" aria-hidden="true" />
              <span className="font-bold uppercase tracking-wider">{sample.title}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/70 uppercase tracking-wider">Color Specimen</span>
            </div>

            {/* Subtle hover prompt */}
            <div className="specimen-hover-prompt absolute bottom-3 right-3 font-mono text-[10px] sm:text-xs px-2.5 py-1.5 hidden sm:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Inspect in workspace →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export alias for backward compatibility
export const HeroArtworkCard = HeroSpecimen;
