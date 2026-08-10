(() => {
  'use strict';

  /* preloader */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    setTimeout(() => pre && pre.classList.add('done'), 600);
  });

  /* header scroll state */
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTop');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (toTopBtn) toTopBtn.classList.toggle('visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn && toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* mobile nav */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      mainNav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* active nav link on scroll */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const setActive = () => {
    let current = sections[0];
    const y = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((sec) => { if (sec.offsetTop <= y) current = sec; });
    navLinks.forEach((l) => l.classList.remove('active'));
    if (current) {
      const active = navLinks.find((l) => l.getAttribute('href') === `#${current.id}`);
      active && active.classList.add('active');
    }
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* scroll reveal — CSS handles every effect (fade-up / wipe / etc) purely
     through the .in-view class, so this just needs to flip that class on
     each element once it scrolls into view. */
  const startReveal = (el) => el.classList.add('in-view');

  /* scroll reveal */
  const revealEls = Array.from(document.querySelectorAll('.reveal'))
    .filter((el) => !el.closest('.hero'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => startReveal(el), Number(delay));
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => io.observe(el));

  /* hero title / catch copy — trigger on scroll instead of on load */
  const heroReveals = document.querySelectorAll('.hero .reveal');
  let heroTriggered = false;
  const triggerHero = () => {
    if (heroTriggered) return;
    heroTriggered = true;
    heroReveals.forEach((el) => {
      const delay = el.getAttribute('data-delay') || 0;
      setTimeout(() => startReveal(el), Number(delay));
    });
    window.removeEventListener('scroll', triggerHero);
  };
  window.addEventListener('scroll', triggerHero, { passive: true, once: true });
  setTimeout(triggerHero, 3200); // fallback so content still appears if the visitor never scrolls

  /* field operations lightbox */
  const opsPhotos = Array.from(document.querySelectorAll('#operations .ops-photo'));
  const lightbox = document.getElementById('lightbox');
  if (opsPhotos.length && lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const items = opsPhotos.map((el) => ({
      src: el.querySelector('img').getAttribute('src'),
      caption: el.getAttribute('data-label') || '',
    }));
    let currentIndex = 0;
    let lastFocused = null;

    const show = (index) => {
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.caption;
      lightboxCaption.textContent = item.caption;
    };

    const openLightbox = (index) => {
      lastFocused = document.activeElement;
      show(index);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lastFocused && lastFocused.focus();
    };

    opsPhotos.forEach((el, i) => {
      el.addEventListener('click', () => openLightbox(i));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => show(currentIndex - 1));
    lightboxNext.addEventListener('click', () => show(currentIndex + 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  /* contact form */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      note.textContent = 'お問い合わせありがとうございます。担当者より追ってご連絡いたします。';
      form.reset();
    });
  }
})();
