// Subtle, opt-in audio for the portfolio — synthesized via Web Audio (no asset files).
// Muted by default; persisted in localStorage; unlocked on the first user gesture so
// we never fight the browser autoplay policy. Every sound is short, quiet, and terminal-flavored.

const KEY = 'vifert-sound';
let enabled = false;
try {
  enabled = localStorage.getItem(KEY) === 'on';
} catch {
  /* storage unavailable */
}

let ctx = null;
let master = null;
let unlocked = false;

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);
  return ctx;
}

// Call from a real user gesture (pointerdown/keydown) so the context can start.
export function unlockAudio() {
  if (unlocked) return;
  const c = ensureCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume().catch(() => {});
  unlocked = true;
}

export function soundEnabled() {
  return enabled;
}

export function setSoundEnabled(next) {
  enabled = !!next;
  try {
    localStorage.setItem(KEY, enabled ? 'on' : 'off');
  } catch {
    /* ignore */
  }
  if (enabled) {
    unlockAudio();
    // Tiny confirmation so the toggle feels tactile the moment it's switched on.
    blip({ freq: 660, dur: 0.05, type: 'sine', gain: 0.05, attack: 0.005 });
    setTimeout(() => blip({ freq: 990, dur: 0.06, type: 'sine', gain: 0.05, attack: 0.005 }), 55);
  }
  window.dispatchEvent(new CustomEvent('sound-toggle', { detail: enabled }));
}

// A single enveloped oscillator voice.
function blip({ freq = 600, dur = 0.06, type = 'sine', gain = 0.05, attack = 0.004, detune = 0 } = {}) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c || c.state !== 'running') return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (detune) osc.detune.setValueAtTime(detune, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

// Short filtered-noise burst — a mechanical key "tick".
function noiseTick({ dur = 0.02, cutoff = 2600, gain = 0.05 } = {}) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c || c.state !== 'running') return;
  const now = c.currentTime;
  const frames = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buf;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = cutoff;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  src.connect(lp);
  lp.connect(g);
  g.connect(master);
  src.start(now);
  src.stop(now + dur + 0.01);
}

// Public, intention-named sound effects.
export const sfx = {
  key: () => noiseTick({ dur: 0.018, cutoff: 2400 + Math.random() * 600, gain: 0.045 }),
  space: () => noiseTick({ dur: 0.026, cutoff: 1500, gain: 0.05 }),
  enter: () => {
    blip({ freq: 523.25, dur: 0.05, type: 'triangle', gain: 0.045 });
    setTimeout(() => blip({ freq: 783.99, dur: 0.07, type: 'triangle', gain: 0.045 }), 40);
  },
  open: () => blip({ freq: 420, dur: 0.14, type: 'sine', gain: 0.05, attack: 0.01 }),
  close: () => blip({ freq: 300, dur: 0.12, type: 'sine', gain: 0.045, attack: 0.01 }),
  hover: () => blip({ freq: 880, dur: 0.03, type: 'sine', gain: 0.02, attack: 0.003 }),
  tick: () => noiseTick({ dur: 0.014, cutoff: 3200, gain: 0.03 }),
};
