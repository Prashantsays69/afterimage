import { describe, it, expect } from 'vitest';
import {
  isValidHex,
  normalizeHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hslToHex,
  getRelativeLuminance,
  getContrastRatio,
  checkWcagCompliance,
  createColorSwatch,
} from '../utils/color';

describe('Color validation and normalization', () => {
  it('validates 3-digit and 6-digit hex values', () => {
    expect(isValidHex('#fff')).toBe(true);
    expect(isValidHex('fff')).toBe(true);
    expect(isValidHex('#151515')).toBe(true);
    expect(isValidHex('151515')).toBe(true);
    expect(isValidHex('#FF593D')).toBe(true);

    // Invalid
    expect(isValidHex('')).toBe(false);
    expect(isValidHex('12345')).toBe(false);
    expect(isValidHex('#GGG')).toBe(false);
    expect(isValidHex('#1234567')).toBe(false);
  });

  it('normalizes hex values to uppercase #RRGGBB', () => {
    expect(normalizeHex('#abc')).toBe('#AABBCC');
    expect(normalizeHex('ff593d')).toBe('#FF593D');
    expect(normalizeHex('#151515')).toBe('#151515');
    expect(normalizeHex('xyz')).toBe(null);
  });
});

describe('Color conversions', () => {
  it('converts hex to RGB', () => {
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#FF593D')).toEqual({ r: 255, g: 89, b: 61 });
    expect(hexToRgb('invalid')).toBeNull();
  });

  it('converts RGB to hex', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(255, 89, 61)).toBe('#FF593D');
    expect(rgbToHex(300, -10, 50)).toBe('#FF0032'); // clamped
  });

  it('converts RGB to HSL and back to RGB with high fidelity', () => {
    const testColors = [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 21, g: 21, b: 21 }, // #151515
      { r: 242, g: 239, b: 232 }, // #F2EFE8
      { r: 255, g: 89, b: 61 }, // #FF593D
    ];

    for (const c of testColors) {
      const hsl = rgbToHsl(c.r, c.g, c.b);
      const backRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      expect(Math.abs(backRgb.r - c.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(backRgb.g - c.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(backRgb.b - c.b)).toBeLessThanOrEqual(2);
    }
  });

  it('converts HSL to Hex directly', () => {
    expect(hslToHex(0, 0, 100)).toBe('#FFFFFF');
    expect(hslToHex(0, 0, 0)).toBe('#000000');
  });
});

describe('Relative Luminance and WCAG Contrast calculations', () => {
  it('computes relative luminance according to WCAG 2.2', () => {
    // Pure black is 0, pure white is 1.0
    expect(getRelativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
    expect(getRelativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1.0, 4);
  });

  it('computes exact contrast ratios', () => {
    // White vs Black is 21.0
    expect(getContrastRatio('#FFFFFF', '#000000')).toBe(21);
    expect(getContrastRatio('#000000', '#FFFFFF')).toBe(21);

    // Same color has contrast ratio 1.0
    expect(getContrastRatio('#151515', '#151515')).toBe(1);
    expect(getContrastRatio('#F2EFE8', '#F2EFE8')).toBe(1);

    // Ink #151515 on Paper #F2EFE8 is > 14:1 (high contrast)
    const inkOnPaper = getContrastRatio('#151515', '#F2EFE8');
    expect(inkOnPaper).toBeGreaterThan(12);

    // Electric Blue #2457FF on White #FFFFFF
    const blueOnWhite = getContrastRatio('#2457FF', '#FFFFFF');
    expect(blueOnWhite).toBeGreaterThan(4.5);
  });

  it('evaluates WCAG AA and AAA compliance thresholds correctly', () => {
    // 21.0 passes everything
    const full = checkWcagCompliance(21.0);
    expect(full.normalAA).toBe(true);
    expect(full.normalAAA).toBe(true);
    expect(full.largeAA).toBe(true);
    expect(full.largeAAA).toBe(true);

    // 5.2 passes normal AA and large AAA, but fails normal AAA
    const mid = checkWcagCompliance(5.2);
    expect(mid.normalAA).toBe(true);
    expect(mid.normalAAA).toBe(false);
    expect(mid.largeAA).toBe(true);
    expect(mid.largeAAA).toBe(true);

    // 3.5 passes large AA, fails normal AA
    const low = checkWcagCompliance(3.5);
    expect(low.normalAA).toBe(false);
    expect(low.normalAAA).toBe(false);
    expect(low.largeAA).toBe(true);
    expect(low.largeAAA).toBe(false);

    // 2.0 fails all
    const fail = checkWcagCompliance(2.0);
    expect(fail.normalAA).toBe(false);
    expect(fail.normalAAA).toBe(false);
    expect(fail.largeAA).toBe(false);
    expect(fail.largeAAA).toBe(false);
  });

  it('creates color swatch objects accurately', () => {
    const swatch = createColorSwatch('#FF593D', 'test-swatch', 42);
    expect(swatch.id).toBe('test-swatch');
    expect(swatch.hex).toBe('#FF593D');
    expect(swatch.rgb).toEqual({ r: 255, g: 89, b: 61 });
    expect(swatch.percentage).toBe(42);
    expect(swatch.hsl.h).toBeGreaterThan(0);
  });
});
