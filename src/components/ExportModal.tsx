import React, { useState } from 'react';
import { ColorSwatch } from '../types';
import { generateCssVariables, generateJsonTokens, downloadFile } from '../utils/exporter';
import { useClipboard } from '../hooks/useClipboard';
import { X, Copy, Check, Download } from 'lucide-react';

interface ExportModalProps {
  palette: ColorSwatch[];
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ palette, isOpen, onClose }) => {
  const [format, setFormat] = useState<'css' | 'json'>('css');
  const { copiedText, copy } = useClipboard();

  if (!isOpen) return null;

  const content = format === 'css' ? generateCssVariables(palette) : generateJsonTokens(palette);
  const filename = format === 'css' ? 'afterimage-palette.css' : 'afterimage-tokens.json';
  const mimeType = format === 'css' ? 'text/css' : 'application/json';

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="animate-modal-enter bg-white border-2 border-ink w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-rule flex items-center justify-between bg-paper">
          <div>
            <h2 id="export-modal-title" className="font-display font-bold text-lg md:text-xl text-ink">
              Export Color Palette
            </h2>
            <p className="font-mono text-xs text-muted mt-0.5">
              Production-ready design tokens for web and apps
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tactile-press p-1.5 hover:bg-white text-ink border border-transparent hover:border-rule focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="px-5 py-3 border-b border-rule bg-white flex items-center justify-between">
          <div className="flex border border-rule" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={format === 'css'}
              onClick={() => setFormat('css')}
              className={`tactile-press px-4 py-2 text-xs font-mono uppercase font-semibold ${
                format === 'css' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-white'
              }`}
            >
              CSS Variables
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={format === 'json'}
              onClick={() => setFormat('json')}
              className={`tactile-press px-4 py-2 text-xs font-mono uppercase font-semibold border-l border-rule ${
                format === 'json' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-white'
              }`}
            >
              JSON Design Tokens
            </button>
          </div>

          <span className="font-mono text-xs text-muted">
            {palette.length} colors
          </span>
        </div>

        {/* Code Output */}
        <div className="p-5 flex-1 overflow-auto">
          <textarea
            readOnly
            value={content}
            rows={12}
            className="w-full p-4 bg-paper border border-rule font-mono text-xs text-ink focus:outline-none resize-none leading-relaxed select-all"
            aria-label="Exported code"
          />
        </div>

        {/* Actions Footer */}
        <div className="p-4 md:p-5 border-t border-rule bg-paper flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="tactile-press px-4 py-2 text-xs font-mono uppercase border border-rule bg-white hover:border-ink"
          >
            Cancel
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => copy(content, 'MODAL_EXPORT')}
              className="tactile-press px-4 py-2 bg-white border border-rule hover:border-ink text-ink text-xs font-mono flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            >
              {copiedText === 'MODAL_EXPORT' ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => downloadFile(content, filename, mimeType)}
              className="tactile-press px-4 py-2 bg-ink text-white border border-ink hover:bg-signal-red hover:border-signal-red text-xs font-mono flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
