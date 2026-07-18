// Motion foundation: Lenis smooth scroll driving GSAP ScrollTrigger, plus a premium
// reveal system. Everything degrades to instant/native when the user prefers reduced motion.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(pointer: fine)').matches;
export const EASE = 'expo.out';

let lenis = null;
let tickerFn = null;

export function getLenis() {
  return lenis;
}

// Boot smooth scroll and wire it to ScrollTrigger. Returns a teardown fn.
export function initSmoothScroll() {
  if (reduced || lenis) return () => {};
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });
  lenis.on('scroll', ScrollTrigger.update);
  tickerFn = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);
  return () => {
    if (tickerFn) gsap.ticker.remove(tickerFn);
    if (lenis) lenis.destroy();
    lenis = null;
    tickerFn = null;
  };
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

export function scrollToEl(el, offset = 0) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Premium scroll reveals. Call once per page. Handles two shapes:
//   [data-reveal]            → a single element fades/rises in
//   [data-reveal-group]      → its [data-reveal] children reveal in a stagger
// Content is visible by default in CSS; the hidden start state is applied by JS only,
// so a no-JS / reduced-motion render still shows everything.
export function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (reduced) return undefined;
    const disposers = [];
    // A "lead" is a section header / display heading — it earns a fuller reveal.
    // Body copy and rows just appear quickly, so the page composes instead of buffering.
    const isLead = (el) =>
      el.matches('h1, h2, .section-head, .section-head__title') ||
      !!el.querySelector('h1, h2, .section-head__title');

    const ctx = gsap.context(() => {
      // --- One deliberate staggered group (reserved, not spread across every list) ---
      const groups = gsap.utils.toArray('[data-reveal-group]');
      const claimed = new Set();
      groups.forEach((group) => {
        const items = gsap.utils.toArray(group.querySelectorAll('[data-reveal]'));
        items.forEach((el) => claimed.add(el));
        if (!items.length) return;
        gsap.from(items, {
          opacity: 0,
          y: 22,
          duration: 0.5,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });
      // --- Hierarchical reveals: headers materialize, body appears quickly ---
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        if (claimed.has(el)) return;
        if (isLead(el)) {
          gsap.from(el, {
            opacity: 0,
            y: 20,
            filter: 'blur(6px)',
            duration: 0.5,
            ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        } else {
          gsap.from(el, {
            opacity: 0,
            y: 10,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        }
      });
      // --- Hero dissolve: content drifts up and fades as the fold scrolls away ---
      const hero = document.querySelector('[data-hero]');
      if (hero) {
        gsap.to(hero, {
          yPercent: -14,
          opacity: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4 },
        });
      }
      // --- Scroll parallax on tagged layers ---
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const amount = parseFloat(el.dataset.parallax) || 12;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          }
        );
      });
    });

    // --- Magnetic pull on primary controls (fine pointer only) ---
    if (finePointer) {
      gsap.utils.toArray('[data-magnetic]').forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic) || 0.28;
        const move = (e) => {
          const r = el.getBoundingClientRect();
          const mx = e.clientX - (r.left + r.width / 2);
          const my = e.clientY - (r.top + r.height / 2);
          gsap.to(el, { x: mx * strength, y: my * strength, duration: 0.5, ease: EASE });
        };
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: EASE });
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        disposers.push(() => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      });
    }

    // Let layout settle (fonts, images) before measuring trigger positions.
    const r1 = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(r1);
      disposers.forEach((fn) => fn());
      ctx.revert();
    };
  }, [pathname]);
}

// Count a number up when it scrolls into view. `format` maps the raw value to display text.
export function animateCount(el, to, { duration = 1.4, format = (v) => String(Math.round(v)) } = {}) {
  if (reduced) {
    el.textContent = format(to);
    return;
  }
  const obj = { v: 0 };
  gsap.to(obj, {
    v: to,
    duration,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => {
      el.textContent = format(obj.v);
    },
  });
}
