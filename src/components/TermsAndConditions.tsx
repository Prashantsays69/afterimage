import React from 'react';
import { ArrowLeft, Scale, CheckCircle2 } from 'lucide-react';

interface TermsAndConditionsProps {
  onNavigateHome: () => void;
  onOpenWorkspace: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onNavigateHome,
  onOpenWorkspace,
}) => {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b-2 border-ink bg-white">
        <div
          className="mx-auto max-w-content py-4 flex items-center justify-between font-mono text-xs"
          style={{ padding: 'var(--page-gutter)' }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-muted hover:text-ink font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Overview</span>
            </button>
            <span className="text-rule">/</span>
            <span className="text-muted uppercase">Legal</span>
            <span className="text-rule">/</span>
            <span className="text-ink font-bold uppercase">Terms & Conditions</span>
          </div>

          <span className="hidden sm:inline font-mono text-[11px] text-muted uppercase tracking-wider">
            Effective Date: October 2026
          </span>
        </div>
      </div>

      {/* Main Document Content */}
      <div
        className="mx-auto max-w-content py-12 sm:py-16 flex-1 w-full"
        style={{ padding: 'var(--page-gutter)' }}
      >
        <div className="max-w-3xl border-2 border-ink bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
          {/* Header */}
          <div className="border-b-2 border-ink pb-6 mb-8">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal-red font-bold mb-2">
              <Scale className="w-4 h-4 text-signal-red" aria-hidden="true" />
              <span>LEGAL SPECIFICATION // 02</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-tight">
              Terms & Conditions
            </h1>
            <p className="font-body text-sm sm:text-base text-ink/75 mt-3 leading-relaxed">
              Clear, transparent operational terms governing the usage of Afterimage and the ownership of design tokens generated with the instrument.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8 font-body text-sm text-ink/80 leading-relaxed">
            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 1.0</span>
                <span>Instrument Purpose & Open Utility</span>
              </h2>
              <p>
                Afterimage is an open browser-based utility developed to help designers, engineers, and creatives extract proportional color palettes from imagery, audit WCAG 2.2 contrast compliance, and generate production-ready design tokens.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 2.0</span>
                <span>Token Ownership & Commercial Rights</span>
              </h2>
              <p className="mb-2">
                You retain complete, exclusive, and unencumbered ownership of all color palettes, CSS variables, and W3C DTCG token definitions generated using Afterimage.
              </p>
              <div className="p-3 bg-paper/60 border border-ink/20 font-mono text-xs space-y-1">
                <div className="flex items-center gap-2 text-ink font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  <span>Free for personal, commercial, open-source, and enterprise projects</span>
                </div>
                <div className="flex items-center gap-2 text-ink font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  <span>Zero royalties, licensing fees, or attribution requirements on exported code</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 3.0</span>
                <span>User Responsibility for Source Imagery</span>
              </h2>
              <p>
                Because all image processing happens strictly on your local machine, Afterimage does not monitor, inspect, or filter uploaded imagery. You are solely responsible for ensuring you have appropriate rights, licenses, or fair-use permissions for any source imagery loaded into the tool.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 4.0</span>
                <span>Contrast Calculations & &ldquo;As Is&rdquo; Disclaimer</span>
              </h2>
              <p>
                WCAG 2.2 contrast calculations (AA 4.5:1, AAA 7.0:1) and HSL/RGB channel transformations are provided for design evaluation guidance. While calculations adhere to official W3C color formulas, Afterimage provides this tool &ldquo;as is&rdquo; without warranty of mathematical or production perfection. You should independently verify accessibility across your target display devices and UI components.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 5.0</span>
                <span>No Account Requirements</span>
              </h2>
              <p>
                Afterimage operates without user accounts, authentication credentials, or subscriptions. You are not required to provide personal identity details, email addresses, or payment information.
              </p>
            </section>
          </div>

          {/* Action Row */}
          <div className="pt-8 mt-10 border-t-2 border-ink flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={onNavigateHome}
              className="tactile-press w-full sm:w-auto py-2.5 px-4 bg-paper hover:bg-white text-ink border border-ink uppercase tracking-wider font-semibold"
            >
              ← Back to Overview
            </button>
            <button
              type="button"
              onClick={onOpenWorkspace}
              className="tactile-press w-full sm:w-auto py-2.5 px-5 bg-ink hover:bg-signal-red text-white border border-ink uppercase tracking-wider font-bold transition-colors"
            >
              Launch Workspace →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
