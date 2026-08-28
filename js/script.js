/* ==========================================================================
   リユースプラス - サイト共通スクリプト
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- ヘッダーのスクロール状態 / モバイルメニュー ---------- */
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const toTopBtn = document.getElementById('toTop');

  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    toTopBtn.classList.toggle('is-visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // ナビリンクをクリックしたらモバイルメニューを閉じる
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- スクロールで要素をフェードイン ---------- */
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- よくある質問：アコーディオン ---------- */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) {
        answer.style.maxHeight = null;
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- ヒーロー：スライドショー ---------- */
  const slideshow = document.getElementById('heroSlideshow');
  if (slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.slide-dot'));
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let currentSlide = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentSlide);
        dot.setAttribute('aria-selected', String(i === currentSlide));
      });
    }

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoplay(); });
    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoplay(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
    });

    slideshow.addEventListener('mouseenter', stopAutoplay);
    slideshow.addEventListener('mouseleave', startAutoplay);
    slideshow.addEventListener('focusin', stopAutoplay);
    slideshow.addEventListener('focusout', startAutoplay);

    goToSlide(0);
    startAutoplay();
  }

  /* ---------- 販売タイムセール中：カルーセル ---------- */
  const saleCarousel = document.getElementById('saleCarousel');
  if (saleCarousel) {
    const salePrev = document.getElementById('salePrev');
    const saleNext = document.getElementById('saleNext');
    const scrollByCard = () => {
      const card = saleCarousel.querySelector('.sale-card');
      return card ? card.getBoundingClientRect().width + 20 : 260;
    };
    salePrev.addEventListener('click', () => {
      saleCarousel.scrollBy({ left: -scrollByCard(), behavior: 'smooth' });
    });
    saleNext.addEventListener('click', () => {
      saleCarousel.scrollBy({ left: scrollByCard(), behavior: 'smooth' });
    });
  }

  /* ---------- お問い合わせフォームの入力チェック ---------- */
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccess');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telPattern = /^[0-9\-+()\s]{10,14}$/;
  const zipPattern = /^\d{3}-?\d{4}$/;

  /* ---------- 画像添付：選択ファイルの管理 ---------- */
  const photosInput = document.getElementById('photos');
  const fileListEl = document.getElementById('fileList');
  const fileTotalEl = document.getElementById('fileTotal');
  const MAX_FILES = 10;
  const MAX_TOTAL_BYTES = 3 * 1024 * 1024 * 1024; // 3GB
  const WARN_TOTAL_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
  let selectedFiles = [];

  function formatBytes(bytes) {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
  }

  function syncPhotosInput() {
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach((file) => dataTransfer.items.add(file));
    photosInput.files = dataTransfer.files;
  }

  function renderFileList() {
    fileListEl.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const li = document.createElement('li');
      li.className = 'file-item';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = file.name + '（' + formatBytes(file.size) + '）';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'file-item-remove';
      removeBtn.textContent = '削除';
      removeBtn.setAttribute('aria-label', file.name + 'を削除');
      removeBtn.addEventListener('click', () => {
        selectedFiles.splice(index, 1);
        syncPhotosInput();
        renderFileList();
      });

      li.appendChild(nameSpan);
      li.appendChild(removeBtn);
      fileListEl.appendChild(li);
    });

    const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    fileTotalEl.classList.remove('is-warning', 'is-error');

    if (selectedFiles.length === 0) {
      fileTotalEl.textContent = '';
    } else {
      fileTotalEl.textContent = '選択中：' + selectedFiles.length + '枚 / 合計 ' + formatBytes(totalBytes);
      if (totalBytes > MAX_TOTAL_BYTES || selectedFiles.length > MAX_FILES) {
        fileTotalEl.classList.add('is-error');
      } else if (totalBytes > WARN_TOTAL_BYTES) {
        fileTotalEl.classList.add('is-warning');
      }
    }
  }

  if (photosInput) {
    photosInput.addEventListener('change', () => {
      const incoming = Array.from(photosInput.files);
      selectedFiles = selectedFiles.concat(incoming).slice(0, MAX_FILES);
      syncPhotosInput();
      renderFileList();
      validatePhotos();
    });
  }

  function validatePhotos() {
    const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (selectedFiles.length > MAX_FILES) {
      setFieldError('photos', '画像は最大' + MAX_FILES + '枚までです。');
      return false;
    }
    if (totalBytes > MAX_TOTAL_BYTES) {
      setFieldError('photos', '添付ファイルの合計サイズが3GBを超えています。枚数を減らしてください。');
      return false;
    }
    setFieldError('photos', '');
    return true;
  }

  function setFieldError(fieldId, message) {
    const errorEl = document.getElementById('error-' + fieldId);
    errorEl.closest('.form-row').classList.toggle('has-error', Boolean(message));
    errorEl.textContent = message || '';
  }

  function validateForm() {
    let isValid = true;

    const name = document.getElementById('name').value.trim();
    if (!name) {
      setFieldError('name', 'お名前を入力してください。');
      isValid = false;
    } else {
      setFieldError('name', '');
    }

    const email = document.getElementById('email').value.trim();
    if (!email) {
      setFieldError('email', 'メールアドレスを入力してください。');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setFieldError('email', '正しいメールアドレスの形式で入力してください。');
      isValid = false;
    } else {
      setFieldError('email', '');
    }

    // 電話番号は任意項目だが、入力がある場合のみ形式をチェック
    const tel = document.getElementById('tel').value.trim();
    if (tel && !telPattern.test(tel)) {
      setFieldError('tel', 'ハイフンを含む正しい電話番号の形式で入力してください。');
      isValid = false;
    } else {
      setFieldError('tel', '');
    }

    // 郵便番号は任意項目だが、入力がある場合のみ形式をチェック
    const zip = document.getElementById('zip').value.trim();
    if (zip && !zipPattern.test(zip)) {
      setFieldError('zip', '「123-4567」の形式で入力してください。');
      isValid = false;
    } else {
      setFieldError('zip', '');
    }

    const method = document.getElementById('method').value;
    if (!method) {
      setFieldError('method', 'ご希望の買取方法を選択してください。');
      isValid = false;
    } else {
      setFieldError('method', '');
    }

    const contactMethodChecked = form.querySelector('input[name="contactMethod"]:checked');
    if (!contactMethodChecked) {
      setFieldError('contactMethod', 'ご連絡方法を選択してください。');
      isValid = false;
    } else {
      setFieldError('contactMethod', '');
    }

    if (!validatePhotos()) {
      isValid = false;
    }

    const message = document.getElementById('message').value.trim();
    if (!message) {
      setFieldError('message', 'お問い合わせ内容を入力してください。');
      isValid = false;
    } else {
      setFieldError('message', '');
    }

    const privacy = document.getElementById('privacy').checked;
    if (!privacy) {
      setFieldError('privacy', 'プライバシーポリシーへの同意が必要です。');
      isValid = false;
    } else {
      setFieldError('privacy', '');
    }

    return isValid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.textContent = '';

    if (!validateForm()) {
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // NOTE: 送信先は未確定のため、ここでは送信を模擬している。
    // 本番運用時は fetch() 等で実際の送信先エンドポイントに置き換える。
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    setTimeout(() => {
      form.reset();
      selectedFiles = [];
      renderFileList();
      submitBtn.disabled = false;
      submitBtn.textContent = 'この内容で送信する';
      successMessage.textContent = 'お問い合わせを受け付けました。担当者より1〜2営業日以内にご連絡いたします。';
    }, 700);
  });

})();
