/* site.js — каркас lovii.ru по канону ДС «Лови» v1.8.0 (docs/13-site-longform.md)
   Тема: канонический anti-FOUC в <head>; здесь applyTheme + meta theme-color. */
(function () {
  'use strict';

  /* ---------- Тема (канон docs/05, как в examples ДС) ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('lovii_theme', t); } catch (e) {}
    var m = document.getElementById('metaTheme');
    if (m) m.content = t === 'dark' ? '#171219' : '#f64a8a';
  }
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Гамбургер ---------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger) burger.addEventListener('click', function () {
    var open = mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  var mLinks = document.querySelectorAll('.mobile-menu a');
  for (var i = 0; i < mLinks.length; i++) mLinks[i].addEventListener('click', closeMenu);
  var mTheme = document.querySelector('.mobile-menu .theme-link');
  if (mTheme) mTheme.addEventListener('click', function (e) {
    e.preventDefault();
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    closeMenu();
  });

  /* ---------- Reveal-каскад + active-nav (канон docs/13 §4, docs/10 §1) ---------- */
  var sections = document.querySelectorAll('main section');
  var navLinks = document.querySelectorAll('.header-nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        var id = entry.target.id;
        if (!id) return;
        for (var n = 0; n < navLinks.length; n++) {
          navLinks[n].classList.toggle('active', navLinks[n].getAttribute('href') === '#' + id);
        }
      });
    }, { threshold: 0.12 });
    for (var s = 0; s < sections.length; s++) io.observe(sections[s]);
  } else {
    for (var s2 = 0; s2 < sections.length; s2++) sections[s2].classList.add('revealed');
  }

  /* ---------- Кнопка «наверх» (канон docs/10 §1: порог 480, 48px gradient-brand) ---------- */
  var upBtn = document.getElementById('upBtn');
  if (upBtn) {
    var onScroll = function () {
      upBtn.classList.toggle('show', window.scrollY > 480);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    upBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hero-декор: лёгкий параллакс (приём white paper v1.23) ---------- */
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var decor = document.querySelectorAll('.hero-decor [data-depth]');
  if (decor.length && !reduce && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var hero = document.querySelector('.hero');
    if (hero) {
      new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }, { threshold: 0 })
        .observe(hero);
    }
    window.addEventListener('scroll', function () {
      if (!heroVisible) return;
      var y = window.scrollY;
      for (var d = 0; d < decor.length; d++) {
        var depth = parseFloat(decor[d].getAttribute('data-depth')) || 0.6;
        decor[d].style.setProperty('--py', (y * depth * 0.12).toFixed(1) + 'px');
      }
    }, { passive: true });
  }

  /* ---------- Wave: при reduce-motion гасим SMIL-морфинг ---------- */
  if (reduce) {
    var anims = document.querySelectorAll('.wave svg animate, .wave svg animateTransform');
    for (var w = 0; w < anims.length; w++) anims[w].remove();
  }
})();
