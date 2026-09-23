<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PotatoSvg from './PotatoSvg.vue'
import { prefersReducedMotion, isSnap } from '../composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const BRAND = 'WHITE POTATO'
const chars = BRAND.split('')

const heroEl = ref<HTMLElement | null>(null)
const innerEl = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  const still = prefersReducedMotion() || isSnap()
  if (still) return // 直接呈现 CSS 终态

  ctx = gsap.context((self) => {
    const q = self.selector!
    // 初始隐藏态
    gsap.set(q('.ch'), { yPercent: 60, opacity: 0 })
    gsap.set('.p-body', { strokeDasharray: 560, strokeDashoffset: 560 })
    gsap.set('.p-sprout', { transformOrigin: 'bottom right', scale: 0.1, opacity: 0 })
    gsap.set('.p-face', { opacity: 0 })
    gsap.set(['.subtitle', '.tagline', '.scroll-hint'], { y: 14, opacity: 0 })

    // 入场时间线（对应 manim 开篇）
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to('.ch', { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0.2)
      .to('.p-body', { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' }, 0.4)
      .to('.p-sprout', { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, 1.4)
      .to('.p-face', { opacity: 1, duration: 0.5 }, 1.7)
      .to('.subtitle', { y: 0, opacity: 1, duration: 0.7 }, 1.8)
      .to('.tagline', { y: 0, opacity: 1, duration: 0.8 }, 2.0)
      .to('.scroll-hint', { y: 0, opacity: 1, duration: 0.7 }, 2.3)

    // 滚动联动（可逆）：hero 滚出时内容视差上移+淡出，土豆略放大
    gsap.timeline({
      scrollTrigger: {
        trigger: heroEl.value!,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
      .to(innerEl.value!, { yPercent: -18, opacity: 0.15, ease: 'none' }, 0)
      .to(q('.potato-svg'), { scale: 1.18, ease: 'none' }, 0)
  }, heroEl.value!)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <header id="hero" ref="heroEl">
    <div class="hero-inner" ref="innerEl">
      <h1 class="brand" :aria-label="BRAND">
        <span
          v-for="(c, i) in chars"
          :key="i"
          class="ch"
          :class="{ space: c === ' ' }"
          aria-hidden="true"
        >{{ c === ' ' ? '\u00A0' : c }}</span>
      </h1>

      <div class="potato-mark">
        <PotatoSvg />
      </div>

      <p class="subtitle">精选作品集</p>
      <p class="tagline">
        01bit 的数据承载精神的永恒<span class="sep">·</span>白色土豆将在赛博梦境中生根发芽 🌱
      </p>

      <a class="scroll-hint" href="#gallery" aria-label="向下浏览作品">
        <span>SCROLL</span>
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </div>
  </header>
</template>

<style scoped>
#hero {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6vh 24px;
  text-align: center;
  overflow: hidden;
}
.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 2vw, 18px);
  width: 100%;
  max-width: 920px;
  padding-inline: 16px;
}
.brand {
  font-family: var(--serif);
  font-weight: 400;
  letter-spacing: 0.1em;
  font-size: clamp(2rem, 7vw, 4.4rem);
  margin: 0;
  color: var(--ink);
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-wrap: nowrap;
  max-width: 100%;
  white-space: nowrap;
}
.brand .ch { display: inline-block; }
.brand .ch.space { width: 0.4em; }

.potato-mark { line-height: 0; text-align: center; }

.subtitle {
  font-family: var(--sans);
  font-weight: 500;
  letter-spacing: 0.5em;
  text-indent: 0.5em;
  font-size: clamp(1.1rem, 3.6vw, 1.9rem);
  color: rgba(25, 24, 24, 0.72);
  margin: 0.2em 0 0;
}
.tagline {
  font-family: var(--serif);
  font-style: italic;
  color: var(--ink-soft);
  font-size: clamp(0.85rem, 2.4vw, 1.05rem);
  max-width: 34ch;
  margin: 0.3em 0 0;
}
.tagline .sep { color: var(--brown); margin: 0 0.5em; font-style: normal; }

.scroll-hint {
  margin-top: clamp(14px, 4vh, 40px);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}
.scroll-hint svg { animation: bob 1.8s ease-in-out infinite; }
@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

@media (prefers-reduced-motion: reduce) {
  .scroll-hint svg { animation: none; }
}
</style>

