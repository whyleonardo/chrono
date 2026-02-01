# Chrono Auth Screen Design Specification

## Design Direction: "Timeless Editorial"

### Concept
The auth experience should feel like opening a premium journal—intimate, intentional, and timeless. The design draws from editorial typography and warm, organic color palettes while maintaining the functionality of modern SaaS authentication.

### Aesthetic Pillars
- **Warm Minimalism**: Rich, dark backgrounds with amber/gold accents (evoking candlelight, sunset, golden hour)
- **Editorial Typography**: Playfair Display for brand moments, paired with a refined IBM Plex Sans for UI
- **Intentional Motion**: Subtle, meditative animations that feel like "moments passing"
- **Asymmetric Balance**: Left-side brand storytelling with right-side focused interaction

---

## Visual System

### Color Palette
```css
:root {
  /* Background - Deep charcoal with warm undertones */
  --bg-primary: #1a1814;
  --bg-secondary: #24201b;
  --bg-tertiary: #2d2822;
  
  /* Accent - Amber/Gold warmth */
  --accent-primary: #d4a574;
  --accent-secondary: #e8c39e;
  --accent-glow: rgba(212, 165, 116, 0.3);
  
  /* Text - Warm white to subtle gray */
  --text-primary: #faf8f5;
  --text-secondary: #a89f94;
  --text-muted: #6b655d;
  
  /* Semantic */
  --error: #c97b7b;
  --success: #8fb996;
  --border: rgba(212, 165, 116, 0.15);
}
```

### Typography
- **Display**: Playfair Display (400/600) - For "Chrono" brand wordmark
- **UI**: IBM Plex Sans (300/400/500) - For all interface text
- **Scale**: 
  - Brand: 48px / 3rem
  - H1: 32px / 2rem
  - Body: 16px / 1rem
  - Small: 14px / 0.875rem

### Spacing System
- Base unit: 8px
- Section gaps: 48px (6 units)
- Component padding: 24px (3 units)
- Input height: 48px

---

## Layout Structure

### Desktop (>1024px)
```
┌────────────────────────────────────────────────────────────┐
│  [Chrono Logo]                                             │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  ┌────────────────────────┐  ┌──────────────────────────┐  │
│  │                        │  │                          │  │
│  │   Capture Time.        │  │    ┌────────────────┐    │  │
│  │   Create Meaning.      │  │    │  Email         │    │  │
│  │                        │  │    └────────────────┘    │  │
│  │   [Decorative          │  │    ┌────────────────┐    │  │
│  │    timeline graphic]   │  │    │  Password      │    │  │
│  │                        │  │    └────────────────┘    │  │
│  │   "Your personal       │  │                          │  │
│  │    space to reflect,   │  │    [Continue →]          │  │
│  │    track, and          │  │                          │  │
│  │    celebrate."         │  │    ─────── or ───────    │  │
│  │                        │  │                          │  │
│  │                        │  │    [G] [GitHub]          │  │
│  │                        │  │                          │  │
│  └────────────────────────┘  └──────────────────────────┘  │
│                                                            │
│  Don't have an account? Sign up →                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Mobile (<768px)
- Stacked layout: Brand tagline above, form below
- Full-width inputs
- Bottom-aligned primary action

---

## Animation Specifications

### Page Load Sequence (Staggered)
1. Background fade in: 0ms, duration 600ms, ease-out
2. Brand wordmark: 100ms delay, duration 500ms, translateY(20px→0)
3. Tagline lines: 200ms, 300ms delays, duration 400ms each
4. Form container: 400ms delay, duration 500ms, opacity 0→1
5. Form fields: 500ms, 600ms, 700ms delays, stagger 100ms

### Input Interactions
- Focus: Border color transition 200ms, subtle amber glow (box-shadow)
- Typing: Character fade-in per keystroke (subtle, 50ms)
- Validation: Shake animation on error (300ms), green checkmark fade on success

### Button States
- Hover: Scale 1.02, brightness increase, transition 200ms ease-out
- Active: Scale 0.98, transition 100ms
- Loading: Spinner replaces text, button maintains size

### Decorative Elements
- Timeline dots: Gentle pulse animation (3s infinite, staggered)
- Ambient glow: Slow radial gradient shift (20s infinite)

---

## Component Specifications

### Input Field
```
Height: 48px
Padding: 12px 16px
Border: 1px solid var(--border)
Border-radius: 8px
Background: var(--bg-secondary)
Color: var(--text-primary)

States:
- Default: border translucent amber
- Focus: border var(--accent-primary), box-shadow 0 0 0 3px var(--accent-glow)
- Error: border var(--error), subtle red glow
- Disabled: opacity 0.5, cursor not-allowed
```

### Primary Button
```
Height: 48px
Padding: 0 24px
Border-radius: 8px
Background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)
Color: var(--bg-primary)
Font-weight: 500

States:
- Default: subtle shadow
- Hover: brightness(1.1), translateY(-1px), enhanced shadow
- Active: brightness(0.95), translateY(0)
- Loading: spinner animation, disabled state
```

### Social Auth Button
```
Height: 44px
Border: 1px solid var(--border)
Border-radius: 8px
Background: transparent
Color: var(--text-primary)

States:
- Hover: background var(--bg-tertiary), border var(--accent-primary)
```

### Brand Wordmark
```
Font: Playfair Display
Weight: 600
Size: 48px (desktop) / 36px (mobile)
Color: var(--text-primary)
Letter-spacing: -0.02em
```

---

## Responsive Breakpoints

- **Desktop**: >1024px - Split layout, full visual storytelling
- **Tablet**: 768px-1024px - Reduced left panel, compacted spacing
- **Mobile**: <768px - Stacked single column, bottom sheet form

---

## Accessibility Requirements

- Focus visible states with 3:1 contrast minimum
- Error messages announced to screen readers
- Reduced motion media query support
- Keyboard navigation (Tab order logical)
- Form labels properly associated
- Sufficient color contrast (all text meets WCAG AA)

---

## Prototype Implementation

See: `/apps/web/src/app/(auth)/prototype/page.tsx`

This prototype demonstrates:
- Complete visual system implementation
- Working form interactions
- Page load animations
- Responsive behavior
- All interactive states

