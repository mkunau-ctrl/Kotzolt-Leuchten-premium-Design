/* Kotzolt — Premium Design · Main JS */

(function () {
  'use strict';

  /* ── Language Switch ──────────────────────────────────────── */
  const html     = document.documentElement;
  const langBtns = document.querySelectorAll('.lang-btn');
  const STORAGE  = 'kotzolt-lang';

  function setLang(lang) {
    html.className = html.className.replace(/lang-\w+/g, '').trim();
    html.classList.add('lang-' + lang);
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    localStorage.setItem(STORAGE, lang);
  }

  langBtns.forEach(btn =>
    btn.addEventListener('click', () => setLang(btn.dataset.lang))
  );

  /* init with stored or default */
  setLang(localStorage.getItem(STORAGE) || 'de');

  /* ── Sticky Header ────────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const update = () =>
      header.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Mobile Nav ───────────────────────────────────────────── */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const mobileClose= document.querySelector('.mobile-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  /* ── Scroll Fade-In ───────────────────────────────────────── */
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

  /* ── Active nav link ──────────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Smooth external anchor scroll ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Contact form (demo) ──────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      btn.textContent = '✓ Nachricht gesendet';
      btn.disabled    = true;
      btn.style.background = '#5a8a5a';
      setTimeout(() => {
        btn.textContent = 'Nachricht senden';
        btn.disabled    = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    });
  }

})();
