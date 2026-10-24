# Afterimage Design System

**Version:** 2.0\
**Status:** Creative direction for implementation\
**Product:** Afterimage, an image-to-color palette workspace

## Creative decision

Afterimage will combine three reference principles:

-   **Lusion** --- spatial depth, material-aware 3D composition,
    deliberate lighting.
-   **Obys Agency** --- oversized editorial typography, asymmetrical
    composition, typographic confidence.
-   **Locomotive** --- cohesive page rhythm, transitions between
    sections, interaction that feels art-directed.

References are for principles only. Do not copy their layouts, assets,
source code, signature experiences, or brand identity.

**Creative thesis:** *An editorial color instrument.* The landing page
should feel like a printed art-direction spread brought into motion; the
workspace should feel like a precise, tactile studio tool.

## 1. Product and visual goals

Afterimage turns an image into an editable color system. The experience
should be distinctive, image-led, expressive, useful, and fast.

Priorities: 1. Clear product understanding in the first viewport. 2. A
memorable custom hero with convincing depth. 3. Strong typography and an
intentional grid. 4. Motion with a beginning, rhythm, and purpose. 5. A
calm, efficient workspace that protects the accuracy of image and color
data.

Do not redesign the working product features just to make the landing
page more impressive.

## 2. Art direction

### Overall character

-   Editorial brutalism with warmth: paper-like background, ink
    typography, sharp geometry, asymmetry, precise rules.
-   Treat color swatches as specimens and the uploaded image as source
    material.
-   Prefer strong silhouette, scale, crop, negative space, and
    composition over decorative effects.
-   Use a few deliberate oversized elements rather than many small
    decorative objects.
-   Keep the interface light-theme only for this version.

### Hard bans

-   No purple, violet, or deep indigo as default accents.
-   No decorative gradients on text, buttons, icons, or full-page
    backgrounds.
-   No glowing orbs, radial auras, neon rims, fake holograms, blurred
    glass cards, or generic "AI" visual motifs.
-   No pill-shaped buttons, emoji icons, custom cursor, fake
    testimonials, fake metrics, fake customer counts, vague hero copy,
    or unwanted "Made with AI" branding.
-   No perpetual floating loops, excessive parallax, scroll-jacking, or
    motion that delays access to the tool.
-   No stock imagery unrelated to image-to-color work.
-   Do not use em dashes in product copy.

## 3. Design tokens

Use CSS custom properties and centralize all tokens.

``` css
:root {
  color-scheme: light;
  --color-ink: #151515;
  --color-paper: #F2EFE8;
  --color-white: #FFFFFF;
  --color-signal-red: #FF593D;
  --color-acid-lime: #D7FF3F;
  --color-electric-blue: #2457FF;
  --color-muted: #77766F;
  --color-rule: #C8C5BD;
  --color-rule-dark: #393939;
  --color-error: #B42318;
  --color-success: #176B45;

  --font-display: "Space Grotesk", "Arial", sans-serif;
  --font-body: "Inter", "Helvetica Neue", sans-serif;
  --font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;

  --page-gutter: clamp(16px, 3vw, 44px);
  --content-max: 1440px;
  --rule-width: 1px;
  --corner-sharp: 0px;
}
```

### Token usage

-   Paper is the primary landing background.
-   Ink is the main text and dark-block color.
-   White is reserved for workspace surfaces and useful contrast.
-   Signal red is the primary action accent and a limited editorial
    mark.
-   Acid lime is a rare highlight or selected-state fill, not a page
    background.
-   Electric blue is for focus, links, or a restrained secondary accent.
-   Muted text must be contrast-tested; use a darker value if small text
    fails WCAG AA.
-   Use rules and whitespace to define sections instead of shadows on
    every card.

## 4. Typography system

### Font roles

-   **Space Grotesk, 600--700:** wordmark, display headlines, section
    headlines.
-   **Inter, 400--600:** body copy, navigation, controls, helper text.
-   **IBM Plex Mono, 400--500:** HEX/RGB values, dimensions, labels,
    technical metadata.

Use a reliable font-loading strategy with fallbacks. Avoid layout shift
while fonts load.

### Type behavior

-   Headlines should be oversized, tightly tracked, and intentionally
    broken across lines.
-   Use line breaks as composition, not as an automatic responsive wrap
    only.
-   Use uppercase for short labels and metadata, never long paragraphs.
-   Use monospaced values to make color data feel precise and easy to
    compare.
-   Make the first viewport typographically distinctive before adding
    extra effects.
-   Do not animate every word. Choose one headline reveal treatment and
    keep supporting type quieter.

Suggested responsive display size: `clamp(3.5rem, 9.5vw, 9rem)`, with
line-height between `0.88` and `1.0`. Adjust to the existing headline
and layout; do not force overflow.

## 5. Landing-page composition

Detailed section sequence is defined in `layout.md`. Core principles:

-   Use a 12-column desktop grid with asymmetry and consistent
    alignment.
-   Content max width: approximately 1440px; page gutters scale from
    16px on mobile to 44px on wide screens.
-   Use thin rules, short labels, and intentional empty space.
-   The hero should contain the clearest headline, one concise
    explanation, one primary action, and one custom artwork composition.
-   The product preview must visibly demonstrate image-to-palette
    transformation.
-   The hero artwork must not obstruct the headline or CTA.
-   Keep the first viewport strong even if motion is disabled or scripts
    fail.

Recommended hero copy: - Eyebrow: `IMAGE → COLOR SYSTEM` - Headline:
`Find the colors hiding in your images.` - Supporting copy:
`Extract, refine, test, and export a palette from any image.` - Primary
CTA: `Extract a palette` - Secondary link: `Explore the workspace`

Only claim that files stay on-device or processing happens in the
browser if verified in the implementation.

## 6. Signature hero: the color specimen

Create one original, recognizable composition tied directly to the
product. Do not use an unrelated 3D object as decoration.

### Composition

-   A central cropped image plane acts as the source.
-   A small number of offset color planes or sample strips emerge from
    that image, visually suggesting extraction.
-   Include 2--4 meaningful depth layers total. Avoid clutter.
-   The composition should feel like a tactile editorial still life:
    crisp edges, matte surfaces, restrained specular highlights,
    carefully placed shadows, deliberate occlusion.
-   Use the existing red, lime, and blue accents sparingly alongside
    image-derived colors.
-   Give the artwork a strong silhouette and clear focal point at
    desktop and mobile sizes.
-   Prefer CSS perspective and layered transforms when they deliver the
    effect. Use actual WebGL/3D only if the repository already supports
    it or a clear visual need justifies the dependency.

### Material and lighting

-   Use directional studio-style light, soft contact shadows, and subtle
    edge separation.
-   Avoid plastic-looking generic blobs, excessive reflections, bloom,
    glow, and sci-fi lighting.
-   Shadows should establish contact and depth, not float every object.
-   The static resting state must look intentional, not like a paused
    animation.

### Responsiveness

-   Desktop: asymmetrical, large-scale composition with visible overlap.
-   Tablet: reduce the number of layers and preserve the main
    silhouette.
-   Mobile: use a deliberate stacked/cropped composition. Disable
    pointer-driven tilt on touch devices. Never simply shrink the entire
    desktop scene until it becomes cramped.

## 7. Landing page versus workspace

### Landing page

Expressive, editorial, memorable. Motion and spatial artwork may be
prominent but should never obscure the product message or CTA.

### Workspace

Calm, accurate, and efficient. The image canvas is the primary visual
area. Keep the palette close to the image, with technical controls in a
clearly separated inspector. No perspective tilt on uploaded images,
form controls, menus, values, or the workspace as a whole.

Preserve and test existing features: - Image upload and extraction -
Editable/reorderable palette if already supported - HEX/RGB copy - WCAG
contrast checker - Gradient builder - CSS variables and JSON token
export - Loading, empty, error, success, and copy-confirmation states

Do not remove a working feature because it complicates the redesign.

## 8. Interaction states

Every interactive element needs distinct default, hover, focus-visible,
active, disabled, and relevant success/error states.

-   Buttons: square-cornered, clear label, tactile press feedback.
-   Swatches: show value and selected state; copying gives a concise
    confirmation.
-   Cards: subtle border/background response, not a dramatic scale or
    glow.
-   Inputs: stable dimensions and strong focus ring.
-   Export: immediate feedback, clear success/error state.
-   Upload: drag-over state and readable processing/error messaging.

Motion must not be the only way to communicate state. Keep keyboard
navigation and focus rings obvious.

## 9. Accessibility and quality

-   Meet WCAG 2.2 AA for text and interactive controls.
-   Check all actual foreground/background combinations, including muted
    labels and accent fills.
-   Respect `prefers-reduced-motion`.
-   Keep semantic headings, labels, accessible names, and keyboard
    behavior.
-   Never hide essential content until an animation completes.
-   Avoid layout shifts and horizontal overflow.
-   Keep the app responsive at 320px, 375px, 768px, 1024px, and wide
    desktop sizes.

## 10. Implementation constraints

-   Inspect the repository and current implementation before editing.
-   Reuse existing components and dependencies when reasonable.
-   Do not replace the app with a static mockup or rebuild the stack
    without a demonstrated need.
-   Keep tokens centralized and document any new token.
-   Prefer CSS transforms and opacity for motion.
-   Do not add heavy dependencies simply to create a tilt effect.
-   Keep performance, accessibility, and working product features ahead
    of visual novelty.

## 11. Acceptance checklist

-   [ ] The first viewport has a distinct editorial hierarchy and a
    memorable custom hero.
-   [ ] The hero clearly connects image input to color extraction.
-   [ ] Depth is visible in the resting composition, not dependent on
    animation alone.
-   [ ] Typography, grid, and negative space feel art-directed rather
    than template-generated.
-   [ ] The landing page is expressive while the workspace remains calm
    and usable.
-   [ ] No banned visual patterns are introduced.
-   [ ] All existing product features still work.
-   [ ] Reduced-motion, keyboard, mobile, and contrast checks pass.
-   [ ] The build and available tests pass.
-   [ ] Do not call the product launch-ready until a custom domain is
    connected, favicon exists, and privacy/terms pages are present.
