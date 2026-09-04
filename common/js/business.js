/* ================================================
   common/js/business.js
   事業内容ページ専用: OUR ORIGIN / AQUACULTURE の
   切り替えアコーディオン

   初期状態: 50%:50% で「×」区切りを表示。
   どちらかをクリックすると、そのカードが100%に広がり
   「×」ともう片方のカードは非表示になる。
   「戻る」ボタンで初期状態(50%:50%、×表示)に戻す。
================================================ */
(function () {
    "use strict";

    var row = document.getElementById("originRow");
    var cards = document.querySelectorAll(".biz-origin__card");
    if (!row || !cards.length) return;

    function activate(targetCard) {
        cards.forEach(function (card) {
            var isActive = card === targetCard;
            card.classList.toggle("is-active", isActive);
            var head = card.querySelector(".biz-origin__head");
            if (head) head.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
        row.classList.add("is-expanded");
    }

    function reset() {
        cards.forEach(function (card) {
            card.classList.remove("is-active");
            var head = card.querySelector(".biz-origin__head");
            if (head) head.setAttribute("aria-expanded", "false");
        });
        row.classList.remove("is-expanded");
    }

    cards.forEach(function (card) {
        var head = card.querySelector(".biz-origin__head");
        if (head) {
            head.addEventListener("click", function () {
                activate(card);
            });
        }
        var backBtn = card.querySelector(".biz-origin__back");
        if (backBtn) {
            backBtn.addEventListener("click", function () {
                reset();
                row.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    });
})();
