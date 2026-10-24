export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorSwatch {
  id: string;
  hex: string; // #RRGGBB
  rgb: RGB;
  hsl: HSL;
  percentage?: number;
}

export interface ContrastResult {
  ratio: number;
  normalAA: boolean; // >= 4.5
  normalAAA: boolean; // >= 7.0
  largeAA: boolean; // >= 3.0
  largeAAA: boolean; // >= 4.5
}

export type GradientType = 'linear' | 'radial';

export interface GradientStop {
  id: string;
  colorId: string;
  hex: string;
  position: number; // 0-100%
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // 0-360 deg
  stops: GradientStop[];
}

export interface ImageMetadata {
  name: string;
  width: number;
  height: number;
  size: number;
  aspectRatio: number;
  dataUrl: string;
  file?: File;
}

export type ExportFormat = 'css' | 'json';
