/* ================================================
   common/js/interview-slider.js
   採用サイト「社員インタビュー」カードスライダー
   常に3枚(レスポンシブ時は2枚/1枚)表示され続ける
   無限ループ+自動再生カルーセル
================================================ */
(function () {
    "use strict";

    function init() {
        var track = document.getElementById("interviewTrack");
        var prevBtn = document.getElementById("interviewPrev");
        var nextBtn = document.getElementById("interviewNext");

        if (!track || !prevBtn || !nextBtn) return;

        var originalCards = Array.prototype.slice.call(track.children);
        var total = originalCards.length;
        if (!total) return;

        var AUTOPLAY_MS = 4000;
        var timer = null;
        var index = total;
        var reduceMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        originalCards.forEach(function (card) {
            track.appendChild(card.cloneNode(true));
        });
        originalCards.forEach(function (card) {
            track.insertBefore(card.cloneNode(true), track.firstChild);
        });

        var cards = Array.prototype.slice.call(track.children);

        function stepWidth() {
            var style = getComputedStyle(track);
            var gap = parseFloat(style.columnGap || style.gap || 0) || 0;
            return cards[0].getBoundingClientRect().width + gap;
        }

        function moveTo(newIndex, animate) {
            track.style.transition = animate ? "" : "none";
            track.style.transform = "translateX(" + (-newIndex * stepWidth()) + "px)";
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

        track.addEventListener("transitionend", settle);

        function next() {
            index += 1;
            moveTo(index, true);
        }

        function prev() {
            index -= 1;
            moveTo(index, true);
        }

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

        nextBtn.addEventListener("click", function () {
            next();
            restartAutoplay();
        });

        prevBtn.addEventListener("click", function () {
            prev();
            restartAutoplay();
        });

        var slider = track.closest(".rinterview-slider");
        if (slider) {
            slider.addEventListener("mouseenter", stopAutoplay);
            slider.addEventListener("mouseleave", startAutoplay);
        }

        window.addEventListener("resize", function () {
            moveTo(index, false);
        });

        moveTo(index, false);
        startAutoplay();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
