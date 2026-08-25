/* assets/hero.js — optional hero ambient parallax (mouse).
   Loaded from index.html via <script defer src="assets/hero.js">.
   Safe to delete: it bails out if .hero-decor is absent and does nothing
   without assets/hero.css. Disabled on touch / reduced-motion. */
(function () {
  'use strict';
  var decor = document.querySelectorAll('.hero-decor .decor, .hero-decor .pulse-dot');
  if (!decor.length) return;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;

  var items = [];
  for (var i = 0; i < decor.length; i++) {
    var d = parseFloat(decor[i].getAttribute('data-depth')) || 0.5;
    items.push({ el: decor[i], depth: d, cx: 0, cy: 0 });
  }

  var tx = 0, ty = 0;
  var SHIFT = 0.025; // px shift per (px pointer offset × depth); keeps motion ≤~25px, barely noticeable
  var rafId = null;
  function start() { if (rafId === null) rafId = requestAnimationFrame(frame); }
  function frame() {
    var moving = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      it.cx += (tx - it.cx) * 0.06;
      it.cy += (ty - it.cy) * 0.06;
      var x = it.cx * it.depth * SHIFT;
      var y = it.cy * it.depth * SHIFT;
      it.el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
      if (Math.abs(tx - it.cx) > 0.1 || Math.abs(ty - it.cy) > 0.1) moving = true;
    }
    rafId = moving ? requestAnimationFrame(frame) : null; // stop loop once settled → no idle CPU
  }
  window.addEventListener('mousemove', function (e) {
    tx = e.clientX - window.innerWidth / 2;
    ty = e.clientY - window.innerHeight / 2;
    start();
  }, { passive: true });
})();
