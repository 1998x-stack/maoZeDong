---
name: content-qa
description: 检验历史研究平台技能 frontmatter、毛选源链接、时间精度、legacy 映射、静态页面生成和历史证据规范。用于每次文章上线、UI 重构、目录迁移后的验收。
license: MIT
compatibility: opencode
metadata:
  domain: quality-assurance
  stage: review
---
# 研究内容与工程质量门禁

## 必跑
1. `node scripts/validate-content.mjs`
2. `node scripts/build-site.mjs`
3. `node scripts/audit-report-css.mjs`
4. `node --test tests/*.test.mjs`
5. `git diff --check` 和 `git status --short`；生成后的 `index.html` 必须随数据更新。

## 内容验收
- 原著链接和站内解读分开，站内旧稿不得冒充原文。
- 文章日期有精度，写作、发表、获知日期不偷换。
- 心理、争议、因果分析提供足够证据等级与限制性措辞。
- 同一著作 ID 唯一，旧稿保留但不重复占据卷次。
- Markdown 原始 Git blob SHA 必须匹配迁移清单；所有非空旧 HTML 必须链接其独立 CSS，且不再含 `<style>` 区块。
- 发现空文件时保留问题记录，不能自动填充伪造正文。
- 未核实版权之前不搬运外部全文。
- UI 的检索和筛选可用，空状态清晰，移动端及键盘可访问。

## 阻断
frontmatter 不符合约定、伪造 source URL、用后来的证据说当时已知、生成脚本失败、数据校验失败。

## 报告模板
已执行命令及退出码；已核实项目；需要人工核实项目；未进行的浏览器/网络测试。未运行的测试不能写“已通过”。
