import raw from './videos.json'
import moreRaw from './more-videos.json'

export interface Video {
  id: string
  av: string | null
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
export const videoCount = videos.length
export const moreVideos: Video[] = moreRaw.videos
export function archiveLabel(video: Video): string {
  return video.av?.toUpperCase() ?? 'AV 号未知 · 小黑'
}

/** 秒 → m:ss */
export function fmtDuration(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec) || sec < 0) return ''
  const total = Math.round(sec)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
