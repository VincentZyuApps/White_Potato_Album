<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VideoCollection from './VideoCollection.vue'
import Lightbox from './Lightbox.vue'
import { videos, videoCount, moreVideos } from '../data/videos'
import { useAnchorScroll } from '../composables/useAnchorScroll'
import { isSnap, prefersReducedMotion } from '../composables/useReducedMotion'
const expanded = ref(false)
const collapsing = ref(false)
const animating = ref(false)
const morePanel = ref<HTMLElement | null>(null)
let panelTween: gsap.core.Tween | undefined
const cubic = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
function animatePanel(element: Element, done: () => void, entering: boolean) {
  const el = element as HTMLElement
  animating.value = true
  panelTween?.kill()
  if (isSnap() || prefersReducedMotion()) { done(); return }
  const height = el.getBoundingClientRect().height
  panelTween = gsap.fromTo(el,
    { height: entering ? 0 : height, opacity: entering ? 0 : 1, overflow: 'hidden' },
    { height: entering ? el.scrollHeight : 0, opacity: entering ? 1 : 0, duration: .6, ease: cubic,
      onComplete: () => { gsap.set(el, { clearProps: 'height,opacity,overflow' }); done() } })
}
function enterPanel(el: Element, done: () => void) { animatePanel(el, done, true) }
function leavePanel(el: Element, done: () => void) { animatePanel(el, done, false) }
function panelEntered() {
  animating.value = false
  ScrollTrigger.refresh()
  if (morePanel.value) void scrollToElement(morePanel.value)
}
async function panelLeft() {
  animating.value = false
  await nextTick()
  toggleButton.value?.focus({ preventScroll: true })
  ScrollTrigger.refresh()
}
onUnmounted(() => panelTween?.kill())
const toggleButton = ref<HTMLButtonElement | null>(null)
const group = ref<'featured' | 'more'>('featured')
const current = ref(-1)
const playlist = computed(() => group.value === 'featured' ? videos : moreVideos)
const open = computed(() => current.value >= 0)
const activeVideo = computed(() => playlist.value[current.value] ?? null)
const { scrollToElement } = useAnchorScroll()
function openAt(which: 'featured' | 'more', index: number) { group.value = which; current.value = index }
function close() { current.value = -1 }
function prev() { current.value = (current.value - 1 + playlist.value.length) % playlist.value.length }
function next() { current.value = (current.value + 1) % playlist.value.length }
async function toggleMore() {
  if (collapsing.value || animating.value) return
  if (expanded.value && toggleButton.value && toggleButton.value.getBoundingClientRect().top < 0) {
    collapsing.value = true
    const finished = await scrollToElement(toggleButton.value)
    collapsing.value = false
    if (!finished) return
  }
  expanded.value = !expanded.value
  await nextTick()
}
</script>
<template>
  <section id="gallery">
    <h2 class="section-head">—— 作品精选 ——</h2>
    <p class="section-sub">本精选作品集共收录 <span>{{ videoCount }}</span> 部作品 · 点击封面即可播放</p>
    <VideoCollection :videos="videos" featured @play="openAt('featured', $event)" />
    <section class="more-section" aria-labelledby="more-heading">
      <h2 id="more-heading" class="section-head">—— 更多作品 ——</h2>
      <p class="section-sub">还有 {{ moreVideos.length }} 部作品，记录更多相遇与日常。</p>
      <button ref="toggleButton" class="toggle-more" type="button" :aria-expanded="expanded" aria-controls="more-works" :disabled="collapsing || animating" @click="toggleMore">
        {{ expanded ? '收起更多作品 ↑' : `展开 ${moreVideos.length} 部更多作品 ↓` }}
      </button>
      <div id="more-works">
        <Transition :css="false" @enter="enterPanel" @leave="leavePanel" @after-enter="panelEntered" @after-leave="panelLeft">
          <div v-if="expanded" ref="morePanel" class="more-panel">
            <VideoCollection :videos="moreVideos" @play="openAt('more', $event)" />
            <button class="toggle-more bottom-toggle" type="button" :disabled="collapsing || animating" @click="toggleMore">收起更多作品 ↑</button>
          </div>
        </Transition>
      </div>
    </section>
    <Lightbox :open="open" :video="activeVideo" @close="close" @prev="prev" @next="next" />
  </section>
</template>
<style scoped>
#gallery { position: relative; z-index: 1; max-width: var(--maxw); margin: 0 auto; padding: 32px 24px 48px; border-top: 1px solid var(--line); }
.section-sub { color: var(--muted); font-size: .9rem; margin: .8em 0 2.4em; line-height: 1.8; }
.section-sub span { color: var(--brown-deep); font-weight: 500; }
.more-section { margin-top: 64px; padding-top: 40px; border-top: 1px solid var(--line); }
.toggle-more { display: block; margin: 0 auto 32px; padding: 14px 28px; border: 1px solid var(--line); border-radius: 3px; background: var(--paper); color: var(--green-deep); cursor: pointer; }
.toggle-more:hover { border-color: var(--green); }
.bottom-toggle { margin-top: 32px; }
.more-panel { display: flow-root; }
</style>
