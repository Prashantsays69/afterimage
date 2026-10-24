import { describe, it, expect } from 'vitest';
import { generateCssVariables, generateJsonTokens, generateGradientCss } from '../utils/exporter';
import { createColorSwatch } from '../utils/color';
import { GradientConfig } from '../types';

describe('Exporter Utilities', () => {
  const swatches = [
    createColorSwatch('#151515', 's1', 50),
    createColorSwatch('#FF593D', 's2', 30),
    createColorSwatch('#D7FF3F', 's3', 20),
  ];

  it('generates valid CSS custom properties', () => {
    const css = generateCssVariables(swatches, 'brand');
    expect(css).toContain(':root {');
    expect(css).toContain('--brand-1: #151515;');
    expect(css).toContain('--brand-2: #FF593D;');
    expect(css).toContain('--brand-3: #D7FF3F;');
    expect(css).toContain('--brand-1-rgb: 21, 21, 21;');
    expect(css).toContain('--brand-2-rgb: 255, 89, 61;');
  });

  it('generates valid JSON tokens conforming to design token specifications', () => {
    const jsonStr = generateJsonTokens(swatches);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.tokens).toBeDefined();
    expect(parsed.tokens['color-1'].value).toBe('#151515');
    expect(parsed.tokens['color-1'].type).toBe('color');
    expect(parsed.tokens['color-2'].value).toBe('#FF593D');
    expect(parsed.tokens['color-3'].value).toBe('#D7FF3F');
  });

  it('generates linear and radial gradient CSS strings', () => {
    const linearConfig: GradientConfig = {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', colorId: 's1', hex: '#151515', position: 0 },
        { id: '2', colorId: 's2', hex: '#FF593D', position: 100 },
      ],
    };
    expect(generateGradientCss(linearConfig)).toBe('linear-gradient(90deg, #151515 0%, #FF593D 100%)');

    const radialConfig: GradientConfig = {
      type: 'radial',
      angle: 0,
      stops: [
        { id: '1', colorId: 's1', hex: '#151515', position: 10 },
        { id: '2', colorId: 's3', hex: '#D7FF3F', position: 90 },
      ],
    };
    expect(generateGradientCss(radialConfig)).toBe('radial-gradient(circle at center, #151515 10%, #D7FF3F 90%)');
  });
});
