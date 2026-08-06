---
name: Academic Excellence
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-unit: 8px
---

## Brand & Style

The design system is engineered for the modern student professional—balancing academic rigor with creative technicality. The brand personality is **composed, ambitious, and precise**. It targets recruiters, hiring managers, and academic peers who value clarity of thought and organized execution.

The design style follows a **Modern Corporate** aesthetic with a lean towards **Minimalism**. It prioritizes information hierarchy through a strict "Swiss-style" typographic grid, ample negative space to reduce cognitive load, and subtle tonal layering to create a sense of digital "stationery." The goal is to let the work (the portfolio content) be the hero while the UI provides a silent, sophisticated framework.

## Colors

The palette is anchored in **Trustworthy Blue** (#2563EB) and **Sleek Indigo** (#6366F1). These colors are used strategically for primary actions and brand identifiers to evoke reliability and technical proficiency.

- **Primary:** Used for main buttons, active states, and key brand highlights.
- **Secondary:** Used for secondary tags, subtle gradients, or decorative accents.
- **Neutral:** A deep slate-grey scale is used for text to ensure high contrast and readability. The background is a very light off-white/cool grey to reduce eye strain compared to pure white.
- **Accent:** A soft emerald green is reserved for success states, "available for work" indicators, or verified achievement badges.

## Typography

This design system utilizes **Inter** exclusively to leverage its systematic, utilitarian nature. The type scale is built on a modular ratio to ensure harmonious sizing across all screen types.

- **Headlines:** Use a bold weight with slightly negative letter-spacing to create a "dense," professional look for titles.
- **Body Text:** Set at 16px or 18px with a generous 1.5-1.6 line height to facilitate long-form reading of project descriptions and case studies.
- **Labels:** Small, all-caps labels with increased letter-spacing are used for categories, timestamps, and metadata to differentiate them clearly from body copy.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model on desktop (12 columns) and a **Fluid Grid** on mobile. The philosophy is "Generous Breathing Room," meaning vertical sections are separated by significant padding (typically 80px to 120px) to allow each project or section to be consumed in isolation.

- **Desktop:** 12-column layout, 1200px max-width, centered.
- **Tablet:** 8-column layout, 32px side margins.
- **Mobile:** 4-column layout, 20px side margins, with stacked elements.

Spacing follows an 8px linear scale. Internal card padding should be consistent (e.g., 24px or 32px) to maintain a structured, academic rhythm.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, professional profile.

- **Level 0 (Background):** Primary background color (#F8FAFC).
- **Level 1 (Cards/Containers):** Pure white surfaces (#FFFFFF) with a thin 1px border (#E2E8F0).
- **Interactive State:** Upon hover, a card should transition to a very soft, diffused ambient shadow (0px 10px 15px -3px rgba(0, 0, 0, 0.05)) and a primary-colored border.
- **Interactive Elements:** Buttons utilize a slight vertical gradient or solid primary color to appear "lifted" without needing skeuomorphic textures.

## Shapes

The shape language is **Soft** and restrained. We avoid sharp 0px corners to ensure the UI feels approachable and modern, but we avoid large "bubble" radiuses to maintain professional maturity.

- **Components:** Standard buttons and input fields use a `0.25rem` (4px) radius.
- **Containers:** Project cards and large sections use a `0.5rem` (8px) radius.
- **Tags/Chips:** Use a fully rounded pill-shape to distinguish them as small, interactive or informative metadata elements.

## Components

### Cards
Project cards are the primary vessel for work. They feature a top-heavy image ratio (16:9), followed by a 24px padded content area containing a title, a brief excerpt, and a row of technology chips.

### Buttons
- **Primary:** Solid primary color with white text. High emphasis.
- **Secondary:** Transparent background with a 1px neutral-300 border. Medium emphasis.
- **Ghost:** No border or background; text-only with primary color. Used for "Back" or "Cancel" actions.

### Skills List
A grid of "Tag" components. Each tag has a light grey background (#F1F5F9) and a small icon or dot indicating the skill category (e.g., Blue for Tech, Indigo for Design).

### Navigation
A sticky top bar with a glassmorphism effect (backdrop-blur: 8px) and a bottom border. Links are high-contrast neutral with a primary color underline effect on hover.

### Form Fields
Inputs use a white background, 1px border, and a 4px corner radius. The label is placed above the field in `label-sm` typography. Active fields gain a primary-colored 2px outline.