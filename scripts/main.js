/* ============================================================
   BURGER BOMBS — main.js
   Core: page-load reveal, header scroll, idle states, misc
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ── Page Load Veil ──────────────────────────────────────── */
  function createVeil() {
    const veil = document.createElement('div');
    veil.id = 'page-veil';
    document.body.prepend(veil);
    return veil;
  }

  function runPageEntrance() {
    const veil        = createVeil();
    const header      = $('#header');
    const logo        = $('.logo');
    const nav         = $('.nav');
    const eyebrow     = $('#heroEyebrow');
    const titleWords  = $$('.hero-title-word');
    const heroSub     = $('#heroSub');
    const heroBurger  = $('#heroBurger');
    const scrollCue   = $('.hero-scroll-cue');

    if (typeof gsap === 'undefined') {
      // Graceful fallback — just show everything
      document.body.classList.remove('is-loading');
      if (veil) veil.style.display = 'none';
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onStart: () => document.body.classList.remove('is-loading'),
    });

    /* 0.0s — veil slides up */
    tl.to(veil, {
      yPercent: -100,
      duration:  1.1,
      ease:      'expo.inOut',
    }, 0);

    /* 0.3s — header items drop in */
    if (logo) {
      tl.to(logo, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
    }
    if (nav) {
      tl.to(nav,  { opacity: 1, y: 0, duration: 0.7 }, 0.45);
    }

    /* 0.55s — eyebrow fades up */
    if (eyebrow) {
      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0.55);
    }

    /* 0.7s — hero title words clip-reveal */
    if (titleWords.length) {
      tl.to(titleWords, {
        y:        0,
        opacity:  1,
        duration: 1.0,
        stagger:  0.14,
      }, 0.70);
    }

    /* 0.95s — burger rises */
    if (heroBurger) {
      tl.to(heroBurger, {
        y:       0,
        opacity: 1,
        duration: 1.2,
      }, 0.80);
    }

    /* 1.0s — subtitle */
    if (heroSub) {
      tl.to(heroSub, { opacity: 1, y: 0, duration: 0.8 }, 1.0);
    }

    /* 1.3s — scroll cue */
    if (scrollCue) {
      tl.to(scrollCue, { opacity: 1, duration: 0.6 }, 1.35);
    }

    /* Clean up veil from DOM after animation */
    tl.call(() => {
      if (veil && veil.parentNode) veil.parentNode.removeChild(veil);
      if (heroBurger) heroBurger.classList.add('is-idle');
    }, [], '>+0.3');
  }

  /* ── Header — scroll state ───────────────────────────────── */
  function initHeader() {
    const header = $('#header');
    if (!header) return;

    let lastY = 0;
    let ticking = false;

    function update() {
      const y = window.scrollY;

      if (y > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      lastY    = y;
      ticking  = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Smooth anchor scrolling (Lenis-aware) ───────────────── */
  function initAnchorLinks() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        if (!id) return;

        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();

        if (window.BB_LENIS) {
          window.BB_LENIS.scrollTo(target, { offset: -80, duration: 1.8 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Lazy video play on viewport ────────────────────────── */
  function initLazyVideos() {
    const videos = $$('video[preload="metadata"]');
    if (!videos.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target;
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    videos.forEach((vid) => observer.observe(vid));
  }

  /* ── Cursor glow (desktop only) ──────────────────────────── */
  function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    dot.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 6px; height: 6px;
      background: var(--gold, #c8a44a);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
      opacity: 0;
    `;
    document.body.appendChild(dot);

    let cx = 0, cy = 0;
    let tx = 0, ty = 0;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(() => {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        dot.style.transform = `translate(${cx - 3}px, ${cy - 3}px)`;
      });
    }
  }

  /* ── Grain element re-randomise ──────────────────────────── */
  function initGrainOffset() {
    const grains = $$('.hero-grain, .cta-grain, .philosophy-grain');
    grains.forEach((el) => {
      const rx = Math.random() * 100;
      const ry = Math.random() * 100;
      el.style.backgroundPosition = `${rx}px ${ry}px`;
    });
  }

  /* ── Boot ────────────────────────────────────────────────── */
  function boot() {
    initHeader();
    initAnchorLinks();
    initLazyVideos();
    initCursorGlow();
    initGrainOffset();
    runPageEntrance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

}());
