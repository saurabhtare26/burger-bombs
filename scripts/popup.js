/* ============================================================
   BURGER BOMBS — popup.js
   Order popup: open / close / animations
   ============================================================ */

(function () {
  'use strict';

  const POPUP    = document.getElementById('orderPopup');
  const PANEL    = document.getElementById('popupPanel');
  const BACKDROP = document.getElementById('popupBackdrop');
  const CLOSE    = document.getElementById('popupClose');
  const ORDER_BTN   = document.getElementById('orderBtn');
  const NAV_BTN     = document.getElementById('navOrderBtn');

  let isOpen = false;

  /* ── Open ──────────────────────────────────────────────────── */
  function openPopup() {
    if (isOpen) return;
    isOpen = true;

    POPUP.hidden = false;
    POPUP.removeAttribute('hidden');

    // Pause smooth scroll
    if (window.BB_SCROLL) window.BB_SCROLL.pause();

    // Trap focus
    document.body.style.overflow = 'hidden';

    // Animate in with GSAP if available
    if (typeof gsap !== 'undefined') {
      const cards = PANEL.querySelectorAll('.popup-card');

      gsap.killTweensOf([PANEL, cards]);

      gsap.fromTo(BACKDROP,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );

      gsap.fromTo(PANEL,
        { opacity: 0, y: 48, scale: 0.94 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.55, ease: 'expo.out', delay: 0.05 }
      );

      gsap.fromTo(cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.1, delay: 0.2 }
      );

    } else {
      // CSS fallback
      PANEL.style.animation = 'popupIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards';
    }

    // Focus close button after animation
    setTimeout(() => CLOSE && CLOSE.focus(), 200);
  }

  /* ── Close ─────────────────────────────────────────────────── */
  function closePopup() {
    if (!isOpen) return;

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf([PANEL, BACKDROP]);

      gsap.to(PANEL, {
        opacity: 0, y: 32, scale: 0.95,
        duration: 0.35, ease: 'power3.in',
      });

      gsap.to(BACKDROP, {
        opacity: 0,
        duration: 0.35, ease: 'power2.in',
        onComplete: finaliseClose,
      });

    } else {
      finaliseClose();
    }
  }

  function finaliseClose() {
    isOpen = false;
    POPUP.hidden = true;
    document.body.style.overflow = '';

    // Resume smooth scroll
    if (window.BB_SCROLL) window.BB_SCROLL.resume();

    // Return focus to trigger
    if (ORDER_BTN) ORDER_BTN.focus();
  }

  /* ── Event listeners ───────────────────────────────────────── */
  if (ORDER_BTN) ORDER_BTN.addEventListener('click', openPopup);
  if (NAV_BTN)   NAV_BTN.addEventListener('click',   openPopup);

  if (CLOSE)     CLOSE.addEventListener('click',     closePopup);

  if (BACKDROP)  BACKDROP.addEventListener('click',  closePopup);

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closePopup();
  });

  // Focus trap inside popup
  if (PANEL) {
    PANEL.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        PANEL.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.disabled);

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Expose for external use
  window.BB_POPUP = { open: openPopup, close: closePopup };

}());
