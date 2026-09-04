/* ================================================
   common/js/lower.js
   下層ページ専用スクリプト

   TOPページの common/js/script.js は「ローディング→動画イントロ→
   ファーストビュー」という専用の要素(#loading, #movie, #introVideo,
   #skip, #replayMovie)がある前提で書かれている。

   下層ページ(concept.html など)にはそれらの要素が無いため、
   script.js をそのまま読み込むと
     1) video.addEventListener(...) で null 参照エラーが起き、
        その時点で script.js の残りの処理(ハンバーガーメニュー・
        フェードイン監視・ブラーのJSフォールバックなど)が実行されない
     2) <html> に intro-done クラスが一生付かず、
        html:not(.intro-done) main { display:none } が解除されない
   という2つの問題が起きる。

   このファイルはイントロ専用ロジックを含めず、下層ページに
   必要な共通処理だけをまとめたもの。
   concept.html 等では
     <script src="common/js/script.js"></script>
   の代わりに
     <script src="common/js/lower.js"></script>
   を読み込む。
================================================ */

(function () {
    "use strict";

    /* ==========================================================
       0. 初期化: no-js -> js への切り替え、intro-done の付与
       ========================================================== */
    var root = document.documentElement;
    root.classList.remove("no-js");
    root.classList.add("js");

    // 下層ページには動画イントロが無いので、即座に intro-done を付与し、
    // html:not(.intro-done) main{display:none} を解除する。
    root.classList.add("intro-done");

    // ファーストビュー(#firstview)があれば表示状態にしておく
    var firstview = document.getElementById("firstview");
    if (firstview) {
        firstview.classList.add("is-visible");
    }
})();


/* ==========================================================
   1. 横スクロール：image_box_tit が画面中央に来たら画像を開く
      (pin_wrapper を使うページのみ動作。無ければ即return)
   ========================================================== */
(function () {
    var wrapper = document.querySelector('.pin_wrapper');
    if (!wrapper) return;

    var pairs = [];
    document.querySelectorAll('.image_box').forEach(function (box) {
        var tit = box.querySelector('.image_box_tit');
        var image = box.querySelector('.image');
        if (tit && image) pairs.push({
            tit: tit,
            image: image
        });
    });

    var ticking = false;

    function update() {
        var winW = window.innerWidth;
        var start = winW * 0.9;
        var end = winW * 0.4;

        pairs.forEach(function (pair) {
            var rect = pair.tit.getBoundingClientRect();
            var titCenter = rect.left + rect.width / 2;
            var p = (start - titCenter) / (start - end);
            p = Math.min(Math.max(p, 0), 1);

            var inset = 30 * (1 - p);
            var round = 20 * (1 - p);
            pair.image.style.clipPath =
                'inset(' + inset + '% round ' + round + '%)';
        });

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
})();

function setPinDistance() {
    var wrapper = document.querySelector('.pin_wrapper');
    if (!wrapper) return;
    var lastBox = wrapper.querySelector('.image_box:last-child');
    var extra = lastBox ? lastBox.offsetWidth / 2 : 0;
    var distance = wrapper.scrollWidth - window.innerWidth - extra;
    wrapper.style.setProperty('--pin-distance', '-' + distance + 'px');
}
requestAnimationFrame(function () {
    if (typeof setPinDistance === "function") setPinDistance();
});
window.addEventListener('resize', setPinDistance);


/* ==========================================================
   2. ハンバーガーメニュー
   ========================================================== */
(function () {
    var btn = document.getElementById('hamburgerBtn');
    var drawer = document.getElementById('drawerMenu');
    if (!btn || !drawer) return;

    function openDrawer() {
        btn.classList.add('is-open');
        drawer.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        btn.classList.remove('is-open');
        drawer.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
        btn.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });

    drawer.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(link.getAttribute('href'));
            closeDrawer();
            if (target) {
                setTimeout(function () {
                    var headerH = document.querySelector('.header') ?
                        document.querySelector('.header').offsetHeight : 0;
                    var top = target.getBoundingClientRect().top +
                        window.scrollY - headerH;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }, 350);
            }
        });
    });

    drawer.addEventListener('click', function (e) {
        if (e.target === drawer) closeDrawer();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDrawer();
    });
})();


/* ==========================================================
   3. サステナビリティ系 個別ブラースクロール
      (.c-blur-sustainability__overlay + .p-reveal02 があるページのみ)
   ========================================================== */
(function () {
    var overlay = document.querySelector('.c-blur-sustainability__overlay');
    var trigger = document.querySelector('.p-reveal02');
    if (!overlay || !trigger) return;

    var BLUR_MAX = 16;
    var TINT_MAX = 0.45;

    function onScroll() {
        var rect = trigger.getBoundingClientRect();
        var winH = window.innerHeight;
        var start = winH;
        var end = winH * 0.4;
        var p = (start - rect.top) / (start - end);
        p = Math.min(Math.max(p, 0), 1);
        overlay.style.backdropFilter = 'blur(' + (p * BLUR_MAX) + 'px)';
        overlay.style.webkitBackdropFilter = 'blur(' + (p * BLUR_MAX) + 'px)';
        overlay.style.backgroundColor = 'rgba(15,35,80,' + (p * TINT_MAX) + ')';
    }

    overlay.style.backdropFilter = 'blur(0px)';
    overlay.style.webkitBackdropFilter = 'blur(0px)';
    overlay.style.backgroundColor = 'rgba(15,35,80,0)';

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();


/* ==========================================================
   4. data-scroll-blur の進行度制御(JSで常時駆動)
      -> 以前は「ページ全体のスクロール量」を基準にしていたが、
         l-reasonがページの下の方にあると、たどり着いた時点で
         すでにブラーがMAXになってしまう不具合があった。
         これを避けるため、CSSのネイティブscroll-timelineは使わず、
         「対応するreveal要素(.p-reveal / .future-reveal)が
         画面にどれだけ入ってきたか」を基準にJSで常時計算する。
   ========================================================== */
(function () {
    var overlays = document.querySelectorAll("[data-scroll-blur]");
    if (overlays.length === 0) return;

    var reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var root = document.documentElement;

    function readMaxBlur() {
        var raw = getComputedStyle(root).getPropertyValue("--blur-max").trim();
        var value = parseFloat(raw);
        return Number.isFinite(value) && value >= 0 ? value : 20;
    }

    var maxBlur = readMaxBlur();
    var ticking = false;

    // overlay(例: .c-blur__overlay)に対応する「reveal要素」
    // (例: .p-reveal / .future-reveal)を探す。
    // wrapperのクラス名には頼らず、DOM構造(隣の要素)から辿る。
    // 注意: overlay自身がdivなので、overlay.closest("div")は自分自身に
    // マッチしてしまう。必ず親要素から探索を始めること。
    function findRevealTarget(overlay) {
        var startEl = overlay.parentElement;
        var blurSection = startEl ? startEl.closest("section, div") : null;
        var sib = blurSection ? blurSection.nextElementSibling : null;
        var hops = 0;
        while (sib && hops < 5) {
            if (sib.classList && (sib.classList.contains("p-reveal") || sib.classList.contains("future-reveal"))) {
                return sib;
            }
            var inner = sib.querySelector ? sib.querySelector(".p-reveal, .future-reveal") : null;
            if (inner) return inner;
            sib = sib.nextElementSibling;
            hops++;
        }
        return blurSection || overlay;
    }

    var pairs = Array.prototype.map.call(overlays, function (overlay) {
        return { overlay: overlay, target: findRevealTarget(overlay) };
    });

    // reveal要素が画面下端からまだ見えていない間は0、
    // reveal要素の上端が画面上端に到達したら1になるよう計算する。
    function getProgress(target) {
        var rect = target.getBoundingClientRect();
        var viewportH = window.innerHeight || root.clientHeight || 0;
        if (viewportH <= 0) return 0;
        var ratio = (viewportH - rect.top) / viewportH;
        if (ratio < 0) ratio = 0;
        if (ratio > 1) ratio = 1;
        return ratio;
    }

    function update() {
        pairs.forEach(function (pair) {
            var amount = getProgress(pair.target) * maxBlur;
            pair.overlay.style.setProperty("--blur-amount", amount.toFixed(2) + "px");
            pair.overlay.style.setProperty("--blur-tint-alpha", (amount / maxBlur * 0.5).toFixed(2));
        });
        ticking = false;
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }

    function onResize() {
        maxBlur = readMaxBlur();
        onScroll();
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
})();


/* ==========================================================
   5. data-fade-in の表示監視(IntersectionObserver ワンショット)
   -> CSS側の `.js セレクター` に依存せず、JSから直接
      opacity/transform を当てる方式に変更。
      (no-js→jsのクラス切り替えタイミングや、CSSの読み込み順に
       左右されず、確実に動くようにするため)
   ========================================================== */
(function () {
    var targets = document.querySelectorAll("[data-fade-in]");
    if (targets.length === 0) return;

    var reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 初期状態(隠す)をJSから直接指定する
    if (!reduceMotion) {
        targets.forEach(function (el) {
            el.style.opacity = "0";
            el.style.transform = "translateY(24px)";
            el.style.transition = "opacity .9s ease, transform .9s ease";
        });
    }

    function reveal(el) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.classList.add("is-visible"); // 既存CSSとの互換のため一応付けておく
    }

    // 動きを減らす設定、またはIntersectionObserver非対応環境は即表示
    if (reduceMotion || !("IntersectionObserver" in window)) {
        targets.forEach(reveal);
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            reveal(entry.target);
            obs.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
    });

    targets.forEach(function (el) {
        observer.observe(el);
    });
})();


/* ==========================================================
   6. ページトップボタン(jQuery)
   ========================================================== */
function PageTopAnime() {
    var scroll = $(window).scrollTop();
    if (scroll >= 200) {
        $('#page-top').removeClass('DownMove').addClass('UpMove');
    } else {
        if ($('#page-top').hasClass('UpMove')) {
            $('#page-top').removeClass('UpMove').addClass('DownMove');
        }
    }
}
$(window).on('scroll', PageTopAnime);
$(window).on('load', PageTopAnime);
$('#page-top a').on('click', function () {
    $('body,html').animate({ scrollTop: 0 }, 500);
    return false;
});