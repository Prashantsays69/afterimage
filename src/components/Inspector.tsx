import React, { useState, useEffect } from 'react';
import { ColorSwatch, GradientConfig, GradientStop } from '../types';
import {
  isValidHex,
  normalizeHex,
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToHex,
  getContrastRatio,
  checkWcagCompliance,
} from '../utils/color';
import {
  generateCssVariables,
  generateJsonTokens,
  generateGradientCss,
  downloadFile,
} from '../utils/exporter';
import { useClipboard } from '../hooks/useClipboard';
import {
  Copy,
  Check,
  Download,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface InspectorProps {
  palette: ColorSwatch[];
  selectedSwatch: ColorSwatch | null;
  onUpdateSwatch: (id: string, updated: Partial<ColorSwatch>) => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  palette,
  selectedSwatch,
  onUpdateSwatch,
}) => {
  const { copiedText, copy } = useClipboard();

  // Local state for hex text input (allows typing without breaking state)
  const [hexInput, setHexInput] = useState(selectedSwatch?.hex || '#151515');
  const [hexError, setHexError] = useState<string | null>(null);

  // Sync when selectedSwatch changes
  useEffect(() => {
    if (selectedSwatch) {
      setHexInput(selectedSwatch.hex);
      setHexError(null);
    }
  }, [selectedSwatch?.id, selectedSwatch?.hex]);

  // Section collapse state for mobile / accordion layout
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    color: false,
    adjustments: false,
    contrast: false,
    gradient: false,
    export: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Contrast Checker State
  const [contrastBgHex, setContrastBgHex] = useState('#FFFFFF');
  const [contrastFgHex, setContrastFgHex] = useState(selectedSwatch?.hex || '#151515');

  useEffect(() => {
    if (selectedSwatch) {
      setContrastFgHex(selectedSwatch.hex);
    }
  }, [selectedSwatch?.hex]);

  const contrastRatio = getContrastRatio(contrastFgHex, contrastBgHex);
  const wcagResults = checkWcagCompliance(contrastRatio);

  // Gradient Builder State
  const [gradientConfig, setGradientConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    stops: [
      { id: '1', colorId: palette[0]?.id || '1', hex: palette[0]?.hex || '#151515', position: 0 },
      { id: '2', colorId: palette[1]?.id || '2', hex: palette[1]?.hex || '#FF593D', position: 100 },
    ],
  });

  // Export State
  const [exportFormat, setExportFormat] = useState<'css' | 'json'>('css');

  if (!selectedSwatch) {
    return (
      <aside className="bg-white border border-rule p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-12 h-12 border border-rule flex items-center justify-center mb-3 text-muted">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="font-display font-semibold text-base text-ink mb-1">No Color Selected</h3>
        <p className="text-sm text-muted">Select a swatch from the palette to inspect and adjust its values.</p>
      </aside>
    );
  }

  // Handle manual HEX input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);

    if (isValidHex(val)) {
      setHexError(null);
      const normalized = normalizeHex(val);
      if (normalized) {
        const rgb = hexToRgb(normalized)!;
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        onUpdateSwatch(selectedSwatch.id, { hex: normalized, rgb, hsl });
      }
    } else {
      setHexError('Must be a valid 3- or 6-digit hex code (e.g. #FF593D)');
    }
  };

  // Handle HSL Sliders
  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...selectedSwatch.hsl, [channel]: value };
    const hex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    const rgb = hexToRgb(hex)!;
    setHexInput(hex);
    setHexError(null);
    onUpdateSwatch(selectedSwatch.id, { hex, rgb, hsl: newHsl });
  };

  // Handle RGB direct inputs
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const clamped = Math.max(0, Math.min(255, value || 0));
    const newRgb = { ...selectedSwatch.rgb, [channel]: clamped };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex);
    setHexError(null);
    onUpdateSwatch(selectedSwatch.id, { hex, rgb: newRgb, hsl });
  };

  const gradientCssString = generateGradientCss(gradientConfig);
  const exportContent =
    exportFormat === 'css' ? generateCssVariables(palette) : generateJsonTokens(palette);

  return (
    <aside className="bg-white border border-rule divide-y divide-rule" aria-label="Color Inspector">
      {/* 1. Selected Color Overview */}
      <section className="p-4 md:p-5">
        <div className="flex items-center justify-between pb-3">
          <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-ink flex items-center gap-2">
            <span>01</span> Color Inspector
          </h3>
          <span className="font-mono text-xs text-muted">{selectedSwatch.hex}</span>
        </div>

        <div className="flex gap-4 items-stretch mb-4">
          {/* Swatch Preview Block with 140ms transition per motion.md Section 5 */}
          <div
            className="w-20 h-20 md:w-24 md:h-24 border border-rule flex-shrink-0 relative transition-colors duration-fast"
            style={{ backgroundColor: selectedSwatch.hex }}
            aria-label={`Preview of color ${selectedSwatch.hex}`}
          >
            <div className="absolute bottom-1 right-1 bg-ink text-white font-mono text-[9px] px-1 py-0.5">
              PREVIEW
            </div>
          </div>

          {/* Editable HEX input and controls */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <label htmlFor="hex-editor-input" className="block text-xs font-mono uppercase text-muted mb-1">
                HEX Value
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hex-editor-input"
                  type="text"
                  value={hexInput}
                  onChange={handleHexChange}
                  maxLength={7}
                  className={`w-full px-3 py-2 bg-paper border font-mono text-sm uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue ${
                    hexError ? 'border-error' : 'border-rule'
                  }`}
                  aria-invalid={!!hexError}
                  aria-describedby={hexError ? 'hex-error-msg' : undefined}
                />
                <button
                  type="button"
                  onClick={() => copy(selectedSwatch.hex, 'HEX')}
                  className="tactile-press px-3 py-2 bg-paper border border-rule hover:border-ink text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue flex items-center gap-1.5"
                  title="Copy HEX value"
                  aria-label="Copy HEX value"
                >
                  {copiedText === 'HEX' ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-ink" />
                  )}
                  <span className="text-xs font-mono hidden sm:inline">
                    {copiedText === 'HEX' ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>
              {hexError && (
                <p id="hex-error-msg" className="text-xs text-error mt-1 font-mono">
                  {hexError}
                </p>
              )}
            </div>

            {/* RGB Synchronized Readout */}
            <div className="pt-2">
              <span className="block text-[11px] font-mono uppercase text-muted mb-1">RGB Channels</span>
              <div className="grid grid-cols-3 gap-2">
                {(['r', 'g', 'b'] as const).map((channel) => (
                  <div key={channel} className="flex items-center border border-rule bg-paper px-2 py-1">
                    <span className="text-[10px] font-mono uppercase text-muted mr-1.5">{channel}:</span>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={selectedSwatch.rgb[channel]}
                      onChange={(e) => handleRgbChange(channel, parseInt(e.target.value, 10))}
                      className="w-full bg-transparent font-mono text-xs text-ink focus:outline-none"
                      aria-label={`${channel.toUpperCase()} channel`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Color Adjustments (HSL) */}
      <section className="p-4 md:p-5">
        <button
          type="button"
          onClick={() => toggleSection('adjustments')}
          className="w-full flex items-center justify-between font-display font-semibold text-sm tracking-wide uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.adjustments}
        >
          <span className="flex items-center gap-2">
            <span>02</span> HSL Precision Adjustments
          </span>
          {collapsedSections.adjustments ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.adjustments && (
          <div className="space-y-3 pt-3">
            {/* Hue */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <label htmlFor="hue-slider" className="text-muted uppercase">Hue</label>
                <span className="text-ink font-semibold">{selectedSwatch.hsl.h}°</span>
              </div>
              <input
                id="hue-slider"
                type="range"
                min={0}
                max={360}
                value={selectedSwatch.hsl.h}
                onChange={(e) => handleHslChange('h', Number(e.target.value))}
                className="w-full h-2 bg-paper border border-rule accent-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <label htmlFor="sat-slider" className="text-muted uppercase">Saturation</label>
                <span className="text-ink font-semibold">{selectedSwatch.hsl.s}%</span>
              </div>
              <input
                id="sat-slider"
                type="range"
                min={0}
                max={100}
                value={selectedSwatch.hsl.s}
                onChange={(e) => handleHslChange('s', Number(e.target.value))}
                className="w-full h-2 bg-paper border border-rule accent-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              />
            </div>

            {/* Lightness */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <label htmlFor="light-slider" className="text-muted uppercase">Lightness</label>
                <span className="text-ink font-semibold">{selectedSwatch.hsl.l}%</span>
              </div>
              <input
                id="light-slider"
                type="range"
                min={0}
                max={100}
                value={selectedSwatch.hsl.l}
                onChange={(e) => handleHslChange('l', Number(e.target.value))}
                className="w-full h-2 bg-paper border border-rule accent-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              />
            </div>
          </div>
        )}
      </section>

      {/* 3. WCAG Contrast Checker */}
      <section className="p-4 md:p-5">
        <button
          type="button"
          onClick={() => toggleSection('contrast')}
          className="w-full flex items-center justify-between font-display font-semibold text-sm tracking-wide uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.contrast}
        >
          <span className="flex items-center gap-2">
            <span>03</span> WCAG 2.2 Contrast Checker
          </span>
          {collapsedSections.contrast ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.contrast && (
          <div className="space-y-4 pt-3">
            {/* Background selection */}
            <div>
              <span className="block text-xs font-mono uppercase text-muted mb-2">Test Background:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Paper', hex: '#F2EFE8' },
                  { name: 'Ink', hex: '#151515' },
                  ...palette.map((s, i) => ({ name: `Color ${i + 1}`, hex: s.hex })),
                ].map((bg, idx) => {
                  const isBgSelected = contrastBgHex.toUpperCase() === bg.hex.toUpperCase();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setContrastBgHex(bg.hex)}
                      className={`tactile-press inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border ${
                        isBgSelected
                          ? 'border-ink bg-ink text-white ring-1 ring-ink'
                          : 'border-rule bg-paper text-ink hover:border-ink'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 border border-rule inline-block"
                        style={{ backgroundColor: bg.hex }}
                      />
                      <span>{bg.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Contrast Simulation Box */}
            <div
              className="p-4 border border-rule transition-colors duration-fast"
              style={{ backgroundColor: contrastBgHex, color: contrastFgHex }}
            >
              <div className="flex items-baseline justify-between mb-2 pb-2 border-b border-rule/30">
                <span className="font-mono text-2xl font-bold">{contrastRatio.toFixed(2)}:1</span>
                <span className="font-mono text-xs uppercase opacity-80">Relative Luminance</span>
              </div>
              <p className="text-sm font-normal mb-1">
                Regular Body Text (16px): The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-lg font-bold">
                Large Display Heading (18pt / 24px)
              </p>
            </div>

            {/* Compliance Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 border border-rule bg-paper flex items-center justify-between">
                <span>Normal text AA (4.5:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold ${
                    wcagResults.normalAA ? 'text-success' : 'text-error'
                  }`}
                >
                  {wcagResults.normalAA ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </>
                  )}
                </span>
              </div>

              <div className="p-2 border border-rule bg-paper flex items-center justify-between">
                <span>Normal text AAA (7.0:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold ${
                    wcagResults.normalAAA ? 'text-success' : 'text-error'
                  }`}
                >
                  {wcagResults.normalAAA ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </>
                  )}
                </span>
              </div>

              <div className="p-2 border border-rule bg-paper flex items-center justify-between">
                <span>Large text AA (3.0:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold ${
                    wcagResults.largeAA ? 'text-success' : 'text-error'
                  }`}
                >
                  {wcagResults.largeAA ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </>
                  )}
                </span>
              </div>

              <div className="p-2 border border-rule bg-paper flex items-center justify-between">
                <span>Large text AAA (4.5:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold ${
                    wcagResults.largeAAA ? 'text-success' : 'text-error'
                  }`}
                >
                  {wcagResults.largeAAA ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Gradient Builder */}
      <section className="p-4 md:p-5">
        <button
          type="button"
          onClick={() => toggleSection('gradient')}
          className="w-full flex items-center justify-between font-display font-semibold text-sm tracking-wide uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.gradient}
        >
          <span className="flex items-center gap-2">
            <span>04</span> Gradient Builder
          </span>
          {collapsedSections.gradient ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.gradient && (
          <div className="space-y-3 pt-3">
            {/* Live Gradient Preview Box */}
            <div
              className="h-20 w-full border border-rule transition-all duration-fast flex items-end justify-between p-2"
              style={{ background: gradientCssString }}
            >
              <span className="bg-ink/80 text-white font-mono text-[10px] px-1.5 py-0.5">
                {gradientConfig.type === 'linear' ? `${gradientConfig.angle}°` : 'RADIAL'}
              </span>
              <button
                type="button"
                onClick={() => copy(gradientCssString, 'GRADIENT')}
                className="tactile-press bg-white/90 hover:bg-white text-ink text-xs font-mono px-2 py-1 border border-ink flex items-center gap-1 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              >
                {copiedText === 'GRADIENT' ? (
                  <>
                    <Check className="w-3 h-3 text-success" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy CSS</span>
                  </>
                )}
              </button>
            </div>

            {/* Gradient Type & Angle Controls */}
            <div className="flex items-center gap-3">
              <div className="flex border border-rule" role="radiogroup" aria-label="Gradient type">
                <button
                  type="button"
                  onClick={() => setGradientConfig((prev) => ({ ...prev, type: 'linear' }))}
                  className={`tactile-press px-3 py-1.5 text-xs font-mono uppercase ${
                    gradientConfig.type === 'linear' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-white'
                  }`}
                >
                  Linear
                </button>
                <button
                  type="button"
                  onClick={() => setGradientConfig((prev) => ({ ...prev, type: 'radial' }))}
                  className={`tactile-press px-3 py-1.5 text-xs font-mono uppercase border-l border-rule ${
                    gradientConfig.type === 'radial' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-white'
                  }`}
                >
                  Radial
                </button>
              </div>

              {gradientConfig.type === 'linear' && (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={gradientConfig.angle}
                    onChange={(e) =>
                      setGradientConfig((prev) => ({ ...prev, angle: Number(e.target.value) }))
                    }
                    className="w-full h-2 bg-paper border border-rule accent-ink cursor-pointer"
                    aria-label="Gradient angle in degrees"
                  />
                  <span className="font-mono text-xs w-8 text-right">{gradientConfig.angle}°</span>
                </div>
              )}
            </div>

            {/* Gradient Stops Configuration */}
            <div>
              <span className="block text-xs font-mono uppercase text-muted mb-2">Palette Stops:</span>
              <div className="space-y-2">
                {gradientConfig.stops.map((stop, sIndex) => (
                  <div key={stop.id} className="flex items-center gap-2 bg-paper p-2 border border-rule">
                    <span className="font-mono text-xs w-6 text-muted">#{sIndex + 1}</span>
                    <select
                      value={stop.colorId}
                      onChange={(e) => {
                        const targetColor = palette.find((p) => p.id === e.target.value);
                        if (targetColor) {
                          setGradientConfig((prev) => ({
                            ...prev,
                            stops: prev.stops.map((st) =>
                              st.id === stop.id ? { ...st, colorId: targetColor.id, hex: targetColor.hex } : st
                            ),
                          }));
                        }
                      }}
                      className="px-2 py-1 bg-white border border-rule text-xs font-mono text-ink focus:outline-none"
                    >
                      {palette.map((p, idx) => (
                        <option key={p.id} value={p.id}>
                          Color {idx + 1} ({p.hex})
                        </option>
                      ))}
                    </select>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) => {
                        const pos = Number(e.target.value);
                        setGradientConfig((prev) => ({
                          ...prev,
                          stops: prev.stops.map((st) => (st.id === stop.id ? { ...st, position: pos } : st)),
                        }));
                      }}
                      className="flex-1 h-2 bg-white border border-rule accent-ink cursor-pointer"
                      aria-label={`Position for stop ${sIndex + 1}`}
                    />
                    <span className="font-mono text-xs w-8 text-right">{stop.position}%</span>
                  </div>
                ))}
              </div>

              {/* Add Stop Button */}
              {gradientConfig.stops.length < 5 && (
                <button
                  type="button"
                  onClick={() => {
                    const nextColor = palette[gradientConfig.stops.length % palette.length];
                    const newStop: GradientStop = {
                      id: `stop-${Date.now()}`,
                      colorId: nextColor.id,
                      hex: nextColor.hex,
                      position: 50,
                    };
                    setGradientConfig((prev) => ({
                      ...prev,
                      stops: [...prev.stops, newStop],
                    }));
                  }}
                  className="mt-2 text-xs font-mono uppercase text-ink hover:text-signal-red flex items-center gap-1"
                >
                  + Add Stop
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 5. Export Tokens */}
      <section className="p-4 md:p-5">
        <button
          type="button"
          onClick={() => toggleSection('export')}
          className="w-full flex items-center justify-between font-display font-semibold text-sm tracking-wide uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.export}
        >
          <span className="flex items-center gap-2">
            <span>05</span> Export System
          </span>
          {collapsedSections.export ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.export && (
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex border border-rule" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={exportFormat === 'css'}
                  onClick={() => setExportFormat('css')}
                  className={`tactile-press px-3 py-1.5 text-xs font-mono uppercase ${
                    exportFormat === 'css' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-white'
                  }`}
                >
                  CSS Variables
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={exportFormat === 'json'}
                  onClick={() => setExportFormat('json')}
                  className={`tactile-press px-3 py-1.5 text-xs font-mono uppercase border-l border-rule ${
                    exportFormat === 'json' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-white'
                  }`}
                >
                  JSON Tokens
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copy(exportContent, 'EXPORT')}
                  className="tactile-press px-2.5 py-1.5 bg-paper border border-rule hover:border-ink text-ink text-xs font-mono flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                >
                  {copiedText === 'EXPORT' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadFile(
                      exportContent,
                      exportFormat === 'css' ? 'afterimage-palette.css' : 'afterimage-tokens.json',
                      exportFormat === 'css' ? 'text/css' : 'application/json'
                    )
                  }
                  className="tactile-press px-2.5 py-1.5 bg-ink text-white text-xs font-mono flex items-center gap-1.5 hover:bg-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                  title="Download exported tokens file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={exportContent}
              rows={6}
              className="w-full p-2.5 bg-paper border border-rule font-mono text-xs text-ink focus:outline-none resize-none leading-relaxed"
              aria-label="Exported code preview"
            />
          </div>
        )}
      </section>
    </aside>
  );
};
