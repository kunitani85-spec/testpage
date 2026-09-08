/* ================================================
   common/js/site-parallax.js
   [data-parallax] 要素をスクロールに応じて
   ゆるやかに縦シフトさせる軽量パララックス
================================================ */
(function () {
    "use strict";

    var layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (!layers.length) return;

    var reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var ticking = false;

    function update() {
        var viewportH = window.innerHeight;

        layers.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > viewportH) return;

            var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
            var center = rect.top + rect.height / 2 - viewportH / 2;
            var offset = center * speed * -1;
            el.style.transform = "translate3d(0, " + offset.toFixed(1) + "px, 0)";
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();
