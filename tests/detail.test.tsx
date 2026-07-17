import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/app/App";
import { atlasReducer, createInitialState } from "../src/app/app-state";
import { NodeDetail } from "../src/app/components";
import type { KnowledgeDataset, KnowledgeEntity } from "../src/model";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname);
});

function entity(
  overrides: Partial<KnowledgeEntity> & Pick<KnowledgeEntity, "id" | "title">
): KnowledgeEntity {
  return {
    kind: "concept",
    aliases: [],
    summary: `${overrides.title}摘要`,
    bodyHtml: "<h2>核心定义</h2><p>结构化说明。</p><h2>条件与边界</h2><p>适用条件。</p>",
    domainIds: [],
    depth: 3,
    tags: [],
    reviewStatus: "reviewed",
    updated: "2026-07-17",
    citations: [],
    media: [],
    examples: [],
    ...overrides
  };
}

const domains = [
  ["domain-type-boundary", "类型与边界"],
  ["domain-system-depth", "复合决策与系统深度"],
  ["domain-combat", "战斗思路"],
  ["domain-enemy-boss", "敌人与 Boss 设计"],
  ["domain-presentation", "动作表现与可读性"],
  ["domain-production-philosophy", "制作方法与设计哲学"]
] as const;

const fixtureEntity = entity({
  id: "domain-combat",
  title: "战斗思路",
  summary: "描述玩家如何取得并扩大行动优势。",
  tags: ["立回", "压制"],
  examples: [
    {
      id: "combat-example",
      gameId: "nioh-2",
      subject: "斋藤利三",
      mechanism: "削精压制",
      outcome: "形成可控循环",
      sourceIds: ["source-combat"]
    }
  ],
  citations: [{ sourceId: "source-combat", locator: "战斗思路章节" }],
  editorialSynthesis: "战斗主轴会随资源和敌人性能发生转换。"
});

const fixtureDataset: KnowledgeDataset = {
  version: 1,
  generatedAt: "2026-07-17T00:00:00.000Z",
  entities: [
    ...domains.map(([id, title]) => entity({ id, title, depth: 1 })),
    entity({ id: "pressure", title: "压制", domainIds: ["domain-combat"] }),
    entity({ id: "source-combat", title: "战斗资料", kind: "source" })
  ],
  edges: [
    { source: "domain-combat", target: "pressure", kind: "parent_of" },
    { source: "domain-combat", target: "source-combat", kind: "supports" }
  ],
  searchRecords: [],
  stats: { concepts: 7, cases: 0, conflicts: 0, sources: 1, games: 0, media: 0 }
};

describe("atlas state", () => {
  it("hydrates a selected node from a shareable hash", () => {
    expect(createInitialState("#node=domain-combat")).toMatchObject({
      selectedId: "domain-combat",
      view: "graph",
      detailDepth: 1
    });
  });

  it("selects a node and can move through all three detail depths", () => {
    const selected = atlasReducer(createInitialState(""), {
      type: "select-node",
      id: "domain-combat"
    });
    expect(selected.selectedId).toBe("domain-combat");
    expect(atlasReducer(selected, { type: "set-detail-depth", depth: 3 }).detailDepth).toBe(3);
  });
});

describe("App", () => {
  it("renders the six data-driven knowledge domains", () => {
    render(<App dataset={fixtureDataset} />);

    for (const [, title] of domains) {
      expect(screen.getByRole("button", { name: title })).toBeTruthy();
    }
  });

  it("selects a node and preserves a shareable hash", async () => {
    const user = userEvent.setup();
    render(<App dataset={fixtureDataset} />);

    await user.click(screen.getByRole("button", { name: "战斗思路" }));

    expect(window.location.hash).toBe("#node=domain-combat");
    expect(screen.getByRole("heading", { name: "战斗思路" })).toBeTruthy();
  });
});

describe("NodeDetail", () => {
  it("labels source view, editorial explanation, and editorial synthesis separately", () => {
    render(<NodeDetail entity={fixtureEntity} dataset={fixtureDataset} depth={3} />);

    expect(screen.getByText("来源观点")).toBeTruthy();
    expect(screen.getByText("编者解释")).toBeTruthy();
    expect(screen.getByText("编者归纳")).toBeTruthy();
  });

  it("reveals research material only at the third depth", () => {
    const { rerender } = render(
      <NodeDetail entity={fixtureEntity} dataset={fixtureDataset} depth={1} />
    );
    expect(screen.getByRole("heading", { name: "节点速览" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "案例" })).toBeNull();

    rerender(<NodeDetail entity={fixtureEntity} dataset={fixtureDataset} depth={3} />);
    expect(screen.getByRole("heading", { name: "案例" })).toBeTruthy();
    expect(screen.getByText("斋藤利三")).toBeTruthy();
    expect(screen.getByText("战斗主轴会随资源和敌人性能发生转换。")).toBeTruthy();
  });

  it("uses semantic buttons to change detail depth", () => {
    const onDepthChange = vi.fn();
    render(
      <NodeDetail
        entity={fixtureEntity}
        dataset={fixtureDataset}
        depth={1}
        onDepthChange={onDepthChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "展开理解" }));
    expect(onDepthChange).toHaveBeenCalledWith(2);
  });
});
