# Jane Acupuncture Website

## Project Overview

Static single-page website for Jane Acupuncture, a traditional Korean medicine practice in Garden Grove, CA. No build system, no dependencies — plain HTML, CSS, and JavaScript.

## Stack

- **HTML5** — `index.html` (single page, ~580 lines)
- **CSS3** — `styles.css` (design tokens, BEM-style classes, fluid typography, responsive breakpoints)
- **Vanilla JS** — `script.js` (mobile nav, scroll effects, IntersectionObserver animations)
- **Fonts** — Google Fonts: Cormorant Garamond (serif headings), Inter (sans body)
- **Images** — Unsplash CDN (no local images except `janeappherotitle.png`, currently unused)

## File Structure

```
index.html              Main page
styles.css              All styles
script.js               All interactivity
janeappherotitle.png    Legacy logo asset (unused)
```

## Key Details

- **Phone**: (714) 293-5544
- **Address**: 13341 Garden Grove Boulevard, Garden Grove, CA 92843
- **Hours**: Mon, Tue, Thu, Fri 9AM–5PM; Wed, Sat, Sun Closed
- **Practitioner**: Jane Chung, MSOM, L.Ac

## CSS Architecture

Design tokens are CSS custom properties in `:root` (colors, typography, spacing, shadows, transitions). Naming follows BEM: `.block__element--modifier`. Fluid typography uses `clamp()`. Breakpoints: 1024px, 900px, 700px, 600px.

## JS Behavior

- Mobile nav slides in from right, closes on link click / Escape / outside click
- `IntersectionObserver` drives scroll-reveal (`.reveal` → `.reveal.visible`) and staggered service cards
- Active nav link tracking via scroll position
- Parallax on `.hero__bg` (respects `prefers-reduced-motion`)
- Image fade-in via `.loaded` class (applied on `load` or if already `complete`)

## What to Avoid

- Do not add a build step or npm dependencies — keep it zero-dependency
- Do not inject styles via JS — put all CSS in `styles.css`
- The Google Maps embed uses approximate coordinates; update with real embed URL if needed
- `janeappherotitle.png` is 2MB — do not add more large binary assets

## Deployment

Static files — can be deployed to any static host (Netlify, GitHub Pages, Vercel, etc.). No server-side logic required.
