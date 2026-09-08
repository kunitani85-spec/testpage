/* ================================================
   common/js/recruit-cta.js
   採用サイト「募集要項」ボタン⇔画像切り替え
================================================ */
(function () {
    "use strict";

    var buttons = document.querySelectorAll(".rrecruit-btn");
    var images = document.querySelectorAll(".rrecruit-image");

    if (!buttons.length) return;

    function setImage(target) {
        buttons.forEach(function (b) {
            b.classList.toggle("is-active", b.getAttribute("data-img") === target);
        });
        images.forEach(function (img) {
            img.classList.toggle("is-active", img.getAttribute("data-img") === target);
        });
    }

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            setImage(btn.getAttribute("data-img"));
        });
    });
})();
