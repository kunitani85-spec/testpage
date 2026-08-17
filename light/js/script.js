(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-hidden'), 500);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  // Locks body scroll while the panel is open. Plain `overflow: hidden`
  // isn't enough on mobile Safari: a fixed-position panel opened mid-scroll
  // renders offset by the scroll distance until the next repaint (looks
  // "stuck halfway up"). Pinning the body itself with a negative top
  // matching the scroll offset removes the scroll entirely, which avoids
  // the glitch, then scroll position is restored on close.
  let lockedScrollY = 0;
  let isBodyLocked = false;
  function lockBodyScroll() {
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    isBodyLocked = true;
  }
  function unlockBodyScroll() {
    if (!isBodyLocked) return;
    isBodyLocked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    // Force a synchronous reflow so the browser has recomputed the
    // document's real (unlocked) height before we scroll — otherwise
    // scrollTo can run against the still-collapsed layout and land short.
    void document.body.offsetHeight;
    // behavior: 'instant' bypasses the page's global smooth-scroll CSS —
    // restoring position should be invisible, not an animated glide.
    window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' });
  }

  function setNavOpen(isOpen) {
    mainNav.classList.toggle('is-open', isOpen);
    navToggle.classList.toggle('is-open', isOpen);
    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }

  navToggle.addEventListener('click', () => {
    setNavOpen(!mainNav.classList.contains('is-open'));
  });
  mainNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  /* ---------- Scroll reveal (ゆっくりしたフェード) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? Number(el.dataset.delay) : 0;
          setTimeout(() => el.classList.add('is-visible'), delay);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Gold shimmer: 一瞬だけ光る演出（控えめに） ---------- */
  const shimmerEls = document.querySelectorAll('.gold-shimmer');
  const shimmerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-lit');
          shimmerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  if (!reduceMotion) shimmerEls.forEach((el) => shimmerObserver.observe(el));

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Parallax (Hero) ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));
  let ticking = false;

  function applyParallax() {
    const heroEl = document.querySelector('.hero');
    if (!heroEl) { ticking = false; return; }
    const heroRect = heroEl.getBoundingClientRect();
    parallaxEls.forEach((el) => {
      const speed = Number(el.dataset.speed) || 0.2;
      const offset = heroRect.top * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    ticking = false;
  }

  function onScrollOrResize() {
    updateHeaderState();
    if (!reduceMotion) {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  onScrollOrResize();
  if (!reduceMotion) applyParallax();

  /* ---------- Humanitarian scene gallery: PC=hover swap / Mobile=lightbox ---------- */
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const sceneItems = document.querySelectorAll('.scene-item');
  const mediaHover = document.querySelector('.media-hover');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  sceneItems.forEach((item) => {
    const img = item.querySelector('img');
    if (hoverCapable && mediaHover) {
      item.addEventListener('mouseenter', () => {
        mediaHover.src = img.currentSrc || img.src;
        mediaHover.alt = img.alt;
        mediaHover.classList.add('is-active');
        item.classList.add('is-active');
      });
      item.addEventListener('mouseleave', () => {
        mediaHover.classList.remove('is-active');
        item.classList.remove('is-active');
      });
    }
    // Always bind click too: guarantees the popup works on touch devices
    // even when hover-capability detection is ambiguous (hybrid laptops,
    // tablets, in-app browsers), and offers a harmless zoom-in on desktop.
    item.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
  });

  /* ---------- Contact form (front-end only demo) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';
      contactForm.reset();
    });
  }

  /* ---------- Smooth anchor scroll offset for fixed header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
