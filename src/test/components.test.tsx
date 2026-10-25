import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaletteStrip } from '../components/PaletteStrip';
import { Inspector } from '../components/Inspector';
import { ExportModal } from '../components/ExportModal';
import { ShortcutsModal } from '../components/ShortcutsModal';
import { ImageCanvas } from '../components/ImageCanvas';
import { HeroSpecimen } from '../components/HeroArtworkCard';
import { LandingPage } from '../components/LandingPage';
import { Workspace } from '../components/Workspace';
import { SAMPLE_IMAGES } from '../data/samples';
import { createColorSwatch } from '../utils/color';
import { validateImageFile } from '../utils/extractor';

describe('Component & Interaction Tests', () => {
  const samplePalette = [
    createColorSwatch('#151515', 's1', 40),
    createColorSwatch('#FF593D', 's2', 30),
    createColorSwatch('#2457FF', 's3', 20),
    createColorSwatch('#D7FF3F', 's4', 10),
  ];

  it('renders PaletteStrip with swatches, hex codes, and allows selection and reordering', () => {
    const onSelect = vi.fn();
    const onReorder = vi.fn();
    const onAdd = vi.fn();
    const onRemove = vi.fn();
    const onRegen = vi.fn();

    render(
      <PaletteStrip
        palette={samplePalette}
        selectedId="s1"
        onSelectColor={onSelect}
        onReorder={onReorder}
        onAddColor={onAdd}
        onRemoveColor={onRemove}
        onRegenerate={onRegen}
      />
    );

    // Verify palette count and hex items
    expect(screen.getByText('Palette (4)')).toBeInTheDocument();
    expect(screen.getByText('#151515')).toBeInTheDocument();
    expect(screen.getByText('#FF593D')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();

    // Click another swatch
    const swatch2 = screen.getByText('#FF593D');
    fireEvent.click(swatch2);
    expect(onSelect).toHaveBeenCalledWith('s2');

    // Click Reorder Left/Right
    const reorderRightBtn = screen.getByLabelText('Move selected color right');
    fireEvent.click(reorderRightBtn);
    expect(onReorder).toHaveBeenCalledWith(0, 1);

    // Click Add
    const addBtn = screen.getByText('Add');
    fireEvent.click(addBtn);
    expect(onAdd).toHaveBeenCalled();

    // Click Delete
    const deleteBtn = screen.getByText('Delete');
    fireEvent.click(deleteBtn);
    expect(onRemove).toHaveBeenCalledWith('s1');
  });

  it('renders Inspector with editable hex input, updates values, and computes contrast', () => {
    const onUpdate = vi.fn();

    render(
      <Inspector
        palette={samplePalette}
        selectedSwatch={samplePalette[0]}
        onUpdateSwatch={onUpdate}
      />
    );

    // Verify HEX input
    const hexInput = screen.getByLabelText('HEX Value') as HTMLInputElement;
    expect(hexInput.value).toBe('#151515');

    // Change hex value to a valid one
    fireEvent.change(hexInput, { target: { value: '#FFFFFF' } });
    expect(onUpdate).toHaveBeenCalledWith(
      's1',
      expect.objectContaining({ hex: '#FFFFFF' })
    );

    // Verify WCAG contrast section renders ratio against default white background
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('Normal text AA (4.5:1)')).toBeInTheDocument();
  });

  it('supports HSL adjustments and gradient builder inside Inspector', () => {
    const onUpdate = vi.fn();

    render(
      <Inspector
        palette={samplePalette}
        selectedSwatch={samplePalette[0]}
        onUpdateSwatch={onUpdate}
      />
    );

    // Check HSL controls are present
    expect(screen.getByText(/HSL Precision Adjustments/)).toBeInTheDocument();
    expect(screen.getByText('Hue')).toBeInTheDocument();
    expect(screen.getByText('Saturation')).toBeInTheDocument();
    expect(screen.getByText('Lightness')).toBeInTheDocument();

    // Check Gradient Builder section is present
    expect(screen.getByText(/Gradient Builder/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Linear' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Radial' })).toBeInTheDocument();
  });

  it('renders ExportModal with CSS and JSON tabs and supports copy/download', () => {
    const onClose = vi.fn();

    render(<ExportModal palette={samplePalette} isOpen={true} onClose={onClose} />);

    expect(screen.getByText('Export Color Palette')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /CSS Variables/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /JSON Design Tokens/i })).toBeInTheDocument();

    // Switch to JSON tokens
    const jsonTab = screen.getByRole('tab', { name: /JSON Design Tokens/i });
    fireEvent.click(jsonTab);
    const textarea = screen.getByRole('textbox', { name: 'Exported code' }) as HTMLTextAreaElement;
    expect(textarea.value).toContain('Afterimage Palette');
  });

  it('renders ShortcutsModal and lists all keyboard keybindings', () => {
    const onClose = vi.fn();

    render(<ShortcutsModal isOpen={true} onClose={onClose} />);

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Upload / replace image file')).toBeInTheDocument();
    expect(screen.getByText('Got it')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Got it'));
    expect(onClose).toHaveBeenCalled();
  });

  it('validates uploaded files accurately', () => {
    // Valid PNG
    const validFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    expect(validateImageFile(validFile).valid).toBe(true);

    // Invalid format (e.g. PDF or exe)
    const invalidFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    const resInvalid = validateImageFile(invalidFile);
    expect(resInvalid.valid).toBe(false);
    expect(resInvalid.error).toContain('Unsupported file format');

    // Oversized file (> 15MB)
    const largeFile = new File(['x'.repeat(100)], 'huge.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 20 * 1024 * 1024 });
    const resLarge = validateImageFile(largeFile);
    expect(resLarge.valid).toBe(false);
    expect(resLarge.error).toContain('exceeds the 15MB limit');
  });

  it('renders ImageCanvas with dropzone, sample image, and handles file trigger', () => {
    const onFileSelect = vi.fn();
    const onLoadSample = vi.fn();
    const onRemoveImage = vi.fn();

    // Empty state
    const { rerender } = render(
      <ImageCanvas
        imageMeta={null}
        isProcessing={false}
        onFileSelect={onFileSelect}
        onLoadSample={onLoadSample}
        onRemoveImage={onRemoveImage}
        errorMessage={null}
      />
    );

    expect(screen.getByText('Drop an image here')).toBeInTheDocument();
    expect(screen.getByText('Choose image file')).toBeInTheDocument();

    // With image loaded
    const sample = SAMPLE_IMAGES[0];
    rerender(
      <ImageCanvas
        imageMeta={sample.metadata}
        isProcessing={false}
        onFileSelect={onFileSelect}
        onLoadSample={onLoadSample}
        onRemoveImage={onRemoveImage}
        errorMessage={null}
      />
    );

    expect(screen.getByAltText(sample.metadata.name)).toBeInTheDocument();
    expect(screen.getByText(/800 × 600 px/)).toBeInTheDocument();
  });

  it('renders HeroSpecimen with artwork, metadata, and handles selection', () => {
    const onSelect = vi.fn();
    const sample = SAMPLE_IMAGES[0];

    render(<HeroSpecimen sample={sample} onSelectSample={onSelect} />);

    // Verify category and specimen label
    expect(screen.getByText(sample.category)).toBeInTheDocument();
    expect(screen.getByText('Color Specimen')).toBeInTheDocument();
    expect(screen.getByText(sample.title)).toBeInTheDocument();

    // Clicking the interactive artwork plane triggers onSelectSample
    const artworkBtn = screen.getByRole('button', { name: new RegExp(`Open workspace with ${sample.title}`, 'i') });
    fireEvent.click(artworkBtn);
    expect(onSelect).toHaveBeenCalledWith(sample);
  });

  it('renders LandingPage with headline choreography, CTA buttons, and sections', () => {
    const onOpenWorkspace = vi.fn();
    const onSelectSample = vi.fn();

    render(
      <LandingPage
        onOpenWorkspace={onOpenWorkspace}
        onSelectSample={onSelectSample}
      />
    );

    // Check headline lines
    expect(screen.getByText('Find the colors')).toBeInTheDocument();
    expect(screen.getByText('IMAGE → COLOR SYSTEM')).toBeInTheDocument();

    // Check primary CTA button
    const ctas = screen.getAllByRole('button', { name: /Extract a palette/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(ctas[0]);
    expect(onOpenWorkspace).toHaveBeenCalled();

    // Check supporting sections are rendered
    expect(screen.getByText(/Three steps to a functional/)).toBeInTheDocument();
    expect(screen.getByText('Tested against diverse imagery.')).toBeInTheDocument();
  });

  it('renders Section 02 Unified Chromatic Ledger with desktop spectrum and mobile selectable tabs', () => {
    const onOpenWorkspace = vi.fn();
    const onSelectSample = vi.fn();

    render(
      <LandingPage
        onOpenWorkspace={onOpenWorkspace}
        onSelectSample={onSelectSample}
      />
    );

    // Verify Section 02 heading and standards badge
    expect(screen.getByText(/§ 02 \/\/ CHROMATIC SPECTRUM SHEET/)).toBeInTheDocument();
    expect(screen.getAllByText(/WCAG 2.2 AA AUDITED/).length).toBeGreaterThanOrEqual(1);

    // Verify mobile interactive segment buttons exist
    const mobileTabs = screen.getAllByRole('tab');
    expect(mobileTabs.length).toBe(6);

    // Select second tab and verify tone detail updates
    fireEvent.click(mobileTabs[1]);
    expect(mobileTabs[1]).toHaveAttribute('aria-selected', 'true');

    // Click "Edit tone" button
    const editBtn = screen.getByRole('button', { name: /Edit tone/i });
    fireEvent.click(editBtn);
    expect(onSelectSample).toHaveBeenCalled();
  });

  it('handles Section 03 actionable workflow stages and Section 04 swatch HEX copying', async () => {
    const onOpenWorkspace = vi.fn();
    const onSelectSample = vi.fn();
    const onNewImage = vi.fn();

    // Mock navigator.clipboard
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <LandingPage
        onOpenWorkspace={onOpenWorkspace}
        onSelectSample={onSelectSample}
        onNewImage={onNewImage}
      />
    );

    // Test Section 03 Stage 01 action
    const stage01 = screen.getByRole('button', { name: /Stage 01: Choose an image/i });
    fireEvent.click(stage01);
    expect(onNewImage).toHaveBeenCalled();

    // Test Section 03 Stage 02 action
    const stage02 = screen.getByRole('button', { name: /Stage 02: Refine the palette/i });
    fireEvent.click(stage02);
    expect(onSelectSample).toHaveBeenCalled();

    // Test Section 03 Stage 03 action
    const stage03 = screen.getByRole('button', { name: /Stage 03: Export your colors/i });
    fireEvent.click(stage03);
    expect(onSelectSample).toHaveBeenCalledTimes(2);

    // Initial status element is present and empty
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toHaveAttribute('aria-live', 'polite');

    // Test Section 04 swatch 1-click copying
    const swatchBtn = screen.getByRole('button', { name: /Copy hex code #1E2328/i });
    fireEvent.click(swatchBtn);
    expect(writeTextMock).toHaveBeenCalledWith('#1E2328');

    // Confirm feedback state appears
    expect(screen.getAllByText('COPIED').length).toBeGreaterThanOrEqual(1);

    // Confirm screen-reader polite announcement updates with the copied hex code
    expect(statusRegion).toHaveTextContent('Copied hex code #1E2328 to clipboard');

    // Confirm Section 05 dispatch ledger displays accurate implemented export formats
    expect(screen.getByText('CSS • JSON (DTCG)')).toBeInTheDocument();
    expect(screen.queryByText(/ASE/)).not.toBeInTheDocument();
  });

  it('renders Workspace and responds to keyboard shortcuts', () => {
    const onNavigateHome = vi.fn();
    const setIsExportOpen = vi.fn();
    const setIsShortcutsOpen = vi.fn();

    render(
      <Workspace
        initialSample={SAMPLE_IMAGES[0]}
        onNavigateHome={onNavigateHome}
        isExportOpen={false}
        setIsExportOpen={setIsExportOpen}
        isShortcutsOpen={false}
        setIsShortcutsOpen={setIsShortcutsOpen}
      />
    );

    expect(screen.getByText(/barbican-study-04\.svg \(6 colors\)/)).toBeInTheDocument();

    // Press '?' to toggle shortcuts
    fireEvent.keyDown(window, { key: '?' });
    expect(setIsShortcutsOpen).toHaveBeenCalledWith(true);

    // Press 'e' to open export
    fireEvent.keyDown(window, { key: 'e' });
    expect(setIsExportOpen).toHaveBeenCalledWith(true);

    // Press 'Escape' to close modals
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(setIsExportOpen).toHaveBeenCalledWith(false);
  });
});
