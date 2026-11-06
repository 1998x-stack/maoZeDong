# 独立样式

本目录按原 HTML 文件名保存一一对应的 `.css`，CSS 来自原始页面 `<style>`。同一研究报告的样式不是共享组件库，页面之间也不相互引入。

主站统一设计在 `web/styles.css`；未来如果抽取设计 tokens，请先做逐页视觉回归，避免覆盖旧稿 CSS 选择器优先级。

从新旧页面抽取 CSS 可使用 `node scripts/extract-report-css.mjs`。审计使用 `node scripts/audit-report-css.mjs`。
