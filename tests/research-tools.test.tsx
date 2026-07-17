import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/app/App";
import { IndexViews } from "../src/app/IndexViews";
import type { KnowledgeDataset, KnowledgeEntity } from "../src/model";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname);
});

function entity(overrides: Partial<KnowledgeEntity> & Pick<KnowledgeEntity, "id" | "title">): KnowledgeEntity {
  return {
    kind: "concept", aliases: [], summary: `${overrides.title}摘要`, bodyHtml: "", domainIds: [], depth: 2,
    tags: [], reviewStatus: "reviewed", updated: "2026-07-17", citations: [], media: [], examples: [], ...overrides
  };
}

const domains = [
  ["domain-type-boundary", "类型与边界"], ["domain-system-depth", "复合决策与系统深度"],
  ["domain-combat", "战斗思路"], ["domain-enemy-boss", "敌人与 Boss 设计"],
  ["domain-presentation", "动作表现与可读性"], ["domain-production-philosophy", "制作方法与设计哲学"]
] as const;

const dataset: KnowledgeDataset = {
  version: 1, generatedAt: "2026-07-17T00:00:00.000Z",
  entities: [
    ...domains.map(([id, title]) => entity({ id, title, depth: 1 })),
    entity({ id: "bayonetta", title: "猎天使魔女", aliases: ["Bayonetta"], kind: "game" }),
    entity({
      id: "bayo-case", title: "猎天使魔女压制案例", kind: "case", domainIds: ["domain-combat"],
      examples: [{ id: "e", gameId: "bayonetta", subject: "妖刀", mechanism: "压制", outcome: "重新击倒", sourceIds: ["source-z"] }]
    }),
    entity({ id: "conflict-a", title: "观赏性与可读性", kind: "conflict", conflictType: "goal", domainIds: ["domain-presentation"] }),
    entity({ id: "source-z", title: "战斗资料 Z", kind: "source" })
  ],
  edges: [{ source: "domain-combat", target: "bayo-case", kind: "exemplified_by" }],
  searchRecords: [
    { id: "bayonetta", title: "猎天使魔女", text: "猎天使魔女bayonetta", tokens: ["猎天使魔女", "bayonetta"] },
    { id: "bayo-case", title: "猎天使魔女压制案例", text: "猎天使魔女压制案例bayonetta", tokens: ["bayonetta", "压制"] }
  ],
  stats: { concepts: 6, cases: 1, conflicts: 1, sources: 1, games: 1, media: 0 }
};

describe("research search", () => {
  it("shows real results and propagates a game hit to its graph domain", async () => {
    const user = userEvent.setup();
    render(<App dataset={dataset} />);
    await user.type(screen.getByRole("searchbox"), "猎天使魔女");
    expect(screen.getByRole("button", { name: /猎天使魔女压制案例/ })).toBeTruthy();
    expect(screen.getByTestId("graph-node-domain-combat").getAttribute("data-highlighted")).toBe("true");
  });

  it("shows active filters, clears a no-result state, and offers alias-prefix suggestions", async () => {
    const user = userEvent.setup();
    render(<App dataset={dataset} />);
    await user.click(screen.getByRole("button", { name: "展开筛选" }));
    await user.click(screen.getByRole("checkbox", { name: "目标冲突" }));
    await user.type(screen.getByRole("searchbox"), "Bayo");
    expect(screen.getByText("没有符合条件的结果")).toBeTruthy();
    expect(screen.getAllByText(/目标冲突/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "建议：Bayonetta" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "清除全部条件" }));
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  });
});

describe("IndexViews", () => {
  it("renders sortable case, conflict, and source indexes with navigation", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { rerender } = render(<IndexViews dataset={dataset} view="cases" onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: /猎天使魔女压制案例/ }));
    expect(onSelect).toHaveBeenCalledWith("bayo-case");
    rerender(<IndexViews dataset={dataset} view="conflicts" onSelect={onSelect} />);
    expect(screen.getByText("目标冲突")).toBeTruthy();
    rerender(<IndexViews dataset={dataset} view="sources" onSelect={onSelect} />);
    expect(screen.getByRole("button", { name: /战斗资料 Z/ })).toBeTruthy();
  });
});
