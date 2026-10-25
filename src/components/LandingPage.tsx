import React, { useState } from 'react';
import { SampleImage, SAMPLE_IMAGES } from '../data/samples';
import { ArrowRight } from 'lucide-react';
import { HeroSpecimen } from './HeroArtworkCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getContrastRatio } from '../utils/color';

/**
 * Computes maximum WCAG contrast text color (Paper #F2EFE8 or Ink #151515) for any background hex.
 */
const getContrastTextColor = (hex: string) => {
  const contrastOnInk = getContrastRatio(hex, '#151515');
  const contrastOnPaper = getContrastRatio(hex, '#F2EFE8');
  return contrastOnInk >= contrastOnPaper ? '#151515' : '#F2EFE8';
};

/**
 * Determines functional chromatic role based on palette index and HSL characteristics.
 */
const getToneRole = (idx: number, swatch: { hsl: { s: number; l: number } }) => {
  if (idx === 0) return 'DOMINANT ROOT';
  if (swatch.hsl.s > 40 && swatch.hsl.l > 30 && swatch.hsl.l < 75) return 'CHROMATIC ACCENT';
  if (swatch.hsl.l > 75) return 'LIGHT SURFACE';
  if (swatch.hsl.l < 25) return 'DEEP SHADOW';
  if (idx === 1) return 'SECONDARY TONE';
  return 'STRUCTURAL MID';
};

interface LandingPageProps {
  onOpenWorkspace: () => void;
  onSelectSample: (sample: SampleImage) => void;
  onNewImage?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkspace,
  onSelectSample,
  onNewImage,
}) => {
  const [activeHeroSampleIndex, setActiveHeroSampleIndex] = useState(0);
  const [selectedProofSwatchIndex, setSelectedProofSwatchIndex] = useState(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => {});
    }
    setCopiedHex(hex);
    setTimeout(() => {
      setCopiedHex((current) => (current === hex ? null : current));
    }, 1800);
  };

  const heroSample = SAMPLE_IMAGES[activeHeroSampleIndex] || SAMPLE_IMAGES[0];
  const safeProofSwatchIndex = selectedProofSwatchIndex < heroSample.palette.length ? selectedProofSwatchIndex : 0;
  const activeProofSwatch = heroSample.palette[safeProofSwatchIndex] || heroSample.palette[0];

  // Scroll reveal hooks per motion.md §5: Reveal once per section
  const { ref: proofRef, isRevealed: isProofRevealed } = useScrollReveal();
  const { ref: stepsRef, isRevealed: isStepsRevealed } = useScrollReveal();
  const { ref: presetsRef, isRevealed: isPresetsRevealed } = useScrollReveal();
  const { ref: ctaRef, isRevealed: isCtaRevealed } = useScrollReveal();

  return (
    <div className="min-h-screen bg-paper flex flex-col selection:bg-signal-red selection:text-white">
      {/* Visually hidden screen reader live announcement region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {copiedHex ? `Copied hex code ${copiedHex} to clipboard` : ''}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO — Architectural Editorial Spread
          (REFERENCE-LED REDESIGN: Readymag × Proof × Coral Typography Overlap)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b-2 border-ink bg-paper">
        <div
          className="mx-auto max-w-content"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Masthead Bar — Restrained, Functional Architectural Folio */}
          <div className="animate-hero-eyebrow flex flex-wrap items-center justify-between gap-4 py-2 sm:py-2.5 border-b border-rule">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <span className="w-2 h-2 bg-signal-red inline-block flex-shrink-0" aria-hidden="true" />
                <span>IMAGE → COLOR SYSTEM</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-muted font-mono text-[11px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-success" aria-hidden="true" />
                <span className="hidden sm:inline">Local Browser Engine •</span> Zero Tracking
              </span>
              <span className="text-ink font-semibold border-l border-rule pl-4 hidden md:inline">
                VOL. 03 // 2026
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              THE MONOLITHIC BROADSHEET — EDITORIAL FRONT-PAGE COVER
              Integrated Specimen Ledger + Monumental Canopy + Continuous Plate
              ═══════════════════════════════════════════════════════════ */}
          <div className="border-2 border-ink bg-paper mt-3 sm:mt-4">
            
            {/* Tier 1: Specimen Folio Index Ledger */}
            <div className="border-b-2 border-ink">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink bg-paper">
                {SAMPLE_IMAGES.map((sample, idx) => {
                  const isSelected = idx === activeHeroSampleIndex;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => setActiveHeroSampleIndex(idx)}
                      className={`tactile-press p-2.5 sm:p-3 text-left transition-colors flex flex-col justify-between ${
                        isSelected
                          ? 'bg-ink text-white'
                          : 'bg-paper hover:bg-white text-ink'
                      }`}
                      aria-label={`Switch hero specimen to ${sample.title}`}
                    >
                      <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-wider mb-1">
                        <span className={isSelected ? 'text-acid-lime font-bold' : 'text-muted'}>
                          0{idx + 1} // {sample.category}
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 bg-signal-red inline-block" />}
                      </div>
                      <div className="font-display text-xs sm:text-sm font-bold truncate mb-2">
                        {sample.title}
                      </div>
                      <div className="flex h-1.5 w-full border border-ink/30 overflow-hidden">
                        {sample.palette.map((swatch) => (
                          <div
                            key={swatch.id}
                            style={{ backgroundColor: swatch.hex }}
                            className="flex-1 h-full"
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tier 2: The Typographic Collision Canvas — Monumental Typography × Integrated Artwork Spread */}
            <div className="relative border-b-2 border-ink bg-paper overflow-hidden min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] xl:min-h-[540px] flex flex-col lg:flex-row justify-between">
              
              {/* Foreground Typographic Canopy & Anchored Colophon */}
              <div className="p-5 sm:p-6 lg:p-7 xl:p-8 flex flex-col justify-between flex-1 relative z-20 pointer-events-none lg:max-w-[60%] xl:max-w-[62%]">
                
                {/* Monumental Headline with Deliberate Graphic Collision */}
                <div className="select-none">
                  <h1 className="font-display font-black uppercase tracking-[-0.04em] leading-[0.85]">
                    {/* Line 1: In Ink, sits on paper canopy */}
                    <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.6rem] text-ink whitespace-normal sm:whitespace-nowrap">
                      Find the colors
                    </span>
                    {/* Line 2: In Signal Red — The Dedicated Collision Vector crossing the artwork boundary */}
                    <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-[4.8rem] xl:text-[5.8rem] text-signal-red mt-1 sm:mt-1.5 whitespace-normal sm:whitespace-nowrap lg:[text-shadow:_1.5px_1.5px_0_#151515]">
                      hiding in your
                    </span>
                    {/* Line 3: In Ink, grounds the composition */}
                    <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.6rem] text-ink mt-1 sm:mt-1.5 whitespace-normal sm:whitespace-nowrap">
                      images.
                    </span>
                  </h1>
                </div>

                {/* Anchored Supporting Editorial Copy */}
                <div className="max-w-md mt-5 lg:mt-6 pt-3.5 border-t-2 border-ink bg-paper/95 p-1 pointer-events-auto">
                  <p className="font-body text-xs sm:text-sm text-ink/80 leading-relaxed font-medium">
                    Deterministic color extraction from architectural and fine art imagery. Proportional harmonies, perceptual weights, and exportable tokens for real interfaces.
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-rule font-mono text-[10px] text-muted">
                    <span className="text-signal-red font-bold">SPATIAL SAMPLING</span>
                    <span>•</span>
                    <span>WCAG 2.2 AA VALIDATED</span>
                  </div>
                </div>

              </div>

              {/* Integrated Specimen Artwork Plane (Edge-to-edge right bleed on desktop) */}
              <div className="lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[54%] xl:w-[56%] border-t-2 lg:border-t-0 lg:border-l-2 border-ink bg-ink/10 z-10 flex flex-col justify-stretch">
                <HeroSpecimen
                  sample={heroSample}
                  onSelectSample={onSelectSample}
                  className="h-full w-full"
                />
              </div>

            </div>

            {/* Tier 3: The Functional Instrument Control Zone — Aligned Monolithic Ledger */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink bg-paper font-mono">
              
              {/* Pillar 1: Dominant Chromatic Tone Meter */}
              <div className="md:col-span-5 lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-paper">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted font-bold mb-3 pb-1.5 border-b border-rule">
                  <span>DOMINANT MASS // TONE 01</span>
                  <span className="text-signal-red font-bold">CALIBRATED</span>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-ink flex-shrink-0 relative overflow-hidden bg-ink/10"
                    style={{ backgroundColor: heroSample.palette[0]?.hex }}
                  >
                    <div className="absolute inset-0 specimen-sheen" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                      {heroSample.palette[0]?.hex}
                    </div>
                    <div className="text-[11px] text-muted mb-1">
                      RGB({heroSample.palette[0]?.rgb.r}, {heroSample.palette[0]?.rgb.g}, {heroSample.palette[0]?.rgb.b})
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-ink text-white inline-block">
                      {heroSample.palette[0]?.percentage}% SURFACE MASS
                    </span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Action Pillar — Primary & Secondary Workflows */}
              <div className="md:col-span-7 lg:col-span-5 p-4 sm:p-5 flex flex-col justify-center gap-2.5 bg-paper">
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="tactile-press w-full py-3.5 px-5 bg-ink text-white font-mono text-xs sm:text-sm uppercase tracking-wider font-bold border-2 border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors flex items-center justify-center gap-2.5"
                >
                  <span>Extract a palette</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('product-proof');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="tactile-press w-full py-2 px-3 text-ink font-mono text-[11px] sm:text-xs uppercase tracking-wider font-semibold border border-ink/40 hover:border-ink bg-paper hover:bg-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore the workspace ↓</span>
                </button>
              </div>

              {/* Pillar 3: Instrument Calibration & Privacy Ledger */}
              <div className="hidden lg:flex lg:col-span-3 p-4 sm:p-5 flex-col justify-between bg-paper/60 font-mono text-[10px]">
                <div className="flex items-center gap-2 text-muted font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-success" aria-hidden="true" />
                  <span>ENGINE // CLIENT-SIDE</span>
                </div>
                <p className="text-[11px] text-ink/75 leading-tight font-medium my-2">
                  Zero server tracking. All pixel decomposition and WCAG calibration execute locally in memory.
                </p>
                <div className="flex items-center justify-between text-muted pt-2 border-t border-rule uppercase tracking-wider">
                  <span>100% PRIVATE</span>
                  <span className="text-ink font-bold">OFFLINE READY</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: CHROMATIC SPECTRUM SHEET — EDITORIAL COLOR ANALYSIS SPREAD
          (Pure Chromatic Architecture: Proportional Spectrum + Technical Data Matrix)
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="product-proof"
        ref={proofRef}
        className={`bg-white border-b-2 border-ink scroll-reveal-container scroll-mt-20 ${
          isProofRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content py-16 sm:py-20 lg:py-24"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Section Masthead: Asymmetrical Editorial Heading */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 mb-10 sm:mb-12 border-b-2 border-ink">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2.5 mb-3.5 font-mono text-xs uppercase tracking-widest text-signal-red font-bold">
                <span className="w-2 h-2 bg-signal-red inline-block flex-shrink-0" aria-hidden="true" />
                <span>§ 02 // CHROMATIC SPECTRUM SHEET</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.05] pt-0.5">
                From raw pixels to calibrated system.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="font-body text-sm sm:text-base text-ink/75 leading-relaxed">
                Spatial pixel sampling computes dominant mass, chromatic accents, and WCAG-tested tokens directly in your browser.
              </p>
            </div>
          </div>

          {/* Unified Broadsheet Chromatic Analysis Spread */}
          <div className="border-2 border-ink bg-white">
            
            {/* Broadsheet Top Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink border-b-2 border-ink bg-paper/60 font-mono text-xs">
              <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 font-bold text-ink uppercase tracking-wider">
                <span className="w-2 h-2 bg-signal-red inline-block flex-shrink-0" aria-hidden="true" />
                <span className="truncate">SPECIMEN // 0{activeHeroSampleIndex + 1}: {heroSample.title}</span>
              </div>
              <div className="hidden sm:flex px-4 py-3 items-center justify-between sm:justify-start gap-3 text-muted uppercase tracking-wider">
                <span className="text-ink font-semibold">{heroSample.palette.length} EXTRACTED TONES</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">SPATIAL SAMPLING</span>
              </div>
              <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between sm:justify-end gap-2 text-ink font-bold">
                <span className="text-muted uppercase text-[10px] font-semibold tracking-wider">STANDARDS //</span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-ink text-acid-lime font-bold inline-flex items-center gap-1.5 border border-ink">
                  <span className="w-1.5 h-1.5 bg-acid-lime" aria-hidden="true" />
                  WCAG 2.2 AA AUDITED
                </span>
              </div>
            </div>

            {/* ─── DESKTOP CHROMATIC ARCHITECTURE (lg and above) ─── */}
            <div className="hidden lg:block">
              {/* Main Event: Monumental Proportional Chromatic Spectrum Field */}
              <div
                className="flex flex-row h-[320px] divide-x-2 divide-ink bg-white"
                role="list"
                aria-label={`${heroSample.title} proportional chromatic spectrum`}
              >
                {heroSample.palette.map((swatch, idx) => {
                  const textColor = getContrastTextColor(swatch.hex);
                  const roleLabel = getToneRole(idx, swatch);
                  const mass = swatch.percentage || Math.round(100 / heroSample.palette.length);

                  return (
                    <button
                      key={swatch.id}
                      role="listitem"
                      type="button"
                      onClick={() => onSelectSample(heroSample)}
                      className="h-full p-5 xl:p-6 flex flex-col justify-between items-stretch group cursor-pointer text-left relative overflow-hidden transition-all duration-fast select-none tactile-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                      style={{
                        backgroundColor: swatch.hex,
                        flex: `${Math.max(mass, 10)} 0 0%`,
                        color: textColor,
                      }}
                      title={`Open workspace with ${swatch.hex} (${mass}% mass)`}
                    >
                      {/* Top Annotation: Tone Index & Mass Percentage */}
                      <div className="flex flex-col">
                        <div className="font-mono text-xs uppercase tracking-wider font-bold opacity-80">
                          0{idx + 1} // {roleLabel}
                        </div>
                        <div className="font-mono text-3xl xl:text-4xl font-black tracking-tight mt-1">
                          {mass}%
                        </div>
                      </div>

                      {/* Bottom Annotation: HEX & RGB Coordinate */}
                      <div className="flex flex-col text-left">
                        <div className="font-mono text-lg xl:text-xl font-black tracking-tight uppercase">
                          {swatch.hex}
                        </div>
                        <div className="font-mono text-xs opacity-80 font-semibold mt-0.5">
                          RGB({swatch.rgb.r}, {swatch.rgb.g}, {swatch.rgb.b})
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Streamlined Technical Compliance Baseline (Eliminates redundant HEX, RGB, role, mass) */}
              <div className="border-t-2 border-b-2 border-ink bg-white overflow-x-auto">
                <div className="flex flex-row divide-x-2 divide-ink min-w-[720px]">
                  {heroSample.palette.map((swatch, idx) => {
                    const contrastPaper = getContrastRatio(swatch.hex, '#F2EFE8');
                    const contrastInk = getContrastRatio(swatch.hex, '#151515');
                    const passesPaper = contrastPaper >= 4.5;
                    const passesInk = contrastInk >= 4.5;
                    const mass = swatch.percentage || Math.round(100 / heroSample.palette.length);

                    return (
                      <div
                        key={`compliance-${swatch.id}`}
                        style={{ flex: `${Math.max(mass, 10)} 0 0%` }}
                        className="p-3.5 xl:p-4 flex flex-col justify-between bg-white hover:bg-paper/30 transition-colors min-w-[120px]"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-muted uppercase font-bold tracking-wider mb-2">
                          <span className="text-ink">TONE 0{idx + 1}</span>
                          <span
                            className="w-2.5 h-2.5 border border-ink/40 inline-block"
                            style={{ backgroundColor: swatch.hex }}
                            aria-hidden="true"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-muted uppercase font-semibold text-[9px] tracking-wider whitespace-nowrap">
                              PAPER
                            </span>
                            <span
                              className={`font-bold px-1.5 py-0.5 border text-[9px] whitespace-nowrap leading-none ${
                                passesPaper
                                  ? 'bg-ink text-acid-lime border-ink'
                                  : 'text-muted border-rule bg-paper/40'
                              }`}
                            >
                              {contrastPaper}:1 {passesPaper ? 'AA ✓' : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-muted uppercase font-semibold text-[9px] tracking-wider whitespace-nowrap">
                              INK
                            </span>
                            <span
                              className={`font-bold px-1.5 py-0.5 border text-[9px] whitespace-nowrap leading-none ${
                                passesInk
                                  ? 'bg-ink text-acid-lime border-ink'
                                  : 'text-muted border-rule bg-paper/40'
                              }`}
                            >
                              {contrastInk}:1 {passesInk ? 'AA ✓' : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── MOBILE COMPACT CHROMATIC ARCHITECTURE (< lg) ─── */}
            <div className="block lg:hidden bg-white">
              {/* Horizontal Proportional Spectrum Band with 6 selectable segments */}
              <div
                className="h-20 sm:h-24 w-full flex flex-row divide-x-2 divide-ink border-b-2 border-ink overflow-hidden"
                role="tablist"
                aria-label={`${heroSample.title} color selection`}
              >
                {heroSample.palette.map((swatch, idx) => {
                  const isSelected = idx === safeProofSwatchIndex;
                  const mass = swatch.percentage || Math.round(100 / heroSample.palette.length);
                  const textColor = getContrastTextColor(swatch.hex);
                  const roleLabel = getToneRole(idx, swatch);

                  return (
                    <button
                      key={`mobile-swatch-${swatch.id}`}
                      role="tab"
                      type="button"
                      onClick={() => setSelectedProofSwatchIndex(idx)}
                      aria-selected={isSelected}
                      aria-label={`Tone 0${idx + 1}: ${swatch.hex}, ${mass}% mass, ${roleLabel}`}
                      className={`h-full relative flex flex-col justify-between p-2 sm:p-2.5 transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-press ${
                        isSelected ? 'ring-2 ring-inset ring-ink' : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: swatch.hex,
                        flex: `${Math.max(mass, 10)} 0 0%`,
                        color: textColor,
                      }}
                    >
                      <div className="font-mono text-[9px] sm:text-[10px] font-black opacity-80 uppercase leading-none">
                        0{idx + 1}
                      </div>
                      <div className="flex flex-col items-center">
                        {isSelected ? (
                          <span className="w-1.5 h-1.5 bg-current rounded-full" aria-hidden="true" />
                        ) : null}
                      </div>
                      <div className="font-mono text-[9px] sm:text-[10px] font-bold leading-none text-right">
                        {mass}%
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Single Compact Analytical Detail Panel for Active Tone */}
              {(() => {
                const selectedSwatch = activeProofSwatch;
                const selectedMass = selectedSwatch.percentage || Math.round(100 / heroSample.palette.length);
                const selectedRole = getToneRole(safeProofSwatchIndex, selectedSwatch);
                const contrastPaper = getContrastRatio(selectedSwatch.hex, '#F2EFE8');
                const contrastInk = getContrastRatio(selectedSwatch.hex, '#151515');
                const passesPaper = contrastPaper >= 4.5;
                const passesInk = contrastInk >= 4.5;

                return (
                  <div className="p-4 bg-paper/50 border-b-2 border-ink">
                    {/* Selected Tone Specifications */}
                    <div className="flex items-center justify-between pb-3 border-b border-rule">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 border border-ink flex-shrink-0"
                          style={{ backgroundColor: selectedSwatch.hex }}
                          aria-hidden="true"
                        />
                        <div>
                          <span className="font-mono text-[10px] text-signal-red font-bold uppercase tracking-wider block">
                            TONE 0{safeProofSwatchIndex + 1} // {selectedRole}
                          </span>
                          <span className="font-mono text-base font-black text-ink tracking-tight">
                            {selectedSwatch.hex}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-ink block">
                          {selectedMass}% MASS
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          RGB({selectedSwatch.rgb.r}, {selectedSwatch.rgb.g}, {selectedSwatch.rgb.b})
                        </span>
                      </div>
                    </div>

                    {/* WCAG Compliance & Quick Edit Action */}
                    <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px]">
                        <span className="text-muted uppercase font-semibold text-[9px] sm:text-[10px]">WCAG:</span>
                        <span
                          className={`font-bold px-1.5 py-0.5 border text-[9px] ${
                            passesPaper
                              ? 'bg-ink text-acid-lime border-ink'
                              : 'text-muted border-rule bg-paper/40'
                          }`}
                        >
                          PAPER {contrastPaper}:1 {passesPaper ? 'AA ✓' : '—'}
                        </span>
                        <span
                          className={`font-bold px-1.5 py-0.5 border text-[9px] ${
                            passesInk
                              ? 'bg-ink text-acid-lime border-ink'
                              : 'text-muted border-rule bg-paper/40'
                          }`}
                        >
                          INK {contrastInk}:1 {passesInk ? 'AA ✓' : '—'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectSample(heroSample)}
                        className="tactile-press py-2 px-3 bg-ink text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-signal-red transition-colors border border-ink"
                      >
                        <span>Edit tone</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tier 3: Integrated Provenance & Calibration Action Ledger */}
            <div className="p-4 sm:p-5 bg-paper flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Micro-Provenance Thumbnail Datum */}
              <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
                <div className="w-16 h-12 sm:w-20 sm:h-14 border-2 border-ink flex-shrink-0 overflow-hidden relative bg-ink/10">
                  <img
                    src={heroSample.metadata.dataUrl}
                    alt={`Source reference: ${heroSample.title}`}
                    className="w-full h-full object-cover block"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-signal-red font-bold uppercase tracking-wider mb-0.5">
                    PROVENANCE // SOURCE SPECIMEN
                  </div>
                  <div className="font-display text-xs sm:text-sm font-bold text-ink">
                    {heroSample.title}
                  </div>
                  <div className="font-mono text-[10px] text-muted">
                    {heroSample.category} • {heroSample.metadata.width} × {heroSample.metadata.height} PX • Spatial Octree Quantization
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <div className="font-mono text-[10px] text-muted text-center sm:text-right">
                  <span className="block font-bold text-ink">TOKENS CALIBRATED</span>
                  <span>CSS • DTCG • WCAG 2.2</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectSample(heroSample)}
                  className="tactile-press py-3 px-5 bg-ink text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-signal-red hover:border-signal-red border-2 border-ink transition-colors"
                >
                  <span>Open calibration bench</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: HOW IT WORKS — "OPEN NUMBERED EDITORIAL COLUMNS"
          (Unboxed 3-column progression with pruned metadata)
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={stepsRef}
        className={`bg-paper border-b-2 border-ink scroll-reveal-container scroll-mt-20 ${
          isStepsRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content py-16 sm:py-24"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Section Masthead: Distinctive Editorial Block */}
          <div className="mb-10 sm:mb-14 max-w-4xl">
            <div className="flex items-center gap-2.5 mb-3 font-mono text-xs uppercase tracking-widest text-signal-red font-bold">
              <span className="w-2 h-2 bg-signal-red inline-block flex-shrink-0" aria-hidden="true" />
              <span>§ 03 // WORKFLOW ARCHITECTURE</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.04] pt-0.5">
              Three steps to a functional color system.
            </h2>
            <p className="font-body text-base sm:text-lg text-ink/75 leading-relaxed mt-4 max-w-2xl">
              Deterministic browser-native transformation. From raw imagery to accessible token systems without leaving your device.
            </p>
          </div>

          {/* Open Numbered Editorial Progression */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-y-2 border-ink divide-y md:divide-y-0 md:divide-x-2 divide-ink bg-paper">
            
            {/* Step 01 */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => (onNewImage ? onNewImage() : onOpenWorkspace())}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onNewImage) onNewImage();
                  else onOpenWorkspace();
                }
              }}
              className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between group hover:bg-white transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-press"
              aria-label="Stage 01: Choose an image to extract palette"
            >
              <div>
                <div className="flex items-baseline justify-between border-b border-ink/20 group-hover:border-ink/40 pb-4 mb-6 transition-colors">
                  <span className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-ink tracking-tighter leading-none group-hover:text-signal-red transition-colors select-none">
                    01
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 border border-signal-red/30 text-signal-red group-hover:border-signal-red group-hover:bg-signal-red group-hover:text-white tracking-widest uppercase transition-colors">
                    STAGE // INPUT
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl lg:text-3xl text-ink mb-3 group-hover:text-signal-red transition-colors">
                  Choose an image
                </h3>

                <p className="font-body text-sm text-ink/75 leading-relaxed mb-6">
                  Drop your file or pick a specimen. Pixels render directly to an offscreen canvas. Zero network transmission occurs, keeping your creative assets entirely private.
                </p>
              </div>

              <div className="pt-4 border-t border-ink/20 group-hover:border-ink/40 font-mono text-xs text-muted flex items-center justify-between transition-colors">
                <span>PNG, JPG, WEBP, SVG</span>
                <span className="font-bold text-ink group-hover:text-white group-hover:bg-ink px-2.5 py-1 border border-ink/20 group-hover:border-ink flex items-center gap-1.5 transition-colors text-[11px] sm:text-xs uppercase tracking-wider">
                  <span>Choose image</span>
                  <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
                </span>
              </div>
            </div>

            {/* Step 02 */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectSample(heroSample)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSample(heroSample);
                }
              }}
              className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between group hover:bg-white transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-press"
              aria-label="Stage 02: Refine the palette in calibration bench"
            >
              <div>
                <div className="flex items-baseline justify-between border-b border-ink/20 group-hover:border-ink/40 pb-4 mb-6 transition-colors">
                  <span className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-ink tracking-tighter leading-none group-hover:text-signal-red transition-colors select-none">
                    02
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 border border-signal-red/30 text-signal-red group-hover:border-signal-red group-hover:bg-signal-red group-hover:text-white tracking-widest uppercase transition-colors">
                    STAGE // CALIBRATE
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl lg:text-3xl text-ink mb-3 group-hover:text-signal-red transition-colors">
                  Refine the palette
                </h3>

                <p className="font-body text-sm text-ink/75 leading-relaxed mb-6">
                  Adjust HSL channels, reorder swatches, test contrast ratios against WCAG 2.2 AA/AAA standards, and preview harmonic gradient ramp transitions.
                </p>
              </div>

              <div className="pt-4 border-t border-ink/20 group-hover:border-ink/40 font-mono text-xs text-muted flex items-center justify-between transition-colors">
                <span>WCAG 2.2 AA & AAA</span>
                <span className="font-bold text-ink group-hover:text-white group-hover:bg-ink px-2.5 py-1 border border-ink/20 group-hover:border-ink flex items-center gap-1.5 transition-colors text-[11px] sm:text-xs uppercase tracking-wider">
                  <span>Calibrate tone</span>
                  <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
                </span>
              </div>
            </div>

            {/* Step 03 */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectSample(heroSample)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSample(heroSample);
                }
              }}
              className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between group hover:bg-white transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-press"
              aria-label="Stage 03: Export your colors"
            >
              <div>
                <div className="flex items-baseline justify-between border-b border-ink/20 group-hover:border-ink/40 pb-4 mb-6 transition-colors">
                  <span className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-ink tracking-tighter leading-none group-hover:text-signal-red transition-colors select-none">
                    03
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 border border-signal-red/30 text-signal-red group-hover:border-signal-red group-hover:bg-signal-red group-hover:text-white tracking-widest uppercase transition-colors">
                    STAGE // OUTPUT
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl lg:text-3xl text-ink mb-3 group-hover:text-signal-red transition-colors">
                  Export your colors
                </h3>

                <p className="font-body text-sm text-ink/75 leading-relaxed mb-6">
                  Generate production-ready CSS custom properties with channel variables, or export DTCG-compliant design token JSON ready for direct Figma/code handoff.
                </p>
              </div>

              <div className="pt-4 border-t border-ink/20 group-hover:border-ink/40 font-mono text-xs text-muted flex items-center justify-between transition-colors">
                <span>CSS & DTCG TOKENS</span>
                <span className="font-bold text-ink group-hover:text-white group-hover:bg-ink px-2.5 py-1 border border-ink/20 group-hover:border-ink flex items-center gap-1.5 transition-colors text-[11px] sm:text-xs uppercase tracking-wider">
                  <span>Export tokens</span>
                  <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: CURATED EXAMPLES — "ASYMMETRICAL VISUAL ARCHIVE"
          (7-Col Primary Architectural + 5-Col Offset Secondary + Panoramic Landscape)
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="curated-studies"
        ref={presetsRef}
        className={`bg-white border-b-2 border-ink scroll-reveal-container scroll-mt-20 ${
          isPresetsRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content py-16 sm:py-24"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Section Masthead */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 mb-12 border-b-2 border-ink">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2.5 mb-3.5 font-mono text-xs uppercase tracking-widest text-signal-red font-bold">
                <span className="w-2 h-2 bg-signal-red inline-block flex-shrink-0" aria-hidden="true" />
                <span>§ 04 // CURATED STUDIES</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.05] pt-0.5">
                Tested against diverse imagery.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="font-body text-sm sm:text-base text-ink/75 leading-relaxed">
                Explore how Afterimage handles contrasting architectural forms, delicate organic textures, and natural landscape gradients.
              </p>
            </div>
          </div>

          {/* Asymmetrical Studies Layout: 8-Col Dominant Architectural + 4-Col Contrasting Botanical */}
          <div className="space-y-10 sm:space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              
              {/* Study 01 (Barbican): Dominant 8-Column Architectural Study */}
              {SAMPLE_IMAGES[0] && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSample(SAMPLE_IMAGES[0])}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSample(SAMPLE_IMAGES[0]);
                    }
                  }}
                  className="lg:col-span-8 flex flex-col justify-between border-2 border-ink bg-white group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-press select-none text-left"
                  aria-label={`Open Study 01: ${SAMPLE_IMAGES[0].title} in workspace`}
                >
                  <div className="px-4 py-3 border-b-2 border-ink flex items-center justify-between font-mono text-xs bg-paper/40 group-hover:bg-paper transition-colors">
                    <span className="font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 bg-signal-red" aria-hidden="true" />
                      <span>STUDY 01 // ARCHITECTURAL FORM</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-acid-lime bg-ink px-2 py-0.5 uppercase text-[10px]">
                        {SAMPLE_IMAGES[0].category}
                      </span>
                      <span className="font-mono text-[11px] text-muted hidden sm:inline">
                        800 × 600 PX
                      </span>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
                    <img
                      src={SAMPLE_IMAGES[0].metadata.dataUrl}
                      alt={SAMPLE_IMAGES[0].title}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-standard"
                      loading="lazy"
                    />
                  </div>

                  {/* Connected Spectrum Strip */}
                  <div
                    className="grid grid-cols-6 border-t-2 border-ink bg-white divide-x divide-ink/30"
                    role="list"
                    aria-label={`${SAMPLE_IMAGES[0].title} palette`}
                  >
                    {SAMPLE_IMAGES[0].palette.map((swatch) => {
                      const isCopied = copiedHex === swatch.hex;
                      return (
                        <div key={swatch.id} role="listitem" className="p-0">
                          <button
                            type="button"
                            onClick={(e) => handleCopyHex(e, swatch.hex)}
                            aria-label={`Copy hex code ${swatch.hex}`}
                            title={`Click to copy ${swatch.hex}`}
                            className="w-full p-2.5 text-center group/swatch hover:bg-paper/80 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue block"
                          >
                            <div
                              className="h-9 w-full mb-1 border border-ink/30 group-hover/swatch:border-ink transition-colors"
                              style={{ backgroundColor: swatch.hex }}
                            />
                            <div className="font-mono text-[10px] font-bold text-ink truncate text-center">
                              {isCopied ? (
                                <span className="bg-ink text-acid-lime px-1 py-0.5 inline-block text-[9px]">COPIED</span>
                              ) : (
                                swatch.hex
                              )}
                            </div>
                            <div className="font-mono text-[9px] text-muted font-medium text-center">
                              {isCopied ? '✓' : `${swatch.percentage}%`}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 py-3 bg-paper/40 border-t-2 border-ink flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-ink">{SAMPLE_IMAGES[0].title}</span>
                    <span className="font-mono text-xs text-ink group-hover:text-signal-red font-bold flex items-center gap-1.5 transition-colors">
                      <span>Open in workspace →</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Study 02 (Herbarium): 4-Column Contrasting Botanical Study */}
              {SAMPLE_IMAGES[1] && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSample(SAMPLE_IMAGES[1])}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSample(SAMPLE_IMAGES[1]);
                    }
                  }}
                  className="lg:col-span-4 flex flex-col justify-between border-2 border-ink bg-white group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-press select-none text-left"
                  aria-label={`Open Study 02: ${SAMPLE_IMAGES[1].title} in workspace`}
                >
                  <div className="px-4 py-3 border-b-2 border-ink flex items-center justify-between font-mono text-xs bg-ink text-white group-hover:bg-ink/90 transition-colors">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 bg-acid-lime" aria-hidden="true" />
                      <span>STUDY 02 // BOTANICAL</span>
                    </span>
                    <span className="font-mono text-acid-lime font-bold text-[10px] uppercase">
                      {SAMPLE_IMAGES[1].category}
                    </span>
                  </div>

                  <div className="relative aspect-square sm:aspect-[4/4.2] overflow-hidden bg-ink/5">
                    <img
                      src={SAMPLE_IMAGES[1].metadata.dataUrl}
                      alt={SAMPLE_IMAGES[1].title}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-standard"
                      loading="lazy"
                    />
                  </div>

                  {/* Connected Spectrum Strip for Botanical: 6 columns clean band */}
                  <div
                    className="grid grid-cols-6 border-t-2 border-ink bg-white divide-x divide-ink/30"
                    role="list"
                    aria-label={`${SAMPLE_IMAGES[1].title} palette`}
                  >
                    {SAMPLE_IMAGES[1].palette.map((swatch) => {
                      const isCopied = copiedHex === swatch.hex;
                      return (
                        <div key={swatch.id} role="listitem" className="p-0">
                          <button
                            type="button"
                            onClick={(e) => handleCopyHex(e, swatch.hex)}
                            aria-label={`Copy hex code ${swatch.hex}`}
                            title={`Click to copy ${swatch.hex}`}
                            className="w-full p-2 text-center group/swatch hover:bg-paper/80 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue block"
                          >
                            <div
                              className="h-8 w-full mb-1 border border-ink/30 group-hover/swatch:border-ink transition-colors"
                              style={{ backgroundColor: swatch.hex }}
                            />
                            <div className="font-mono text-[9px] font-bold text-ink truncate text-center">
                              {isCopied ? (
                                <span className="bg-ink text-acid-lime px-0.5 py-0.5 inline-block text-[8px]">COPIED</span>
                              ) : (
                                swatch.hex
                              )}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 py-3 bg-white border-t-2 border-ink flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-ink">{SAMPLE_IMAGES[1].title}</span>
                    <span className="font-mono text-xs text-ink group-hover:text-signal-red font-bold flex items-center gap-1.5 transition-colors">
                      <span>Open in workspace →</span>
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Row: Full-Span Landscape Study (Study 03: Dusk at Namib Dunes) */}
            {SAMPLE_IMAGES[2] && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelectSample(SAMPLE_IMAGES[2])}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSample(SAMPLE_IMAGES[2]);
                  }
                }}
                className="w-full border-2 border-ink bg-white group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-press select-none text-left"
                aria-label={`Open Study 03: ${SAMPLE_IMAGES[2].title} in workspace`}
              >
                <div className="px-4 py-3 border-b-2 border-ink flex items-center justify-between font-mono text-xs bg-paper/40 group-hover:bg-paper transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-signal-red" aria-hidden="true" />
                    <span className="font-bold text-ink uppercase tracking-wider">
                      STUDY 03 // NATURAL ATMOSPHERE GRADIENT
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-acid-lime bg-ink px-2 py-0.5 uppercase text-[10px]">
                      {SAMPLE_IMAGES[2].category}
                    </span>
                    <span className="font-mono text-[11px] text-muted hidden sm:inline">
                      {SAMPLE_IMAGES[2].metadata.width} × {SAMPLE_IMAGES[2].metadata.height} PX
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  <div className="lg:col-span-8 relative aspect-[16/7] lg:aspect-[21/8] overflow-hidden bg-ink/5 border-b lg:border-b-0 lg:border-r-2 border-ink">
                    <img
                      src={SAMPLE_IMAGES[2].metadata.dataUrl}
                      alt={SAMPLE_IMAGES[2].title}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-standard"
                      loading="lazy"
                    />
                  </div>

                  <div className="lg:col-span-4 flex flex-col justify-between bg-white p-5 lg:p-6">
                    <div>
                      <div className="font-display font-bold text-xl text-ink mb-1.5">
                        {SAMPLE_IMAGES[2].title}
                      </div>
                      <p className="font-body text-xs sm:text-sm text-ink/75 leading-relaxed mb-5">
                        Subtle gradation from dusk sky into desert dune silhouettes. Offscreen quantization preserves low-light chromatic nuance.
                      </p>

                      <div
                        className="grid grid-cols-6 border-2 border-ink mb-4 overflow-hidden"
                        role="list"
                        aria-label={`${SAMPLE_IMAGES[2].title} palette`}
                      >
                        {SAMPLE_IMAGES[2].palette.map((swatch) => {
                          const isCopied = copiedHex === swatch.hex;
                          return (
                            <div key={swatch.id} role="listitem" className="p-0">
                              <button
                                type="button"
                                onClick={(e) => handleCopyHex(e, swatch.hex)}
                                aria-label={`Copy hex code ${swatch.hex}`}
                                title={`Click to copy ${swatch.hex} (${swatch.percentage}%)`}
                                className="h-10 w-full border-r last:border-r-0 border-ink/40 hover:brightness-105 relative flex items-center justify-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                                style={{ backgroundColor: swatch.hex }}
                              >
                                {isCopied && (
                                  <span className="font-mono text-[8px] font-bold text-acid-lime bg-ink px-1 py-0.5 border border-ink/20 shadow-sm">
                                    COPIED
                                  </span>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-rule flex items-center justify-between">
                      <span className="font-mono text-xs text-muted font-semibold">PANORAMIC RANGE</span>
                      <span className="font-mono text-xs text-ink group-hover:text-signal-red font-bold flex items-center gap-1.5 transition-colors">
                        <span>Open study in workspace →</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: FINAL CTA / WORKSPACE LAUNCH — ASYMMETRICAL BRUTALIST FOLIO
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="workspace-launch"
        ref={ctaRef}
        className={`bg-paper border-b-2 border-ink scroll-reveal-container scroll-mt-20 ${
          isCtaRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content py-20 sm:py-28"
          style={{ padding: 'var(--page-gutter)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left 8 Cols: Monumental Brutalist Manifesto Statement */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal-red font-bold">
                  <span className="w-2 h-2 bg-signal-red inline-block flex-shrink-0" aria-hidden="true" />
                  <span>§ 05 // PRODUCTION DISPATCH</span>
                </div>

                <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-[4.6rem] xl:text-[5.4rem] text-ink tracking-tight leading-[0.92] uppercase pt-1">
                  Bring an image.
                  <br />
                  <span className="text-signal-red">Leave with a palette.</span>
                </h2>

                <p className="font-body text-base sm:text-lg text-ink/75 leading-relaxed max-w-xl">
                  Fast, client-side, and distraction-free. No account, no cookie trackers, and zero server upload required.
                </p>
              </div>

              <div className="pt-8 border-t-2 border-ink font-mono text-xs text-muted flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-signal-red inline-block" aria-hidden="true" />
                  <span>OFFSCREEN SAMPLING</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-acid-lime inline-block" aria-hidden="true" />
                  <span>WCAG COMPLIANCE AUDITING</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-electric-blue inline-block" aria-hidden="true" />
                  <span>ZERO ASSET LEAKAGE</span>
                </span>
              </div>
            </div>

            {/* Right 4 Cols: Architectural Solid Action Pillar */}
            <div className="lg:col-span-4 border-2 border-ink bg-white flex flex-col justify-between">
              <div>
                <div className="px-5 py-3.5 bg-paper/60 border-b-2 border-ink flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-ink uppercase tracking-wider">Direct Workspace Access</span>
                  <span className="font-bold text-signal-red text-[11px]">LOCAL SESSION</span>
                </div>
                <div className="p-6 sm:p-7">
                  <div className="font-display font-bold text-2xl text-ink mb-2">
                    Launch Local Instrument
                  </div>
                  <p className="font-body text-xs text-ink/70 leading-relaxed">
                    Offscreen spatial quantization runs immediately in your active browser session.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 space-y-4">
                <button
                  type="button"
                  onClick={onOpenWorkspace}
                  className="tactile-press w-full min-h-[52px] px-6 bg-ink text-white font-mono text-xs uppercase tracking-wider font-bold border-2 border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors flex items-center justify-center gap-2"
                >
                  <span>Extract a palette</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <div className="pt-3 border-t-2 border-ink/20 font-mono text-[10px] text-muted flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span>ENGINE:</span>
                    <span className="text-ink font-bold">100% CLIENT-SIDE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>PRIVACY:</span>
                    <span className="text-ink font-bold">ZERO TRACKING</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>FORMATS:</span>
                    <span className="text-ink font-bold">CSS • JSON (DTCG)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER — BRUTALIST ARCHITECTURAL BASELINE
          ═══════════════════════════════════════════════════════════ */}
      <footer className="mt-auto border-t-2 border-ink bg-white">
        <div
          className="mx-auto max-w-content py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted"
          style={{ padding: 'var(--page-gutter)' }}
        >
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-ink text-sm tracking-tight">AFTERIMAGE</span>
            <span className="border-l-2 border-ink pl-3 font-semibold text-ink">VOL. 03 // 2026</span>
          </div>

          <span className="text-center sm:text-right font-medium">
            Local browser quantization • Zero external network transmission
          </span>
        </div>
      </footer>
    </div>
  );
};
