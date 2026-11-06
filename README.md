<div align="center">

# 史境 · Mao Zedong Works & Historical Decision Studies

**以原著为入口，以史料为边界，以当时人的信息世界为研究中心。**

一个面向《毛泽东选集》与中国共产党历史的开放式阅读、史料整理和历史决策研究项目。

[开始阅读](#快速开始) · [项目架构](#项目架构) · [研究方法](#研究方法) · [OpenCode Skills](#opencode-skills) · [参与贡献](#参与贡献)

[![Validate research platform](https://github.com/1998x-stack/maoZeDong/actions/workflows/validate.yml/badge.svg)](https://github.com/1998x-stack/maoZeDong/actions/workflows/validate.yml)

</div>

---

## 项目简介

**史境**（History, Evidence & Decision）旨在把经典著作阅读与历史现场研究连接起来。它不只整理“某篇文章提出了什么观点”，更重视这些观点**在什么条件下形成、回应了什么问题、依赖哪些信息、面临哪些不同意见，以及怎样经过组织执行与历史实践的检验**。

> 让每一篇著作都有历史现场，让每一个重大决定都有真实的选择空间，让每一种人物观点都有其信息条件，让每一项重要结论都能回到史料。

本仓库的长期目标是建设可检索、可溯源、可持续修订的党史研究资料与交互平台。目前已具备**静态作品目录、旧研究稿分类归档、CSS 独立化、OpenCode 研究技能与自动化质量校验**等基础设施。完整《毛选》篇目、研究级史料审核、互动历史决策沙盘及知识图谱仍处于后续建设阶段。

**特别说明：本站旧研究稿是后期解读，不是毛泽东著作原文；本站当前也不是《毛泽东选集》全文镜像。** 阅读原著请通过对应的外部原文入口访问。

## 项目现状

以下是**当前仓库内容量**，不是已完成史料审核的数量。

| 类别 | 当前状态 | 说明 |
| :--- | :--- | :--- |
| 原著来源目录 | **11 篇样本** | `data/works.json` 已登记具体文章链接；尚非完整分卷目录 |
| 历史研究 Markdown | **63 份** | 存放于 `reports/md/`，保留原稿内容 |
| 历史研究 HTML | **62 份** | 存放于 `reports/html/`，其中 **4 份为空白占位文件** |
| 独立页面 CSS | **58 份** | 存放于 `reports/css/`，由非空历史 HTML 提取 |
| OpenCode 研究技能 | **12 个** | 位于 `.opencode/skills/`，覆盖资料研究到发布验收 |
| 自动化校验 | **已配置** | Node.js 测试、目录校验、CSS 审计、GitHub Actions |

### 已实现

- **统一作品目录**：按卷次、历史时期、主题和关键词筛选已有样本。
- **双入口阅读**：区分“前往外部原著”和“查看仓库内旧研究稿”。
- **结构化元数据**：作品 ID、日期精度、来源 URL、审校状态和旧稿关联。
- **归档与样式分离**：Markdown、HTML、CSS 分目录保存；旧路径可通过迁移清单追踪。
- **研究工作流**：12 个 OpenCode Skills 及全局 `AGENTS.md` 规则。
- **四批研究草案覆盖首批11篇作品目录**：从《反对本本主义》试点扩展到其余十篇（前3批九篇及本批《论持久战》），统一由结构化JSON生成Markdown/HTML；这不意味着全部史料已审校。
- **质量门禁**：内容格式、文件完整性、页面生成与样式链接检查。

### 尚未实现

- 全套《毛泽东选集》逐篇、逐版本收录与审校。
- 有完整证据链接的人物—组织—事件知识图谱。
- 可在网页中实际操作的时间冻结、决策树和多方沙盘。
- 全部旧研究报告的逐条史实核查、学术同行审阅及视觉回归测试。

上述目标代表开发方向，**不应视为当前网页已经提供的功能**。

## 快速开始

### 1. 获取仓库

```bash
git clone https://github.com/1998x-stack/maoZeDong.git
cd maoZeDong
```

### 2. 阅读目录和旧报告

根目录 `index.html` 是静态阅读入口。可以使用浏览器直接打开，也可以在仓库根目录启动本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。在目录里选择作品，可进入相应的外部原文链接或查看本地 `reports/html/` 研究页面。

**使用说明：**

- 当前页面内的筛选依赖浏览器 JavaScript，静态文件本身不需要数据库或后端。
- 原文链接指向外部网站，阅读需要网络连接。
- 部分旧 HTML 使用外部字体、图标或动画 CDN；离线时其视觉效果可能不完整。
- 直接通过 GitHub 浏览 `index.html` 源文件，不等于已经部署在线阅读站点。

### 3. 开发、生成与验证

构建与校验建议使用 **Node.js 22 或以上**；目前无需 `npm install`。

```bash
# 校验作品目录、来源路径与技能元数据
node scripts/validate-content.mjs

# 核对旧研究文件清单
node scripts/inventory-legacy.mjs --check

# 核对研究 JSON 与生成的 MD / HTML
node scripts/build-research.mjs --check

# 从数据和模板重新生成首页
node scripts/build-site.mjs

# 审核旧 HTML 与独立 CSS 的关联和归档完整性
node scripts/audit-report-css.mjs

# 执行自动化测试
node --test tests/*.test.mjs
```

`index.html` 是**生成文件**，由 `data/works.json` 与 `web/template.html` 生成。不要直接编辑生成结果；修改作品目录后，应重新运行 `build-site.mjs`，并在提交中包含更新后的首页。

检查现有 HTML 是否仍含待提取的 `<style>` 区块：

```bash
node scripts/extract-report-css.mjs --check
```

若为**新增的旧式 HTML 页面**提取 CSS，可以在确认不会覆盖已有文件后运行：

```bash
node scripts/extract-report-css.mjs
```

该脚本不会自动清理所有元素级 `style="..."` 属性；这类样式可能与页面脚本或 SVG 交互有关，需要逐页验证再迁移。

## 项目架构

```text
maoZeDong/
├── .github/
│   └── workflows/validate.yml        # CI：内容、生成、CSS 与测试
├── .opencode/
│   ├── references/                    # 共同的史料与认知规范
│   └── skills/                        # 12 个专业研究技能
├── data/
│   ├── works.json                     # 作品目录的单一数据源
│   ├── legacy-inventory.json          # 历史研究稿盘点清单
│   └── migrations/report-files.json   # 历史文件迁移映射
├── docs/
│   ├── ARCHITECTURE.md                # 架构与迁移策略
│   ├── CONTENT_MODEL.md               # 内容数据契约
│   ├── SOURCE_POLICY.md               # 来源、版本与转载边界
│   ├── FIVE_RING_ROADMAP.md           # 五环研究分阶段迁移路线
│   └── KNOWN_ISSUES.md                # 已知问题
├── research/
│   ├── articles/                      # 研究 JSON（唯一编辑源）
│   └── published/                     # 同源生成的研究 MD / HTML
├── reports/
│   ├── md/                            # 历史 Markdown 研究稿
│   ├── html/                          # 历史 HTML 研究页
│   ├── css/                           # 每篇历史页面独立 CSS
│   └── README.md                      # 归档及样式拆分说明
├── scripts/
│   ├── validate-content.mjs           # 校验元数据与文件关联
│   ├── inventory-legacy.mjs           # 旧稿盘点一致性检查
│   ├── build-research.mjs             # 研究 MD / HTML 同源生成
│   ├── build-site.mjs                 # 生成首页
│   ├── audit-report-css.mjs           # 审计旧页面样式
│   └── extract-report-css.mjs         # 提取新旧式页面的 <style>
├── tests/                             # Node.js 自动化测试
├── web/
│   ├── template.html                  # 首页语义结构
│   ├── styles.css                     # 主站 UI 设计
│   ├── research.css                   # 五环研究页面样式
│   └── app.js                         # 检索、筛选和作品信息
├── AGENTS.md                          # 仓库级历史研究规范
├── opencode.json                      # OpenCode 配置
├── index.html                         # 生成后的静态入口
└── README.md
```

**设计约束：** `data/works.json` 管理作品身份，`reports/` 保留历史研究稿，`research/articles/` 是新研究的唯一编辑源、`research/published/` 是对应生成物，`web/` 负责阅读界面，`.opencode/skills/` 负责研究过程，`docs/` 描述证据与内容边界。这几个层次不应混写。

## 研究方法

### 历史决策的五环研究框架

本项目采用五环框架组织历史分析；**它是本项目提炼的方法，不是毛泽东本人提出的统一公式**。

```text
认识现实 → 识别结构 → 比较选择 → 组织执行 → 反馈修正
    ↑                                           │
    └──────────── 下一轮调查与判断 ────────────┘
```

| 环节 | 主要研究问题 |
| :--- | :--- |
| **认识现实** | 此刻发生了什么？当事人通过什么渠道知道？哪些情报延迟、失真或缺失？ |
| **识别结构** | 冲突、利益、制度、资源与组织权限如何制约行动？ |
| **比较选择** | 当时真正提出过哪些方案？哪些只是研究者设想？各自的实施条件和失败成本是什么？ |
| **组织执行** | 决议如何形成和传达？谁能够动员资源？地方如何理解和落实？ |
| **反馈修正** | 预期与结果有何差异？意外如何出现？人物与组织之后修正了什么判断？ |

### 冻结历史时点（T0）

重大历史事件研究首先指定一个明确时点 `T0`。**在解释 T0 的人物判断时，不使用后来才形成或传播的信息。**

```text
T0：1938 年 5 月

当时可知：
  战争进程、已收到的报告、各方公开判断、
  组织和资源状况。

当时不确定：
  未来战争进程、外部力量的后续行动、
  后来才公布或才被获知的信息。

T0 之后：
  实际执行、外部变化与最终结果
  ——只能放进“事后复盘”。
```

这能够避免用后来的结果反推当事人“当时本应知道”，也避免把不同人物压缩成完全一致的“中央观点”。

### 史料分级与争议处理

研究中同时记录**材料性质**和**判断可靠程度**，二者不能混为一谈。

| 级别 | 判断含义 | 写作要求 |
| :--- | :--- | :--- |
| A | 可核对的直接材料支持 | 给出版本、日期、原始出处及定位 |
| B | 多项相互独立的证据支持 | 说明证据之间的关系与限制 |
| C | 基于材料的合理推断 | 明示“可能”“可以推测”及推断条件 |
| D | 材料不足、相互冲突或存在争议 | 并列不同解释，保留未解决问题 |

例如，某人多年后的回忆可以证明其后来如何叙述一件事，却**不能自动证明他在事件发生时已经知道或相信回忆中的所有细节**。

研究规范详见 [AGENTS.md](AGENTS.md) 与 [史料和版本政策](docs/SOURCE_POLICY.md)。

## OpenCode Skills

项目采用可组合的 **12 个 OpenCode Skills**。每个技能定义任务边界、输入、执行步骤、产出要求及质量限制。

| 技能 | 主要职责 |
| :--- | :--- |
| [`source-research`](.opencode/skills/source-research/SKILL.md) | 原著索引、史料来源、档案和研究资料定位 |
| [`edition-comparison`](.opencode/skills/edition-comparison/SKILL.md) | 初稿、初刊、编订本与注释的版本考证 |
| [`time-slice`](.opencode/skills/time-slice/SKILL.md) | 历史时点冻结、信息可得性与情报缺口 |
| [`actor-model`](.opencode/skills/actor-model/SKILL.md) | 人物职权、信息渠道、经验和风险判断 |
| [`decision-mapping`](.opencode/skills/decision-mapping/SKILL.md) | 会议争论、权力关系、决策形成和组织执行 |
| [`decision-sandbox`](.opencode/skills/decision-sandbox/SKILL.md) | 有史料边界的备选方案与条件性推演 |
| [`evidence-audit`](.opencode/skills/evidence-audit/SKILL.md) | 引用、时序、因果、心理推断与争议审查 |
| [`content-authoring`](.opencode/skills/content-authoring/SKILL.md) | 结构化研究内容与作品数据编写 |
| [`research-ui`](.opencode/skills/research-ui/SKILL.md) | 历史研究的阅读体验、信息层级和交互设计 |
| [`content-qa`](.opencode/skills/content-qa/SKILL.md) | 史料与工程质量门禁 |
| [`five-ring-decision-research`](.opencode/skills/five-ring-decision-research/SKILL.md) | 五环决策研究框架与历史分析统筹 |
| [`article-progressive-optimization`](.opencode/skills/article-progressive-optimization/SKILL.md) | P0–P4 分阶段文章迁移、研究与双格式发布 |

**任务示例**

- “研究《反对本本主义》的形成背景与不同版本” → `source-research` + `edition-comparison` + `evidence-audit`
- “重建遵义会议前后的权力与信息变化” → `time-slice` + `actor-model` + `decision-mapping`
- “分析1938年《论持久战》形成时的判断空间” → `time-slice` + `decision-sandbox` + `evidence-audit`
- “把核实后的新作品加入阅读站” → `content-authoring` + `research-ui` + `content-qa`
- “按五环逐篇改进并生成研究 Markdown / HTML” → `five-ring-decision-research` + `article-progressive-optimization`

查看 [Skills 完整指南](.opencode/skills/README.md)。技能文件提供研究**工作规范**，不代表网站目前已实现所有可视化研究功能。

### 五环研究试点与逐篇优化

最新 `main` 已引入“五环决策研究系统”和 P0–P4 渐进式文章优化流水线：

| 阶段 | 工作内容 | 核心产物 |
| :--- | :--- | :--- |
| P0 · 盘点 | 核对现有研究稿、配对关系与空文件 | `data/legacy-inventory.json` |
| P1 · 史料 | 检查原著身份、版本、时间和证据缺口 | 来源与争议记录 |
| P2 · 五环 | 分析现实、结构、选择、执行与反馈 | `research/articles/<id>.json` |
| P3 · 发布 | 从研究 JSON 同步生成 Markdown 和 HTML | `research/published/<id>.md` 与 `.html` |
| P4 · 验收 | 数据与生成物检查，加上独立的历史证据审查 | CI 与人工审稿记录 |

首批试点为**《反对本本主义》**：
[结构化 JSON](research/articles/mao-1930-against-bookishness.json) ·
[研究 Markdown](research/published/mao-1930-against-bookishness.md) ·
[研究 HTML](research/published/mao-1930-against-bookishness.html)。

**这是研究草案，不是经过逐条史料审定的正式结论。** 编辑 `research/articles/` 下的 JSON，运行 `node scripts/build-research.mjs` 同步生成文档，再使用 `--check` 检查生成一致性。旧稿仍保留在 `reports/`，不会被流水线覆盖。

参见 [五环研究方法](.opencode/references/five-ring-methodology.md) 与 [P0–P4 迁移路线图](docs/FIVE_RING_ROADMAP.md)。

## 内容与来源

### 原著来源

首要检索入口为 **[中文马克思主义文库 · 毛泽东著作目录](https://www.marxists.org/chinese/maozedong/index.htm)**。

本站现阶段仅保存已定位篇目的必要目录信息、研究问题和原文链接。在线页面可能采用后期编辑文本，也可能包含编者按、注释或版本变动，不能直接等同于写作时的手稿。

### 三类内容必须分开

| 内容 | 所在位置 | 身份 |
| :--- | :--- | :--- |
| 外站原著链接 | `data/works.json` → `sourceUrl` | 原著阅读入口，不是本站镜像 |
| 历史研究旧稿 | `reports/md/`、`reports/html/` | 待持续核查的后期研究与解读 |
| 项目研究规范 | `.opencode/`、`docs/`、`AGENTS.md` | 方法、证据标准和写作规则 |

`reviewStatus` 的 `catalogued` 只表示已经登记作品目录信息；**不意味着正文、史实或版权状态已经全部核实**。

有关内容模型、版本差异和使用边界，请查看 [内容数据契约](docs/CONTENT_MODEL.md) 与 [来源政策](docs/SOURCE_POLICY.md)。

## 参与贡献

欢迎通过 GitHub Issues 或 Pull Requests 提交史料线索、原文版本信息、错误校正、内容质量改进与阅读体验修复。

提交前建议：

1. **明确改动对象**：新增作品目录、修正旧研究报告、完善原始来源或修改页面代码，分别处理。
2. **保留可追溯证据**：历史事实提供出处和定位；不确定结论注明证据限制。尽量保留原有材料，避免无说明覆盖。
3. **保证数据一致**：同一作品使用唯一 ID，旧稿关联路径正确，新增页面遵守 `reports/` 目录规范。
4. **通过本地检查**：运行上述 Node.js 命令，并把重新生成的 `index.html` 与元数据一并提交。
5. **解释取舍与风险**：PR 描述中注明事实依据、被修改的历史判断、尚有争议的问题，以及 UI 兼容性影响。

提交前可使用以下一组命令：

```bash
node scripts/inventory-legacy.mjs --check
node scripts/build-research.mjs --check
node scripts/validate-content.mjs
node scripts/build-site.mjs
node scripts/audit-report-css.mjs
node --test tests/*.test.mjs
git diff --check
git diff --exit-code -- index.html
```

自动化工作流：[`.github/workflows/validate.yml`](.github/workflows/validate.yml)。

## 路线图

- [x] 将历史研究稿分离到 Markdown / HTML / CSS 目录
- [x] 建立作品目录及旧文件迁移映射
- [x] 构建静态作品检索与原著外链入口
- [x] 建立 OpenCode 专业研究技能与证据规范
- [x] 引入五环研究系统及 P0–P4 文章优化流水线
- [x] 完成《反对本本主义》研究 JSON 和双格式草案试点
- [x] 增加目录校验、CSS 审计、自动化测试与 CI
- [ ] 补齐《毛泽东选集》逐篇目录及版本元数据
- [ ] 逐篇核对旧研究报告的重要断言与直接引文
- [ ] 建立人物、组织、事件、来源及命题之间的关联
- [ ] 实现带 T0 冻结与解冻的历史决策研究界面
- [ ] 完善访问性、移动端阅读与跨页视觉回归
- [ ] 研究和实施旧页面 URL 的部署级重定向策略

## 相关文档

- [仓库级研究规则（AGENTS.md）](AGENTS.md)
- [项目架构与迁移策略](docs/ARCHITECTURE.md)
- [内容模型](docs/CONTENT_MODEL.md)
- [来源与版本政策](docs/SOURCE_POLICY.md)
- [已知问题和待核查项目](docs/KNOWN_ISSUES.md)
- [历史 HTML / Markdown / CSS 归档指南](reports/README.md)
- [OpenCode Skills 使用指南](.opencode/skills/README.md)
- [五环研究方法规范](.opencode/references/five-ring-methodology.md)
- [文章渐进迁移路线图](docs/FIVE_RING_ROADMAP.md)

## 版权与使用声明

本项目旨在开展历史文献学习、史料整理、方法研究和软件开发。**原著、外部文章、历史图片与研究旧稿的权利状态可能不同**；可在线访问不代表可以任意复制、修改或重新发布。引用和转载请确认具体材料的适用权利与来源网站规则，参见 [马克思主义文库使用条款](https://www.marxists.org/admin/legal/terms-of-use.htm)。

**当前仓库未设置独立的 `LICENSE` 文件。** 在权利安排明确之前，不应据此推断整个仓库及其收录材料均已获得某种通用开源许可。

---

<div align="center">

**史料有边界 · 认知有条件 · 决策有选择 · 结论可追溯**

<sub>史境是持续建设中的历史研究项目。欢迎以证据、方法和代码共同完善它。</sub>

</div>

## 三篇著作的五环研究草案
本批新增《湖南农民运动考察报告》《实践论》《矛盾论》的结构化分析和 MD/HTML 双格式研究阅读页。每篇均有历史现场、时间截面、人物信息与版本沿革、五环的证据等级、备选方案和待核查问题；新稿独立于 `reports/` 旧稿。作品目录支持进入新版页面。

本批为 **P2 研究草案与 P3 同源发布**，并非历史论断都已审校。可运行 `node scripts/build-research.mjs --check` 与 `node --test tests/*.test.mjs` 验证生成一致性。

## 第二批：1928—1930年三个根据地决策专题

- [《中国的红色政权为什么能够存在？》](research/published/mao-1928-red-power.md)：1928年10月的地方政权存在条件、边界组织及主客观约束。
- [《井冈山的斗争》](research/published/mao-1928-jinggang.md)：1928年11月土地、贸易、给养、基层组织及报告延迟。
- [《星星之火，可以燎原》](research/published/mao-1930-spark.md)：1930年1月毛泽东与林彪对时局和组织发展的不同估量，及后来的改题与删改。

三篇均为 `status=draft` 研究草案，各自包含T0、行动者、版本链和五环证据命题，已从结构化JSON同源生成Markdown与HTML。独立史料审核尚未完成，不应将页面可读或CI通过视为历史结论全部证实。

## 第三批五环研究草案（1925／1929／1937）
- [《中国社会各阶级的分析》](research/published/mao-1925-class-analysis.md)：1925年初刊与后期版本差异、联盟判断和群体信息边界。
- [《关于纠正党内的错误思想》](research/published/mao-1929-party-thought.md)：红四军党内争论、中央九月来信与古田会议的组织决策形成。
- [《反对自由主义》](research/published/mao-1937-liberalism.md)：1937年内部传播、1942年公开发表与组织内真实意见反馈。

三篇均独立保留五环、T0、人物信息、决策方案、执行与反馈、版本谱系。Markdown与HTML由研究JSON同源生成，旧稿保留在 `reports/`。所有新稿仍为 **研究草案**，不表示全面史料审核完成；《论持久战》已于第四批新增研究稿。

## 第四批：1938年《论持久战》的历史决策与预测检验

- [五环研究 Markdown](research/published/mao-1938-protracted-war.md) · [五环研究 HTML](research/published/mao-1938-protracted-war.html) · [结构化研究 JSON](research/articles/mao-1938-protracted-war.json)
- 冻结1938年5月26日：认识徐州失守与局部胜利均无法证明整个战争的最终走向；强调国共双方此前均有持久战论述，研究具体分歧而非“独创标签”。
- 新版含25条分级命题、9组行动者信息、11个时间节点、5条版本传播节点、4项“1938年判断—事后结果”条件式检验和10项来源记录。
- 已与原有研究目录链接；截至本批，`data/works.json` 中的**11/11篇样本作品已有五环研究草案**。此处是目录覆盖率，不是全《毛选》或历史审校覆盖率。

**仍未完成**：1938年《解放》初刊与各订正本的逐字实物校勘、不同人物同期原稿比对、历史档案独立审校；所有新稿继续保留 `status=draft` 及 `reviewStatus=catalogued`。

## GitHub Pages 网站与新 UI

史境现新增编辑式研究首页：作品目录、主题阅读路径、历史年份导航、深链接、键盘搜索与移动端菜单。研究正文新增滚动进度、字号调整、当时与事后时间线切换、证据分级提示和结构化 JSON 来源入口。

- 设计和部署说明：[docs/PAGES_DESIGN.md](docs/PAGES_DESIGN.md)
- 静态发布包：node scripts/build-pages.mjs（输出 dist）
- 路径与资源校验：node scripts/check-pages.mjs
- Pages 部署流程：.github/workflows/pages.yml

在合并本 PR 后，须在 GitHub 仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions，然后查看 Actions 部署结果。默认的预期项目页面地址为 https://1998x-stack.github.io/maoZeDong/ ，只有部署成功后才能确认可访问。
