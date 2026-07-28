(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 400);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);

    const toTop = document.getElementById('toTop');
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-open');
      mainNav.classList.toggle('is-open');
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-open');
        mainNav.classList.remove('is-open');
      });
    });
  }

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('is-visible'), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ja-JP');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (statEls.length) {
    if (reduceMotion) {
      statEls.forEach((el) => { el.textContent = (parseInt(el.dataset.count, 10) || 0).toLocaleString('ja-JP'); });
    } else if ('IntersectionObserver' in window) {
      const statIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      statEls.forEach((el) => statIo.observe(el));
    } else {
      statEls.forEach(animateCount);
    }
  }

  /* ---------- Contact form (client-side only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'ご予約ありがとうございます。内容を確認の上、担当者よりご連絡いたします。';
      contactForm.reset();
    });
  }
})();
