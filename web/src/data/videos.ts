import raw from './videos.json'

export interface Video {
  id: string
  title: string
  cover: string
  src: string
  duration: number | null
  size: number
}

interface VideosFile {
  tag: string
  count: number
  videos: Video[]
}

const data = raw as VideosFile

export const videos: Video[] = data.videos
export const videoCount: number = data.count ?? data.videos.length

/** 秒 → m:ss */
export function fmtDuration(sec: number | null): string {
  if (!sec || typeof sec !== 'number') return ''
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
