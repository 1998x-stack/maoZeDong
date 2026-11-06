---
name: content-authoring
description: 将毛泽东著作研究、人物传记、会议及历史事件写成可追溯专题，维护作品唯一 ID、时间字段、史料引用与旧报告链接，分离原著和研究解释。
license: MIT
compatibility: opencode
metadata:
  domain: publishing
  stage: production
---
# 结构化历史内容写作

## 输入
经来源审计的著作/事件、明确的 T0、人物与组织资料、核心问题和面向读者的研究范围。

## 内容模型
- `work`：作品身份、书目和原文链接，不等于原稿全文。
- `event`：事件节点、信息边界、决策、执行与反馈。
- `actor`：人物在特定时点的职务、渠道、资源与判断。
- `analysis`：对比、解释和争议，必须引用 source ID。

## 写作路径
1. 用可验证的问题开篇，不预设结论。
2. 恢复 T0 历史现场、主要行动者及不同渠道的信息。
3. 把直接引语与限制性推断明确区分，不写心理小说。
4. 展示当时的竞争性方案，说明收益、条件与失败成本。
5. 决策形成与组织执行分开写。
6. 只在事后部分揭示结果、预期差距、纠偏与认识更新。
7. 逐个重要判断附 source ID、证据等级及版本定位。
8. 将同题多个 HTML/MD 旧稿链接到一个 canonical work ID，不把它们称为“原文”。

## 输出
修改 `data/works.json` 必须遵守 `docs/CONTENT_MODEL.md`；新研究须保留审校状态。交由 `evidence-audit` 与 `content-qa` 最终审查。

## 限制
不将公务员备考资料列进毛选目录；不复制未经授权的外站长篇内容。
