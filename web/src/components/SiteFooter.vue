<script setup lang="ts">
import portrait from '../../../potato_pfp.jpg'
</script>

<template>
  <footer id="footer">
    <div class="footer-mark"><img :src="portrait" alt="白土豆" width="72" height="72" loading="lazy" /></div>
    <nav class="footer-links">
      <a href="https://www.bilibili.com/video/BV1j34y1P75b" target="_blank" rel="noopener">哔哩哔哩</a>
      <a href="https://www.aliyundrive.com/s/Drjre6JSVVb" target="_blank" rel="noopener">阿里云盘</a>
      <a href="https://pan.baidu.com/s/1a-wWZOzsgAQ2FFJJcPvpKQ?pwd=wtpt" target="_blank" rel="noopener">百度网盘</a>
      <a href="https://github.com/VincentZyuApps/White_Potato_Album" target="_blank" rel="noopener">GitHub</a>
    </nav>
    <p class="footer-tagline">白色土豆将在赛博梦境中生根发芽</p>
    <p class="footer-copy">WHITE POTATO · 歪特破特抖</p>
  </footer>
</template>

<style scoped>
#footer {
  position: relative;
  z-index: 1;
  background: var(--paper);
  border-top: 1px solid var(--line);
  text-align: center;
  padding: 54px 24px 60px;
  margin-top: 30px;
}
.footer-mark { line-height: 0; margin-bottom: 14px; }
.footer-links {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 10px 26px; margin-bottom: 20px;
}
.footer-links a {
  text-decoration: none; color: var(--ink-soft);
  font-size: 0.92rem; position: relative; padding-bottom: 3px;
  transition: color .2s;
}
.footer-links a::after {
  content: ""; position: absolute; left: 0; right: 100%; bottom: 0;
  height: 1.5px; background: var(--green); transition: right .25s ease;
}
.footer-links a:hover { color: var(--green-deep); }
.footer-links a:hover::after { right: 0; }
.footer-tagline {
  font-family: var(--serif); font-style: italic; color: var(--ink-soft); margin: 0 0 6px;
}
.footer-copy {
  font-family: var(--serif); letter-spacing: 0.18em; color: var(--muted);
  font-size: 0.8rem; margin: 0;
}
</style>
