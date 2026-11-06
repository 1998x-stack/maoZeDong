# 作品目录与证据数据契约

`data/works.json` 是项目的作品主表，字段：

| 字段 | 说明 |
| --- | --- |
| `id` | 稳定、唯一的 canonical work ID |
| `title` | 该原文来源页面的标题 |
| `volume` | 《毛泽东选集》卷号，正整数 |
| `period` | 历史分期，不等同人物价值判断 |
| `date` | `YYYY` / `YYYY-MM` / `YYYY-MM-DD` |
| `datePrecision` | `year` / `month` / `day`，与日期一致 |
| `topics` | 用于检索的主题标签数组 |
| `question` | 开放的历史研究问题，不是预设评价 |
| `sourceUrl` | 经逐篇打开确认的原著网页地址 |
| `sourceLabel` | 原文来源性质/版本局限说明 |
| `reviewStatus` | `catalogued` / `in_review` / `verified` |
| `legacyReports` | 迁移后 `reports/md/` 或 `reports/html/` 中研究评论文件的仓库相对路径 |
| `notes` | 来源不确定性或版本考证备注 |

## 数据边界
一部作品可以有多个版本 `edition`、多份研究稿 `analysis` 和多处史料 `source`；不能把这些对象混成一个 Markdown 正文。

扩展模型建议：
- `source`: source_id, type, edition, published_at, available_at, locator, rights
- `claim`: claim_id, proposition, source_ids, grade, counterevidence
- `actor`: actor_id, t0, authority, known, possible, unknown, sources
- `decision`: decision_id, t0, alternatives, constraints, execution, feedback

## 审校状态
`catalogued` 只表示目录及 URL 已登记；不代表全文、历史解释、版本和版权均经过核查。
