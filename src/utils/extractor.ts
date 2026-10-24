import { ColorSwatch } from '../types';
import { createColorSwatch, rgbToHex } from './color';

interface ColorBox {
  rMin: number;
  rMax: number;
  gMin: number;
  gMax: number;
  bMin: number;
  bMax: number;
  pixels: Uint8ClampedArray;
  indices: number[];
}

/**
 * Validates image file type and size.
 * Max default: 15MB.
 */
export function validateImageFile(file: File, maxSizeBytes: number = 15 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/svg+xml',
    'image/bmp',
  ];

  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload JPEG, PNG, WebP, GIF, or SVG.`,
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds the ${sizeMb}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { valid: true };
}

/**
 * Loads an HTMLImageElement safely from a data URL or blob URL.
 */
export function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image data. The file might be corrupted.'));
    img.src = url;
  });
}

/**
 * Extracts dominant color palette from an image using Median-Cut quantization.
 * Completely local, zero network requests, handles alpha channels.
 */
export async function extractPaletteFromImage(
  imageSource: HTMLImageElement | string,
  colorCount: number = 6
): Promise<ColorSwatch[]> {
  const targetCount = Math.max(3, Math.min(10, colorCount));
  const img = typeof imageSource === 'string' ? await loadImageElement(imageSource) : imageSource;

  // Scale down to max 250px on longest side for fast, representative sampling
  const maxDim = 250;
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width === 0 || height === 0) {
    width = 100;
    height = 100;
  }

  const scale = Math.min(1, maxDim / Math.max(width, height));
  const sampleWidth = Math.max(1, Math.floor(width * scale));
  const sampleHeight = Math.max(1, Math.floor(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    // Fallback if canvas context fails
    return getFallbackPalette(targetCount);
  }

  ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
  const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imageData.data;

  // Collect valid (non-transparent) pixel indices
  const validIndices: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a >= 128) {
      validIndices.push(i);
    }
  }

  if (validIndices.length === 0) {
    return getFallbackPalette(targetCount);
  }

  // Median Cut algorithm
  const boxes: ColorBox[] = [createBox(data, validIndices)];

  while (boxes.length < targetCount) {
    // Find the box with greatest range to split
    let bestBoxIndex = -1;
    let maxRange = -1;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      if (box.indices.length < 2) continue;

      const rRange = box.rMax - box.rMin;
      const gRange = box.gMax - box.gMin;
      const bRange = box.bMax - box.bMin;
      const range = Math.max(rRange, gRange, bRange);

      if (range > maxRange) {
        maxRange = range;
        bestBoxIndex = i;
      }
    }

    if (bestBoxIndex === -1 || maxRange <= 5) {
      break; // No boxes have enough range to split
    }

    const boxToSplit = boxes.splice(bestBoxIndex, 1)[0];
    const [box1, box2] = splitBox(boxToSplit);
    boxes.push(box1, box2);
  }

  // Calculate average color and weight for each box
  const totalValidPixels = validIndices.length;
  const swatches: ColorSwatch[] = [];

  for (let b = 0; b < boxes.length; b++) {
    const box = boxes[b];
    if (box.indices.length === 0) continue;

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;

    for (let i = 0; i < box.indices.length; i++) {
      const idx = box.indices[i];
      totalR += data[idx];
      totalG += data[idx + 1];
      totalB += data[idx + 2];
    }

    const count = box.indices.length;
    const avgR = Math.round(totalR / count);
    const avgG = Math.round(totalG / count);
    const avgB = Math.round(totalB / count);

    const hex = rgbToHex(avgR, avgG, avgB);
    const pct = Math.round((count / totalValidPixels) * 100);

    swatches.push(createColorSwatch(hex, `swatch-${b + 1}`, pct));
  }

  // Deduplicate very similar swatches (distance < 15 in RGB space)
  const uniqueSwatches: ColorSwatch[] = [];
  for (const s of swatches) {
    const isDuplicate = uniqueSwatches.some((existing) => {
      const dr = s.rgb.r - existing.rgb.r;
      const dg = s.rgb.g - existing.rgb.g;
      const db = s.rgb.b - existing.rgb.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < 16;
    });

    if (!isDuplicate) {
      uniqueSwatches.push(s);
    }
  }

  // Fill up if deduplication reduced below target and original had more
  if (uniqueSwatches.length < targetCount && swatches.length > uniqueSwatches.length) {
    for (const s of swatches) {
      if (!uniqueSwatches.find((u) => u.hex === s.hex)) {
        uniqueSwatches.push(s);
        if (uniqueSwatches.length >= targetCount) break;
      }
    }
  }

  // Sort by visual interest/prominence (percentage descending, or balanced distribution)
  uniqueSwatches.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

  return uniqueSwatches.slice(0, targetCount);
}

function createBox(data: Uint8ClampedArray, indices: number[]): ColorBox {
  let rMin = 255,
    rMax = 0,
    gMin = 255,
    gMax = 0,
    bMin = 255,
    bMax = 0;

  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    if (r < rMin) rMin = r;
    if (r > rMax) rMax = r;
    if (g < gMin) gMin = g;
    if (g > gMax) gMax = g;
    if (b < bMin) bMin = b;
    if (b > bMax) bMax = b;
  }

  return { rMin, rMax, gMin, gMax, bMin, bMax, pixels: data, indices };
}

function splitBox(box: ColorBox): [ColorBox, ColorBox] {
  const rRange = box.rMax - box.rMin;
  const gRange = box.gMax - box.gMin;
  const bRange = box.bMax - box.bMin;

  let splitChannel = 0; // 0 = R, 1 = G, 2 = B
  if (gRange >= rRange && gRange >= bRange) {
    splitChannel = 1;
  } else if (bRange >= rRange && bRange >= gRange) {
    splitChannel = 2;
  }

  const data = box.pixels;
  const sortedIndices = [...box.indices].sort((a, b) => {
    return data[a + splitChannel] - data[b + splitChannel];
  });

  const mid = Math.floor(sortedIndices.length / 2);
  const part1 = sortedIndices.slice(0, mid);
  const part2 = sortedIndices.slice(mid);

  return [createBox(data, part1), createBox(data, part2)];
}

/**
 * High-quality fallback palette when image has no discernible pixels or canvas is disabled.
 */
function getFallbackPalette(count: number): ColorSwatch[] {
  const defaults = ['#151515', '#2457FF', '#FF593D', '#D7FF3F', '#77766F', '#F2EFE8', '#176B45', '#B42318'];
  return defaults.slice(0, count).map((hex, i) => createColorSwatch(hex, `swatch-fb-${i + 1}`));
}
