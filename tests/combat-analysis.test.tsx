import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/app/App";
import { CombatAnalysisView } from "../src/app/CombatAnalysisView";
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

const dataset: KnowledgeDataset = {
  version: 1,
  generatedAt: "2026-07-17T00:00:00.000Z",
  entities: [
    entity({ id: "domain-combat", title: "战斗思路", depth: 1 }),
    entity({ id: "domain-system-depth", title: "复合决策与系统深度", depth: 1 }),
    entity({ id: "domain-enemy-boss", title: "敌人与 Boss 设计", depth: 1 }),
    entity({ id: "domain-presentation", title: "动作表现与可读性", depth: 1 }),
    entity({ id: "round-based-humanoid", title: "回合制攻防型低韧人形", domainIds: ["domain-enemy-boss"] })
  ],
  edges: [],
  searchRecords: [],
  stats: { concepts: 5, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 }
};

describe("combat analysis", () => {
  it("organizes source material into five analysis dimensions and preserves the source diagram", () => {
    const onSelect = vi.fn();
    render(<CombatAnalysisView dataset={dataset} onSelect={onSelect} />);

    expect(screen.getByRole("heading", { name: "战斗博弈分析" })).toBeTruthy();
    for (const title of ["问题", "优劣", "方向", "差异", "重心"]) {
      expect(screen.getByRole("heading", { name: title })).toBeTruthy();
    }
    expect(screen.getByText("鬼泣 5" )).toBeTruthy();
    expect(screen.getByText("EE2" )).toBeTruthy();
    expect(screen.getByRole("heading", { name: "文档信息归纳" })).toBeTruthy();
    expect(screen.getByText(/相杀是否区分招式轻重与属性/)).toBeTruthy();
    expect(screen.getByText(/自由态、出招时、破绽形式和脱离形式/)).toBeTruthy();
    expect(screen.getByRole("img", { name: "战斗博弈梳理2.vsdx 原始图谱" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "回合制攻防型低韧人形" })).toBeTruthy();
  });

  it("navigates from an analysis reference to a knowledge node", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CombatAnalysisView dataset={dataset} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "回合制攻防型低韧人形" }));

    expect(onSelect).toHaveBeenCalledWith("round-based-humanoid");
  });

  it("opens the analysis view from the main navigation", async () => {
    const user = userEvent.setup();
    render(<App dataset={dataset} />);

    await user.click(screen.getByRole("button", { name: "战斗博弈" }));

    expect(screen.getByRole("heading", { name: "战斗博弈分析" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "战斗博弈" }).getAttribute("aria-current")).toBe("page");
  });
});
