import React from 'react';
import { SampleImage, SAMPLE_IMAGES } from '../data/samples';
import { ArrowRight } from 'lucide-react';
import { HeroSpecimen } from './HeroArtworkCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface LandingPageProps {
  onOpenWorkspace: () => void;
  onSelectSample: (sample: SampleImage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkspace,
  onSelectSample,
}) => {
  const heroSample = SAMPLE_IMAGES[0]; // Barbican Study No. 4

  // Scroll reveal hooks — motion.md §5: Reveal once per section
  const { ref: proofRef, isRevealed: isProofRevealed } = useScrollReveal();
  const { ref: stepsRef, isRevealed: isStepsRevealed } = useScrollReveal();
  const { ref: presetsRef, isRevealed: isPresetsRevealed } = useScrollReveal();
  const { ref: ctaRef, isRevealed: isCtaRevealed } = useScrollReveal();

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO — Editorial poster + color specimen
          layout.md §3, design.md §5-6
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div
          className="mx-auto max-w-content grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Left: Editorial headline, copy, CTA — 7 cols */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-6 sm:pt-10 md:pt-16 lg:pt-20 pb-8 md:pb-16 lg:pb-24 space-y-5 md:space-y-6">

            {/* Eyebrow label — layout.md §3 */}
            <div className="animate-hero-eyebrow">
              <span className="inline-flex items-center gap-2 px-2 py-1 border border-rule bg-white">
                <span className="w-2 h-2 bg-signal-red" aria-hidden="true" />
                <span className="font-mono text-[10px] sm:text-xs font-medium uppercase tracking-wider text-ink">
                  IMAGE → COLOR SYSTEM
                </span>
              </span>
            </div>

            {/* Display headline — design.md §4:
                Oversized, tightly tracked, intentionally broken.
                Uses clamp(3.5rem, 9.5vw, 9rem) */}
            <h1 className="hero-display">
              <span className="block animate-hero-headline-1">
                Find the colors
              </span>
              <span className="block animate-hero-headline-2">
                hiding in your
                <br className="hidden sm:block" />
                {' '}images.
              </span>
            </h1>

            {/* Supporting copy */}
            <p className="animate-hero-support font-body text-base sm:text-lg text-ink/75 max-w-lg leading-relaxed">
              Extract, refine, test, and export a palette from any image.
            </p>

            {/* CTA pair — must be clickable from first paint */}
            <div className="animate-hero-actions flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="tactile-press inline-flex items-center justify-center min-h-[48px] px-7 md:px-8 bg-ink text-white font-medium text-sm md:text-base border-2 border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <span>Extract a palette</span>
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('product-proof');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="tactile-press inline-flex items-center justify-center min-h-[48px] px-5 text-ink font-medium text-sm md:text-base border-2 border-rule bg-transparent hover:border-ink hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              >
                Explore the workspace
              </button>
            </div>

            {/* Editorial accent rule */}
            <div className="animate-hero-privacy pt-2">
              <div className="editorial-rule" aria-hidden="true" />
            </div>
          </div>

          {/* Right: Hero specimen — 5 cols */}
          <HeroSpecimen
            sample={heroSample}
            onSelectSample={onSelectSample}
          />
        </div>

        {/* Bottom hero rule */}
        <div className="border-b border-rule" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: PRODUCT PROOF
          layout.md §4: Product preview bridging hero → workspace
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="product-proof"
        ref={proofRef}
        className={`bg-white border-b border-rule scroll-reveal-container ${
          isProofRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6 md:mb-8 pt-2 md:pt-4">
            <div className="editorial-rule" aria-hidden="true" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-muted">
              Product Preview
            </span>
          </div>

          {/* Proof grid: source image + palette + technical values */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4 md:pb-8">
            {/* Source image */}
            <div className="lg:col-span-7">
              <div className="border border-rule overflow-hidden bg-paper">
                <img
                  src={heroSample.metadata.dataUrl}
                  alt={`${heroSample.title} - product preview`}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              {/* Connected palette strip */}
              <div className="grid grid-cols-6 border-x border-b border-rule">
                {heroSample.palette.map((s) => (
                  <div
                    key={s.id}
                    className="h-10 md:h-12 border-r border-rule last:border-r-0"
                    style={{ backgroundColor: s.hex }}
                    title={s.hex}
                  />
                ))}
              </div>
            </div>

            {/* Technical panel */}
            <div className="lg:col-span-5">
              <div className="border border-rule bg-paper h-full">
                <div className="p-3 md:p-4 border-b border-rule">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-muted">
                    Extracted Values
                  </span>
                </div>
                <div className="divide-y divide-rule">
                  {heroSample.palette.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-3 md:p-4">
                      <div
                        className="w-8 h-8 border border-rule flex-shrink-0"
                        style={{ backgroundColor: s.hex }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs font-semibold text-ink">
                          {s.hex}
                        </div>
                        <div className="font-mono text-[10px] text-muted">
                          RGB({s.rgb.r}, {s.rgb.g}, {s.rgb.b})
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-muted">
                        {s.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: HOW IT WORKS
          layout.md §5: Three steps, one row desktop, stacked mobile
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        ref={stepsRef}
        className={`bg-paper border-b border-rule scroll-reveal-container ${
          isStepsRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6 md:mb-8 pt-2 md:pt-4">
            <div className="editorial-rule" aria-hidden="true" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-muted">
              How It Works
            </span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight mb-8 md:mb-12 max-w-2xl">
            Three steps to a functional
            <br className="hidden sm:block" />
            {' '}color system.
          </h2>

          {/* Three steps in a ruled grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-rule">
            {[
              {
                num: '01',
                title: 'Choose an image',
                desc: 'Drop your file or pick a sample. Pixels render to an offscreen canvas. No network upload occurs.',
              },
              {
                num: '02',
                title: 'Refine the palette',
                desc: 'Adjust HSL channels, reorder swatches, test contrast ratios against WCAG 2.2 AA/AAA, build gradients.',
              },
              {
                num: '03',
                title: 'Export your colors',
                desc: 'Generate CSS custom properties with RGB channels or DTCG-compliant JSON tokens ready for production.',
              },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="py-6 md:py-8 md:pr-8 border-b md:border-b-0 md:border-r border-rule last:border-r-0 last:border-b-0"
                style={{
                  transitionDelay: isStepsRevealed ? `${idx * 40}ms` : '0ms',
                }}
              >
                <div className="font-mono text-[10px] sm:text-xs font-bold text-signal-red uppercase tracking-widest mb-3">
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-lg md:text-xl text-ink mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: CURATED EXAMPLES
          layout.md (samples) — Show diverse imagery handling
          ═══════════════════════════════════════════════════════════ */}
      <section
        ref={presetsRef}
        className={`bg-white border-b border-rule scroll-reveal-container ${
          isPresetsRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content"
          style={{ padding: 'var(--page-gutter)' }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6 md:mb-8 pt-2 md:pt-4">
            <div className="editorial-rule" aria-hidden="true" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-muted">
              Curated Examples
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight max-w-xl">
              Tested against diverse imagery.
            </h2>
            <p className="font-body text-xs md:text-sm text-muted max-w-sm">
              Explore how Afterimage handles contrasting architectural forms, delicate organic textures, and natural landscape gradients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 pb-4 md:pb-8">
            {SAMPLE_IMAGES.map((sample, idx) => (
              <div
                key={sample.id}
                className="border border-rule bg-paper/30 flex flex-col group hover:border-ink transition-colors duration-fast"
                style={{
                  transitionDelay: isPresetsRevealed ? `${idx * 45}ms` : '0ms',
                }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-paper border-b border-rule overflow-hidden">
                  <img
                    src={sample.metadata.dataUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-standard"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-display font-bold text-base text-ink">{sample.title}</h3>
                    <span className="font-mono text-[10px] text-muted uppercase">{sample.category}</span>
                  </div>

                  {/* Swatches strip */}
                  <div className="grid grid-cols-6 gap-1 mb-4" role="list" aria-label={`${sample.title} palette`}>
                    {sample.palette.map((s) => (
                      <div
                        key={s.id}
                        role="listitem"
                        className="h-8 md:h-10 border border-rule tactile-swatch cursor-pointer"
                        style={{ backgroundColor: s.hex }}
                        title={s.hex}
                        onClick={() => onSelectSample(sample)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectSample(sample)}
                    className="tactile-press mt-auto w-full py-2.5 bg-white border border-rule hover:border-ink text-ink font-mono text-xs uppercase flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                  >
                    <span>Open in workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className={`bg-paper scroll-reveal-container ${
          isCtaRevealed ? 'is-revealed' : ''
        }`}
      >
        <div
          className="mx-auto max-w-content py-16 md:py-24"
          style={{ padding: 'var(--page-gutter)' }}
        >
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="editorial-rule mx-auto" aria-hidden="true" />

            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight">
              Bring an image.
              <br />
              Leave with a palette.
            </h2>

            <p className="font-body text-base text-muted leading-relaxed max-w-md mx-auto">
              Fast, client-side, and distraction-free. No account or installation required.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenWorkspace}
                className="tactile-press inline-flex items-center justify-center min-h-[52px] px-8 md:px-10 bg-ink text-white font-medium text-base border-2 border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Open workspace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER — layout.md §8
          ═══════════════════════════════════════════════════════════ */}
      <footer className="mt-auto border-t border-rule bg-white">
        <div
          className="mx-auto max-w-content py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted"
          style={{ padding: 'var(--page-gutter)' }}
        >
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-ink text-sm">AFTERIMAGE</span>
            <span className="border-l border-rule pl-2">Image-to-Color Palette Tool</span>
          </div>

          <span className="text-center sm:text-right">
            Image processing is local in your browser. No files leave your device.
          </span>
        </div>
      </footer>
    </div>
  );
};
