/* ============================================================
   BURGER BOMBS — scroll-animations.js
   All GSAP ScrollTrigger scroll-linked animations
   ============================================================ */

(function () {
  'use strict';

  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[BB] GSAP/ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ── Lenis ↔ ScrollTrigger sync ─────────────────────────── */
    if (window.BB_LENIS) {
      window.BB_LENIS.on('scroll', ScrollTrigger.update);
    }

    /* ── Shared ease ─────────────────────────────────────────── */
    const EASE_OUT   = 'expo.out';
    const EASE_INOUT = 'power3.inOut';

    /* ============================================================
       1. HERO — Parallax on scroll-out
    ============================================================ */
    const heroBurger = document.getElementById('heroBurger');
    const heroVideo  = document.querySelector('.hero-video');
    const heroGlow   = document.querySelector('.hero-glow');
    const heroContent = document.querySelector('.hero-content');

    if (heroBurger) {
      gsap.to(heroBurger, {
        y: -80,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8,
        },
      });
    }

    if (heroContent) {
      gsap.to(heroContent, {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: '20% top',
          end: '65% top',
          scrub: 1.5,
        },
      });
    }

    if (heroVideo) {
      gsap.to(heroVideo, {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2.5,
        },
      });
    }

    if (heroGlow) {
      gsap.to(heroGlow, {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: '30% top',
          end: '70% top',
          scrub: 1.5,
        },
      });
    }

    /* ============================================================
       2. STORY — Sticky ingredient deconstruction
    ============================================================ */
    const storySection = document.querySelector('.story-section');
    const bunTop    = document.getElementById('bunTop');
    const lettuce   = document.getElementById('lettuce');
    const cheese    = document.getElementById('cheese');
    const patty     = document.getElementById('patty');
    const sauce     = document.getElementById('sauce');
    const bunBottom = document.getElementById('bunBottom');
    const progressFill = document.getElementById('storyProgressFill');

    if (storySection && bunTop) {
      /* Set assembled starting positions */
      gsap.set(bunTop,    { y: -130, scale: 1.0 });
      gsap.set(lettuce,   { y: -80  });
      gsap.set(cheese,    { y: -38  });
      gsap.set(patty,     { y: 0    });
      gsap.set(sauce,     { y: 48   });
      gsap.set(bunBottom, { y: 100, scale: 1.0 });

      const storyTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.story-section',
          start:   'top top',
          end:     'bottom top',
          scrub:   1.6,
          onUpdate: (self) => {
            if (progressFill) {
              progressFill.style.height = (self.progress * 100) + '%';
            }
          },
        },
      });

      /* Phase 1 (0→0.25): buns separate */
      storyTL
        .to(bunTop,    { y: -260, ease: 'power1.inOut', duration: 0.25 }, 0)
        .to(bunBottom, { y: 260,  ease: 'power1.inOut', duration: 0.25 }, 0)

        /* Phase 2 (0.2→0.55): fillings spread */
        .to(lettuce,   { y: -200, ease: 'power1.inOut', duration: 0.35 }, 0.2)
        .to(cheese,    { y: -120, ease: 'power1.inOut', duration: 0.35 }, 0.2)
        .to(sauce,     { y:  150, ease: 'power1.inOut', duration: 0.35 }, 0.2)

        /* Phase 3 (0.5→1.0): full anti-gravity explosion */
        .to(bunTop,    { y: -380, scale: 1.06, ease: 'power2.inOut', duration: 0.5 }, 0.5)
        .to(lettuce,   { y: -290, scale: 1.03, ease: 'power2.inOut', duration: 0.5 }, 0.5)
        .to(cheese,    { y: -190, scale: 1.04, ease: 'power2.inOut', duration: 0.5 }, 0.5)
        .to(patty,     { y:   20, scale: 1.05, ease: 'power2.inOut', duration: 0.5 }, 0.5)
        .to(sauce,     { y:  200, scale: 1.02, ease: 'power2.inOut', duration: 0.5 }, 0.5)
        .to(bunBottom, { y:  350, scale: 1.06, ease: 'power2.inOut', duration: 0.5 }, 0.5);
    }

    /* Story panel text transitions */
    const panels = [
      document.getElementById('panel0'),
      document.getElementById('panel1'),
      document.getElementById('panel2'),
      document.getElementById('panel3'),
    ].filter(Boolean);

    const panelTriggers = [
      { start: 'top top',    end: '20% top'  },
      { start: '22% top',    end: '45% top'  },
      { start: '47% top',    end: '70% top'  },
      { start: '72% top',    end: '95% top'  },
    ];

    panels.forEach((panel, i) => {
      const cfg = panelTriggers[i];
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.story-section',
          start:   cfg.start,
          end:     cfg.end,
          scrub:   1,
        },
      });

      tl.fromTo(panel,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
      .to(panel,
        { opacity: 0, y: -28, duration: 0.3, ease: 'power2.in' },
        0.7
      );
    });

    /* ============================================================
       3. PHILOSOPHY — Cinematic text reveal
    ============================================================ */
    const philEyebrow = document.getElementById('philEyebrow');
    const phLines     = document.querySelectorAll('.ph-line');
    const philBody    = document.getElementById('philBody');
    const philStats   = document.querySelectorAll('.phil-stat');

    if (philEyebrow) {
      gsap.to(philEyebrow, {
        opacity: 1, y: 0,
        duration: 1, ease: EASE_OUT,
        scrollTrigger: {
          trigger: '.philosophy-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (phLines.length) {
      gsap.to(phLines, {
        opacity: 1, y: 0,
        duration: 1.1, ease: EASE_OUT,
        stagger: 0.18,
        scrollTrigger: {
          trigger: '.phil-headline',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (philBody) {
      gsap.to(philBody, {
        opacity: 1, y: 0,
        duration: 1, ease: EASE_OUT,
        scrollTrigger: {
          trigger: philBody,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (philStats.length) {
      gsap.to(philStats, {
        opacity: 1, y: 0,
        duration: 0.9, ease: EASE_OUT,
        stagger: 0.14,
        scrollTrigger: {
          trigger: '.phil-stats',
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    /* ============================================================
       4. REASSEMBLY — Burger scale-in + fries slide
    ============================================================ */
    const finalBurger   = document.getElementById('finalBurger');
    const friesImg      = document.getElementById('friesImg');
    const reassemblyCopy = document.getElementById('reassemblyCopy');

    if (finalBurger) {
      gsap.to(finalBurger, {
        scale: 1, y: 0, opacity: 1,
        duration: 1.4, ease: EASE_OUT,
        scrollTrigger: {
          trigger: '.reassembly-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (friesImg) {
      gsap.to(friesImg, {
        opacity: 1, x: 0, rotate: 8,
        duration: 1.1, ease: EASE_OUT,
        delay: 0.25,
        scrollTrigger: {
          trigger: '.reassembly-section',
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (reassemblyCopy) {
      gsap.to(reassemblyCopy, {
        opacity: 1, x: 0,
        duration: 1.1, ease: EASE_OUT,
        delay: 0.15,
        scrollTrigger: {
          trigger: reassemblyCopy,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    /* ============================================================
       5. CTA — Dramatic reveal
    ============================================================ */
    const ctaEyebrow  = document.getElementById('ctaEyebrow');
    const ctaHeadline = document.getElementById('ctaHeadline');
    const ctaBtn      = document.querySelector('.cta-btn');

    if (ctaEyebrow) {
      gsap.to(ctaEyebrow, {
        opacity: 1, y: 0,
        duration: 0.9, ease: EASE_OUT,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (ctaHeadline) {
      gsap.to(ctaHeadline, {
        opacity: 1, y: 0,
        duration: 1.2, ease: EASE_OUT,
        delay: 0.1,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 68%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    if (ctaBtn) {
      gsap.to(ctaBtn, {
        opacity: 1, y: 0, scale: 1,
        duration: 1.0, ease: EASE_OUT,
        delay: 0.25,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    /* ============================================================
       6. Footer subtle fade
    ============================================================ */
    const footer = document.getElementById('footer');
    if (footer) {
      gsap.fromTo(footer,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    /* ── Refresh on load (images/fonts may shift layout) ─────── */
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  /* ── Init after DOM ready ────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

}());
