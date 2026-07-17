# 知识库内容维护规范

本知识库以 `content/` 中的结构化 Markdown 为唯一人工内容源。每次修改后运行 `更新知识库.cmd`；不要手工编辑 `src/generated/knowledge.ts` 或 `dist/`。

## 内容类型与目录

五种实体使用同一套 frontmatter：

- `concept`：概念、方法、分类或领域节点，放在 `content/concepts/`。
- `case`：需要多段分析的详细游戏案例，放在 `content/cases/`。
- `conflict`：同一设计维度上的并列观点，放在 `content/conflicts/`。
- `source`：原始资料或外部出处档案，放在 `content/sources/`。
- `game`：由 `content/catalogs/games.md` 的 `game-catalog` 批量生成；不要另建同 ID 文件。

## 通用 frontmatter 字段

```yaml
---
id: example-node
kind: concept
title: 节点标题
aliases: [常用别名, 英文名]
summary: 一两句话说明这个节点回答什么问题。
domainIds: [domain-combat]
depth: 2
tags: [立回, 战斗]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: related_to, target: another-node, note: 可选关系说明 }
citations:
  - { sourceId: source-combat-approaches, locator: 一、立回／第 2 段 }
media: []
examples: []
editorialSynthesis: 编者归纳：……
---
```

字段规则：

- `id`：全库唯一，只用小写字母、数字和连字符；发布后尽量不要改，否则旧链接会失效。
- `kind`：五种实体之一。
- `title`：面向读者的正式标题。
- `aliases`：搜索别名、英文/日文名、常见简称；概念应至少有一个别名。
- `summary`：速览层摘要，不应偷偷加入正文没有依据的结论。
- `domainIds`：所属一级领域 ID，可跨领域；来源和游戏可为空。
- `depth`：`1` 为领域/总览，`2` 为核心概念，`3` 为深层研究材料。
- `tags`：筛选和检索标签。
- `reviewStatus`：`draft` 或 `reviewed`；未完成来源核对时使用 `draft`。
- `updated`：`YYYY-MM-DD`。
- `relations`：到其他实体的有向关系；目标必须存在。
- `citations`：来源 ID 与可人工定位的章节、段落或行号。
- `media`：本地媒体列表，规则见下文。
- `examples`：可进入全局案例索引的轻量案例。
- `editorialSynthesis`：可选，必须以“编者归纳：”开头；不能冒充来源观点。
- `conflictType`、`conflictSides`：仅冲突实体使用。
- `sourceMeta`：仅来源档案使用。
- `matrix`：可选的游戏/实体比较字段；没有证据时留空，不得为了填表编造。

正文使用普通 Markdown。建议明确设置“来源观点”“编者解释（补充术语）”“编者归纳”等标题。来源没有说过的机制事实不能仅靠编者常识补入来源段落。

## 八种关系

- `parent_of` / `child_of`：层级父子；构建器自动补反向关系。
- `related_to`：一般相关，自动补反向关系。
- `supports`：为另一节点提供支持材料。
- `contrasts_with`：有可比较差异但不必是冲突，自动补反向关系。
- `conflicts_with`：同一维度上的观点冲突，自动补反向关系。
- `applies_to`：方法、限制或案例适用于目标。
- `exemplified_by`：概念由案例或材料举例说明。

不要把“条件不同”误标为直接冲突。关系目标必须使用规范 ID，不能写显示标题。

## 游戏目录和案例

`content/catalogs/games.md` 是唯一游戏规范名目录：

```yaml
kind: game-catalog
games:
  - id: devil-may-cry
    title: 鬼泣
    aliases: [Devil May Cry, DMC, デビルメイクライ]
    summary: ……
    tags: [传统ACT]
    matrix: {}
```

系列、单作和跨系列谱系不要混为同一个 ID，例如“黑暗之魂”与“广义魂系列”应分开。别名忽略大小写后也应保持唯一。

简短案例写在概念的 `examples` 中：

```yaml
examples:
  - id: combat-neutral-example
    gameId: sekiro
    subject: 只狼的攻防替代
    mechanism: 用架势攻防替代传统空挥找破绽。
    outcome: 形成另一种取得行动优势的路径。
    sourceIds: [source-combat-approaches]
```

`id` 必须稳定且唯一；`gameId` 和每个 `sourceIds` 必须存在。一个来源中的不同具体场景应分别建例，不能只保证“这个游戏出现过”。

需要多段拆解、限制条件或多来源对照时，新建 `case` 文件。详细案例必须有：至少一个结构化 `examples`、有效游戏、机制、来源，以及到概念的关系。

## 冲突卡

`conflictType` 只能是：

- `definition`：定义边界不同。
- `goal`：优化目标或优先级不同。
- `condition`：条件变化导致结论不同。
- `direct`：同条件下的直接主张冲突。

每张冲突卡至少两侧：

```yaml
conflictType: goal
conflictSides:
  - label: 可读性优先
    claim: ……
    conditions: 来源明确给出的适用条件；若来源未给出，要直说。
    sourceIds: [source-action-design-difficulty]
  - label: 观赏性优先
    claim: ……
    conditions: ……
    sourceIds: [source-action-design-difficulty]
editorialSynthesis: 编者归纳：跨章节推导的适用条件放在这里，不放进来源侧。
```

每一侧必须有非空 `label`、`claim`、`conditions` 和至少一个来源。编者推导不能伪装成某一来源明确给出的条件；冲突卡不做正确性排名。

## 媒体和引用

媒体只能来自项目内批准的本地目录：

```yaml
media:
  - sourcePath: ../../动作游戏设计之难_assets/104029yxj1d1zq338l4mzd.gif
    src: media/104029yxj1d1zq338l4mzd.gif
    alt: 无名王者延迟攻击命中提前翻滚的玩家
    caption: 原文用该片段说明延迟攻击对慌乱翻滚的惩罚。
    kind: gif
    sourceId: source-action-design-difficulty
```

- `sourcePath`：相对当前 Markdown 的原文件路径；不得使用绝对路径、URL 或逃出批准目录。
- `src`：发布路径，统一为 `media/<文件名>`；全库大小写不敏感唯一。
- `alt`：描述画面信息和用途，不写“图片”。
- `caption`：保留原说明和附近论点；原文没有说明时明确写“原文未另附说明”，不要猜测。
- `kind`：`image` 或 `gif`，须与文件类型一致。
- `sourceId`：媒体所属来源档案。

普通引用使用 `citations`。来源档案的 `sourceMeta`：

```yaml
sourceMeta:
  rawPath: 本地原文.md
  primaryUrls: [https://官方或作者原始页面]
  secondaryUrls: [https://转载、翻译或整理页]
```

正文中同时记录作者、出处、日期、语言可用性和范围说明。外部链接可以保留为引用数据，但页面运行时不得主动请求。

## 覆盖账本

`content/coverage.json` 证明观点级覆盖，不是逐字转录。每条包含：

- `id`：稳定且唯一的账本行 ID。
- `sourceId`：六个来源之一。
- `kind`：`source-section`、`game-example` 或 `media`。
- `locator`：原文章节/段落/行号；媒体必须能定位到原文出现处。
- `status`：`mapped`、`excluded` 或 `unmapped`。
- `targets`：实体 ID，或 `example:<id>`，或 `media:media/<文件名>`。
- `sourcePath`：媒体行必填的原资产相对路径。

正式构建不允许 `unmapped`。`excluded` 必须没有 target，并使用一种明确 disposition：

- `duplicate`：与另一处实质重复。
- `contact-info`：作者联系方式。
- `search-method`：检索过程而非设计内容。
- `non-design`：与设计知识无关的非内容信息。

新增案例时，要为每个 `sourceIds` 建对应的 `(sourceId, example:<id>)` 账本行；新增媒体时同步增加原文定位和 `sourcePath`。

## 校验错误与修复

构建遇到以下问题会停止发布并保留上一版：

- 重复/缺失 ID、关系目标不存在。
- 案例缺游戏、机制、来源或关联概念。
- 冲突无类型、少于两侧或侧面无来源。
- 引用/媒体来源 ID 不存在。
- 媒体缺失、不可读、路径越界、发布路径冲突或非本地路径。
- 空知识图谱、空搜索索引、覆盖账本字段/目标/来源对不合法。
- 离线成品仍包含外部脚本/样式、主动网络 API、绝对资源路径或不安全请求入口。

`no-examples`、`no-inbound-edge`、`missing-alias`、`source-no-primary-link` 等 warning 不一定阻止构建，但应在内容复核时处理或确认合理。

## 一键构建检查表

1. 修改 `content/`，必要时加入游戏规范名和覆盖账本行。
2. 确认原始六篇 Markdown 与原始媒体没有被覆盖。
3. 双击 `更新知识库.cmd`。
4. 若失败，按窗口中的文件、错误码和信息修复后重试；不要手工替换 `dist/`。
5. 成功后打开 `dist/index.html`，检查搜索、星图、详情、冲突、矩阵和媒体。
6. 分享/部署时复制整个 `dist/` 目录。
