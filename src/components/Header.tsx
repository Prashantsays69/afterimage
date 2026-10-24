import React from 'react';
import { Download, Upload, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentView: 'landing' | 'workspace';
  onNavigate: (view: 'landing' | 'workspace') => void;
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
      className="h-[52px] md:h-[60px] bg-paper border-b border-rule sticky top-0 z-40 transition-colors duration-fast"
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
            {/* Geometric color mark */}
            <div className="w-5 h-5 grid grid-cols-2 grid-rows-2 border border-ink bg-ink flex-shrink-0">
              <span className="bg-paper" />
              <span className="bg-signal-red" />
              <span className="bg-electric-blue" />
              <span className="bg-acid-lime" />
            </div>
            <span className="font-display font-bold text-lg md:text-xl tracking-tight text-ink group-hover:text-signal-red transition-colors duration-fast">
              AFTERIMAGE
            </span>
          </button>

          {currentView === 'workspace' && (
            <div className="flex items-center gap-2 pl-3 border-l border-rule">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted px-2 py-0.5 border border-rule bg-white">
                Workspace
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
                className="hidden sm:inline-flex text-sm font-medium text-ink hover:text-signal-red px-3 py-2 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              >
                How it works
              </a>
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                className="tactile-press inline-flex items-center justify-center min-h-[40px] px-4 md:px-5 bg-ink text-white font-medium text-sm border border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Extract a palette
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="tactile-press hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase text-muted hover:text-ink px-2.5 py-1.5 border border-transparent hover:border-rule focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                title="Return to overview"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={onNewImage}
                className="tactile-press inline-flex items-center gap-2 min-h-[36px] px-3 md:px-4 bg-white text-ink text-xs md:text-sm font-medium border border-rule hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                aria-label="Upload new image"
              >
                <Upload className="w-4 h-4 text-ink" aria-hidden="true" />
                <span className="hidden sm:inline">New image</span>
              </button>

              <button
                type="button"
                onClick={onOpenExport}
                disabled={!hasPalette}
                className="tactile-press inline-flex items-center gap-2 min-h-[36px] px-3 md:px-4 bg-ink text-white text-xs md:text-sm font-medium border border-ink hover:bg-signal-red hover:border-signal-red disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                aria-label="Export palette"
                title={!hasPalette ? 'Load an image or palette first' : 'Export CSS or JSON tokens'}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={onOpenShortcuts}
                className="tactile-press hidden md:inline-flex items-center justify-center w-9 h-9 border border-rule bg-white text-muted hover:text-ink hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue font-mono text-xs font-bold"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
              >
                ?
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
