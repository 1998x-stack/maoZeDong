# 历史研究稿归档与 CSS 拆分

此目录保留原仓库历史生成的研究型 HTML / Markdown；它们不是《毛泽东选集》原文，也尚未全部完成史料审校。

## 目录结构

- `md/`：63 份原 Markdown，保留原有字节内容（Git blob 复制迁移）。
- `html/`：62 份独立 HTML 研究页面（其中 4 份为原仓库零字节占位文件）；仅以外链取代原 `<style>` 区块。
- `css/`：58 个非空页面的独立 CSS，保留逐篇视觉效果，不强制套用主站色彩系统。
- 主站使用 `web/styles.css`，与历史报告样式互不干扰。
- `data/migrations/report-files.json` 保留全部 125 个文件的旧路径、目标路径、原始 Git blob 与样式路径。

例如：

```text
reports/
├── md/
│   ├── 007反对本本主义.md
│   └── 109论持久战.md
├── html/
│   ├── 007反对本本主义.html
│   └── 109论持久战.html
└── css/
    ├── 007反对本本主义.css
    └── 109论持久战.css
```

## 样式提取原则

每个非空旧 HTML 原本包含一个 `<style>` 区块，已抽到对应 `.css` 文件；HTML 现在通过同名 CSS 外链加载，避免全站统一样式破坏各页差异。

**保留少量 `style="..."` 元素级声明**：某些页面的 JS 会修改 `.style`，SVG/动态组件可能使用元素属性。无逐页浏览器截图对比前，不安全地批量把属性升级为 `!important` 类可能改变覆盖优先级或交互，因此先保留并用 `node scripts/audit-report-css.mjs` 持续报告数量；后续逐篇核实再消除这些剩余声明。

对新增页面，可执行：

```bash
node scripts/extract-report-css.mjs
node scripts/audit-report-css.mjs
node scripts/validate-content.mjs
node scripts/build-site.mjs
node --test tests/*.test.mjs
```

`extract-report-css.mjs` 会拒绝覆盖现有样式文件并只提取新 `<style>`，可以重复执行。它不会处理内联 `style` 属性；这属于需人工验证的独立迁移任务。

旧 URL 从根目录迁移后会改变。旧书签、部署服务器的重定向规则可依据 `data/migrations/report-files.json` 生成；为保持仓库根目录整洁，本次不再为旧路径留下 HTML 占位转发页面。
