# AFTERIMAGE — MOTION SYSTEM
Version: 3.0  
Pairs with: `design.md` and `layout.md`

## 1. Motion philosophy

Motion should make Afterimage feel responsive, precise, and tactile. It should clarify relationships, acknowledge actions, and gently reveal the editorial composition.

**The static design must already be strong.** Motion is an enhancement, never a substitute for layout, contrast, image treatment, or hierarchy.

The product should feel like a carefully directed instrument, not a motion-design demo.

## 2. Hard restrictions

Do not use:
- Continuous floating or bobbing loops.
- Decorative glowing orbs, aura effects, or blurred gradients.
- Cursor trails, custom cursors, or cursor-following decorations.
- Scroll-jacking or parallax that changes the user's sense of position.
- Large elastic/bouncy easing.
- Long entrance animations that delay access to content.
- Repeated reveal animations on every small element.
- Animation that blocks upload, editing, navigation, or export.
- Motion that is required to understand the page.
- Automatic motion that ignores `prefers-reduced-motion`.

Do not add a motion library solely for small transitions. Prefer CSS and existing project utilities.

## 3. Timing tokens

Use these as starting points, not as an excuse to animate every element.

| Token | Duration | Use |
|---|---:|---|
| Instant | 100ms | Tiny state feedback |
| Quick | 140ms | Button, swatch, and focus feedback |
| Standard | 180ms | Hover and small UI transitions |
| Enter | 260ms | Panels and local state changes |
| Editorial | 520ms | One-time hero or section entrance, only when needed |

Suggested easing:
- Standard: `cubic-bezier(0.2, 0, 0, 1)`
- Enter: `cubic-bezier(0.16, 1, 0.3, 1)`
- Exit: `cubic-bezier(0.4, 0, 1, 1)`

Avoid long delays and chained sequences. The content should become available immediately.

## 4. Hero entrance

The hero should work without an entrance animation. If an entrance is used:
- Keep it to one short, coordinated sequence.
- Let the headline and specimen settle into place rather than fly across the screen.
- Use a restrained opacity/transform change, with a small distance.
- Avoid animating every label, swatch, and decorative plane independently.
- Do not delay the primary CTA.
- Do not replay the entrance when the user scrolls away and back.

The final resting state is the design target. Judge the hero from a static screenshot as well as in motion.

## 5. Specimen depth and pointer response

Optional pointer tilt can add a tactile response to the hero specimen.

Rules:
- Keep rotation restrained, approximately 3–4 degrees maximum.
- Use perspective only when the existing composition has real, distinct layers.
- Layer movement should be subtle and bounded; do not make labels or swatches drift independently without purpose.
- Update transforms efficiently without triggering React state updates on every pointer event.
- Reset smoothly when the pointer leaves.
- Enable only for fine pointers and hover-capable devices.
- Disable on touch-first devices and when reduced motion is requested.
- Do not use tilt to disguise a flat or weak composition.
- No idle motion, auto-rotation, or perpetual floating.

If the tilt is barely visible in normal use, do not increase it dramatically. Improve the static layer structure instead.

## 6. Hover and focus feedback

Interactive controls should respond quickly and consistently.

- Buttons: subtle surface, border, or position feedback. No glow.
- Links: clear underline or color change that remains accessible.
- Color swatches: visible hover/focus outline and a clear indication of selection.
- Copy/export controls: provide honest confirmation after the action succeeds.
- Keyboard focus: always visible and never represented by motion alone.
- Disabled controls: clearly communicate their state without pretending to be interactive.

Keep transitions generally within 100–180ms for direct interaction. Do not animate layout properties when a transform or opacity change is sufficient.

## 7. Workspace transitions

- Panels may fade or move a few pixels when opening or changing state.
- Keep the main image stable when possible; avoid making the entire workspace jump when a small inspector state changes.
- Palette updates should feel immediate. Do not animate each color so slowly that the tool feels sluggish.
- Loading feedback should communicate real work, not run endlessly after work has finished.
- Error and success states should appear promptly and remain readable.
- Export feedback must reflect the actual result of the export action.

Never delay a user action just to complete a decorative animation.

## 8. Scroll behavior

Use scroll-triggered motion sparingly.

- Most sections should simply appear in the document flow.
- If a reveal materially improves the reading rhythm, use one subtle entrance for the section group.
- Avoid animating every card, heading, paragraph, and swatch independently.
- Do not use pinned sections or scroll hijacking.
- Do not hide essential content until an observer fires.
- Keep the page fully understandable with all motion disabled.

The page should feel art-directed because of its layout and typography, not because content flies into view.

## 9. Reduced motion

When `prefers-reduced-motion: reduce` is active:
- Disable pointer tilt and parallax.
- Remove nonessential entrance and scroll animations.
- Replace large movement with immediate state changes or minimal opacity changes.
- Keep feedback, focus, loading, and success states understandable.
- Do not remove functionality.

Reduced-motion behavior must be tested, not assumed.

## 10. Performance and implementation

- Prefer `transform` and `opacity` for animation.
- Avoid continuous JavaScript animation loops unless essential.
- Avoid forced layout reads/writes during pointer movement.
- Clean up event listeners and observers.
- Do not add a dependency for a small effect.
- Avoid animating large filters, backdrop blur, or expensive shadows on every frame.
- Respect existing React state boundaries; pointer movement should not trigger full component renders.
- Ensure animations do not create horizontal overflow or cover important controls.

## 11. Motion acceptance gate

Before calling a motion task complete:
1. Inspect the behavior in a real browser.
2. Verify hover, focus, pointer exit, and any state transition involved.
3. Test touch behavior or emulate a touch viewport.
4. Test `prefers-reduced-motion`.
5. Check that animation does not delay or block product actions.
6. Confirm the page still looks strong when motion is disabled.
7. Report what was actually tested.

Do not claim a motion effect works based only on the code compiling.

## 12. Definition of done

- Motion has a clear purpose.
- Interactions feel immediate and controlled.
- No continuous decorative loops or glow effects were introduced.
- Reduced-motion preferences are respected.
- Touch and keyboard interactions remain usable.
- The static composition remains strong.
- Relevant browser checks were performed and reported honestly.
