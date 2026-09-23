<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { prefersReducedMotion, isSnap } from '../composables/useReducedMotion'

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let cleanup: (() => void) | null = null

onMounted(() => {
  if (prefersReducedMotion() || isSnap()) return
  const cv = canvas.value
  if (!cv) return
  const ctx = cv.getContext('2d')
  if (!ctx) return

  let w = 0, h = 0, cols = 0, fontSize = 18
  let drops: number[] = []
  let dpr = 1

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    cv!.width = Math.floor(w * dpr)
    cv!.height = Math.floor(h * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    fontSize = w < 560 ? 14 : 18
    cols = Math.ceil(w / fontSize)
    drops = new Array(cols).fill(0).map(() => Math.random() * -50)
  }
  resize()
  window.addEventListener('resize', resize)

  let last = 0
  function tick(ts: number) {
    if (ts - last > 70) {
      last = ts
      ctx!.clearRect(0, 0, w, h)
      ctx!.font = `${fontSize}px 'Courier New', monospace`
      for (let i = 0; i < cols; i++) {
        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx!.fillStyle = 'rgba(169,120,79,0.26)'
        ctx!.fillText(Math.random() > 0.5 ? '0' : '1', x, y)
        ctx!.fillStyle = 'rgba(63,143,74,0.10)'
        ctx!.fillText(Math.random() > 0.5 ? '0' : '1', x, y - fontSize)
        if (y > h && Math.random() > 0.975) drops[i] = Math.random() * -20
        drops[i] += 0.5
      }
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  cleanup = () => window.removeEventListener('resize', resize)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  cleanup?.()
})
</script>

<template>
  <canvas ref="canvas" class="binary-rain" aria-hidden="true"></canvas>
</template>

<style scoped>
.binary-rain {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
}
@media (prefers-reduced-motion: reduce) {
  .binary-rain { display: none; }
}
</style>
