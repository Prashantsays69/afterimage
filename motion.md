# AFTERIMAGE — MOTION SYSTEM
Version: 3.0  
Pairs with: `design.md` and `layout.md`

## 1. Motion philosophy

Afterimage uses **editorial choreography rather than generic SaaS animation**. Motion is treated as physical printing plate registration and architectural precision:
- Motion communicates hierarchy, cause and effect, state change, and spatial relationships.
- Every animation must have an unambiguous functional purpose.
- The interface must remain completely clear and useful without animation.
- The static design is sovereign; motion reveals and acknowledges, but never compensates for a weak layout.
- No artificial waiting: never delay user actions, progress indicators, or results for decorative pacing.

The product feels like a carefully calibrated instrument in a Swiss typography workshop, not a motion-design portfolio demo.

## 2. Hard restrictions

Do not use:
- Continuous floating, hovering, or bobbing loops.
- Decorative glowing orbs, aura graphics, or blurred radial gradients.
- Cursor trails, custom cursors, or cursor-following decorations.
- Scroll-jacking, sticky canvas takeover, or parallax that changes the user's sense of scroll position.
- Large elastic/bouncy easing, spring overshoot, or physics wobbles.
- Long entrance animations that delay access to content or CTAs.
- Repeated reveal animations on every small element.
- Animation that blocks image upload, editing, inspection, navigation, or export.
- Motion that is required to understand the page.
- Automatic motion that ignores `prefers-reduced-motion`.
- Any external motion library (Framer Motion, GSAP, etc.) when CSS transitions, keyframes, and native observers deliver zero runtime overhead and 60fps performance.

## 3. Motion tokens & CSS architecture

Centralized CSS custom properties defined in `:root` (`src/index.css`):

### Duration tokens

| Token | CSS Variable | Duration | Target Range | Functional Application |
|---|---|---:|:---:|---|
| Micro-instant | `--motion-instant` | 100ms | 100–160ms | Active press, tactile tap, toggle switches, tiny state change |
| Micro-fast | `--motion-fast` | 140ms | 100–160ms | Swatch hover/focus ring, button hover background, checkmark pop |
| Standard | `--motion-standard` | 180ms | 180–280ms | Color inspector transitions, slider response, tab switches |
| Panel / State | `--motion-panel` | 260ms | 180–280ms | Dialog popover, accordion expand, specimen tilt return |
| Section Entrance | `--motion-section` | 650ms | 600–700ms | Viewport scroll reveals (`.scroll-reveal-container`, 20px travel) |
| Hero Choreography | `--motion-hero` | 700ms | 650–750ms | Coordinated broadsheet entrance sequence |
| Stagger Interval | `--motion-stagger` | 120ms | 100–140ms | Interval between staggered elements (headline lines, action ledger) |

### Easing tokens

Restrained, intentional cubic-bezier curves that emulate physical mass settling into place. Exaggerated bounce, rubber-band recoil, and cartoon spring presets are forbidden.

```css
:root {
  /* Standard curve: for in-place transitions, hovers, color shifts */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Enter curve: controlled editorial ease-out with smooth deceleration (no spring/bounce) */
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);

  /* Godmode Editorial curve: rapid initial acceleration with an extended, silky deceleration */
  --ease-editorial: cubic-bezier(0.16, 1, 0.3, 1);

  /* Exit curve: clean acceleration out of frame */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Linear: for continuous pointer tracking only */
  --ease-linear: linear;
}
```

Avoid long delays and chained sequences. The primary content and actions must be interactive immediately on mount.

## 4. Animation specifications matrix

Every interactive component and animated surface has a documented trigger, visual response, timing budget, and graceful fallback:

| Interaction / Area | Trigger | Visual Response | Approx. Duration | Fallback Behavior |
|---|---|---|---:|---|
| **Hero entrance choreography** | Initial page mount (once) | Masthead eyebrow fades in (400ms); Tier 1 specimen folio ledger articulates (450ms); monumental display headline unmasks across 3 lines through overflow letterbox slits (`Find the colors` 80ms delay, `hiding in your` 200ms delay, `images.` 320ms delay, 750ms duration `--ease-editorial`); archival specimen artwork settles via subtle editorial reveal (`opacity: 0 → 1` and `translateY(8px → 0)`, 750ms duration, 120ms delay, `--ease-editorial`); supporting copy (480ms) and action ledger (450ms) settle in sequence; specimen swatches calibrate into place (240ms). Total sequence: ~940ms. Decoupled from scroll-reveal resets so top browsing never causes re-trigger jumps. | 700–800ms per element | Under `prefers-reduced-motion` or if JS/CSS fails: 0ms duration, opacity 1, full layout rendered statically with zero shift. |
| **Section 02 Spectrum Sheet** | Viewport entry via repeatable `useScrollReveal` | Architectural horizontal rule draws crisply from left (`scaleX(0)` → `scaleX(1)` in 800ms); chromatic columns execute directional ink wipes rising from bottom (`clip-path: inset(100% 0 0 0)` → `inset(0 0 0 0)` and 32px rise) staggered at 60ms intervals (`--col-idx`). Section container remains grounded in document flow. Replays cleanly on re-entry. | 680–800ms (`--motion-section`) | Defaults to `transform: none !important; opacity: 1 !important; clip-path: none !important;` under reduced motion or if JS fails. |
| **Section 03 3-Stage Workflow** | Viewport entry via repeatable `useScrollReveal` | 3 workflow step columns cascade sequentially with 120ms stagger (`--step-idx`), rising 28px over 600ms; monumental display numerals (`01`, `02`, `03`) slide up crisply through letterbox overflow slits (`.workflow-num-reveal`, 680ms). Replays cascade when scrolling back. | 600–680ms per card, 120ms stagger | Renders statically in natural document flow under reduced motion. |
| **Section 04 Curated Studies** | Viewport entry / study sample switch | Study cards cascade into view with staggered entry (`.study-card-reveal`, 140ms interval, 32px rise); switching active study sample triggers an architectural horizontal clip wipe (`.study-content-fade`, 420ms `--ease-editorial`) across artwork and dominant tone mass without flicker; cards have tactile 4px hard shadow on hover; swatch copy triggers animated micro-badge pop (`scale(1.06)` → `scale(1)` in 140ms `--motion-fast`) with `aria-live` announcement. | 420ms study wipe / 140ms micro-pop | Instant text/image swap under reduced motion. |
| **Section 05 Production Dispatch** | Viewport entry via repeatable `useScrollReveal` | Massive brutalist manifesto headline lines slide up and unmask through letterbox slits (`.cta-headline-reveal`, 760ms); grounded action pillar border crisps from rule to high-contrast ink (`.cta-border-reveal`) with 24px rise over 680ms. Replays on re-entry. | 680–760ms | Immediate solid border and unclipped text under reduced motion. |
| **Workspace View Transition** | Navigation (`landing` ↔ `workspace`) | Main view container cross-fades quietly (`.animate-view-fade`) over 180ms (`--motion-standard`), preventing jarring DOM flash without adding navigation delay. | 180ms | Instantaneous route swap without transition under reduced motion. |
| **Modals (Export & Shortcuts)** | Modal open / close | Dark backdrop fades in smoothly (`.animate-backdrop-fade`, 140ms); modal dialog rises 8px into place (`.animate-modal-enter`, 260ms `--motion-panel`). `Escape` dismisses immediately. | 140ms backdrop / 260ms card | Immediate appearance without animation under reduced motion. |
| **Inspector Accordion** | Section toggle click | Chevron arrow rotates smoothly 180° (`.accordion-chevron.is-open`) over 140ms (`--motion-fast`), providing continuous visual feedback. Slider inputs remain 100% synchronous. | 140ms | Instant orientation change under reduced motion. |
| **Workflow card interactions (Sec 03)** | Pointer hover / keyboard focus / tap | Card background transitions from Paper `#F2EFE8` to White `#FFFFFF` with ink border crisping; mono step index pill shifts to inverted ink fill with lime/red numeral; subtle 1px elevation feel without layout shift. | 140ms (`--motion-fast`) | Touch devices: active press state (`:active`). Reduced motion: instant color swap without movement. |
| **Color ledger & swatch interactions (Sec 02, 04, Workspace)** | Pointer hover, click, or keyboard focus | Swatch receives ink border emphasis (`ring-2 ring-ink`), slight scale/elevation (`translateY(-1px)` where unbounded), and immediate HEX tool-call preview. Selection stamps an active check/ring. | 100–140ms (`--motion-instant` to `--motion-fast`) | Non-hover devices: direct tap selection. Keyboard: clear focus ring (`ring-2 ring-electric-blue`). |
| **Buttons, links, and navigation** | Hover, click/press, tap | Buttons use `.tactile-press`: hover shifts surface tone/border; active press applies instant physical travel (`translateY(1px)`); links show rapid color shift and solid underline. | 100ms press / 140ms hover | Reduced motion: transforms disabled; background and border state changes remain fully visible. |
| **Image upload & dropzone** | File drag-over / drop / file pick | Drag-over activates dashed border turning solid Ink with Acid Lime tint (`bg-acid-lime/20`); file drop triggers immediate status transition without artificial delay. | 140ms border/tint transition | Fallback to standard native `<input type="file">` accessible button with full keyboard navigation. |
| **Processing, extraction & loading** | Image decoding / k-means quantization | Accessible screen-reader live region announces status ("Extracting dominant colors..."); canvas renders spinning circular stroke indicator with crisp ink aesthetic; zero synthetic delay—swatches render the instant computation finishes. | Immediate real work time (<200ms) | If JS worker/canvas fails: displays clear editorial error box with alert icon and retry prompt. |
| **Success & error states** | Extraction completion, validation error | Error appears immediately in high-contrast ink/error container with icon and explanatory remediation text; success updates swatches and metadata instantaneously. | Instant (<100ms) | Completely static and readable without requiring dismiss timers. |
| **Export and clipboard feedback** | Swatch click, "Copy All", "Export Tokens" | Active swatch or button displays immediate checkmark icon + "COPIED" state; polite `aria-live` region announces copied HEX code to screen readers; reverts to default after 1800ms. | 140ms transition, 1800ms retention | Keyboard accessible; works via standard Clipboard API with fallback copy textarea. |
| **Focus-visible & keyboard interaction** | Tab key navigation | Unmistakable 2px Electric Blue ring (`ring-2 ring-electric-blue offset-2`) appears instantly on focused interactive elements; disappears on mouse/touch interaction. | Instant (<50ms) | Universal native browser focus outline fallback if Tailwind focus rings are disabled. |
| **Reduced-motion behavior** | `prefers-reduced-motion: reduce` OS setting | All keyframe animations, scroll-reveals, 3D tilts, and transform displacements are completely suppressed (`animation: none !important; transition: none !important; transform: none !important;`). Content is immediately 100% visible. | 0ms | Static layout with 100% feature parity. |
| **Mobile-specific considerations** | Viewports < 768px / touch-first pointers | 3D pointer tilt is disabled (`(hover: hover) and (pointer: fine)` query); tap targets are minimum 44×44px; active touch states provide tactile feedback without sticky hover artifacts; scroll reveals use zero negative margin. | 100–140ms touch tap | Touch feedback without phantom hovers. |

## 5. Hero entrance choreography

The hero broadsheet entrance sequence is authored, memorable, and physically grounded in Swiss editorial typography:
1. **Folio Eyebrow (0ms delay, 400ms duration):** The top architectural masthead bar (`IMAGE → COLOR SYSTEM`, local browser engine badge) fades in quietly with subtle 6px rise.
2. **Specimen Folio Index Ledger (40ms delay, 450ms duration):** The top dividing rule draws across, and the 3 specimen tabs (`01 // ARCHITECTURAL FORM`, `02 // BOTANICAL`, `03 // NATURAL ATMOSPHERE`) unmask their tags and swatch ribbons.
3. **Monumental Display Headline Letterbox Unmasking (80ms, 200ms, 320ms delays, 750ms duration):** The Space Grotesk headline words rise smoothly out of razor line masks (`overflow: hidden` line containers) via `--ease-editorial` (`Find the colors` in Ink, `hiding in your` in Signal Red, `images.` in Ink).
4. **Archival Artwork Specimen Reveal (120ms delay, 750ms duration):** The central architectural specimen plate reveals via compositor-friendly opacity (`0 → 1`) and restrained elevation settling (`translateY(8px → 0)` via `--ease-editorial`), preserving the 3D perspective context (`preserve-3d`), while registration crosshairs (`+`) and datum stamps settle crisply.
5. **Supporting Copy & Actions (360ms & 460ms delays, 480ms / 450ms durations):** The supporting architectural description, validation stamp, and primary action ledger settle in sequence via restrained 6px rise.
6. **Specimen Swatches (240ms duration, 40ms stagger):** Swatches in the specimen plate calibrate into place.
7. **Total Sequence Duration:** ~940ms. Never delays interactivity. Every button and specimen tab is clickable immediately even while the entrance executes.
8. **Independence from Scroll Resets:** The hero entrance runs strictly on initial page mount (single-shot), ensuring that micro-scrolling near the page top never triggers jarring jumps or resets.

## 6. Specimen depth and pointer response

Optional pointer tilt adds a tactile response to the hero specimen for fine pointers:

Architecture & visual layers:
- **Layer 0 (Background Bed):** Architectural recessed mount board (`#EAE7DF` with 800px perspective, fine 2px ink boundary, and corner datum registrations).
- **Layer 1 (Artwork Plane):** Source artwork plate elevated to `translateZ(16px)` with dynamic directional contact shadow, razor matting, and specular sheen responding to pointer angle.
- **Layer 2 (Floating Chromatic Calibration Band):** Extracted palette swatch strip elevated to `translateZ(34px)` with `calc(var(--tilt-x) * 6px)` counter-parallax and crisp 2px contact drop shadows.
- **Layer 3 (Foreground Precision Instrumentation Details):**
  - Registration crosshairs elevated to `translateZ(26px)` with `calc(var(--tilt-x) * 4px)` counter-parallax.
  - Specimen identification stamp elevated to `translateZ(44px)` with `calc(var(--tilt-x) * 8px)` counter-parallax and high-contrast contact drop shadow.
  - Category datum tag elevated to `translateZ(52px)` with `calc(var(--tilt-x) * 10px)` counter-parallax.
  - Interactive workspace inspection prompt elevated to `translateZ(48px)` with `calc(var(--tilt-x) * 9px)` counter-parallax.

Inertia & Motion Mechanics:
- Smooth continuous tracking powered by an internal `requestAnimationFrame` lerp loop (damping factor `0.10`).
- Pointer move updates numerical targets for both 3D rotation (`rx` up to ±6.8°, `ry` up to ±7.8°) and spatial camera orbit translation (`tx` up to ±14px, `ty` up to ±10px) without triggering React re-renders.
- The rAF loop continuously dampens current tilt angles and translations towards target coordinates at native refresh rate (60/120fps).
- On pointer leave, targets reset to rest (0°, 0px) and the card physically glides and settles back to rest with authentic inertia, automatically sleeping the loop when settled within epsilon (<0.005°).
- Enable only for fine pointers and hover-capable devices via `window.matchMedia('(hover: hover) and (pointer: fine)')`.
- Disable automatically on touch-first devices and when `prefers-reduced-motion: reduce` is active.
- Do not use tilt to disguise a flat composition.
- No idle motion, auto-rotation, floating-chip cards, or perpetual floating.

## 7. Hover, focus, and micro-interactions

Interactive controls respond immediately and consistently:
- **Buttons (`.tactile-press`):** Surface, border, or text color shift in 140ms (`--motion-fast`); active press applies a 1px physical press in 100ms (`--motion-instant`).
- **Links:** Clear color transition to Signal Red or underline without shifting surrounding layout.
- **Color swatches (`.tactile-swatch`):**
  - Hover: tactile elevation lift (`transform: translateY(-3px)`), crisp ink border, and solid hard drop shadow (`box-shadow: 0 4px 0 var(--color-ink)`).
  - Selected state (`[aria-selected="true"]`): distinct elevation (`transform: translateY(-2px)`), solid 4px ink shadow, and high-contrast outline.
  - Active tap: physical press (`transform: translateY(0)` with 1px shadow).
- **Copy controls:** Immediate visual swap to checkmark + "COPIED" badge for 1800ms with micro-badge pop (`.animate-copy-pop`), paired with screen-reader announcement.
- **Keyboard focus:** Always visible (`ring-2 ring-electric-blue`), never obscured or animated with distracting blurs.
- **Disabled controls:** Communicated via lowered opacity (30–40%) and `cursor-not-allowed` without pretending to be interactive.

## 8. Workspace and functional state transitions

All functional state transitions in the workspace feel immediate and deterministic:
- **View routing:** Landing page and Workspace swap smoothly with `.animate-view-fade` (180ms `--motion-standard`).
- **Image selected:** Image preview renders immediately; file metadata populated.
- **Processing started:** Processing indicator appears on the canvas; live region announces extraction.
- **Extraction completed:** Color swatches populate the palette strip with `.animate-swatch-entrance`; dominant tone auto-selected in Inspector; processing indicator disappears.
- **Clipboard copy confirmed:** Checkmark feedback displayed with `.animate-copy-pop` for 1800ms; `aria-live` region announces the copied hex.
- **Export initiated:** Backdrop fades in (`.animate-backdrop-fade`, 140ms); modal card rises smoothly with `.animate-modal-enter` (260ms `--motion-panel`); export preview generated synchronously.
- **Validation or processing failed:** Error notification appears promptly in high-contrast alert box with clear corrective guidance.

Never fabricate progress, simulate fake progress bars, delay real results for pacing, or make an unavailable action appear successful.

## 9. Scroll behavior & repeatable viewport reveals

Section reveals use distinct architectural physics and bidirectional repeatability:
- **Section 02:** Clipped section headline reveals through razor line slit (`.section-headline-reveal`); architectural horizontal rule draws cleanly from left (`.scroll-reveal-rule`); chromatic columns execute directional ink wipes from bottom (`.spectrum-column-reveal`) staggered at 45ms.
- **Section 03:** Clipped section headline reveals through razor line slit (`.section-headline-reveal`); 3-stage workflow columns cascade sequentially (`.workflow-step-card`) with 110ms intervals, accompanied by clipped monumental numeral slides (`.workflow-num-reveal`).
- **Section 04:** Clipped section headline reveals through razor line slit (`.section-headline-reveal`); curated studies feature staggered card entries (`.study-card-reveal`), smooth cross-fades when switching active samples (`.study-content-fade`), and micro-badge copy feedback.
- **Section 05:** Production dispatch CTA features monumental headline clipped unmasking (`.cta-headline-reveal`) and high-contrast border crisping (`.cta-border-reveal`).

### Bidirectional Repeatability Mechanics (`useScrollReveal`):
1. **Scrolling Down into Section:** When section enters viewport past `rootMargin` (`-40px` bottom margin), `isRevealed` transitions to `true`, triggering the entrance choreography.
2. **Scrolling Past and Away:** Once the section is completely out of view (`rect.bottom < -20px` when scrolled past downward, or `rect.top > innerHeight + 20px` when scrolled past upward), `isRevealed` resets cleanly to `false`.
3. **Boundary Hysteresis (20px buffer):** The 20px exit buffer prevents boundary oscillation or flickering when scrolling slows or rests near section edges.
4. **Scrolling Back Up into Section:** Entering from the opposite direction sets `isRevealed` to `true` again, replaying the distinct entrance without page reload.
5. **Zero Flicker While Visible:** Descendants are never reset while any part of the section remains in view.
6. **Hero Preservation:** The Hero runs on initial mount only, preventing distracting re-triggers when micro-scrolling near the page top.
7. **Accessibility & Scripting Fallbacks:** Content remains 100% visible if JavaScript is disabled via `@media (scripting: none)` or under `prefers-reduced-motion: reduce`.

## 10. Reduced motion & accessibility architecture

When `prefers-reduced-motion: reduce` is active:
- Pointer tilt and 3D perspective transforms are completely deactivated.
- CSS animations and keyframe sequences are disabled (`animation: none !important; transition: none !important; transform: none !important;`).
- All scroll-reveal containers initialize to `isRevealed: true` without waiting for viewport intersection.
- Focus outlines, active states, and copy confirmations remain fully communicative through color and text changes.
- Zero loss of functionality or product capability.

## 11. Implementation principles & performance

1. **CSS First:** Prefer CSS transitions and keyframes for all styling and motion effects.
2. **Compositor Friendly:** Animate only `transform` and `opacity`. Avoid animating `width`, `height`, `margin`, `padding`, `top`, or `left` to prevent layout reflows.
3. **Native Observers:** Use `IntersectionObserver` with one-time triggers for section reveals; never use scroll event listeners or requestAnimationFrame scroll-tracking.
4. **No Animation Dependencies:** Zero motion libraries added (no Framer Motion, GSAP, Anime.js, or React Spring). Zero bundle bloat.
5. **No Slop:** Never introduce scroll-jacking, aggressive parallax, cursor trails, perpetual floating, glowing orbs, or artificial waiting.
6. **Clean Up:** Clean up event listeners and observers on unmount.
7. **React Performance:** Respect existing React state boundaries; pointer movement and tilt update element styles directly via CSS custom properties and do not trigger full component re-renders.
8. **No Overflow:** Ensure keyframes and transforms do not create horizontal overflow or cover interactive controls.

## 12. Motion acceptance gate

Before calling a motion task complete:
1. Inspect the behavior in a real browser.
2. Verify hover, focus, pointer exit, and any state transition involved.
3. Test touch behavior or emulate a touch viewport.
4. Test `prefers-reduced-motion`.
5. Check that animation does not delay or block product actions.
6. Confirm the page still looks strong when motion is disabled.
7. Report what was actually tested.

Do not claim a motion effect works based only on the code compiling.

## 13. Definition of done

- Motion has a clear purpose and communicates hierarchy.
- Interactions feel immediate, tactile, and controlled.
- No continuous decorative loops, spring overshoot, or glow effects were introduced.
- Reduced-motion preferences are fully respected across CSS and JS.
- Touch and keyboard interactions remain completely usable.
- The static composition remains strong and art-directed.
- Relevant browser checks were performed and reported honestly.
