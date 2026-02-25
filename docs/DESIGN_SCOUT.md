# Design Scout — Future Food Landing

## Goal
Craft a **space-age, premium** landing page with immersive motion and non-generic visual language while preserving conversion clarity.

## 21st.dev findings (via `21st-search.mjs`)

### 1) Hero structure + retro/future grid
- Reference: 21st result **"Hero Section Dark"** (query: `futuristic hero section gradient glow background CTA`)
- Pattern extracted:
  - oversized hero with layered radial gradients
  - perspective/retro grid plane for depth
  - gradient typography and orbital CTA framing
- Adaptation:
  - build a custom "orbital field" hero with animated cosmic layers and a horizon grid
  - keep one high-contrast CTA focus point (`Join Now`)

### 2) Animated aurora / ambient background systems
- Reference: 21st result **"Aurora Flow"** (query: `animated background aurora spotlight particles grid`)
- Pattern extracted:
  - animated aurora color drift
  - motion depth with light noise/particles
- Adaptation:
  - avoid heavy WebGL dependency for lightweight performance
  - recreate effect using CSS radial gradients + moving blobs + starfield twinkle

### 3) Futuristic CTA treatment
- References: 21st results **"Button Shiny"**, **"Hover Glow Button"** (query: `premium button hover glow magnetic CTA`)
- Pattern extracted:
  - conic/gradient rings
  - glow bloom on hover
  - subtle kinetic lift
- Adaptation:
  - primary CTA gets ring + bloom + lift, secondary CTA is glass-outline for hierarchy

## Magic UI / Aceternity references

### Magic UI
- Animated Beam: https://magicui.design/docs/components/animated-beam
- Aurora Text: https://magicui.design/docs/components/aurora-text
- Takeaway:
  - use directional energy lines to imply flow/system movement
  - use animated gradient text accents sparingly to avoid visual noise

### Aceternity UI
- Aurora Background: https://ui.aceternity.com/components/aurora-background
- Takeaway:
  - long-duration background gradient loops for "alive" feeling
  - high blur + low-contrast overlays to keep content readable

## Final adaptation plan
1. **Hero**: Massive statement, required line included exactly, dual CTA.
2. **Environment**: Starfield, moving aurora blobs, perspective grid floor, subtle scanline/vignette overlays.
3. **Supporting sections**:
   - concept/value cards
   - "How it works" orbital timeline
   - social proof strip + final conversion panel
4. **Visual system**:
   - deep-space palette (indigo/violet/cyan)
   - glassmorphism cards + neon borders
   - premium spacing, balanced density, mobile-first stacking
5. **Performance guardrails**:
   - CSS-based motion (no mandatory WebGL)
   - reduced-motion support
