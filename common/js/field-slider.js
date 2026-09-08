/* ================================================
   common/js/field-slider.js
   採用サイト「職種紹介」自動スライドショー
================================================ */
(function () {
    "use strict";

    var photos = document.querySelectorAll(".field-fish__photo");
    var infoSlides = document.querySelectorAll(".field-info__slide");
    var dots = document.querySelectorAll(".field-dot");
    var cards = document.querySelectorAll(".field-card");
    var prevBtn = document.querySelector(".field-arrow--prev");
    var nextBtn = document.querySelector(".field-arrow--next");

    if (!photos.length) return;

    var total = photos.length;
    var current = 0;
    var AUTOPLAY_MS = 4500;
    var timer = null;

    function show(index) {
        current = (index + total) % total;

        photos.forEach(function (el, i) {
            el.classList.toggle("is-active", i === current);
        });
        infoSlides.forEach(function (el, i) {
            el.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (el, i) {
            el.classList.toggle("is-active", i === current);
        });
        cards.forEach(function (el) {
            var targetIndex = parseInt(el.getAttribute("data-index"), 10);
            el.classList.toggle("is-active", targetIndex === current);
        });
    }

    function next() {
        show(current + 1);
    }

    function prev() {
        show(current - 1);
    }

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

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            next();
            restartAutoplay();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            prev();
            restartAutoplay();
        });
    }
    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            show(i);
            restartAutoplay();
        });
    });
    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            var targetIndex = parseInt(card.getAttribute("data-index"), 10);
            show(targetIndex);
            restartAutoplay();
        });
    });

    var section = document.querySelector(".field-section");
    if (section) {
        section.addEventListener("mouseenter", stopAutoplay);
        section.addEventListener("mouseleave", startAutoplay);
    }

    var reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    show(0);
    if (!reduceMotion) startAutoplay();
})();
