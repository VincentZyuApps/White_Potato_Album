import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isSnap } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** Each scene owns its animations; media changes and HMR revert them safely. */
export function useScrollScene(root: Ref<HTMLElement | null>, setup: () => void) {
  let media: gsap.MatchMedia | undefined
  let disposed = false
  onMounted(() => {
    if (isSnap() || !root.value) return
    media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', setup, root.value)
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh()
    })
  })
  onUnmounted(() => {
    disposed = true
    media?.revert()
  })
}
