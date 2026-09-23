import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 相对路径：无论部署在 Pages 的哪个子路径都能正确加载资源
  base: './',
  plugins: [vue()],
  // 6 和 0 有点像土豆 🥔 —— 固定 dev/preview 端口为 60606
  server: { port: 60606, strictPort: true, host: '127.0.0.1', open: false },
  preview: { port: 60606, host: true },
})
