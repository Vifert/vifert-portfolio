# vifert-portfolio

Personal portfolio of **Vifert Jenuben Daniel V** — AI / Data Engineer.

A dark, terminal-flavored single-page site with a keyboard-driven command palette,
smooth momentum scrolling, and custom scroll/motion work. Built with React + Vite.

## Highlights

- **Interactive terminal** — a ⌘K / Ctrl+K command palette with a real command loop:
  command history, tab-completion, a block cursor, and `cd` navigation between pages.
- **Cinematic motion** — Lenis smooth scroll driving GSAP ScrollTrigger: hierarchical
  scroll reveals, a dissolving hero, a scroll-linked career timeline, magnetic buttons,
  and a canvas particle field. Everything degrades gracefully with `prefers-reduced-motion`.
- **Opt-in sound** — subtle Web-Audio keystroke and UI cues, muted by default with a toggle.
- **Three routes** — Home, Projects (interactive pipeline case studies), and About
  (scroll-driven career timeline and toolbox).

## Tech stack

- React 19 + Vite
- react-router-dom
- GSAP (ScrollTrigger) + Lenis for motion
- Plain CSS (no UI framework); fonts: Clash Display, Satoshi, JetBrains Mono

## Getting started

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/   # nav, footer, cursor, spotlight, command palette, grain, live dot
  pages/        # Home, Projects, About
  lib/          # motion (Lenis + GSAP), sound, cursor
  hooks/        # scroll-reveal hook
  styles/       # global.css
public/assets/  # portrait, résumé
```

## License

© 2026 Vifert Daniel. All rights reserved.
