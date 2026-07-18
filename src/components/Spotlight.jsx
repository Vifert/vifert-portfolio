import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Cursor-tracking amber spotlight. Matches the per-page design values:
// Home ('/') uses 0.1 alpha; About and Projects use 0.09.
export default function Spotlight() {
  const ref = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;
    const el = ref.current;
    const alpha = pathname === '/' ? 0.1 : 0.09;
    let raf = 0;
    const move = (e) => {
      const mx = e.clientX;
      const my = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (el) {
            el.style.background =
              'radial-gradient(340px at ' + mx + 'px ' + my + 'px, rgba(245, 165, 36, ' + alpha + '), transparent 68%)';
          }
        });
      }
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return <div ref={ref} aria-hidden="true" className="spotlight" />;
}
