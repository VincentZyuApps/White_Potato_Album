<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import cover from '../../../potato_bili_cover.png'
import gif from '../../../Potato_Bili_Cover_Final_Loop.gif?url'
import { singlePlayGif } from '../data/singlePlayGif'
import { prefersReducedMotion } from '../composables/useReducedMotion'
const mask = ref<HTMLElement | null>(null)
const playing = ref(false)
const busy = ref(false)
const failed = ref(false)
const source = ref('')
let prepared: ReturnType<typeof singlePlayGif> | undefined
let disposed = false
let timer: ReturnType<typeof setTimeout> | undefined
let animation: Animation | undefined
const controller = new AbortController()
async function fade(white: boolean) {
  if (!mask.value || disposed) return
  animation?.cancel()
  const from = white ? 0 : 1
  animation = mask.value.animate([{ opacity: from }, { opacity: 1 - from }], {
    duration: prefersReducedMotion() ? 0 : 300, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards',
  })
  await animation.finished.catch(() => {})
}
async function restore() {
  clearTimeout(timer)
  await fade(true)
  if (disposed) return
  playing.value = false
  await nextTick()
  URL.revokeObjectURL(source.value)
  source.value = ''
  await fade(false)
  busy.value = false
}
async function play() {
  if (busy.value) return
  busy.value = true
  failed.value = false
  try {
    if (!prepared) {
      const response = await fetch(gif, { signal: controller.signal })
      if (!response.ok) throw new Error('GIF load failed')
      prepared = singlePlayGif(await response.arrayBuffer())
    }
    await fade(true)
    if (disposed) return
    source.value = URL.createObjectURL(prepared.blob)
    playing.value = true
  } catch {
    if (!disposed) { failed.value = true; await restore() }
  }
}
function loaded() {
  if (!prepared || disposed) return
  timer = setTimeout(() => { void restore() }, prepared.duration)
  void fade(false)
}
function loadFailed() { failed.value = true; void restore() }
onUnmounted(() => {
  disposed = true
  controller.abort()
  clearTimeout(timer)
  animation?.cancel()
  if (source.value) URL.revokeObjectURL(source.value)
})
</script>
<template>
  <div class="footer-animation">
    <button class="cover-play" type="button" :disabled="busy" :aria-busy="busy" aria-label="播放一次白土豆片尾动画" @click="play">
      <img class="still" :src="cover" alt="WHITE POTATO 白土豆封面" loading="lazy" />
      <img v-if="playing" class="animated" :src="source" alt="白土豆片尾动画" @load="loaded" @error="loadFailed" />
      <span ref="mask" class="white-mask" aria-hidden="true"></span>
    </button>
    <p aria-live="polite">{{ failed ? '动画加载失败，点击重试' : busy ? '动画播放中 · 播放结束后回到封面' : '点击封面，播放一段白土豆的故事' }}</p>
  </div>
</template>
<style scoped>
.footer-animation { max-width: 800px; margin: 0 auto 40px; }
.cover-play { display: block; position: relative; width: 100%; aspect-ratio: 16/9; border: 0; padding: 0; background: white; cursor: pointer; overflow: hidden; }
.cover-play:disabled { cursor: default; }
.cover-play img { display: block; width: 100%; height: 100%; object-fit: contain; }
.animated, .white-mask { position: absolute; inset: 0; }
.white-mask { background: white; opacity: 0; pointer-events: none; }
p { font-size: 12px; color: var(--muted); margin: 12px 0 0; }
</style>
