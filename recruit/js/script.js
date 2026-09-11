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
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

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

  /* ---------- About section: gold-frame infinite loop slider ---------- */
  (() => {
    const track = document.getElementById('loopTrack');
    if (!track) return;

    const originalSet = track.querySelector('.loop-set');
    if (!originalSet) return;

    function build() {
      Array.prototype.slice.call(track.querySelectorAll('.loop-set')).forEach((set, i) => {
        if (i > 0) set.remove();
      });

      const trackGap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
      const setWidth = originalSet.getBoundingClientRect().width + trackGap;
      if (!setWidth) return;

      track.style.setProperty('--loop-shift', setWidth + 'px');

      const containerWidth = track.parentElement.clientWidth;
      const minWidth = containerWidth * 2 + setWidth;
      let currentWidth = setWidth;

      while (currentWidth < minWidth) {
        track.appendChild(originalSet.cloneNode(true));
        currentWidth += setWidth;
      }
    }

    const images = track.querySelectorAll('img');
    if (images.length) {
      let loaded = 0;
      images.forEach((img) => {
        if (img.complete) {
          loaded++;
        } else {
          img.addEventListener('load', () => {
            loaded++;
            if (loaded === images.length) build();
          });
        }
      });
      if (loaded === images.length) build();
    } else {
      build();
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    });
  })();

  /* ---------- Field section: 職種紹介 autoplay slideshow ---------- */
  (() => {
    const photos = document.querySelectorAll('.field-fish__photo');
    const infoSlides = document.querySelectorAll('.field-info__slide');
    const dots = document.querySelectorAll('.field-dot');
    const cards = document.querySelectorAll('.field-card');
    const prevBtn = document.querySelector('.field-arrow--prev');
    const nextBtn = document.querySelector('.field-arrow--next');

    if (!photos.length) return;

    const total = photos.length;
    let current = 0;
    const AUTOPLAY_MS = 4500;
    let timer = null;

    function show(index) {
      current = (index + total) % total;

      photos.forEach((el, i) => el.classList.toggle('is-active', i === current));
      infoSlides.forEach((el, i) => el.classList.toggle('is-active', i === current));
      dots.forEach((el, i) => el.classList.toggle('is-active', i === current));
      cards.forEach((el) => {
        const targetIndex = parseInt(el.getAttribute('data-index'), 10);
        el.classList.toggle('is-active', targetIndex === current);
      });
    }

    function next() { show(current + 1); }
    function prev() { show(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); restartAutoplay(); }));
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        show(parseInt(card.getAttribute('data-index'), 10));
        restartAutoplay();
      });
    });

    const section = document.querySelector('.field-section');
    if (section) {
      section.addEventListener('mouseenter', stopAutoplay);
      section.addEventListener('mouseleave', startAutoplay);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    show(0);
    if (!reduceMotion) startAutoplay();
  })();

  /* ---------- Member section: interview infinite carousel ---------- */
  (() => {
    const track = document.getElementById('interviewTrack');
    const prevBtn = document.getElementById('interviewPrev');
    const nextBtn = document.getElementById('interviewNext');
    if (!track || !prevBtn || !nextBtn) return;

    const originalCards = Array.prototype.slice.call(track.children);
    const total = originalCards.length;
    if (!total) return;

    const AUTOPLAY_MS = 4000;
    let timer = null;
    let index = total;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));
    originalCards.forEach((card) => track.insertBefore(card.cloneNode(true), track.firstChild));

    const cards = Array.prototype.slice.call(track.children);

    function stepWidth() {
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 0) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function moveTo(newIndex, animate) {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = 'translateX(' + (-newIndex * stepWidth()) + 'px)';
    }

    function settle() {
      if (index >= total * 2) {
        index -= total;
        moveTo(index, false);
      } else if (index < total) {
        index += total;
        moveTo(index, false);
      }
    }

    track.addEventListener('transitionend', settle);

    function next() { index += 1; moveTo(index, true); }
    function prev() { index -= 1; moveTo(index, true); }

    function startAutoplay() {
      stopAutoplay();
      if (reduceMotion) return;
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

    const slider = track.closest('.rinterview-slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
    }

    window.addEventListener('resize', () => moveTo(index, false));

    moveTo(index, false);
    startAutoplay();
  })();

  /* ---------- Wave canvas background animation ---------- */
  (() => {
    const unit = 100;
    let canvasList = [];
    const colorList = [];
    const drawInfo = { seconds: 0, t: 0 };

    function drawSine(canvas, t, zoom, delay) {
      const xAxis = Math.floor(canvas.height / 2);
      const context = canvas.contextCache;
      let x = t;
      let y = Math.sin(x) / zoom;
      context.moveTo(0, unit * y + xAxis);

      for (let i = 0; i <= canvas.width + 10; i += 10) {
        x = t + i / unit / zoom;
        y = Math.sin(x - delay) / 2.4;
        context.lineTo(i, unit * y + xAxis);
      }
    }

    function drawWave(canvas, color, alpha, zoom, delay) {
      const context = canvas.contextCache;
      context.fillStyle = color;
      context.globalAlpha = alpha;

      context.beginPath();
      drawSine(canvas, drawInfo.t / 0.5, zoom, delay);
      context.lineTo(canvas.width + 10, canvas.height);
      context.lineTo(0, canvas.height);
      context.closePath();
      context.fill();
    }

    function draw(canvas, color) {
      const context = canvas.contextCache;
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (color[0]) {
        if (color[1] && color[2]) {
          drawWave(canvas, color[0], 0.3, 3, 0);
          drawWave(canvas, color[1], 0.5, 2, 250);
          drawWave(canvas, color[2], 0.2, 1.6, 100);
        } else if (color[1] && !color[2]) {
          drawWave(canvas, color[0], 0.4, 3, 0);
          drawWave(canvas, color[1], 0.6, 2, 250);
        } else {
          drawWave(canvas, color[0], 1, 3, 0);
        }
      }
    }

    function update() {
      canvasList.forEach((canvas, index) => draw(canvas, colorList[index]));
      drawInfo.seconds += 0.014;
      drawInfo.t = drawInfo.seconds * Math.PI;
      setTimeout(update, 35);
    }

    function init() {
      canvasList = document.querySelectorAll('.wave-bar');
      if (!canvasList.length) return;

      canvasList.forEach((canvas) => {
        const canvasDataSet = canvas.dataset;
        const inner = canvas.nextElementSibling;

        canvas.width = document.documentElement.clientWidth;
        canvas.width *= devicePixelRatio;
        canvas.height = canvas.width * 0.04;
        canvas.height *= devicePixelRatio;
        canvas.style.height = String(canvas.height / devicePixelRatio) + 'px';

        canvas.contextCache = canvas.getContext('2d');

        colorList.push([canvasDataSet.color1, canvasDataSet.color2, canvasDataSet.color3]);

        if (canvasDataSet.bgcolor) {
          canvas.parentNode.style.backgroundColor = canvasDataSet.bgcolor;
        }

        if (inner) {
          const innerDataSet = inner.dataset;
          if (innerDataSet.color) inner.style.color = innerDataSet.color;
          if (innerDataSet.bgcolor) inner.style.backgroundColor = innerDataSet.bgcolor;
        }
      });

      update();
    }

    init();
  })();

  /* ---------- Scroll-triggered reveal: about image/text ---------- */
  (() => {
    const targets = document.getElementsByClassName('about-scroll-effect');
    if (!targets.length) return;

    function fadeIn() {
      const position = Math.floor(window.innerHeight * 0.75);
      for (let i = 0; i < targets.length; i++) {
        const rect = targets[i].getBoundingClientRect();
        if (Math.floor(rect.top) < position) targets[i].classList.add('scroll-in');
        if (Math.floor(rect.bottom) < 0) targets[i].classList.remove('scroll-in');
      }
    }

    window.addEventListener('scroll', fadeIn, { passive: true });
    fadeIn();
  })();

  /* ---------- Scroll-triggered reveal: text-sweep headings ---------- */
  (() => {
    const targets = document.getElementsByClassName('text-sweep');
    if (!targets.length) return;

    function check() {
      const position = Math.floor(window.innerHeight * 0.75);
      for (let i = 0; i < targets.length; i++) {
        const rect = targets[i].getBoundingClientRect();
        if (Math.floor(rect.top) < position) targets[i].classList.add('scroll-in');
        if (Math.floor(rect.bottom) < 0) targets[i].classList.remove('scroll-in');
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  })();

  /* ---------- Page-top button ---------- */
  (() => {
    const pageTop = document.getElementById('page-top');
    const link = pageTop ? pageTop.querySelector('a') : null;
    if (!pageTop || !link) return;

    function updatePageTop() {
      if (window.scrollY >= 200) {
        pageTop.classList.remove('DownMove');
        pageTop.classList.add('UpMove');
      } else if (pageTop.classList.contains('UpMove')) {
        pageTop.classList.remove('UpMove');
        pageTop.classList.add('DownMove');
      }
    }

    window.addEventListener('scroll', updatePageTop, { passive: true });
    window.addEventListener('load', updatePageTop);
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();
})();
