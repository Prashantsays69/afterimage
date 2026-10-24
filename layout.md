# Afterimage Page Layout and Storyboard

**Version:** 2.0\
**Purpose:** Concrete layout plan for implementing the Afterimage
creative direction

## 1. Page story

The page should tell one simple story: an image contains a color system;
Afterimage extracts it; the user refines and exports that system.

Use a small number of sections with a clear editorial rhythm. Do not
turn the landing page into a long generic SaaS marketing template.

## 2. Header

-   Wordmark: `AFTERIMAGE` in Space Grotesk, strong weight, compact.
-   Minimal nav: `Workspace`, `How it works`, and any existing relevant
    links.
-   Primary action: `Extract a palette`.
-   Use a thin bottom rule or strong alignment rather than a floating
    pill navigation.
-   Keep header height compact and stable. On mobile, simplify
    navigation without hiding the main action.

## 3. Hero: editorial poster + color specimen

### Desktop grid

-   Use 12 columns.
-   Left region: headline, short supporting copy, CTA, compact utility
    metadata.
-   Right region: custom spatial color specimen with a source image
    plane and 2--4 related color planes.
-   Allow asymmetry and deliberate overlap, but keep headline and CTA
    unobstructed.
-   The hero should occupy most of the first viewport without requiring
    the user to scroll to understand the product.

### Copy

Eyebrow: `IMAGE → COLOR SYSTEM`\
Headline: `Find the colors hiding in your images.`\
Body: `Extract, refine, test, and export a palette from any image.`\
Primary CTA: `Extract a palette`\
Secondary link: `Explore the workspace`

Do not add claims about local processing, privacy, speed, or supported
formats unless confirmed in code.

### Artwork composition

-   Use a real sample image already in the project if one exists;
    otherwise create or compose a product-relevant visual from existing
    assets.
-   Show a visible relationship between the source image and extracted
    color strips.
-   Use sharp-edged image crops, paper/ink planes, restrained shadows,
    and a clear visual hierarchy.
-   The hero must still look complete without motion.
-   Do not insert unrelated 3D shapes just to look impressive.

## 4. Product proof section

Place a thin rule and a compact section label after the hero, then show
a product preview that communicates the workflow.

-   Large source image or canvas.
-   Palette strip directly connected to the image.
-   A small technical panel showing actual color values.
-   If the app already supports an interactive example, reuse it. Do not
    build a fake screenshot or nonfunctional demo.

This section should visually bridge the expressive landing hero and the
practical workspace.

## 5. How it works

Use three steps, preferably in one row on desktop and stacked on
mobile: 1. `01 / Choose an image` 2. `02 / Refine the palette` 3.
`03 / Export your colors`

Keep descriptions short and concrete. Use typography, rules, and layout
rather than generic icons. Avoid animating every step separately; reveal
the group once if motion is enabled.

## 6. Workspace entry

Show the real workspace, or a clearly labeled link to it, with a large
image/canvas area and palette. The transition from landing page to tool
should feel like entering the same product, not switching to an
unrelated dashboard.

## 7. Workspace layout

### Desktop

-   Main canvas occupies approximately 60--70% of the working area.
-   Palette is close to the image, preferably beneath it or directly
    adjacent.
-   Inspector occupies a stable side column.
-   Color values use IBM Plex Mono.
-   Use rules and grouped labels to structure controls; avoid nested
    card-on-card UI.
-   Keep export and copy actions easy to find.

### Tablet

-   Preserve canvas priority.
-   Inspector may move below the canvas or into a clearly accessible
    collapsible section.
-   Avoid squeezing three dense columns together.

### Mobile

-   Stack: source image, palette, then tools.
-   Keep the upload action visible and large enough to use.
-   Avoid horizontal scrolling for the core workflow.
-   Make swatches large enough to tap and color values readable.
-   Disable pointer tilt.

## 8. Footer

Keep it compact and useful: wordmark, short product description if
needed, links to privacy and terms when present, and project/source link
if appropriate. No fake social proof, fake counters, or filler slogans.

## 9. Responsive checkpoints

Test at widths of 320px, 375px, 768px, 1024px, and 1440px or wider.

At every size verify: - No horizontal overflow. - Headline line breaks
remain intentional. - Artwork does not collide with text or CTA. -
Navigation remains usable. - Workspace image and palette remain easy to
scan. - Inspector controls do not become cramped. - Reduced-motion mode
retains the intended visual hierarchy.

## 10. Acceptance test

A first-time visitor should understand within five seconds: - This
product extracts colors from images. - The palette is editable/useful,
not just decorative. - There is an obvious way to start. - The visual
identity is editorial, spatial, and distinct from a generic SaaS
template.
