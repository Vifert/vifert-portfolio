import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal.js';
import LiveDot from '../components/LiveDot.jsx';

const MONO = "'JetBrains Mono', monospace";
const DISPLAY = "'Clash Display', sans-serif";
const IS_MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
const CMDK = IS_MAC ? '⌘K' : 'Ctrl+K';

const chip = {
  fontFamily: MONO,
  fontSize: '11px',
  color: '#A8B1C2',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  borderRadius: '999px',
  padding: '4px 11px',
};
const metric = { fontFamily: MONO, color: '#F5C169', fontSize: '13px' };
const heroLink = { fontFamily: MONO, fontSize: '13px', color: '#A8B1C2' };

const EXPERIENCE = [
  {
    period: ['OCT 2025', '— JAN 2026'],
    title: (
      <>
        Data Engineering Trainee — Databricks Stream <span style={{ color: '#F5A524' }}>@ Accenture</span>
      </>
    ),
    body: (
      <>
        Automated scalable ETL pipelines on AWS with PySpark and Delta Lake — daily processing time down{' '}
        <span style={metric}>35%</span>. Orchestrated production workflows with Git-based version control, holding{' '}
        <span style={metric}>99.9%</span> reliability and cutting deployment errors by <span style={metric}>25%</span>.
      </>
    ),
    tags: ['AWS', 'Databricks', 'PySpark', 'SQL', 'Delta Lake'],
  },
  {
    period: ['JUN 2024', '— JUL 2024'],
    title: (
      <>
        AEH Intern — GenAI / ML <span style={{ color: '#F5A524' }}>@ Accenture</span>
      </>
    ),
    body: (
      <>
        Completed <span style={metric}>180+ hours</span> of intensive GenAI, ML and automation training — top{' '}
        <span style={metric}>5%</span> of cohort assessments. Engineered a Rasa virtual agent for internal onboarding,
        cutting HR ticket resolution time by <span style={metric}>40%</span>.
      </>
    ),
    tags: ['Gen AI', 'Rasa', 'NLP', 'Python'],
  },
  {
    period: ['FEB 2023', '— MAY 2023'],
    title: (
      <>
        Artificial Neural Networks Intern <span style={{ color: '#F5A524' }}>· research</span>
      </>
    ),
    body: (
      <>
        Designed and optimized predictive neural network models in Python and PyTorch — baseline classification
        accuracy up <span style={metric}>15%</span> across 3 datasets. Recognized for exceptional performance across the
        3-month internship.
      </>
    ),
    tags: ['PyTorch', 'Keras', 'CNN', 'Pandas'],
  },
];

const PUBLICATIONS = [
  {
    n: '01',
    title: 'Enhancing Software Effort Estimation with Machine and Deep Learning Strategies',
    venue: 'IEEE · 2025',
    href: 'https://doi.org/10.1109/ICISS63372.2025.11076303',
    radius: '10px 10px 0 0',
    border: true,
  },
  {
    n: '02',
    title: 'Comparative Evaluation of Large Language Models for Abstractive Summarization',
    venue: 'IEEE · 2024',
    href: 'https://doi.org/10.1109/Confluence60223.2024.10463521',
    border: true,
  },
  {
    n: '03',
    title: 'Enhancing Algorithmic Trading Strategies with Sentiment Analysis: A Reinforcement Learning Approach',
    venue: 'IEEE · 2024',
    href: 'https://doi.org/10.1109/AIC61668.2024.10730940',
    border: true,
  },
  {
    n: '04',
    title: 'Neuro-Cognitive Pattern Recognition: Advancements in Memory-Related Disorders Identification',
    venue: 'IEEE · 2024',
    href: 'https://doi.org/10.1109/ESCI59607.2024.10497280',
    border: true,
  },
  {
    n: '05',
    title: 'Tomato Disease Classification Using CNN',
    venue: 'Springer · 2024',
    href: 'https://doi.org/10.1007/978-981-97-3690-4_20',
    radius: '0 0 10px 10px',
    border: false,
  },
];

const CERTS = [
  { org: 'DATABRICKS', name: 'Certified Data Engineer Associate', id: 'ID · 173817322' },
  { org: 'GOOGLE CLOUD', name: 'Cloud Digital Leader', id: 'ID · fa48ebc5754541fa91dbf3e69a6c9d13' },
  { org: 'ANTHROPIC', name: 'Claude Certified Architect — Foundations (CCA-F)', id: 'ID · 57akigddvhtg' },
];

function copyText(text) {
  const fallback = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallback());
  }
  return Promise.resolve(fallback());
}

export default function Home() {
  const canvasRef = useRef(null);
  const scrollerRef = useRef(null);
  const progressRef = useRef(null);
  const dragStartRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  useReveal();

  useEffect(() => {
    document.title = 'vifert daniel — ai / data engineer';
  }, []);

  useEffect(() => {
    const cleanups = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    // --- Particle field (hero) ---
    if (!reduced) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let W = 0;
        let H = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let pts = [];
        let raf = 0;
        let visible = true;
        const seed = () => {
          const n = Math.round(Math.min(70, Math.max(28, W / 24)));
          pts = Array.from({ length: n }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.22,
            vy: (Math.random() - 0.5) * 0.22,
            r: Math.random() * 1.4 + 0.6,
            amber: Math.random() < 0.16,
          }));
        };
        const resize = () => {
          const rect = canvas.parentElement.getBoundingClientRect();
          W = rect.width;
          H = rect.height;
          canvas.width = W * dpr;
          canvas.height = H * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          seed();
        };
        const tick = () => {
          if (visible && !document.hidden) {
            ctx.clearRect(0, 0, W, H);
            for (const p of pts) {
              p.x += p.vx;
              p.y += p.vy;
              if (p.x < -10) p.x = W + 10;
              if (p.x > W + 10) p.x = -10;
              if (p.y < -10) p.y = H + 10;
              if (p.y > H + 10) p.y = -10;
            }
            ctx.lineWidth = 1;
            for (let i = 0; i < pts.length; i++) {
              for (let j = i + 1; j < pts.length; j++) {
                const a = pts[i];
                const b = pts[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 12100) {
                  const t = 1 - Math.sqrt(d2) / 110;
                  ctx.strokeStyle = 'rgba(148, 163, 184, ' + (0.09 * t).toFixed(3) + ')';
                  ctx.beginPath();
                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(b.x, b.y);
                  ctx.stroke();
                }
              }
            }
            for (const p of pts) {
              ctx.fillStyle = p.amber ? 'rgba(245, 165, 36, 0.55)' : 'rgba(148, 163, 184, 0.35)';
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          raf = requestAnimationFrame(tick);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement);
        const io = new IntersectionObserver((es) => {
          visible = es[0].isIntersecting;
        });
        io.observe(canvas);
        resize();
        tick();
        cleanups.push(() => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
        });
      }
    }

    // --- Horizontal showcase: progress + drag ---
    const sc = scrollerRef.current;
    if (sc) {
      const onScroll = () => {
        const max = sc.scrollWidth - sc.clientWidth;
        const p = max > 0 ? sc.scrollLeft / max : 0;
        if (progressRef.current) progressRef.current.style.width = 33 + p * 67 + '%';
      };
      sc.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      let down = false;
      let startX = 0;
      let startL = 0;
      let moved = 0;
      const dn = (e) => {
        if (e.pointerType !== 'mouse') return;
        down = true;
        moved = 0;
        startX = e.clientX;
        startL = sc.scrollLeft;
        sc.style.cursor = 'grabbing';
        sc.style.scrollSnapType = 'none';
      };
      const mv = (e) => {
        if (!down) return;
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        sc.scrollLeft = startL - dx;
      };
      const up = () => {
        if (!down) return;
        down = false;
        sc.style.cursor = 'grab';
        setTimeout(() => {
          sc.style.scrollSnapType = 'x mandatory';
        }, 60);
      };
      const click = (e) => {
        if (moved > 8) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      sc.addEventListener('pointermove', mv);
      window.addEventListener('pointerup', up);
      sc.addEventListener('click', click, true);
      dragStartRef.current = dn;
      cleanups.push(() => {
        sc.removeEventListener('scroll', onScroll);
        sc.removeEventListener('pointermove', mv);
        window.removeEventListener('pointerup', up);
        sc.removeEventListener('click', click, true);
      });
    }

    // --- Card tilt (fine pointers only) ---
    if (fine && !reduced) {
      const cards = Array.from(document.querySelectorAll('#work-scroller article'));
      const offs = [];
      cards.forEach((card) => {
        const onMove = (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            'perspective(1000px) rotateX(' +
            (py * -5).toFixed(2) +
            'deg) rotateY(' +
            (px * 6).toFixed(2) +
            'deg) translateY(-4px)';
          // Border color is handled by the CSS :hover rule — touching it here would
          // wipe the inline color and fall back to currentColor (white) on leave.
        };
        const onLeave = () => {
          card.style.transform = '';
        };
        card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease';
        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);
        offs.push(() => {
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', onLeave);
        });
      });
      cleanups.push(() => offs.forEach((fn) => fn()));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const scrollByCard = (dir) => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const card = sc.querySelector('article');
    const w = card ? card.getBoundingClientRect().width + 26 : sc.clientWidth * 0.8;
    sc.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  const copyEmail = () => {
    copyText('vifertjdaniel@gmail.com').then((ok) => {
      setCopied(ok ? 'yes' : 'no');
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    });
  };
  const copyLabel = copied === 'yes' ? '✓ copied' : copied === 'no' ? "couldn't copy — use the address" : 'copy';
  const copyColor = copied === 'yes' ? '#7BC97F' : '#A8B1C2';

  return (
    <>
      <header style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
        <div data-hero style={{ position: 'relative', zIndex: 1, maxWidth: '1160px', margin: '0 auto', padding: '120px 24px 100px', width: '100%' }}>
          <p style={{ margin: '0 0 28px', fontFamily: MONO, fontSize: 'clamp(12px, 1.4vw, 14px)', color: '#F5A524', letterSpacing: '0.06em', animation: 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards' }}>
            ~/vifert · ai / data engineer
            <span aria-hidden="true" style={{ display: 'inline-block', width: '8px', height: '16px', background: '#F5A524', marginLeft: '8px', verticalAlign: 'middle', animation: 'caretBlink 1.15s step-end infinite' }} />
          </p>
          <h1 style={{ margin: '0 0 34px', fontFamily: "'Clash Display', 'Satoshi', sans-serif", fontWeight: 600, fontSize: 'clamp(46px, 9vw, 112px)', lineHeight: 0.99, letterSpacing: '-0.02em' }}>
            <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
              <span style={{ display: 'block', animation: 'rise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.22s backwards' }}>Vifert Jenuben</span>
            </span>
            <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.12em' }}>
              <span style={{ display: 'block', color: '#A8B1C2', animation: 'rise 1s cubic-bezier(0.16, 1, 0.3, 1) 0.38s backwards' }}>
                Daniel V<span style={{ color: '#F5A524' }}>.</span>
              </span>
            </span>
          </h1>
          <p style={{ margin: '0 0 22px', maxWidth: '620px', fontSize: 'clamp(17px, 2.2vw, 21px)', lineHeight: 1.65, color: '#8A93A6', fontWeight: 400, animation: 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.62s backwards' }}>
            I build <span style={{ color: '#E7EAF2', fontWeight: 500 }}>production-grade data systems</span> — and understand the{' '}
            <span style={{ color: '#F5A524', fontWeight: 500 }}>AI</span> running on top of them.
          </p>
          <p style={{ margin: '0 0 36px', maxWidth: '620px', fontSize: '15px', lineHeight: 1.7, color: '#6E7891', animation: 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.74s backwards' }}>
            Databricks · PySpark · Delta Lake by day, RAG and speech agents by conviction. Most recently a Data
            Engineering Trainee (Databricks stream) at Accenture — now pushing into agentic AI and orchestration.
          </p>
          <p style={{ margin: '0 0 40px', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: MONO, fontSize: '12.5px', color: '#A8B1C2', animation: 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.84s backwards' }}>
            <LiveDot />
            open to AI / data engineering roles — India &amp; remote
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px, 3vw, 28px)', flexWrap: 'wrap', animation: 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.94s backwards' }}>
            <a className="hero-link" href="https://github.com/Vifert" target="_blank" rel="noreferrer" style={heroLink}>
              github <span style={{ color: '#F5A524' }}>↗</span>
            </a>
            <a className="hero-link" href="https://www.linkedin.com/in/vifert-daniel/" target="_blank" rel="noreferrer" style={heroLink}>
              linkedin <span style={{ color: '#F5A524' }}>↗</span>
            </a>
            <a className="hero-link" href="mailto:vifertjdaniel@gmail.com" style={heroLink}>
              email <span style={{ color: '#F5A524' }}>↗</span>
            </a>
            <span aria-hidden="true" style={{ width: '1px', height: '16px', background: 'rgba(148, 163, 184, 0.2)' }} />
            <button
              type="button"
              className="hero-cmdk"
              onClick={() => window.dispatchEvent(new CustomEvent('open-palette'))}
              style={{ fontFamily: MONO, fontSize: '12px', color: '#6E7891', background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'color 0.2s ease' }}
            >
              press {CMDK} to explore like an engineer
            </button>
          </div>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '26px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'fadeUp 1s ease 1.4s backwards' }}>
          <span style={{ fontFamily: MONO, fontSize: '10.5px', color: '#6E7891', letterSpacing: '0.18em' }}>SCROLL</span>
          <span style={{ width: '1px', height: '42px', background: 'linear-gradient(#F5A524, rgba(245, 165, 36, 0.1))', animation: 'scrollLine 2.1s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
        </div>
      </header>

      {/* ===== Experience ===== */}
      <section id="experience" style={{ maxWidth: '1160px', margin: '0 auto', padding: 'clamp(70px, 11vh, 130px) 24px 30px' }}>
        <div data-reveal="1" style={{ display: 'flex', alignItems: 'baseline', gap: '18px', marginBottom: '44px' }}>
          <span style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>// 01</span>
          <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.01em' }}>Experience</h2>
          <span aria-hidden="true" style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.12)', alignSelf: 'center' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EXPERIENCE.map((job, i) => (
            <div key={i} data-reveal="1" className="row-hover" style={{ display: 'grid', gridTemplateColumns: 'minmax(6.5rem, 10rem) 1fr', gap: '18px', padding: '26px 18px', borderRadius: '14px' }}>
              <div style={{ fontFamily: MONO, fontSize: '12px', color: '#6E7891', letterSpacing: '0.04em', paddingTop: '4px' }}>
                {job.period[0]}<br />{job.period[1]}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600, color: '#E7EAF2' }}>{job.title}</h3>
                <p style={{ margin: '10px 0 0', fontSize: '14.5px', lineHeight: 1.75, color: '#8A93A6', maxWidth: '640px' }}>{job.body}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                  {job.tags.map((t) => (
                    <span key={t} style={chip}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Selected work ===== */}
      <section id="work" style={{ padding: 'clamp(70px, 11vh, 130px) 0 30px' }}>
        <div data-reveal="1" style={{ maxWidth: '1160px', margin: '0 auto 44px', padding: '0 24px', display: 'flex', alignItems: 'baseline', gap: '18px' }}>
          <span style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>// 02</span>
          <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.01em' }}>Selected work</h2>
          <span aria-hidden="true" style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.12)', alignSelf: 'center' }} />
          <span style={{ fontFamily: MONO, fontSize: '11.5px', color: '#6E7891', whiteSpace: 'nowrap' }}>drag →</span>
        </div>

        <div className="work-rail">
        <button type="button" className="work-arrow work-arrow--prev" aria-label="Previous project" onClick={() => scrollByCard(-1)}>←</button>
        <div
          id="work-scroller"
          ref={scrollerRef}
          onPointerDown={(e) => dragStartRef.current && dragStartRef.current(e)}
          style={{ display: 'flex', gap: '26px', overflowX: 'auto', scrollSnapType: 'x mandatory', cursor: 'grab', scrollbarWidth: 'none' }}
        >
          {/* DineDash */}
          <article data-reveal="1" className="work-card" style={{ flex: '0 0 auto', width: 'min(80vw, 840px)', scrollSnapAlign: 'center', background: 'linear-gradient(165deg, #10141C 0%, #0C1018 100%)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: 'clamp(26px, 4vw, 46px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '30px' }}>
            <div>
              <p style={{ margin: '0 0 10px', fontFamily: MONO, fontSize: '11.5px', color: '#F5A524', letterSpacing: '0.14em' }}>END-TO-END BIG DATA PIPELINE · 2025–26</p>
              <h3 style={{ margin: '0 0 14px', fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(26px, 3.2vw, 36px)' }}>DineDash Analytics</h3>
              <p style={{ margin: '0 0 22px', fontSize: '15px', lineHeight: 1.7, color: '#8A93A6', maxWidth: '46ch' }}>Streaming medallion pipeline on Databricks — Auto Loader ingesting daily JSON/CSV, Delta Live Tables enforcing declarative data-quality gates, Workflows refreshing analytics with zero manual intervention.</p>
              <div style={{ display: 'flex', gap: 'clamp(18px, 3vw, 34px)', flexWrap: 'wrap', marginBottom: '22px' }}>
                <div><div style={{ fontFamily: MONO, fontSize: 'clamp(20px, 2.4vw, 27px)', fontWeight: 600, color: '#F5A524' }}>&lt;1 min</div><div style={{ fontSize: '11px', color: '#6E7891', letterSpacing: '0.1em', marginTop: '4px' }}>INGEST LATENCY</div></div>
                <div><div style={{ fontFamily: MONO, fontSize: 'clamp(20px, 2.4vw, 27px)', fontWeight: 600, color: '#F5A524' }}>24%</div><div style={{ fontSize: '11px', color: '#6E7891', letterSpacing: '0.1em', marginTop: '4px' }}>BAD RECORDS QUARANTINED</div></div>
                <div><div style={{ fontFamily: MONO, fontSize: 'clamp(20px, 2.4vw, 27px)', fontWeight: 600, color: '#F5A524' }}>0</div><div style={{ fontSize: '11px', color: '#6E7891', letterSpacing: '0.1em', marginTop: '4px' }}>MANUAL STEPS / DAY</div></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['Databricks', 'PySpark', 'Delta Live Tables', 'Advanced SQL'].map((t) => (
                  <span key={t} style={chip}>{t}</span>
                ))}
              </div>
              <Link to="/projects#dinedash" draggable="false" style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>full case study →</Link>
            </div>
            <div aria-hidden="true" style={{ background: '#0B0F16', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '14px', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0, minHeight: '230px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#C98A4B', flexShrink: 0 }} /><span style={{ fontFamily: MONO, fontSize: '11.5px', color: '#C98A4B' }}>bronze</span><span style={{ fontFamily: MONO, fontSize: '11px', color: '#6E7891' }}>— raw streaming events</span></div>
              <div style={{ position: 'relative', width: '1px', height: '34px', marginLeft: '6px', background: 'rgba(148, 163, 184, 0.18)' }}><span style={{ position: 'absolute', left: '-1.5px', width: '4px', height: '4px', borderRadius: '50%', background: '#F5A524', animation: 'flowY 2.6s linear infinite' }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#B9C2D0', flexShrink: 0 }} /><span style={{ fontFamily: MONO, fontSize: '11.5px', color: '#B9C2D0' }}>silver</span><span style={{ fontFamily: MONO, fontSize: '11px', color: '#6E7891' }}>— DLT quality gates</span></div>
              <div style={{ position: 'relative', width: '1px', height: '34px', marginLeft: '6px', background: 'rgba(148, 163, 184, 0.18)' }}><span style={{ position: 'absolute', left: '-1.5px', width: '4px', height: '4px', borderRadius: '50%', background: '#F5A524', animation: 'flowY 2.6s linear 1.3s infinite' }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#F5C542', flexShrink: 0 }} /><span style={{ fontFamily: MONO, fontSize: '11.5px', color: '#F5C542' }}>gold</span><span style={{ fontFamily: MONO, fontSize: '11px', color: '#6E7891' }}>— analytics-ready tables</span></div>
            </div>
          </article>

          {/* Julie */}
          <article data-reveal="1" className="work-card" style={{ flex: '0 0 auto', width: 'min(80vw, 840px)', scrollSnapAlign: 'center', background: 'linear-gradient(165deg, #10141C 0%, #0C1018 100%)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: 'clamp(26px, 4vw, 46px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '30px' }}>
            <div>
              <p style={{ margin: '0 0 10px', fontFamily: MONO, fontSize: '11.5px', color: '#F5A524', letterSpacing: '0.14em' }}>SPEECH-TO-SPEECH AGENT · 2024</p>
              <h3 style={{ margin: '0 0 14px', fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(26px, 3.2vw, 36px)' }}>Julie</h3>
              <p style={{ margin: '0 0 22px', fontSize: '15px', lineHeight: 1.7, color: '#8A93A6', maxWidth: '46ch' }}>A voice-in, voice-out assistant for mining operations — Whisper ASR, retrieval-augmented generation over operational protocols, a local LLM, and OpenVoice synthesis. Built for places where reading a screen isn't an option.</p>
              <div style={{ display: 'flex', gap: 'clamp(18px, 3vw, 34px)', flexWrap: 'wrap', marginBottom: '22px' }}>
                <div><div style={{ fontFamily: MONO, fontSize: 'clamp(20px, 2.4vw, 27px)', fontWeight: 600, color: '#F5A524' }}>−30%</div><div style={{ fontSize: '11px', color: '#6E7891', letterSpacing: '0.1em', marginTop: '4px' }}>EMERGENCY COMMS LATENCY</div></div>
                <div><div style={{ fontFamily: MONO, fontSize: 'clamp(20px, 2.4vw, 27px)', fontWeight: 600, color: '#F5A524' }}>+45%</div><div style={{ fontSize: '11px', color: '#6E7891', letterSpacing: '0.1em', marginTop: '4px' }}>RESPONSE PRECISION (RAG)</div></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['Local LLM', 'RAG', 'Whisper', 'OpenVoice'].map((t) => (
                  <span key={t} style={chip}>{t}</span>
                ))}
              </div>
              <Link to="/projects#julie" draggable="false" style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>full case study →</Link>
            </div>
            <div aria-hidden="true" style={{ background: '#0B0F16', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '14px', padding: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', minHeight: '230px' }}>
              {[
                { h: 18, c: '#2A3346', d: '0s' },
                { h: 34, c: '#2A3346', d: '0.12s' },
                { h: 52, c: '#3D4A63', d: '0.24s' },
                { h: 78, c: '#F5A524', d: '0.36s' },
                { h: 96, c: '#F5A524', d: '0.48s' },
                { h: 70, c: '#F5C169', d: '0.6s' },
                { h: 88, c: '#F5A524', d: '0.72s' },
                { h: 56, c: '#3D4A63', d: '0.84s' },
                { h: 36, c: '#2A3346', d: '0.96s' },
                { h: 20, c: '#2A3346', d: '1.08s' },
              ].map((bar, i) => (
                <span key={i} style={{ width: '5px', height: bar.h + 'px', borderRadius: '3px', background: bar.c, animation: `wave 0.9s ease-in-out ${bar.d} infinite alternate` }} />
              ))}
            </div>
          </article>

          {/* Onboarding Agent */}
          <article data-reveal="1" className="work-card" style={{ flex: '0 0 auto', width: 'min(80vw, 840px)', scrollSnapAlign: 'center', background: 'linear-gradient(165deg, #10141C 0%, #0C1018 100%)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '20px', padding: 'clamp(26px, 4vw, 46px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '30px' }}>
            <div>
              <p style={{ margin: '0 0 10px', fontFamily: MONO, fontSize: '11.5px', color: '#F5A524', letterSpacing: '0.14em' }}>CONVERSATIONAL AI · ACCENTURE · 2024</p>
              <h3 style={{ margin: '0 0 14px', fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(26px, 3.2vw, 36px)' }}>Onboarding Agent</h3>
              <p style={{ margin: '0 0 22px', fontSize: '15px', lineHeight: 1.7, color: '#8A93A6', maxWidth: '46ch' }}>An intent-driven virtual agent on the Rasa framework, handling internal onboarding questions end-to-end — NLU, dialogue policies, and actions wired into HR workflows.</p>
              <div style={{ display: 'flex', gap: 'clamp(18px, 3vw, 34px)', flexWrap: 'wrap', marginBottom: '22px' }}>
                <div><div style={{ fontFamily: MONO, fontSize: 'clamp(20px, 2.4vw, 27px)', fontWeight: 600, color: '#F5A524' }}>−40%</div><div style={{ fontSize: '11px', color: '#6E7891', letterSpacing: '0.1em', marginTop: '4px' }}>HR TICKET RESOLUTION TIME</div></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {['Rasa', 'NLU', 'Python'].map((t) => (
                  <span key={t} style={chip}>{t}</span>
                ))}
              </div>
              <Link to="/projects#rasa" draggable="false" style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>full case study →</Link>
            </div>
            <div aria-hidden="true" style={{ background: '#0B0F16', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '14px', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', minHeight: '230px' }}>
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: '#151B26', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px 12px 12px 3px', padding: '10px 14px', fontFamily: MONO, fontSize: '11.5px', color: '#A8B1C2', lineHeight: 1.6 }}>hey — where do I request my dev environment?</div>
              <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'rgba(245, 165, 36, 0.09)', border: '1px solid rgba(245, 165, 36, 0.25)', borderRadius: '12px 12px 3px 12px', padding: '10px 14px', fontFamily: MONO, fontSize: '11.5px', color: '#F5C169', lineHeight: 1.6 }}>intent: env_setup → guiding you now. no ticket needed.</div>
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '6px 2px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6E7891', animation: 'typing 1.2s ease 0s infinite' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6E7891', animation: 'typing 1.2s ease 0.2s infinite' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6E7891', animation: 'typing 1.2s ease 0.4s infinite' }} />
              </div>
            </div>
          </article>
        </div>
        <button type="button" className="work-arrow work-arrow--next" aria-label="Next project" onClick={() => scrollByCard(1)}>→</button>
        </div>

        <div data-reveal="1" style={{ maxWidth: '1160px', margin: '28px auto 0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ flex: 1, height: '2px', background: 'rgba(148, 163, 184, 0.12)', borderRadius: '2px', overflow: 'hidden' }}>
            <div ref={progressRef} style={{ height: '100%', width: '33%', background: '#F5A524', borderRadius: '2px', transition: 'width 0.15s ease-out' }} />
          </div>
        </div>
      </section>

      {/* ===== Publications ===== */}
      <section id="publications" style={{ maxWidth: '1160px', margin: '0 auto', padding: 'clamp(70px, 11vh, 130px) 24px 30px' }}>
        <div data-reveal="1" style={{ display: 'flex', alignItems: 'baseline', gap: '18px', marginBottom: '14px' }}>
          <span style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>// 03</span>
          <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.01em' }}>Publications</h2>
          <span aria-hidden="true" style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.12)', alignSelf: 'center' }} />
        </div>
        <p data-reveal="1" style={{ margin: '0 0 34px', fontSize: '14px', color: '#6E7891', maxWidth: '60ch' }}>Peer-reviewed research from the AI side of the house — vision, NLP, and reinforcement learning.</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PUBLICATIONS.map((pub) => (
            <a
              key={pub.n}
              data-reveal="1"
              className="pub-row"
              href={pub.href}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'grid', gridTemplateColumns: '2.6rem 1fr auto', gap: '16px', alignItems: 'baseline', padding: '20px 14px', borderBottom: pub.border ? '1px solid rgba(148, 163, 184, 0.09)' : 'none', borderRadius: pub.radius || undefined }}
            >
              <span style={{ fontFamily: MONO, fontSize: '12px', color: '#6E7891' }}>{pub.n}</span>
              <span style={{ fontSize: '15.5px', fontWeight: 500, lineHeight: 1.55, color: 'inherit' }}>{pub.title}</span>
              <span style={{ fontFamily: MONO, fontSize: '11.5px', color: '#6E7891', whiteSpace: 'nowrap' }}>{pub.venue} <span style={{ color: '#F5A524' }}>↗</span></span>
            </a>
          ))}
        </div>
      </section>

      {/* ===== Certifications ===== */}
      <section id="certifications" style={{ maxWidth: '1160px', margin: '0 auto', padding: 'clamp(70px, 11vh, 130px) 24px 30px' }}>
        <div data-reveal="1" style={{ display: 'flex', alignItems: 'baseline', gap: '18px', marginBottom: '44px' }}>
          <span style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>// 04</span>
          <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.01em' }}>Certifications</h2>
          <span aria-hidden="true" style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.12)', alignSelf: 'center' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          {CERTS.map((c) => (
            <div key={c.name} data-reveal="1" className="cert-card" style={{ background: '#10141C', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '14px', padding: '26px' }}>
              <p style={{ margin: '0 0 10px', fontFamily: MONO, fontSize: '10.5px', color: '#F5A524', letterSpacing: '0.16em' }}>{c.org}</p>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, lineHeight: 1.45 }}>{c.name}</h3>
              <p style={{ margin: 0, fontFamily: MONO, fontSize: '11px', color: '#6E7891', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.id}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section id="contact" style={{ maxWidth: '1160px', margin: '0 auto', padding: 'clamp(90px, 14vh, 160px) 24px clamp(60px, 8vh, 90px)', textAlign: 'center' }}>
        <p data-reveal="1" style={{ margin: '0 0 18px', fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>// 05 — contact</p>
        <h2 data-reveal="1" style={{ margin: '0 auto 22px', maxWidth: '760px', fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(32px, 5.5vw, 60px)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
          Let's build something that holds up in production<span style={{ color: '#F5A524' }}>.</span>
        </h2>
        <p data-reveal="1" style={{ margin: '0 auto 40px', maxWidth: '54ch', fontSize: '15.5px', lineHeight: 1.7, color: '#8A93A6' }}>I'm open to AI and data engineering roles — India or remote. Whether it's a role, a pipeline question, or just to say hi, my inbox is open.</p>
        <div data-reveal="1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <a data-magnetic="0.3" className="cta__btn cta__btn--inline" href="mailto:vifertjdaniel@gmail.com" style={{ fontFamily: MONO, fontSize: 'clamp(13px, 2vw, 15px)', color: '#F5A524', border: '1px solid rgba(245, 165, 36, 0.45)', borderRadius: '10px', padding: '14px 26px', transition: 'background 0.2s ease' }}>vifertjdaniel@gmail.com</a>
          <button type="button" data-magnetic="0.3" className="copy-btn" onClick={copyEmail} style={{ fontFamily: MONO, fontSize: '12px', color: copyColor, background: 'none', border: '1px solid rgba(148, 163, 184, 0.25)', borderRadius: '10px', padding: '14px 18px', cursor: 'pointer' }}>{copyLabel}</button>
        </div>
      </section>
    </>
  );
}
