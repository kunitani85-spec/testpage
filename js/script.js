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

  /* scramble reveal — characters cycle randomly before landing on the real text.
     Fullwidth Latin/digits are used as filler for CJK titles (matches glyph width,
     no per-frame jitter); plain half-width ASCII is used for Latin titles. */
  const SCRAMBLE_SOURCE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const CJK_RE = /[　-〿぀-ヿ㐀-䶿一-鿿＀-￯]/;
  const randomFullwidthChar = () => {
    const c = SCRAMBLE_SOURCE[Math.floor(Math.random() * SCRAMBLE_SOURCE.length)];
    return String.fromCharCode(c.charCodeAt(0) + 0xfee0); // ASCII → fullwidth form
  };
  const randomHalfwidthChar = () => SCRAMBLE_SOURCE[Math.floor(Math.random() * SCRAMBLE_SOURCE.length)];
  const scrambleReveal = (el, duration = 900) => {
    const finalText = el.textContent.trim();
    const chars = Array.from(finalText);
    const total = chars.length;
    const randomChar = CJK_RE.test(finalText) ? randomFullwidthChar : randomHalfwidthChar;
    const startTime = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const lockCount = Math.floor(progress * total);
      let out = '';
      for (let i = 0; i < total; i++) {
        const c = chars[i];
        out += (c === ' ' || c === '　' || i < lockCount) ? c : randomChar();
      }
      el.textContent = out;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = finalText;
      }
    };
    requestAnimationFrame(frame);
  };
  const startReveal = (el) => {
    el.classList.add('in-view');
    if (el.getAttribute('data-anim') === 'scramble') scrambleReveal(el);
  };

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
