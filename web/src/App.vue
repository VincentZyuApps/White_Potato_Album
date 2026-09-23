<script setup lang="ts">
import HeroIntro from './components/HeroIntro.vue'
import Manifesto from './components/Manifesto.vue'
import Gallery from './components/Gallery.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useAnchorScroll } from './composables/useAnchorScroll'
const { scrollToAnchor } = useAnchorScroll()
</script>
<template>
  <nav class="site-nav" aria-label="主导航">
    <a class="wordmark" href="#hero" @click="scrollToAnchor">WHITE POTATO<span>作品档案</span></a>
    <a href="#gallery" @click="scrollToAnchor">浏览作品 ↗</a>
  </nav>
  <main><HeroIntro /><Manifesto /><Gallery /></main>
  <SiteFooter />
</template>
