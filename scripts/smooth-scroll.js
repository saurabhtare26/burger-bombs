/* ============================================================
   BURGER BOMBS — smooth-scroll.js
   Lenis smooth scroll + GSAP ticker integration
   ============================================================ */

(function () {
  'use strict';

  let lenis = null;

  function initLenis() {
    // Bail if Lenis not loaded
    if (typeof Lenis === 'undefined') {
      console.warn('[BB] Lenis not loaded — falling back to native scroll.');
      return;
    }

    lenis = new Lenis({
      duration:          1.25,
      easing:            (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation:       'vertical',
      gestureOrientation:'vertical',
      smoothWheel:       true,
      wheelMultiplier:   0.9,
      touchMultiplier:   1.4,
      infinite:          false,
    });

    // Keep GSAP's ScrollTrigger in sync with Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      // Prevent GSAP ticker from lagging
      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback: native RAF loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Expose globally for other modules
    window.BB_LENIS = lenis;
  }

  // Pause Lenis when popup is open (prevent background scroll)
  function pauseScroll() {
    if (lenis) lenis.stop();
  }

  function resumeScroll() {
    if (lenis) lenis.start();
  }

  // Public API
  window.BB_SCROLL = {
    init:   initLenis,
    pause:  pauseScroll,
    resume: resumeScroll,
    get:    () => lenis,
  };

  // Auto-init when DOM + scripts are ready
  document.addEventListener('DOMContentLoaded', function () {
    // Small defer so GSAP + ScrollTrigger are available
    setTimeout(initLenis, 0);
  });

}());
