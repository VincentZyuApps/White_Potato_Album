<script setup lang="ts">
import type { Video } from '../data/videos'
import { fmtDuration } from '../data/videos'

defineProps<{ video: Video }>()
const emit = defineEmits<{ (e: 'play'): void }>()
</script>

<template>
  <button class="card" type="button" :aria-label="`播放 ${video.title}，${video.id.toUpperCase()}`" @click="emit('play')">
    <div class="thumb">
      <img :src="video.cover" :alt="`${video.title} 封面`" loading="lazy" decoding="async" />
      <span class="play" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </span>
    </div>
    <div class="meta">
      <span class="title">{{ video.title }}</span>
      <span class="archive-meta">
        <span class="archive-id">{{ video.id.toUpperCase() }}</span>
        <span v-if="fmtDuration(video.duration)">{{ fmtDuration(video.duration) }}</span>
      </span>
    </div>
  </button>
</template>

<style scoped>
.card {
  appearance: none;
  border: 1px solid var(--line);
  background: var(--paper);
  border-radius: 3px;
  width: 100%;
  padding: 0;
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform .28s cubic-bezier(.2,.7,.2,1), box-shadow .28s, border-color .28s;
  font-family: inherit;
  color: inherit;
}
.card:hover, .card:focus-visible {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: var(--green);
  outline: none;
}
.thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #e9e5df;
  overflow: hidden;
}
.thumb img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .5s ease, filter .4s ease;
}
.card:hover .thumb img { transform: scale(1.06); filter: saturate(1.05); }
.thumb::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35));
  opacity: 0; transition: opacity .3s;
}
.card:hover .thumb::after { opacity: 1; }
.play {
  position: absolute; inset: 0; margin: auto;
  width: 58px; height: 58px;
  display: grid; place-items: center;
  background: rgba(255,255,255,0.92);
  color: var(--ink);
  border-radius: 50%;
  box-shadow: 0 6px 18px rgba(0,0,0,.25);
  transform: scale(.7); opacity: 0;
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .3s;
}
.play svg { width: 22px; height: 22px; margin-left: 3px; }
.card:hover .play, .card:focus-visible .play { transform: scale(1); opacity: 1; }
.meta {
  display: flex; min-height: 98px; flex-direction: column; align-items: flex-start;
  gap: 9px; padding: 14px 15px 15px;
}
.meta .title {
  font-family: var(--serif); font-weight: 500; font-size: 1.05rem; line-height: 1.45; color: var(--ink);
  display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
}
.archive-meta {
  display: flex; align-items: baseline; gap: 9px; margin-top: auto;
  font-family: var(--brand); font-size: 0.74rem; letter-spacing: 0.08em;
  color: var(--brown-deep); font-variant-numeric: tabular-nums;
}
.archive-meta span + span { color: var(--muted); }
.archive-id { font-weight: 600; }
@media (max-width: 560px) {
  .meta { min-height: 92px; padding: 10px 11px 12px; }
  .meta .title { font-size: 0.94rem; }
  .play { width: 48px; height: 48px; }
}
</style>
