import React, { useRef, useState } from 'react';
import { ImageMetadata } from '../types';
import { SAMPLE_IMAGES, SampleImage } from '../data/samples';
import { Upload, RefreshCw, X, AlertCircle } from 'lucide-react';

interface ImageCanvasProps {
  imageMeta: ImageMetadata | null;
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
  onLoadSample: (sample: SampleImage) => void;
  onRemoveImage: () => void;
  errorMessage: string | null;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
  imageMeta,
  isProcessing,
  onFileSelect,
  onLoadSample,
  onRemoveImage,
  errorMessage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-rule relative overflow-hidden" aria-label="Image Workspace Canvas">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
        onChange={handleInputChange}
        className="sr-only"
        id="image-file-input"
        aria-label="Upload image file"
      />

      {/* Accessible Live Announcement Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {isProcessing
          ? 'Extracting dominant colors from image, please wait.'
          : imageMeta
          ? `Loaded image ${imageMeta.name}`
          : 'No image loaded'}
      </div>

      {/* When no image is loaded -> Dropzone Empty State */}
      {!imageMeta ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`min-h-[420px] md:min-h-[500px] p-6 md:p-12 flex flex-col items-center justify-center text-center transition-colors duration-fast ${
            isDragOver ? 'bg-acid-lime/20 border-2 border-ink' : 'bg-paper/40 border-2 border-dashed border-rule'
          }`}
        >
          <div className="w-16 h-16 border border-ink bg-white flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-ink" />
          </div>

          <h2 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-2">
            Drop an image here
          </h2>
          <p className="font-body text-sm text-muted max-w-md mb-6 leading-relaxed">
            Drag and drop an image or use the file picker. Processed entirely in your browser; no files ever leave your
            computer.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="tactile-press inline-flex items-center justify-center min-h-[44px] px-6 bg-ink text-white font-medium text-sm border border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
          >
            Choose image file
          </button>

          <div className="font-mono text-xs text-muted mt-4">
            Supported: JPEG, PNG, WebP, GIF, SVG (up to 15MB)
          </div>

          {/* Curated Sample Images Quick Load */}
          <div className="mt-8 pt-6 border-t border-rule w-full max-w-lg">
            <span className="block font-mono text-xs uppercase text-muted mb-3">Or explore curated samples:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onLoadSample(sample)}
                  className="tactile-press px-3 py-2 bg-white border border-rule hover:border-ink text-xs font-mono text-ink text-left flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                >
                  <span className="font-semibold truncate">{sample.title}</span>
                  <span className="text-[10px] text-muted">{sample.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Canvas */
        <div className="flex flex-col">
          {/* Metadata & Actions Bar */}
          <div className="px-4 py-2.5 bg-paper border-b border-rule flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-ink truncate max-w-[200px] md:max-w-xs">
                {imageMeta.name}
              </span>
              <span className="font-mono text-[11px] text-muted border-l border-rule pl-3">
                {imageMeta.width} × {imageMeta.height} px
              </span>
              <span className="font-mono text-[11px] text-muted hidden sm:inline">
                {(imageMeta.size / 1024).toFixed(0)} KB
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="tactile-press px-2.5 py-1 text-xs font-mono uppercase bg-white border border-rule hover:border-ink text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric-blue"
                title="Replace with another image"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemoveImage}
                className="tactile-press p-1 hover:bg-white text-muted hover:text-error border border-transparent hover:border-rule focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-error"
                title="Remove image"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actual Image Render Container */}
          <div className="relative min-h-[360px] md:min-h-[460px] max-h-[580px] bg-paper/60 flex items-center justify-center p-4">
            <img
              src={imageMeta.dataUrl}
              alt={imageMeta.name}
              className="max-h-[520px] max-w-full object-contain border border-rule shadow-sm transition-opacity duration-fast"
            />

            {/* Processing Overlay if currently extracting */}
            {isProcessing && (
              <div
                className="absolute inset-0 bg-paper/85 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10 transition-opacity duration-fast"
                role="alert"
                aria-busy="true"
              >
                <RefreshCw className="w-6 h-6 animate-spin text-ink" />
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-ink">
                  Processing image…
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message Toast/Alert */}
      {errorMessage && (
        <div
          className="m-4 p-3 bg-white border border-error text-error text-xs font-mono flex items-start gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Error: </span>
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};
