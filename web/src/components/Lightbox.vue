<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { Video } from '../data/videos'
import { fmtDuration } from '../data/videos'

const props = defineProps<{ open: boolean; video: Video | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'prev'): void; (e: 'next'): void }>()

const videoEl = ref<HTMLVideoElement | null>(null)

function onKey(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') emit('prev')
  else if (e.key === 'ArrowRight') emit('next')
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      videoEl.value?.pause()
    }
  },
)

// 切换视频源时自动播放
watch(
  () => props.video?.src,
  (src) => {
    if (src && videoEl.value) {
      videoEl.value.currentTime = 0
      const p = videoEl.value.play()
      if (p && (p as Promise<void>).catch) (p as Promise<void>).catch(() => {})
    }
  },
)

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="lightbox open"
      role="dialog"
      aria-modal="true"
      aria-label="视频播放器"
      @click="onBackdrop"
    >
      <button class="lb-btn lb-close" aria-label="关闭" @click="emit('close')">&times;</button>
      <button class="lb-btn lb-prev" aria-label="上一个" @click="emit('prev')">&#8249;</button>
      <button class="lb-btn lb-next" aria-label="下一个" @click="emit('next')">&#8250;</button>
      <div class="lb-stage">
        <video ref="videoEl" class="lb-video" :src="video?.src" controls playsinline preload="metadata"></video>
        <div class="lb-caption">
          <span class="lb-title">{{ video ? video.title + '  ·  ' + fmtDuration(video.duration) : '' }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed; inset: 0; z-index: 50;
  display: grid; place-items: center;
  padding: 4vh 4vw;
  background: rgba(12, 10, 9, 0.86);
  backdrop-filter: blur(6px);
}
.lb-stage { width: min(1000px, 100%); }
.lb-video {
  width: 100%; max-height: 78svh;
  background: #000; border-radius: 10px;
  box-shadow: 0 24px 70px rgba(0,0,0,.5); display: block;
}
.lb-caption {
  text-align: center; color: #f0ece6; margin-top: 14px;
  font-family: var(--serif); letter-spacing: 0.08em;
}
.lb-caption .lb-title { font-size: 1.02rem; }
.lb-btn {
  position: absolute;
  background: rgba(255,255,255,0.10); color: #fff;
  border: 1px solid rgba(255,255,255,0.22);
  cursor: pointer; border-radius: 50%;
  transition: background .2s, transform .2s;
  display: grid; place-items: center; line-height: 1;
}
.lb-btn:hover { background: rgba(255,255,255,0.22); }
.lb-close { top: 18px; right: 18px; width: 44px; height: 44px; font-size: 26px; }
.lb-prev, .lb-next { top: 50%; transform: translateY(-50%); width: 52px; height: 52px; font-size: 30px; }
.lb-prev { left: max(12px, 2vw); }
.lb-next { right: max(12px, 2vw); }
.lb-prev:hover, .lb-next:hover { transform: translateY(-50%) scale(1.08); }
@media (max-width: 560px) {
  .lb-prev, .lb-next { width: 42px; height: 42px; font-size: 24px; }
}
</style>
