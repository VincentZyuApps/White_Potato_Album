<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { useScrollScene } from '../composables/useScrollScene'
const root = ref<HTMLElement | null>(null)
useScrollScene(root, () => {
    gsap.fromTo('.line', { y: 12, opacity: .65 }, {
      y: 0, opacity: 1, stagger: .12, ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top 95%', end: 'top 55%', scrub: true },
    })
    gsap.fromTo('.stem', { scaleY: .35 }, { scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top 95%', end: 'bottom 55%', scrub: true } })
})
</script>
<template>
  <section class="manifesto" ref="root" aria-label="关于这份作品集">
    <span class="annotation">A SMALL ARCHIVE<br />OF LASTING MOMENTS</span>
    <div class="poem">
      <p class="line">01bit 的数据，承载精神的<em>永恒。</em></p>
      <p class="line">白色土豆将在赛博梦境中，<em>生根发芽。</em></p>
    </div>
    <span class="stem" aria-hidden="true"></span>
  </section>
</template>
<style scoped>
.manifesto { max-width: 1200px; margin: auto; padding: 38px 24px; display: grid; grid-template-columns: 1fr 3fr 24px; align-items: center; gap: 24px; }
.annotation { font: 10px/1.8 var(--sans); letter-spacing: .12em; color: var(--muted); }
.poem { font-family: var(--serif); font-size: clamp(15px, 2vw, 24px); line-height: 1.9; }
.line { margin: 0; }
em { color: var(--green-deep); font-style: normal; }
.stem { width: 1px; height: 64px; background: var(--green); transform-origin: bottom; }
@media(max-width: 650px) { .manifesto { grid-template-columns: 1fr 12px; padding-block: 28px; gap: 12px; } .annotation { display: none; } }
</style>
