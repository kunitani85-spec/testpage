(() => {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTop');

  function updateHeaderState() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    if (toTopBtn) toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      header.classList.toggle('is-open', isOpen);
    });
    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        header.classList.remove('is-open');
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const currentPage = (document.body.dataset.page || '').trim();
  if (currentPage) {
    document.querySelectorAll(`.nav-link[data-page="${currentPage}"]`).forEach((link) => {
      link.classList.add('is-active');
    });
  }

  /* ---------- To top ---------- */
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal (fade in / up / scale / left / right) ---------- */
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
    { threshold: 0, rootMargin: '0px 0px -80px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll('[data-count]');
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

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);
  updateHeaderState();

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
