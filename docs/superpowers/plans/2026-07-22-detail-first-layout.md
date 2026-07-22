# 详情主导星图与三段详情面板 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the L1/L2/L3 detail interaction, make the right detail panel the primary reading area, and reorganize full node research content into 简述、详细、补充.

**Architecture:** Keep the existing graph hierarchy model and mobile tree. Simplify `NodeDetail` to a single always-full rendering path, remove detail-depth state from the app reducer, and use three semantic detail sections with light internal subheadings. Adjust the desktop grid so the graph becomes a narrower locator and the detail panel is approximately 480-560px wide.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite preview.

## Global Constraints

- Do not modify knowledge content, entity `depth` fields, or other research views.
- Completely remove L1/L2/L3 controls, indicator text, `detailDepth`, and `set-detail-depth`.
- Always render the full existing detail material in three sections: 简述, 详细, 补充.
- Preserve existing case cards, conflict cards, media dialogs, citations, node navigation, graph hierarchy, and mobile tree behavior.
- Keep the untracked `site.png` untouched.

---

### Task 1: Remove Detail Depth State and Add Failing Detail Contracts

**Files:**
- Modify: `tests/detail.test.tsx`
- Modify: `src/app/app-state.ts`
- Modify: `src/app/App.tsx`
- Modify: `src/app/components.tsx`

**Interfaces:**
- `AtlasState` no longer exposes `detailDepth`.
- `AtlasAction` no longer accepts `set-detail-depth`.
- `NodeDetailProps` accepts `entity`, optional `dataset`, and optional `onSelectEntity` only.

- [ ] **Step 1: Replace depth tests with the new state and markup expectations**

In `tests/detail.test.tsx`, replace the reducer tests that set or preserve `detailDepth` with:

```tsx
it("keeps the initial atlas state free of detail depth", () => {
  expect(createInitialState("")).not.toHaveProperty("detailDepth");
});

it("renders the complete detail view in three semantic sections", () => {
  render(<NodeDetail entity={fixtureEntity} dataset={fixtureDataset} />);

  expect(screen.getByRole("region", { name: "简述" })).toBeTruthy();
  expect(screen.getByRole("region", { name: "详细" })).toBeTruthy();
  expect(screen.getByRole("region", { name: "补充" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "一眼看懂" })).toBeNull();
  expect(screen.queryByRole("button", { name: "展开理解" })).toBeNull();
  expect(screen.queryByRole("button", { name: "深入研究" })).toBeNull();
  expect(screen.getByText("斋藤利三")).toBeTruthy();
  expect(screen.getByText("战斗主轴会随资源和敌人性能发生转换。")).toBeTruthy();
});
```

Update existing `NodeDetail` renders to omit `depth` and `onDepthChange`. Remove the test that expects a depth button callback.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/detail.test.tsx --run`

Expected: FAIL because the reducer still exposes `detailDepth`, `NodeDetail` still requires the depth path, and full L3 content is not yet wrapped in the three sections.

- [ ] **Step 3: Remove the depth state and prop plumbing**

In `src/app/app-state.ts`, remove `detailDepth` from `AtlasState`, remove the `set-detail-depth` union member, remove the initial field, and remove its reducer case.

In `src/app/App.tsx`, render `NodeDetail` without `depth` or `onDepthChange`.

In `src/app/components.tsx`, change the props and remove the depth indicator and `.detail-depth-controls` markup. Keep `entity`, `dataset`, and `onSelectEntity` available for the full rendering pass.

- [ ] **Step 4: Run the focused test to confirm the state contract is green**

Run: `npm test -- tests/detail.test.tsx --run`

Expected: TypeScript and detail tests still fail only for the not-yet-reorganized section markup; no references to `detailDepth` or `set-detail-depth` remain in `src` or `tests`.

---

### Task 2: Reorganize NodeDetail Into 简述、详细、补充

**Files:**
- Modify: `src/app/components.tsx`
- Modify: `tests/detail.test.tsx`

**Interfaces:**
- `NodeDetail` always renders all available entity material.
- Three top-level regions expose `aria-label="简述"`, `aria-label="详细"`, and `aria-label="补充"`.

- [ ] **Step 1: Add the three-section semantic shell**

Render the following structure inside `.detail-scroll-region`:

```tsx
<section className="detail-section detail-brief" aria-label="简述">
  <h3>简述</h3>
  {/* summary, metadata, metrics */}
</section>
<section className="detail-section detail-detailed" aria-label="详细">
  <h3>详细</h3>
  {/* bodyHtml, conditions, related concepts */}
</section>
<section className="detail-section detail-supplement" aria-label="补充">
  <h3>补充</h3>
  {/* cases, conflicts, media, citations, editorial synthesis */}
</section>
```

Move the current `depth >= 2` content into `detail-detailed` and the current `depth >= 3` content into `detail-supplement`, removing the conditional guards. Keep empty states inside the relevant subsection so a node with no cases or media remains readable without empty visual blocks.

- [ ] **Step 2: Add focused assertions for the full content order**

In `tests/detail.test.tsx`, assert that the three regions occur in DOM order and that the fixture's explanation, condition fallback, related/case content, citations, and synthesis are visible in one render. Keep the existing media, conflict, and provenance assertions, changing only their `NodeDetail` props.

- [ ] **Step 3: Run detail tests and verify GREEN**

Run: `npm test -- tests/detail.test.tsx --run`

Expected: all detail tests pass, including full content visibility and absence of depth controls.

- [ ] **Step 4: Refactor only after green**

Extract a small presentational helper only if it reduces repeated subsection markup. Do not split the knowledge model or alter existing card components.

---

### Task 3: Rebalance Desktop Layout and Detail Styling

**Files:**
- Modify: `src/styles.css`
- Modify: `tests/offline-output.test.ts`

**Interfaces:**
- Desktop `.atlas-layout` gives the detail panel approximately 480-560px while preserving a usable graph column.
- Mobile breakpoint still hides `.graph-explorer` and shows `.mobile-tree`.

- [ ] **Step 1: Add failing CSS contract assertions**

Extend `tests/offline-output.test.ts` to assert that the built CSS contains:

```ts
expect(css).toMatch(/\.atlas-layout[\s\S]*grid-template-columns:\s*220px\s+minmax\(320px,\s*1fr\)\s+minmax\(480px,\s*560px\)/u);
expect(css).toMatch(/\.detail-section\.detail-brief/u);
expect(css).toMatch(/\.detail-section\.detail-detailed/u);
expect(css).toMatch(/\.detail-section\.detail-supplement/u);
```

Also assert that the desktop CSS no longer contains `.detail-depth-controls` as a rendered control block.

- [ ] **Step 2: Run the focused CSS test and verify RED**

Run: `npm test -- tests/offline-output.test.ts --run`

Expected: FAIL because the existing desktop grid and detail-depth styles do not match the new contract.

- [ ] **Step 3: Apply the layout changes**

Update `src/styles.css`:

```css
.atlas-layout {
  grid-template-columns: 220px minmax(320px, 1fr) minmax(480px, 560px);
}

.graph-stage { min-height: 520px; }

.detail-section.detail-brief { padding-block: 18px; }
.detail-section.detail-detailed,
.detail-section.detail-supplement { padding-block: 18px; }
.detail-subsection { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line); }
.detail-subsection:first-of-type { margin-top: 0; padding-top: 0; border-top: 0; }
```

Remove the unused depth-control rules. At the `max-width: 1180px` breakpoint use `190px minmax(300px, 1fr) minmax(420px, 480px)`. Preserve the existing `max-width: 799px` one-column layout and mobile graph/tree visibility rules.

- [ ] **Step 4: Run the focused CSS test to verify GREEN**

Run: `npm test -- tests/offline-output.test.ts --run`

Expected: all offline-output tests pass.

---

### Task 4: Full Verification and Browser Review

**Files:**
- Verify: `src/app/App.tsx`, `src/app/components.tsx`, `src/app/app-state.ts`, `src/styles.css`, `tests/detail.test.tsx`, `tests/offline-output.test.ts`

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --run`

Expected: all test files pass with zero failures.

- [ ] **Step 2: Build the offline site**

Run: `npm run build`

Expected: exit code 0; only the existing content completeness warnings may remain.

- [ ] **Step 3: Verify desktop layout in the running preview**

At `http://127.0.0.1:4173/` and a desktop viewport around `1440x1000`, confirm the graph is visibly narrower than the detail panel, the right panel scrolls independently, and the detail panel shows only 简述、详细、补充 with all full-content material available.

- [ ] **Step 4: Verify mobile layout**

At `390x844`, confirm the graph canvas remains hidden, the mobile tree is readable, the three detail regions do not overlap, and no L1/L2/L3 control is present.

- [ ] **Step 5: Check console and repository state**

Confirm the browser console has no application errors. Run `git diff --check` and `git status --short`; preserve the untracked `site.png` and avoid modifying unrelated files.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/app/app-state.ts src/app/App.tsx src/app/components.tsx src/styles.css tests/detail.test.tsx tests/offline-output.test.ts
git commit -m "feat: focus atlas on full detail reading"
```
