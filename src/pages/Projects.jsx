import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';

const MONO = "'JetBrains Mono', monospace";
const DISPLAY = "'Clash Display', sans-serif";

const chip = {
  fontFamily: MONO,
  fontSize: '11px',
  color: '#A8B1C2',
  border: '1px solid rgba(148, 163, 184, 0.18)',
  borderRadius: '999px',
  padding: '4px 11px',
};

const DINEDASH_STAGES = [
  { icon: 'SRC', label: 'Sources', sublabel: 'JSON / CSV', detail: "Upstream systems drop daily order, delivery, and restaurant JSON and CSV batches — the same messy shape you'd get from a real food-delivery stack, not a clean tutorial CSV." },
  { icon: 'AL', label: 'Auto Loader', sublabel: 'ingest', detail: 'Databricks Auto Loader picks up new files incrementally and streams them in — no manual polling, sub-minute latency from file landing to table.' },
  { icon: 'BRZ', label: 'Bronze', sublabel: 'raw', detail: 'Landed as-is into Delta Lake — full fidelity, full history, nothing thrown away. This layer can always be replayed from scratch.' },
  { icon: 'SLV', label: 'Silver', sublabel: 'DLT rules', detail: 'Delta Live Tables enforce declarative quality constraints in SQL and PySpark — 24% of records get quarantined here, and 10+ nested structures get normalized into clean rows.' },
  { icon: 'GLD', label: 'Gold', sublabel: 'aggregates', detail: 'Business-ready aggregates — order volume, delivery SLAs, restaurant performance — modeled for direct BI consumption.' },
  { icon: 'WF', label: 'Workflows', sublabel: 'orchestration', detail: 'Databricks Workflows schedule the entire run and refresh downstream dashboards automatically — zero manual steps, every single day.' },
];

const JULIE_STAGES = [
  { icon: 'MIC', label: 'Voice In', sublabel: 'field audio', detail: 'A field operator speaks naturally — no menus, no keywords, because stopping to read a screen mid-shift in a mine isn\'t realistic.' },
  { icon: 'ASR', label: 'Whisper', sublabel: 'speech→text', detail: 'OpenAI Whisper transcribes speech to text in real time, tuned to hold up against noisy industrial audio.' },
  { icon: 'RAG', label: 'Retrieval', sublabel: 'grounding', detail: 'The query is matched against real operational protocol documents — safety procedures, equipment manuals — so answers are grounded, not guessed.' },
  { icon: 'LLM', label: 'Local LLM', sublabel: 'reasoning', detail: 'A locally-hosted LLM reasons over the retrieved protocol context and drafts a precise, situation-specific response — 45% more precise than ungrounded generation.' },
  { icon: 'TTS', label: 'OpenVoice', sublabel: 'text→speech', detail: 'OpenVoice synthesizes the reply back into natural speech — cutting emergency communication latency by 30% versus manual lookup.' },
];

const RASA_STAGES = [
  { icon: 'MSG', label: 'Message', sublabel: 'employee', detail: 'A new hire messages the bot instead of opening an HR ticket — "where do I request my dev environment?"' },
  { icon: 'NLU', label: 'NLU', sublabel: 'intent+entity', detail: "Rasa's NLU pipeline classifies intent and extracts entities from free text — no rigid menu tree required." },
  { icon: 'PLC', label: 'Policy', sublabel: 'dialogue mgmt', detail: 'Trained dialogue policies pick the next best action from full conversation state, not just the last message.' },
  { icon: 'ACT', label: 'Action', sublabel: 'python', detail: 'A custom Python action executes the real task — surfacing the right onboarding doc, kicking off a provisioning request.' },
  { icon: 'RES', label: 'Resolved', sublabel: 'no ticket', detail: 'The employee gets an answer inline — cutting HR ticket resolution time by 40%, with no human in the loop.' },
];

function PipelineFlow({ stages, activeIdx, onSelect }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 0, marginBottom: '4px' }}>
      {stages.map((s, i) => {
        const on = i === activeIdx;
        const node = (
          <div
            key={`n-${i}`}
            role="button"
            tabIndex={0}
            onMouseEnter={() => onSelect(i)}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(i);
              }
            }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 8px',
              borderRadius: '12px',
              minWidth: '92px',
              border: '1px solid ' + (on ? 'rgba(245, 165, 36, 0.55)' : 'rgba(148, 163, 184, 0.14)'),
              background: on ? 'rgba(245, 165, 36, 0.08)' : 'transparent',
              transition: 'border-color 0.25s ease, background 0.25s ease',
            }}
          >
            <span
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: MONO,
                fontSize: '10.5px',
                fontWeight: 600,
                background: on ? 'rgba(245, 165, 36, 0.14)' : 'rgba(148, 163, 184, 0.06)',
                color: on ? '#F5A524' : '#8A93A6',
                border: '1px solid ' + (on ? 'rgba(245, 165, 36, 0.4)' : 'rgba(148, 163, 184, 0.18)'),
                transition: 'all 0.25s ease',
              }}
            >
              {s.icon}
            </span>
            <span style={{ fontFamily: MONO, fontSize: '11px', fontWeight: 600, color: on ? '#F5C169' : '#A8B1C2', whiteSpace: 'nowrap' }}>{s.label}</span>
            <span style={{ fontFamily: MONO, fontSize: '9px', color: '#6E7891', whiteSpace: 'nowrap' }}>{s.sublabel}</span>
          </div>
        );
        const arrow =
          i < stages.length - 1 ? (
            <div key={`a-${i}`} aria-hidden="true" style={{ position: 'relative', width: '24px', height: '42px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ width: '100%', height: '1px', background: 'rgba(148, 163, 184, 0.18)' }} />
              <span style={{ position: 'absolute', top: '50%', width: '4px', height: '4px', marginTop: '-2px', borderRadius: '50%', background: '#F5A524', animation: `flowX 2.6s linear ${(i * 0.4).toFixed(1)}s infinite` }} />
            </div>
          ) : null;
        return [node, arrow];
      })}
    </div>
  );
}

function ProjectArticle({ id, screenLabel, num, title, meta, note, description, stats, tags, stages, activeIdx, onSelect }) {
  const active = stages[activeIdx];
  return (
    <article id={id} data-screen-label={screenLabel} style={{ maxWidth: '1160px', margin: '0 auto', padding: '56px 24px', borderTop: '1px solid rgba(148, 163, 184, 0.09)', scrollMarginTop: '80px' }}>
      <div data-reveal="1" style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <span style={{ fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>{num}</span>
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(28px, 4vw, 42px)' }}>{title}</h2>
      </div>
      <p data-reveal="1" style={{ margin: note ? '0 0 18px' : '0 0 22px', fontFamily: MONO, fontSize: '12px', color: '#6E7891' }}>{meta}</p>
      {note && (
        <div data-reveal="1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '22px', fontFamily: MONO, fontSize: '11.5px', color: '#8A93A6', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: '8px', padding: '7px 13px' }}>{note}</div>
      )}
      <p data-reveal="1" style={{ margin: '0 0 28px', fontSize: '15.5px', lineHeight: 1.8, color: '#A8B1C2', maxWidth: '68ch' }}>{description}</p>

      <div data-reveal="1" style={{ display: 'flex', gap: 'clamp(24px, 4vw, 46px)', flexWrap: 'wrap', marginBottom: '28px' }}>
        {stats.map((st) => (
          <div key={st.label}>
            <div style={{ fontFamily: MONO, fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 600, color: '#F5A524' }}>{st.value}</div>
            <div style={{ fontSize: '11px', color: '#6E7891', letterSpacing: '0.09em', marginTop: '4px' }}>{st.label}</div>
          </div>
        ))}
      </div>

      <div data-reveal="1" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '34px' }}>
        {tags.map((t) => (
          <span key={t} style={chip}>{t}</span>
        ))}
      </div>

      <div data-reveal="1" style={{ background: '#10141C', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: 'clamp(20px, 3vw, 34px)' }}>
        <p style={{ margin: '0 0 18px', fontFamily: MONO, fontSize: '11px', color: '#6E7891', letterSpacing: '0.1em' }}>PIPELINE — hover or tap a stage</p>
        <PipelineFlow stages={stages} activeIdx={activeIdx} onSelect={onSelect} />
        <div style={{ marginTop: '18px', background: '#0B0F16', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '12px', padding: '20px 24px' }}>
          <div key={activeIdx} className="stage-detail">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: MONO, fontSize: '10.5px', color: '#F5A524', letterSpacing: '0.08em' }}>STAGE {activeIdx + 1}/{stages.length}</span>
              <span style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 600, color: '#E7EAF2' }}>{active.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.75, color: '#A8B1C2', maxWidth: '68ch' }}>{active.detail}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [active, setActive] = useState({ dinedash: 0, julie: 0, rasa: 0 });
  useReveal();

  useEffect(() => {
    document.title = 'projects — vifert daniel';
  }, []);

  const select = (key) => (idx) => setActive((s) => ({ ...s, [key]: idx }));

  return (
    <>
      <header style={{ maxWidth: '1160px', margin: '0 auto', padding: 'clamp(130px, 20vh, 170px) 24px 30px' }}>
        <p data-reveal="1" style={{ margin: '0 0 18px', fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>// projects</p>
        <h1 data-reveal="1" style={{ margin: '0 0 24px', fontFamily: DISPLAY, fontWeight: 600, fontSize: 'clamp(36px, 6vw, 62px)', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '820px' }}>
          Selected work, <span style={{ color: '#A8B1C2' }}>in depth.</span>
        </h1>
        <p data-reveal="1" style={{ margin: 0, maxWidth: '660px', fontSize: '16px', lineHeight: 1.75, color: '#8A93A6' }}>
          Three systems, three different pressures — streaming data quality at scale, a voice agent for places where
          reading a screen isn't an option, and a conversational bot doing real HR work. Hover or tap any pipeline stage
          to see what's happening inside it.
        </p>
      </header>

      <ProjectArticle
        id="dinedash"
        screenLabel="Project — DineDash"
        num="01"
        title="DineDash Analytics"
        meta="personal project · dec 2025 – jan 2026 · end-to-end big data pipeline"
        description="A food-delivery analytics platform built on Databricks' Medallion Architecture — streaming JSON and CSV land daily, get quality-gated through Delta Live Tables, and come out the other side as clean, BI-ready aggregates with zero manual intervention."
        stats={[
          { value: '<1 min', label: 'INGEST LATENCY' },
          { value: '24%', label: 'INVALID RECORDS QUARANTINED' },
          { value: '10+', label: 'NESTED STRUCTURES NORMALIZED' },
          { value: '0', label: 'MANUAL STEPS / DAY' },
        ]}
        tags={['Databricks', 'PySpark', 'Delta Live Tables', 'Advanced SQL', 'Auto Loader']}
        stages={DINEDASH_STAGES}
        activeIdx={active.dinedash}
        onSelect={select('dinedash')}
      />

      <ProjectArticle
        id="julie"
        screenLabel="Project — Julie"
        num="02"
        title="Julie"
        meta="personal project · feb – apr 2024 · speech-to-speech agent for mining operations"
        description="A voice-in, voice-out assistant for field operators who can't stop to read a screen. Speech goes in through Whisper, gets grounded against real operational protocols with RAG, reasoned over by a local LLM, and comes back out as natural speech through OpenVoice."
        stats={[
          { value: '−30%', label: 'EMERGENCY COMMS LATENCY' },
          { value: '+45%', label: 'RESPONSE PRECISION VIA RAG' },
        ]}
        tags={['Local LLM', 'RAG', 'Whisper', 'OpenVoice', 'Python']}
        stages={JULIE_STAGES}
        activeIdx={active.julie}
        onSelect={select('julie')}
      />

      <ProjectArticle
        id="rasa"
        screenLabel="Project — Onboarding Agent"
        num="03"
        title="Onboarding Agent"
        meta="built at accenture · jun – jul 2024 · conversational ai, aeh internship"
        note="code stays with Accenture — architecture and impact below stand in for a repo link"
        description="An intent-driven virtual agent on the Rasa framework, built to absorb the repetitive half of internal onboarding — no ticket, no queue, just an answer routed straight to the right action."
        stats={[
          { value: '−40%', label: 'HR TICKET RESOLUTION TIME' },
          { value: '180+', label: 'HRS GENAI/ML TRAINING' },
          { value: 'TOP 5%', label: 'OF COHORT ASSESSMENTS' },
        ]}
        tags={['Rasa', 'NLU', 'Python', 'Dialogue Mgmt']}
        stages={RASA_STAGES}
        activeIdx={active.rasa}
        onSelect={select('rasa')}
      />

      <section style={{ maxWidth: '1160px', margin: '0 auto', padding: 'clamp(80px, 12vh, 130px) 24px clamp(50px, 7vh, 80px)', textAlign: 'center', borderTop: '1px solid rgba(148, 163, 184, 0.09)' }}>
        <p data-reveal="1" style={{ margin: '0 0 16px', fontFamily: MONO, fontSize: '13px', color: '#F5A524' }}>// let's talk</p>
        <h2 data-reveal="1" style={{ margin: '0 auto 30px', maxWidth: '620px', fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(26px, 4vw, 42px)', lineHeight: 1.15 }}>
          More detail on any of these lives in my head — happy to walk through the decisions.
        </h2>
        <a data-reveal="1" data-magnetic="0.3" className="cta__btn cta__btn--inline" href="mailto:vifertjdaniel@gmail.com" style={{ display: 'inline-block', fontFamily: MONO, fontSize: 'clamp(13px, 2vw, 15px)', color: '#F5A524', border: '1px solid rgba(245, 165, 36, 0.45)', borderRadius: '10px', padding: '14px 26px', transition: 'background 0.2s ease' }}>vifertjdaniel@gmail.com</a>
      </section>
    </>
  );
}
