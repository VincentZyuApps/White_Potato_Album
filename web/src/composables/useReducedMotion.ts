/** 是否开启了“减少动效”系统偏好 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** URL 带 ?snap 时跳过入场/滚动动画，直接呈现终态（截图/测试用） */
export function isSnap(): boolean {
  return typeof location !== 'undefined' && /[?&]snap\b/.test(location.search)
}
