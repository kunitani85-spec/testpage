/* ================================================
   common/js/interview-slider.js
   採用サイト「社員インタビュー」カードスライダー
================================================ */
(function () {
    "use strict";

    var track = document.getElementById("interviewTrack");
    var prevBtn = document.getElementById("interviewPrev");
    var nextBtn = document.getElementById("interviewNext");

    if (!track || !prevBtn || !nextBtn) return;

    var cards = Array.prototype.slice.call(track.children);
    var current = 0;

    function getVisibleCount() {
        var w = window.innerWidth;
        if (w <= 560) return 1;
        if (w <= 900) return 2;
        return 3;
    }

    function update() {
        var visibleCount = getVisibleCount();
        var maxIndex = Math.max(cards.length - visibleCount, 0);
        current = Math.min(current, maxIndex);

        var style = getComputedStyle(track);
        var gap = parseFloat(style.columnGap || style.gap || 0);
        var step = cards[0].getBoundingClientRect().width + gap;

        track.style.transform = "translateX(" + (-current * step) + "px)";
        prevBtn.disabled = current <= 0;
        nextBtn.disabled = current >= maxIndex;
    }

    nextBtn.addEventListener("click", function () {
        var visibleCount = getVisibleCount();
        var maxIndex = Math.max(cards.length - visibleCount, 0);
        current = Math.min(current + visibleCount, maxIndex);
        update();
    });

    prevBtn.addEventListener("click", function () {
        var visibleCount = getVisibleCount();
        current = Math.max(current - visibleCount, 0);
        update();
    });

    window.addEventListener("resize", update);
    update();
})();
