<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import portrait from '../../../potato_pfp.jpg'
import { useScrollScene } from '../composables/useScrollScene'
import { videoCount } from '../data/videos'
const root = ref<HTMLElement | null>(null)
useScrollScene(root, () => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.portrait', { y: -36, rotation: -7, scale: .92, ease: 'none' }, 0)
      .to('.hero-title', { y: -18, ease: 'none' }, 0)
      .to('.hero-rule', { scaleX: .55, ease: 'none' }, 0)
})
</script>
<template>
  <header id="hero" ref="root">
    <p class="eyebrow">影像 · 音乐 · 记忆</p>
    <h1 class="hero-title">WHITE POTATO</h1>
    <div class="hero-art">
      <img class="portrait" :src="portrait" width="512" height="512" alt="白土豆老师的手绘土豆头像" fetchpriority="high" />
      <h2>精选作品集</h2>
    </div>
    <div class="hero-bottom">
      <p>把喜欢的瞬间，留在这里。</p>
      <a href="#gallery">探索 {{ videoCount }} 部作品 <span aria-hidden="true">↓</span></a>
    </div>
    <div class="hero-rule" aria-hidden="true"></div>
  </header>
</template>
<style scoped>
#hero { max-width: 1200px; margin: auto; padding: 28px 24px 0; text-align: center; }
.eyebrow { margin: 0 0 18px; font-size: 11px; letter-spacing: .32em; color: var(--muted); }
.hero-title { font-family: var(--brand); font-weight: 400; font-size: clamp(32px, 7.8vw, 100px); line-height: 1; letter-spacing: -.035em; margin: 0; }
.hero-art { position: relative; padding-bottom: 18px; }
.portrait { display: block; width: clamp(190px, 25vw, 285px); height: auto; margin: -4px auto 0; mix-blend-mode: multiply; }
h2 { position: relative; font-family: var(--sans); font-size: clamp(27px, 4.4vw, 52px); font-weight: 800; letter-spacing: .3em; text-indent: .3em; margin: -30px 0 0; transform: skewX(-8deg); }
.hero-bottom { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 22px 0; font-size: 13px; }
.hero-bottom p { font-family: var(--serif); color: var(--ink-soft); margin: 0; }
.hero-bottom a { text-decoration: none; }
.hero-bottom span { margin-left: 14px; color: var(--green); }
.hero-rule { height: 1px; background: var(--line); transform-origin: center; }
@media(max-width: 600px) { #hero { padding-top: 26px; } .hero-bottom { font-size: 11px; } .eyebrow { margin-bottom: 24px; } }
</style>
