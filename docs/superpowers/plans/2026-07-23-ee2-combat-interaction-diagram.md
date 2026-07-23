# EE2 招式博弈关系图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a readable, keyboard-accessible interaction diagram to the EE2 combat page that explains the three routes from player decision and enemy state to stagger, output, disengage, and reset.

**Architecture:** Keep diagram data beside the existing EE2 combat rules and render it through a focused local-state React component. Use four aligned CSS Grid columns on desktop and a vertical flow on mobile so the diagram never depends on crossing SVG lines or global app state.

**Tech Stack:** React 19, TypeScript, CSS Grid, Vitest, Testing Library, Vite.

## Global Constraints

- The diagram must appear after the EE2 one-sentence definition and before the existing play section.
- The three selectable routes are `比：招式等级对等`, `抓：抓主动破绽`, and `触：触发弱点机制`.
- Default state shows all routes; clicking a route highlights it, dims the other two, and clicking it again restores all routes.
- Selected route details expose 触发、手段、收益、边界 and use `aria-pressed` plus an `aria-live` detail region.
- The shared result chain is `敌人僵直 → 玩家有限输出 → 敌人可读脱离 → 回到招式博弈`.
- Do not add shared 气绝、稳定值、击晕、护甲 or other universal meters to the EE2 page.
- Do not modify concept graph, detail-panel, or DMC analysis behavior.
- Preserve all pre-existing dirty-worktree changes and the untracked `site.png`.

---

### Task 1: Define the Interaction Contract With Failing Tests

**Files:**
- Modify: `tests/ee2-combat.test.tsx`
- Test: `tests/ee2-combat.test.tsx`

**Interfaces:**
- The EE2 page exposes a region named `招式博弈关系图`.
- Route buttons expose accessible names `比：招式等级对等`, `抓：抓主动破绽`, and `触：触发弱点机制`.
- Diagram route groups expose `data-state="idle|active|muted"`.

- [ ] **Step 1: Add a failing default-render test**

Import `within` from Testing Library, then add these assertions to the primary EE2 render test:

```tsx
const diagram = screen.getByRole("region", { name: "招式博弈关系图" });
expect(screen.getByRole("heading", { name: "招式博弈关系" })).toBeTruthy();
for (const route of ["比：招式等级对等", "抓：抓主动破绽", "触：触发弱点机制"]) {
  expect(within(diagram).getByRole("button", { name: route }).getAttribute("aria-pressed")).toBe("false");
}
for (const step of ["敌人僵直", "玩家有限输出", "敌人可读脱离", "回到招式博弈"]) {
  expect(within(diagram).getByText(step)).toBeTruthy();
}
expect(within(diagram).getByRole("heading", { name: "完整关系" })).toBeTruthy();
```

- [ ] **Step 2: Add a failing route-selection test**

```tsx
it("focuses one EE2 interaction route and restores the complete graph", async () => {
  const user = userEvent.setup();
  render(<EE2CombatView dataset={dataset} onSelect={vi.fn()} />);

  const compare = screen.getByRole("button", { name: "比：招式等级对等" });
  const opening = screen.getByRole("button", { name: "抓：抓主动破绽" });
  const detail = screen.getByRole("status");

  await user.click(compare);
  expect(compare.getAttribute("aria-pressed")).toBe("true");
  expect(compare.closest("[data-route]")?.getAttribute("data-state")).toBe("active");
  expect(opening.closest("[data-route]")?.getAttribute("data-state")).toBe("muted");
  expect(within(detail).getByRole("heading", { name: "比 · 招式等级对等" })).toBeTruthy();
  expect(within(detail).getByText("双方招式相交时，比较打断等级与抗打断等级。")).toBeTruthy();

  await user.click(compare);
  expect(compare.getAttribute("aria-pressed")).toBe("false");
  expect(within(detail).getByRole("heading", { name: "完整关系" })).toBeTruthy();
});
```

- [ ] **Step 3: Run the focused test and verify RED**

Run: `npm test -- tests/ee2-combat.test.tsx --run`

Expected: FAIL because the `招式博弈关系图` region and route controls do not exist.

---

### Task 2: Add Diagram Data and the Interactive Component

**Files:**
- Create: `src/app/EE2CombatInteractionDiagram.tsx`
- Modify: `src/app/ee2-combat-data.ts`
- Test: `tests/ee2-combat.test.tsx`

**Interfaces:**
- `EE2ControlRoute` adds `id: "compare" | "opening" | "weakness"`, `playerAction: string`, and `enemyState: string`.
- `ee2InteractionOutcome` is a readonly array of the four shared result labels.
- `EE2CombatInteractionDiagram()` owns `activeRouteId` local state and consumes `ee2ControlRoutes` plus `ee2InteractionOutcome`.

- [ ] **Step 1: Extend the route data without duplicating rule text**

Add to `EE2ControlRoute`:

```ts
export type EE2InteractionRouteId = "compare" | "opening" | "weakness";

export interface EE2ControlRoute {
  id: EE2InteractionRouteId;
  verb: string;
  title: string;
  playerAction: string;
  enemyState: string;
  trigger: string;
  tools: string;
  reward: string;
  boundary: string;
}
```

Populate the existing three routes with:

```ts
{ id: "compare", playerAction: "选择出招时机与招式等级", enemyState: "敌人正在出招" }
{ id: "opening", playerAction: "走位、闪避或防御后反击", enemyState: "敌人暴露后摇或攻击间隙" }
{ id: "weakness", playerAction: "使用弱点对应手段", enemyState: "敌人满足专属弱点条件" }
```

Export:

```ts
export const ee2InteractionOutcome = [
  "敌人僵直",
  "玩家有限输出",
  "敌人可读脱离",
  "回到招式博弈"
] as const;
```

- [ ] **Step 2: Create the interactive component**

Implement `EE2CombatInteractionDiagram.tsx` with the complete semantic structure:

```tsx
import { useState } from "react";
import { ee2ControlRoutes, ee2InteractionOutcome, type EE2InteractionRouteId } from "./ee2-combat-data";

export function EE2CombatInteractionDiagram() {
  const [activeRouteId, setActiveRouteId] = useState<EE2InteractionRouteId | null>(null);
  const activeRoute = ee2ControlRoutes.find(({ id }) => id === activeRouteId) ?? null;
  const routeState = (id: EE2InteractionRouteId) => activeRouteId === null ? "idle" : activeRouteId === id ? "active" : "muted";

  return (
    <section className="ee2-section ee2-interaction" aria-labelledby="ee2-interaction-title" aria-label="招式博弈关系图">
      <div className="analysis-section-heading">
        <p className="eyebrow">RELATION</p>
        <h2 id="ee2-interaction-title">招式博弈关系</h2>
      </div>
      <p className="analysis-thesis">玩家先读敌人当前动作，再从招式对等、主动破绽和专属弱点中选择夺权路径；三条路径都汇入同一段有限输出与可读脱离。</p>

      <div className="ee2-interaction-map">
        <div className="ee2-interaction-column ee2-interaction-column--player">
          <p className="ee2-interaction-label"><span>01</span> 玩家选择</p>
          {ee2ControlRoutes.map((route) => (
            <div className="ee2-interaction-node ee2-interaction-node--player" data-route={route.id} data-state={routeState(route.id)} key={route.id}>
              <span>{route.verb}</span>
              <strong>{route.playerAction}</strong>
            </div>
          ))}
        </div>
        <div className="ee2-interaction-column ee2-interaction-column--enemy">
          <p className="ee2-interaction-label"><span>02</span> 敌人状态</p>
          {ee2ControlRoutes.map((route) => (
            <div className="ee2-interaction-node ee2-interaction-node--enemy" data-route={route.id} data-state={routeState(route.id)} key={route.id}>
              <strong>{route.enemyState}</strong>
            </div>
          ))}
        </div>
        <div className="ee2-interaction-column ee2-interaction-column--routes">
          <p className="ee2-interaction-label"><span>03</span> 夺权入口</p>
          {ee2ControlRoutes.map((route) => (
            <div className="ee2-interaction-route-shell" data-route={route.id} data-state={routeState(route.id)} key={route.id}>
              <button
                type="button"
                className="ee2-interaction-route"
                aria-label={`${route.verb}：${route.title}`}
                aria-pressed={activeRouteId === route.id}
                aria-describedby="ee2-interaction-detail-title"
                onClick={() => setActiveRouteId((current) => current === route.id ? null : route.id)}
              >
                <span>{route.verb}</span>
                <strong>{route.title}</strong>
              </button>
            </div>
          ))}
        </div>
        <div className="ee2-interaction-column ee2-interaction-column--outcome">
          <p className="ee2-interaction-label"><span>04</span> 共同结果</p>
          <ol className="ee2-interaction-outcome">
            {ee2InteractionOutcome.map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
            ))}
          </ol>
        </div>
      </div>

      <div className="ee2-interaction-detail" role="status" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">当前阅读</p>
        <h3 id="ee2-interaction-detail-title">{activeRoute ? `${activeRoute.verb} · ${activeRoute.title}` : "完整关系"}</h3>
        {activeRoute ? (
          <dl>
            <div><dt>触发</dt><dd>{activeRoute.trigger}</dd></div>
            <div><dt>手段</dt><dd>{activeRoute.tools}</dd></div>
            <div><dt>收益</dt><dd>{activeRoute.reward}</dd></div>
            <div><dt>边界</dt><dd>{activeRoute.boundary}</dd></div>
          </dl>
        ) : (
          <p>三条路径共同回答玩家如何把敌人送入僵直，但不共享额外状态条。选择一条路径可单独阅读触发、手段、收益和边界。</p>
        )}
      </div>
    </section>
  );
}
```

Render each route's player node, enemy node, and route button with the same `data-route={route.id}` and `data-state={routeState(route.id)}`. Set `aria-pressed={activeRouteId === route.id}` and toggle with `setActiveRouteId(current => current === route.id ? null : route.id)`.

- [ ] **Step 3: Run TypeScript and the focused component test**

Run: `npx tsc --noEmit`

Expected: PASS.

Run: `npm test -- tests/ee2-combat.test.tsx --run`

Expected: still FAIL only because the new component is not mounted in `EE2CombatView`.

---

### Task 3: Mount and Style the Responsive Diagram

**Files:**
- Modify: `src/app/EE2CombatView.tsx`
- Modify: `src/styles.css`
- Test: `tests/ee2-combat.test.tsx`

**Interfaces:**
- `EE2CombatView` renders `<EE2CombatInteractionDiagram />` immediately after `.ee2-definition`.
- Desktop diagram uses four columns and aligned three-row route nodes.
- At `max-width: 909px`, the diagram becomes a single-column vertical flow with downward connectors.

- [ ] **Step 1: Mount the component in the approved location**

Import `EE2CombatInteractionDiagram` in `EE2CombatView.tsx` and render it immediately after the definition section and before the `PLAY` section.

- [ ] **Step 2: Add stable desktop styles**

Add component-scoped rules to `src/styles.css`:

```css
.ee2-interaction-map {
  display: grid;
  grid-template-columns: minmax(150px, 0.9fr) minmax(170px, 1fr) minmax(180px, 1fr) minmax(190px, 1.15fr);
  gap: 18px;
  margin-top: 20px;
}
.ee2-interaction-column { display: grid; grid-template-rows: auto repeat(3, minmax(78px, auto)); gap: 10px; min-width: 0; }
.ee2-interaction-column--outcome { grid-template-rows: auto 1fr; }
.ee2-interaction-label { color: var(--muted); font-size: 12px; font-weight: 700; }
.ee2-interaction-node,
.ee2-interaction-route { min-width: 0; min-height: 78px; padding: 12px; border: 1px solid var(--line); background: rgba(15, 27, 37, 0.72); }
.ee2-interaction-route { width: 100%; color: var(--text); text-align: left; cursor: pointer; }
.ee2-interaction-route[aria-pressed="true"] { border-color: var(--cyan); background: rgba(97, 228, 201, 0.1); }
.ee2-interaction-map [data-state="muted"] { opacity: 0.34; }
.ee2-interaction-map [data-state="active"] { border-color: var(--cyan); }
.ee2-interaction-outcome { display: grid; align-content: center; gap: 8px; margin: 0; padding: 14px; border: 1px solid var(--cyan); list-style: none; }
.ee2-interaction-outcome li { position: relative; padding: 9px 10px; border-bottom: 1px solid var(--line); font-size: 12px; }
.ee2-interaction-detail { margin-top: 16px; padding: 16px 18px; border-left: 3px solid var(--orange); background: rgba(20, 38, 51, 0.72); }
```

Add these fixed connector rules between the first three desktop columns:

```css
.ee2-interaction-node,
.ee2-interaction-route-shell { position: relative; }
.ee2-interaction-node::after,
.ee2-interaction-route-shell::after {
  position: absolute;
  top: 50%;
  right: -18px;
  width: 18px;
  color: var(--cyan);
  content: "→";
  text-align: center;
  transform: translateY(-50%);
}
.ee2-interaction-column--enemy .ee2-interaction-node::after { color: var(--orange); }
.ee2-interaction-column:not(.ee2-interaction-column--outcome)::after { display: none; }
```

- [ ] **Step 3: Add mobile vertical-flow styles**

Inside `@media (max-width: 909px)`, add:

```css
.ee2-interaction-map { grid-template-columns: 1fr; gap: 14px; }
.ee2-interaction-column { grid-template-rows: auto; }
.ee2-interaction-node::after,
.ee2-interaction-route-shell::after { display: none; }
.ee2-interaction-column:not(.ee2-interaction-column--outcome)::after {
  display: block;
  justify-self: center;
  color: var(--cyan);
  content: "↓";
  font-size: 18px;
}
```

No diagram element may have a fixed width larger than its container.

Inside `@media (max-width: 540px)`, reduce diagram padding and gap while keeping all functional labels at `font-size: 12px` or larger.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- tests/ee2-combat.test.tsx --run`

Expected: all EE2 combat tests pass, including interaction selection and the forbidden-term regression.

- [ ] **Step 5: Run TypeScript after styling integration**

Run: `npx tsc --noEmit`

Expected: PASS.

---

### Task 4: Full Verification and Browser Review

**Files:**
- Verify: `src/app/EE2CombatInteractionDiagram.tsx`
- Verify: `src/app/ee2-combat-data.ts`
- Verify: `src/app/EE2CombatView.tsx`
- Verify: `src/styles.css`
- Verify: `tests/ee2-combat.test.tsx`

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --run`

Expected: all test files pass with zero failures.

- [ ] **Step 2: Check formatting and types**

Run: `npx tsc --noEmit`

Expected: exit code 0.

Run: `git diff --check`

Expected: exit code 0; line-ending notices are acceptable but whitespace errors are not.

- [ ] **Step 3: Rebuild the site**

Stop only Vite processes whose command lines point to `D:\动作游戏资料`, then run `npm run build`.

Expected: exit code 0; only existing content-completeness warnings may remain.

- [ ] **Step 4: Review desktop behavior**

Start the local server at `http://127.0.0.1:5173/`. At a desktop viewport around `1280x800`, open `EE2 战斗` and verify:

- Four diagram columns are visible without overlapping text or connectors.
- Clicking each route leaves its player node, enemy node, route button, and shared outcome legible while dimming unrelated routes.
- Clicking the active route restores the complete graph.
- The graph detail side panel remains hidden on the EE2 page.
- The console contains no application errors.

- [ ] **Step 5: Review mobile behavior**

At `390x844`, verify the diagram reads vertically, all labels fit, controls remain at least one stable row tall, and no connector overlaps text.

- [ ] **Step 6: Preserve repository state**

Run: `git status --short`

Expected: only the new diagram work plus pre-existing user changes are present; do not stage or revert unrelated files.
