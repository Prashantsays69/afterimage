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
    <div className="bg-white border-2 border-ink relative overflow-hidden" aria-label="Image Workspace Canvas">
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
        <div className="flex flex-col">
          {/* Architectural Bench Masthead */}
          <div className="px-4 py-2.5 bg-paper border-b-2 border-ink flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
              <span>INSTRUMENT // CALIBRATION BENCH</span>
            </span>
            <span className="text-muted text-[10px] uppercase font-bold tracking-wider">AWAITING IMAGE INPUT</span>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[380px] md:min-h-[440px] m-4 sm:m-6 p-6 md:p-10 flex flex-col items-center justify-center text-center relative transition-colors duration-fast ${
              isDragOver ? 'bg-acid-lime/20 border-2 border-ink' : 'bg-paper/30 border-2 border-ink'
            }`}
          >
            {/* Registration crosshairs on bench corners */}
            <div className="absolute top-2 left-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>
            <div className="absolute top-2 right-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>
            <div className="absolute bottom-2 left-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>
            <div className="absolute bottom-2 right-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>

            <div className="w-14 h-14 border-2 border-ink bg-white flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-ink" />
            </div>

            <h2 className="font-display font-black text-2xl md:text-3xl text-ink tracking-tight mb-2">
              Drop an image here
            </h2>
            <p className="font-body text-xs sm:text-sm text-ink/75 max-w-md mb-6 leading-relaxed">
              Drag and drop an image or use the file picker. Processed entirely in your browser; no files ever leave your
              computer.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="tactile-press inline-flex items-center justify-center min-h-[44px] px-6 bg-ink text-white font-mono text-xs uppercase tracking-wider font-bold border-2 border-ink hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
            >
              Choose image file
            </button>

            <div className="font-mono text-[11px] text-muted mt-3">
              Supported: JPEG, PNG, WebP, GIF, SVG (up to 15MB)
            </div>

            {/* Curated Sample Images Quick Load */}
            <div className="mt-8 pt-5 border-t-2 border-ink/20 w-full max-w-lg">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted font-bold mb-3">Or explore curated samples:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => onLoadSample(sample)}
                    className="tactile-press px-3 py-2 bg-white border-2 border-ink hover:bg-ink hover:text-white group text-xs font-mono text-ink text-left flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
                  >
                    <span className="font-bold truncate">{sample.title}</span>
                    <span className="text-[10px] text-muted group-hover:text-acid-lime transition-colors">{sample.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Canvas */
        <div className="flex flex-col">
          {/* Metadata & Actions Bar */}
          <div className="px-4 py-2.5 bg-paper border-b-2 border-ink flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-ink truncate max-w-[200px] md:max-w-xs flex items-center gap-1.5">
                <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
                {imageMeta.name}
              </span>
              <span className="font-mono text-[11px] text-muted border-l-2 border-ink/20 pl-3">
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
                className="tactile-press px-3 py-1.5 text-xs font-mono font-bold uppercase bg-white border-2 border-ink hover:bg-ink hover:text-white text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric-blue transition-colors"
                title="Replace with another image"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemoveImage}
                className="tactile-press p-1.5 bg-white hover:bg-error hover:text-white text-ink border-2 border-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-error transition-colors"
                title="Remove image"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Actual Image Render Container */}
          <div className="relative min-h-[260px] sm:min-h-[320px] md:min-h-[420px] max-h-[480px] bg-paper/60 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
            {/* Registration crosshairs on bench corners */}
            <div className="absolute top-2 left-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>
            <div className="absolute top-2 right-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>
            <div className="absolute bottom-2 left-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>
            <div className="absolute bottom-2 right-2 font-mono text-xs text-ink/30 select-none pointer-events-none" aria-hidden="true">+</div>

            <img
              src={imageMeta.dataUrl}
              alt={imageMeta.name}
              className="max-h-[240px] sm:max-h-[300px] md:max-h-[400px] max-w-full object-contain border-2 border-ink bg-white shadow-none transition-opacity duration-fast"
            />

            {/* Processing Overlay if currently extracting */}
            {isProcessing && (
              <div
                className="absolute inset-0 bg-paper/90 border-2 border-ink flex flex-col items-center justify-center gap-2 z-10 transition-opacity duration-fast"
                role="alert"
                aria-busy="true"
              >
                <RefreshCw className="w-6 h-6 animate-spin text-ink" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
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
