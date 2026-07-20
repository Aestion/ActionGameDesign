# UI/交互明确问题修复计划

针对四条代码可确证、改动可控的交互问题，按 TDD（RED→GREEN→全绿）逐条修复。视觉/渲染层问题不在本轮。

## 修复 1：媒体对话框改为真模态（#3）

**问题**：[components.tsx:213](src/app/components.tsx#L213) 用 `<dialog open>` 而非 `showModal()`，无焦点陷阱、无原生 ESC 关闭。

**RED**（[tests/detail.test.tsx](tests/detail.test.tsx) 加用例）：
- 打开媒体对话框后按 ESC，对话框应消失（当前：ESC 不关闭）。

**GREEN**（[components.tsx](src/app/components.tsx) `MediaCard`）：
- `dialogRef` + `useEffect`：open 变 true 时调 `dialogRef.current?.showModal()`，变 false 时 `close()`。
- jsdom 兜底：`typeof dialog.showModal === "function"` 才调，否则回退到 `open` 属性（保证现有 `getByRole("dialog")` 测试与 jsdom 不挂）。
- ESC：`showModal()` 原生支持 ESC 触发 `cancel` 事件并关闭。监听 `onCancel`/`onClose` 同步 `setOpen(false)`。保留点击背景关闭与 × 按钮。

**验证**：现有 "lazy-loads media, opens a sourced dialog" 测试仍绿 + 新 ESC 测试绿。

## 修复 2：搜索结果可分页（#2）

**问题**：[SearchPanel.tsx:91](src/app/SearchPanel.tsx#L91) `results.slice(0,12)` 硬截断，总数显示但第 13 项后不可达。

**RED**（新建 [tests/search-panel.test.tsx](tests/search-panel.test.tsx)）：
- 渲染含 15 个命中结果的 SearchPanel，先显示 12 条 + "显示更多"，点"显示更多"后显示 15 条。

**GREEN**（[SearchPanel.tsx](src/app/SearchPanel.tsx)）：
- `useState` 的 `visibleCount`，初始 12。
- 列表 `results.slice(0, visibleCount)`；当 `results.length > visibleCount` 显示"显示更多"按钮，点击 `setVisibleCount(results.length)`。
- query/filters 变化时重置 visibleCount（useEffect 依赖 query+filters）。

**验证**：新测试绿；现有 [search.test.ts](tests/search.test.ts)（纯函数）不受影响。

## 修复 3：节点选择入历史栈（#5）

**问题**：[App.tsx:104](src/app/App.tsx#L104) 用 `replaceState`，后退不能逐节点回退。

**RED**（[tests/detail.test.tsx](tests/detail.test.tsx) 加用例）：
- 点击 A 节点，再点 B 节点，`history.length` 增长（或按后退后 hash 回到 A）。注：jsdom 的 `history.length` 行为不稳，改用 spy 断言 `pushState` 被调用而非 `replaceState`。

**GREEN**（[App.tsx](src/app/App.tsx) `selectEntity`）：
- `replaceState` → `pushState`。

**验证**：现有 hash 测试仍绿（pushState 也设 hash）+ 新 pushState 测试绿。

## 修复 4：选节点保留详情深度（#6）

**问题**：[app-state.ts:56](src/app/app-state.ts#L56) `select-node` 强制 `detailDepth:1`。

**RED**（[tests/detail.test.tsx](tests/detail.test.tsx) 加用例）：
- `createInitialState` 设 depth=3，dispatch `select-node`，断言 `detailDepth` 仍为 3。

**GREEN**（[app-state.ts](src/app/app-state.ts) `select-node` case）：
- 去掉 `detailDepth: 1`，仅更新 `selectedId`。
- `hydrate-hash` 同理（保持一致，从 hash 进入时不强制重置）。

**验证**：现有 "selects a node and can move through all three detail depths"（显式 set-depth）仍绿 + 新测试绿。

## 收尾验证

- `npm test`：全绿（12+ 文件）。
- `npm run build`：成功，dist 正常生成。
- 不提交，等用户确认。
