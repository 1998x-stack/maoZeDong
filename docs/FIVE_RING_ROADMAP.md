# 五环决策研究与全仓 MD/HTML 分阶段迁移

本仓库已将旧研究稿迁入 reports/md、reports/html，并将 CSS 提取到 reports/css。五环系统以此为现存基础，不回迁文件也不覆盖原稿；全部路径须以 data/migrations/report-files.json 为迁移依据。

| 阶段 | 目标 | 产物 | 验收 |
| --- | --- | --- | --- |
| P0 Inventory | reports/md 和 reports/html 三位编号文件组配对、大小与空文件检查 | data/legacy-inventory.json | inventory-legacy --check |
| P1 Evidence | 作品身份、版本、T0 与关键论断核查 | source ID、定位、争议与未证清单 | 人工核对 |
| P2 Five rings | 认识现实→识别结构→比较选择→组织执行→反馈纠偏 | research/articles/<id>.json | A/B/C/D 与时间截面复核 |
| P3 Publish | 同一份研究数据生成 MD 与 HTML | research/published/<id>.md + .html | build-research --check |
| P4 QA | 审核史料、前端、内容模型及生成物 | 验收记录 | validate-content + audit-report-css + tests |

P0 仅表示文件已发现；P2/P3 status=draft 仅代表研究草案，并不自动标为已审校历史事实。

优先研究原著目录已经登记的《反对本本主义》，再分批推进《湖南农民运动考察报告》《实践论》《矛盾论》。尚未登记正式来源的旧稿需要先解决来源、版本与时间问题，不可猜测外部 URL。空文件不自动填充；目录外公考资料不纳入毛选。

技术设计：data/works.json 记录 canonical 身份、原著与旧稿映射；data/legacy-inventory.json 记录已迁移文件的机器盘点；research/articles/*.json 是五环研究唯一编辑源；research/published/*.md|html 为同源生成物；web/research.css 用于新研究阅读界面，不修改 reports/css 的旧稿样式。旧稿路径保持不变。

验收：node scripts/inventory-legacy.mjs --check；node scripts/build-research.mjs --check；node scripts/validate-content.mjs；node scripts/build-site.mjs；node scripts/audit-report-css.mjs；node --test tests/*.test.mjs。未运行不得声称测试通过。

## 本批 P2/P3：三篇研究草案
本批对《湖南农民运动考察报告》《实践论》《矛盾论》各建立一份结构化研究数据，包含五环命题、人物信息、历史时间线与版本分层。已同步生成 Markdown/HTML 并接入作品目录。均标注 `status=draft`；P1 的逐版全文校勘和 P4 的人工历史审稿尚未完成。不要把构建和 CI 通过理解为史料鉴定完成。

## 第二批 P2/P3：1928—1930年根据地决策组

本批新增三份草案：`mao-1928-red-power`、`mao-1928-jinggang`、`mao-1930-spark`，每篇含五环、T0、人物与组织的信息差、版本谱系、备选方案以及来源与争议。作品目录已接入新版HTML；所有 `reviewStatus` 仍为 `catalogued`。P1全面档案校勘、P4独立历史学审校仍未完成。

专项核对重点：1928年10月原决议与后期定本；井冈山1928年11月报告的三份传递渠道及1929年中央未收件的时间差；1930年林彪原来信、1944年选编、1948年匿名请求和1951年改题的版本谱系。

## 第三批 P2/P3：社会联盟、组织制度和1937年党内生活
- `mao-1925-class-analysis`：1925年初刊和1926、1951年版本比勘，社会阶层与联盟判断的信息边界。
- `mao-1929-party-thought`：1929年六至十二月红四军党内争论、陈毅中央汇报与九月来信、古田决议形成过程。
- `mao-1937-liberalism`：1937年抗大内部刊物、1942年公开刊发、同题异文与批评—反馈机制。

三篇各20条证据分级命题，并新增行动者信息、时间线、版本谱系和待证清单。P2研究草案与P3双格式自动生成已完成；P1原始文本逐段核对和P4历史学人工审校仍未完成。所有 `reviewStatus` 继续保持 `catalogued`。