(function () {
  'use strict';

  var body = document.body;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var pageTop = document.querySelector('.page-top');

  // ---- モバイルメニュー ----
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    document.querySelectorAll('.global-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- スクロール時のヘッダー・ページトップ ----
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (pageTop) pageTop.classList.toggle('is-visible', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- フェードイン ----
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- 新着情報：カテゴリ絞り込み・詳細開閉 ----
  var filterButtons = document.querySelectorAll('.news-filter button');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      document.querySelectorAll('.news-list li[data-cat]').forEach(function (item) {
        item.hidden = !(cat === 'all' || item.getAttribute('data-cat') === cat);
      });
    });
  });

  document.querySelectorAll('.news-list button.news-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.closest('li');
      var open = li.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // ---- お問い合わせフォーム ----
  var form = document.getElementById('contact-form');
  if (form) {
    var agree = document.getElementById('agree');
    var submit = form.querySelector('[type="submit"]');

    agree.addEventListener('change', function () {
      submit.disabled = !agree.checked;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;

      form.querySelectorAll('[data-required]').forEach(function (row) {
        var field = row.querySelector('input, textarea, select');
        var ok;
        if (field.type === 'radio') {
          ok = !!row.querySelector('input:checked');
        } else if (field.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        } else {
          ok = field.value.trim() !== '';
        }
        row.classList.toggle('is-invalid', !ok);
        if (!ok) {
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        firstInvalid.focus();
        return;
      }

      // ※ 送信処理（メール送信・フォームサービス連携等）は公開時に実装してください
      form.hidden = true;
      var done = document.getElementById('form-complete');
      done.style.display = 'block';
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
