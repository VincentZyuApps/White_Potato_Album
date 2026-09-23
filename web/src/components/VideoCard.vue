<script setup lang="ts">
import type { Video } from '../data/videos'
import { fmtDuration, archiveLabel } from '../data/videos'

defineProps<{ video: Video; featured?: boolean; reverse?: boolean }>()
const emit = defineEmits<{ (e: 'play'): void }>()
</script>

<template>
  <button class="card" :class="{ featured, reverse }" type="button" :aria-label="`播放 ${video.title}，${archiveLabel(video)}`" @click="emit('play')">
    <div class="thumb">
      <img :src="video.cover" :alt="`${video.title} 封面`" loading="lazy" decoding="async" />
      <span class="play" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </span>
    </div>
    <div class="meta">
      <span class="title">{{ video.title }}</span>
      <span class="archive-meta">
        <span class="archive-id">{{ archiveLabel(video) }}</span>
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
  font-family: var(--display-cn); font-weight: 400; font-style: oblique; font-size: 1.25rem; line-height: 1.45; color: var(--ink);
  display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
}
.archive-meta {
  display: flex; align-items: baseline; gap: 9px; margin-top: auto;
  font-family: var(--serif); font-size: 16px; font-weight: 400; line-height: 20px; letter-spacing: 0.02em;
  color: var(--brown-deep); font-variant-numeric: tabular-nums;
}
.archive-meta span + span { color: var(--muted); }
.archive-id { font-weight: 400; }
.card:not(.featured) .meta { min-height: 80px; padding: 3px 15px; gap: 2px; }
.card:not(.featured) .title { line-height: 1.3; }
.featured { display: grid; grid-template-columns: 3fr 2fr; align-items: center; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; padding-bottom: 28px; }
.featured.reverse { grid-template-columns: 2fr 3fr; }
.featured.reverse .thumb { grid-column: 2; grid-row: 1; }
.featured.reverse .meta { grid-column: 1; grid-row: 1; }
.featured .meta { min-width: 0; min-height: 0; padding: clamp(20px, 4vw, 48px); gap: 18px; }
.featured .meta .title { display: block; overflow: visible; font-size: clamp(26px, 3vw, 42px); line-height: 1.4; overflow-wrap: anywhere; }
.featured .archive-meta { flex-wrap: wrap; font-size: 18px; line-height: 22px; }
@media (max-width: 800px) {
  .featured, .featured.reverse { display: flex; flex-direction: column; align-items: stretch; }
  .featured .meta { padding: 20px 4px 8px; gap: 8px; }
  .featured .meta .title { font-size: 28px; }
}
@media (max-width: 560px) {
  .meta { min-height: 92px; padding: 10px 11px 12px; }
  .meta .title { font-size: 1.125rem; }
  .play { width: 48px; height: 48px; }
  .card:not(.featured) .meta { min-height: 74px; padding: 2px 11px; }
}
</style>
