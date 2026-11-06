---
name: research-ui
description: 设计毛选与党史研究平台的专业学术阅读界面，涵盖分卷检索、历史时间冻结、人物信息差、版本说明和可访问移动端体验；适用于 UI 架构与交互改版。
license: MIT
compatibility: opencode
metadata:
  domain: frontend
  stage: production
---
# 学术历史研究界面规范

## 设计目标
读者应在 30 秒内区分“原文外链”“站内研究报告”“尚未核实的推断”。交互是为了帮助研究，不是营造戏剧化历史场面。

## 页面构成
1. 分卷目录：全文标题检索、时期过滤、主题标签与空结果说明。
2. 作品卡片：准确的日期精度、原著出处、旧研究稿、核心研究问题。
3. 历史截面：明显标注 T0；“当时可知”和“事后复盘”分屏显示。
4. 人物信息：真实职务、实际权限、已知/可能已知/未知区别明确。
5. 方案比较：史料证明曾提出的方案与研究者构造的假设使用不同文字标签。
6. 证据区：来源链接、版本、证据 A/B/C/D 和争议；不把站内评论冒充原著。

## 视觉与无障碍
按 `references/design-system.md` 使用暖纸、墨色、朱红和青绿。语义 HTML（main/nav/article/aside）、搜索明确 label、Tab 可用、焦点可见；保证 320px 窄屏，尊重 `prefers-reduced-motion`。标签不可仅靠颜色传递意义。

## 工程约定
`data/works.json` 是唯一数据源，运行 `node scripts/build-site.mjs` 生成 `index.html`；不要手工编辑生成页面。页面对源站只提供显式外链，不全文复制；运行 `content-qa`。
