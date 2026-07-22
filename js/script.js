(() => {
  'use strict';

  /* ---------- Preloader (skip on 2nd visit same day) ---------- */
  const preloader = document.getElementById('preloader');
  const VISIT_KEY = 'nagisaLastVisitDate';
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem(VISIT_KEY);

  if (lastVisit === today) {
    preloader.classList.add('is-skip');
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('is-hidden'), 1600);
    });
    localStorage.setItem(VISIT_KEY, today);
  }

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('header');
  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  /* ---------- Fullscreen nav ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const fullnav = document.getElementById('fullnav');
  const fullnavClose = document.getElementById('fullnavClose');

  function openNav() {
    fullnav.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    fullnav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', openNav);
  fullnavClose.addEventListener('click', closeNav);
  fullnav.querySelectorAll('.fullnav-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* ---------- Scroll reveal (fade + scale up on enter) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
