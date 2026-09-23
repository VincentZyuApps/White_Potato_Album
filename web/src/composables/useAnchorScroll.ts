import { onUnmounted } from 'vue'
import { isSnap, prefersReducedMotion } from './useReducedMotion'

export function useAnchorScroll() {
  let cancel = () => {}
  function scrollToAnchor(event: MouseEvent) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    const link = event.currentTarget as HTMLAnchorElement
    const target = document.getElementById(link.hash.slice(1))
    if (!target) return
    event.preventDefault()
    cancel()
    const start = window.scrollY
    const destination = Math.max(0, Math.min(start + target.getBoundingClientRect().top,
      document.documentElement.scrollHeight - window.innerHeight))
    const finish = () => {
      if (location.hash !== link.hash) history.pushState(null, '', link.hash)
      const previousTabIndex = target.getAttribute('tabindex')
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      if (previousTabIndex === null) target.removeAttribute('tabindex')
      else target.setAttribute('tabindex', previousTabIndex)
    }
    if (isSnap() || prefersReducedMotion()) {
      window.scrollTo({ top: destination, behavior: 'instant' })
      finish()
      return
    }
    let frame = 0
    const started = performance.now()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cancelOnKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(e.key)) cancel()
    }
    cancel = () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('pointerdown', cancel)
      window.removeEventListener('keydown', cancelOnKey)
      window.removeEventListener('resize', cancel)
      motion.removeEventListener('change', cancel)
    }
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('pointerdown', cancel, { passive: true })
    window.addEventListener('keydown', cancelOnKey)
    window.addEventListener('resize', cancel)
    motion.addEventListener('change', cancel)
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 1000)
      const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      window.scrollTo({ top: start + (destination - start) * eased, behavior: 'instant' })
      if (t < 1) frame = requestAnimationFrame(tick)
      else { cancel(); finish() }
    }
    frame = requestAnimationFrame(tick)
  }
  onUnmounted(() => cancel())
  return { scrollToAnchor }
}
