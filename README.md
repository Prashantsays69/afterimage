# Afterimage

> An editorial, canvas-first image-to-color palette workspace built with React, TypeScript, Vite, and Tailwind CSS.

Afterimage transforms photographs, artwork, and visual references into calibrated, production-ready color systems directly within the browser. Grounded in an editorial brutalist design language, it bridges visual inspiration and digital implementation by pairing algorithmic color quantization with tactile swatch calibration, mathematical WCAG 2.2 contrast auditing, an interactive CSS gradient builder, and deterministic design token exports.

- **Repository**: [https://github.com/Prashantsays69/afterimage](https://github.com/Prashantsays69/afterimage)
- **Local Environment**: `http://localhost:5173/` via Vite development server
- **Production Deployment**: Public deployment URL pending final staging release (see [index.html](file:///c:/Users/Prash/Downloads/Afterimage/index.html#L23))

---

## 1. Project Introduction

### What Afterimage Is
Afterimage is a focused, client-side creative instrument designed to extract, analyze, calibrate, and export color palettes from digital images. It is not an algorithmic randomizer, a social sharing feed, or an ad-supported swatch gallery. It functions as a precision workbench where every extracted shade is treated as structured design data ready for implementation in software interfaces.

### What It Does
When an image is ingested into Afterimage:
1. **Client-Side Quantization**: An HTML5 Canvas decomposes pixel buffers locally using median-cut color quantization into a cohesive 3-to-10 swatch palette while calculating each color's proportional surface mass.
2. **Synchronized Inspection**: Every swatch can be inspected and fine-tuned across normalized 6-digit `#RRGGBB` hex codes, synchronized 8-bit RGB channels (`0–255`), and high-precision HSL sliders (`0°–360°`, `0%–100%`, `0%–100%`).
3. **Accessibility Auditing**: Color pairings are evaluated in real time against official W3C relative luminance formulas, reporting exact contrast ratios alongside explicit `PASS` / `FAIL` status for WCAG 2.2 AA and AAA standards across both normal and large text.
4. **Harmonic Gradient Synthesis**: Swatches can be composed into linear (0°–360°) or radial multi-stop CSS gradients with live visual preview and one-click declaration copying.
5. **Token Generation**: Palettes export directly into standard W3C Design Tokens Community Group (DTCG) JSON specifications or structured CSS custom properties with separated RGB channels for alpha compositing.

### Why It Exists
Visual practitioners routinely draw color direction from cinema, painting, architectural materials, and nature photography. However, translating a compelling photograph into a resilient, accessible digital design system is historically fragmented. Designers typically jump across disconnected tools: an image editor to sample raw pixels, a web generator for inspiration, an isolated contrast calculator to verify legibility, and a text editor to hand-code hex strings into tokens.

Afterimage unites this journey into a single, cohesive, zero-friction instrument that runs entirely client-side with zero telemetry, zero accounts, and zero server uploads.

### Editorial Brutalist Identity
Afterimage avoids the ubiquitous aesthetic of rounded purple cards, glowing gradient blobs, and generic SaaS marketing templates. Its aesthetic is **editorial brutalism meets precision studio instrument**:
- **Palette Tokens**: Archival Paper (`#F2EFE8`), dense Ink (`#151515`), crisp Signal Red (`#FF593D`), vibrant Acid Lime (`#D7FF3F`), and high-visibility Electric Blue (`#2457FF`).
- **Typography Hierarchy**: Space Grotesk for architectural display headers, Inter for interface controls and navigation, and IBM Plex Mono for technical telemetry, coordinate readouts, and token ledgers.
- **Physicality**: Architectural folio mastheads, razor-thin hairline dividers, registration crosshairs (`+`), tactile pressed states, and subtle pointer-responsive spatial depth on specimen plates.

---

## 2. The Problem Statement

### The Practical Challenge of Translating Imagery into Color Systems
Extracting usable color from photography involves distinct technical and perceptual obstacles:

1. **Pixel-Level Optical Noise**: Natural imagery does not consist of flat color fills. It contains sensor grain, compression artifacts, chromatic aberrations, and complex lighting gradients. Naive point-sampling frequently captures a stray highlight or shadow pixel rather than the true perceptual tone of the subject.
2. **Chromatic Balance vs. Tonal Role**: A collection of colors that looks pleasing in isolation often collapses in practical interface application. Software interfaces require strict structural hierarchy: dominant background surfaces, legible body text baselines, subtle boundary rules, and distinct interactive accents. Standard generative tools assemble swatches without compositional context.
3. **The Accessibility Gap**: Aesthetic color choices frequently fail minimum accessibility standards. Discovering that a primary brand accent and a neutral background have an illegible 3.1:1 contrast ratio after screens have already been designed forces painful, retroactive rework.
4. **Token Translation Overhead**: Hand-transcribing hex strings into stylesheets or token repositories introduces transcription error and slows development cycles. Furthermore, modern CSS architectures require decoupled RGB channel values (e.g., `rgba(var(--color-primary-rgb), 0.15)`) to support semi-transparent states without breaking token inheritance.

### Form Follows Function: Separating Purpose from Decoration
The visual design of Afterimage directly serves its functional requirements:
- **High Informational Density**: Broadsheet grid layouts allow the source image, extracted palette strip, numerical color readouts, contrast tables, and gradient previews to remain visible simultaneously without tab-switching.
- **Visual Neutrality with High Contrast**: The Paper (`#F2EFE8`) and Ink (`#151515`) framework provides an intentional, neutral backdrop with a verified 13.8:1 contrast ratio, ensuring user artwork and palettes are perceived accurately without chromatic bleed from the tool itself.

---

## 3. Target Users

| User Persona | Practical Workflow in Afterimage | Primary Value Delivered |
| :--- | :--- | :--- |
| **UI/UX & Product Designers** | Ingesting project moodboards, architectural references, or brand photography to generate accessible UI themes. | Immediate WCAG 2.2 AA/AAA validation against light, dark, and custom background surfaces before creating Figma components. |
| **Frontend Developers** | Converting design assets and reference palettes into clean code variables. | Single-click export of structured CSS custom properties (with decoupled RGB channels) and DTCG JSON tokens. |
| **Photographers & Visual Artists** | Documenting the chromatic signature of a photo series, architectural study, or gallery exhibition. | Calculating proportional color mass percentages and generating harmonic specimen sheets with exact metadata. |
| **Brand & Graphic Designers** | Establishing foundational identity palettes from key campaign visuals or physical print plates. | Systematic evaluation of color relationships, tonal roles, and multi-stop gradient behaviors. |
| **Students & Creative Practitioners** | Studying color theory, relative luminance, and accessibility relationships. | A transparent, tactile, client-side sandbox with zero ads, subscription barriers, or mandatory accounts. |

*Note: User personas represent the product's intended functional scope and target workflows; they do not imply commissioned empirical studies or formal user research cohorts.*

---

## 4. Existing Products and Competitive Positioning

To understand Afterimage's place in the creative software landscape, we examine existing tools across the workflows that matter: image-based extraction, palette exploration, contrast evaluation, developer export, and data privacy.

### Verified Feature Comparison

| Capability | Afterimage | Adobe Color (`color.adobe.com`) | Coolors (`coolors.co`) | ColorSpace (`mycolor.space`) | Colormind (`colormind.io`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Image Extraction** | **Yes** — In-browser Canvas median-cut quantization (3–10 swatches) with surface mass % | **Yes** — In-browser upload with 5 mood presets (Colorful, Bright, Muted, Deep, Dark) | **Yes** — In-browser upload with adjustable swatch count (up to 10 in Pro) | **No** — Seed color input only; no image extraction | **Yes** — Generative deep-learning extraction from uploaded image |
| **Manual Point Sampling** | **Via Quantization** — Canvas inspection; arbitrary pixel eyedropper planned | **Yes** — Interactive draggable color selector pins across image preview | **Yes** — Interactive draggable color selector pins across image preview | **No** | **No** — Automated neural net extraction only |
| **Unified Workspace View** | **Yes** — Image, palette strip, inspector, contrast, and gradient tools visible simultaneously | **No** — Tabbed workflow (Extract Theme, Color Wheel, Accessibility Tools are separate pages) | **No** — Image Picker, Palette Generator, and Contrast Checker are separate URLs | **Yes** — Single-page view displaying multiple generated scheme variations | **Yes** — Single-page view displaying palette and UI preview |
| **Accessibility & Contrast** | **Built-in WCAG 2.2** — Instant ratios & AA/AAA pass/fail for Normal & Large text against Paper, Ink, White, or any swatch | **Built-in WCAG 2.1** — Contrast Checker and Color Blindness simulator in dedicated tabs | **Built-in WCAG** — Dedicated Contrast Checker tool with text preview and AA/AAA ratings | **No** — No contrast validation or accessibility auditing | **Visual Only** — Preview palette on mock UI components without WCAG ratio metrics |
| **Developer Exports** | **DTCG JSON & CSS Variables** (with decoupled RGB channel properties) | **CC Libraries, ASE, JPEG**; manual hex copy; code snippets (CSS, LESS, XML) | **URL, PDF, PNG, SVG, CSS, SCSS, ASE, Tailwind** (some formats require Pro or account) | **CSS Gradient declarations**; raw hex list | **Hex codes, REST API** |
| **Data Privacy & Telemetry** | **100% Client-Side** — Zero server uploads, zero trackers, zero network requests for image analysis | **Cloud-Dependent** — Requires Adobe account for saving libraries; image data sent to Adobe servers | **Web Service with Ads** — Analytics, third-party ads, cloud account sync for saved history | **Web Tool with Ads** — Display advertising; client-side hex calculation | **Server Processing** — Images sent to server API for deep learning inference |
| **Account Requirement** | **None** — Completely free, no login, no paywalls | **Optional / Required** — Free exploration, but Adobe ID required to save to CC Libraries | **Freemium** — Free tier supported by ads; Pro subscription unlocks extended features | **None** — Free utility supported by ads | **None** — Free utility supported by ads and donations |

### Analytical Positioning
- **Adobe Color** remains the industry standard for integration across Adobe Photoshop, Illustrator, and InDesign via Creative Cloud Libraries. However, its tools are compartmentalized across distinct tabs, its image extraction defaults to 5 colors with cloud persistence requirements, and it lacks direct W3C DTCG design token export.
- **Coolors** is an extensive consumer and creator palette platform with deep export options and a large public gallery. However, its interface contains advertisements in the free tier, divides image extraction from contrast checking into separate URLs, and places certain advanced export formats behind a paid tier.
- **ColorSpace** is a lightweight, focused tool for generating 20+ algorithmic palette variations from a single hex code, but it does not process images or audit accessibility.
- **Colormind** utilizes neural networks to generate stylistic palettes and preview them on UI templates, but it requires server-side API processing and does not provide mathematical WCAG contrast auditing.
- **Afterimage** occupies a distinct niche: a **strictly local-first, distraction-free creative instrument** designed specifically for the transition from visual imagery to accessible design tokens. It brings canvas ingestion, swatch calibration, WCAG auditing, and token export into a single, unfragmented viewport without accounts, trackers, or subscription gates.

---

## 5. What Makes Afterimage Different

### 1. Unified 12-Column Instrument Layout
Rather than segregating tasks across multiple sub-pages, Afterimage arranges the workspace into a concurrent 12-column grid:
- **Left/Center (Columns 1–8)**: The source image canvas with technical metadata readout, paired directly below with the interactive palette strip.
- **Right (Columns 9–12)**: The comprehensive tool inspector housing synchronized HEX/RGB/HSL controls, the WCAG 2.2 contrast compliance matrix, and the live CSS gradient synthesizer.
Adjusting a single swatch immediately updates the canvas border focus, the palette strip, the accessibility scores, and the gradient preview simultaneously.

### 2. Proportional Surface Mass Analysis
During quantization, Afterimage records the pixel population assigned to each color box. The palette displays the exact percentage of surface area each tone occupies in the source image. This provides designers with objective compositional data: which color acts as the dominant environmental mass versus which tone operates as a rare chromatic accent.

### 3. Decoupled RGB Design Token Architecture
Most color tools export simple hex strings (e.g., `#2457FF`). Afterimage exports both standard hex declarations and companion decoupled RGB channel variables:
```css
/* Afterimage Palette: CSS Custom Properties */
:root {
  --color-1: #151515;
  --color-2: #FF593D;

  /* RGB channels for opacity composition */
  --color-1-rgb: 21, 21, 21;
  --color-2-rgb: 255, 89, 61;
}
```
This enables frontend engineers to immediately use modern CSS alpha composition without manual calculation:
```css
.card {
  background-color: rgba(var(--color-2-rgb), 0.08);
  border: 1px solid var(--color-2);
}
```

### 4. Mathematical WCAG 2.2 Auditing in Context
Contrast evaluation is not an afterthought hidden behind an external link. Every swatch in Afterimage can be tested against:
- High-contrast default surfaces: **White** (`#FFFFFF`), **Paper** (`#F2EFE8`), and **Ink** (`#151515`).
- Any companion swatch within the active palette (`Color 1` through `Color N`).
The calculation uses exact W3C relative luminance equations with sRGB gamma expansion, displaying numerical ratios (e.g., `12.4:1`) alongside explicit `PASS` and `FAIL` compliance badges for both Normal text (AA ≥ 4.5:1, AAA ≥ 7.0:1) and Large text (AA ≥ 3.0:1, AAA ≥ 4.5:1).

### 5. Genuine Local-First Privacy
Afterimage makes zero network requests during image ingestion and palette processing. Images are read into an in-memory `HTMLImageElement` via a local object URL (`URL.createObjectURL`), rendered to an offscreen HTML5 canvas, and discarded from memory when closed via `URL.revokeObjectURL`. No images, telemetry, or user analytics ever leave the client machine.

---

## 6. How It Works: The User Journey

```
┌──────────────────┐     ┌───────────────────────┐     ┌────────────────────────┐
│  1. INGESTION    │ ──> │  2. QUANTIZATION      │ ──> │  3. CALIBRATION        │
│  File upload or  │     │  HTML5 Canvas 2D      │     │  Interactive strip     │
│  curated sample  │     │  Median-Cut algorithm │     │  HEX / RGB / HSL edits │
└──────────────────┘     └───────────────────────┘     └────────────────────────┘
                                                                    │
                                                                    ▼
┌──────────────────┐     ┌───────────────────────┐     ┌────────────────────────┐
│  5. EXPORT       │ <── │  4b. GRADIENT LAB     │ <── │  4a. WCAG 2.2 AUDIT    │
│  CSS Variables & │     │  Linear / Radial CSS  │     │  Luminance ratios vs.  │
│  DTCG JSON Tokens│     │  multi-stop synthesis │     │  Paper, Ink, & Swatches│
└──────────────────┘     └───────────────────────┘     └────────────────────────┘
```

1. **Ingest an Image**: Drag and drop any JPEG, PNG, WebP, GIF, AVIF, or SVG image (up to 15MB) into the dropzone, click the file picker, or choose one of three bundled curated specimens (*Barbican Architectural Study*, *Herbarium Cyanotype*, or *Namib Dunes*).
2. **Decompose Pixels**: The browser downsamples the image to an offscreen 250px boundary box to ensure responsive, non-blocking execution. The median-cut quantization engine clusters RGB pixel arrays along the axis of greatest variance, producing 6 harmonized swatches (configurable from 3 to 10) with calculated percentage surface weights.
3. **Calibrate Swatches**: Click any swatch in the palette strip to focus it. Reorder swatches horizontally, add custom tones (derived with a +30° hue shift), delete redundant shades (preserving a 3-swatch minimum), or regenerate the palette from the source image. Edit values via direct hex entry with automatic normalization or adjust synchronized RGB and HSL sliders.
4. **Audit Accessibility**: In the WCAG inspector, evaluate the active color against White, Paper, Ink, or companion palette swatches. Review numerical contrast ratios and AA/AAA compliance markers for normal body copy (16px) and large display headings (18pt/24px).
5. **Preview Gradients**: In the Gradient Builder, compose linear (custom angle from 0° to 360°) or radial gradients utilizing swatches from the active palette with adjustable stop percentages (0%–100%). Copy the generated CSS declaration with one click.
6. **Export Production Tokens**: Open the export modal (keyboard shortcut: `E` or the inspector export tab) to review, copy, or download:
   - **CSS Custom Properties**: Structured `:root` block formatted with companion decoupled RGB channel variables (`afterimage-palette.css`).
   - **W3C DTCG JSON Tokens**: Specification-compliant design token format ready for Figma Tokens or build pipelines (`afterimage-tokens.json`).

---

## 7. Feature Overview

### Implemented Functionality (Current Codebase)
- [x] **Local Image Ingestion**: Drag-and-drop and native file input supporting JPEG, PNG, WebP, GIF, AVIF, and SVG up to 15MB.
- [x] **Median-Cut Color Quantization**: Client-side palette extraction producing 3 to 10 balanced swatches with surface mass percentages.
- [x] **Curated Specimen Library**: Bundled offline samples covering architectural geometry, botanical photography, and atmospheric landscape gradients.
- [x] **Canvas-First Workspace**: Concurrent 12-column layout keeping image, palette, and controls in a single unified viewport.
- [x] **Synchronized Three-Channel Editing**:
  - Validated uppercase 6-digit hex entry with auto-prefixing (`#RRGGBB`).
  - Discrete RGB channel inputs (`0–255`).
  - High-precision HSL sliders (Hue: `0°–360°`, Saturation: `0%–100%`, Lightness: `0%–100%`).
- [x] **Interactive Palette Strip**: Swatch reordering, manual swatch insertion, swatch deletion (3–10 bounds), and full-palette re-extraction from the active image.
- [x] **WCAG 2.2 Contrast Matrix**:
  - Exact W3C relative luminance calculation with sRGB gamma linearization.
  - Contrast ratios evaluated against White (`#FFFFFF`), Paper (`#F2EFE8`), Ink (`#151515`), or custom companion swatches.
  - Explicit compliance badges for Normal Text (AA ≥ 4.5:1, AAA ≥ 7.0:1) and Large Text (AA ≥ 3.0:1, AAA ≥ 4.5:1).
- [x] **CSS Gradient Builder**: Live preview for linear (0°–360° rotation) and radial gradients with customizable palette stop assignments and one-click CSS declaration copy.
- [x] **Design Token Exporters**:
  - CSS custom properties format with companion decoupled RGB channel variables.
  - W3C Design Tokens Community Group (DTCG) specification JSON format.
  - Direct clipboard copy and file download (`afterimage-palette.css`, `afterimage-tokens.json`).
- [x] **Keyboard Accessibility & Navigation**:
  - Shortcut modal triggered via `?`.
  - Number keys (`1`–`9`) for direct swatch selection.
  - `E` for instant export modal launch.
  - `O` / `U` for instant image replacement.
  - `Esc` to dismiss active modals.
  - Visible focus rings (`focus-visible:ring-electric-blue`) and `sr-only` live screen-reader announcements.
- [x] **Global Reduced-Motion Support**: Automatic enforcement of `prefers-reduced-motion: reduce`, disabling smooth transitions, perspective transforms, and spatial card tilts.

### Planned Functionality (Roadmap)
- [ ] **Arbitrary Canvas Eyedropper**: Direct pixel-picking from the displayed image via the native browser EyeDropper API (Chromium-supported) with canvas coordinate fallback.
- [ ] **Adobe Swatch Exchange (ASE) Export**: Binary `.ase` file generation for direct import into Adobe Creative Cloud desktop tools.
- [ ] **Tailwind CSS Config Exporter**: Ready-to-paste `tailwind.config.js` color object output.
- [ ] **Individual Swatch Locking**: Pinning specific swatches while re-extracting the remainder of the palette.
- [ ] **Full N×N Contrast Matrix**: Complete inter-swatch matrix checking all palette colors against one another simultaneously.

---

## 8. Technology Stack and Architecture

```
Afterimage Architecture
├── UI Framework: React 18.3.1 (Single Page Application)
├── Type System: TypeScript 5.7.3 (Strict Mode)
├── Build Tooling: Vite 6.1.0 with @vitejs/plugin-react 4.3.4
├── Styling Engine: Tailwind CSS 3.4.17 + PostCSS 8.5.2 + Scoped CSS Custom Properties
├── Iconography: Lucide React 0.475.0
├── Testing Suite: Vitest 3.0.5 + @testing-library/react 16.2.0 + jsdom 26.0.0
└── Image Processing: Native HTML5 Canvas 2D Context + Typed Arrays (Uint8ClampedArray)
```

### Key Architectural Modules

1. **Quantization Pipeline (`src/utils/extractor.ts`)**:
   - Ingests `HTMLImageElement` references and scales dimensions down to a maximum 250px boundary box to bound compute complexity.
   - Reads raw pixel buffers via `ctx.getImageData().data`.
   - Filters out transparent or near-transparent pixels (`alpha < 128`).
   - Recursively splits `ColorBox` structures along the RGB axis exhibiting the widest dynamic range until the target swatch count is achieved.
   - Computes centroid RGB coordinates, deduplicates near-identical colors (distance < 16 in RGB space), and calculates surface mass ratios.

2. **Color Engine (`src/utils/color.ts`)**:
   - Implements bidirectional lossless conversions: `hexToRgb`, `rgbToHex`, `rgbToHsl`, `hslToRgb`, `hslToHex`.
   - Computes relative luminance per W3C specification:
     $$\text{Luminance} = 0.2126 \times R_{\text{linear}} + 0.7152 \times G_{\text{linear}} + 0.0722 \times B_{\text{linear}}$$
     where each 8-bit channel is linearized:
     $$C_{\text{linear}} = \begin{cases} \frac{C_{\text{srgb}}}{12.92} & \text{if } C_{\text{srgb}} \le 0.04045 \\ \left(\frac{C_{\text{srgb}} + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$
   - Evaluates contrast ratios:
     $$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (L_1 > L_2)$$

3. **Token Serializer (`src/utils/exporter.ts`)**:
   - Formats CSS custom properties with companion RGB channels:
     ```css
     /* Afterimage Palette: CSS Custom Properties */
     :root {
       --color-1: #151515;
       --color-2: #FF593D;

       /* RGB channels for opacity composition */
       --color-1-rgb: 21, 21, 21;
       --color-2-rgb: 255, 89, 61;
     }
     ```
   - Formats hierarchical JSON according to the W3C DTCG draft specification:
     ```json
     {
       "$schema": "https://design-tokens.github.io/community-group/format/",
       "name": "Afterimage Palette",
       "generator": "Afterimage v1.0",
       "tokens": {
         "color-1": {
           "value": "#151515",
           "type": "color",
           "$extensions": {
             "rgb": { "r": 21, "g": 21, "b": 21 },
             "hsl": { "h": 0, "s": 0, "l": 8 },
             "percentage": 40
           }
         }
       }
     }
     ```

---

## 9. Installation and Local Development

### Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm**: Version `9.0.0` or higher

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prashantsays69/afterimage.git
   cd afterimage
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173/`. Hot module replacement (HMR) is enabled.

4. **Run the automated test suite**:
   ```bash
   npm test
   ```
   Executes 39 automated unit and component tests via Vitest:
   - `src/test/color.test.ts` (10 tests: conversion math, luminance formulas, WCAG ratios)
   - `src/test/exporter.test.ts` (3 tests: CSS variables, DTCG JSON structure, gradient generation)
   - `src/test/components.test.tsx` (26 tests: UI interaction, keyboard navigation, modal flows, accessibility, scroll reveal)

5. **Build for production**:
   ```bash
   npm run build
   ```
   Runs TypeScript typechecking (`tsc`) and compiles optimized static assets into `dist/`.

6. **Preview the production bundle**:
   ```bash
   npm run preview
   ```

---

## 10. Project Structure

```
Afterimage/
├── .agent/                    # Workspace agent guidelines & skill configs
├── public/                    # Static public assets
│   ├── favicon.svg            # Production color-separation SVG favicon
│   └── robots.txt             # Search indexing rules
├── src/
│   ├── components/            # React UI components
│   │   ├── BrandLogo.tsx      # SVG color-separation identity & wordmark
│   │   ├── ExportModal.tsx    # CSS / DTCG JSON export dialogue
│   │   ├── Header.tsx         # Persistent top navbar with view switcher
│   │   ├── HeroArtworkCard.tsx# 3D pointer-responsive specimen plate
│   │   ├── ImageCanvas.tsx    # Drag-and-drop ingestion & preview canvas
│   │   ├── Inspector.tsx      # HEX/RGB/HSL controls, WCAG matrix, gradient tool
│   │   ├── LandingPage.tsx    # Editorial broadsheet presentation page
│   │   ├── PaletteStrip.tsx   # Tactile swatch strip & reordering controls
│   │   ├── PrivacyPolicy.tsx  # Documented client-side privacy commitments
│   │   ├── ShortcutsModal.tsx # Keyboard navigation reference guide
│   │   ├── TermsAndConditions.tsx # Open-source terms & user IP ownership
│   │   └── Workspace.tsx      # 12-column creative instrument container
│   ├── data/
│   │   └── samples.ts         # Curated architectural & fine art specimen images
│   ├── hooks/
│   │   ├── useClipboard.ts    # Clipboard interaction hook with confirmation badge
│   │   └── useScrollReveal.ts # IntersectionObserver scroll reveal choreography
│   ├── test/
│   │   ├── color.test.ts      # Unit tests for color conversion & contrast math
│   │   ├── components.test.tsx# UI and component integration tests
│   │   ├── exporter.test.ts   # Design token export validation tests
│   │   └── setup.ts           # Vitest environment setup & matchers
│   ├── types/
│   │   └── index.ts           # Core TypeScript interfaces & types
│   ├── utils/
│   │   ├── color.ts           # Math engine: HEX/RGB/HSL, luminance, WCAG
│   │   ├── exporter.ts        # CSS & DTCG token generators and downloaders
│   │   └── extractor.ts       # Canvas median-cut color quantization algorithm
│   ├── App.tsx                # Top-level view routing & modal management
│   ├── index.css              # Global tokens, typography, and motion rules
│   └── main.tsx               # Application bootstrap and DOM mount
├── design.md                  # Authoritative design system specifications
├── index.html                 # Application entry point with Google Fonts preconnect
├── layout.md                  # Layout architecture & spacing documentation
├── motion.md                  # Choreography, timing, & reduced-motion standards
├── package.json               # Dependencies, scripts, and package metadata
├── postcss.config.js          # PostCSS plugins configuration
├── tailwind.config.js         # Tailwind theme extension with design tokens
├── tsconfig.json              # TypeScript strict configuration
├── tsconfig.node.json         # Node TypeScript configuration
└── vite.config.ts             # Vite build & test configuration
```

---

## 11. Privacy, Security, and Limitations

### Verified Privacy Architecture
- **Zero Server Uploads**: When you drop an image into Afterimage, it is converted into a local object URL (`blob:`) in memory. The image data is decoded onto an unmounted HTML5 canvas element inside your browser sandbox.
- **Zero Remote Storage**: Afterimage does not operate a backend database, cloud storage bucket, or API proxy. The moment you refresh, close the tab, or remove the image, the in-memory object URL is revoked via `URL.revokeObjectURL`.
- **Zero Telemetry or Trackers**: The codebase contains zero analytics scripts, advertising pixels, cookie trackers, or external telemetry libraries.
- **External Network Assets**: The application connects to `fonts.googleapis.com` and `fonts.gstatic.com` via preconnect links in `index.html` to load the Space Grotesk, Inter, and IBM Plex Mono web fonts when online. Once cached by the browser, the application functions offline.

### Known Limitations
- **Processing Resolution**: To ensure instant, non-blocking execution across low-powered laptops and mobile devices, images are downsampled to a 250px bounding box before quantization. While this captures macro color masses accurately, micro-details (e.g., a 2-pixel point of light in a large photograph) may be averaged out into surrounding clusters.
- **Vector Graphics (SVG)**: SVG files are rendered to canvas via the browser's native image renderer; complex SVGs with embedded external fonts or non-standard filters may render differently depending on browser SVG engine support.
- **Color Spaces**: Quantization and WCAG calculations currently operate within the standard **sRGB** color space. Display P3 and wide-gamut color spaces are translated to sRGB upon canvas buffer read.

---

## 12. Roadmap

1. **Browser Native Eyedropper API**: Implement native `window.EyeDropper` support for direct pixel sampling across the desktop screen, falling back to canvas coordinate sampling where unsupported.
2. **Adobe Swatch Exchange (`.ase`) Exporter**: Generate binary ASE files to allow one-click palette imports directly into Photoshop, Illustrator, and InDesign swatches panels.
3. **Tailwind CSS Config Exporter**: Provide a dedicated copy tab generating ready-to-paste `theme.extend.colors` objects for Tailwind projects.
4. **Per-Swatch Re-extraction Locking**: Allow designers to pin specific favorite colors while re-running the quantization algorithm on the remaining swatches.
5. **Full N×N Palette Contrast Matrix**: A complete matrix checking every extracted swatch against every other swatch in the palette simultaneously.

---

## 13. License and Credits

### Repository Ownership
- **Project**: Afterimage
- **Repository**: [https://github.com/Prashantsays69/afterimage](https://github.com/Prashantsays69/afterimage)
- **Status**: Private repository as declared in `package.json` (`"private": true`). All rights reserved by the repository owner unless otherwise specified in an accompanying license agreement.

### Typography Credits
- **Space Grotesk**: Designed by Florian Karsten, licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/).
- **Inter**: Designed by Rasmus Andersson, licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/).
- **IBM Plex Mono**: Designed by Mike Abbink and Bold Monday for IBM, licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/).

### Curated Specimen Imagery
- Curated sample photographs bundled in `src/data/samples.ts` are sourced from public domain architectural and fine-art photographic collections, selected for high dynamic range and rich chromatic contrast.
