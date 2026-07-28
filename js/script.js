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

  /* ---------- Countdown timer ---------- */
  const eventDateEl = document.getElementById('eventDate');
  if (eventDateEl) {
    const targetTime = new Date(eventDateEl.dataset.eventDate).getTime();
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMinutes');
    const sEl = document.getElementById('cdSeconds');
    const pad = (n) => String(n).padStart(2, '0');

    const tick = () => {
      const diff = targetTime - Date.now();
      if (!dEl || !hEl || !mEl || !sEl) return;
      if (isNaN(targetTime) || diff <= 0) {
        dEl.textContent = '00'; hEl.textContent = '00'; mEl.textContent = '00'; sEl.textContent = '00';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      dEl.textContent = pad(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(minutes);
      sEl.textContent = pad(seconds);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach((other) => {
        other.classList.remove('is-open');
        const btn = other.querySelector('.faq-q');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Contact form (client-side only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'お問い合わせありがとうございます。内容を確認の上、担当者よりご連絡いたします。';
      contactForm.reset();
    });
  }

  /* ---------- Fireworks canvas (hero + quote banner) ---------- */
  const FIREWORK_COLORS = ['#d9333f', '#d4af37', '#4a86c9', '#8b6bb5', '#6b9b6e', '#ffffff'];

  function createFireworksScene(canvas, opts = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let rockets = [];
    let running = true;
    let lastLaunch = 0;
    const launchInterval = opts.launchInterval || 1400;
    const maxAuto = opts.maxAuto ?? Infinity;
    let launchCount = 0;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function randomColor() {
      return FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    }

    function launchRocket(x) {
      const targetY = height * (0.18 + Math.random() * 0.32);
      rockets.push({
        x: x ?? width * (0.15 + Math.random() * 0.7),
        y: height,
        targetY,
        vy: -(height * 0.012 + Math.random() * 2.2),
        color: randomColor(),
        trail: [],
      });
      launchCount += 1;
    }

    function explode(x, y, color) {
      const count = 46 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = 1.2 + Math.random() * 3.4;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.008 + Math.random() * 0.012,
          color,
          size: 1.4 + Math.random() * 1.6,
        });
      }
    }

    function step(ts) {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      if (!opts.manualOnly && ts - lastLaunch > launchInterval && launchCount < maxAuto) {
        lastLaunch = ts;
        launchRocket();
      }

      ctx.globalCompositeOperation = 'lighter';

      rockets = rockets.filter((r) => {
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 10) r.trail.shift();
        r.y += r.vy;
        r.vy += 0.02;

        ctx.beginPath();
        r.trail.forEach((p, i) => {
          const a = i / r.trail.length;
          ctx.strokeStyle = r.color;
          ctx.globalAlpha = a * 0.6;
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045;
        p.vx *= 0.985;
        p.life -= p.decay;
        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    return {
      launchRocket,
      stop: () => { running = false; },
    };
  }

  if (!reduceMotion) {
    const heroCanvas = document.getElementById('fireworksCanvas');
    if (heroCanvas) createFireworksScene(heroCanvas, { launchInterval: 1300 });

    const quoteCanvas = document.getElementById('quoteCanvas');
    if (quoteCanvas && 'IntersectionObserver' in window) {
      let quoteScene = null;
      const quoteIo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !quoteScene) {
            quoteScene = createFireworksScene(quoteCanvas, { launchInterval: 1600 });
          }
        });
      }, { threshold: 0.2 });
      quoteIo.observe(quoteCanvas);
    }
  }
})();
