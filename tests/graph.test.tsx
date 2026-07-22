import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { buildHierarchyView, GRAPH_ROOT_ID, GraphExplorer } from "../src/app/GraphExplorer";
import { MobileTree } from "../src/app/MobileTree";
import type { KnowledgeDataset, KnowledgeEntity } from "../src/model";

afterEach(cleanup);

function entity(id: string, title: string, domainIds: string[] = []): KnowledgeEntity {
  return {
    id, title, domainIds, kind: "concept", aliases: [], summary: `${title}摘要`, bodyHtml: "",
    depth: id.startsWith("domain-") ? 1 : 2, tags: [], reviewStatus: "reviewed",
    updated: "2026-07-17", citations: [], media: [], examples: []
  };
}

const domains = [
  entity("domain-type-boundary", "类型与边界"),
  entity("domain-system-depth", "复合决策与系统深度"),
  entity("domain-combat", "战斗思路"),
  entity("domain-enemy-boss", "敌人与 Boss 设计"),
  entity("domain-presentation", "动作表现与可读性"),
  entity("domain-production-philosophy", "制作方法与设计哲学")
];

const dataset: KnowledgeDataset = {
  version: 1, generatedAt: "2026-07-17T00:00:00.000Z",
  entities: [
    ...domains,
    entity("neutral", "立回", ["domain-combat"]),
    entity("pressure", "压制", ["domain-combat"]),
    entity("deep-child", "制作人与导演", ["domain-production-philosophy"]),
    { ...entity("combat-conflict", "主动与被动之争", ["domain-combat"]), kind: "conflict" }
  ],
  edges: [
    { source: "domain-combat", target: "neutral", kind: "parent_of" },
    { source: "neutral", target: "domain-combat", kind: "child_of" },
    { source: "domain-enemy-boss", target: "neutral", kind: "parent_of" },
    { source: "domain-presentation", target: "neutral", kind: "parent_of" },
    { source: "domain-combat", target: "pressure", kind: "parent_of" },
    { source: "domain-production-philosophy", target: "deep-child", kind: "parent_of" },
    { source: "domain-combat", target: "combat-conflict", kind: "conflicts_with" }
  ],
  searchRecords: [],
  stats: { concepts: 9, cases: 0, conflicts: 1, sources: 0, games: 0, media: 0 }
};

describe("buildHierarchyView", () => {
  it("keeps the root view to the root and six ordered domains", () => {
    const view = buildHierarchyView(dataset, GRAPH_ROOT_ID);

    expect(view.entities.map(({ id }) => id)).toEqual([
      GRAPH_ROOT_ID,
      "domain-type-boundary",
      "domain-system-depth",
      "domain-combat",
      "domain-enemy-boss",
      "domain-presentation",
      "domain-production-philosophy"
    ]);
    expect(view.edges).toHaveLength(6);
    expect(view.edges.every(({ kind }) => kind === "parent_of")).toBe(true);
  });

  it("focuses the canvas on parents, the selected node and direct children", () => {
    const view = buildHierarchyView(dataset, "domain-combat");

    expect(view.entities.map(({ id }) => id)).toEqual([
      GRAPH_ROOT_ID, "domain-combat", "neutral", "pressure"
    ]);
    expect(view.entities.some(({ id }) => id === "domain-enemy-boss")).toBe(false);
    expect(view.entities.some(({ id }) => id === "combat-conflict")).toBe(false);
    expect(view.edges.every(({ kind }) => kind === "parent_of")).toBe(true);
    expect(view.edges.filter(({ source, target }) =>
      source === "domain-combat" && target === "neutral")).toHaveLength(1);
  });

  it("caps structural parents at two and groups cross-relations separately", () => {
    const neutralView = buildHierarchyView(dataset, "neutral");
    const combatView = buildHierarchyView(dataset, "domain-combat");

    expect(neutralView.parentIds).toEqual(["domain-combat", "domain-enemy-boss"]);
    expect(combatView.relations.find(({ id }) => id === "conflict")?.entities.map(({ id }) => id))
      .toEqual(["combat-conflict"]);
  });
});

describe("GraphExplorer", () => {
  it("starts with the root and six first-ring domains", () => {
    render(<GraphExplorer dataset={dataset} selectedId="root-action-design" highlightedIds={[]} onSelect={vi.fn()} />);
    expect(screen.getAllByTestId("graph-node")).toHaveLength(7);
  });

  it("focuses the canvas on the current hierarchy without unrelated domains or cross-relations", () => {
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={vi.fn()} />);

    expect(screen.getAllByTestId("graph-node")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /立回/ })).toBeTruthy();
    expect(screen.queryByText("主动与被动之争")).toBeNull();
    expect(screen.queryByText("敌人与 Boss 设计")).toBeNull();
    expect(screen.queryByText("制作人与导演")).toBeNull();
  });

  it("exposes hierarchy levels without the old graph legend or tooltip", () => {
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={vi.fn()} />);

    expect(screen.queryByLabelText("关系图例")).toBeNull();
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(screen.getByTestId("graph-node-root-action-design").getAttribute("data-level")).toBe("parent");
    expect(screen.getByTestId("graph-node-domain-combat").getAttribute("data-level")).toBe("current");
    expect(screen.getByTestId("graph-node-neutral").getAttribute("data-level")).toBe("child");
  });

  it("reveals grouped cross-relations on demand", () => {
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={vi.fn()} />);

    const toggle = screen.getByRole("button", { name: "展开关联节点" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);

    expect(screen.getByRole("group", { name: "冲突" }).textContent).toContain("主动与被动之争");
    expect(screen.getByRole("button", { name: "收起关联节点" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("selects a related node and closes the relation disclosure", () => {
    const onSelect = vi.fn();
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "展开关联节点" }));
    fireEvent.click(screen.getByRole("button", { name: "主动与被动之争" }));

    expect(onSelect).toHaveBeenCalledWith("combat-conflict");
    expect(screen.queryByRole("group", { name: "冲突" })).toBeNull();
  });

  it("never duplicates a node when parent_of and child_of both exist for the same pair", () => {
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={vi.fn()} />);
    // neutral 与 domain-combat 同时有 parent_of 和 child_of，但立回节点只应出现一次
    const neutralButtons = screen.getAllByTestId(/^graph-node-/).filter((node) => node.textContent?.includes("立回"));
    expect(neutralButtons).toHaveLength(1);
  });

  it("supports arrow movement, Enter selection, Escape parent navigation and breadcrumbs", () => {
    const onSelect = vi.fn();
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={onSelect} />);
    const combat = screen.getAllByTestId("graph-node").find((node) => node.textContent?.includes("战斗思路")) as HTMLButtonElement;
    combat.focus();
    fireEvent.keyDown(combat, { key: "ArrowDown" });
    expect(document.activeElement).not.toBe(combat);
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Enter" });
    expect(onSelect).toHaveBeenCalled();
    fireEvent.keyDown(combat, { key: "Escape" });
    expect(onSelect).toHaveBeenCalledWith("root-action-design");
    expect(screen.getByRole("navigation", { name: "图谱路径" }).textContent).toContain("动作游戏设计");
  });
});

describe("MobileTree", () => {
  it("uses nested disclosure controls and the shared selection callback", () => {
    const onSelect = vi.fn();
    render(<MobileTree dataset={dataset} selectedId="root-action-design" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /展开 战斗思路/ }));
    fireEvent.click(screen.getByRole("button", { name: "立回" }));
    expect(onSelect).toHaveBeenCalledWith("neutral");
  });
});
