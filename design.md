# AFTERIMAGE — DESIGN SYSTEM
Version: 3.0  
Status: Canonical visual direction  
Product: Afterimage, an image-to-color exploration workspace

## 1. The idea

**Afterimage is an editorial color instrument.** It turns an image into a considered color system. The experience should feel like a printed art-direction spread made interactive: bold, tactile, precise, surprising, and unmistakably designed.

This is not a generic SaaS landing page, an AI dashboard, or a template gallery. The visual identity comes from composition, typography, image-making, material contrast, and disciplined use of color.

### The intended emotional response
- First glance: “This looks art-directed.”
- Second glance: “The image and its colors are the product.”
- First interaction: “This feels precise and responsive.”
- Workspace: “I can focus and get useful work done.”

## 2. Non-negotiable visual principles

1. **Composition before decoration.** A strong silhouette, scale contrast, cropping, and negative space must carry the design before shadows or animation are added.
2. **Image first, interface second.** The source image and extracted palette must be the visual protagonists.
3. **Editorial, not dashboard-like.** Use asymmetry, oversized type, unexpected alignment, strong rules, and purposeful changes in density.
4. **Tactile, not skeuomorphic.** Flat color planes, matte surfaces, fine borders, and controlled contact shadows can imply physical layers without pretending the UI is a physical device.
5. **Useful precision.** Every label, swatch, control, and state should have a clear job.
6. **Distinct section identities.** Do not repeat the same bordered-card pattern in every section.
7. **Motion supports composition.** Animation must never be needed to make an otherwise ordinary layout feel interesting.
8. **Functionality is sacred.** Art direction must not break upload, extraction, editing, export, routing, keyboard access, or responsive behavior.

## 3. Anti-slop rules: hard failures

Never introduce these unless the product owner explicitly requests them:

- Purple, neon violet, or deep indigo as default primary/accent colors.
- Decorative gradients on text, buttons, icons, or main backgrounds.
- Glowing orbs, radial aura graphics, blur-behind accents, or magical glassmorphism.
- Pill-shaped buttons or pill-shaped cards as the default design language.
- Emoji used as interface icons.
- Fake reviews, fake customer counts, fake activity, fake performance numbers, or invented testimonials.
- Vague hero copy such as “Unlock your creativity” or “The future of design.”
- Generic AI-generated stock imagery, fake product screenshots, or invented product capabilities.
- Cursor-following effects, custom animated cursors, excessive parallax, scroll-jacking, or continuous floating loops.
- Heavy scroll reveals on every element.
- Unrequested “Made with AI” branding.
- Em dashes in product UI copy. Prefer a comma, colon, or full stop.
- Decorative complexity that reduces legibility or makes the interface harder to use.

Do not solve a weak layout by adding more effects.

## 4. Color tokens

Use these tokens consistently. Do not invent a second competing palette.

| Token | Value | Role |
|---|---|---|
| Ink | `#151515` | Main text, strong surfaces |
| Paper | `#F2EFE8` | Primary light canvas |
| White | `#FFFFFF` | Clean surfaces and contrast |
| Signal red | `#FF593D` | Primary expressive accent |
| Acid lime | `#D7FF3F` | Small, deliberate emphasis |
| Electric blue | `#2457FF` | Secondary accent, used sparingly |
| Muted | `#77766F` | Secondary text |
| Rule | `#C8C5BD` | Light dividers and borders |
| Dark rule | `#393939` | Borders on dark surfaces |
| Error | `#B42318` | Error states |
| Success | `#176B45` | Success states |

### Color usage rules
- Paper and ink form the foundation.
- Signal red is the signature accent. Lime and blue are supporting accents, not competing primaries.
- Use color blocks as compositional elements, not as decoration without purpose.
- Preserve contrast and meaning in all states.
- Extracted palette colors come from actual user images and must not be replaced with invented sample values in real product flows.
- Do not use gradients as a shortcut for visual depth.

## 5. Typography

Preferred families:
- **Space Grotesk:** display headlines and prominent editorial statements.
- **Inter:** interface text, body copy, form labels, and controls.
- **IBM Plex Mono:** metadata, indices, technical values, small labels, and color values.

### Hierarchy
- Display type should be large enough to establish a clear focal point, with intentional line breaks and compact leading.
- Body copy should be short, concrete, and readable.
- Metadata should feel technical and quiet, not compete with the headline.
- Use uppercase mono labels sparingly for section markers and small annotations.
- Do not make every element uppercase or letter-spaced.
- Avoid a page where every heading has the same scale and weight.

### Approved core copy
Eyebrow: `IMAGE → COLOR SYSTEM`  
Headline: `Find the colors hiding in your images.`  
Supporting copy: `Extract, refine, test, and export a palette from any image.`  
Primary CTA: `Extract a palette`  
Secondary CTA: `Explore the workspace`

Keep copy specific to what the product actually does. Do not add claims that are not implemented.

## 6. Shape, borders, and depth

- Prefer square or subtly rounded corners. Use rounded corners only where they support usability or an existing component system.
- Buttons should be rectangular, with a clear label and a visible hover/focus state.
- Use thin rules to structure the page, echoing editorial layouts and printed matter.
- Use shadows only when they communicate real layer separation. Shadows should be directional, restrained, and close to the object.
- A raised plane needs a visible edge, overlap, or contact shadow. A blur alone is not depth.
- Do not apply the same shadow and border treatment to every component.
- Keep focus indicators unmistakable.

## 7. Editorial motion language

Motion in Afterimage is an extension of its brutalist editorial identity and Swiss typographic rigor:
- **Brutalist editorial typography:** Oversized Space Grotesk display type and IBM Plex Mono annotations animate with crisp clipped reveals and small vertical translation (6–8px). Motion emphasizes typographic weight and ink boundaries without floating loosely.
- **Swiss-inspired composition:** Asymmetrical grid tension, razor rules, and monumental scales are preserved. Elements settle into mathematically precise alignments rather than wobbling or drifting.
- **Tactile, print-like visual language:** Surfaces behave like archival mounting boards and ink-press plates. Micro-interactions have an instant physical click (`translateY(1px)`); pointer tilt feels like holding an architectural specimen up to directional studio lighting.
- **Sharp geometry & intentional asymmetry:** Motion honors sharp 0px corners, hard dividing rules, and monolithic structural columns. Transitions never round off corners or soften geometric edges.
- **Disciplined palette & typography:** The approved color palette (Paper `#F2EFE8`, Ink `#151515`, Signal Red `#FF593D`, Acid Lime `#D7FF3F`, Electric Blue `#2457FF`) and typography remain strictly sovereign. Motion never shifts hue for decorative whims.
- **Zero generic tropes:** Absolutely no decorative gradients, glowing neon orbs, glassmorphic frosted cards, bouncy spring physics, or generic AI-product styling.

## 8. Landing-page art direction

The first viewport must be recognizable as an editorial composition even when completely static.

### Hero composition
Build a custom **color specimen** from the user's image and its palette. It should feel composed, not like a dashboard screenshot or a pile of floating cards.

Requirements:
- A clear visual silhouette that occupies a substantial portion of the first viewport.
- One dominant source image, cropped intentionally.
- Palette planes or color strips that visibly relate to the image: Layer 2 floating chromatic calibration band (`specimen-palette-band`) anchored in true 3D space (`translateZ(34px)`).
- Four authentic depth levels within the architectural specimen composition: background field (Layer 0 recessed mounting bed with 800px perspective), artwork plane (Layer 1 source image with dynamic contact shadow and 16px Z elevation), chromatic calibration band (Layer 2 floating palette strip at 34px Z elevation), and elevated foreground annotations (Layer 3 datum category tag at 52px Z, specimen title stamp at 44px Z, registration crosshairs).
- Intentional overlap, asymmetry, and negative space.
- Crisp geometry, matte surfaces, directional light responding to pointer tilt, fine edges, and restrained contact shadows.
- Typography and specimen must feel art-directed together, not placed in separate generic columns.
- The composition must still read as designed with motion disabled.
- Do not preserve or introduce detached floating-chip cards. The specimen is an integrated architectural object.

### What not to build
- A generic two-column hero with a headline on the left and a standard mockup card on the right, unless the composition is transformed enough to feel like a distinct editorial spread.
- A stack of interchangeable white cards.
- Decorative floating UI that does not explain the image-to-palette relationship.
- Fake product controls that imply functionality that does not exist.

## 9. Workspace art direction

The workspace should become quieter than the landing page, not less considered.

- Prioritize the image, extracted palette, and editing controls.
- Use a clear canvas-inspector relationship.
- Keep controls aligned and grouped by task.
- Use thin rules, consistent spacing, and typographic hierarchy instead of nesting cards inside cards.
- Make color values easy to inspect and copy.
- Clearly communicate loading, empty, success, error, and export states.
- Never sacrifice keyboard navigation, readable labels, or touch target size for visual minimalism.
- The workspace should feel like a professional instrument, not a marketing page.

## 10. Responsive behavior

Treat each breakpoint as a designed composition, not a scaled desktop.

- **1440px and above:** full editorial asymmetry, large display type, broad image plane, generous negative space.
- **1024px:** preserve the main hierarchy; reduce secondary annotations before shrinking the core artwork.
- **768px:** rebalance headline and specimen into a deliberate composition; remove layers that create clutter.
- **375px:** stack deliberately, keep the artwork recognizable, avoid tiny floating labels, and keep CTAs easy to use.
- **320px:** no horizontal overflow; preserve essential actions and content.

Test at 320, 375, 768, 1024, and 1440 CSS pixels. Do not treat a responsive layout as complete because it technically fits.

## 11. Accessibility and product quality

- Maintain WCAG AA contrast for normal text where applicable.
- Provide visible keyboard focus and meaningful accessible names.
- Respect `prefers-reduced-motion`.
- Do not communicate state through color alone.
- Ensure all controls work with keyboard and touch.
- Preserve semantic HTML and logical heading order.
- Avoid motion that causes disorientation or blocks interaction.

## 12. Visual acceptance gate

A design change is not complete because code compiles or CSS values changed.

Before accepting a visual task:
1. Run the actual app and inspect the changed page in a browser.
2. Capture a screenshot at a stated viewport, normally 1440 × 900 for the landing page.
3. Compare it with the pre-change screenshot at the same viewport.
4. Confirm that the intended composition changed, not merely color, shadow, border, or spacing.
5. Check at 375px as well.
6. Verify that the design still works with reduced motion.
7. Run relevant checks and report actual results.

A visual task fails review if the page still reads as the same composition after the task claimed to redesign it. Do not claim visual verification without inspecting the browser.

## 13. Definition of done

- The page has a distinct, memorable editorial identity.
- The image-to-palette relationship is the visual focus.
- Sections have different compositional rhythms.
- No anti-slop hard failures were introduced.
- Existing functionality and accessibility remain intact.
- Desktop and mobile have both been inspected.
- Build/type checks and relevant tests have been run.
- Any remaining limitations are reported honestly.
