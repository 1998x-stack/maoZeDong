# 史境：毛泽东著作与党史决策研究

在史料约束下，研究著作写作的时代条件、人物所知与未知、组织权力、真实备选方案、执行与反馈。

## 在线原著与本站内容有什么区别？

- **原著来源**：中文马克思主义文库毛泽东目录 https://www.marxists.org/chinese/maozedong/index.htm ，本站只建立可验证的文章链接和目录元数据。
- **本站旧稿**：根目录保留历史专题 HTML 和 Markdown；这些是研究报告，不是《毛泽东选集》原文，尚未完成逐条引证审校。
- **新作品目录**：`data/works.json`，首批 11 篇已逐一核对原文 URL 的样本；不代表已收录全部《毛选》。
- **版本意识**：MIA 展示的编订文本、后期编者按、初刊与手稿可能有差异，不能混称原始全文。
- **转载限制**：文章仅作外链，未核实转载权利前不复制原文全文。

## 从目录开始

打开根目录 `index.html` 即可本地浏览，无需安装依赖；通过搜索、卷次和历史阶段筛选作品，查看独立原著入口与旧研究稿。

## 开发与检查

建议 Node.js 22 或以上；无需第三方包。

```bash
node scripts/validate-content.mjs
node scripts/build-site.mjs
node --test tests/*.test.mjs
```

`index.html` 由 `data/works.json` 和 `web/template.html` 生成，**不要手工编辑**。CSS 在 `web/styles.css`，前端交互在 `web/app.js`。

## OpenCode 研究能力

专业技能位于 `.opencode/skills/`。OpenCode 将根据名称与 description 按需加载，详见 [.opencode/skills/README.md](.opencode/skills/README.md)。

研究链：`source-research` → `edition-comparison` → `time-slice` → `actor-model` → `decision-mapping` → `decision-sandbox` → `evidence-audit` → `content-authoring` → `research-ui` → `content-qa`。

项目共享规则见 [AGENTS.md](AGENTS.md)，架构说明见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)，已知旧稿问题见 [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md)。

## 研究原则

- 不要让 T0 的人物拥有后来才出现的信息。
- 形式职务、实际资源与主观认知分别研究。
- 同期直接材料、事后回忆、学者解释与编者按分层记录。
- 真实被提出的方案与研究者构造的反事实分别标注。
- 所有重要论断应能返回具体来源和定位；证据不足时明示不确定。
- 保留不同版本和研究争议，禁止伪造引语、档案号或人物内心独白。

## 迁移状态

当前是结构化重构的第一阶段：统一数据与研究技能，搭建可使用的阅读目录，同时原有 HTML/Markdown 完整保留。研究级全文审校、整套选集目录、复杂的时间截面交互及人物关系网络属于后续增量。

## 五环决策研究系统与渐进迁移
五环专业 Prompt：.opencode/skills/five-ring-decision-research/SKILL.md；全文方法规范：.opencode/references/five-ring-methodology.md。
文章阶段优化：.opencode/skills/article-progressive-optimization/SKILL.md；路线图：docs/FIVE_RING_ROADMAP.md。
旧稿 61 组盘点见 data/legacy-inventory.json；P0 仅代表文件已发现，不是内容已审校。
首篇新稿为《反对本本主义》五环研究草案：research/published/mao-1930-against-bookishness.html。研究 JSON 为唯一编辑源，两种呈现文件均由脚本生成，旧稿保持不变。

同步校验：node scripts/inventory-legacy.mjs --check；node scripts/build-research.mjs --check。
