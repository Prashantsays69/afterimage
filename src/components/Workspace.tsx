import React, { useState, useEffect, useCallback } from 'react';
import { ColorSwatch, ImageMetadata } from '../types';
import { ImageCanvas } from './ImageCanvas';
import { PaletteStrip } from './PaletteStrip';
import { Inspector } from './Inspector';
import { ExportModal } from './ExportModal';
import { ShortcutsModal } from './ShortcutsModal';
import { SampleImage } from '../data/samples';
import { extractPaletteFromImage, validateImageFile } from '../utils/extractor';
import { createColorSwatch } from '../utils/color';

interface WorkspaceProps {
  initialSample?: SampleImage | null;
  onNavigateHome: () => void;
  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  initialSample = null,
  onNavigateHome,
  isExportOpen,
  setIsExportOpen,
  isShortcutsOpen,
  setIsShortcutsOpen,
}) => {
  const [imageMeta, setImageMeta] = useState<ImageMetadata | null>(initialSample?.metadata || null);
  const [palette, setPalette] = useState<ColorSwatch[]>(initialSample?.palette || []);
  const [selectedSwatchId, setSelectedSwatchId] = useState<string>(
    initialSample?.palette[0]?.id || ''
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if initial sample changes
  useEffect(() => {
    if (initialSample) {
      setImageMeta(initialSample.metadata);
      setPalette(initialSample.palette);
      setSelectedSwatchId(initialSample.palette[0]?.id || '');
      setErrorMessage(null);
    }
  }, [initialSample]);

  // Handle uploaded file
  const handleFileSelect = useCallback(async (file: File) => {
    setErrorMessage(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = objectUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image failed to decode. File may be corrupted.'));
      });

      const extractedSwatches = await extractPaletteFromImage(img, 6);

      const metadata: ImageMetadata = {
        name: file.name,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        size: file.size,
        aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height),
        dataUrl: objectUrl,
        file,
      };

      setImageMeta(metadata);
      setPalette(extractedSwatches);
      setSelectedSwatchId(extractedSwatches[0]?.id || '');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while processing the image.';
      setErrorMessage(msg);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Handle curated sample load
  const handleLoadSample = useCallback((sample: SampleImage) => {
    setErrorMessage(null);
    setImageMeta(sample.metadata);
    setPalette(sample.palette);
    setSelectedSwatchId(sample.palette[0]?.id || '');
  }, []);

  // Remove image
  const handleRemoveImage = useCallback(() => {
    if (imageMeta?.dataUrl && imageMeta.dataUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageMeta.dataUrl);
    }
    setImageMeta(null);
    setErrorMessage(null);
  }, [imageMeta]);

  // Re-extract palette from current image
  const handleRegenerate = useCallback(async () => {
    if (!imageMeta) return;
    setIsProcessing(true);
    try {
      const regenerated = await extractPaletteFromImage(imageMeta.dataUrl, palette.length || 6);
      setPalette(regenerated);
      setSelectedSwatchId(regenerated[0]?.id || '');
    } catch {
      setErrorMessage('Failed to re-extract palette.');
    } finally {
      setIsProcessing(false);
    }
  }, [imageMeta, palette.length]);

  // Swatch operations
  const handleSelectColor = useCallback((id: string) => {
    setSelectedSwatchId(id);
  }, []);

  const handleUpdateSwatch = useCallback((id: string, updated: Partial<ColorSwatch>) => {
    setPalette((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  }, []);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setPalette((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const handleAddColor = useCallback(() => {
    if (palette.length >= 10) return;
    // Derive a complementary or shifted color from existing
    const base = palette[palette.length - 1] || createColorSwatch('#151515');
    const newSwatch = createColorSwatch(
      base.hex,
      `swatch-custom-${Date.now()}`
    );
    // Shift hue by +30
    const shiftedH = (newSwatch.hsl.h + 30) % 360;
    newSwatch.hsl.h = shiftedH;

    setPalette((prev) => [...prev, newSwatch]);
    setSelectedSwatchId(newSwatch.id);
  }, [palette]);

  const handleRemoveColor = useCallback((id: string) => {
    if (palette.length <= 3) return;
    setPalette((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (selectedSwatchId === id) {
        setSelectedSwatchId(filtered[0]?.id || '');
      }
      return filtered;
    });
  }, [palette.length, selectedSwatchId]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(!isShortcutsOpen);
      } else if (e.key === 'Escape') {
        setIsExportOpen(false);
        setIsShortcutsOpen(false);
      } else if (e.key.toLowerCase() === 'e') {
        if (palette.length > 0) {
          e.preventDefault();
          setIsExportOpen(true);
        }
      } else if (e.key.toLowerCase() === 'o' || e.key.toLowerCase() === 'u') {
        e.preventDefault();
        const input = document.getElementById('image-file-input');
        input?.click();
      } else if (/^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        if (palette[index]) {
          e.preventDefault();
          setSelectedSwatchId(palette[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, palette, setIsExportOpen, setIsShortcutsOpen]);

  const selectedSwatch = palette.find((s) => s.id === selectedSwatchId) || null;

  return (
    <main className="min-h-[calc(100vh-72px)] bg-paper p-4 md:p-6 lg:p-8">
      <div className="max-w-content mx-auto">
        {/* Workspace Sub-header Breadcrumb */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-muted hover:text-ink transition-colors duration-fast"
            >
              Afterimage
            </button>
            <span className="text-rule">/</span>
            <span className="text-ink font-semibold">Workspace</span>
          </div>
          <span className="text-xs font-mono text-muted">
            {imageMeta ? `${imageMeta.name} (${palette.length} colors)` : 'Awaiting image input'}
          </span>
        </div>

        {/* 12-Column Canvas-First Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left/Center: Image Canvas & Palette Strip (7-8 columns) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <ImageCanvas
              imageMeta={imageMeta}
              isProcessing={isProcessing}
              onFileSelect={handleFileSelect}
              onLoadSample={handleLoadSample}
              onRemoveImage={handleRemoveImage}
              errorMessage={errorMessage}
            />

            {palette.length > 0 && (
              <PaletteStrip
                palette={palette}
                selectedId={selectedSwatchId}
                onSelectColor={handleSelectColor}
                onReorder={handleReorder}
                onAddColor={handleAddColor}
                onRemoveColor={handleRemoveColor}
                onRegenerate={handleRegenerate}
                isProcessing={isProcessing}
              />
            )}
          </div>

          {/* Right: Inspector Panel (4-5 columns) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Inspector
              palette={palette}
              selectedSwatch={selectedSwatch}
              onUpdateSwatch={handleUpdateSwatch}
            />
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        palette={palette}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </main>
  );
};
