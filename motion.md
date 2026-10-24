# Afterimage Motion System

**Version:** 2.0\
**Status:** Implementation specification\
**Direction:** Editorial choreography, spatial depth, tactile product
feedback

## Reference principles

-   **Lusion:** spatial depth, deliberate materials, restrained
    lighting.
-   **Obys Agency:** typographic entrances and editorial pacing.
-   **Locomotive:** cohesive section transitions and page rhythm.

Use these as principles, not as a request to copy any specific animation
or site.

## 1. Motion intent

Motion should make Afterimage feel authored and tactile. It should
establish hierarchy, communicate state, or clarify a spatial
relationship. Avoid adding motion simply to make the page appear busy.

The experience should have three distinct motion layers: 1. **Hero
choreography:** a clear, one-time opening sequence. 2. **Spatial
interaction:** a visible but restrained response to pointer movement on
the hero artwork. 3. **Product feedback:** short transitions for
palette, upload, selection, copy, contrast, gradient, and export states.

The workspace must remain fast and usable. Never delay an action to
finish an animation.

## 2. Timing and easing tokens

``` css
:root {
  --motion-instant: 100ms;
  --motion-fast: 140ms;
  --motion-standard: 180ms;
  --motion-panel: 260ms;
  --motion-reveal: 520ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}
```

-   100ms: pressed state or tiny icon response.
-   140ms: hover and drag-over feedback.
-   180ms: swatch selection, border/background change, disclosure.
-   260ms: panel or section transition.
-   420--520ms: one-time hero choreography.
-   Avoid normal UI transitions longer than 300ms.
-   Avoid elastic, bounce, exaggerated overshoot, and dramatic spring
    motion.

## 3. Initial hero choreography

Create a coordinated sequence, not a pile of unrelated fades.

1.  **Headline reveal:** one or two intentional lines enter with a
    clipped reveal or opacity plus a small upward transform. Duration
    420--520ms. Maximum line stagger 70ms. Keep movement under 14px.
2.  **Supporting copy and CTA:** become visible shortly after the
    headline starts. CTA is clickable from first paint; never block
    interaction.
3.  **Artwork reveal:** reveal the image/color specimen with a clean
    rectangular mask or opacity and a subtle 6--10px rise. Start
    approximately 80--120ms after the headline.
4.  **Color strips/swatches:** reveal in a short 25--40ms stagger,
    capped at 180ms total delay.
5.  **Settle:** finish in the designed resting state. No perpetual idle
    loop or automatic repeated motion.

Keep the sequence under roughly 800ms from first visible motion to
settled state. Avoid animating every word, nav item, card, and footer
link.

## 4. Spatial hero interaction

The hero must have convincing depth in its static composition and become
more tactile on interaction.

### Pointer behavior

-   Apply only to the decorative hero composition, never the whole page.
-   Use CSS perspective in the approximate 900--1200px range.
-   Clamp rotation to about 3--5 degrees maximum per axis.
-   Use 2--4 meaningful layers with small differential transforms.
-   If appropriate, vary shadow/contact depth slightly with pointer
    position; do not add glow.
-   Use smooth response without lag. On pointer leave, return to neutral
    within 220--280ms.
-   Pointer response must not interfere with CTA, links, or other
    controls.
-   Do not attach a global mouse-following decoration or custom cursor.
-   Avoid continuous requestAnimationFrame loops when the pointer is
    idle. Prefer CSS variables or lightweight handlers.
-   If React is used, do not trigger full component-tree renders on
    every pointer movement.

### Reduced motion and touch

-   Disable pointer tilt when `prefers-reduced-motion: reduce` is
    active.
-   Disable tilt for touch-first devices or coarse pointers.
-   Keep a visually complete static composition for those users.
-   Keyboard focus must never depend on pointer movement.

## 5. Scroll and section choreography

Motion should connect sections into a coherent page rhythm without
turning scrolling into a performance.

-   Use reveals only for selected major sections and meaningful groups.
-   Prefer opacity plus `translateY(6–10px)`, duration 220--300ms.
-   Trigger once as content enters the viewport. Do not replay
    continuously when scrolling up/down.
-   Stagger grouped cards by 25--45ms, capped at 160ms total.
-   Do not animate every paragraph, label, navigation item, or footer
    link.
-   Do not use scroll-jacking, pinned sections that trap the user, or
    scroll-linked effects that make the page difficult to navigate.
-   Use IntersectionObserver only as progressive enhancement. If it
    fails or JS does not run, content must remain visible.

## 6. Product interaction motion

### Upload

-   Drag-over: 140ms border and subtle background change.
-   Processing: show an immediate, accessible status and a clear
    progress indication if actual progress is available.
-   Invalid file: show inline error. Do not shake the page.
-   Success: reveal the extracted palette after processing completes; do
    not fabricate processing progress.

### Palette swatches

-   Hover: subtle border/background or 1--2px lift at most. No large
    scaling.
-   Selected: visible outline, border, or marker; selection must not
    rely on color alone.
-   Copy: copy action happens immediately; confirmation may use a short
    label/icon transition.
-   Reorder, if supported: clear drag affordance and stable target
    indication.
-   Color values must remain readable and must not animate through false
    intermediate colors.

### Workspace panels

-   Open/close or disclosure: 180--260ms using opacity/transform where
    suitable.
-   Preserve layout stability. Avoid making the inspector jump or the
    canvas resize unexpectedly.
-   Do not tilt the image, inspector, or entire workspace.

### Contrast checker

-   Update results promptly when inputs change.
-   If the pass/fail state changes, use a restrained indicator
    transition and update readable text.
-   Do not use color alone to signal pass/fail.

### Gradient builder

-   Gradient preview may update with the actual selected colors and
    settings.
-   Do not animate hue through unrelated colors during ordinary updates.
-   Keep controls immediate and preserve keyboard interaction.

### Export and copy

-   Trigger export/copy immediately.
-   Show a concise success or error message with an appropriate
    live-region announcement.
-   Do not make users wait for a celebratory animation.

## 7. Reduced-motion implementation

Use `@media (prefers-reduced-motion: reduce)` to remove nonessential
transforms, staggered entrances, and scroll reveals. Keep state feedback
and clear focus/selection indicators.

Do not set all transitions to zero if that makes state changes
confusing; use immediate or very short changes where necessary.

Content must be visible by default. Do not apply hidden initial styles
unless motion support is active and the content has a safe fallback.

## 8. Performance rules

-   Prefer transform and opacity; avoid animating layout-heavy
    properties.
-   Avoid large blurred shadows, backdrop filters, and full-screen
    animated layers.
-   Avoid introducing a WebGL library solely for pointer tilt.
-   Respect `will-change` sparingly and only while useful.
-   Avoid hydration/layout shifts caused by font or image loading.
-   Keep mobile interactions lightweight and static where appropriate.
-   Check the console for errors and test on a mid-range device or
    CPU-throttled mode if available.

## 9. Motion QA checklist

-   [ ] Headline/artwork sequence is noticeable and feels intentional,
    not generic.
-   [ ] Hero has visible depth at rest and clear pointer response on a
    fine pointer.
-   [ ] Hero resets smoothly on pointer leave.
-   [ ] Pointer movement does not interfere with clicks or text
    selection.
-   [ ] No perpetual floating animation or decorative loop.
-   [ ] Scroll reveals happen once and never hide content on failure.
-   [ ] Palette selection, copy, upload, contrast, gradient, and export
    states respond correctly.
-   [ ] Reduced-motion mode disables nonessential motion.
-   [ ] Touch and keyboard users have complete interactions.
-   [ ] No console errors, obvious frame drops, or content layout
    shifts.
