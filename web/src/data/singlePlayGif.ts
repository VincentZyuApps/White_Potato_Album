/** Remove GIF loop extensions without re-encoding frames; read frame delays for return timing. */
export function singlePlayGif(buffer: ArrayBuffer): { blob: Blob; duration: number } {
  const bytes = new Uint8Array(buffer)
  if (bytes.length < 13 || !new TextDecoder().decode(bytes.slice(0, 6)).match(/^GIF8[79]a$/)) throw new Error('Invalid GIF')
  let pos = 13 + ((bytes[10]! & 128) ? 3 * 2 ** ((bytes[10]! & 7) + 1) : 0)
  let duration = 0
  let delay = 100
  let kept = 0
  const chunks: BlobPart[] = []
  const skipBlocks = () => {
    while (pos < bytes.length) {
      const size = bytes[pos++]!
      if (!size) return
      pos += size
    }
    throw new Error('Truncated GIF')
  }
  while (pos < bytes.length) {
    const start = pos
    const marker = bytes[pos++]
    if (marker === 0x3b) break
    if (marker === 0x21) {
      const label = bytes[pos++]
      if (label === 0xf9) delay = Math.max(2, bytes[pos + 2]! | bytes[pos + 3]! << 8) * 10
      const app = label === 0xff ? new TextDecoder().decode(bytes.slice(pos + 1, pos + 12)) : ''
      skipBlocks()
      if (app === 'NETSCAPE2.0' || app === 'ANIMEXTS1.0') {
        chunks.push(bytes.slice(kept, start))
        kept = pos
      }
    } else if (marker === 0x2c) {
      const packed = bytes[pos + 8]!
      pos += 9 + ((packed & 128) ? 3 * 2 ** ((packed & 7) + 1) : 0)
      pos++ // LZW minimum code size
      skipBlocks()
      duration += delay
      delay = 100
    } else throw new Error('Invalid GIF block')
  }
  if (!duration) throw new Error('GIF has no frames')
  chunks.push(bytes.slice(kept))
  return { blob: new Blob(chunks, { type: 'image/gif' }), duration }
}
