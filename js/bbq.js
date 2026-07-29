(() => {
  'use strict';

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 400);
  });

  /* ---------- Header scroll state + mobile nav ---------- */
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  function updateHeader() {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  updateHeader();

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

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('in-view'), delay);
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Portal slideshow (crossfade blur + crisp together) ---------- */
  const portalBlurs = document.querySelectorAll('.portal-blur');
  const portalCrisps = document.querySelectorAll('.portal-crisp');
  const splitRightBgs = document.querySelectorAll('.split-right-bg-img');
  let portalIndex = 0;

  function showPortalSlide(i) {
    portalBlurs.forEach((s) => s.classList.remove('is-active'));
    portalCrisps.forEach((s) => s.classList.remove('is-active'));
    splitRightBgs.forEach((s) => s.classList.remove('is-active'));
    portalBlurs[i].classList.add('is-active');
    portalCrisps[i].classList.add('is-active');
    if (splitRightBgs[i]) splitRightBgs[i].classList.add('is-active');
    portalIndex = i;
  }
  if (portalBlurs.length) {
    setInterval(() => showPortalSlide((portalIndex + 1) % portalBlurs.length), 4500);
  }

  /* ---------- Split hero: left content swaps hero -> about while right stays pinned ---------- */
  const splitHero = document.querySelector('.split-hero');
  const splitLeft = document.getElementById('splitLeft');

  function updateSplitHero() {
    if (!splitHero || window.innerWidth <= 960) return;
    const rect = splitHero.getBoundingClientRect();
    const pinDistance = splitHero.offsetHeight - window.innerHeight;
    if (pinDistance <= 0) return;
    const progress = Math.min(Math.max(-rect.top / pinDistance, 0), 1);
    if (progress > 0.45) splitLeft.classList.add('is-about');
    else splitLeft.classList.remove('is-about');
  }

  /* ---------- Plan stack: zoom-out + parallax for stacked panels ---------- */
  const planMedias = document.querySelectorAll('.plan-media');

  function clamp01(v) { return Math.min(Math.max(v, 0), 1); }

  function updatePlanStack() {
    const winH = window.innerHeight;
    planMedias.forEach((media) => {
      const panel = media.closest('.plan-panel');
      const rect = panel.getBoundingClientRect();
      const progress = clamp01(1 - Math.abs(rect.top) / winH);
      const zoom = 1.3 - progress * 0.3;
      const speed = parseFloat(media.dataset.speed || '0.2');
      const parallax = rect.top * speed;
      media.style.setProperty('--zoom', zoom.toFixed(3));
      media.style.setProperty('--parallax', parallax.toFixed(1) + 'px');
    });
  }

  /* ---------- Number counters ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = clamp01((now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Single rAF loop for scroll-driven visuals ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateSplitHero();
      updatePlanStack();
      updateToTop();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateSplitHero();
  updatePlanStack();

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  function updateToTop() {
    if (window.scrollY > window.innerHeight) toTop.classList.add('is-visible');
    else toTop.classList.remove('is-visible');
  }
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
