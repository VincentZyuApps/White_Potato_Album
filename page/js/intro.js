/* =========================================================
   开篇动画（复刻 manim Potato_Bili_Cover_Intro）
   - 逐字写出 WHITE POTATO（对应 manim 的 Write）
   - 土豆轮廓描边 draw-on、嫩芽生长、表情淡入
   - 整体轻微 zoom-out（对应镜头拉远）
   - 背景：赛博二进制雨
   ========================================================= */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // URL 带 ?snap 时跳过入场动画、直接呈现终态（便于截图/测试）
  const snap = /[?&]snap\b/.test(location.search);
  if (snap) document.documentElement.classList.add("snap");

  /* ---- 1. 拆分品牌名为逐字 span，并设置 stagger 延时 ---- */
  const brand = document.querySelector(".brand");
  if (brand) {
    const text = brand.getAttribute("data-text") || brand.textContent;
    brand.textContent = "";
    let visibleIndex = 0;
    for (const ch of text) {
      const span = document.createElement("span");
      if (ch === " ") {
        span.className = "ch space";
        span.innerHTML = "&nbsp;";
      } else {
        span.className = "ch";
        span.textContent = ch;
        span.style.animationDelay = (0.4 + visibleIndex * 0.075) + "s";
        visibleIndex++;
      }
      brand.appendChild(span);
    }
  }

  /* ---- 2. 触发播放：加 .play 类启动 CSS 时间线 ---- */
  const heroInner = document.querySelector(".hero-inner");
  function play() {
    if (heroInner) heroInner.classList.add("play");
  }
  if (reduce || snap) {
    // 终态由 CSS（reduced-motion / .snap）直接给出，不加 .play、不跑动画
  } else if (document.fonts && document.fonts.ready) {
    // 尽量等字体就绪，避免字形跳动
    Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 800)),
    ]).then(() => requestAnimationFrame(play));
  } else {
    window.addEventListener("load", play, { once: true });
  }

  /* ---- 3. 背景二进制雨 ---- */
  if (!reduce && !snap) initBinaryRain();

  function initBinaryRain() {
    const canvas = document.getElementById("binary-rain");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, cols, drops, fontSize, dpr;
    let running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = w < 560 ? 14 : 18;
      cols = Math.ceil(w / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -50);
    }
    resize();
    window.addEventListener("resize", resize);

    // 只在英雄区可见时绘制，滚走后暂停省电
    const hero = document.getElementById("hero");
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        running = entries[0].isIntersecting;
        if (running) tick();
      }).observe(hero);
    }

    let last = 0;
    function tick(ts) {
      if (!running) return;
      if (!ts) ts = 0;
      if (ts - last > 70) {         // ~14fps，慢速下落更有梦感
        last = ts;
        ctx.clearRect(0, 0, w, h);
        ctx.font = fontSize + "px 'Courier New', monospace";
        for (let i = 0; i < cols; i++) {
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          const ch = Math.random() > 0.5 ? "0" : "1";
          // 头部略深，尾部更淡，营造拖尾
          ctx.fillStyle = "rgba(169,120,79,0.28)";   // 头：土豆棕
          ctx.fillText(ch, x, y);
          ctx.fillStyle = "rgba(63,143,74,0.10)";     // 上一格：嫩芽绿微光
          ctx.fillText(Math.random() > 0.5 ? "0" : "1", x, y - fontSize);
          if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -20;
          drops[i] += 0.5;
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
