import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// ?snap：截图/测试时跳过动画并关闭平滑滚动，直接呈现终态
if (/[?&]snap\b/.test(location.search)) {
  document.documentElement.classList.add('snap')
}

createApp(App).mount('#app')
