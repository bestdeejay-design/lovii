(function () {
  'use strict';

  function toggleTheme() {
    var html = document.documentElement;
    var isDark = html.classList.toggle('dark');
    var spans = document.querySelectorAll('.theme-toggle span');
    for (var i = 0; i < spans.length; i++) {
      var el = spans[i];
      el.classList.toggle('active', isDark ? el.dataset.theme === 'dark' : el.dataset.theme === 'light');
    }
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  }

  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
      var spans = document.querySelectorAll('.theme-toggle span');
      for (var i = 0; i < spans.length; i++) {
        spans[i].classList.toggle('active', spans[i].dataset.theme === 'dark');
      }
    }
  } catch (e) {}

  function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
    document.body.classList.toggle('menu-open');
  }
  function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  var hamburger = document.getElementById('hamburgerBtn');
  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  var mobileLinks = document.querySelectorAll('.mobile-menu a');
  for (var j = 0; j < mobileLinks.length; j++) {
    mobileLinks[j].addEventListener('click', closeMenu);
  }
  var mobileTheme = document.querySelector('.mobile-menu .theme-toggle');
  if (mobileTheme) mobileTheme.addEventListener('click', function () { toggleTheme(); closeMenu(); });

  // Section reveal + active nav
  var sections = document.querySelectorAll('section');
  var navLinks = document.querySelectorAll('.header-nav a');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          for (var n = 0; n < navLinks.length; n++) {
            navLinks[n].classList.toggle('active', navLinks[n].getAttribute('href') === '#' + entry.target.id);
          }
        }
      });
    }, { threshold: 0.2 });
    for (var s = 0; s < sections.length; s++) observer.observe(sections[s]);
  } else {
    for (var s2 = 0; s2 < sections.length; s2++) sections[s2].classList.add('revealed');
  }

  // Hero ambient parallax moved to assets/hero.js (optional, removable with assets/hero.css)
})();
