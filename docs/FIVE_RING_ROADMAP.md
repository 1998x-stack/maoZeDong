# 五环决策研究与全仓 MD/HTML 分阶段迁移

仓库已有 10 个专业 Skill、首批 11 条作品目录，以及一批历史研究旧稿。新增技能只负责方法调度；不把旧稿自动认定为可靠史料，不将原著全文迁移到仓库。

| 阶段 | 目标 | 产物 | 验收 |
| --- | --- | --- | --- |
| P0 Inventory | 根目录所有三位编号研究稿配对、大小与空文件检查 | data/legacy-inventory.json | inventory-legacy --check |
| P1 Evidence | 作品身份、版本、T0、至少五项重要断言 | source ID、定位、争议与未证清单 | 人工核对 |
| P2 Five rings | 认识现实→识别结构→比较选择→组织执行→反馈纠偏 | research/articles/<id>.json | A/B/C/D 与时间截面复核 |
| P3 Publish | 同一份研究数据生成 Markdown 与 HTML | research/published/<id>.md + .html | build-research --check |
| P4 QA | 审核事实、前端、内容模型及两份输出 | 验收记录 | validate-content + tests + 浏览器审阅 |

**P0 意味文件已被机器发现，不代表内容审核。P2/P3 status=draft 仅代表研究草案。**

优先顺序：已登记来源的反对本本主义为试点；再研究湖南农民运动考察报告、实践论、矛盾论；其他已登记来源的作品随后推进；未登记的作品先确认原文身份，不能根据文件名猜测 URL。公务员考试知识点系统属于目录外；空文件不能自动填充。

技术设计：data/works.json 记录 canonical 作品、来源与旧稿映射；data/legacy-inventory.json 是根文件盘点；research/articles/*.json 是新研究唯一编辑源；research/published/*.md|html 是生成物且不手工编辑；web/research.css 提供独立阅读样式，旧稿保持原路径。每批最多 1—3 篇，保留来源疑点与待复核条目。

验收命令：node scripts/inventory-legacy.mjs --check；node scripts/build-research.mjs --check；node scripts/validate-content.mjs；node scripts/build-site.mjs；node --test tests/*.test.mjs；git diff --check。未运行不得声称通过。
