import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '?', description: 'Toggle this keyboard shortcuts dialog' },
    { key: 'O / U', description: 'Upload / replace image file' },
    { key: 'E', description: 'Open Export dialog (when palette is active)' },
    { key: '1 - 9', description: 'Select color swatch 1 through 9' },
    { key: 'Esc', description: 'Close any active modal or dialog' },
    { key: 'Tab', description: 'Navigate through interactive controls' },
    { key: 'Enter / Space', description: 'Activate focused button or swatch' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="animate-modal-enter bg-white border-2 border-ink w-full max-w-md shadow-2xl">
        <div className="p-4 md:p-5 border-b border-rule flex items-center justify-between bg-paper">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-ink" />
            <h2 id="shortcuts-title" className="font-display font-bold text-lg text-ink">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tactile-press p-1 hover:bg-white text-ink border border-transparent hover:border-rule focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            aria-label="Close shortcuts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 divide-y divide-rule">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs font-mono first:pt-0 last:pb-0">
              <span className="text-muted">{sc.description}</span>
              <kbd className="px-2 py-1 bg-paper border border-rule font-bold text-ink text-[11px] min-w-[28px] text-center shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 bg-paper border-t border-rule text-right">
          <button
            type="button"
            onClick={onClose}
            className="tactile-press px-4 py-2 bg-ink text-white font-mono text-xs uppercase hover:bg-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
