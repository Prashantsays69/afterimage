import { ColorSwatch, GradientConfig } from '../types';

/**
 * Generates CSS custom properties block from a list of color swatches.
 */
export function generateCssVariables(swatches: ColorSwatch[], prefix: string = 'color'): string {
  const lines = swatches.map((s, i) => `  --${prefix}-${i + 1}: ${s.hex};`);
  const rgbLines = swatches.map(
    (s, i) => `  --${prefix}-${i + 1}-rgb: ${s.rgb.r}, ${s.rgb.g}, ${s.rgb.b};`
  );

  return `/* Afterimage Palette: CSS Custom Properties */\n:root {\n${lines.join('\n')}\n\n  /* RGB channels for opacity composition */\n${rgbLines.join('\n')}\n}`;
}

/**
 * Generates standard JSON design tokens.
 */
export function generateJsonTokens(swatches: ColorSwatch[]): string {
  const tokenObject = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    name: 'Afterimage Palette',
    generator: 'Afterimage v1.0',
    tokens: swatches.reduce<Record<string, { value: string; type: string; $extensions: Record<string, unknown> }>>(
      (acc, s, index) => {
        const key = `color-${index + 1}`;
        acc[key] = {
          value: s.hex,
          type: 'color',
          $extensions: {
            rgb: s.rgb,
            hsl: s.hsl,
            percentage: s.percentage ?? null,
          },
        };
        return acc;
      },
      {}
    ),
  };

  return JSON.stringify(tokenObject, null, 2);
}

/**
 * Generates CSS gradient declaration string from gradient configuration.
 */
export function generateGradientCss(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  const stopStrings = sortedStops.map((stop) => `${stop.hex} ${stop.position}%`).join(', ');

  if (config.type === 'radial') {
    return `radial-gradient(circle at center, ${stopStrings})`;
  }
  return `linear-gradient(${config.angle}deg, ${stopStrings})`;
}

/**
 * Helper to trigger client-side download of a text file.
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
