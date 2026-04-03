# Design System Strategy: The Architectural Naturalist

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Architectural Naturalist."** 

We are moving away from the "startup-in-a-box" aesthetic. Instead, we are building a digital experience that mirrors the craftsmanship of high-end outdoor pet environments. This system treats the browser like a physical studio desk: a place where raw, organic materials (nature) meet precise, utilitarian blueprints (design). 

To break the "template" look, we utilize **Intentional Asymmetry**. Hero sections should not be perfectly centered; instead, use overlapping elements where high-resolution photography of raw timber or forest greens bleeds into structured `surface-container` blocks. The system relies on "The Breath of the Wild"—generous white space that feels like fresh air, ensuring the UI never feels cluttered or "cheap."

---

## 2. Colors & Surface Philosophy
The palette is rooted in the "Deep Forest" (`primary`) and "Warm Timber" (`secondary`) tones. This is not a flat design; it is a layered one.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** We do not use `1px solid` lines to separate the "About" section from the "Services" section. Boundaries must be defined exclusively through background color shifts. For example, a section using `surface` (`#f9faf7`) should transition directly into a section using `surface-container-low` (`#f3f4f1`). This creates a sophisticated, "blocked" architectural feel rather than a wireframe feel.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked materials.
*   **Base:** `surface` or `surface-bright`.
*   **Secondary Content:** `surface-container`.
*   **Interactive Cards:** Place a `surface-container-lowest` (#ffffff) card atop a `surface-container-low` section to create a soft, natural lift.

### The "Glass & Gradient" Rule
To add visual "soul," use subtle linear gradients in hero backgrounds transitioning from `primary` (#173124) to `primary-container` (#2d4739). For floating navigation or mobile menus, apply **Glassmorphism**: use `surface` at 80% opacity with a `20px` backdrop-blur. This ensures the lush greens of the photography stay visible, keeping the user connected to the "outdoor" theme.

---

## 3. Typography: The Craftman’s Script
The typography is a dialogue between precision and character.

*   **Display & Headlines (Newsreader):** The serif `newsreader` conveys the "Design Studio" aspect. It feels editorial, established, and human. Use `display-lg` for value propositions to evoke a sense of high-end craftsmanship.
*   **UI & Body (Inter):** The sans-serif `inter` provides the "Utilitarian" balance. It is neutral, legible, and highly functional.
*   **The Contrast Rule:** Always pair a `headline-lg` (Newsreader) with a `label-md` (Inter, All-Caps, 0.05em tracking) to create a clear hierarchy between "Art" and "Information."

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-highest` element feels closer to the user than a `surface-container-low` element.
*   **Ambient Shadows:** If an object must float (like a "Book Consultation" modal), use an ultra-diffused shadow: `box-shadow: 0 20px 50px rgba(25, 28, 27, 0.06);`. The shadow isn't grey; it’s a faint tint of our `on-surface` color, mimicking natural forest light.
*   **The "Ghost Border":** If accessibility requires a container boundary, use `outline-variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons: High-Contrast Anchors
*   **Primary:** Background `primary` (#173124), Text `on-primary` (#ffffff). **Shape:** `DEFAULT` (0.25rem) for a precise, architectural corner. No full-rounding; we want "utilitarian," not "bubbly."
*   **Secondary:** Background `secondary` (#765934), Text `on-secondary`. Use this for secondary CTAs like "View Materials."
*   **Tertiary:** Text `primary`, no background. Use for "Learn More" links with a custom 2px underline using `secondary-fixed-dim`.

### Cards & Photo Gallery Grids
*   **Forbid Divider Lines:** Use `2rem` to `4rem` of vertical white space to separate content blocks.
*   **The Gallery:** Use an elegant, masonry-style grid. Photography should have a `md` (0.375rem) corner radius. Captions should use `label-md` in `on-surface-variant` for a technical, "spec-sheet" aesthetic.

### Forms: The Professional Studio
*   **Inputs:** Use `surface-container-highest` as the fill. No bottom-only lines; use a full container with a `sm` radius.
*   **Focus State:** Shift the background to `surface-lowest` and apply a 2px `outline` of `primary`.

### Navigation: The Floating Blueprint
*   The header should be a floating `surface` bar with a `xl` (0.75rem) radius, using Glassmorphism (80% opacity + blur) to feel modern and integrated into the environment.

---

## 6. Do’s and Don'ts

### Do
*   **Do** use `primary-fixed` (#ccead6) for subtle highlights or "Success" states to keep the green theme consistent.
*   **Do** allow photography to be the "hero." The UI should feel like a matte board in a frame—it supports the art but doesn't compete with it.
*   **Do** use asymmetrical margins (e.g., 10% left, 15% right) on large desktop screens to create a custom, editorial feel.

### Don't
*   **Don't** use pure black (#000000). Use `on-surface` (#191c1b) to maintain a natural, high-trust softness.
*   **Don't** use standard "Material Design" ripples. Use subtle opacity shifts (e.g., 90% opacity on hover) for interaction feedback.
*   **Don't** use "full" rounded corners (9999px) for buttons or cards; it breaks the "Utilitarian/Architectural" promise. Stick to `DEFAULT` or `md`.

---

## 7. Spacing & Rhythm
Use a **Base-8 system**, but lean into "Extended Breathing."
*   **Section Gap:** `8rem` (128px) on desktop.
*   **Component Gap:** `1.5rem` (24px).
*   **Internal Padding:** `2rem` (32px) for cards to ensure content never feels cramped, reflecting the "outdoor" nature of the business.