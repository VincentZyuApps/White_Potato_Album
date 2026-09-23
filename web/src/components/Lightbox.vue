<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { Video } from '../data/videos'
import { fmtDuration, archiveLabel } from '../data/videos'
const props = defineProps<{ open: boolean; video: Video | null }>()
const emit = defineEmits<{ close: []; prev: []; next: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const failed = ref(false)
let volume = 0.5
function rememberVolume(event: Event) {
  volume = (event.currentTarget as HTMLVideoElement).volume
}
let opener: HTMLElement | null = null
let previousOverflow = ''
let locked = false
function unlock() {
  if (!locked) return
  document.body.style.overflow = previousOverflow
  locked = false
  if (opener?.isConnected) opener.focus({ preventScroll: true })
}
watch(() => props.open, (open) => {
  if (open) {
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    previousOverflow = document.body.style.overflow
    locked = true
    document.body.style.overflow = 'hidden'
    dialog.value?.showModal()
    closeButton.value?.focus()
  } else {
    videoEl.value?.pause()
    dialog.value?.close()
    unlock()
  }
}, { flush: 'post' })
watch(() => [props.open, props.video?.src] as const, ([open, src]) => {
  failed.value = false
  if (!open || !src || !videoEl.value) return
  videoEl.value.volume = volume
  videoEl.value.load()
  void videoEl.value.play().catch(() => { /* Native play control remains available. */ })
}, { flush: 'post' })
function onKey(event: KeyboardEvent) {
  // Native media controls keep arrow keys for seeking and volume.
  if (event.target === videoEl.value || event.altKey || event.ctrlKey || event.metaKey) return
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    if (event.key === 'ArrowLeft') emit('prev')
    else emit('next')
  }
}
onUnmounted(() => { videoEl.value?.pause(); dialog.value?.close(); unlock() })
</script>
<template>
  <Teleport to="body">
    <dialog ref="dialog" class="lightbox" aria-label="视频播放器"
      @cancel.prevent="emit('close')" @keydown="onKey"
      @click="($event.target === $event.currentTarget) && emit('close')">
      <div class="player-shell" v-if="open">
        <header class="player-header">
          <span>WHITE POTATO · 作品放映</span>
          <button ref="closeButton" type="button" aria-label="关闭播放器" @click="emit('close')">关闭 ×</button>
        </header>
        <video ref="videoEl" :src="video?.src" controls playsinline preload="metadata" @volumechange="rememberVolume" @error="failed = true"></video>
        <p v-if="failed" class="load-error">暂时无法加载视频。<a :href="video?.src" target="_blank" rel="noopener">打开原视频重试 ↗</a></p>
        <footer class="player-footer">
          <button type="button" aria-label="上一个视频" @click="emit('prev')">← 上一个</button>
          <p aria-live="polite">
            <span class="player-title">{{ video?.title }}</span>
            <span v-if="video" class="player-archive"> · {{ archiveLabel(video) }} · {{ fmtDuration(video.duration) }}</span>
          </p>
          <button type="button" aria-label="下一个视频" @click="emit('next')">下一个 →</button>
        </footer>
      </div>
    </dialog>
  </Teleport>
</template>
<style scoped>
.lightbox { position: fixed; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none; margin: 0; border: 0; padding: 24px; background: transparent; color: #f5f5ef; }
.lightbox[open] { display: grid; place-items: center; }
.lightbox::backdrop { background: #111711ef; backdrop-filter: blur(8px); }
.player-shell { width: min(1040px, 100%); min-width: 0; }
.player-header, .player-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.player-header { margin-bottom: 16px; font-size: 12px; letter-spacing: .04em; }
video { width: 100%; max-height: 72svh; display: block; background: #000; }
button { color: inherit; background: transparent; border: 1px solid #ffffff40; padding: 10px 14px; cursor: pointer; border-radius: 3px; white-space: nowrap; }
button:hover { background: #ffffff15; }
.player-footer { margin-top: 16px; font-size: 13px; }
.player-footer p { text-align: center; overflow-wrap: anywhere; margin-block: 6px; }
.player-title { font-family: var(--display-cn); font-style: oblique; font-size: 18px; line-height: 1.4; }
.player-archive { font-family: var(--serif); font-size: 16px; font-weight: 400; line-height: 20px; letter-spacing: .02em; color: #d7d7cf; }
.load-error { text-align: center; font-size: 14px; }
@media (max-width: 560px) { .lightbox { padding: 12px; } .player-footer { flex-wrap: wrap; } .player-footer p { order: -1; width: 100%; margin: 0 0 4px; } video { max-height: 60svh; } }
</style>
