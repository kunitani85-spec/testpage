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

  /* ---------- お問い合わせフォームの入力チェック ---------- */
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccess');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telPattern = /^[0-9\-+()\s]{10,14}$/;

  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById('error-' + fieldId);
    field.closest('.form-row').classList.toggle('has-error', Boolean(message));
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

    const method = document.getElementById('method').value;
    if (!method) {
      setFieldError('method', 'ご希望の買取方法を選択してください。');
      isValid = false;
    } else {
      setFieldError('method', '');
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
      submitBtn.disabled = false;
      submitBtn.textContent = 'この内容で送信する';
      successMessage.textContent = 'お問い合わせを受け付けました。担当者より1〜2営業日以内にご連絡いたします。';
    }, 700);
  });

})();
