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
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

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

  /* ---------- Contact form (front-end only demo) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'お問い合わせありがとうございます。担当者より折り返しご連絡いたします。';
      contactForm.reset();
    });
  }

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
        document.getElementById(btn.dataset.tab).classList.add('is-active');
      });
    });
  }

  /* ---------- Interview carousel ---------- */
  const interviewTrack = document.getElementById('interviewTrack');
  if (interviewTrack) {
    const profiles = [
      { role: 'FISH BUYER / 仕入れ', name: '兵崎 一', year: '2015年入社' },
      { role: 'PROCESSING / 加工', name: '解 慧芳', year: '2019年入社' },
      { role: 'SALES / 営業', name: '竹内 研翔', year: '2012年入社' },
      { role: 'STORE STAFF / 店舗', name: '山田 遥', year: '2021年入社' },
      { role: 'MANAGEMENT / 管理部門', name: '中村 直樹', year: '2008年入社' },
    ];
    let startIndex = 0;
    const visibleCount = 3;

    function renderInterviews() {
      interviewTrack.innerHTML = '';
      for (let i = 0; i < visibleCount; i++) {
        const p = profiles[(startIndex + i) % profiles.length];
        const card = document.createElement('div');
        card.className = 'interview-card';
        card.innerHTML = `
          <div class="interview-photo"><svg viewBox="0 0 48 48"><use href="#icon-person"></use></svg></div>
          <div class="interview-body">
            <p class="interview-role">${p.role}</p>
            <p class="interview-name">${p.name}</p>
            <p class="interview-year">${p.year}</p>
          </div>`;
        interviewTrack.appendChild(card);
      }
      observeReveals();
    }

    function shift(delta) {
      interviewTrack.classList.add('is-changing');
      setTimeout(() => {
        startIndex = (startIndex + delta + profiles.length) % profiles.length;
        renderInterviews();
        interviewTrack.classList.remove('is-changing');
      }, 180);
    }

    document.getElementById('interviewPrev').addEventListener('click', () => shift(-1));
    document.getElementById('interviewNext').addEventListener('click', () => shift(1));
    renderInterviews();
  }
})();
