[![GitHub Pages · 在线浏览](https://img.shields.io/badge/GitHub_Pages-在线浏览作品集-A38A7C?style=for-the-badge&logo=github&logoColor=white&labelColor=242523)](https://vincentzyuapps.github.io/White_Potato_Album/)

[🌐 查看网页项目说明与效果演示](web/README.md)

![potato_bili_cover.png](potato_bili_cover.png)

# 🥔 White_Potato_Album
这里是B站UP主 WHITE POTATO（歪特破特抖）作品精选集  
*01bit的数据承载精神的永恒；白色土豆将在赛博梦境中生根发芽。*

# 📺 B站链接
https://www.bilibili.com/video/BV1j34y1P75b

# ☁️ 阿里云网盘链接
https://www.aliyundrive.com/s/Drjre6JSVVb

# 💾 百度云盘链接
https://pan.baidu.com/s/1a-wWZOzsgAQ2FFJJcPvpKQ?pwd=wtpt


--- 

![White_Potato_Album](https://socialify.git.ci/VincentZyu233/White_Potato_Album/image?custom_language=Python&description=1&font=Inter&forks=1&issues=1&language=1&logo=https%3A%2F%2Fthumb.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F92%2FManim_icon.svg%2F960px-Manim_icon.svg.png%3Futm_source%3Dcommons.wikimedia.org%26utm_campaign%3Dindex%26utm_content%3Dthumbnail%26_%3D20210518063037&name=1&owner=1&pattern=Solid&pulls=1&stargazers=1&theme=Light)

## 🎬 生成视频
```bash
git clone https://github.com/VincentZyu233/White_Potato_Album
# uv is recommended
# https://docs.astral.sh/uv/getting-started/installation/
# https://gitee.com/wangnov/uv-custom/releases

uv venv --python 3.10
uv pip install "manim==0.17.3" "setuptools<70.0.0"
uv run python -c "import pkg_resources; import manim; print('Success!')"

# on Windows:
scoop install miktex
# on Linux (Debian/Ubuntu):
sudo apt install texlive texlive-latex-extra fonts-noto-cjk
# on MacOS:
brew install --cask mactex

uv run manim -pqh ./potato_bili_cover_video.py
# or Run without cache
uv run manim -pqh ./potato_bili_cover_video.py --disable_caching

cp ./media/videos/potato_bili_cover_video/1080p60/Potato_Bili_Cover_Intro.mp4 ./Potato_Bili_Cover_Intro.mp4
# on Windows:
scoop install ffmpeg
# on Linux (Debian/Ubuntu):
sudo apt install ffmpeg
# on MacOS:
brew install ffmpeg
# Convert the video to a GIF
ffmpeg -i Potato_Bili_Cover_Intro.mp4 -vf "fps=30,scale=800:-1:flags=lanczos" -loop 0 Potato_Bili_Cover_Intro.gif
# Reverse and concatenate for a loop
ffmpeg -i Potato_Bili_Cover_Intro.gif -filter_complex "[0:v]reverse[r];[0:v][r]concat=n=2:v=1:a=0" Potato_Bili_Cover_Final_Loop.gif

```

![Potato_Bili_Cover_Final_Loop.gif](Potato_Bili_Cover_Final_Loop.gif)
