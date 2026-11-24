# 动作游戏研究：信息架构与内容模型 v0.1

- 日期：2026-11-11
- 状态：结构提案，待用户确认
- **分页粗稿（优先看）**：[rough-pages/index.html](rough-pages/index.html)。每个内容单独一页：发展 / 定义 / 难点 / 观点 / 对比 / 标尺 / 来源。
- 单页版（旧）：[rough-draft.html](rough-draft.html)。所有内容放在一页，太长，保留作对照。
- 详细交互示例：[interaction-demo.html](interaction-demo.html)。用于看完整组件和交互状态，内容比粗稿多一层结构说明。
- 示例源码：[demo-src/](demo-src/)；构建与冒烟测试见 [demo-src/README.md](demo-src/README.md)
- 预览截图：[分页首页](rough-pages/preview-index.png) · [分页对比](rough-pages/preview-comparison.png) · [分页观点](rough-pages/preview-voices.png) · [分页标尺](rough-pages/preview-rubric.png) · [单页旧版](rough-draft-preview.png) · [详细示例总览](previews/overview.png) · [矩阵](previews/compare-matrix.png) · [差距](previews/comparison-gap.png) · [单元格编辑](previews/cell-editor.png)
- 目标：把现有“概念图谱 + 检索”扩展为“发展史 + 定义 / 难点与观点 / 横向对比”的阅读与研究工具

## 0. 一句话

现有项目回答的是“这个概念是什么、和谁有关”；这一版要回答的是“动作游戏怎么走到今天、难在哪、谁怎么看、同一维度上各家怎么做”。

图谱继续保留为探索层；新增三层阅读结构。

## 1. 三个目标对应三种阅读模式

| 目标 | 阅读模式 | 核心问题 | 主要结构 |
| --- | --- | --- | --- |
| 1. 动作游戏发展与常规定义 | 叙事 + 分类 | 从哪来？现在怎么叫？边界在哪？ | 时间轴、阶段卡、定义对照表、边界案例 |
| 2. 设计难点、制作人/厂商观点 | 主题 + 档案 + 分歧 | 难在哪？谁在什么条件下这么说？ | 主题目录、人物/厂商档案、观点卡、冲突卡 |
| 3. 横向对比设计思路 | 矩阵 + 证据 | 同一维度上各家怎么做？ | 维度注册表、对比矩阵、单元格详情、差距清单 |

图谱/搜索是第四种模式：探索与检索，不作为叙事主线。

## 2. 现状与缺口

| 目标 | 已有 | 缺口 |
| --- | --- | --- |
| 发展与定义 | 广义/大众/传统 ACT、AAVG、魂式框架；街机难度与 3D 分化片段 | 没有时间轴；没有阶段划分、代表作与设计变迁；历史只散落在概念里 |
| 难点与观点 | 《动作游戏设计之难》、稻叶/神谷访谈、5 张冲突卡 | 观点来源以稻叶/神谷/白金为主；没有 `person` / `studio` 实体；厂商观点无法并列 |
| 横向对比 | 124 个游戏、7 维矩阵、4 个案例 | 维度硬编码；`matrix` 字段全空；没有“判断 + 证据”单元格；无法逐步填 |

覆盖账本 `content/coverage.json` 适合最初 6 篇资料的“观点级完整”，不适合开放式增长。新增历史、访谈、厂商资料时，应使用更轻的“来源 + 引用 + 主张”证据模型，而不是要求每篇新资料都逐段进账本。

## 3. 信息架构

```text
总览
  动作游戏是什么（常规定义摘要 + 三套口径）
  一张发展脉络
  三个入口：发展 / 难点与观点 / 横向对比
  当前资料状态与阅读路径

发展
  阶段导航（街机前史 / 3D 转型 / 传统 ACT 成型 / 魂式框架 / 现代融合）
  时间轴事件：阶段、年代、标题、设计变化、代表作品、来源
  事件详情：设计变化、代表作品、争议、来源
  阶段对比：当时的核心问题 vs 今天仍然成立的问题

定义
  口径切换：广义 ACT / 大众 ACT / 传统 ACT / 魂式框架 / 动作冒险
  每个口径：定义、适用范围、包含、排除、常见误用、来源
  边界案例矩阵：游戏 × 口径（典型 / 边界 / 不归入）
  结论：不裁决唯一答案，只说明“在什么语境下用哪个口径”

难点与观点
  难点主题目录：复合决策、反应频率、操控精度、外部规则、可读性、敌人/Boss、反馈循环、制作方法
  主题详情：问题、判断、关联概念、代表案例、来源
  人物/厂商档案：角色、所属、代表作、核心主张、条件、来源
  观点卡：谁、关于什么、在什么条件下、原文/转述
  冲突卡：同一维度的不同主张并列，不做正确性排名
  观点索引：主题 × 人物/厂商，显示观点覆盖与空白

横向对比
  维度注册表（可增删）
  矩阵视图：游戏 × 维度
  按维度视图：一个维度下所有游戏
  双机对比：两款游戏逐维并排
  差距视图：哪些游戏/维度还没填
  单元格详情：判断、条件、证据、状态、更新记录

来源与方法
  来源清单、引用规范、来源观点与编者归纳的边界
  空状态、草案、复核状态说明
```

### 页面职责

| 页面 | 回答的问题 | 主要数据 | 主要组件 |
| --- | --- | --- | --- |
| 总览 | 先读什么？ | 摘要、统计、入口 | 入口卡、阅读路径、结构图 |
| 发展 | 从哪来、怎么变？ | era/event、game、source | 时间轴、阶段导航、事件抽屉 |
| 定义 | 现在怎么叫？边界在哪？ | definition、boundary case、source | 口径标签、对照表、边界矩阵 |
| 难点与观点 | 难在哪、谁怎么看？ | topic、person、studio、claim、conflict | 目录、档案、观点卡、冲突卡、索引表 |
| 横向对比 | 同一维度各家怎么做？ | dimension、cell、game、evidence | 矩阵、双机对比、差距清单、单元格编辑器 |
| 制作标尺 | 这套设计交付前能不能过线？ | 评审维度、检查项、反模式 | 五维刻度、节奏分类、检查表、红线 |
| 来源与方法 | 依据是什么？ | source、citation | 来源卡、引用抽屉、方法说明 |

## 4. 内容模型

### 四层

| 层 | 实体 | 作用 |
| --- | --- | --- |
| 叙事层 | `era` / `event`、`game`、`person`、`studio` | 发展史、谁做了什么 |
| 解释层 | `concept`、`claim`、`conflict`、`case` | 难点、观点、分歧、案例 |
| 证据层 | `source`、`citation` | 原文、访谈、出处 |
| 对比层 | `comparison-dimension`、`comparison-cell` | 横向比较的判断与证据 |

现有 5 种实体只覆盖 `game / concept / case / conflict / source`；新增 `person / studio / claim / era / dimension / cell`。

不要求所有新实体都成为图谱节点：`era`、`dimension`、`cell` 可以是结构化数据集，不必进入星图；`person / studio / claim` 适合成为可检索实体。

### 实体字段

#### person

```yaml
id: atsushi-inaba
kind: person
name: 稻叶敦志
aliases: [Atsushi Inaba, 稲葉敦志]
roles: [制作人]
affiliations: [platinumgames]
keyWorks: [okami, viewtiful-joe, bayonetta]
summary: 以制作人与导演分工、愿景与组织边界为核心观点的制作人。
claimIds: [claim-inaba-director, claim-inaba-vision]
sourceIds: [source-inaba-interviews]
reviewStatus: reviewed
updated: 2026-11-11
```

#### studio

```yaml
id: platinumgames
kind: studio
name: PlatinumGames
aliases: [白金工作室, 白金]
summary: 以动作游戏 know-how、导演中心与多平台合作为背景的工作室。
claimIds: [claim-inaba-not-only-action]
sourceIds: [source-inaba-interviews]
reviewStatus: reviewed
```

注意：厂商公开立场、个人观点、项目层面的说法必须分开。不能把一位制作人的话自动写成“厂商观点”。

#### claim

```yaml
id: claim-inaba-director
kind: claim
speakerId: atsushi-inaba
topicIds: [production-method]
text: 导演确定整体方向并每天做关键判断；导演能稳定把控时，制作人主要保障人、资源和资金；导演判断失灵时，制作人介入整合。
attribution: 来源观点（转述）
conditions: “制作人只管预算”只在导演方向稳定时成立。
sourceId: source-inaba-interviews
locator: 二.2 制作人 vs 导演
reviewStatus: reviewed
updated: 2026-11-11
```

`attribution` 必须显式：来源观点、来源作者判断、转述、编者归纳。`conditions` 为空也要写“来源未给出条件”，不能留空让读者猜。

#### era / event

```yaml
id: era-arcade
kind: era
label: 街机与横版清版前史
range: 1980s
summary: 短回合、高惩罚与投币经济塑造了清版动作的节奏和难度观。
eventIds: [event-arcade-clear, event-arcade-coin]
reviewStatus: draft
```

```yaml
id: event-arcade-clear
kind: event
eraId: era-arcade
title: 清版动作的回合结构
shift: 到达场地、清版、解除封锁、继续前进。
gameIds: [cadillacs-and-dinosaurs, knights-of-valour]
conceptIds: [traditional-act]
sourceIds: [source-act-classification-2]
caveat: 年代与代表作仍需补历史来源。
```

#### comparison-dimension

```yaml
id: loop
kind: comparison-dimension
label: 核心循环
question: 一场战斗或一次游玩如何重复？
guidance: 描述重复单元，不写优劣。
status: reviewed
```

#### comparison-cell

```yaml
gameId: devil-may-cry
dimensionId: loop
judgment: 封闭清版、复杂动作系统与评价驱动，战斗是主要内容。
conditions: 以传统 ACT 谱系为口径。
evidence:
  - sourceId: source-act-classification-1
    locator: 三、狭义 ACT
  - conceptId: traditional-act
status: reviewed
updated: 2026-11-11
```

单元格状态：

- `empty`：尚未整理，显示“待整理”，不从标签或案例数量自动推断。
- `draft`：有编者判断，但证据或条件未补齐；构建允许，页面明确标注。
- `reviewed`：判断、条件、至少一条证据齐全。
- `disputed`：存在对立判断，链接到 `conflict`；不强行合并。

## 5. 横向对比工作台

### 维度注册表

放在 `content/catalogs/comparison-dimensions.md`，不再写死在组件里。初始候选：

| 维度 | 问题 | 说明 |
| --- | --- | --- |
| 核心循环 | 一场战斗/一次游玩如何重复？ | 清版、探索、刷装、Boss rush 等 |
| 取得优势 | 优势从哪里来，如何扩大？ | 立回、断招、压制、秒杀、定番、固定流程 |
| 防御与反击 | 玩家用什么回应敌人？ | 闪避、格挡、弹反、相杀、反技 |
| 敌人结构 | 敌人如何出手、退出、被学习？ | 韧性、AI、读指令、群体出手分配 |
| 深度来源 | 深度来自操作、资源、构筑还是关卡？ | 不把“更难”误当“更深” |
| 可读性 | 玩家能否看懂发生什么？ | 剪影、动势、特征帧、相机、特效 |
| 难度与规则 | 难度来自动作要求还是外部规则？ | 反应/精度 vs 容错/惩罚/目标长度 |
| 内容结构 | 战斗之外用什么支撑体量？ | 地图、叙事、演出、成长、探索 |

### 视图

- **矩阵**：默认视图。行是游戏，列是维度；单元格显示短判断、状态点和证据数。
- **按维度**：选择一个维度，横向读所有游戏，最适合补一列。
- **双机对比**：选两款游戏，逐维并排；空白仍是空白，不自动补。
- **差距**：按维度/游戏统计已整理、草案、空白；点击直接打开待整理单元格。
- **单元格详情**：判断、条件、证据、状态、更新时间；可复制实体 ID 与 JSON。

### 构建校验

- 非空单元格必须有 `gameId`、`dimensionId`、`judgment`、`status`。
- `reviewed` 至少一条证据；`draft` 可以没有，但页面必须标注“草案”。
- `gameId` / `dimensionId` / `sourceId` / `conceptId` 必须存在。
- 不允许从标签、案例数量或关系自动生成判断。
- 维度新增不需要改前端；前端从注册表读取列。
- 空单元格不进入搜索索引，避免把“待整理”搜成结论。

## 6. 交互规则

- **全局导航**切换页面；页内目录定位章节；组件内部导航切换条目/视角。
- **时间轴**：阶段筛选、事件选择、详情抽屉；刷新和前进后退保持当前事件。
- **定义**：口径标签 + 边界矩阵；点击单元格打开判断依据；不把某一格标成“正确答案”。
- **观点**：主题、人物、厂商、冲突共用同一批 claim；点击人物/主题过滤观点，不复制文案。
- **对比**：矩阵/按维度/双机/差距四种视图共享同一批 cell；编辑后所有视图同步。
- **抽屉**：支持关闭按钮、Escape、焦点返回；移动端变底部面板。
- **空状态**：明确写“待整理”，不显示假数据、不生成占位图。
- **结构层**：可切换显示实体 ID、类型和关系，方便维护者核对数据，不干扰普通阅读。
- **搜索**：统一检索页面、概念、人物、观点、冲突、游戏、单元格、来源；结果标注类型和命中位置。
- **可访问性**：真实按钮/链接、ARIA tabs、键盘方向键、焦点管理、颜色之外还有文字状态。

## 7. 录入流程

```text
新增来源
  → 写来源档案（作者、日期、范围、语言、链接）
  → 提取 claim（谁、关于什么、条件、出处）
  → 关联 concept / game / person / studio
  → 更新 conflict（如有对立主张）
  → 填 comparison cell（判断 + 条件 + 证据 + 状态）
  → 标记 reviewed / draft
  → 构建校验
  → 页面、搜索、矩阵、差距视图同步更新
```

原则：

- 先有来源，再有 claim；先有 claim，再有对比判断。
- 编者归纳与来源观点分开；`editorialSynthesis` 不写进来源侧。
- 空缺是合法状态；不为了填满矩阵而写没有依据的判断。
- 同一 claim 只维护一处，人物页、主题页、冲突卡、对比单元格都引用它。

## 8. 现有内容迁移

| 现有内容 | 去向 |
| --- | --- |
| `broad-act` / `common-act` / `traditional-act` / `action-adventure` / `souls-framework` | 定义页的口径与边界案例 |
| `domain-type-boundary` 与 `act-definition-boundaries` | 定义页的“三套口径”与冲突卡 |
| `domain-production-philosophy`、`producer-director`、`vision-pivot-and-strengths`、`talent-practice-preservation` | 人物/厂商档案与 claim |
| `source-inaba-interviews` | 稻叶/神谷/三上/PlatinumGames 的主要证据 |
| `domain-system-depth`、`reaction-frequency`、`control-precision`、`external-rules-and-difficulty`、`feedback-loops` | 难点主题 |
| `domain-presentation`、`readability-priority-principles`、`spectacle-techniques` | 可读性主题与冲突 |
| `domain-combat`、`neutral-and-openings`、`suppression`、`setplay`、`fixed-sequence` | 对比维度“取得优势” |
| `domain-enemy-boss`、`boss-poise-taxonomy`、`pseudo-equal-humanoid`、`high-ai-vs-learnability` | 对比维度“敌人结构”与冲突 |
| `content/catalogs/games.md` 的 124 个游戏 | 对比矩阵的行；先选 8–12 个种子游戏 |
| 4 个 case | 主题页与对比单元格的深度证据 |
| `content/coverage.json` | 保留为最初 6 篇资料的覆盖证明，不扩展到所有新来源 |

## 9. 构建与校验

建议在现有 `npm run build` 之前增加一层“研究数据校验”：

1. 实体 ID 唯一；关系目标存在。
2. `person` / `studio` / `claim` / `era` / `event` / `dimension` / `cell` 字段完整。
3. `claim` 必须有 `speakerId`、`text`、`attribution`、`sourceId`；`conditions` 不能为空字符串（可写“来源未给出条件”）。
4. `cell` 的 `reviewed` 必须有证据；`draft` 页面显示“草案”。
5. 时间轴事件的 `eraId`、`gameIds`、`sourceIds` 必须存在。
6. 生成所有视图后，检查站内链接、锚点和搜索索引。
7. 空状态、草案、争议状态在页面上必须有文字，不只靠颜色。

## 10. 分期

### Phase 1：骨架与样张

- 定义页 + 边界案例矩阵。
- 发展页：5 个阶段、10–15 个事件（明确标注待补来源）。
- 人物/厂商档案：先做稻叶、神谷、PlatinumGames，其余显示“待补”。
- 对比工作台：8 个维度、8–12 个种子游戏、30–40 个单元格。
- 单文件交互示例（本次交付）。

### Phase 2：证据与观点库

- 新增 `person` / `studio` / `claim` 实体与索引。
- 把现有 5 张冲突卡迁移为“claim + conflict”。
- 新增 2–3 位制作人/厂商的一手来源。
- 历史来源补齐，时间轴从“结构示意”转为“可引用”。

### Phase 3：对比工作台

- 维度注册表从内容读取。
- 单元格编辑/导入/导出（本地工具或编辑器）。
- 差距视图、批量补录、版本记录。
- 与现有图谱/搜索打通。

### Phase 4：发布形态

- 如果单文件离线仍是硬要求：在现有 React 内增加视图。
- 如果以内网阅读/编辑为主：采用多页静态阅读层 + 本地编辑器，现有 atlas 保留为图谱层。
- 两者共享 `content/`，不维护第二份文案。

## 11. 待决定

1. **发布形态**：单文件离线，还是内网多页 + 本地编辑？
2. **实体粒度**：`person` / `studio` 是否进入图谱，还是只做档案页？
3. **历史来源**：先补哪几类（街机、3D 转型、传统 ACT、魂式、现代融合）？
4. **对比单元格**：用 Markdown 表格、YAML/JSON，还是独立数据库文件？
5. **现有覆盖账本**：保留为六篇资料的证明，还是迁移为通用的 claim 证据表？

## 附录 A：示例中的真实与占位

- 定义、观点、冲突、来源：来自现有 `content/`，可在示例中点击查看来源与条件。
- 发展时间轴：阶段与代表作品为结构示意，年代和因果仍需补历史来源；示例中明确标注“待补来源”。
- 对比单元格：部分有现有概念/来源支撑，部分为“待整理”或“草案”；示例不把空白自动推断成结论。
- 人物/厂商：稻叶、神谷、三上（转述）、五十万、overKARAS、PlatinumGames 有现有材料；Capcom、Team Ninja、FromSoftware 等显示为“待补”，不代写观点。

## 附录 B：与现有 schema 的兼容

- `concept` / `game` / `case` / `conflict` / `source` 保持现有字段。
- 新增实体可以先放在 `content/people/`、`content/studios/`、`content/claims/`、`content/timeline/`、`content/comparisons/`，由构建器加载，不强行塞进 `content/concepts/`。
- `comparison-cell` 不建议复用 `game.matrix` 的 `Record<string,string>`，因为它没有证据、条件和状态；`matrix` 可作为速览缓存，正式判断以 cell 为准。
