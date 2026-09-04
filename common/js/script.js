/* ================================================
   横スクロール：image_box_tit が画面中央に来たら画像を開く
================================================ */
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
        var start = winW * 0.9; // この位置から開き始める
        var end = winW * 0.4; // この位置で完全に開く

        pairs.forEach(function (pair) {
            var rect = pair.tit.getBoundingClientRect();
            var titCenter = rect.left + rect.width / 2;

            // 0〜1 の進捗
            var p = (start - titCenter) / (start - end);
            p = Math.min(Math.max(p, 0), 1);

            // clip-path を直接補間（クラス付け外し不要）
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
    }, {
        passive: true
    });

    update(); // 初回
})();


/* ================================================
   setPinDistance の更新（max-content 対応）
================================================ */
function setPinDistance() {
    var wrapper = document.querySelector('.pin_wrapper');
    if (!wrapper) return;
    // 最後の要素が画面中央に来るよう、画面幅の半分を引いた値にする
    var lastBox = wrapper.querySelector('.image_box:last-child');
    var extra = lastBox ? lastBox.offsetWidth / 2 : 0;
    var distance = wrapper.scrollWidth - window.innerWidth - extra;
    wrapper.style.setProperty('--pin-distance', '-' + distance + 'px');
}

/* ================================================
   ローディング・動画イントロ
================================================ */
(function () {
    var DEBUG_ALWAYS_SHOW_INTRO = false;

    var loading = document.getElementById("loading");
    var movieWrap = document.getElementById("movie");
    var firstview = document.getElementById("firstview");
    var video = document.getElementById("introVideo");
    var skipBtn = document.getElementById("skip");
    var replayBtn = document.getElementById("replayMovie");

    function showMain() {
        document.documentElement.classList.add("intro-done");
        requestAnimationFrame(function () {
            if (typeof setPinDistance === "function") setPinDistance();
            try {
                var savedY = sessionStorage.getItem('scrollY');
                if (savedY !== null) {
                    window.scrollTo(0, parseInt(savedY, 10));
                    sessionStorage.removeItem('scrollY');
                }
            } catch (e) {}
        });
    }

    var STORAGE_KEY = "gyoten_intro_seen_date";
    var todayStr = function () {
        return new Date().toISOString().slice(0, 10);
    };
    var seenToday = function () {
        try {
            return localStorage.getItem(STORAGE_KEY) === todayStr();
        } catch (e) {
            return false;
        }
    };
    var markSeenToday = function () {
        try {
            localStorage.setItem(STORAGE_KEY, todayStr());
        } catch (e) {}
    };

    function fadeIn(el, displayValue) {
        el.style.display = displayValue;
        requestAnimationFrame(function () {
            el.classList.add("is-visible");
        });
    }

    function fadeOut(el, after) {
        el.classList.remove("is-visible");
        setTimeout(function () {
            el.style.display = "none";
            if (after) after();
        }, 550);
    }

    function preventTouchMove(e) {
        e.preventDefault();
    }

    function lockScroll() {
        document.documentElement.classList.add("no-scroll");
        document.addEventListener("touchmove", preventTouchMove, {
            passive: false
        });
    }

    function unlockScroll() {
        document.documentElement.classList.remove("no-scroll");
        document.removeEventListener("touchmove", preventTouchMove, {
            passive: false
        });
    }

    lockScroll();

    if (document.documentElement.classList.contains("skip-intro")) {
        unlockScroll();
        setTimeout(function () {
            showMain();
        }, 550);
    }

    var safetyTimer = null;

    function playIntro() {
        lockScroll();
        fadeIn(movieWrap, "flex");
        video.currentTime = 0;
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(function () {
                finishIntro();
            });
        }
    }

    function finishIntro() {
        clearTimeout(safetyTimer);
        markSeenToday();
        fadeOut(movieWrap, function () {
            fadeIn(firstview, "block");
            unlockScroll();
            setTimeout(function () {
                showMain();
            }, 550);
        });
    }

    video.addEventListener("loadedmetadata", function () {
        clearTimeout(safetyTimer);
        var duration = isFinite(video.duration) ? video.duration : 15;
        safetyTimer = setTimeout(finishIntro, (duration + 1) * 1000);
    });
    video.addEventListener("ended", finishIntro);
    video.addEventListener("error", finishIntro);
    skipBtn.addEventListener("click", finishIntro);

    replayBtn.addEventListener("click", function () {
        document.documentElement.classList.remove("intro-done");
        fadeOut(firstview, playIntro);
    });

    function createBubbles() {
        var layer = document.getElementById("bubbleLayer");
        if (!layer) return;
        for (var i = 0; i < 7; i++) {
            var b = document.createElement("span");
            b.className = "bubble";
            var size = 6 + Math.random() * 14;
            b.style.width = b.style.height = size + "px";
            b.style.left = Math.random() * 100 + "%";
            b.style.animationDuration = (5 + Math.random() * 5) + "s";
            b.style.animationDelay = (Math.random() * 5) + "s";
            layer.appendChild(b);
        }
    }

    window.addEventListener("load", function () {
        if (document.documentElement.classList.contains("skip-intro")) return;
        createBubbles();
        var minDelay = new Promise(function (res) {
            setTimeout(res, 1300);
        });
        minDelay.then(function () {
            fadeOut(loading, function () {
                if (seenToday()) {
                    fadeIn(firstview, "block");
                    unlockScroll();
                    setTimeout(function () {
                        showMain();
                    }, 550);
                } else {
                    playIntro();
                }
            });
        });
    });
})();

/* ================================================
   ハンバーガーメニュー
================================================ */
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

    // ボタンでトグル
    btn.addEventListener('click', function () {
        btn.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });

    // ドロワー内のリンクをクリックしたら閉じて同一ページ内スクロール
    drawer.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(link.getAttribute('href'));
            closeDrawer();
            if (target) {
                // ドロワーのフェードアウト後にスクロール
                setTimeout(function () {
                    var headerH = document.querySelector('.header') ?
                        document.querySelector('.header').offsetHeight : 0;
                    var top = target.getBoundingClientRect().top +
                        window.scrollY - headerH;
                    window.scrollTo({
                        top: top,
                        behavior: 'smooth'
                    });
                }, 350);
            }
        });
    });

    // ドロワー背景クリックで閉じる
    drawer.addEventListener('click', function (e) {
        if (e.target === drawer) closeDrawer();
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDrawer();
    });
})();

/* ================================================
   サステナビリティ ブラースクロール
================================================ */
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

    window.addEventListener('scroll', onScroll, {
        passive: true
    });
    onScroll();
})();

(function () {
    "use strict";

    /* =========================================================
       (A) 背景ぼかしのフォールバック
       ========================================================= */
    (function setupBlurFallback() {
        const overlay = document.querySelector("[data-scroll-blur]");
        if (!overlay) return;

        // ぼかしは装飾。OS の「動きを減らす」設定が有効なら、ぼかしを完全に
        // 無効化しリスナーを張らない（背景は CSS 側で blur(0) に固定される）。
        const reduceMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        // CSS の animation-timeline: scroll() が使える環境では CSS に任せ、
        // JS は何もしない（二重駆動の防止）。判定キーは CSS の @supports と一致。
        // CSS.supports 自体が無い極めて古い環境では JS フォールバックへ進む。
        const cssDriven =
            typeof window.CSS !== "undefined" &&
            typeof window.CSS.supports === "function" &&
            window.CSS.supports("animation-timeline", "scroll()");
        if (cssDriven) return;

        // ---- ここから JS フォールバック（animation-timeline 非対応環境）----

        const root = document.documentElement;

        // ぼかしの最大強度（px）。:root の --blur-max から読み取り、CSS の
        // scroll() 経路と同じ振れ幅にする。取れない／不正なら 20px。
        function readMaxBlur() {
            const raw = getComputedStyle(root).getPropertyValue("--blur-max").trim();
            const value = parseFloat(raw);
            return Number.isFinite(value) && value >= 0 ? value : 20;
        }

        let maxBlur = readMaxBlur();

        // 多重 rAF 予約を防ぐフラグ。scroll が連続発火しても、
        // 1 フレームにつき更新は 1 回だけにする。
        let ticking = false;

        /**
         * 先頭ビューポートのスクロール進捗（0〜1）を計算する。
         * 進捗 = scrollTop / viewportHeight をクランプ。
         * 先頭の 1 画面分をスクロールし切った時点で 1（＝ぼかし最大）になる。
         * CSS の animation-range: 0 100vh と対応させる。
         * @returns {number} 0〜1 にクランプした進捗
         */
        function getProgress() {
            const scrollTop = window.scrollY || root.scrollTop || 0;
            const viewportH = window.innerHeight || root.clientHeight || 0;

            // 0 除算ガード: ビューポート高が取れない場合は進捗 0。
            if (viewportH <= 0) return 0;

            const ratio = scrollTop / viewportH;
            if (ratio < 0) return 0;
            if (ratio > 1) return 1;
            return ratio;
        }

        /**
         * 進捗からぼかし量を求め、--blur-amount（px）へ反映する。
         * 見た目（backdrop-filter）の適用は CSS 側（--blur-amount を読む）に委ねる。
         */
        function update() {
            const amount = getProgress() * maxBlur;
            overlay.style.setProperty("--blur-amount", amount.toFixed(2) + "px");
            ticking = false;
        }

        /**
         * scroll / resize ハンドラ。計算自体は rAF に遅延させ、
         * フレーム同期で 1 回だけ update を走らせる（rAF スロットル）。
         */
        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }

        // resize ではビューポート高とトークン値が変わり得るため、最大ぼかしを
        // 読み直してから再計算する。
        function onResize() {
            maxBlur = readMaxBlur();
            onScroll();
        }

        // 初期表示時にも一度反映しておく（リロード時にスクロール位置が
        // 途中だった場合に、最初から正しいぼかし量を見せる）。
        update();

        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        window.addEventListener("resize", onResize, {
            passive: true
        });
    })();

    /* =========================================================
       (B) 第2セクションのフェードイン（IO ワンショット）
       ビューポート進入で一度だけ表示する。一度表示したら unobserve する。
       ========================================================= */
    (function setupFadeIn() {
        const targets = document.querySelectorAll("[data-fade-in]");
        if (targets.length === 0) return;

        /**
         * 1要素を最終状態（表示）にする。
         * @param {HTMLElement} el - 対象要素
         */
        function reveal(el) {
            el.classList.add("is-visible");
        }

        // IntersectionObserver 非対応環境のフォールバック:
        // 監視せず、全要素を即時に表示状態にする（隠れたまま残るのを防ぐ）。
        if (!("IntersectionObserver" in window)) {
            targets.forEach(function (el) {
                reveal(el);
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;

                    reveal(entry.target);

                    // ワンショット表示: 一度表示したら監視を解除する。
                    // 再交差時の多重発火を防ぎ、不要な監視も止める。
                    obs.unobserve(entry.target);
                });
            }, {
                threshold: 0.15,
                rootMargin: "0px 0px -10% 0px",
            }
        );

        targets.forEach(function (el) {
            observer.observe(el);
        });
    })();
})();

/* ================================================
   ページトップボタン（jQuery）
================================================ */
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
    $('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;
});
