import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GraphExplorer } from "../src/app/GraphExplorer";
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
    { source: "domain-combat", target: "pressure", kind: "parent_of" },
    { source: "domain-production-philosophy", target: "deep-child", kind: "parent_of" },
    { source: "domain-combat", target: "combat-conflict", kind: "conflicts_with" }
  ],
  searchRecords: [],
  stats: { concepts: 9, cases: 0, conflicts: 1, sources: 0, games: 0, media: 0 }
};

describe("GraphExplorer", () => {
  it("starts with the root and six first-ring domains", () => {
    render(<GraphExplorer dataset={dataset} selectedId="root-action-design" highlightedIds={[]} onSelect={vi.fn()} />);
    expect(screen.getAllByTestId("graph-node")).toHaveLength(7);
  });

  it("expands direct children and conflicts without unrelated deep nodes", () => {
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={vi.fn()} />);
    expect(screen.getByRole("button", { name: /立回/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /主动与被动之争/ }).getAttribute("data-kind")).toBe("conflict");
    expect(screen.queryByText("制作人与导演")).toBeNull();
  });

  it("supports arrow movement, Enter selection, Escape parent navigation, breadcrumbs and tooltips", () => {
    const onSelect = vi.fn();
    render(<GraphExplorer dataset={dataset} selectedId="domain-combat" highlightedIds={[]} onSelect={onSelect} />);
    const combat = screen.getAllByTestId("graph-node").find((node) => node.textContent?.includes("战斗思路")) as HTMLButtonElement;
    combat.focus();
    fireEvent.keyDown(combat, { key: "ArrowDown" });
    expect(document.activeElement).not.toBe(combat);
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Enter" });
    expect(onSelect).toHaveBeenCalled();
    fireEvent.focus(combat);
    expect(screen.getByRole("tooltip").textContent).toContain("关系");
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
