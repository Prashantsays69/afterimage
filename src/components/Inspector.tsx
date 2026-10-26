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
      <aside className="bg-white border-2 border-ink relative overflow-hidden" aria-label="Color Inspector">
        <div className="px-4 py-2.5 bg-paper border-b-2 border-ink flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-ink uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
            <span>01 // INSPECTOR CONSOLE</span>
          </span>
          <span className="text-muted text-[10px] uppercase font-bold tracking-wider">STANDBY</span>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
          <div className="w-12 h-12 border-2 border-ink bg-paper flex items-center justify-center mb-3 text-ink">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-display font-black text-base text-ink uppercase tracking-tight mb-1">No Color Selected</h3>
          <p className="font-body text-xs text-ink/70 max-w-xs leading-relaxed">
            Select a swatch from the palette or choose an image to calibrate channels and test WCAG contrast.
          </p>
        </div>
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
    <aside className="bg-white border-2 border-ink divide-y-2 divide-ink" aria-label="Color Inspector">
      {/* 1. Selected Color Overview */}
      <section className="p-4 md:p-5">
        <div className="flex items-center justify-between pb-3">
          <h3 className="font-mono font-bold text-xs tracking-wider uppercase text-ink flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
            <span>01</span> Color Inspector
          </h3>
          <span className="font-mono text-xs font-bold text-ink">{selectedSwatch.hex}</span>
        </div>

        <div className="flex gap-4 items-stretch mb-4">
          {/* Swatch Preview Block with 140ms transition per motion.md Section 5 */}
          <div
            className="w-20 h-20 md:w-24 md:h-24 border-2 border-ink flex-shrink-0 relative transition-colors duration-fast"
            style={{ backgroundColor: selectedSwatch.hex }}
            aria-label={`Preview of color ${selectedSwatch.hex}`}
          >
            <div className="absolute bottom-1 right-1 bg-ink text-acid-lime font-mono text-[9px] font-bold px-1.5 py-0.5 border border-ink">
              PREVIEW
            </div>
          </div>

          {/* Editable HEX input and controls */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <label htmlFor="hex-editor-input" className="block text-xs font-mono font-bold uppercase text-ink mb-1">
                HEX Value
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hex-editor-input"
                  type="text"
                  value={hexInput}
                  onChange={handleHexChange}
                  maxLength={7}
                  className={`w-full px-3 py-2 bg-paper border-2 font-mono text-sm uppercase font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue ${
                    hexError ? 'border-error' : 'border-ink'
                  }`}
                  aria-invalid={!!hexError}
                  aria-describedby={hexError ? 'hex-error-msg' : undefined}
                />
                <button
                  type="button"
                  onClick={() => copy(selectedSwatch.hex, 'HEX')}
                  className="tactile-press px-3 py-2 bg-paper border-2 border-ink hover:bg-ink hover:text-white text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue flex items-center gap-1.5 transition-colors font-mono font-bold text-xs uppercase"
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
                <p id="hex-error-msg" className="text-xs text-error mt-1 font-mono font-bold">
                  {hexError}
                </p>
              )}
            </div>

            {/* RGB Synchronized Readout */}
            <div className="pt-2">
              <span className="block text-[11px] font-mono font-bold uppercase text-muted mb-1">RGB Channels</span>
              <div className="grid grid-cols-3 gap-2">
                {(['r', 'g', 'b'] as const).map((channel) => (
                  <div key={channel} className="flex items-center border-2 border-ink bg-paper px-2 py-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-muted mr-1.5">{channel}:</span>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={selectedSwatch.rgb[channel]}
                      onChange={(e) => handleRgbChange(channel, parseInt(e.target.value, 10))}
                      className="w-full bg-transparent font-mono text-xs font-bold text-ink focus:outline-none"
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
          className="w-full flex items-center justify-between font-mono font-bold text-xs tracking-wider uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.adjustments}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
            <span>02</span> HSL Precision Adjustments
          </span>
          <ChevronDown className={`w-4 h-4 accordion-chevron ${!collapsedSections.adjustments ? 'is-open' : ''}`} />
        </button>

        {!collapsedSections.adjustments && (
          <div className="space-y-3 pt-3">
            {/* Hue */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <label htmlFor="hue-slider" className="text-ink font-bold uppercase">Hue</label>
                <span className="text-ink font-bold">{selectedSwatch.hsl.h}°</span>
              </div>
              <input
                id="hue-slider"
                type="range"
                min={0}
                max={360}
                value={selectedSwatch.hsl.h}
                onChange={(e) => handleHslChange('h', Number(e.target.value))}
                className="w-full h-2.5 bg-paper border-2 border-ink accent-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <label htmlFor="sat-slider" className="text-ink font-bold uppercase">Saturation</label>
                <span className="text-ink font-bold">{selectedSwatch.hsl.s}%</span>
              </div>
              <input
                id="sat-slider"
                type="range"
                min={0}
                max={100}
                value={selectedSwatch.hsl.s}
                onChange={(e) => handleHslChange('s', Number(e.target.value))}
                className="w-full h-2.5 bg-paper border-2 border-ink accent-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
              />
            </div>

            {/* Lightness */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <label htmlFor="light-slider" className="text-ink font-bold uppercase">Lightness</label>
                <span className="text-ink font-bold">{selectedSwatch.hsl.l}%</span>
              </div>
              <input
                id="light-slider"
                type="range"
                min={0}
                max={100}
                value={selectedSwatch.hsl.l}
                onChange={(e) => handleHslChange('l', Number(e.target.value))}
                className="w-full h-2.5 bg-paper border-2 border-ink accent-ink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
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
          className="w-full flex items-center justify-between font-mono font-bold text-xs tracking-wider uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.contrast}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
            <span>03</span> WCAG 2.2 Contrast Checker
          </span>
          <ChevronDown className={`w-4 h-4 accordion-chevron ${!collapsedSections.contrast ? 'is-open' : ''}`} />
        </button>

        {!collapsedSections.contrast && (
          <div className="space-y-4 pt-3">
            {/* Background selection */}
            <div>
              <span className="block text-xs font-mono font-bold uppercase text-muted mb-2">Test Background:</span>
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
                      className={`tactile-press inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold border-2 ${
                        isBgSelected
                          ? 'border-ink bg-ink text-white ring-1 ring-ink'
                          : 'border-ink bg-paper text-ink hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 border border-ink inline-block"
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
              className="p-4 border-2 border-ink transition-colors duration-fast"
              style={{ backgroundColor: contrastBgHex, color: contrastFgHex }}
            >
              <div className="flex items-baseline justify-between mb-2 pb-2 border-b-2 border-current/20">
                <span className="font-mono text-3xl font-black">{contrastRatio.toFixed(2)}:1</span>
                <span className="font-mono text-xs uppercase font-bold opacity-80">Relative Luminance</span>
              </div>
              <p className="text-sm font-normal mb-1">
                Regular Body Text (16px): The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-lg font-black tracking-tight">
                Large Display Heading (18pt / 24px)
              </p>
            </div>

            {/* Compliance Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 border-2 border-ink bg-paper flex items-center justify-between">
                <span className="font-bold">Normal text AA (4.5:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border-2 ${
                    wcagResults.normalAA
                      ? 'border-ink bg-ink text-acid-lime'
                      : 'border-ink/40 bg-white text-error'
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

              <div className="p-2.5 border-2 border-ink bg-paper flex items-center justify-between">
                <span className="font-bold">Normal text AAA (7.0:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border-2 ${
                    wcagResults.normalAAA
                      ? 'border-ink bg-ink text-acid-lime'
                      : 'border-ink/40 bg-white text-error'
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

              <div className="p-2.5 border-2 border-ink bg-paper flex items-center justify-between">
                <span className="font-bold">Large text AA (3.0:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border-2 ${
                    wcagResults.largeAA
                      ? 'border-ink bg-ink text-acid-lime'
                      : 'border-ink/40 bg-white text-error'
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

              <div className="p-2.5 border-2 border-ink bg-paper flex items-center justify-between">
                <span className="font-bold">Large text AAA (4.5:1)</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold border-2 ${
                    wcagResults.largeAAA
                      ? 'border-ink bg-ink text-acid-lime'
                      : 'border-ink/40 bg-white text-error'
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
          className="w-full flex items-center justify-between font-mono font-bold text-xs tracking-wider uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.gradient}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
            <span>04</span> Gradient Builder
          </span>
          <ChevronDown className={`w-4 h-4 accordion-chevron ${!collapsedSections.gradient ? 'is-open' : ''}`} />
        </button>

        {!collapsedSections.gradient && (
          <div className="space-y-3 pt-3">
            {/* Live Gradient Preview Box */}
            <div
              className="h-20 w-full border-2 border-ink transition-all duration-fast flex items-end justify-between p-2"
              style={{ background: gradientCssString }}
            >
              <span className="bg-ink text-white font-mono text-[10px] font-bold px-2 py-0.5 border border-ink">
                {gradientConfig.type === 'linear' ? `${gradientConfig.angle}°` : 'RADIAL'}
              </span>
              <button
                type="button"
                onClick={() => copy(gradientCssString, 'GRADIENT')}
                className="tactile-press bg-white hover:bg-ink hover:text-white text-ink text-xs font-mono font-bold px-2.5 py-1 border-2 border-ink flex items-center gap-1 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
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
              <div className="flex border-2 border-ink" role="radiogroup" aria-label="Gradient type">
                <button
                  type="button"
                  onClick={() => setGradientConfig((prev) => ({ ...prev, type: 'linear' }))}
                  className={`tactile-press px-3 py-1.5 text-xs font-mono font-bold uppercase ${
                    gradientConfig.type === 'linear' ? 'bg-ink text-white' : 'bg-paper text-ink hover:bg-white'
                  }`}
                >
                  Linear
                </button>
                <button
                  type="button"
                  onClick={() => setGradientConfig((prev) => ({ ...prev, type: 'radial' }))}
                  className={`tactile-press px-3 py-1.5 text-xs font-mono font-bold uppercase border-l-2 border-ink ${
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
                    className="w-full h-2.5 bg-paper border-2 border-ink accent-ink cursor-pointer"
                    aria-label="Gradient angle in degrees"
                  />
                  <span className="font-mono text-xs font-bold w-10 text-right">{gradientConfig.angle}°</span>
                </div>
              )}
            </div>

            {/* Gradient Stops Configuration */}
            <div>
              <span className="block text-xs font-mono font-bold uppercase text-muted mb-2">Palette Stops:</span>
              <div className="space-y-2">
                {gradientConfig.stops.map((stop, sIndex) => (
                  <div key={stop.id} className="flex items-center gap-2 bg-paper p-2 border-2 border-ink">
                    <span className="font-mono text-xs font-bold w-6 text-ink">#{sIndex + 1}</span>
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
                      className="px-2 py-1 bg-white border-2 border-ink text-xs font-mono font-bold text-ink focus:outline-none"
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
                      className="flex-1 h-2.5 bg-white border-2 border-ink accent-ink cursor-pointer"
                      aria-label={`Position for stop ${sIndex + 1}`}
                    />
                    <span className="font-mono text-xs font-bold w-8 text-right">{stop.position}%</span>
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
                  className="mt-2 text-xs font-mono uppercase font-bold text-ink hover:text-signal-red flex items-center gap-1 transition-colors"
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
          className="w-full flex items-center justify-between font-mono font-bold text-xs tracking-wider uppercase text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-left"
          aria-expanded={!collapsedSections.export}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-red inline-block" aria-hidden="true" />
            <span>05</span> Export System
          </span>
          <ChevronDown className={`w-4 h-4 accordion-chevron ${!collapsedSections.export ? 'is-open' : ''}`} />
        </button>

        {!collapsedSections.export && (
          <div className="space-y-3 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex border-2 border-ink" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={exportFormat === 'css'}
                  onClick={() => setExportFormat('css')}
                  className={`tactile-press px-3 py-1.5 text-xs font-mono font-bold uppercase ${
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
                  className={`tactile-press px-3 py-1.5 text-xs font-mono font-bold uppercase border-l-2 border-ink ${
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
                  className="tactile-press px-3 py-1.5 bg-paper border-2 border-ink hover:bg-ink hover:text-white text-ink text-xs font-mono font-bold uppercase flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
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
                  className="tactile-press px-3 py-1.5 bg-ink text-white text-xs font-mono font-bold uppercase border-2 border-ink flex items-center gap-1.5 hover:bg-signal-red hover:border-signal-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue transition-colors"
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
              className="w-full p-2.5 bg-paper border-2 border-ink font-mono text-xs text-ink focus:outline-none resize-none leading-relaxed"
              aria-label="Exported code preview"
            />
          </div>
        )}
      </section>
    </aside>
  );
};
