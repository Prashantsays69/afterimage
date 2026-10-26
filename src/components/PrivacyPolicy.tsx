import React from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigateHome: () => void;
  onOpenWorkspace: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
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
            <span className="text-ink font-bold uppercase">Privacy Policy</span>
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
              <ShieldCheck className="w-4 h-4 text-signal-red" aria-hidden="true" />
              <span>LEGAL SPECIFICATION // 01</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <p className="font-body text-sm sm:text-base text-ink/75 mt-3 leading-relaxed">
              Afterimage is an offline-capable, client-side color extraction instrument. We believe software should respect user sovereignty by not harvesting personal data.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 font-body text-sm text-ink/80 leading-relaxed">
            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 1.0</span>
                <span>Zero Server Uploads & Network Transmission</span>
              </h2>
              <p>
                All image processing, pixel decomposition, spatial sampling, and color quantization occur exclusively within your local browser runtime. When you select or drop an image into Afterimage, the file is never uploaded to any remote server, third-party backend, or cloud storage bucket.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 2.0</span>
                <span>In-Memory Browser Canvas Execution</span>
              </h2>
              <p>
                Images are read using native browser APIs (<code className="font-mono text-xs bg-paper px-1 py-0.5 border border-rule">URL.createObjectURL</code> and HTML5 <code className="font-mono text-xs bg-paper px-1 py-0.5 border border-rule">&lt;canvas&gt;</code> 2D context). Median-cut octree quantization and WCAG 2.2 contrast calculations run in ephemeral client-side memory.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 3.0</span>
                <span>No Cookies, Trackers, or Analytics</span>
              </h2>
              <p className="mb-3">
                Afterimage contains:
              </p>
              <ul className="space-y-1.5 pl-2 font-mono text-xs">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  <span>Zero advertising or tracking cookies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  <span>Zero third-party analytics scripts (no Google Analytics, Mixpanel, or Meta Pixels)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  <span>Zero user tracking beacons or fingerprinting libraries</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 4.0</span>
                <span>Volatile Session Storage</span>
              </h2>
              <p>
                The application does not persist your uploaded images to <code className="font-mono text-xs bg-paper px-1 py-0.5 border border-rule">localStorage</code> or <code className="font-mono text-xs bg-paper px-1 py-0.5 border border-rule">indexedDB</code>. When you click &ldquo;Remove Image&rdquo;, switch specimens, or close the browser tab, the temporary blob URL is revoked (<code className="font-mono text-xs bg-paper px-1 py-0.5 border border-rule">URL.revokeObjectURL</code>) and in-memory pixel buffers are garbage-collected by your browser engine.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 5.0</span>
                <span>Direct Client-Side Token Exports</span>
              </h2>
              <p>
                CSS custom properties and W3C DTCG design token files are generated dynamically in-memory and downloaded straight to your file system through the browser’s standard download prompt. No records or copies of exported tokens are retained anywhere.
              </p>
            </section>

            <section>
              <h2 className="font-display font-bold text-lg text-ink mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-signal-red font-bold">§ 6.0</span>
                <span>External Typography Fonts</span>
              </h2>
              <p>
                The application loads typography assets directly from Google Fonts (<code className="font-mono text-xs bg-paper px-1 py-0.5 border border-rule">fonts.googleapis.com</code>) to display IBM Plex Mono, Inter, and Space Grotesk. Standard HTTP requests for font CSS and woff2 files are subject to Google’s standard font delivery privacy practices.
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
