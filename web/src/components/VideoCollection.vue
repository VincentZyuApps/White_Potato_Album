<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import VideoCard from './VideoCard.vue'
import type { Video } from '../data/videos'
import { useScrollScene } from '../composables/useScrollScene'
defineProps<{ videos: Video[]; featured?: boolean }>()
defineEmits<{ play: [index: number] }>()
const root = ref<HTMLElement | null>(null)
useScrollScene(root, () => {
  root.value!.querySelectorAll('.card-entry').forEach(el => {
    gsap.fromTo(el, { opacity: .7, y: 16 }, {
      opacity: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 82%', scrub: true },
    })
  })
})
</script>
<template>
  <div ref="root" :class="featured ? 'featured-list' : 'grid'" role="list">
    <div v-for="(video, i) in videos" :key="video.id" class="card-entry" role="listitem">
      <VideoCard :video="video" :featured="featured" :reverse="featured && i % 2 === 1" @play="$emit('play', i)" />
    </div>
  </div>
</template>
<style scoped>
.featured-list { display: grid; gap: clamp(28px, 5vw, 64px); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(16px, 2.4vw, 28px); }
.card-entry { min-width: 0; }
@media (max-width: 800px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; } }
@media (max-width: 440px) { .grid { grid-template-columns: 1fr; } }
</style>
