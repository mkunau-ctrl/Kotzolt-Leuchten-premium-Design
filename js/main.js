/* Kotzolt — Premium Design v3 · JS */
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

  /* ── Scroll Progress Bar ──────────────────────────────────── */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

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
    parallaxEls.forEach(({ el, speed }) => {
      const parent = el.closest('.hero, .parallax-divider, .cta-banner, .parallax-strip');
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

  /* ── Product Slider (FORMATIO-style) ──────────────────────── */
  class ProductSlider {
    constructor(el) {
      this.el       = el;
      this.track    = el.querySelector('.slider-track');
      this.slides   = Array.from(el.querySelectorAll('.slide'));
      this.btnPrev  = el.querySelector('.slider-btn.prev');
      this.btnNext  = el.querySelector('.slider-btn.next');
      this.dotsWrap = el.querySelector('.slider-dots');
      this.counter  = el.querySelector('.slider-counter');
      this.current  = 0;
      this.total    = this.slides.length;
      this.autoTimer = null;
      this.touchStartX = 0;

      if (!this.track || !this.total) return;
      this._buildDots();
      this._bind();
      this._goto(0, false);
      this._startAuto();
    }

    _buildDots() {
      if (!this.dotsWrap) return;
      this.dotsWrap.innerHTML = '';
      this.slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'sdot';
        d.setAttribute('aria-label', 'Slide ' + (i + 1));
        d.addEventListener('click', () => { this._goto(i); this._resetAuto(); });
        this.dotsWrap.appendChild(d);
      });
      this.dots = Array.from(this.dotsWrap.querySelectorAll('.sdot'));
    }

    _bind() {
      if (this.btnPrev) this.btnPrev.addEventListener('click', () => { this._prev(); this._resetAuto(); });
      if (this.btnNext) this.btnNext.addEventListener('click', () => { this._next(); this._resetAuto(); });

      this.track.addEventListener('touchstart', e => {
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });
      this.track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - this.touchStartX;
        if (Math.abs(dx) > 40) { dx < 0 ? this._next() : this._prev(); this._resetAuto(); }
      }, { passive: true });
    }

    _goto(idx, animate = true) {
      this.current = (idx + this.total) % this.total;
      if (!animate) this.track.style.transition = 'none';
      this.track.style.transform = `translateX(-${this.current * 100}%)`;
      if (!animate) setTimeout(() => this.track.style.transition = '', 20);

      this.slides.forEach((s, i) => s.classList.toggle('active', i === this.current));
      if (this.dots) this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
      if (this.counter) this.counter.textContent = (this.current + 1) + ' / ' + this.total;
    }

    _next() { this._goto(this.current + 1); }
    _prev() { this._goto(this.current - 1); }

    _startAuto() {
      this.autoTimer = setInterval(() => this._next(), 5000);
    }
    _resetAuto() {
      clearInterval(this.autoTimer);
      this._startAuto();
    }
  }

  document.querySelectorAll('.product-slider').forEach(el => new ProductSlider(el));

})();
