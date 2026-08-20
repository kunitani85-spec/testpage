(() => {
  'use strict';

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('is-hidden'), 400);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTop');

  function updateHeaderState() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
  });
  mainNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
    });
  });

  /* ---------- To top ---------- */
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scroll reveal (fade in / up / scale) ---------- */
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

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    const target = Number(el.dataset.count);
    const duration = 1600;
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

  /* ---------- Parallax layers ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  function applyParallax() {
    const viewportH = window.innerHeight;
    parallaxEls.forEach((el) => {
      const speed = Number(el.dataset.speed) || 0.2;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top) * speed;
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

  /* ---------- Show scrollbar only while actively scrolling ---------- */
  const docEl = document.documentElement;
  let scrollbarHideTimer = null;
  window.addEventListener('scroll', () => {
    docEl.classList.add('is-scrolling');
    clearTimeout(scrollbarHideTimer);
    scrollbarHideTimer = setTimeout(() => docEl.classList.remove('is-scrolling'), 900);
  }, { passive: true });

  /* ---------- Cursor glow (desktop only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      cursorGlow.classList.add('is-active');
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-active'));
  }

  /* ---------- Capacity demo (1-day max 3 groups, shared AUBERGE / CAFE-RESTAURANT) ---------- */
  const TOTAL_MAX = 3;
  const AUBERGE_MAX = 2;
  const CAFE_MAX = 3;

  const aubergeCountEl = document.getElementById('aubergeCount');
  const cafeCountEl = document.getElementById('cafeCount');
  const totalCountEl = document.getElementById('totalCount');
  const aubergeRemainText = document.getElementById('aubergeRemainText');
  const cafeRemainText = document.getElementById('cafeRemainText');
  const capacityMessage = document.getElementById('capacityMessage');
  const aubergePlusBtn = document.getElementById('aubergePlus');
  const aubergeMinusBtn = document.getElementById('aubergeMinus');
  const cafePlusBtn = document.getElementById('cafePlus');
  const cafeMinusBtn = document.getElementById('cafeMinus');
  const capacityResetBtn = document.getElementById('capacityReset');

  if (aubergeCountEl && cafeCountEl && totalCountEl) {
    let aubergeCount = 0;
    let cafeCount = 0;

    function updateCapacity() {
      const total = aubergeCount + cafeCount;
      const remainingTotal = TOTAL_MAX - total;
      const aubergeRemaining = Math.max(0, Math.min(AUBERGE_MAX - aubergeCount, remainingTotal));
      const cafeRemaining = Math.max(0, Math.min(CAFE_MAX - cafeCount, remainingTotal));

      aubergeCountEl.textContent = aubergeCount;
      cafeCountEl.textContent = cafeCount;
      totalCountEl.textContent = total;

      aubergePlusBtn.disabled = aubergeRemaining <= 0;
      cafePlusBtn.disabled = cafeRemaining <= 0;
      aubergeMinusBtn.disabled = aubergeCount <= 0;
      cafeMinusBtn.disabled = cafeCount <= 0;

      if (aubergeCount >= AUBERGE_MAX) {
        aubergeRemainText.textContent = 'オーベルジュの上限（2組）に達しています。';
      } else if (aubergeRemaining <= 0) {
        aubergeRemainText.textContent = '本日のご予約枠が上限に達しているため、オーベルジュのご予約を承ることができません。';
      } else {
        aubergeRemainText.textContent = `残り${aubergeRemaining}組`;
      }

      if (cafeCount >= CAFE_MAX) {
        cafeRemainText.textContent = 'カフェ・レストランの上限（3組）に達しています。';
      } else if (cafeRemaining <= 0) {
        cafeRemainText.textContent = '本日のご予約枠が上限に達しているため、カフェ・レストランのご予約を承ることができません。';
      } else if (aubergeCount > 0) {
        cafeRemainText.textContent = `本日はオーベルジュのご予約が${aubergeCount}組入っているため、カフェ・レストランのご予約は残り${cafeRemaining}組までとなります。`;
      } else {
        cafeRemainText.textContent = `残り${cafeRemaining}組`;
      }

      capacityMessage.textContent = total >= TOTAL_MAX ? '本日のご予約枠が上限に達しているため、これ以上のご予約はお受けできません。' : '';
    }

    aubergePlusBtn.addEventListener('click', () => {
      const remainingTotal = TOTAL_MAX - (aubergeCount + cafeCount);
      if (aubergeCount < AUBERGE_MAX && remainingTotal > 0) {
        aubergeCount++;
        updateCapacity();
      }
    });
    aubergeMinusBtn.addEventListener('click', () => {
      if (aubergeCount > 0) {
        aubergeCount--;
        updateCapacity();
      }
    });
    cafePlusBtn.addEventListener('click', () => {
      const remainingTotal = TOTAL_MAX - (aubergeCount + cafeCount);
      if (cafeCount < CAFE_MAX && remainingTotal > 0) {
        cafeCount++;
        updateCapacity();
      }
    });
    cafeMinusBtn.addEventListener('click', () => {
      if (cafeCount > 0) {
        cafeCount--;
        updateCapacity();
      }
    });
    if (capacityResetBtn) {
      capacityResetBtn.addEventListener('click', () => {
        aubergeCount = 0;
        cafeCount = 0;
        updateCapacity();
      });
    }

    updateCapacity();
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
