# Hierarchy-First Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dense radial concept network with a focused parent/current/children hierarchy and an on-demand grouped relation list, then restore a buildable Vite entry page.

**Architecture:** `GraphExplorer.tsx` will expose a pure `buildHierarchyView` function that derives structural nodes, deduplicated structural edges, grouped cross-relations, and fixed coordinates from the dataset and selected node. Cytoscape will render only this structural model; React will render cross-relations as a semantic disclosure list below the canvas. Existing `onSelect` navigation remains the only state boundary shared with `App`.

**Tech Stack:** React 19, TypeScript, Cytoscape 3, Vitest, Testing Library, Vite

## Global Constraints

- Root view contains only the root and six ordered domains.
- Focus view contains at most two structural parents, the selected node, and direct structural children.
- Canvas edges are limited to `parent_of`; non-structural relations are deduplicated and grouped outside the canvas.
- Mobile continues to use `MobileTree`.
- Do not modify content data, coverage files, other research views, or the untracked `site.png`.
- Restore `index.html` to the repository's Vite entry with `#root` and `/src/main.tsx`.

---

### Task 1: Pure Hierarchy View Model

**Files:**
- Modify: `tests/graph.test.tsx`
- Modify: `src/app/GraphExplorer.tsx`

**Interfaces:**
- Consumes: `KnowledgeDataset`, selected entity id, existing `GRAPH_ROOT_ID`.
- Produces: exported `buildHierarchyView(dataset, selectedId): HierarchyView` with `entities`, normalized `edges`, `parentIds`, `childIds`, `positions`, and grouped `relations`.

- [ ] **Step 1: Write failing model tests**

Add assertions that root view returns exactly seven nodes, focus view excludes unrelated domains and non-structural targets from the canvas, duplicate forward/reverse hierarchy edges collapse to one normalized `parent_of` edge, and no more than two parent ids are returned.

```tsx
const rootView = buildHierarchyView(dataset, GRAPH_ROOT_ID);
expect(rootView.entities.map(({ id }) => id)).toEqual([
  GRAPH_ROOT_ID,
  "domain-type-boundary",
  "domain-system-depth",
  "domain-combat",
  "domain-enemy-boss",
  "domain-presentation",
  "domain-production-philosophy"
]);

const focusView = buildHierarchyView(dataset, "domain-combat");
expect(focusView.entities.map(({ id }) => id)).toEqual([
  GRAPH_ROOT_ID, "domain-combat", "neutral", "pressure"
]);
expect(focusView.edges.every(({ kind }) => kind === "parent_of")).toBe(true);
expect(focusView.entities.some(({ id }) => id === "combat-conflict")).toBe(false);
expect(focusView.edges.filter(({ source, target }) => source === "domain-combat" && target === "neutral")).toHaveLength(1);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/graph.test.tsx`

Expected: FAIL because `buildHierarchyView` is not exported and the old component still includes unrelated domains and conflict nodes.

- [ ] **Step 3: Implement the minimal pure model**

In `GraphExplorer.tsx`, replace `parentIdFor`, `visibleData`, `graphPosition`, and `relationPriority` with:

```ts
export type RelationGroupId = "conflict" | "contrast" | "related" | "application";

export interface HierarchyRelationGroup {
  id: RelationGroupId;
  label: string;
  entities: KnowledgeEntity[];
}

export interface HierarchyView {
  entities: KnowledgeEntity[];
  edges: KnowledgeEdge[];
  parentIds: string[];
  childIds: string[];
  positions: Map<string, { x: number; y: number }>;
  relations: HierarchyRelationGroup[];
}

export function buildHierarchyView(dataset: KnowledgeDataset, selectedId: string): HierarchyView {
  // Normalize child_of to parent_of, dedupe by parent/child pair, cap parents at two,
  // keep only root/domains in root view, and use parent/current/children in focus view.
}
```

Coordinates are deterministic: parent row `y=90`, selected row `y=300`, child row `y=520`; root view places root at `y=90` and domains at `y=360`. Sort siblings by title then id before distributing their x coordinates.

Group `conflicts_with` as `conflict`, `contrasts_with` as `contrast`, `related_to` as `related`, and `exemplified_by` / `applies_to` / `supports` as `application`. Deduplicate targets independently inside each group.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- tests/graph.test.tsx`

Expected: model tests pass; component tests may still fail until Task 2 updates rendering behavior.

- [ ] **Step 5: Commit the model**

```bash
git add src/app/GraphExplorer.tsx tests/graph.test.tsx
git commit -m "refactor: derive focused graph hierarchy"
```

### Task 2: Focused Canvas and On-Demand Relations

**Files:**
- Modify: `tests/graph.test.tsx`
- Modify: `src/app/GraphExplorer.tsx`

**Interfaces:**
- Consumes: `HierarchyView` from Task 1 and existing `onSelect(id)` callback.
- Produces: Cytoscape structural canvas plus an accessible `关联节点` disclosure grouped by relation semantics.

- [ ] **Step 1: Write failing interaction tests**

```tsx
it("keeps cross-relations out of the canvas and reveals them on demand", () => {
  render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={vi.fn()} />);
  expect(screen.queryByText("主动与被动之争")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "展开关联节点" }));
  expect(screen.getByRole("group", { name: "冲突" }).textContent).toContain("主动与被动之争");
});

it("selects a related node and closes the disclosure", () => {
  const onSelect = vi.fn();
  render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={onSelect} />);
  fireEvent.click(screen.getByRole("button", { name: "展开关联节点" }));
  fireEvent.click(screen.getByRole("button", { name: "主动与被动之争" }));
  expect(onSelect).toHaveBeenCalledWith("combat-conflict");
  expect(screen.queryByRole("group", { name: "冲突" })).toBeNull();
});
```

Update keyboard assertions so Escape navigates to `view.parentIds[0] ?? GRAPH_ROOT_ID`; remove tooltip assertions because the detail panel now owns summaries and metrics.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/graph.test.tsx`

Expected: FAIL because no relation disclosure exists and old legend/tooltip behavior remains.

- [ ] **Step 3: Implement focused rendering**

- Feed Cytoscape only `view.entities`, `view.edges`, and `view.positions`.
- Assign `parent`, `selected`, and `child` classes from `view.parentIds` and `view.childIds`.
- Remove graph legend, tooltip state, tooltip handlers, and metric-rich accessible labels.
- Render a button with `aria-expanded` and label `展开关联节点` / `收起关联节点`.
- Render non-empty groups as `<section role="group" aria-label={group.label}>` containing text buttons.
- On relation button click, call `setRelationsOpen(false)` before `onSelect(entity.id)`.
- Reset `relationsOpen` to false in an effect when `selectedId` changes.
- Preserve arrow/Enter/Escape keyboard behavior and breadcrumbs.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- tests/graph.test.tsx`

Expected: all graph and mobile-tree tests pass.

- [ ] **Step 5: Commit the interaction**

```bash
git add src/app/GraphExplorer.tsx tests/graph.test.tsx
git commit -m "feat: simplify graph relation navigation"
```

### Task 3: Visual Hierarchy, Copy, and Vite Entry

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/App.tsx`
- Modify: `index.html`

**Interfaces:**
- Consumes: classes and disclosure markup from Task 2.
- Produces: readable desktop hierarchy, unchanged mobile tree breakpoint behavior, and a valid application entry page.

- [ ] **Step 1: Add a failing structural assertion**

In `tests/graph.test.tsx`, assert the graph no longer renders `关系图例` or a tooltip and exposes hierarchy role markers through `data-level` values `parent`, `current`, and `child`.

```tsx
expect(screen.queryByLabelText("关系图例")).toBeNull();
expect(screen.getByTestId("graph-node-domain-combat").getAttribute("data-level")).toBe("current");
expect(screen.getByTestId("graph-node-neutral").getAttribute("data-level")).toBe("child");
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/graph.test.tsx`

Expected: FAIL until level markers are present and old legend markup is removed.

- [ ] **Step 3: Apply the visual and copy changes**

- Set `.graph-stage` to a stable responsive height around `620px`, remove the radial background, and retain the quiet grid background.
- Style canvas nodes through Cytoscape as 168x64 rounded rectangles with 14px labels; current is 196x74 with stronger contrast.
- Replace `.graph-legend` and `.graph-tooltip` CSS with `.graph-relations`, `.graph-relations-toggle`, `.graph-relation-groups`, and `.graph-relation-group` styles.
- Keep cards at no more than 8px border radius and avoid nested decorative cards.
- Change `App.tsx` instruction to `沿父级、当前节点和直接子节点逐层阅读；其他关联可在图下按需展开。`.
- Restore `index.html` to the checked-in 12-line Vite entry with title `动作游戏设计知识图谱`, `#root`, and `/src/main.tsx`.

- [ ] **Step 4: Run graph tests and full tests**

Run: `npm test -- tests/graph.test.tsx`

Expected: graph tests pass.

Run: `npm test`

Expected: all test files and tests pass with zero failures.

- [ ] **Step 5: Commit presentation and entry restoration**

```bash
git add src/styles.css src/app/App.tsx index.html tests/graph.test.tsx
git commit -m "feat: improve graph reading flow"
```

### Task 4: Build and Browser Verification

**Files:**
- Generated: `dist/`
- Verify only: working tree and browser output

**Interfaces:**
- Consumes: complete implementation from Tasks 1-3.
- Produces: verified offline build and desktop/mobile visual evidence.

- [ ] **Step 1: Build the offline site**

Run: `npm run build`

Expected: exit code 0; warnings about content completeness are permitted, but no build errors.

- [ ] **Step 2: Serve the rebuilt site**

Run: `npx vite preview --host 127.0.0.1 --port 4173`

Expected: preview URL `http://127.0.0.1:4173/` responds.

- [ ] **Step 3: Verify desktop interaction**

At 1440x1000, confirm root view shows seven readable nodes; selecting `战斗思路` shows only root, current, and direct children; relation lines do not cross; expanding `关联节点` shows grouped buttons; selecting one changes the detail panel and collapses the list.

- [ ] **Step 4: Verify mobile interaction**

At 390x844, confirm the Cytoscape canvas is hidden, the nested mobile tree is usable, text does not overlap, and the detail panel remains reachable.

- [ ] **Step 5: Check console and repository state**

Confirm browser console has no errors. Run `git status --short` and verify only the intentionally untracked `site.png` remains outside committed changes; do not add or delete it.
