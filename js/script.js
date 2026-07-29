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

  /* ---------- Hero slideshow ---------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDotsWrap = document.getElementById('heroDots');
  let heroIndex = 0;

  heroSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    heroDotsWrap.appendChild(dot);
  });
  const heroDots = heroDotsWrap.querySelectorAll('span');

  function showHeroSlide(i) {
    heroSlides.forEach((s) => s.classList.remove('is-active'));
    heroDots.forEach((d) => d.classList.remove('is-active'));
    heroSlides[i].classList.add('is-active');
    heroDots[i].classList.add('is-active');
    heroIndex = i;
  }
  setInterval(() => showHeroSlide((heroIndex + 1) % heroSlides.length), 5000);

  /* ---------- Hero shrink-on-scroll effect ---------- */
  const heroVisual = document.getElementById('heroVisual');
  const hero = document.querySelector('.hero');

  function updateHeroShrink() {
    const range = window.innerHeight * 0.9;
    const progress = Math.min(Math.max(window.scrollY / range, 0), 1);
    const scale = 1 - progress * 0.12;
    const radius = progress * 32;
    heroVisual.style.setProperty('--hero-scale', scale.toFixed(4));
    heroVisual.style.setProperty('--hero-radius', radius.toFixed(1) + 'px');
  }

  /* ---------- Works slideshow ---------- */
  const worksSlides = document.querySelectorAll('.works-slide');
  const worksDotsWrap = document.getElementById('worksDots');
  const worksPrev = document.getElementById('worksPrev');
  const worksNext = document.getElementById('worksNext');
  let worksIndex = 0;
  let worksTimer = null;

  worksSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goWorks(i));
    worksDotsWrap.appendChild(dot);
  });
  const worksDots = worksDotsWrap.querySelectorAll('span');

  function goWorks(i) {
    const next = (i + worksSlides.length) % worksSlides.length;
    worksSlides.forEach((s) => s.classList.remove('is-active'));
    worksDots.forEach((d) => d.classList.remove('is-active'));
    worksSlides[next].classList.add('is-active');
    worksDots[next].classList.add('is-active');
    worksIndex = next;
    restartWorksAutoplay();
  }
  function restartWorksAutoplay() {
    clearInterval(worksTimer);
    worksTimer = setInterval(() => goWorks(worksIndex + 1), 6000);
  }
  worksPrev.addEventListener('click', () => goWorks(worksIndex - 1));
  worksNext.addEventListener('click', () => goWorks(worksIndex + 1));
  restartWorksAutoplay();

  /* ---------- Parallax (data-speed) + scroll-driven scale effects ---------- */
  const parallaxEls = document.querySelectorAll('.studio-shape[data-speed]');
  const visionMedias = document.querySelectorAll('.vision-media');
  const projectMedia = document.querySelector('.project-media');
  const project = document.querySelector('.project');

  function clamp01(v) { return Math.min(Math.max(v, 0), 1); }

  function updateParallax() {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;

    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '0.2');
      const rect = el.parentElement.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - winH / 2;
      el.style.transform = `translateY(${(-centerOffset * speed).toFixed(1)}px)`;
    });

    visionMedias.forEach((media) => {
      const panel = media.closest('.vision-panel');
      const rect = panel.getBoundingClientRect();
      const progress = clamp01(1 - Math.abs(rect.top) / winH);
      const zoom = 1.3 - progress * 0.3;
      const speed = parseFloat(media.dataset.speed || '0.2');
      const parallax = rect.top * speed;
      media.style.setProperty('--zoom', zoom.toFixed(3));
      media.style.setProperty('--parallax', parallax.toFixed(1) + 'px');
    });

    if (project && projectMedia) {
      const rect = project.getBoundingClientRect();
      const progress = clamp01(1 - Math.abs(rect.top) / winH);
      const zoom = 0.82 + progress * 0.28;
      projectMedia.style.setProperty('--project-zoom', zoom.toFixed(3));
    }
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
      updateHeroShrink();
      updateParallax();
      updateToTop();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateHeroShrink();
  updateParallax();

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  function updateToTop() {
    if (window.scrollY > window.innerHeight) toTop.classList.add('is-visible');
    else toTop.classList.remove('is-visible');
  }
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Contact form (demo submit) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';
      contactForm.reset();
    });
  }
})();
