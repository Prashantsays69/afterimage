import React from 'react';
import { Download, Upload, ArrowLeft } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentView: 'landing' | 'workspace' | 'privacy' | 'terms';
  onNavigate: (view: 'landing' | 'workspace' | 'privacy' | 'terms') => void;
  onNewImage?: () => void;
  onOpenExport?: () => void;
  onOpenShortcuts?: () => void;
  hasPalette?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onNewImage,
  onOpenExport,
  onOpenShortcuts,
  hasPalette = false,
}) => {
  return (
    <header
      className="h-[52px] md:h-[60px] editorial-header sticky top-0 z-50 transition-colors duration-fast"
      style={{ padding: '0 var(--page-gutter)' }}
    >
      <div className="max-w-content mx-auto h-full flex items-center justify-between">
        {/* Left: Wordmark — layout.md §2 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper p-1 -m-1"
            aria-label="Afterimage home"
          >
            <BrandLogo size={22} showWordmark={true} className="group-hover:opacity-90" />
          </button>

          {currentView === 'workspace' && (
            <div className="flex items-center gap-2 pl-3 border-l-2 border-ink/20">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-ink px-2 py-0.5 border-2 border-ink bg-white">
                Workspace
              </span>
            </div>
          )}

          {(currentView === 'privacy' || currentView === 'terms') && (
            <div className="flex items-center gap-2 pl-3 border-l-2 border-ink/20">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-ink px-2 py-0.5 border-2 border-ink bg-white">
                {currentView === 'privacy' ? 'Legal // Privacy' : 'Legal // Terms'}
              </span>
            </div>
          )}
        </div>

        {/* Right Navigation Controls — layout.md §2 */}
        <nav className="flex items-center gap-2 md:gap-3" aria-label="Main Navigation">
          {currentView === 'landing' ? (
            <>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  const target = document.getElementById('how-it-works');
                  if (target) {
                    e.preventDefault();
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                  }
                }}
                className="hidden sm:inline-flex text-xs font-mono font-bold uppercase tracking-wider text-ink hover:text-signal-red px-3 py-2 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              >
                How it works
              </a>
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                className="tactile-press inline-flex items-center justify-center min-h-[40px] px-4 md:px-5 bg-ink text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              >
                Extract a palette
              </button>
            </>
          ) : currentView === 'workspace' ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="tactile-press hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-ink hover:text-signal-red px-2.5 py-1.5 border-2 border-transparent hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
                title="Return to overview"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={onNewImage}
                className="tactile-press inline-flex items-center gap-2 min-h-[36px] px-3 md:px-4 bg-white text-ink text-xs font-mono font-bold uppercase border-2 border-ink hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
                aria-label="Upload new image"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">New image</span>
              </button>

              <button
                type="button"
                onClick={onOpenExport}
                disabled={!hasPalette}
                className="tactile-press inline-flex items-center gap-2 min-h-[36px] px-3 md:px-4 bg-ink text-white text-xs font-mono font-bold uppercase border-2 border-ink hover:bg-signal-red hover:border-signal-red disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
                aria-label="Export palette"
                title={!hasPalette ? 'Load an image or palette first' : 'Export CSS or JSON tokens'}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={onOpenShortcuts}
                className="tactile-press hidden md:inline-flex items-center justify-center w-9 h-9 border-2 border-ink bg-white text-ink hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue font-mono text-xs font-bold transition-colors"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
              >
                ?
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="tactile-press inline-flex items-center gap-1.5 text-xs font-mono uppercase text-ink hover:text-signal-red px-2.5 py-1.5 border border-rule hover:border-ink bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                title="Return to overview"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Overview</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                className="tactile-press inline-flex items-center justify-center min-h-[36px] px-4 bg-ink text-white font-medium text-xs md:text-sm border border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              >
                Launch Workspace
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
