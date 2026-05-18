---
name: High Roller Simulation
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#d1c6ab'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#9a9078'
  outline-variant: '#4d4632'
  surface-tint: '#eec200'
  primary: '#ffecb9'
  on-primary: '#3c2f00'
  primary-container: '#facc15'
  on-primary-container: '#6c5700'
  inverse-primary: '#735c00'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#ffe9dc'
  on-tertiary: '#4f2500'
  tertiary-container: '#ffc59d'
  on-tertiary-container: '#8c4600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe083'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 84px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  display-md:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 1.25rem
  container-padding-desktop: 2.5rem
  gutter: 1.5rem
  section-gap: 4rem
---

## Brand & Style

The design system is engineered to evoke the high-stakes adrenaline of a premium night-time casino environment. It targets a competitive audience seeking a gamified simulation experience that feels both luxurious and urgent. 

The aesthetic is a fusion of **Glassmorphism** and **High-Contrast Bold** styles. We utilize deep, ink-like backgrounds to make neon elements "pop" with maximum luminance. Translucent surfaces and vibrant gradients create a sense of depth and digital sophistication, while massive, aggressive typography conveys power and immediate action. The emotional response should be one of excitement, exclusivity, and high energy.

## Colors

The palette is anchored in a deep midnight aesthetic with high-luminance accents.

- **Primary (Neon Gold):** Used for critical calls to action, currency indicators, and winning states.
- **Secondary (Neon Purple):** Used for interactive elements, secondary navigation, and "mysterious" or "premium" features.
- **Tertiary (Neon Orange):** Primarily used in gradients with the primary gold to create a "molten" or glowing effect for high-priority buttons.
- **Neutral (Midnight Blue/Black):** The foundation of the UI. Backgrounds are strictly `#111827` to ensure neon glows maintain their vibrance without muddying the shadows.
- **System States:** Success should lean into the Gold/Yellow spectrum, while errors should utilize a vibrant, high-contrast Red-Pink to cut through the purple/gold themes.

## Typography

This design system uses a high-impact typographic hierarchy. 

**Anton** is used for all displays and headlines to provide a sense of urgency and power. It must always be set in uppercase for headlines to maximize the "Casino Billboard" effect. 

**Geist** provides a clean, technical contrast for body copy, ensuring the simulation's data remains readable amidst the heavy styling. 

**JetBrains Mono** is used for labels, numerical data, and "system" readouts to reinforce the simulation/technical nature of the app.

Scale headlines aggressively on desktop; use `display-lg` for win states and major milestones.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a heavy emphasis on centered, focal-point compositions. 

- **Grid:** 12-column system for desktop, 4-column for mobile.
- **Rhythm:** Use an 8px base unit. All padding and margins should be multiples of 8.
- **Density:** High-impact areas (like a slot machine or betting table) should use tight spacing to build tension. Informational areas should use generous "section-gaps" to prevent the dark UI from feeling claustrophobic.
- **Safe Areas:** Ensure a minimum of 20px horizontal margin on mobile to prevent glass card borders from touching the screen edges.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Outer Glows** rather than traditional soft shadows.

1.  **Base Layer:** The solid midnight background (#111827).
2.  **Surface Layer (Glass):** Semi-transparent surfaces (Opacity: 40-60%) with a `20px` backdrop blur. 
3.  **Borders:** Glass surfaces must have a 1px solid border. Use a linear gradient for the border (Top-Left: White @ 20% opacity to Bottom-Right: Transparent) to simulate a light source reflecting off an edge.
4.  **Glowing State:** Interactive elements or active cards use a "Primary Glow"—a drop shadow with 0px offset, high spread (10px+), and color matched to the element's accent (Gold or Purple) at 50% opacity.

## Shapes

The shape language is modern and balanced. 

- **Standard Elements:** Use `rounded-md` (0.5rem) for cards and inputs to keep the design feeling structured but contemporary.
- **Action Elements:** Buttons and interactive chips use `rounded-lg` or `rounded-full` (pill-shaped) to distinguish them from structural containers.
- **Indicators:** Use sharp geometric shapes (triangles/diamonds) for trend indicators or betting multipliers to maintain the "Casino" theme.

## Components

### Buttons
- **Primary:** Gradient fill from Neon Gold (#FACC15) to Neon Orange (#FB923C). Bold uppercase text in Midnight Blue (#111827). On hover, add a 15px gold outer glow.
- **Secondary:** Transparent background with a 2px Neon Purple (#A855F7) border. Text in Neon Purple.

### Cards (Glass Containers)
- Semi-transparent dark background with `backdrop-filter: blur(20px)`.
- 1px "inner-glow" border.
- Headers within cards should use the `label-md` (Monospace) style for a "digital readout" feel.

### Input Fields
- Dark, recessed background (Darker than the base bg).
- 1px bottom-border only in Neon Purple.
- Focus state: The border glows and the label shifts to Neon Gold.

### Chips & Badges
- Used for betting amounts. Small, pill-shaped with high-contrast backgrounds.
- Active states should "pulse" with a subtle opacity animation.

### Progress Bars / Meters
- Background: Solid black.
- Fill: Neon gradient.
- Glow: The leading edge of the progress bar should have a 10px glow of the same color.