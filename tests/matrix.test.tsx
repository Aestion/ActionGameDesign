import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComparisonMatrix } from "../src/app/ComparisonMatrix";
import type { KnowledgeDataset, KnowledgeEntity } from "../src/model";

afterEach(cleanup);

function entity(overrides: Partial<KnowledgeEntity> & Pick<KnowledgeEntity, "id" | "title">): KnowledgeEntity {
  return {
    kind: "concept", aliases: [], summary: `${overrides.title}摘要`, bodyHtml: "", domainIds: [],
    depth: 3, tags: [], reviewStatus: "reviewed", updated: "2026-07-17", citations: [], media: [], examples: [],
    ...overrides
  };
}

const dataset: KnowledgeDataset = {
  version: 1,
  generatedAt: "2026-07-17T00:00:00.000Z",
  entities: [
    entity({
      id: "bayonetta", title: "猎天使魔女", kind: "game",
      matrix: { combat: "压制 / 定番" }
    }),
    entity({ id: "empty-game", title: "资料稀疏游戏", kind: "game", matrix: {} }),
    entity({
      id: "domain-combat", title: "战斗思路", domainIds: ["domain-combat"],
      examples: [{
        id: "bayo-pressure", gameId: "bayonetta", subject: "妖刀压起身", mechanism: "在起身窗口重新击倒",
        outcome: "形成有条件的压制循环", sourceIds: ["source-combat"]
      }],
      citations: [{ sourceId: "source-combat", locator: "压制章节" }],
      tags: ["压制", "起身窗口"]
    }),
    entity({ id: "source-combat", title: "战斗思路资料", kind: "source" })
  ],
  edges: [],
  searchRecords: [],
  stats: { concepts: 1, cases: 0, conflicts: 0, sources: 1, games: 2, media: 0 }
};

describe("ComparisonMatrix", () => {
  it("renders the seven approved dimensions", () => {
    render(<ComparisonMatrix dataset={dataset} onSelect={vi.fn()} />);

    for (const heading of [
      "类型与框架", "反应频率", "时间 / 空间 / 指令精度", "主要战斗思路",
      "敌人 / Boss 韧性与 AI", "外部规则与反馈循环", "可读性与表现"
    ]) expect(screen.getByRole("columnheader", { name: heading })).toBeTruthy();
  });

  it("opens evidence from a matrix cell and returns to its concept", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ComparisonMatrix dataset={dataset} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "猎天使魔女：主要战斗思路" }));
    expect(screen.getAllByText("压制 / 定番")).toHaveLength(2);
    expect(screen.getByText("妖刀压起身")).toBeTruthy();
    expect(screen.getByText("战斗思路资料")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "查看战斗思路节点" }));
    expect(onSelect).toHaveBeenCalledWith("domain-combat");
  });

  it("states evidence absence instead of inventing a judgment", async () => {
    const user = userEvent.setup();
    render(<ComparisonMatrix dataset={dataset} onSelect={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "资料稀疏游戏：类型与框架" }));
    expect(screen.getAllByText("暂无结构化判断").length).toBeGreaterThan(0);
    expect(screen.getByText("当前资料没有可用于这一维度的判断或证据。")).toBeTruthy();
  });
});
