<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion, isSnap } from '../composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const sectionEl = ref<HTMLElement | null>(null)
const pinEl = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  const still = prefersReducedMotion() || isSnap()
  if (still) return
  sectionEl.value?.classList.add('scrub')

  ctx = gsap.context((self) => {
    const lines = self.selector!('.line')
    gsap.set(lines, { opacity: 0, y: 26 })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl.value!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })
      // 三行文案顺次揭示（滚动可逆）
      .to(lines[0], { opacity: 1, y: 0, ease: 'none' }, 0.05)
      .to(lines[1], { opacity: 1, y: 0, ease: 'none' }, 0.35)
      .to(lines[2], { opacity: 1, y: 0, ease: 'none' }, 0.65)
      // 背景随“发芽”渐渐染上一丝嫩芽绿
      .to(pinEl.value!, { backgroundColor: 'rgba(63,143,74,0.06)', ease: 'none' }, 0)
  }, sectionEl.value!)
})

onUnmounted(() => ctx?.revert())
</script>

<template>
  <section class="manifesto" ref="sectionEl">
    <div class="pin" ref="pinEl">
      <p class="line line1">01bit 的数据，承载精神的<em>永恒</em></p>
      <p class="line line2">白色土豆，将在<em>赛博梦境</em>中</p>
      <p class="line line3">生根 · 发芽 <span class="sprout">🌱</span></p>
    </div>
  </section>
</template>

<style scoped>
.manifesto { position: relative; }
/* 动画模式下拉长滚动行程并钉住 */
.manifesto.scrub { height: 280vh; }

.pin {
  position: sticky;
  top: 0;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 2.4vh, 26px);
  padding: 10vh 24px;
  text-align: center;
}
/* 非动画模式：正常流、内容可见、紧凑 */
.manifesto:not(.scrub) .pin { position: static; min-height: auto; padding: 14vh 24px; }

.line {
  margin: 0;
  font-family: var(--serif);
  font-size: clamp(1.4rem, 4.4vw, 2.8rem);
  line-height: 1.5;
  color: var(--ink);
  letter-spacing: 0.02em;
}
.line em { font-style: italic; color: var(--brown-deep); }
.line3 { font-family: var(--sans); font-weight: 500; letter-spacing: 0.1em; }
.line3 .sprout { color: var(--green); }
</style>
