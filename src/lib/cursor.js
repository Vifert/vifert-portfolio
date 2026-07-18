// Custom themed cursor — amber dot + trailing ring. Fine pointers only.
(function () {
  if (window.__vifertCursor) return;
  window.__vifertCursor = true;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function start() {
    if (!document.body) { requestAnimationFrame(start); return; }

    var css = document.createElement('style');
    css.textContent = '@media (pointer: fine) { *:not(input):not(textarea):not(select) { cursor: none !important; } }';
    document.head.appendChild(css);

    var dot = document.createElement('div');
    dot.setAttribute('aria-hidden', 'true');
    dot.style.cssText = 'position:fixed;left:0;top:0;width:6px;height:6px;border-radius:50%;background:#F5A524;pointer-events:none;z-index:9999;transform:translate(-100px,-100px);will-change:transform;transition:width .2s ease,height .2s ease,opacity .25s ease;opacity:0;';
    var ring = document.createElement('div');
    ring.setAttribute('aria-hidden', 'true');
    ring.style.cssText = 'position:fixed;left:0;top:0;width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(245,165,36,.55);background:transparent;pointer-events:none;z-index:9998;transform:translate(-100px,-100px);will-change:transform;transition:width .25s ease,height .25s ease,border-color .25s ease,background .25s ease,opacity .25s ease;opacity:0;';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var tx = -100, ty = -100, rx = -100, ry = -100, seen = false, hidden = false;

    var show = function () { dot.style.opacity = '1'; ring.style.opacity = '1'; hidden = false; };
    var hide = function () { dot.style.opacity = '0'; ring.style.opacity = '0'; hidden = true; };

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; rx = tx; ry = ty; show(); }
      else if (hidden) show();
    }, { passive: true });

    document.addEventListener('pointerover', function (e) {
      var t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('input, textarea, select')) { hide(); return; }
      if (hidden && seen) show();
      var hot = t.closest("a, button, [role='button'], label, summary");
      if (hot) {
        ring.style.width = '46px'; ring.style.height = '46px';
        ring.style.borderColor = 'rgba(245,193,105,.9)';
        ring.style.background = 'rgba(245,165,36,.07)';
        dot.style.width = '3px'; dot.style.height = '3px';
      } else {
        ring.style.width = '30px'; ring.style.height = '30px';
        ring.style.borderColor = 'rgba(245,165,36,.55)';
        ring.style.background = 'transparent';
        dot.style.width = '6px'; dot.style.height = '6px';
      }
    }, true);

    document.addEventListener('pointerdown', function () {
      ring.style.width = '20px'; ring.style.height = '20px';
    }, true);
    document.addEventListener('pointerup', function (e) {
      var t = e.target;
      var hot = t instanceof Element && t.closest("a, button, [role='button']");
      ring.style.width = hot ? '46px' : '30px';
      ring.style.height = hot ? '46px' : '30px';
    }, true);

    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', function () { if (seen) show(); });

    (function loop() {
      var k = reduced ? 1 : 0.18;
      rx += (tx - rx) * k; ry += (ty - ry) * k;
      var dw = dot.offsetWidth / 2, rw = ring.offsetWidth / 2;
      dot.style.transform = 'translate(' + (tx - dw) + 'px, ' + (ty - dw) + 'px)';
      ring.style.transform = 'translate(' + (rx - rw) + 'px, ' + (ry - rw) + 'px)';
      requestAnimationFrame(loop);
    })();
  }
  start();
})();
