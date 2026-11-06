# 架构与迁移路线

## 本次实施范围
原仓库逐篇 HTML/Markdown 研究报告已分类迁移，Markdown 原始内容不修改；HTML 的 `<style>` 已提取为逐篇 CSS。新的结构：

- `reports/md/`：原 Markdown 研究稿，按原文件名保存。
- `reports/html/`：原 HTML 研究页，使用外部样式表。
- `reports/css/`：按研究页拆分的 58 份独立 CSS。
- `data/migrations/report-files.json`：原路径与新路径的可追溯映射。
- `data/works.json`：唯一的毛选作品目录、卷次、时间精度、外部原著链接、旧研究稿映射。
- `web/template.html`：离线优先的目录 UI 模板。
- `scripts/build-site.mjs`：把作品数据嵌入模板，生成根目录 `index.html`；不可手改生成物。
- `scripts/validate-content.mjs`：校验作品字段、来源链接、技能 frontmatter 和关键约束。
- `.opencode/skills/<name>/SKILL.md`：按任务加载的专业研究技能。
- `AGENTS.md`：时间截面、证据等级、版本与版权的仓库级约束。
- `docs/CONTENT_MODEL.md` 和 `docs/SOURCE_POLICY.md`：长期维护规范。

## 读者路径
按卷/时期找到作品 → 到原站读原著 → 回本站看旧研究稿及关联问题 → 后续支持时间截面、人物视角与决策沙盘。

## 迁移策略
1. 同题旧稿合并到一个 canonical work ID，物理文件迁移至 `reports/`；原路径保留在迁移映射中。
2. 来源 URL 优先逐篇核对，不猜测 slug 或把目录页当正文页。
3. 旧 HTML 缺少出处或为后见式叙述时仍可作为“未审校研究稿”阅读。
4. 零字节文件登记为待修复，不自动生成内容或删除。
5. 非毛选资料（例如公考笔记）不纳入毛选作品目录。
6. 研究稿升为已审校须通过史料和版权人工审核。

## 下一阶段
补齐第一至第五卷的逐篇链接与版本信息；新增事件、人物、命题与证据关系模型；实现真正带 T0 信息锁的会议沙盘和证据抽屉。
