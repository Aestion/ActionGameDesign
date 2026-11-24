import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import type { KnowledgeDataset, KnowledgeEntity } from "../src/model";
import { GRAPH_ROOT_ID } from "../src/app/GraphExplorer";
import { StructureExplorer, buildOutlineTree, outlinePath } from "../src/app/StructureExplorer";

afterEach(cleanup);

function entity(id: string, title: string, domainIds: string[] = [], overrides: Partial<KnowledgeEntity> = {}): KnowledgeEntity {
  return {
    id, title, domainIds, kind: "concept", aliases: [], summary: `${title}摘要`, bodyHtml: "",
    depth: id.startsWith("domain-") ? 1 : 2, tags: [], reviewStatus: "reviewed",
    updated: "2026-07-17", citations: [], media: [], examples: [],
    ...overrides
  };
}

const domains = [
  entity("domain-type-boundary", "类型与边界"),
  entity("domain-system-depth", "复合决策与系统深度"),
  entity("domain-combat", "战斗思路", [], { bodyHtml: "<h2>核心定义</h2><p>战斗思路正文。</p>" }),
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
    entity("grandchild", "起身窗口", ["domain-combat"]),
    { ...entity("combat-conflict", "主动与被动之争", ["domain-combat"]), kind: "conflict" }
  ],
  edges: [
    { source: "domain-combat", target: "neutral", kind: "parent_of" },
    { source: "neutral", target: "domain-combat", kind: "child_of" },
    { source: "domain-enemy-boss", target: "neutral", kind: "parent_of" },
    { source: "domain-presentation", target: "neutral", kind: "parent_of" },
    { source: "domain-combat", target: "pressure", kind: "parent_of" },
    { source: "pressure", target: "grandchild", kind: "parent_of" },
    { source: "domain-production-philosophy", target: "deep-child", kind: "parent_of" },
    { source: "domain-combat", target: "combat-conflict", kind: "conflicts_with" }
  ],
  searchRecords: [],
  stats: { concepts: 10, cases: 0, conflicts: 1, sources: 0, games: 0, media: 0 }
};

function renderExplorer(overrides: Partial<React.ComponentProps<typeof StructureExplorer>> = {}) {
  return render(
    <StructureExplorer
      dataset={dataset}
      selectedId={GRAPH_ROOT_ID}
      highlightedIds={[]}
      onSelect={vi.fn()}
      {...overrides}
    />
  );
}

describe("buildOutlineTree", () => {
  it("builds the root and six ordered domains", () => {
    const tree = buildOutlineTree(dataset);

    expect(tree.entity.id).toBe(GRAPH_ROOT_ID);
    expect(tree.children.map(({ entity }) => entity.id)).toEqual(domains.map(({ id }) => id));
  });

  it("keeps one copy of a node with several parents and nests deeper levels", () => {
    const tree = buildOutlineTree(dataset);
    const combat = tree.children.find(({ entity }) => entity.id === "domain-combat");
    const production = tree.children.find(({ entity }) => entity.id === "domain-production-philosophy");

    expect(combat?.children.map(({ entity }) => entity.id)).toEqual(["neutral", "pressure"]);
    expect(production?.children.map(({ entity }) => entity.id)).toEqual(["deep-child"]);
    const pressure = combat?.children.find(({ entity }) => entity.id === "pressure");
    expect(pressure?.children.map(({ entity }) => entity.id)).toEqual(["grandchild"]);

    const walk = (nodes: typeof tree.children): string[] =>
      nodes.flatMap((node) => [node.entity.id, ...walk(node.children)]);
    expect(walk(tree.children).filter((id) => id === "neutral")).toHaveLength(1);
  });

  it("derives the breadcrumb path for nested and unrelated nodes", () => {
    expect(outlinePath(dataset, "grandchild").map(({ id }) => id)).toEqual([
      GRAPH_ROOT_ID, "domain-combat", "pressure", "grandchild"
    ]);
    expect(outlinePath(dataset, "combat-conflict").map(({ id }) => id)).toEqual([
      GRAPH_ROOT_ID, "combat-conflict"
    ]);
  });
});

describe("StructureExplorer", () => {
  it("starts on the outline with only the first level expanded", () => {
    renderExplorer();

    expect(screen.getAllByTestId(/^graph-node-/)).toHaveLength(7);
    expect(screen.queryByTestId("graph-node-neutral")).toBeNull();
    expect(screen.getByRole("tab", { name: "目录" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("button", { name: "展开 战斗思路 的下一级" })).toBeTruthy();
  });

  it("expands and collapses one level without changing selection", () => {
    const onSelect = vi.fn();
    renderExplorer({ onSelect });

    fireEvent.click(screen.getByRole("button", { name: "展开 战斗思路 的下一级" }));
    expect(screen.getByTestId("graph-node-neutral")).toBeTruthy();
    expect(screen.getByRole("button", { name: "收起 战斗思路 的下一级" })).toBeTruthy();
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "收起 战斗思路 的下一级" }));
    expect(screen.queryByTestId("graph-node-neutral")).toBeNull();
  });

  it("selects a node from its title and expands the path to the new selection", () => {
    function Harness() {
      const [selectedId, setSelectedId] = useState(GRAPH_ROOT_ID);
      return <StructureExplorer dataset={dataset} selectedId={selectedId} highlightedIds={[]} onSelect={setSelectedId} />;
    }
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: "战斗思路" }));

    const selectedRow = screen.getByTestId("graph-node-domain-combat");
    expect(selectedRow.querySelector("button.structure-title")?.getAttribute("aria-current")).toBe("page");
    expect(screen.getByTestId("graph-node-neutral")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "结构路径" }).textContent).toContain("动作游戏设计");
  });

  it("expands and collapses the whole tree", () => {
    renderExplorer();

    fireEvent.click(screen.getByRole("button", { name: "展开全部" }));
    expect(screen.getByTestId("graph-node-grandchild")).toBeTruthy();
    expect(screen.getAllByTestId(/^graph-node-/)).toHaveLength(11);

    fireEvent.click(screen.getByRole("button", { name: "收起全部" }));
    expect(screen.getAllByTestId(/^graph-node-/)).toHaveLength(7);
    expect(screen.queryByTestId("graph-node-deep-child")).toBeNull();
  });

  it("marks search highlights on the matching rows", () => {
    renderExplorer({ highlightedIds: ["domain-combat"] });

    expect(screen.getByTestId("graph-node-domain-combat").getAttribute("data-highlighted")).toBe("true");
    expect(screen.getByTestId("graph-node-domain-presentation").getAttribute("data-highlighted")).toBe("false");
  });

  it("opens the reader from a node that has a full body", () => {
    const onRead = vi.fn();
    renderExplorer({ onRead });

    fireEvent.click(screen.getByRole("button", { name: "全文" }));
    expect(onRead).toHaveBeenCalledWith("domain-combat");
  });

  it("switches to the relation map on demand", () => {
    renderExplorer();

    fireEvent.click(screen.getByRole("tab", { name: "关系图" }));

    expect(screen.getByRole("tab", { name: "关系图" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getAllByTestId("graph-node")).toHaveLength(7);
    expect(screen.getByRole("navigation", { name: "图谱路径" })).toBeTruthy();
  });
});
