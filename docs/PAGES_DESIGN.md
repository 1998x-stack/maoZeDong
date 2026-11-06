# 史境网站视觉与 GitHub Pages 实施规范

## 产品定位

史境是一套以史料为边界、以历史信息截面为中心的研究文库。设计关注的是“当时人物能够知道什么、存在哪些不同意见、哪些结论仍属待证”，而不是用后来的结果替代历史过程。

## 信息架构与页面层次

首页以档案馆式的编辑排版组织探索行为：Hero 展示方法主张与当前专题，《论持久战》作为可直达研究；三条主题阅读路径分别对应“调查与社会结构”“根据地与组织选择”“认识与战争判断”；年份索引从真实作品日期自动生成。作品目录提供标题与研究问题搜索、卷次、主题、历史时期、年份和主题路径筛选，选中作品具有可分享的查询链接。

每篇研究正文提供 T0 历史信息边界、五环分析、人物与组织信息地图、版本谱系、A/B/C/D 证据标记、备选方案与未证问题。部分研究还有预测—结果检验。附属工具包括页面阅读进度、字号调节、章节导航、复制链接与时间线仅看当时的切换。页面上的“研究草案”状态不能被设计成“史料已证实”。

## 视觉设计系统

品牌色为深松绿 #183d35、朱砂 #a24d42、暖纸色 #f7f5f0 和黄铜 #c4a27b。研究标题与长阅读文本优先使用本机中文宋体和衬线体，交互控件使用系统无衬线字体。避免无证据的历史人物配图、真实档案水印及装饰性假印章。网站不依赖外部字体和图片 CDN。

交互与无障碍：移动端使用侧栏抽屉；查询支持斜杠和 Command/Control+K 快捷键；所有控件都有可读标签、键盘焦点、状态提示及用户偏好“减少动态效果”支持。窄屏研究表格可横向滚动。研究正文在 JavaScript 关闭时仍可阅读。

## GitHub Pages 架构

脚本 scripts/build-pages.mjs 产生 dist 文件夹，仅复制首页、样式、交互脚本、11篇已登记研究的 HTML/Markdown/JSON、其关联的旧稿以及对应的 CSS。它会生成站点地图、robots.txt、404 页面和 .nojekyll。完整开发源码、OpenCode Skills、测试文件和未登记的资料不复制到 Pages 公开产物中。

脚本 scripts/check-pages.mjs 静态检查所有发布的 HTML 中相对的 href/src 链接是否真实存在，保证在仓库项目路径 maoZeDong 下不会因为从根路径开始加载而失效。默认预期网址是 https://1998x-stack.github.io/maoZeDong/ ，可以使用环境变量 PAGES_SITE_URL 覆盖站点地图中的网址。这不是上线证明；实际部署状态以 GitHub Pages 的部署记录为准。

## 发布启用步骤

1. 打开仓库 Settings → Pages。
2. 在 Build and deployment 的 Source 选择 GitHub Actions。
3. 审核并合并本 UI PR 到 main。
4. 在仓库 Actions 查看 Publish Shijing to GitHub Pages 的运行记录。该工作流仅在 main 的网站相关修改或手动启动时执行。
5. 成功后到 Settings → Pages 点击 Visit site 查看实际网址。

工作流在 Pages build 阶段检查原著资料与静态资源，随后用 configure-pages、upload-pages-artifact 和 deploy-pages 发布。部署 job 显式授予 pages: write 和 id-token: write；PR 验证只构建、不进行公开发布。

## 本地验证

1. node scripts/inventory-legacy.mjs --check
2. node scripts/build-research.mjs --check
3. node scripts/validate-content.mjs
4. node scripts/build-site.mjs
5. node scripts/build-pages.mjs
6. node scripts/check-pages.mjs
7. node --test tests/*.test.mjs

当前 11 篇研究均维持 draft / catalogued。网站上线不会自动完成早期版本逐段比勘或独立历史学审校。
