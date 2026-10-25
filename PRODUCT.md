# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Designers, art directors, and creative technologists working with visual references, photography, or moodboards who need to extract, refine, and export cohesive, production-grade color systems directly into design and development workflows.

## Product Purpose

Afterimage is an editorial color exploration instrument that transforms photographic and visual imagery into considered, production-ready color palettes. Success means providing creative professionals with a fast, tactile, and precise environment to discover color relationships, evaluate contrast and harmony, generate gradients, and export tokens without cognitive friction or generic dashboard conventions.

## Positioning

A tactile, client-side editorial color instrument with zero cloud dependencies, zero telemetry, and private in-browser extraction. Unlike generic SaaS palette generators or template galleries, Afterimage treats image color extraction as an art-directed study of light, hierarchy, and material contrast.

## Operating Context

In-browser web application (optimized for desktop and fully responsive on mobile viewports) used alongside creative software (Figma, creative coding tools) and frontend engineering workflows. Evaluates local user images via drag-and-drop or file upload, as well as bundled curated editorial samples.

## Capabilities and Constraints

### Confirmed Capabilities
- Client-side image upload and validation (PNG, JPG, WebP) with instant preview.
- Curated sample library with pre-extracted editorial palettes.
- Color quantization and palette extraction into an interactive palette strip.
- Color inspection across HEX, RGB, and HSL formats with descriptive naming.
- WCAG AA / AAA contrast validation for normal and large text.
- Gradient builder supporting linear and radial modes with custom angle and stops.
- Export to CSS custom properties and JSON design tokens with clipboard and download support.
- Full keyboard shortcuts support (`?` modal, tab-accessible controls, skip-to-content).

### Technical & Architectural Constraints
- Purely client-side execution: no server-side image processing, external database, or tracking.
- SPA stack: React 18, TypeScript, Vite, Tailwind CSS.

## Brand Commitments

- Name: Afterimage.
- Voice: Editorial, precise, technical, restrained. Avoids vague SaaS marketing claims, buzzwords, and unprompted AI tropes.
- Approved Core Copy:
  - Eyebrow: `IMAGE → COLOR SYSTEM`
  - Headline: `Find the colors hiding in your images.`
  - Supporting copy: `Extract, refine, test, and export a palette from any image.`
  - Primary CTA: `Extract a palette`
  - Secondary CTA: `Explore the workspace`

## Evidence on Hand

- Curated photography samples and preset palettes in [src/data/samples.ts](file:///c:/Users/Prash/Downloads/Afterimage/src/data/samples.ts).
- Established visual design system and anti-slop rules in [DESIGN.md](file:///c:/Users/Prash/Downloads/Afterimage/DESIGN.md).
- Animation standards and motion values in [motion.md](file:///c:/Users/Prash/Downloads/Afterimage/motion.md).
- Working implementation of color extraction and inspection in [src/](file:///c:/Users/Prash/Downloads/Afterimage/src/).

## Product Principles

- **Image first, interface second:** The source image and its extracted color relationships are the protagonists; interface chrome recedes to enable focused inspection.
- **Client-side immediacy and privacy:** All extraction, mathematical analysis, and token generation happen instantaneously in-browser without sending user assets over the wire.
- **Precision over novelty:** Swatches, contrast ratios, and color values are technically accurate and directly exportable to production design systems.
- **Editorial discipline:** Every surface, layout transition, and interaction reflects intentional art direction rather than off-the-shelf component templates.

## Accessibility & Inclusion

- WCAG AA minimum contrast ratio for interface typography and interactive states.
- Built-in contrast testing tools evaluating normal and large text against WCAG AA and AAA thresholds.
- Full keyboard navigation with skip links and a designated shortcuts guide.
- Respect for `prefers-reduced-motion` across all CSS and JS interactions.
