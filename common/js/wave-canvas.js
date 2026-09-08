/* ================================================
   common/js/wave-canvas.js
   採用サイト RECRUIT セクション下部の波アニメーション
   (codepen "Waveform animation with canvas" を
    サイトの青系パレットに合わせて再実装)
================================================ */
(function () {
    "use strict";

    var canvas = document.getElementById("rwaveCanvas");
    if (!canvas || !canvas.getContext) return;

    var reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var ctx = canvas.getContext("2d");
    var colors = ["#2e9be0", "#1c7fc4", "#0f2350"];
    var t = 0;
    var unit = 100;
    var dpr = window.devicePixelRatio || 1;

    function resize() {
        var rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 140 * dpr;
        canvas.style.height = "140px";
    }

    function drawSine(zoom, delay) {
        var xAxis = Math.floor(canvas.height / 2);
        var x = t;
        var y = Math.sin(x) / zoom;
        ctx.moveTo(0, unit * y + xAxis);
        for (var i = 0; i <= canvas.width + 10; i += 10) {
            x = t + i / unit / zoom;
            y = Math.sin(x - delay) / 2.4;
            ctx.lineTo(i, unit * y + xAxis);
        }
    }

    function drawWave(color, alpha, zoom, delay) {
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        drawSine(zoom, delay);
        ctx.lineTo(canvas.width + 10, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWave(colors[0], 0.35, 3, 0);
        drawWave(colors[1], 0.5, 2, 250);
        drawWave(colors[2], 0.9, 1.6, 100);
    }

    var lastTime = null;

    function tick(now) {
        if (lastTime === null) lastTime = now;
        var elapsed = now - lastTime;
        lastTime = now;
        draw();
        t += (0.014 * Math.PI) * (elapsed / 35);
        requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize);
    resize();

    if (reduceMotion) {
        draw();
    } else {
        requestAnimationFrame(tick);
    }
})();
