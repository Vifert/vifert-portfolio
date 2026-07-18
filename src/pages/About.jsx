import { useEffect, useRef } from 'react';
import { useReveal } from '../hooks/useReveal.js';
import LiveDot from '../components/LiveDot.jsx';

const MILESTONES = [
  {
    era: '2021 — 2023 · RESEARCH',
    title: 'It started with papers, not pipelines.',
    text: 'CNN-based image classification, a comparative study of LLMs for summarization, an RL trading strategy driven by sentiment — the years I spent figuring out how these models actually think.',
    tags: ['PyTorch', 'Keras', 'Research'],
  },
  {
    era: 'FEB — JUL 2024 · APPLIED AI',
    title: 'Then I wanted those models talking to people.',
    text: "A Rasa onboarding agent cutting HR ticket time by 40%, and Julie — a speech-to-speech assistant grounded with RAG for field teams who can't stop to read a screen.",
    tags: ['RAG', 'NLU', 'Whisper', 'OpenVoice'],
  },
  {
    era: 'OCT 2025 — JAN 2026 · DATA ENGINEERING',
    title: 'Now make it hold up in production.',
    text: 'A Databricks traineeship at Accenture (35% faster processing, 99.9% reliability) and DineDash, a medallion pipeline built to actually enforce data quality, not just move bytes.',
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'Medallion Arch.'],
  },
  {
    era: 'APR 2026 — PRESENT · ACCENTURE × AMERICAN EXPRESS',
    title: 'First project out of training. Team lead within two months.',
    text: 'Data Engineer on a large-scale cloud replatforming program for American Express — migrating entire use-cases and production pipelines from an on-prem enterprise warehouse to Google Cloud. End-to-end ownership: re-engineering legacy Hive/Spark workloads in Scala for Dataproc, rebuilding orchestration on Cloud Composer, moving HBase to Bigtable, and validating every landing across dev, test, and prod.',
    tags: ['GCP', 'BigQuery', 'Cloud Composer', 'Dataproc', 'Spark (Scala)', 'HBase → Bigtable'],
  },
  {
    era: 'IN PARALLEL · AGENTIC AI',
    title: 'Merging both halves.',
    text: 'Pushing into agentic systems and orchestration — production data infrastructure that AI agents can reason over and actually act on, not just query.',
    tags: ['Agentic AI', 'Orchestration', 'LLMs + Data'],
  },
];

const TOOLBOX = [
  {
    label: 'DATABRICKS & LAKEHOUSE',
    items: ['Databricks', 'PySpark', 'Delta Lake', 'Unity Catalog', 'Databricks Workflows', 'Medallion Arch.', 'ETL/ELT'],
  },
  {
    label: 'CLOUD & ORCHESTRATION',
    items: ['GCP', 'AWS', 'BigQuery', 'Dataproc', 'Bigtable', 'Airflow / DAGs', 'Data Warehousing', 'Automated Data Validation', 'Git / Actions'],
  },
  {
    label: 'LANGUAGES',
    items: ['Advanced SQL', 'Python', 'Scala', 'Java'],
  },
  {
    label: 'AI / ML',
    items: ['ML', 'DL', 'RL', 'CNN', 'LLM', 'RAG', 'Vector Databases', 'Prompt Engineering', 'Context Engineering', 'NLP', 'Rasa'],
  },
];

function SectionHead({ label, title, variant }) {
  const cls = 'section-head' + (variant ? ' section-head--' + variant : '');
  return (
    <div data-reveal="1" className={cls}>
      <span className="section-head__label">{label}</span>
      <h2 className="section-head__title">{title}</h2>
      <span aria-hidden="true" className="section-head__rule" />
    </div>
  );
}

export default function About() {
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  useReveal();

  useEffect(() => {
    document.title = 'about — vifert daniel';
  }, []);

  // Scroll-linked timeline: the amber line fills to 70% of the viewport height,
  // lighting each milestone marker as it passes.
  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return undefined;
    const markers = Array.from(track.querySelectorAll('[data-tl-marker]'));
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.7;
      let p = (triggerY - rect.top) / rect.height;
      p = Math.max(0, Math.min(1, p));
      const filledPx = p * rect.height;
      fill.style.height = filledPx + 'px';
      markers.forEach((m) => {
        const mRect = m.getBoundingClientRect();
        const mY = (mRect.top - rect.top) + mRect.height / 2;
        const on = filledPx >= mY - 6;
        m.style.borderColor = on ? '#F5A524' : 'rgba(148, 163, 184, 0.3)';
        m.style.background = on ? '#F5A524' : '#0A0D13';
        m.style.boxShadow = on ? '0 0 0 4px rgba(245, 165, 36, 0.15)' : 'none';
      });
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
      <header className="about-hero">
        <div data-reveal="1" className="about-hero__media">
          <div className="about-hero__frame">
            <img
              src="/assets/vifert.jpeg"
              alt="Vifert Jenuben Daniel V"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/portrait-placeholder.svg';
              }}
            />
          </div>
          <p className="about-hero__loc">Chennai, India</p>
        </div>
        <div className="about-hero__body">
          <p data-reveal="1" className="kicker">// about</p>
          <h1 data-reveal="1" className="about-hero__title">
            Hi, I'm Vifert<span style={{ color: '#F5A524' }}>.</span>
          </h1>
          <p data-reveal="1" className="about-hero__p">
            I'm genuinely fascinated by two things at once: how AI models actually work, and the satisfaction of
            building systems solid enough to survive contact with production. Most of what I build sits right at
            that overlap.
          </p>
          <p data-reveal="1" className="about-hero__p">
            I think in terms of what actually moved — latency down, errors down, accuracy up — not just what got
            shipped. And I'm a relentless learner: I pick up new tools fast, then go a level deeper than the task
            strictly needs, usually ending up with a certification to show for it.
          </p>
          <p data-reveal="1" className="about-hero__p">
            Off the clock I'm deep into gaming and anime, and almost always mid-way through some new tool I didn't
            strictly need to learn yet.
          </p>
        </div>
      </header>

      <section className="section section--arc">
        <SectionHead label="// arc" title="How I got here" variant="tight" />
        <p data-reveal="1" className="tl-hint">Scroll — the line fills in as you go.</p>

        <div ref={trackRef} className="tl">
          <div aria-hidden="true" className="tl__line" />
          <div ref={fillRef} aria-hidden="true" className="tl__fill" />

          {MILESTONES.map((m, i) => (
            <div key={m.era} data-reveal="1" className="tl__item">
              <div className="tl__dotcol">
                <span data-tl-marker={i} className="tl__marker" />
              </div>
              <div className="tl__body">
                <p className="tl__era">{m.era}</p>
                <h3 className="tl__title">{m.title}</h3>
                <p className="tl__text">{m.text}</p>
                <div className="tl__tags">
                  {m.tags.map((tag) => (
                    <span key={tag} className="chip">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead label="// toolbox" title="Toolbox" />
        <div className="toolbox-grid" data-reveal-group>
          {TOOLBOX.map((group) => (
            <div key={group.label} data-reveal="1" className="tool-card">
              <p className="tool-card__label">{group.label}</p>
              <div className="tool-card__chips">
                {group.items.map((item) => (
                  <span key={item} className="chip chip--tight">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead label="// education" title="Education" />
        <div data-reveal="1" className="edu-row">
          <div className="edu-years">2021<br />— 2025</div>
          <div>
            <h3 className="edu-degree">B.Tech, Computer Science — Artificial Intelligence</h3>
            <p className="edu-school">Amrita Vishwa Vidyapeetham, Chennai · CGPA 8.99/10</p>
            <div className="edu-tags">
              <span className="chip">Topper — End Semester</span>
              <span className="chip">Honors List, multiple semesters</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHead label="// off the clock" title="When I'm not shipping pipelines" variant="mid" />
        <p data-reveal="1" className="offclock__lead">Same curiosity, fewer production incidents.</p>
        <div data-reveal="1" className="offclock__chips">
          <span className="pill-amber">Gaming</span>
          <span className="pill-amber">Anime</span>
          <span className="pill-amber">Chennai, IN</span>
          <span className="pill-amber">Certification collector</span>
          <span className="pill-live">
            <LiveDot />
            currently deep in agentic AI
          </span>
        </div>
      </section>

      <section className="cta">
        <p data-reveal="1" className="kicker">// say hi</p>
        <h2 data-reveal="1" className="cta__title">
          If any of this overlaps with what you're building, let's talk.
        </h2>
        <a data-reveal="1" data-magnetic="0.3" href="mailto:vifertjdaniel@gmail.com" className="cta__btn">
          vifertjdaniel@gmail.com
        </a>
      </section>
    </>
  );
}
