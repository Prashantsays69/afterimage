import React from 'react';
import { ColorSwatch } from '../types';
import { Copy, Check, ChevronLeft, ChevronRight, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

interface PaletteStripProps {
  palette: ColorSwatch[];
  selectedId: string;
  onSelectColor: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onAddColor: () => void;
  onRemoveColor: (id: string) => void;
  onRegenerate: () => void;
  isProcessing?: boolean;
}

export const PaletteStrip: React.FC<PaletteStripProps> = ({
  palette,
  selectedId,
  onSelectColor,
  onReorder,
  onAddColor,
  onRemoveColor,
  onRegenerate,
  isProcessing = false,
}) => {
  const { copiedText, copy } = useClipboard();

  const handleCopyAll = () => {
    const allHex = palette.map((s) => s.hex).join(', ');
    copy(allHex, 'ALL');
  };

  const selectedIndex = palette.findIndex((s) => s.id === selectedId);

  return (
    <section className="bg-white border border-rule mt-4 p-4 md:p-6" aria-label="Extracted color palette">
      {/* Palette Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-rule">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-semibold text-base md:text-lg text-ink">
            Palette ({palette.length})
          </h2>
          <span className="font-mono text-xs text-muted">
            {selectedIndex >= 0 ? `Selected #${selectedIndex + 1}` : 'Select a swatch'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Reorder controls for keyboard accessibility */}
          <div className="flex items-center border border-rule" role="group" aria-label="Swatch order controls">
            <button
              type="button"
              onClick={() => selectedIndex > 0 && onReorder(selectedIndex, selectedIndex - 1)}
              disabled={selectedIndex <= 0}
              className="tactile-press p-1.5 hover:bg-paper disabled:opacity-30 disabled:hover:bg-transparent text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric-blue"
              title="Move selected color left"
              aria-label="Move selected color left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1.5 text-muted border-x border-rule select-none">Order</span>
            <button
              type="button"
              onClick={() => selectedIndex < palette.length - 1 && onReorder(selectedIndex, selectedIndex + 1)}
              disabled={selectedIndex < 0 || selectedIndex >= palette.length - 1}
              className="tactile-press p-1.5 hover:bg-paper disabled:opacity-30 disabled:hover:bg-transparent text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric-blue"
              title="Move selected color right"
              aria-label="Move selected color right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Add color button */}
          <button
            type="button"
            onClick={onAddColor}
            disabled={palette.length >= 10}
            className="tactile-press inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-rule hover:border-ink disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            title={palette.length >= 10 ? 'Maximum 10 colors reached' : 'Add custom swatch'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          {/* Remove selected color */}
          <button
            type="button"
            onClick={() => selectedId && onRemoveColor(selectedId)}
            disabled={palette.length <= 3}
            className="tactile-press inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-rule hover:border-error hover:text-error disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
            title={palette.length <= 3 ? 'Minimum 3 colors required' : 'Remove selected color'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          {/* Regenerate from image */}
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isProcessing}
            className="tactile-press inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase bg-white border border-rule hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            title="Re-extract colors from active image"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Re-extract</span>
          </button>

          {/* Copy all */}
          <button
            type="button"
            onClick={handleCopyAll}
            className="tactile-press inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase bg-ink text-white border border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
          >
            {copiedText === 'ALL' ? (
              <>
                <Check className="w-3.5 h-3.5 text-acid-lime" />
                <span>Copied All</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Swatches Grid / Strip */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 overflow-x-auto pb-1"
        role="listbox"
        aria-label="Palette swatches"
      >
        {palette.map((swatch, index) => {
          const isSelected = swatch.id === selectedId;
          const isCopied = copiedText === swatch.hex;

          return (
            <div
              key={swatch.id}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => onSelectColor(swatch.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectColor(swatch.id);
                }
              }}
              className={`group relative flex flex-col cursor-pointer border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue tactile-swatch ${
                isSelected
                  ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-white'
                  : 'border-rule hover:border-ink'
              }`}
            >
              {/* Color Box */}
              <div
                className="h-20 sm:h-24 md:h-28 w-full relative flex items-start justify-end p-2 transition-colors duration-fast"
                style={{ backgroundColor: swatch.hex }}
              >
                {/* Non-color Selected Indicator */}
                {isSelected && (
                  <div className="bg-ink text-white text-[10px] font-mono px-1.5 py-0.5 tracking-widest uppercase border border-white shadow-sm">
                    ACTIVE
                  </div>
                )}
              </div>

              {/* Swatch Details */}
              <div className="p-2.5 bg-paper flex items-center justify-between border-t border-rule group-hover:bg-white transition-colors duration-fast">
                <div>
                  <div className="font-mono text-xs font-semibold text-ink tracking-wider">
                    {swatch.hex}
                  </div>
                  <div className="font-mono text-[10px] text-muted">
                    {swatch.percentage ? `${swatch.percentage}%` : `#${index + 1}`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(swatch.hex);
                  }}
                  className="tactile-press p-1 hover:bg-white text-muted hover:text-ink border border-transparent hover:border-rule focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric-blue"
                  aria-label={`Copy color ${swatch.hex}`}
                  title="Copy HEX"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
