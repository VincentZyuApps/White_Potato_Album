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
    <div class="nav-links">
      <a href="#gallery" @click="scrollToAnchor">浏览作品 ↗</a>
      <a class="repo-link" href="https://github.com/VincentZyuApps/White_Potato_Album" target="_blank" rel="noopener noreferrer" aria-label="在 GitHub 查看项目源码（新窗口）">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>
        <span>GitHub</span>
      </a>
    </div>
  </nav>
  <main><HeroIntro /><Manifesto /><Gallery /></main>
  <SiteFooter />
</template>
<style scoped>
.nav-links, .repo-link { display: flex; align-items: center; gap: 8px; }
.nav-links { gap: 20px; }
@media (max-width: 440px) { .repo-link span { display: none; } .nav-links { gap: 12px; } }
</style>
