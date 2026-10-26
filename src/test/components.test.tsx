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
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { TermsAndConditions } from '../components/TermsAndConditions';
import { SAMPLE_IMAGES } from '../data/samples';
import { createColorSwatch } from '../utils/color';
import { validateImageFile } from '../utils/extractor';
import { useScrollReveal } from '../hooks/useScrollReveal';

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

  it('renders hero with coordinated entrance choreography classes for editorial sequencing', () => {
    const onOpen = vi.fn();
    const onSelect = vi.fn();

    const { container } = render(
      <LandingPage
        onOpenWorkspace={onOpen}
        onSelectSample={onSelect}
      />
    );

    // Verify eyebrow animation class
    expect(container.querySelector('.animate-hero-eyebrow')).toBeInTheDocument();

    // Verify specimen folio index ledger entrance class
    expect(container.querySelector('.animate-hero-specimen-index')).toBeInTheDocument();

    // Verify headline lines 1, 2, and 3 letterbox unmasking classes and editorial masks
    expect(container.querySelector('.animate-hero-headline-1')).toBeInTheDocument();
    expect(container.querySelector('.animate-hero-headline-2')).toBeInTheDocument();
    expect(container.querySelector('.animate-hero-headline-3')).toBeInTheDocument();
    expect(container.querySelector('.hero-unmask-line-1')).toBeInTheDocument();
    expect(container.querySelector('.hero-unmask-line-2')).toBeInTheDocument();
    expect(container.querySelector('.hero-unmask-line-3')).toBeInTheDocument();
    expect(container.querySelectorAll('.editorial-mask').length).toBeGreaterThan(0);

    // Verify supporting copy entrance animation class
    expect(container.querySelector('.animate-hero-support')).toBeInTheDocument();

    // Verify action ledger entrance animation class
    expect(container.querySelector('.animate-hero-actions')).toBeInTheDocument();

    // Verify hero artwork specimen animation class
    expect(container.querySelector('.animate-hero-artwork')).toBeInTheDocument();
  });

  it('respects prefers-reduced-motion media query by disabling interactive tilt on hero specimen', () => {
    // Mock matchMedia to simulate prefers-reduced-motion: reduce
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const onSelect = vi.fn();
    const { container } = render(
      <HeroSpecimen
        sample={SAMPLE_IMAGES[0]}
        onSelectSample={onSelect}
      />
    );

    // Specimen container should render without dynamic interactive tilt transforms
    const specimen = container.querySelector('.hero-specimen');
    expect(specimen).toBeInTheDocument();
    expect(specimen).not.toHaveStyle('transform: rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg))');

    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('reveals elements visible on mount immediately with useScrollReveal', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 100,
      bottom: 400,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    });

    const MountComponent = () => {
      const { ref, isRevealed } = useScrollReveal();
      return (
        <div ref={ref} data-testid="mount-target" className={isRevealed ? 'is-revealed' : ''}>
          In View on Mount
        </div>
      );
    };

    render(<MountComponent />);
    const target = screen.getByTestId('mount-target');
    expect(target).toHaveClass('is-revealed');

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('keeps below-the-fold sections unrevealed until scrolled into view with useScrollReveal', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    // Mock getBoundingClientRect to place element below the fold
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 1500,
      bottom: 2500,
      left: 0,
      right: 800,
      width: 800,
      height: 1000,
    });

    const BelowFoldComponent = () => {
      const { ref, isRevealed } = useScrollReveal();
      return (
        <div ref={ref} data-testid="below-fold-target" className={isRevealed ? 'is-revealed' : ''}>
          Below the Fold Content
        </div>
      );
    };

    render(<BelowFoldComponent />);
    const target = screen.getByTestId('below-fold-target');
    // Initially unrevealed while below the fold
    expect(target).not.toHaveClass('is-revealed');

    // Simulate scrolling into view
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 400,
      bottom: 1400,
      left: 0,
      right: 800,
      width: 800,
      height: 1000,
    });

    fireEvent.scroll(window);
    expect(target).toHaveClass('is-revealed');

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('recovers gracefully when IntersectionObserver is unsupported or throws', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 100,
      bottom: 400,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    });

    const originalIO = window.IntersectionObserver;
    // Simulate throwing IntersectionObserver
    window.IntersectionObserver = vi.fn().mockImplementation(() => {
      throw new Error('Observer failure');
    }) as unknown as typeof IntersectionObserver;

    const ObserverErrorComponent = () => {
      const { ref, isRevealed } = useScrollReveal();
      return (
        <div ref={ref} data-testid="observer-err-target" className={isRevealed ? 'is-revealed' : ''}>
          Resilient Content on Error
        </div>
      );
    };

    render(<ObserverErrorComponent />);
    const target = screen.getByTestId('observer-err-target');
    expect(target).toHaveClass('is-revealed');

    window.IntersectionObserver = originalIO;
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('replays scroll entrance bidirectionally when scrolling past and returning', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    let currentRect = {
      top: 100,
      bottom: 400,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    };
    Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(() => currentRect);

    const RepeatableComponent = () => {
      const { ref, isRevealed } = useScrollReveal();
      return (
        <div ref={ref} data-testid="repeatable-target" className={isRevealed ? 'is-revealed' : ''}>
          Repeatable Section Content
        </div>
      );
    };

    render(<RepeatableComponent />);
    const target = screen.getByTestId('repeatable-target');

    // 1. Initially in view
    expect(target).toHaveClass('is-revealed');

    // 2. User scrolls way down, element scrolls completely above viewport past -20px hysteresis buffer
    currentRect = {
      top: -600,
      bottom: -100,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    };
    fireEvent.scroll(window);
    expect(target).not.toHaveClass('is-revealed');

    // 3. User scrolls back up, element re-enters viewport
    currentRect = {
      top: 150,
      bottom: 450,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    };
    fireEvent.scroll(window);
    expect(target).toHaveClass('is-revealed');

    // 4. User scrolls way up, element scrolls completely below viewport past innerHeight + 20px
    currentRect = {
      top: 1500,
      bottom: 1800,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    };
    fireEvent.scroll(window);
    expect(target).not.toHaveClass('is-revealed');

    // 5. User scrolls back down, element re-enters viewport again
    currentRect = {
      top: 200,
      bottom: 500,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    };
    fireEvent.scroll(window);
    expect(target).toHaveClass('is-revealed');

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('prevents boundary flicker when element rests near viewport edge due to hysteresis buffer', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    let currentRect = {
      top: 100,
      bottom: 400,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    };
    Element.prototype.getBoundingClientRect = vi.fn().mockImplementation(() => currentRect);

    const HysteresisComponent = () => {
      const { ref, isRevealed } = useScrollReveal();
      return (
        <div ref={ref} data-testid="hysteresis-target" className={isRevealed ? 'is-revealed' : ''}>
          Hysteresis Content
        </div>
      );
    };

    render(<HysteresisComponent />);
    const target = screen.getByTestId('hysteresis-target');
    expect(target).toHaveClass('is-revealed');

    // Element edge sits right at -5px (barely outside, but within the 20px safety buffer)
    currentRect = {
      top: -305,
      bottom: -5,
      left: 0,
      right: 800,
      width: 800,
      height: 300,
    };
    fireEvent.scroll(window);
    // Should NOT reset to avoid jitter/flicker
    expect(target).toHaveClass('is-revealed');

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('renders distinct section choreography elements across LandingPage', () => {
    const onOpen = vi.fn();
    const onSelect = vi.fn();

    const { container } = render(
      <LandingPage
        onOpenWorkspace={onOpen}
        onSelectSample={onSelect}
      />
    );

    // Section 02 architectural rule draw
    expect(container.querySelector('.scroll-reveal-rule')).toBeInTheDocument();

    // Section 02 spectrum columns with directional ink-wipe reveal
    const spectrumColumns = container.querySelectorAll('.spectrum-column-reveal');
    expect(spectrumColumns.length).toBeGreaterThan(0);

    // Section 03 3-stage workflow sequential cascade and monumental numeral clipped slide
    const stepCards = container.querySelectorAll('.workflow-step-card');
    expect(stepCards.length).toBe(3);
    const stepNums = container.querySelectorAll('.workflow-num-reveal');
    expect(stepNums.length).toBe(3);

    // Section 04 curated studies card entrances
    const studyCards = container.querySelectorAll('.study-card-reveal');
    expect(studyCards.length).toBe(3);

    // Section 05 CTA manifesto headline clipped reveals and border crisping
    const ctaHeadlines = container.querySelectorAll('.cta-headline-reveal');
    expect(ctaHeadlines.length).toBe(2);
    expect(container.querySelector('.cta-border-reveal')).toBeInTheDocument();
  });

  it('renders PaletteStrip swatches with animate-swatch-entrance and supports copy micro-badge pop', async () => {
    const onSelect = vi.fn();
    const onReorder = vi.fn();
    const onAdd = vi.fn();
    const onRemove = vi.fn();
    const onRegen = vi.fn();

    const originalClipboard = navigator.clipboard;
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    const { container } = render(
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

    // Swatches have entrance animation
    const swatches = container.querySelectorAll('.animate-swatch-entrance');
    expect(swatches.length).toBe(samplePalette.length);

    // Copy HEX button
    const copyButtons = screen.getAllByTitle('Copy HEX');
    fireEvent.click(copyButtons[0]);

    // Active micro-badge pop appears
    const badge = await screen.findByText('COPIED');
    expect(badge).toHaveClass('animate-copy-pop');

    Object.assign(navigator, { clipboard: originalClipboard });
  });

  it('renders Inspector accordion headers with animated accordion-chevron rotation', () => {
    const onUpdate = vi.fn();

    const { container } = render(
      <Inspector
        palette={samplePalette}
        selectedSwatch={samplePalette[0]}
        onUpdateSwatch={onUpdate}
      />
    );

    // Accordion chevrons are present
    const chevrons = container.querySelectorAll('.accordion-chevron');
    expect(chevrons.length).toBe(4);
    // Uncollapsed sections have is-open class
    expect(container.querySelector('.accordion-chevron.is-open')).toBeInTheDocument();
  });

  it('renders modals with animate-backdrop-fade for smooth entrance', () => {
    const onClose = vi.fn();

    const { container: exportContainer } = render(
      <ExportModal palette={samplePalette} isOpen={true} onClose={onClose} />
    );
    expect(exportContainer.querySelector('.animate-backdrop-fade')).toBeInTheDocument();

    const { container: shortcutsContainer } = render(
      <ShortcutsModal isOpen={true} onClose={onClose} />
    );
    expect(shortcutsContainer.querySelector('.animate-backdrop-fade')).toBeInTheDocument();
  });

  it('renders PrivacyPolicy with accurate zero-server data statements and responds to navigation', () => {
    const onHome = vi.fn();
    const onWorkspace = vi.fn();

    render(
      <PrivacyPolicy
        onNavigateHome={onHome}
        onOpenWorkspace={onWorkspace}
      />
    );

    // Verify key privacy commitments matching actual codebase behavior
    expect(screen.getByRole('heading', { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Zero Server Uploads & Network Transmission/i)).toBeInTheDocument();
    expect(screen.getByText(/In-Memory Browser Canvas Execution/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero advertising or tracking cookies/i)).toBeInTheDocument();

    // Verify action buttons
    const backBtn = screen.getByRole('button', { name: /Back to Overview/i });
    fireEvent.click(backBtn);
    expect(onHome).toHaveBeenCalled();

    const workspaceBtn = screen.getByRole('button', { name: /Launch Workspace/i });
    fireEvent.click(workspaceBtn);
    expect(onWorkspace).toHaveBeenCalled();
  });

  it('renders TermsAndConditions with accurate token ownership rights and responds to navigation', () => {
    const onHome = vi.fn();
    const onWorkspace = vi.fn();

    render(
      <TermsAndConditions
        onNavigateHome={onHome}
        onOpenWorkspace={onWorkspace}
      />
    );

    // Verify core terms matching actual product behavior
    expect(screen.getByRole('heading', { level: 1, name: /Terms & Conditions/i })).toBeInTheDocument();
    expect(screen.getByText(/Token Ownership & Commercial Rights/i)).toBeInTheDocument();
    expect(screen.getByText(/Free for personal, commercial, open-source, and enterprise projects/i)).toBeInTheDocument();
    expect(screen.getByText(/No Account Requirements/i)).toBeInTheDocument();

    // Verify action buttons
    const backBtn = screen.getByRole('button', { name: /Back to Overview/i });
    fireEvent.click(backBtn);
    expect(onHome).toHaveBeenCalled();

    const workspaceBtn = screen.getByRole('button', { name: /Launch Workspace/i });
    fireEvent.click(workspaceBtn);
    expect(onWorkspace).toHaveBeenCalled();
  });

  it('renders LandingPage footer with working navigation, privacy policy, and terms links', () => {
    const onOpenWorkspace = vi.fn();
    const onSelect = vi.fn();
    const onPrivacy = vi.fn();
    const onTerms = vi.fn();

    render(
      <LandingPage
        onOpenWorkspace={onOpenWorkspace}
        onSelectSample={onSelect}
        onOpenPrivacy={onPrivacy}
        onOpenTerms={onTerms}
      />
    );

    // Verify footer links are present and clickable
    const privacyBtn = screen.getByRole('button', { name: /Privacy Policy/i });
    fireEvent.click(privacyBtn);
    expect(onPrivacy).toHaveBeenCalled();

    const termsBtn = screen.getByRole('button', { name: /Terms & Conditions/i });
    fireEvent.click(termsBtn);
    expect(onTerms).toHaveBeenCalled();
  });
});


