# 概念星图层级梳理计划

## 核查结论：问题分两层

### 第一层：图谱显示逻辑缺陷（纯前端，[GraphExplorer.tsx](src/app/GraphExplorer.tsx)）

**A. 父链只回溯一层，深层节点与域脱节**
[GraphExplorer.tsx:55-77](src/app/GraphExplorer.tsx#L55-L77) `visibleData`：选中节点 N 时，只把 `parentIdFor(N)` 一层父加入可见集。选中 depth=3 节点（如 `time-precision`）时，父 `control-precision` 显示，但 `control-precision` 的父 `domain-system-depth` 不显示，中间节点孤悬。

**B. 同级兄弟节点排序不稳定**
[GraphExplorer.tsx:90-93](src/app/GraphExplorer.tsx#L90-L93) `graphPosition`：非域节点按 `siblings.findIndex` 排序，而 `siblings` 来自 `visible.entities` 的过滤顺序（按 id 字母序），不按语义，位置看起来随机。

**C. 单父假设，双域节点只挂一侧**
`parentIdFor` 只返回**一个**父（第一个 parent_of/child_of 边，或 `domainIds[0]` 回退）。`fixed-sequence`（domainIds=[combat, enemy-boss]）只挂 combat 侧，enemy-boss 域永远看不到它。这与用户选择"保留双域、图谱显示多父"冲突。

### 第二层：内容分类不一致（content md）

| 节点 | 问题 |
|------|------|
| `fixed-sequence` | domainIds=[combat, enemy-boss]，child_of=combat。enemy-boss 侧断 |
| `anti-armor-neutral` | domainIds=[combat, enemy-boss]，child_of=neutral-and-openings(combat) |
| `low-poise-neutral` | domainIds=[combat, enemy-boss]，child_of=neutral-and-openings(combat) |
| `wakeup-and-resource-suppression` | domainIds=[combat, enemy-boss]，child_of=suppression(combat) |
| `time-precision` | domainIds=[system-depth, presentation]，child_of=control-precision(system-depth) |
| `training-and-depth` | domainIds=[presentation, system-depth]，child_of=domain-presentation |
| `readability-spectacle-balance`(concept) vs `readability-vs-spectacle`(conflict) | 命名/标题高度重复，易混 |

注：B5/B6（production-philosophy 三节点、coop-musou 单向 parent_of）经核实 `compileEdges` 会补全反向边，**非 bug**，不动。

---

## 修复方案（TDD，逐条 RED->GREEN）

### 修复 1：图谱父链回溯到域（A）

**RED**（[tests/graph.test.tsx](tests/graph.test.tsx) 加用例）：
- 选中 depth=3 的孙节点时，断言其祖父域也在可见节点列表中。

**GREEN**（[GraphExplorer.tsx](src/app/GraphExplorer.tsx) `visibleData`）：
- 选中 N 后，从 N 沿 `parentIdFor` 逐层回溯，把每一层父都加入 `ids`，直到遇到 domain 或 root。
- 新建 `ancestorIds(id, dataset): string[]` 循环回溯。

### 修复 2：同级兄弟节点稳定排序（B）

**RED**（[tests/graph.test.tsx](tests/graph.test.tsx) 加用例）：
- 选中某 domain，断言其子节点按 `depth, title` 确定顺序排列（两次渲染顺序一致且可预测）。

**GREEN**（[GraphExplorer.tsx](src/app/GraphExplorer.tsx) `graphPosition`）：
- `siblings` 排序改为按 `(depth, title, id)` 稳定排序，而非 findIndex 原序。

### 修复 3：图谱支持多父（C，配合双域）

**RED**（[tests/graph.test.tsx](tests/graph.test.tsx) 加用例）：
- 选中 `fixed-sequence`，断言 `domain-combat` 和 `domain-enemy-boss` 都在可见集中（双父）。
- 选中 `domain-enemy-boss`，断言 `fixed-sequence` 出现在其子节点里（反向也通）。

**GREEN**（[GraphExplorer.tsx](src/app/GraphExplorer.tsx)）：
- `parentIdFor` -> `parentIdsFor` 返回 `string[]`：收集所有 `parent_of`/`child_of` 边的父，**并并入 `domainIds` 全部**（不只 `[0]`）。
- `visibleData`：把 `parentIdsFor(N)` 全部加入 `ids`；父链回溯对每个父递归。
- `childIdsFor` 已是数组，天然支持多父（一个节点可被多个 domain `parent_of`）。
- `graphPosition`：多父节点选"主父"（第一个 parent_of 边或 domainIds[0]）定位，避免位置分裂。

### 修复 4：内容分类--双域节点补全双向 child_of

**RED**（[tests/content-validation.test.ts](tests/content-validation.test.ts) 加用例）：
- 新增校验：对每个节点，`domainIds` 中每个域必须有对应的 `parent_of`/`child_of` 连接（双向）。当前 `fixed-sequence` 等会失败。

**GREEN**（content md）：
为 6 个双域节点补另一域的 `child_of`：
- `fixed-sequence`: 加 `child_of: domain-enemy-boss`（并从 `domain-enemy-boss.md` 加 `parent_of: fixed-sequence`）
- `anti-armor-neutral`: 加 `child_of: domain-enemy-boss`（domain-enemy-boss.md 加 parent_of）
- `low-poise-neutral`: 加 `child_of: domain-enemy-boss`（domain-enemy-boss.md 加 parent_of）
- `wakeup-and-resource-suppression`: 加 `child_of: domain-enemy-boss`（domain-enemy-boss.md 加 parent_of）
- `time-precision`: 加 `child_of: domain-presentation`（domain-presentation.md 加 parent_of）
- `training-and-depth`: 加 `child_of: domain-system-depth`（domain-system-depth.md 加 parent_of）

注：这样每个双域节点有两个 `child_of` 父，配合修复 3 的多父显示，两域都能看到它。需确认 `EntityFileSchema` 的 relations 数组允许多个 child_of（当前 schema 无此约束，允许）。

### 修复 5：重命名 readability-spectacle-balance 消除混淆

concept `readability-spectacle-balance`（标题"可读性与观赏性的优先级"）与 conflict `readability-vs-spectacle`（标题"可读性优先还是观赏性优先"）混淆。**重命名 concept 的 id 和标题**，conflict 保持不变。

- concept id: `readability-spectacle-balance` -> `readability-priority-principles`（标题改"可读性优先的原则与条件"）
- 文件名: `content/concepts/readability-vs-spectacle.md` -> `content/concepts/readability-priority-principles.md`（当前文件名与 id 不符，借此修正）

**牵动引用**（必须全部同步，否则构建失败）：
- [content/concepts/readability-vs-spectacle.md](content/concepts/readability-vs-spectacle.md) 自身 id/title/文件名
- [content/concepts/domain-presentation.md](content/concepts/domain-presentation.md): `parent_of: readability-spectacle-balance` -> 新 id
- [content/conflicts/readability-vs-spectacle.md](content/conflicts/readability-vs-spectacle.md): `conflicts_with: readability-spectacle-balance` -> 新 id
- [content/coverage.json](content/coverage.json): 2 处 targets 含旧 id
- [tests/coverage.test.ts](tests/coverage.test.ts): 第 115 行硬编码 id 数组、第 511 行 `entitiesById.get("readability-vs-spectacle")`（这个取的是 conflict，不变；需逐行核对）

**RED**：[tests/coverage.test.ts](tests/coverage.test.ts) 现有断言会用旧 id，重命名后失败 -> 更新为新 id（这部分是同步更新，非新测试）。

---

## 执行顺序

1. 修复 1+2+3（图谱逻辑，纯前端，先做，风险低）-> 跑 graph 测试
2. 修复 4（内容双域补全）-> 跑 content-validation + 全量测试
3. 修复 5（重命名）-> 全量测试 + 构建验证

## 收尾验证

- `npm test`：全绿
- `npm run build`：成功，dist 生成
- 人工：打开 dist，选中 time-precision/fixed-sequence，确认父链完整、双域可见、兄弟排序稳定
- 不提交，等用户确认

## 风险

- 修复 4 给 domain md 加 parent_of 不会破坏现有测试（测试只校验存在性 + 计数 digest，digest 基于 source-section 行 id，不涉及 concept 边）。
- 修复 5 重命名 coverage.test.ts 硬编码 id 需逐行核对，漏一处即测试红。
