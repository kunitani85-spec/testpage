/* ================================================
   common/js/business.js
   事業内容ページ専用: OUR ORIGIN / AQUACULTURE の
   切り替えアコーディオン
================================================ */
(function () {
    "use strict";

    var cards = document.querySelectorAll(".biz-origin__card");
    if (!cards.length) return;

    function activate(targetCard) {
        cards.forEach(function (card) {
            var isActive = card === targetCard;
            card.classList.toggle("is-active", isActive);
            var head = card.querySelector(".biz-origin__head");
            if (head) head.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
    }

    cards.forEach(function (card) {
        var head = card.querySelector(".biz-origin__head");
        if (!head) return;
        head.addEventListener("click", function () {
            if (card.classList.contains("is-active")) return;
            activate(card);
        });
    });
})();
