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

  /* ---------- Contact form (client-side only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'ご予約ありがとうございます。内容を確認の上、担当者よりご連絡いたします。';
      contactForm.reset();
    });
  }

  /* ---------- Closed-day logic: 1st & 3rd Sunday of the month ---------- */
  function isSalonClosed(date) {
    if (date.getDay() !== 0) return false;
    const nthSunday = Math.floor((date.getDate() - 1) / 7) + 1;
    return nthSunday === 1 || nthSunday === 3;
  }

  /* ---------- Today's open/closed status badge ---------- */
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  if (statusDot && statusText) {
    const today = new Date();
    const closedToday = isSalonClosed(today);
    const dateLabel = today.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });
    if (closedToday) {
      statusDot.classList.add('is-closed');
      statusText.textContent = `本日（${dateLabel}）は定休日です`;
    } else {
      statusDot.classList.add('is-open');
      statusText.textContent = `本日（${dateLabel}）は営業中です・10:00〜19:00`;
    }
  }

  /* ---------- Closed-day calendar widget ---------- */
  const calTitle = document.getElementById('calTitle');
  const calGrid = document.getElementById('calGrid');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');

  if (calTitle && calGrid) {
    const today = new Date();
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();

    function renderCalendar() {
      calTitle.textContent = `${viewYear}年${viewMonth + 1}月`;
      calGrid.innerHTML = '';

      const firstDay = new Date(viewYear, viewMonth, 1);
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const startOffset = firstDay.getDay();

      for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-cell is-empty';
        calGrid.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(viewYear, viewMonth, d);
        const cell = document.createElement('div');
        cell.className = 'cal-cell';
        cell.textContent = String(d);

        if (cellDate.getDay() === 0) cell.classList.add('is-sunday');
        if (isSalonClosed(cellDate)) cell.classList.add('is-closed');
        if (
          cellDate.getFullYear() === today.getFullYear() &&
          cellDate.getMonth() === today.getMonth() &&
          cellDate.getDate() === today.getDate()
        ) {
          cell.classList.add('is-today');
        }
        calGrid.appendChild(cell);
      }
    }

    if (calPrev) {
      calPrev.addEventListener('click', () => {
        viewMonth -= 1;
        if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
        renderCalendar();
      });
    }
    if (calNext) {
      calNext.addEventListener('click', () => {
        viewMonth += 1;
        if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
        renderCalendar();
      });
    }

    renderCalendar();
  }
})();
