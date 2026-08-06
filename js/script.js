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

  /* scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => el.classList.add('in-view'), Number(delay));
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => io.observe(el));

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
