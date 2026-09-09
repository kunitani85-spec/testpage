/* ================================================
   common/js/loop-marquee.js
   About セクションの写真ループを、画面幅に関わらず
   常に隙間なく埋まるように動的に複製する
================================================ */
(function () {
    "use strict";

    var track = document.getElementById("raboutLoopTrack");
    if (!track) return;

    var originalSet = track.querySelector(".rabout-loop__set");
    if (!originalSet) return;

    function build() {
        Array.prototype.slice.call(track.querySelectorAll(".rabout-loop__set")).forEach(function (set, i) {
            if (i > 0) set.remove();
        });

        var trackGap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
        var setWidth = originalSet.getBoundingClientRect().width + trackGap;
        if (!setWidth) return;

        track.style.setProperty("--loop-shift", setWidth + "px");

        var containerWidth = track.parentElement.clientWidth;
        var minWidth = containerWidth * 2 + setWidth;
        var currentWidth = setWidth;

        while (currentWidth < minWidth) {
            track.appendChild(originalSet.cloneNode(true));
            currentWidth += setWidth;
        }
    }

    var images = track.querySelectorAll("img");
    var loaded = 0;
    images.forEach(function (img) {
        if (img.complete) {
            loaded++;
        } else {
            img.addEventListener("load", function () {
                loaded++;
                if (loaded === images.length) build();
            });
        }
    });
    if (loaded === images.length) build();

    var resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 200);
    });
})();
