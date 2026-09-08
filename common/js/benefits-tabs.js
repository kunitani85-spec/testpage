/* ================================================
   common/js/benefits-tabs.js
   採用サイト「EMPLOYEE BENEFITS」タブ切り替え
================================================ */
(function () {
    "use strict";

    var tabs = document.querySelectorAll(".benefits-tab");
    var panels = document.querySelectorAll(".benefits-panel");

    if (!tabs.length) return;

    tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t, i) {
                t.classList.toggle("is-active", i === index);
            });
            panels.forEach(function (p, i) {
                p.classList.toggle("is-active", i === index);
            });
        });
    });
})();
