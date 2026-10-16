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
      view: "graph"
    });
    expect(createInitialState("#node=domain-combat")).not.toHaveProperty("detailDepth");
  });

  it("selects a node without introducing detail depth state", () => {
    const selected = atlasReducer(createInitialState(""), {
      type: "select-node",
      id: "domain-combat"
    });
    expect(selected.selectedId).toBe("domain-combat");
    expect(selected).not.toHaveProperty("detailDepth");
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

  it("pushes each node selection onto the history stack so back retraces steps", async () => {
    const pushSpy = vi.spyOn(window.history, "pushState");
    const replaceSpy = vi.spyOn(window.history, "replaceState");
    const user = userEvent.setup();
    render(<App dataset={fixtureDataset} />);

    await user.click(screen.getByRole("button", { name: "战斗思路" }));
    await user.click(screen.getByTestId("graph-node-pressure"));

    expect(pushSpy).toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
  });
});

describe("NodeDetail", () => {
  it("labels source view, editorial explanation, and editorial synthesis separately", () => {
    render(<NodeDetail entity={fixtureEntity} dataset={fixtureDataset} />);

    expect(screen.getByText("来源观点")).toBeTruthy();
    expect(screen.getByText("编者解释")).toBeTruthy();
    expect(screen.getByText("编者归纳")).toBeTruthy();
  });

  it("renders complete research material in three semantic sections", () => {
    render(<NodeDetail entity={fixtureEntity} dataset={fixtureDataset} />);

    const brief = screen.getByRole("region", { name: "简述" });
    const detailed = screen.getByRole("region", { name: "详细" });
    const supplement = screen.getByRole("region", { name: "补充" });

    expect(brief.compareDocumentPosition(detailed) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(detailed.compareDocumentPosition(supplement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole("button", { name: "一眼看懂" })).toBeNull();
    expect(screen.queryByRole("button", { name: "展开理解" })).toBeNull();
    expect(screen.queryByRole("button", { name: "深入研究" })).toBeNull();
    expect(screen.getByText("结构化说明。")).toBeTruthy();
    expect(screen.getByRole("button", { name: /压制/ })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "案例" })).toBeTruthy();
    expect(screen.getByText("斋藤利三")).toBeTruthy();
    expect(screen.getByText("战斗思路章节")).toBeTruthy();
    expect(screen.getByText("战斗主轴会随资源和敌人性能发生转换。")).toBeTruthy();
  });

  it("keeps related-node navigation available in the full detail view", async () => {
    const user = userEvent.setup();
    const onSelectEntity = vi.fn();
    render(<NodeDetail entity={fixtureEntity} dataset={fixtureDataset} onSelectEntity={onSelectEntity} />);

    await user.click(screen.getByRole("button", { name: "压制" }));

    expect(onSelectEntity).toHaveBeenCalledWith("pressure");
  });

  it("shows every conflict side with conditions, source labels, and separate synthesis", () => {
    const conflict = entity({
      id: "readability-conflict", title: "可读性还是观赏性", kind: "conflict", conflictType: "goal",
      conflictSides: [
        { label: "可读性优先", claim: "先传达功能。", conditions: "高惩罚实时操作", sourceIds: ["source-combat"] },
        { label: "观赏性可优先", claim: "可接受部分遮挡。", conditions: "低失败成本", sourceIds: ["source-combat"] }
      ],
      editorialSynthesis: "编者归纳：取舍取决于玩家是否必须立即负责结果。"
    });
    render(<NodeDetail entity={conflict} dataset={fixtureDataset} />);
    expect(screen.getByText("可读性优先")).toBeTruthy();
    expect(screen.getByText("条件：高惩罚实时操作")).toBeTruthy();
    expect(screen.getAllByText("战斗资料")).toHaveLength(2);
    expect(screen.getByText("取舍取决于玩家是否必须立即负责结果。")).toBeTruthy();
  });

  it("lazy-loads media, opens a sourced dialog, and degrades on image error", async () => {
    const user = userEvent.setup();
    const mediaEntity = entity({
      id: "media-node", title: "动作媒体", media: [{
        sourcePath: "clip.gif", src: "media/clip.gif", alt: "压制循环演示", caption: "起身窗口中的重新击倒",
        kind: "gif", sourceId: "source-combat"
      }]
    });
    render(<NodeDetail entity={mediaEntity} dataset={fixtureDataset} />);
    const image = screen.getByRole("img", { name: "压制循环演示" });
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(screen.getByText("来源：战斗资料")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "放大：压制循环演示" }));
    expect(screen.getByRole("dialog", { name: "压制循环演示" })).toBeTruthy();
    fireEvent.error(image);
    expect(screen.getByText("媒体加载失败：压制循环演示")).toBeTruthy();
  });

  it("closes the media dialog on Escape via the cancel event", async () => {
    const user = userEvent.setup();
    const mediaEntity = entity({
      id: "media-node", title: "动作媒体", media: [{
        sourcePath: "clip.gif", src: "media/clip.gif", alt: "压制循环演示", caption: "起身窗口中的重新击倒",
        kind: "gif", sourceId: "source-combat"
      }]
    });
    render(<NodeDetail entity={mediaEntity} dataset={fixtureDataset} />);
    await user.click(screen.getByRole("button", { name: "放大：压制循环演示" }));
    const dialog = screen.getByRole("dialog", { name: "压制循环演示" }) as HTMLDialogElement;
    expect(dialog).toBeTruthy();

    fireEvent(dialog, new Event("cancel", { cancelable: true }));

    expect(screen.queryByRole("dialog", { name: "压制循环演示" })).toBeNull();
  });
});
