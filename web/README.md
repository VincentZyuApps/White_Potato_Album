# 🥔 WHITE POTATO · 精选作品集

[![GitHub Pages · 在线浏览](https://img.shields.io/badge/GitHub_Pages-在线浏览作品集-496544?style=for-the-badge&logo=github&logoColor=white)](https://vincentzyuapps.github.io/White_Potato_Album/)

[⬅️ 返回仓库首页](../README.md)

Vue 3 + TypeScript + Vite + GSAP。首屏为原始大土豆头像；190svh 滚动轨道中的 sticky 舞台在约一屏滚动内让头像缩小上移、品牌与作品入口依次显现，向上滚动可逆。后续文案与卡片在进入视口时即可读，支持系统减少动效设置和 `?snap` 静态终态。

「浏览精选作品」和导航使用 1 秒 easeInOutCubic 曲线滚动；滚轮、触摸、指针按下、导航键或窗口尺寸改变均可打断。减少动效时直接定位。

更多作品展开/收起采用 0.6 秒 easeInOutCubic 高度和透明度动画；展开后用 1 秒相同曲线定位内容，收起前先滚回按钮。滚动被用户打断时取消此次自动收起。减少动效与 `?snap` 下直接切换。

## 🎬 效果演示

![大土豆首屏与可逆滚动效果录屏](docs/videos/screenrecord/web.gif)

## 🛠️ 本地开发


在此目录执行 `npm ci`、`npm run dev`，访问 http://localhost:60606/。端口占用时直接报错，不自动切换端口。`npm run build` 执行类型检查并生成 `dist/`；`npm run preview` 预览构建产物（需先停止 dev，二者共用端口）。

## 🎨 资源与字体

- 原头像使用仓库根目录 `potato_pfp.jpg`，由 Vite 打包；所有标题都是可选中的文本。
- 品牌名使用 `computer-modern` 的 CMU Serif，接近 Manim 默认 TeX 风格；英文正文使用 `@fontsource/tinos`。
- 中文展示标题使用得意黑 `@fontpkg/smiley-sans`；正文使用 Noto Serif SC，界面使用 Noto Sans SC。
- 字体随站点自托管，使用 `font-display: swap`；中文分片由 `unicode-range` 按需请求。字体文件采用 OFL，computer-modern 包封装代码采用 MIT；许可证见各 npm 包。
- 精选数据编辑源为 `src/data/videos.json`，更多作品为 `src/data/more-videos.json`，同步对应 `public/assets/` JSON 副本。封面位于 `public/assets/covers/`，视频使用 Release 直链。
- 精选 18 部采用每行一部、左右交错的布局，800px 以下封面在上；更多作品默认折叠，展开后采用三列、两列、单列响应式网格。播放器在各自分组内循环。
- 更多作品收录于 `more-videos` Release。`av-unknown-xiaohei` 是内部占位 ID，`av: null`，页面标明 AV 号未知；每组数量由数据计算。资产文件名只使用英文、数字和连字符。

## 🚀 验收与部署

- 检查桌面、手机宽度下的首屏、画廊和播放器，无横向溢出；向下和向上滚动均应平滑可逆。
- 点击卡片打开原生模态播放器；支持关闭、Escape、前后视频，关闭后焦点回到原卡片。播放器原生控件保留方向键快进等行为。
- 检查减少动效与 `?snap` 下全部内容可读，字体加载后滚动触发位置自动刷新。
- GitHub Pages 工作流构建 `web/dist`，Vite 使用相对路径适配仓库子路径；旧 `page/` 已删除。
- 普通 push 不部署。只检查 main 最新提交的完整信息：`[update-page]` 或 `[updatepage]`（大小写不敏感，必须有方括号，不能带空格）。例如 `feat: add works [update-page]`。一次 push 的较早提交含标记不触发。
- 手动部署：在仓库执行 `gh workflow run pages.yml --ref main`，然后用 `gh run list --workflow pages.yml`、`gh run watch <run-id> --exit-status` 检查结果。手动入口也只部署 main。
- 更多作品上传前先在草稿 Release 核验资产名、大小和 SHA-256，全部完成后发布，再部署页面。临时导入/上传脚本放在被 Git 忽略的 `temp/scripts/`，需在 `web/` 目录运行；视频暂存使用 `G:\tmp\codex\White_Potato_Album`，不修改原始视频。
