(() => {
  'use strict';

  /* ---------- Hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const gnav = document.getElementById('gnav');

  hamburger.addEventListener('click', () => {
    const isOpen = gnav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  gnav.querySelectorAll('.gnav-link').forEach((link) => {
    link.addEventListener('click', () => {
      gnav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- MV crossfade slideshow ---------- */
  const mvSlides = document.querySelectorAll('.mv-slide');
  if (mvSlides.length) {
    let mvIndex = 0;
    setInterval(() => {
      mvSlides[mvIndex].classList.remove('is-active');
      mvIndex = (mvIndex + 1) % mvSlides.length;
      mvSlides[mvIndex].classList.add('is-active');
    }, 4000);
  }

  /* ---------- Member slider (3 at a time, prev/next) ---------- */
  const memberTrack = document.getElementById('memberTrack');
  const memberPrev = document.getElementById('memberPrev');
  const memberNext = document.getElementById('memberNext');

  if (memberTrack && memberPrev && memberNext) {
    const cards = Array.from(memberTrack.children);
    let currentIndex = 0;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 560) return 1;
      if (w <= 900) return 2;
      return 3;
    }

    function update() {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(cards.length - visibleCount, 0);
      currentIndex = Math.min(currentIndex, maxIndex);

      const card = cards[0];
      const style = getComputedStyle(memberTrack);
      const gap = parseFloat(style.columnGap || style.gap || 0);
      const step = card.getBoundingClientRect().width + gap;

      memberTrack.style.transform = `translateX(${-currentIndex * step}px)`;
      memberPrev.disabled = currentIndex <= 0;
      memberNext.disabled = currentIndex >= maxIndex;
    }

    memberNext.addEventListener('click', () => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(cards.length - visibleCount, 0);
      currentIndex = Math.min(currentIndex + visibleCount, maxIndex);
      update();
    });

    memberPrev.addEventListener('click', () => {
      const visibleCount = getVisibleCount();
      currentIndex = Math.max(currentIndex - visibleCount, 0);
      update();
    });

    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Tabs (support section) ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.panel === target);
      });
    });
  });

  /* ---------- Recruit section: hover to swap image ---------- */
  const recruitButtons = document.querySelectorAll('.recruit-btn');
  const recruitImages = document.querySelectorAll('.recruit-image');

  function setRecruitImage(target) {
    recruitButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.img === target));
    recruitImages.forEach((img) => img.classList.toggle('is-active', img.dataset.img === target));
  }

  recruitButtons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => setRecruitImage(btn.dataset.img));
    btn.addEventListener('click', () => setRecruitImage(btn.dataset.img));
    btn.addEventListener('focus', () => setRecruitImage(btn.dataset.img));
  });

  /* ---------- Header scroll shadow ---------- */
  const header = document.getElementById('header');
  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();
})();
