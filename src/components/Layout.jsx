import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import Spotlight from './Spotlight.jsx';
import CmdPalette from './CmdPalette.jsx';
import Grain from './Grain.jsx';
import { initSmoothScroll, scrollToTop, scrollToEl } from '../lib/motion.js';
import { unlockAudio } from '../lib/sound.js';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) scrollToEl(el, -72);
        else scrollToTop(true);
      }, 60);
      return () => clearTimeout(t);
    }
    scrollToTop(true);
    return undefined;
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  // Smooth momentum scroll (Lenis) driving GSAP ScrollTrigger, torn down on unmount.
  useEffect(() => initSmoothScroll(), []);

  // Unlock the Web Audio context on the first real user gesture (autoplay policy).
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ScrollManager />
      <Spotlight />
      <Grain />
      <Nav />
      <main className="page-main">
        <Outlet />
        <Footer />
      </main>
      <CmdPalette />
    </div>
  );
}
