<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import portrait from '../../../potato_pfp.jpg'
import { useScrollScene } from '../composables/useScrollScene'
import { useAnchorScroll } from '../composables/useAnchorScroll'
import { videoCount } from '../data/videos'

const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const { scrollToAnchor } = useAnchorScroll()
useScrollScene(root, () => {
  const scene = root.value!
  scene.classList.add('scroll-scene')
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scene, start: 'top top', end: 'bottom bottom',
      scrub: .35, invalidateOnRefresh: true,
    },
  })
  timeline
    .fromTo('.portrait', { xPercent: -50, yPercent: -50, x: 0, scale: 1, y: 0 },
      { scale: .42, y: () => -stage.value!.clientHeight * .14, duration: .7 }, 0)
    .fromTo('.scroll-cue', { autoAlpha: 1 }, { autoAlpha: 0, duration: .15 }, 0)
    .fromTo('.hero-title', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: .35 }, .3)
    .fromTo('.subtitle', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .25 }, .55)
    .fromTo('.hero-bottom', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .2 }, .65)
    .to({}, { duration: .15 }, .85)
  return () => scene.classList.remove('scroll-scene')
})
</script>

<template>
  <header id="hero" ref="root">
    <div class="hero-stage" ref="stage">
      <h1 class="hero-title">WHITE POTATO</h1>
      <img class="portrait" :src="portrait" width="512" height="512"
        alt="白土豆老师的手绘土豆头像" fetchpriority="high" />
      <h2 class="subtitle">精选作品集</h2>
      <div class="hero-bottom">
        <p>把喜欢的瞬间，留在这里。</p>
        <a href="#gallery" @click="scrollToAnchor">浏览 {{ videoCount }} 部精选作品 <span aria-hidden="true">↓</span></a>
      </div>
      <p class="scroll-cue" aria-hidden="true">向下滚动，让故事展开 <span>↓</span></p>
    </div>
  </header>
</template>

<style scoped>
#hero { position: relative; text-align: center; }
.hero-stage { position: relative; height: min(100svh, 820px); min-height: 420px; overflow: clip; }
.scroll-scene { height: 190svh; }
.scroll-scene .hero-stage { position: sticky; top: 0; height: 100svh; min-height: 0; }
.portrait { position: absolute; left: 50%; top: 36%; width: min(88vw, 80svh, 720px); height: auto; transform: translate(-50%, -50%) scale(.42); }
.scroll-scene .portrait { top: 50%; will-change: transform; }
.hero-title { position: absolute; top: 12%; left: 0; width: 100%; margin: 0; padding: 0 20px; font: 400 clamp(28px, 6.5vw, 76px)/1.1 var(--brand); letter-spacing: -.035em; z-index: 1; }
.subtitle { position: absolute; top: 57%; left: 0; width: 100%; margin: 0; font: 800 clamp(26px, 4.4vw, 52px)/1.3 var(--sans); letter-spacing: .3em; text-indent: .3em; }
.hero-bottom { position: absolute; top: 70%; left: 0; width: 100%; padding: 0 24px; }
.hero-bottom p { font: 16px/1.8 var(--serif); color: var(--ink-soft); margin: 0 0 18px; }
.hero-bottom a { display: inline-block; padding: 10px 4px; border-bottom: 1px solid var(--line); font-size: 13px; text-decoration: none; }
.hero-bottom span { margin-left: 18px; color: var(--green); }
.scroll-cue { display: none; position: absolute; bottom: 5%; left: 0; width: 100%; margin: 0; color: var(--muted); font-size: 11px; letter-spacing: .12em; }
.scroll-cue span { display: block; margin-top: 10px; font-size: 20px; }
.scroll-scene .scroll-cue { display: block; }
@media(max-height: 500px) { .hero-title { font-size: clamp(26px, 8svh, 46px); } .subtitle { font-size: 24px; } .hero-bottom p { margin-bottom: 0; font-size: 13px; } .hero-bottom a { padding-block: 6px; } }
</style>
