<script setup lang="ts">
import { ref, computed } from 'vue'
import gsap from 'gsap'
import VideoCard from './VideoCard.vue'
import Lightbox from './Lightbox.vue'
import { videos, videoCount } from '../data/videos'
import { useScrollScene } from '../composables/useScrollScene'

const galleryEl = ref<HTMLElement | null>(null)
const current = ref(-1)
const open = computed(() => current.value >= 0)
const activeVideo = computed(() => (current.value >= 0 ? videos[current.value] : null))

function openAt(i: number) { current.value = i }
function close() { current.value = -1 }
function prev() { current.value = (current.value - 1 + videos.length) % videos.length }
function next() { current.value = (current.value + 1) % videos.length }

useScrollScene(galleryEl, () => {
    galleryEl.value!.querySelectorAll('.card-entry').forEach((el) => {
      gsap.fromTo(el, { opacity: .7, y: 16 }, {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 100%',
          end: 'top 82%',
          scrub: true,
        },
      })
    })
})
</script>

<template>
  <section id="gallery" ref="galleryEl">
    <h2 class="section-head"><span>—— 作品精选 ——</span></h2>
    <p class="section-sub">本精选作品集共收录 <span>{{ videoCount }}</span> 部作品 · 点击封面即可播放</p>
    <div class="grid" role="list">
      <div v-for="(v, i) in videos" :key="v.id" class="card-entry" role="listitem">
        <VideoCard :video="v" @play="openAt(i)" />
      </div>
    </div>

    <Lightbox :open="open" :video="activeVideo" @close="close" @prev="prev" @next="next" />
  </section>
</template>

<style scoped>
#gallery {
  position: relative;
  z-index: 1;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 32px 24px 48px;
  border-top: 1px solid var(--line);
}
.section-sub {
  text-align: left;
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0.8em 0 2.4em;
}
.section-sub span { color: var(--brown-deep); font-weight: 500; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2.4vw, 28px);
}
@media (max-width: 800px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
}
@media (max-width: 440px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
