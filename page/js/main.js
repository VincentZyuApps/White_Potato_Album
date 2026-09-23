/* =========================================================
   画廊渲染 + 灯箱播放
   数据来源：assets/videos.json
   视频源：GitHub release 直链（不占仓库体积）
   ========================================================= */
(function () {
  "use strict";

  const grid = document.getElementById("grid");
  const status = document.getElementById("grid-status");
  const countEl = document.getElementById("video-count");

  let videos = [];

  const PLAY_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';

  function fmtDuration(sec) {
    if (!sec || typeof sec !== "number") return "";
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  /* ---------- 渲染卡片 ---------- */
  function render() {
    const frag = document.createDocumentFragment();
    videos.forEach((v, i) => {
      const card = document.createElement("button");
      card.className = "card";
      card.type = "button";
      card.setAttribute("role", "listitem");
      card.dataset.index = i;
      card.setAttribute("aria-label", "播放 " + v.title);

      const dur = fmtDuration(v.duration);
      card.innerHTML =
        '<div class="thumb">' +
          '<img src="' + v.cover + '" alt="' + escapeHtml(v.title) + ' 封面" loading="lazy" decoding="async" />' +
          '<span class="play" aria-hidden="true">' + PLAY_ICON + "</span>" +
          (dur ? '<span class="dur">' + dur + "</span>" : "") +
        "</div>" +
        '<div class="meta">' +
          '<span class="title">' + escapeHtml(v.title) + "</span>" +
          '<span class="badge">AV</span>' +
        "</div>";

      frag.appendChild(card);
    });
    grid.appendChild(frag);
    if (countEl) countEl.textContent = String(videos.length);
    revealOnScroll();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- 滚动进场 ---------- */
  function revealOnScroll() {
    const cards = grid.querySelectorAll(".card");
    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          const idx = Number(el.dataset.index) || 0;
          el.style.transitionDelay = (idx % 4) * 0.06 + "s";
          el.classList.add("in");
          obs.unobserve(el);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    cards.forEach((c) => io.observe(c));
  }

  /* ---------- 灯箱 ---------- */
  const lb = document.getElementById("lightbox");
  const lbVideo = lb.querySelector(".lb-video");
  const lbTitle = lb.querySelector(".lb-title");
  const btnClose = lb.querySelector(".lb-close");
  const btnPrev = lb.querySelector(".lb-prev");
  const btnNext = lb.querySelector(".lb-next");
  let current = -1;
  let lastFocused = null;

  function openAt(index) {
    if (index < 0 || index >= videos.length) return;
    current = index;
    const v = videos[index];
    lbVideo.src = v.src;
    lbVideo.currentTime = 0;
    lbTitle.textContent = v.title + "  ·  " + fmtDuration(v.duration);
    lb.hidden = false;
    lb.setAttribute("aria-hidden", "false");
    lastFocused = document.activeElement;
    // 触发过渡
    requestAnimationFrame(() => lb.classList.add("open"));
    document.body.style.overflow = "hidden";
    const p = lbVideo.play();
    if (p && p.catch) p.catch(() => {}); // 自动播放被拦截则等用户手动点
    btnClose.focus();
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbVideo.pause();
    const done = () => {
      lb.hidden = true;
      lb.setAttribute("aria-hidden", "true");
      lbVideo.removeAttribute("src");
      lbVideo.load(); // 停止后台下载
      lb.removeEventListener("transitionend", done);
    };
    lb.addEventListener("transitionend", done);
    setTimeout(done, 320); // 兜底
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    current = -1;
  }

  function step(delta) {
    if (current < 0) return;
    const next = (current + delta + videos.length) % videos.length;
    openAt(next);
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    openAt(Number(card.dataset.index));
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => step(-1));
  btnNext.addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  /* ---------- 加载数据 ---------- */
  fetch("assets/videos.json", { cache: "no-cache" })
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then((data) => {
      videos = (data && data.videos) || [];
      if (!videos.length) throw new Error("empty");
      render();
    })
    .catch((err) => {
      console.error("加载 videos.json 失败：", err);
      if (status) {
        status.hidden = false;
        status.textContent = "作品列表加载失败，请稍后重试。";
      }
    });
})();
