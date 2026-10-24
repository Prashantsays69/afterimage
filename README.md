# Afterimage

> An editorial, canvas-first image-to-color palette workspace built with React, TypeScript, Vite, and Tailwind CSS.

Afterimage extracts representative, production-ready color palettes from images directly within the browser using canvas-based median-cut quantization. Designed around a brutalist editorial art direction, it treats color as data—pairing tactile swatch editing with mathematically exact WCAG 2.2 contrast validation, a live CSS gradient builder, and deterministic design token exports.

---

## Key Features

- **100% Client-Side Ingestion**: Upload JPEG, PNG, WebP, GIF, or SVG images via drag-and-drop or native file picker. All processing runs locally in browser memory via HTML5 Canvas; no images are ever transmitted over the network.
- **Median-Cut Color Extraction**: Algorithmic color quantization extracts between 3 and 10 dominant colors, correctly ignoring transparent channels and preserving visual balance.
- **Canvas-First Workspace**: A 12-column editorial layout keeping the contained image hero, extracted palette strip, and tool inspector in view simultaneously.
- **Synchronized Color Editing**:
  - Normalized uppercase 6-digit `#RRGGBB` with inline syntax validation.
  - Synchronized RGB channels (0–255).
  - High-precision HSL sliders (0°–360° Hue, 0%–100% Saturation and Lightness).
- **Interactive Palette Strip**: Reorder swatches with dedicated keyboard and arrow controls, add custom swatches, delete swatches, or re-extract directly from the active image.
- **WCAG 2.2 Contrast Matrix**: Computes relative luminance according to the official W3C formula and audits contrast ratios against White (`#FFFFFF`), Paper (`#F2EFE8`), Ink (`#151515`), or any palette color with explicit `PASS` / `FAIL` text badges for Normal AA/AAA and Large AA/AAA text.
- **Gradient Builder**: Configure linear (0°–360°) or radial gradients with multiple palette stops and copy live CSS declarations with one click.
- **Design Token Exporters**:
  - **CSS Custom Properties**: Structured `:root` variables including RGB channels for opacity composition.
  - **JSON Design Tokens**: Standard Design Tokens Community Group (DTCG) specification format.
- **Keyboard Shortcuts & Full Accessibility**:
  - Accessible names for icon controls, visible focus rings (`focus-visible:ring-electric-blue`).
  - Screen reader `aria-live` announcements during extraction and copy actions.
  - Global `prefers-reduced-motion` overrides.
  - Keyboard shortcuts (`?` for help, `O`/`U` for upload, `E` for export, `1`–`9` for quick swatch selection).
- **Curated Offline Samples**: Bundled architectural, botanical cyanotype, and desert vector images allow exploring features immediately.

---

## Design System & Tokens

Afterimage enforces locked design tokens specified in [`design.md`](design.md) and [`motion.md`](motion.md):

| Token | Value | Semantic Role |
| :--- | :--- | :--- |
| `--color-paper` | `#F2EFE8` | Primary page & landing background |
| `--color-ink` | `#151515` | Text, high-contrast dark blocks, active outlines |
| `--color-white` | `#FFFFFF` | Workspace surfaces and inputs |
| `--color-signal-red` | `#FF593D` | Key accent & CTA button hover |
| `--color-electric-blue` | `#2457FF` | Accessible keyboard focus rings |
| `--color-acid-lime` | `#D7FF3F` | Highlight accents |
| `--color-rule` | `#C8C5BD` | 1px editorial borders |
| `--color-muted` | `#77766F` | Metadata and secondary labels |
| `--color-error` | `#B42318` | Validation & destructive states |
| `--color-success` | `#176B45` | Confirmation & contrast pass indicators |

### Typography
- **Display**: Space Grotesk (Weights 600, 700)
- **Body / Interface**: Inter (Weights 400, 500, 600)
- **Technical Readouts**: IBM Plex Mono (Weights 400, 500)

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone or navigate to the project directory
cd Afterimage

# Install dependencies
npm install
```

### Development
Start the local development server with hot module replacement:
```bash
npm run dev
```
Visit `http://localhost:5173/` in your browser.

### Test Suite
Run the Vitest test suite covering color math, WCAG contrast, token generation, and UI interactions:
```bash
npm test
```

### Production Build
Typecheck TypeScript and generate the optimized production bundle in `dist/`:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## Verification & Test Results

The implementation was validated across unit tests, component tests, TypeScript compilation, and browser subagent end-to-end tests:

- **17 / 17 automated tests passing**:
  - HEX normalization (3-digit and 6-digit validation and uppercase formatting).
  - Lossless RGB ↔ HSL ↔ HEX conversions.
  - WCAG 2.2 Relative Luminance and exact contrast ratio math (e.g. Black vs White = 21:1, Ink on Paper > 12:1).
  - AA / AAA normal and large text compliance matrices.
  - CSS custom properties & JSON token generator determinism.
  - Palette reordering, swatch selection, and file format/size validation.
- **Zero TypeScript or Lint Errors**: Strict type checking with `tsc && vite build`.
- **Browser Automation Verification**:
  - Landing page reveal and CTA buttons verified.
  - Workspace canvas-first layout verified.
  - Palette swatch selection, HSL sliders, contrast background switching (`White`, `Paper`, `Ink`), and gradient angle changes tested.
  - Export modal verified with both CSS and JSON outputs.
  - Responsive layout verified on desktop, tablet (768px), and mobile (375px) without horizontal overflow.
  - Clean browser console with zero warnings or runtime exceptions.

---

## Deployment Instructions

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Deploy to Cloudflare Pages / GitHub Pages
Build the project (`npm run build`) and point your hosting provider's build output directory to `dist/`.

---

## Launch Status

- [x] Responsive landing page & canvas-first workspace implemented.
- [x] Local browser-side image processing with Canvas API and Median-Cut quantization.
- [x] Real-time HEX/RGB/HSL editing and swatch reordering.
- [x] WCAG 2.2 contrast validation matrix.
- [x] Live CSS gradient builder.
- [x] CSS custom properties and JSON token exports.
- [x] Complete unit and component test suite (17/17 tests passing).
- [x] Favicon added (`public/favicon.svg`).
- [x] Keyboard accessibility, focus states, and reduced-motion overrides tested.
- [ ] **Launch-Ready Status**: Pending custom domain connection and live production deployment verification (as mandated by [`design.md`](design.md)).
