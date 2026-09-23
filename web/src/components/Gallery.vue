<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VideoCard from './VideoCard.vue'
import Lightbox from './Lightbox.vue'
import { videos, videoCount } from '../data/videos'
import { prefersReducedMotion, isSnap } from '../composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const galleryEl = ref<HTMLElement | null>(null)
const current = ref(-1)
const open = computed(() => current.value >= 0)
const activeVideo = computed(() => (current.value >= 0 ? videos[current.value] : null))

function openAt(i: number) { current.value = i }
function close() { current.value = -1 }
function prev() { current.value = (current.value - 1 + videos.length) % videos.length }
function next() { current.value = (current.value + 1) % videos.length }

let ctx: gsap.Context | null = null
onMounted(() => {
  if (prefersReducedMotion() || isSnap()) return
  ctx = gsap.context((self) => {
    self.selector!('.card').forEach((el: Element, i: number) => {
      gsap.from(el, {
        opacity: 0,
        y: 42,
        duration: 0.6,
        ease: 'power2.out',
        delay: (i % 3) * 0.06,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse', // 上下滚动可逆
        },
      })
    })
  }, galleryEl.value!)
})
onUnmounted(() => ctx?.revert())
</script>

<template>
  <section id="gallery" ref="galleryEl">
    <h2 class="section-head"><span>作品精选</span></h2>
    <p class="section-sub">共 <span>{{ videoCount }}</span> 部 · 点击封面即可播放</p>
    <div class="grid" role="list">
      <VideoCard
        v-for="(v, i) in videos"
        :key="v.id"
        :video="v"
        @play="openAt(i)"
      />
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
  padding: clamp(48px, 9vh, 110px) 24px 40px;
}
.section-sub {
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0.8em 0 2.4em;
}
.section-sub span { color: var(--brown-deep); font-weight: 500; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: clamp(16px, 2.4vw, 28px);
}
@media (max-width: 560px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
}
</style>
