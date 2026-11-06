---
name: source-research
description: 核实毛泽东著作目录、史料出处、会议电报与研究文献。用于为党史专题建立原文链接、文献身份、历史事实来源与可追溯的 source ID。
license: MIT
compatibility: opencode
metadata:
  domain: history
  stage: discovery
---
# 史料发现与来源登记

## 输入
问题、地理/时间范围、待核实的著作或事件、可访问的原始资源。

## 不可省略的前置步骤
1. 查询中文马克思主义文库毛泽东目录：https://www.marxists.org/chinese/maozedong/index.htm 。
2. 逐个打开具体篇目，记录实际 URL、页面标题、标注日期、所属卷、版本/注释情况；不通过标题推测 slug。
3. 外部网站中的编者按和正文分别记录；正文也可能是后期编订版本。
4. 查询可核对的同期书信、文件、会议记录、电报，以及高质量研究，注明档案馆/出版社/卷页/公开日期。
5. 独立判断不同网页是否仅转引了同一篇资料。

## 工作流程
- **定义问题**：只搜索能回答具体问题的材料；先列出“必须证实的五个断言”。
- **来源采集**：对每个材料建立 `source_id`, `title`, `creator`, `material_type`, `event_time`, `published_at`, `edition`, `repository`, `url`, `locator`, `accessed_at`, `reuse_status`。
- **矛盾核对**：把日期、职务、地点、原话的冲突显式保存；不要强行合并。
- **时点处理**：材料在事后形成时，仅用于事后评估，不能自动放入 T0 情报集合。
- **版权处理**：遵守 https://www.marxists.org/admin/legal/terms-of-use.htm；未确认许可仅保留链接与原创摘要，不抓取转载整篇文章。
- **验收**：每条重要断言可追到明确来源及定位；无法验证标 `unverified`。

## 输出合同
来源登记表 + 三条最重要的证据缺口 + 待复核清单。推荐使用 `references/source-record.md` 模板。

## 不得
- 把《毛选》网站文本、网站脚注和毛泽东原始稿件视为天然一致。
- 在“找不到来源”时编造书名、页码、档案号、会议记录。
- 把新闻转载和其所引原始报告算成两个独立的相互验证来源。
