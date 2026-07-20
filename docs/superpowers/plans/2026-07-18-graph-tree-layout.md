# 概念星图树状层次重构计划

## 目标

把概念星图从"辐射式 + 点击全展开重布局"改为"固定树状层次 + 点击展开子层高亮路径"，消除"路径变了""看不出递进""不知道规则"三个观感问题。

## 当前问题根因（[GraphExplorer.tsx](src/app/GraphExplorer.tsx)）

1. **每次点击 `layout({fit:true})` 重铺满视口**（:190）-> 节点位置全变 -> "路径变了"
2. **`graphPosition` 手算辐射角度**（:109-124）-> root 中心+域环绕，非层次式 -> "不是一层层递进"
3. **`visibleData` 选中才显示父链+子+横向 8 个**（:66-90）-> 信息瞬时快照，无常驻骨架
4. **无规则说明** -> 用户不知展开规则

## 新模型

### 常驻骨架（永远可见，位置固定）
- root（第 0 层）
- 6 域（第 1 层）
- 每个域的直接子概念 depth=2（第 2 层，约 30 个）

### 点击节点行为
- 高亮该节点 + 父链（root -> 域 -> ... -> 该节点）
- 展开/收起其直接子层（depth+1 的子节点）
- 其他无关节点变淡（opacity 降低，不消失）
- **不重布局**：节点位置在骨架初次算好后固定，只改 class/透明度
- 再次点击同一节点收起子层

### 布局算法
- Cytoscape `breadthfirst`（内置层次布局），`roots: [GRAPH_ROOT_ID]`，方向向下
- 只在挂载时算一次；展开/收起子节点时用 `animate: false` 增量加节点，新节点位置由其在父节点下方计算（或重跑 breadthfirst 但保持已显示节点位置稳定——需验证）

### 位置稳定性关键
- 用 `preset` 布局 + 自算坐标：root (0,0)，域按 domainOrder 横向排列在第 1 层 y，每个域的子概念横向排列在该域下方第 2 层 y，展开的孙节点排在第 3 层 y。
- 自算坐标保证：选中变化不改任何已显示节点位置，只新增/移除展开的子节点。

## 实现步骤（TDD）

### 步骤 1：重写 visibleData -> visibleLayers（纯函数，导出可测）

**新签名**：`visibleLayers(dataset, expandedIds: Set<string>) -> { entities, edges, dimmedIds }`
- 始终含：root + 6 域 + 各域 depth=2 子概念
- 对每个 expandedId，加入其直接子节点（childIdsFor）
- dimmedIds：与任何 expanded 路径无关的骨架节点（用于变淡）
- edges：骨架的 parent_of 边 + 展开层的 parent_of 边

**RED**（[tests/graph.test.tsx](tests/graph.test.tsx) 重写）：
- 初始（expandedIds 空）：断言可见 = root + 6 域 + 各域 depth=2 子
- expand domain-combat：断言 neutral-and-openings/suppression 等 depth=2 子仍可见（它们本就在骨架），其 depth=3 子（如 anti-armor-neutral）变可见
- expand domain-system-depth：control-precision 的 depth=3 子（time-precision 等）可见
- 收起：expandedIds 移除后，depth=3 子消失

**GREEN**：实现 visibleLayers，删旧 visibleData。

### 步骤 2：自算层次坐标（替换 graphPosition）

**新函数** `layoutTree(entities, expandedIds, dataset) -> Map<id, {x,y}>`
- 第 0 层 y=0：root 居中
- 第 1 层 y=220：6 域按 domainOrder 等距横排
- 第 2 层 y=440：每个域的 depth=2 子概念，横排在该域 x 附近（簇状）
- 第 3 层 y=660：展开的 depth=3 子，横排在各自父 x 附近
- 同簇节点过多时横向铺开，宽度按子节点数自适应

**RED**：测 layoutTree 返回的坐标，root y=0，域 y=220 同层，子概念 y=440。
**GREEN**：实现。

### 步骤 3：点击展开/收起状态 + 高亮路径

**状态**：`expandedIds: Set<string>`（useState），`selectedId` 已有。
- 点击节点：若已 expanded 则收起（删 id + 其子），否则展开（加 id）。同时设为 selectedId。
- 高亮路径：selectedId 的父链（ancestorIds 已有）算 `highlightedIds`。
- dimmed：骨架中不在 highlightedIds 且非 expanded 祖先的节点。

**RED**：测点击 domain-combat 后 anti-armor-neutral 等出现；再点 domain-combat 消失。
**GREEN**：接 onClick 切换 expandedIds。

### 步骤 4：布局不重跑 + 透明度

- useEffect 增量更新 cytoscape 元素（remove 不再可见的，add 新可见的），**不调 layout**，新节点用 layoutTree 坐标直接放。
- dimmedIds 对应节点设 `dimmed` class（CSS opacity:0.25），highlighted 设 `highlighted`（已有）。
- 删 `cy.layout({fit:true})`，改为初次挂载时 `preset` 一次。

### 步骤 5：规则说明文案

[App.tsx:129](src/app/App.tsx#L129) 工作区说明改为："树状层次：root → 六大知识域 → 概念。点击节点展开下一层并高亮父链，再次点击收起。"

## 受影响测试

[tests/graph.test.tsx](tests/graph.test.tsx) 现有 9 个用例基于旧"选中即可见"模型，需重写为"骨架+展开"模型。关键用例：
- "starts with the root and six first-ring domains" -> 改为断言骨架含 root+域+域的 depth=2 子
- "expands direct children and conflicts" -> 改为 expand 后 depth=3 子可见
- 键盘导航/面包屑/tooltip 用例 -> 保留逻辑，调整断言

[tests/detail.test.tsx](tests/detail.test.tsx) 不受影响（不测图谱内部）。

## 验证

- `npm test` 全绿
- `npm run build` 成功
- 人工：打开 dist，确认初始是树状骨架，点击域展开其子层且其他节点不动、变淡，再次点击收起
- 不提交
