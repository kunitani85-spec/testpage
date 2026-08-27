(() => {
  'use strict';

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (preloader) setTimeout(() => preloader.classList.add('is-hidden'), 400);
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTop');

  function updateHeaderState() {
    const scrolled = window.scrollY > 40;
    if (header) header.classList.toggle('is-scrolled', scrolled);
    if (toTopBtn) toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
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
  }

  /* ---------- To top ---------- */
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal (fade in / up / scale) ---------- */
  function observeReveals(root = document) {
    const revealEls = root.querySelectorAll('.reveal:not(.is-observed)');
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
    revealEls.forEach((el) => {
      el.classList.add('is-observed');
      revealObserver.observe(el);
    });
  }
  observeReveals();
  window.observeReveals = observeReveals;

  /* ---------- Cursor glow (desktop only) ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cursorGlow && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      cursorGlow.classList.add('is-active');
    });
    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('is-active'));
  }

  /* ---------- Parallax layers ---------- */
  const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));
  let ticking = false;

  function applyParallax() {
    parallaxEls.forEach((el) => {
      const speed = Number(el.dataset.speed) || 0.2;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    ticking = false;
  }
  function onScrollParallax() {
    if (!reduceMotion && parallaxEls.length) {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }
  }
  window.addEventListener('scroll', onScrollParallax, { passive: true });
  window.addEventListener('resize', onScrollParallax);
  if (!reduceMotion) applyParallax();

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll('.stat-num');
  function animateCount(el) {
    const target = Number(el.dataset.count);
    const duration = 1500;
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

  /* ---------- Section banner underline sweep ---------- */
  const bannerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          bannerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('.section-banner').forEach((el) => bannerObserver.observe(el));

  /* ---------- Smooth anchor scroll offset for fixed header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      let target;
      try {
        target = document.querySelector(id);
      } catch (err) {
        return;
      }
      if (!target || !header) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Employee benefits tabs ---------- */
  const tabBar = document.getElementById('tabBar');
  if (tabBar) {
    const tabButtons = tabBar.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach((b) => b.classList.remove('is-active'));
        panels.forEach((p) => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        const panel = document.getElementById(btn.dataset.tab);
        if (panel) panel.classList.add('is-active');
      });
    });
  }

  /* ---------- Interview carousel (front-page.php がPHPで出力した先頭3件をベースに、
     WordPressが渡すUOTORA_INTERVIEWSでループさせる) ---------- */
  const interviewTrack = document.getElementById('interviewTrack');
  if (interviewTrack && typeof UOTORA_INTERVIEWS !== 'undefined' && UOTORA_INTERVIEWS.length) {
    let startIndex = 0;
    const visibleCount = 3;
    const items = UOTORA_INTERVIEWS;

    function renderInterviews() {
      interviewTrack.innerHTML = '';
      for (let i = 0; i < Math.min(visibleCount, items.length); i++) {
        const p = items[(startIndex + i) % items.length];
        const card = document.createElement('a');
        card.className = 'interview-card';
        card.href = p.url;
        const photoInner = p.photo
          ? `<img src="${p.photo}" alt="${p.name}">`
          : '<svg viewBox="0 0 48 48"><use href="#icon-person"></use></svg>';
        card.innerHTML = `
          <div class="interview-photo">${photoInner}</div>
          <div class="interview-body">
            <p class="interview-role">${p.role || ''}</p>
            <p class="interview-name">${p.name}</p>
            <p class="interview-year">${p.year || ''}</p>
          </div>`;
        interviewTrack.appendChild(card);
      }
      observeReveals();
    }

    function shift(delta) {
      interviewTrack.classList.add('is-changing');
      setTimeout(() => {
        startIndex = (startIndex + delta + items.length) % items.length;
        renderInterviews();
        interviewTrack.classList.remove('is-changing');
      }, 180);
    }

    const prevBtn = document.getElementById('interviewPrev');
    const nextBtn = document.getElementById('interviewNext');
    if (prevBtn) prevBtn.addEventListener('click', () => shift(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => shift(1));
    if (items.length > visibleCount) {
      renderInterviews();
    }
  }
})();
