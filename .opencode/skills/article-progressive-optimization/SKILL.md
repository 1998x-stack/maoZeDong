---
name: article-progressive-optimization
description: 按 P0-P4 五阶段逐篇优化毛泽东著作研究仓库中的 MD/HTML：自动盘点、史料核查、五环分析、同源双格式发布和质量检验；保留原有旧稿、源链接与证据缺口。
license: MIT
compatibility: opencode
metadata:
  domain: publishing
  stage: migration
---
# 逐篇文章优化与双格式生成

先读 docs/FIVE_RING_ROADMAP.md 和 .opencode/references/five-ring-methodology.md，研究时加载 five-ring-decision-research、source-research、evidence-audit、research-ui 与 content-qa。

## 阶段门禁
- **P0 盘点**：执行 node scripts/inventory-legacy.mjs --check。按reports/md/ 与 reports/html/ 中按三位编号识别 MD/HTML 是否配对、空文件与目录是否关联。P0 不等于已核实。
- **P1 核查**：确定原著版本、发表/写作时间、T0、史料 A/B/C/D 与争议。缺少材料不提升 reviewStatus。
- **P2 研究**：建立原创结构化研究 JSON，五环各环必须有研究命题、源 ID 或明确推断；注明作者当时可知与后来的评估。
- **P3 发布**：通过 node scripts/build-research.mjs 从唯一数据源同时生成 research/published 下的 MD 与 HTML。保留旧稿，目录新增独立研究草案链接。
- **P4 审校**：运行库存检查、生成一致性检查、内容校验、测试和浏览器抽检。只有人工确认来源和事实后才能提升已核实状态。

## 实施边界
按 1—3 篇成批推进，先试点反对本本主义，再扩展其他篇目。原目录尚未映射的文章先核对来源，不推测外部文章地址；空文件保留待修复，不伪造正文。所有时间截面与史料等级遵循五环 Skill。

## 交付
每批附已处理路径、P0-P4 真实状态、证据缺口、版本问题、生成产物与测试结果。禁止以“已生成 HTML”代替史料审校。
