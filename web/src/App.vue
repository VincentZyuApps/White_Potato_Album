<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import BinaryRain from './components/BinaryRain.vue'
import HeroIntro from './components/HeroIntro.vue'
import Manifesto from './components/Manifesto.vue'
import Gallery from './components/Gallery.vue'
import SiteFooter from './components/SiteFooter.vue'
import { prefersReducedMotion, isSnap } from './composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let tickerFn: ((t: number) => void) | null = null

onMounted(() => {
  if (prefersReducedMotion() || isSnap()) return

  // 平滑惯性滚动，并驱动 ScrollTrigger
  lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  tickerFn = (t: number) => lenis?.raf(t * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  // 全局：随滚动把纸底色从纯白渗入一丝暖白（发芽感，可逆）
  gsap.to(document.documentElement, {
    '--page-bg': '#f6f8f3',
    ease: 'none',
    scrollTrigger: { start: 'top top', end: 'max', scrub: true },
  })
})

onUnmounted(() => {
  if (tickerFn) gsap.ticker.remove(tickerFn)
  lenis?.destroy()
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <BinaryRain />
  <HeroIntro />
  <Manifesto />
  <Gallery />
  <SiteFooter />
</template>
