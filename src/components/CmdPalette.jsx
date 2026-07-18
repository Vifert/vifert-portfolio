import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { downloadResume } from './Nav.jsx';
import { sfx } from '../lib/sound.js';

const TERM_KEY = 'vifert-term';
const BANNER = [
  { t: 'vifert@portfolio — interactive terminal', c: '#8A93A6' },
  { t: "type 'help' for available commands, or tap one below.", c: '#8A93A6' },
];
const CHIP_LIST = ['help', 'whoami', 'ls skills', 'ls certs', 'cd home', 'cd projects', 'cd about', 'resume', 'github', 'linkedin', 'email', 'copy', 'sudo contact vifert', 'clear'];
const TAB_POOL = ['help', 'whoami', 'pwd', 'ls', 'ls skills', 'ls certs', 'cd home', 'cd projects', 'cd about', 'sudo contact vifert', 'resume', 'github', 'linkedin', 'email', 'copy', 'clear', 'exit'];
const IS_MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

function loadStore() {
  try {
    const raw = localStorage.getItem(TERM_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.lines) && d.lines.length > 0) {
        return { lines: d.lines, cmds: Array.isArray(d.cmds) ? d.cmds : [] };
      }
    }
  } catch {
    /* corrupted store — fall through to banner */
  }
  return { lines: BANNER, cmds: [] };
}

function routeCwd(pathname) {
  const p = pathname.toLowerCase();
  if (p.startsWith('/projects')) return 'projects';
  if (p.startsWith('/about')) return 'about';
  return 'home';
}

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

export default function CmdPalette() {
  const stored = useMemo(loadStore, []);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState('');
  const [caretPos, setCaretPos] = useState(0);
  const [lines, setLines] = useState(stored.lines);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const histRef = useRef(stored.cmds);
  const histIdx = useRef(null);
  const tabCycle = useRef(null);
  const openRef = useRef(false);
  const closingRef = useRef(false);
  const closeTimer = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  openRef.current = open;
  closingRef.current = closing;

  const cwd = routeCwd(pathname);
  const prompt = 'vifert@portfolio:~/' + cwd + '$';

  // Persist history and keep the terminal scrolled to the newest line.
  useEffect(() => {
    try {
      localStorage.setItem(TERM_KEY, JSON.stringify({ lines: lines.slice(-300), cmds: histRef.current.slice(-50) }));
    } catch {
      /* storage full or unavailable */
    }
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function openPalette() {
    clearTimeout(closeTimer.current);
    setClosing(false);
    setInput('');
    setOpen(true);
    sfx.open();
  }

  // Play a quick exit (see .term-backdrop.is-closing in global.css), then unmount.
  function requestClose() {
    if (!openRef.current || closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    sfx.close();
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 170);
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (openRef.current) requestClose();
        else openPalette();
      } else if (e.key === 'Escape') {
        requestClose();
      }
    };
    const onOpen = () => openPalette();
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-palette', onOpen);
      clearTimeout(closeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const id = setTimeout(() => {
      focusInput();
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 40);
    return () => clearTimeout(id);
  }, [open]);

  function focusInput() {
    const el = inputRef.current;
    if (el && (!window.getSelection || String(window.getSelection()) === '')) el.focus();
  }

  // Keep the block cursor aligned to the input's caret after every value change.
  useEffect(() => {
    const el = inputRef.current;
    if (el) setCaretPos(el.selectionStart ?? input.length);
  }, [input]);

  function append(newLines) {
    setLines((s) => s.concat(newLines).slice(-300));
  }

  function resetTerm() {
    setLines(BANNER);
    setInput('');
  }

  // A full-page navigation would unmount and close the terminal. In this SPA the
  // palette is mounted once, so it would otherwise linger across a route change —
  // close it explicitly so `cd` still feels like it changed directories.
  function navigateAndClose(to) {
    navigate(to);
    requestClose();
  }

  function exec(raw) {
    const text = String(raw).trim();
    const A = '#F5A524', T = '#E7EAF2', M = '#8A93A6', G = '#7BC97F', R = '#E06C6C';
    const out = [{ t: prompt + ' ' + text, c: A }];
    const push = (t, c) => out.push({ t, c: c || T });
    const cmd = text.toLowerCase();
    let after = null;
    let afterMs = 450;

    if (!text) {
      append(out);
      return;
    }
    histRef.current = histRef.current.concat([text]).slice(-50);
    histIdx.current = null;
    tabCycle.current = null;

    if (cmd === 'help') {
      push('available commands:', M);
      push('  help                this list', M);
      push('  whoami              who is this guy', M);
      push('  pwd                 current directory', M);
      push('  ls                  list directories', M);
      push('  ls skills           what he works with', M);
      push('  ls certs            proof of the learning habit', M);
      push('  cd home | projects | about', M);
      push('  resume              download the pdf', M);
      push('  github · linkedin · email · copy', M);
      push('  sudo contact vifert reach out directly', M);
      push('  clear               wipe history (or ctrl+l)', M);
      push('  exit                close terminal (or esc)', M);
    } else if (cmd === 'whoami') {
      push('Vifert Jenuben Daniel V — AI / Data Engineer, Chennai.');
      push('Ships production-grade pipelines (the 99.9%-uptime kind) and', M);
      push('actually understands the models running on top of them.', M);
    } else if (cmd === 'pwd') {
      push('~/' + cwd);
    } else if (cmd === 'ls') {
      push('home/  projects/  about/  skills/  certs/');
    } else if (cmd === 'ls skills') {
      push('databricks/  pyspark/  delta-lake/  aws/  gcp/  sql/');
      push('python/  scala/  pytorch/  rag/  llm/  rasa/  airflow/');
      push('currently-loading: agentic-ai/  orchestration/', M);
    } else if (cmd === 'ls certs') {
      push('databricks-data-engineer-associate.pem');
      push('gcp-cloud-digital-leader.pem');
      push('claude-certified-architect-foundations.pem');
    } else if (cmd === 'cd' || cmd === 'cd ~' || cmd === 'cd home' || cmd === 'cd ~/home') {
      if (cwd === 'home') {
        push('already in ~/home', M);
      } else {
        push('→ ~/home', M);
        after = () => navigateAndClose('/');
      }
    } else if (cmd === 'cd projects' || cmd === 'cd ~/projects') {
      if (cwd === 'projects') {
        push('already in ~/projects', M);
      } else {
        push('→ ~/projects', M);
        after = () => navigateAndClose('/projects');
      }
    } else if (cmd === 'cd about' || cmd === 'cd ~/about') {
      if (cwd === 'about') {
        push('already in ~/about', M);
      } else {
        push('→ ~/about', M);
        after = () => navigateAndClose('/about');
      }
    } else if (cmd === 'cd ..') {
      push("already at the top — it's ~ all the way up here", M);
    } else if (cmd.startsWith('cd ')) {
      push('cd: no such directory: ' + text.slice(3).trim(), R);
    } else if (cmd === 'sudo contact vifert' || cmd === 'contact vifert' || cmd === 'sudo contact') {
      push('[sudo] permission granted — excellent judgment.', G);
      push('opening mail client…', M);
      after = () => {
        window.location.href = 'mailto:vifertjdaniel@gmail.com?subject=Let%27s%20talk';
      };
      afterMs = 900;
    } else if (cmd === 'clear') {
      resetTerm();
      return;
    } else if (cmd === 'resume') {
      push('fetching Vifert-Daniel-Resume.pdf …', M);
      downloadResume();
    } else if (cmd === 'github') {
      push('opening github.com/Vifert …', M);
      window.open('https://github.com/Vifert', '_blank');
    } else if (cmd === 'linkedin') {
      push('opening linkedin.com/in/vifert-daniel …', M);
      window.open('https://www.linkedin.com/in/vifert-daniel/', '_blank');
    } else if (cmd === 'email') {
      push('opening mail client…', M);
      after = () => {
        window.location.href = 'mailto:vifertjdaniel@gmail.com';
      };
    } else if (cmd === 'copy') {
      push('copying email address…', M);
      copyText('vifertjdaniel@gmail.com').then((ok) => {
        append([
          ok
            ? { t: '✓ vifertjdaniel@gmail.com copied to clipboard', c: G }
            : { t: 'clipboard blocked here — the address is vifertjdaniel@gmail.com', c: R },
        ]);
      });
    } else if (cmd === 'exit' || cmd === 'q' || cmd === ':q') {
      append(out);
      requestClose();
      return;
    } else {
      push('command not found: ' + text.split(' ')[0] + " — try 'help'", R);
    }
    append(out);
    if (after) setTimeout(after, afterMs);
  }

  const onCaret = () => {
    const el = inputRef.current;
    if (el) setCaretPos(el.selectionStart ?? 0);
  };

  const onKeyDown = (e) => {
    // Subtle keystroke audio (no-op unless sound is on).
    if (e.key === 'Enter') sfx.enter();
    else if (e.key === 'Backspace' || e.key === 'Delete') sfx.tick();
    else if (e.key === ' ') sfx.space();
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) sfx.key();

    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input;
      setInput('');
      exec(v);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cur = input;
      let cyc = tabCycle.current;
      if (cyc && cyc.matches.length > 0 && cyc.matches[cyc.idx] === cur) {
        const step = e.shiftKey ? -1 : 1;
        cyc.idx = (cyc.idx + step + cyc.matches.length) % cyc.matches.length;
      } else {
        const prefix = cur.toLowerCase();
        const matches = TAB_POOL.filter((c) => c.startsWith(prefix));
        if (matches.length === 0) return;
        cyc = { matches, idx: 0 };
        if (matches[0] === cur && matches.length > 1) cyc.idx = 1;
        tabCycle.current = cyc;
      }
      setInput(cyc.matches[cyc.idx]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = histRef.current;
      if (h.length === 0) return;
      histIdx.current = histIdx.current === null ? h.length - 1 : Math.max(0, histIdx.current - 1);
      setInput(h[histIdx.current]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const h = histRef.current;
      if (histIdx.current === null) return;
      histIdx.current = histIdx.current + 1;
      if (histIdx.current >= h.length) {
        histIdx.current = null;
        setInput('');
      } else {
        setInput(h[histIdx.current]);
      }
    } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      resetTerm();
    } else if (e.ctrlKey && (e.key === 'c' || e.key === 'C') && (!window.getSelection || String(window.getSelection()) === '')) {
      e.preventDefault();
      append([{ t: prompt + ' ' + input + '^C', c: '#8A93A6' }]);
      setInput('');
    }
  };

  if (!open && !closing) return null;

  return (
    <div className={'term-backdrop' + (closing ? ' is-closing' : '')} onClick={requestClose}>
      <div className="term" role="dialog" aria-label="Terminal" onClick={(e) => e.stopPropagation()}>
        <div className="term__bar">
          <span aria-hidden="true" className="term__dot" style={{ background: '#E0605E' }} />
          <span aria-hidden="true" className="term__dot" style={{ background: '#F5BD4F' }} />
          <span aria-hidden="true" className="term__dot" style={{ background: '#61C554' }} />
          <span className="term__title">vifert@portfolio — ~/{cwd}</span>
          <button type="button" aria-label="Close terminal" className="term__esc" onClick={requestClose}>
            esc
          </button>
        </div>

        <div className="term__scroll" ref={scrollRef} onClick={focusInput}>
          {lines.map((line, i) => (
            <div key={i} className="term__line" style={{ color: line.c }}>{line.t}</div>
          ))}
          <div className="term__inputrow">
            <span className="term__prompt">{prompt}</span>
            <div className="term__field">
              <span className="term__ghost">{input}</span>
              <span className="term__block" style={{ '--caret': caretPos }} />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  tabCycle.current = null;
                  histIdx.current = null;
                  setInput(e.target.value);
                  setCaretPos(e.target.selectionStart ?? e.target.value.length);
                }}
                onKeyDown={onKeyDown}
                onKeyUp={onCaret}
                onClick={onCaret}
                onSelect={onCaret}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                aria-label="Terminal input"
                className="term__input"
              />
            </div>
          </div>
        </div>

        <div className="term__chips">
          {CHIP_LIST.map((label) => (
            <button
              key={label}
              type="button"
              className="term__chip"
              onClick={() => {
                exec(label);
                setTimeout(focusInput, 30);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="term__hints">
          <span className="term__hint">↑↓ history</span>
          <span className="term__hint">tab completes</span>
          <span className="term__hint">ctrl+l clear</span>
          <span className="term__hint term__hint--right">{IS_MAC ? '⌘K' : 'Ctrl+K'} anywhere</span>
        </div>
      </div>
    </div>
  );
}
