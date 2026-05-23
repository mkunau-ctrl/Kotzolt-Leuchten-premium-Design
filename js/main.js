/* Kotzolt — Premium Design v2 · JS */
(function () {
  'use strict';

  /* ── Language Switch ──────────────────────────────────────── */
  const html = document.documentElement;
  const STORAGE = 'kotzolt-lang';
  function setLang(lang) {
    html.className = html.className.replace(/lang-\w+/g, '').trim();
    html.classList.add('lang-' + lang);
    document.querySelectorAll('.lang-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang)
    );
    localStorage.setItem(STORAGE, lang);
  }
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.addEventListener('click', () => setLang(btn.dataset.lang))
  );
  setLang(localStorage.getItem(STORAGE) || 'de');

  /* ── Sticky Header ────────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const upd = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ── Mobile Nav ───────────────────────────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a, .mobile-close').forEach(el =>
      el.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
  }

  /* ── Scroll Reveal (all animation types) ─────────────────── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.fade-in, .slide-left, .slide-right, .scale-up, .clip-reveal'
  ).forEach(el => revealIO.observe(el));

  /* ── Stagger children ─────────────────────────────────────── */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    parent.children && Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 0.1) + 's';
      child.classList.add('fade-in');
      revealIO.observe(child);
    });
  });

  /* ── Parallax ─────────────────────────────────────────────── */
  const parallaxEls = [];
  document.querySelectorAll('[data-parallax]').forEach(el => {
    parallaxEls.push({ el, speed: parseFloat(el.dataset.parallax || '0.35') });
  });

  function doParallax() {
    const sy = window.scrollY;
    parallaxEls.forEach(({ el, speed }) => {
      const parent = el.closest('.hero, .parallax-divider, .cta-banner');
      if (!parent) return;
      const rect   = parent.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * speed}px)`;
    });
  }
  window.addEventListener('scroll', doParallax, { passive: true });
  doParallax();

  /* ── Counter Animation ────────────────────────────────────── */
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.animated) return;
      e.target.dataset.animated = '1';
      const target   = parseFloat(e.target.dataset.target) || 0;
      const suffix   = e.target.dataset.suffix || '';
      const decimals = e.target.dataset.decimals || 0;
      const dur      = 1800;
      let start      = null;
      const tick = ts => {
        if (!start) start = ts;
        const pct = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - pct, 3);
        const val  = target * ease;
        e.target.textContent = val.toFixed(decimals) + suffix;
        if (pct < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-num[data-target]').forEach(el =>
    counterIO.observe(el)
  );

  /* ── Active nav link ──────────────────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html'))
      a.classList.add('active');
  });

  /* ── Smooth anchor scroll ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── Contact form ─────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = '✓ Gesendet';
      btn.disabled = true;
      btn.style.background = '#3A6A8A';
      setTimeout(() => {
        btn.textContent = 'Nachricht senden';
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3500);
    });
  }

})();
