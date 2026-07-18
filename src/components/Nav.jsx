import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { soundEnabled, setSoundEnabled, sfx } from '../lib/sound.js';

export const RESUME_URL = '/assets/Vifert-Daniel-Resume.pdf';
export const RESUME_FILENAME = 'Vifert-Daniel-Resume.pdf';

const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;
const IS_MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

export function downloadResume(e) {
  if (e) e.preventDefault();
  fetch(RESUME_URL)
    .then((r) => {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.blob();
    })
    .then((b) => {
      const url = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = url;
      a.download = RESUME_FILENAME;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    })
    .catch(() => {
      window.open(RESUME_URL, '_blank');
    });
}

function SoundToggle() {
  const [on, setOn] = useState(soundEnabled());
  useEffect(() => {
    const sync = (e) => setOn(e.detail);
    window.addEventListener('sound-toggle', sync);
    return () => window.removeEventListener('sound-toggle', sync);
  }, []);
  return (
    <button
      type="button"
      className={'nav__sound' + (on ? ' is-on' : '')}
      aria-pressed={on}
      aria-label={on ? 'Mute sound' : 'Enable sound'}
      title={on ? 'Sound on' : 'Sound off'}
      onClick={() => setSoundEnabled(!on)}
    >
      {on ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="m23 9-6 6" />
          <path d="m17 9 6 6" />
        </svg>
      )}
    </button>
  );
}

export default function Nav() {
  const barRef = useRef(null);
  const linkClass = ({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '');
  const hover = () => sfx.hover();

  // Top scroll-progress hairline.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={barRef} className="scroll-progress" aria-hidden="true" />
      <nav className="nav">
        <div className="nav__inner">
          <Link to="/" aria-label="Home" className="nav__logo">
            <span style={{ color: '#F5A524' }}>~</span>/vifert
          </Link>
          <div className="nav__links">
            <NavLink to="/" end className={linkClass}>index</NavLink>
            <NavLink to="/projects" className={linkClass}>projects</NavLink>
            <NavLink to="/about" className={linkClass}>about</NavLink>
            <a href={RESUME_URL} download={RESUME_FILENAME} onClick={downloadResume} onMouseEnter={hover} data-magnetic="0.22" className="nav__resume">
              resume ↓
            </a>
            {FINE_POINTER && (
              <button
                type="button"
                aria-label="Open command palette"
                className="nav__cmdk"
                onMouseEnter={hover}
                onClick={() => window.dispatchEvent(new CustomEvent('open-palette'))}
              >
                {IS_MAC ? '⌘K' : 'Ctrl+K'}
              </button>
            )}
            <SoundToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
