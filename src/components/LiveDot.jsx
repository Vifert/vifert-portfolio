import { useEffect, useRef } from 'react';

// A status dot that settles once when it first scrolls into view (a single ring
// ping), then stays static — instead of an attention-grabbing infinite pulse.
export default function LiveDot() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-live');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} aria-hidden="true" className="live-dot">
      <span className="live-dot__ring" />
    </span>
  );
}
