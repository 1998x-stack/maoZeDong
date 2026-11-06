# OpenCode Skills · 历史研究流水线

OpenCode 官方约定：每个技能一个 `.opencode/skills/<name>/SKILL.md`，开头包含 `name` 和 `description` 的 YAML frontmatter；按任务加载，而非把所有技能一次性塞入上下文。

| 阶段 | 技能 ID | 使用场景 | 主要产物 |
| --- | --- | --- | --- |
| 1 | `source-research` | 查找《毛选》文章、原始材料、回忆与学术研究 | 来源清单、核对记录 |
| 2 | `edition-comparison` | 比较初版、选集编订本、回忆录版本 | 版本谱系、逐条差异 |
| 3 | `time-slice` | 冻结历史节点、还原现场与不确定性 | T0 形势面板、信息边界 |
| 4 | `actor-model` | 研究人物职权、信息渠道、认知分歧 | 人物信息矩阵 |
| 5 | `decision-mapping` | 会议、命令、组织执行、政策修正 | 争论与权力演变图 |
| 6 | `decision-sandbox` | 历史替代方案、受约束反事实 | 决策树与可行性说明 |
| 7 | `evidence-audit` | 核查断言、来源可靠性、时代错置 | A/B/C/D 证据审计 |
| 8 | `content-authoring` | 将研究成果写成结构化文章 | 页面数据与研究稿 |
| 9 | `research-ui` | 统一设计、开发可访问界面 | 可用页面与交互组件 |
| 10 | `content-qa` | 提交前检查来源、内容、数据、UI | 测试报告和阻断项 |

## 触发示例

- “整理《实践论》的不同版本”：`edition-comparison` + `source-research`
- “冻结1935年1月的遵义会议”：`time-slice` + `actor-model` + `decision-mapping`
- “推演当时可能有哪些现实选择”：`decision-sandbox` + `evidence-audit`
- “把研究结果做成专题页面”：`content-authoring` + `research-ui` + `content-qa`
- “把旧 HTML 迁移到统一内容模型”：`content-authoring` + `content-qa`

## 先后关系和禁止项

1. **先确定原著/报告身份**，再写解释；外部编者按不是毛泽东在写作时的观点。
2. **先冻结时点再建人物模型**；不能用后来被证明的结论填补当时的情报空白。
3. **先核对来源再发布结论**；缺少核心证据则保留问题，或标记为推断。
4. 历史数据不能填写未经定义的概率百分比、精确得分或“人物当时一定想”。
5. 不把“站内旧报告存在”当作“该文章原文已经收录”。

## 资源

- 共同研究标准：`.opencode/references/epistemic-policy.md`
- 页面元数据：`data/works.json`
- 索引：`https://www.marxists.org/chinese/maozedong/index.htm`
- 重构说明：`docs/ARCHITECTURE.md`
- 本地检查：`node scripts/validate-content.mjs && node scripts/build-site.mjs`

## 五环调度入口
- **five-ring-decision-research**：五环 Prompt V1.0 总研究入口；协调现有 time-slice、actor-model、decision-mapping、decision-sandbox、evidence-audit 等技能。
- **article-progressive-optimization**：针对全部旧 MD/HTML 的 P0—P4 分批迁移入口；从证据核对到结构化原创新稿及双格式发布。
方法细则：.opencode/references/five-ring-methodology.md；迁移路线：docs/FIVE_RING_ROADMAP.md。
