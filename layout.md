AFTERIMAGE — LAYOUT & COMPOSITION
Design references (study these before implementation)
Use these references to understand the principles behind the direction. Do not copy their pages or reproduce their layouts literally. Treat them as complementary references for art direction, composition, and interaction.
- Readymag — Awwwards: https://www.awwwards.com/sites/readymag-4
  - Study the confident creative-tool identity, editorial product presentation, and how the work itself carries the visual story.
- Proof — Awwwards: https://www.awwwards.com/sites/proof-1
  - Study how interaction and information can feel integrated into the visual identity rather than presented as generic SaaS panels.
- Editorial New by Locomotive — Awwwards case study: https://www.awwwards.com/editorial-new-variable-typeface-by-locomotive-wins-site-of-the-month-october.html
  - Study expressive typography, a strong type-led identity, and how a creative tool can make its core subject the visual centerpiece.
- Siena Film Foundation — Awwwards: https://www.awwwards.com/sites/siena-film-foundation
  - Study cinematic image treatment, editorial storytelling, and how imagery and typography can create a distinct visual atmosphere.
- Typography Principles by Obys — Awwwards: https://www.awwwards.com/sites/typography-principles
  - Study bold typographic hierarchy, experimental presentation, and purposeful composition.
- User-provided coral typography / photography reference: use the image supplied in the project conversation as a reference for oversized type, image overlap, and dramatic contrast.
- User-provided grayscale architectural editorial spread: use the supplied image as a reference for asymmetrical grids, geometric blocks, precise alignment, and editorial whitespace.
Treat the five websites as complementary references, not templates. Extract specific principles from each accessible page and apply them to Afterimage's own identity. If a reference cannot be accessed, state that honestly; do not claim to have studied it.

Apply the shared principles to Afterimage's existing design system: paper #F2EFE8, ink #151515, signal red #FF593D, acid lime #D7FF3F, and electric blue #2457FF. Do not introduce purple/violet accents, decorative gradients, glow effects, glassmorphism, pill buttons, fake metrics, or unnecessary animation.

Before changing code, inspect the current implementation and capture the existing landing page at desktop (1440×900) and mobile (375px). Use the references to make a genuinely different macro-composition, not just small spacing, border, or color adjustments. Keep the specimen/image plane visually dominant, integrate typography and the color ribbon into the composition, and make sections feel intentionally different from one another. Preserve all existing functionality and accessibility.

Version: 3.0
Pairs with: design.md and motion.md
1. Layout objective
The page tells one visual story:

Image → extraction → refinement → usable color system.

The landing page should feel like an editorial art-direction spread, not a list of standard SaaS sections. Every section must have its own composition, density, and purpose. Do not repeat the same centered heading plus three bordered cards pattern.

Before changing layout, inspect the current implementation and identify which components already work. Preserve behavior and improve composition intentionally.
2. Global layout system
- Use a 12-column grid on wide screens, with a consistent max-width container and generous outer margins.
- Align important edges across sections, but allow controlled breaks from the grid for artwork, oversized typography, and annotations.
- Use spacing to establish rhythm. Do not add boxes around every group.
- Use thin horizontal rules as structural punctuation.
- Allow large shifts in scale between sections: oversized display type, large image fields, compact mono metadata, and quiet body copy.
- Do not let every section have the same background, card radius, width, or vertical padding.
- Keep the header compact so the first viewport belongs to the hero.
3. Header
Purpose: identify the product and offer clear navigation without competing with the artwork.

Composition:
- Wordmark on the left.
- A small number of useful navigation links on the right.
- A thin bottom rule or restrained structural divider.
- Keep height compact.
- Use rectangular text/button treatments, not pill navigation.
- On mobile, retain the wordmark and the essential action. Avoid a large multi-row header.
Do not add navigation links to pages or features that do not exist.
4. Hero: the signature editorial spread
Purpose: communicate the product in one glance and create a memorable first impression.
Desktop, 1024px and above
- Abandon the conventional headline-left / framed-specimen-right hero. The first viewport must be unmistakably different from that baseline.
- Make the artwork the dominant visual event. It should cross or deliberately interrupt the grid where appropriate, rather than sit inside a generic mockup card.
- Compose oversized headline typography, artwork, and extracted-color planes as one continuous editorial spread. Explore intentional overlap, cropping, shared grid regions, and contrasting widths while keeping type legible.
- Integrate a continuous palette ribbon or geometric color band directly with the source image so image and extracted colors read as one composition.
- Use asymmetry, controlled imbalance, and negative space with purpose. Do not merely move the same two columns around.
- Keep the primary extraction CTA immediately discoverable. Secondary actions should be visually quieter.
- Keep eyebrow and technical annotations small and restrained.
Required specimen structure
Use the existing real data and product components wherever possible:
1. Image plane: the dominant source artwork, cropped intentionally and allowed to bleed into adjacent grid regions when it strengthens the composition.
2. Palette plane: real extracted colors arranged as strips, blocks, or a continuous band that visibly connects to the image.
3. Annotation plane: concise, useful labels or values. Avoid pseudo-technical clutter and fake controls.
4. Supporting field: use paper/ink space, fine rules, or a geometric plane only where it strengthens hierarchy.
These are compositional layers, not a requirement to create separate cards or a decorative frame. Prefer direct image planes, strong silhouettes, and intentional overlap over nested containers, heavy shadows, and mounting-board effects.
Hero failure conditions
Reject the result if:
- It is essentially the previous headline-left / framed-artwork-right hero with a new shadow, border, color, or slight spacing change.
- The headline is simply beside a specimen card instead of interacting with the overall composition.
- The artwork is visually isolated inside a generic mockup frame.
- The image and palette feel like separate UI modules rather than one image-to-color story.
- Repeated borders, decorative layers, or pseudo-technical labels compete with the artwork.
- Motion is required for the hero to feel interesting.
- It uses fake UI or fake metrics to fill empty space.
5. Product proof: show the transformation
Purpose: make the image-to-color value concrete.

Composition:
- Use a large source image as the anchor.
- Place the resulting palette in a clearly connected band or sequence.
- Show a compact technical readout only where it adds real product value.
- Use an image-to-palette relationship that can be understood without reading paragraphs.
- Let the composition span the page width where useful.
- Make this section visually different from the hero: less theatrical, more explanatory and precise.
Do not put the image, palette, and technical readout into three identical cards. Do not invent extraction metrics or claim unsupported capabilities.
6. How it works: three distinct steps
Purpose: explain the basic workflow with minimal copy.

Steps:
1. Add an image. Choose or upload a source image.
2. Extract its colors. Generate a palette from the image.
3. Refine and export. Adjust the palette and export it using supported formats.
Composition:
- Prefer a single editorial row on wide screens, divided by rules or spacing.
- Use large step numbers or typographic markers, not icon cards.
- Each step needs a short heading and one concise explanation.
- Avoid three identical rounded cards with decorative icons.
- On mobile, stack the steps with clear separation and no unnecessary ornament.
Only describe actions that exist in the current product.
7. Workspace entry
Purpose: move the visitor from inspiration to actual use.
- Make this a clear transition from editorial storytelling to a usable tool.
- Use a strong, direct heading and one primary action.
- Show a real preview or the real workspace if it helps explain what happens next.
- Do not fabricate a screenshot, file list, or workspace state.
- Avoid repeating the hero's exact composition.
- Ensure the CTA navigates to the real workspace/upload flow.
If the landing page already contains a functioning workspace entry, improve its hierarchy instead of creating a duplicate route or feature.
8. Workspace
Purpose: provide a calm, efficient environment for inspecting and refining colors.
Desktop
- Establish a primary canvas and a secondary inspector/control area.
- The image should have enough space to be inspected.
- Palette results should be visible without hunting through nested panels.
- Group related controls by task: image, palette, color details, export.
- Use labels, alignment, and rules rather than nested cards for every group.
- Keep secondary metadata quiet.
- Keep important actions consistently placed.
Empty state
- Explain what the user can do next.
- Provide a clear upload/select-image action.
- Avoid a giant empty bordered box with generic copy.
- Do not invent a preloaded image unless the product actually supplies one.
Populated state
- Make the source image and extracted palette the main content.
- Values should be legible and copyable.
- Editing controls must visibly affect the real palette.
- Keep export options discoverable and functional.
Loading, error, and success states
- Loading: communicate the action in progress without endless decorative animation.
- Error: explain the problem and a useful next step.
- Success: confirm the actual completed action.
- Never show success feedback before the action succeeds.
Mobile workspace
- Prioritize the image and palette.
- Move secondary controls below or into a clearly labelled disclosure pattern only if supported by the existing architecture.
- Avoid squeezing desktop sidebars into narrow columns.
- Preserve upload, edit, copy, and export access.
- Ensure no horizontal overflow.
9. Footer
- Keep it compact and aligned with the overall grid.
- Include only real links and necessary product/legal information.
- Use a rule to mark the transition.
- Do not add fake social links, empty link lists, or decorative giant footers.
10. Responsive composition rules
1440px
Use the full editorial grid, large typography, broad artwork, and controlled asymmetry.
1024px
Keep the composition intentional. Reduce annotations and secondary content before reducing the main image or headline too far.
768px
Recompose the hero and workspace. Do not simply shrink desktop columns until they collide.
375px
Use deliberate stacking, concise labels, readable controls, and a recognizable specimen. Remove nonessential annotations rather than shrinking them to illegibility.
320px
No horizontal scrolling. Essential content and actions remain usable.

Test all of these widths in the browser.
11. Implementation contract for coding agents
Before editing:
1. Inspect the actual route, page component, CSS, and relevant components.
2. Identify the current visual structure and any existing functional dependencies.
3. State which files will change and why.
4. Do not rewrite unrelated components or duplicate existing features.
During editing:
1. Change the composition when the task asks for a redesign. Do not substitute cosmetic tweaks.
2. Reuse existing tokens and real product data.
3. Preserve working interactions, state, routing, and accessibility.
4. Keep changes focused and maintainable.
After editing:
1. Run the app using the correct project and dev server.
2. Inspect the actual browser-rendered result, not only source code.
3. Capture screenshots at 1440 × 900 and 375px wide.
4. Compare before/after screenshots at matching viewport sizes.
5. Confirm that the intended visual difference is obvious in a static screenshot.
6. Run the available build, typecheck, and tests.
7. Report files changed, checks run, results, and anything not verified.
If the result looks materially the same as the original, stop and revise the composition before claiming completion. Do not claim browser verification unless the browser was actually inspected.
12. Final page review checklist
- [ ] The hero is unmistakably different from a conventional headline-left / framed-preview-right layout.
- [ ] Oversized typography, artwork, and the extracted palette form one unified visual statement.
- [ ] The references informed the composition without being copied literally.
- [ ] The hero reads as an editorial spread, not a generic SaaS split layout.
- [ ] The specimen has a strong silhouette and clear image-to-palette relationship.
- [ ] Product proof, workflow, workspace entry, and footer have distinct compositional rhythms.
- [ ] Repeated generic card patterns have been avoided.
- [ ] Mobile is intentionally composed and has no horizontal overflow.
- [ ] Real functionality is preserved.
- [ ] No fake features, metrics, testimonials, or controls were added.
- [ ] Screenshots were inspected at 1440px and 375px.
- [ ] Build/type checks/tests were run and results are reported honestly.