import React, { useRef, useState, useCallback, useEffect } from 'react';
import { SampleImage } from '../data/samples';

interface HeroSpecimenProps {
  sample: SampleImage;
  onSelectSample: (sample: SampleImage) => void;
}

/**
 * HeroSpecimen — The signature spatial 3D color specimen composition.
 *
 * Design spec (design.md §6):
 * - Central cropped image plane acts as the source
 * - 2–4 offset color planes/sample strips emerge from that image, suggesting extraction
 * - Asymmetrical composition with deliberate overlap and occlusion
 * - Tactile editorial still life: crisp edges, matte surfaces, contact shadows
 * - CSS perspective + layered transforms for true spatial depth
 * - Resting state is complete and intentional before any interaction
 * - Directional light, soft contact shadows that shift with pointer tilt
 * - Pointer tilt clamped to 3–5° max per axis; disabled on touch & reduced motion
 *
 * Motion spec (motion.md §4):
 * - Perspective 1100px, rotation clamped to ~3.8° per axis
 * - 2–4 layers with differential parallax transforms
 * - Zero React re-renders on pointer move (updates CSS custom properties directly)
 * - 220–280ms smooth ease to neutral on pointer leave
 */
export const HeroSpecimen: React.FC<HeroSpecimenProps> = ({
  sample,
  onSelectSample,
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

  // Detect capability: fine pointer + no reduced motion preference
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

  const colors = sample.palette;
  const primaryColor = colors[0] || { hex: '#1E2328', percentage: 28, rgb: { r: 30, g: 35, b: 40 } };
  const accentColor1 = colors[3] || colors[1] || { hex: '#D96B43', percentage: 14, rgb: { r: 217, g: 107, b: 67 } };
  const accentColor2 = colors[2] || { hex: '#C59B27', percentage: 18, rgb: { r: 197, g: 155, b: 39 } };

  return (
    <div className="lg:col-span-5 animate-hero-artwork w-full max-w-[540px] mx-auto lg:max-w-none">
      <div
        ref={containerRef}
        className="hero-perspective-wrap"
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
        {/* The 3D specimen stage */}
        <div
          className={`hero-specimen relative ${isTilted ? 'specimen-shadow is-tilted' : 'specimen-shadow'}`}
          style={{
            transform: isInteractive
              ? 'rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))'
              : undefined,
            transition: isTilted
              ? 'transform 75ms linear'
              : 'transform var(--motion-panel) var(--ease-enter)',
          }}
        >
          {/* Layer 0: Base Mount Board (Matte archival paper plate) */}
          <div className="specimen-layer-base bg-white border border-rule p-4 sm:p-5 md:p-6 relative">

            {/* Specimen Board Registration Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-rule">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-signal-red inline-block flex-shrink-0" aria-hidden="true" />
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-ink uppercase tracking-wider">
                  Color Specimen
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-muted">
                  / FIG. 01
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 border border-rule bg-paper text-ink font-medium">
                  {sample.category}
                </span>
                <span className="font-mono text-[9px] text-muted hidden md:inline">
                  3D MATTE
                </span>
              </div>
            </div>

            {/* Spatial Overlap Composition Zone */}
            <div className="relative mb-5" style={{ transformStyle: 'preserve-3d' }}>

              {/* Layer 1: Central Cropped Source Image Plane */}
              <div className="specimen-layer-image relative border border-rule overflow-hidden bg-paper">
                <div style={{ aspectRatio: '4/3' }} className="w-full relative">
                  <img
                    src={sample.metadata.dataUrl}
                    alt={`Source artwork: ${sample.title}`}
                    className="w-full h-full object-cover select-none block"
                    loading="eager"
                    decoding="async"
                  />

                  {/* Corner archival crop marks */}
                  <div className="absolute top-2 left-2 font-mono text-[8px] text-white/80 uppercase tracking-widest bg-ink/60 px-1.5 py-0.5 backdrop-blur-[1px]">
                    SRC // {sample.metadata.width}×{sample.metadata.height}
                  </div>
                </div>

                {/* Bottom Source Bar */}
                <div className="px-3 py-2 bg-paper/95 border-t border-rule flex items-center justify-between">
                  <span className="font-mono text-[9px] sm:text-[10px] text-ink font-medium uppercase tracking-wider truncate max-w-[200px]">
                    {sample.title}
                  </span>
                  <span className="font-mono text-[9px] text-muted uppercase">
                    Offscreen Canvas
                  </span>
                </div>
              </div>

              {/* Layer 2: Primary Extracted Color Plate — Overlaps lower-right quadrant of image */}
              <div
                className="specimen-layer-primary absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-3 w-44 sm:w-48 md:w-52 bg-white border-2 border-ink p-3 z-20"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rule">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-signal-red inline-block" aria-hidden="true" />
                    <span className="font-mono text-[9px] font-bold text-ink uppercase tracking-wider">
                      Dominant
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-muted">
                    {primaryColor.percentage}% MASS
                  </span>
                </div>

                {/* Swatch Sample */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 border border-rule flex-shrink-0 shadow-inner"
                    style={{ backgroundColor: primaryColor.hex }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold text-ink tracking-tight">
                      {primaryColor.hex}
                    </div>
                    <div className="font-mono text-[9px] text-muted truncate">
                      RGB({primaryColor.rgb.r}, {primaryColor.rgb.g}, {primaryColor.rgb.b})
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 3: Secondary Accent Color Plate — Overlaps bottom-left quadrant */}
              <div
                className="specimen-layer-accent absolute -bottom-5 left-3 sm:left-4 w-44 sm:w-48 bg-white border border-rule p-2.5 z-30"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-rule">
                  <span className="font-mono text-[8px] font-semibold text-signal-red uppercase tracking-wider">
                    Accents
                  </span>
                  <span className="font-mono text-[8px] text-muted">
                    {(accentColor1.percentage || 14) + (accentColor2.percentage || 18)}% TOTAL
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 border border-rule flex-shrink-0"
                      style={{ backgroundColor: accentColor1.hex }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <span className="font-mono text-[9px] font-bold text-ink block truncate">
                        {accentColor1.hex}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 border border-rule flex-shrink-0"
                      style={{ backgroundColor: accentColor2.hex }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <span className="font-mono text-[9px] font-bold text-ink block truncate">
                        {accentColor2.hex}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer for overlapping plates */}
            <div className="h-6 sm:h-7" aria-hidden="true" />

            {/* Layer 4: Interactive Calibration Strip */}
            <div className="pt-3 border-t border-rule" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-muted uppercase tracking-wider">
                  Extracted Spectrum ({colors.length} Tones)
                </span>
                <span className="font-mono text-[9px] text-ink font-medium">
                  Click to edit
                </span>
              </div>

              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}
                role="list"
                aria-label="Sample palette swatches"
              >
                {colors.map((swatch, idx) => (
                  <button
                    key={swatch.id}
                    role="listitem"
                    type="button"
                    onClick={() => onSelectSample(sample)}
                    className="animate-swatch-entrance flex flex-col border border-rule group cursor-pointer tactile-swatch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
                    title={`Open workspace with ${swatch.hex}`}
                    style={{ animationDelay: `${200 + idx * 30}ms` }}
                  >
                    <div
                      className="h-7 sm:h-8 md:h-9 w-full group-hover:brightness-105 transition-all duration-fast"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="py-1 px-0.5 bg-paper text-center group-hover:bg-white transition-colors duration-fast">
                      <span className="font-mono text-[8px] text-ink font-medium block truncate">
                        {swatch.hex}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen Board Footer Action */}
            <div className="specimen-layer-label mt-3 pt-3 border-t border-rule flex items-center justify-between">
              <span className="font-mono text-[9px] sm:text-[10px] text-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-success inline-block" aria-hidden="true" />
                <span>{colors.length} Extracted Tones</span>
              </span>

              <button
                type="button"
                onClick={() => onSelectSample(sample)}
                className="font-mono text-[10px] sm:text-xs text-ink hover:text-signal-red font-semibold flex items-center gap-1 tactile-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue py-1 px-1.5 border border-transparent hover:border-rule bg-transparent hover:bg-paper"
              >
                <span>Edit palette →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Also export alias for backward compatibility
export const HeroArtworkCard = HeroSpecimen;
