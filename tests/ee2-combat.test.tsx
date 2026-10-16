import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { App } from "../src/app/App";
import { EE2CombatView } from "../src/app/EE2CombatView";
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
    entity({ id: "neutral-and-openings", title: "立回与破绽", domainIds: ["domain-combat"] }),
    entity({ id: "interruption", title: "断招", domainIds: ["domain-combat"] }),
    entity({ id: "round-based-humanoid", title: "回合制攻防型低韧人形" }),
    entity({ id: "feedback-loops", title: "动作系统中的正负反馈循环" })
  ],
  edges: [],
  searchRecords: [],
  stats: { concepts: 5, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 }
};

describe("EE2 combat design", () => {
  it("explains how EE2 combat plays and completes its rules from the knowledge base", () => {
    render(<EE2CombatView dataset={dataset} onSelect={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "EE2 战斗玩法与博弈" })).toBeTruthy();
    for (const title of ["玩家如何战斗", "核心博弈循环", "三类僵直入口", "敌人设计规则", "设计边界与补全", "原型与验证"]) {
      expect(screen.getByRole("heading", { name: title })).toBeTruthy();
    }
    expect(screen.getByText("招式博弈 → 敌人僵直 → 玩家输出 → 敌人脱离 / 死亡")).toBeTruthy();
    const diagram = screen.getByRole("region", { name: "招式博弈关系图" });
    expect(screen.getByRole("heading", { name: "招式博弈关系" })).toBeTruthy();
    for (const route of ["比：招式等级对等", "抓：抓主动破绽", "触：触发弱点机制"]) {
      const button = within(diagram).getByRole("button", { name: route });
      expect(button.getAttribute("aria-pressed")).toBe("false");
      expect(button.hasAttribute("aria-describedby")).toBe(false);
    }
    for (const step of ["敌人僵直", "玩家有限输出", "敌人可读脱离", "回到招式博弈"]) {
      expect(within(diagram).getByText(step)).toBeTruthy();
    }
    expect(within(diagram).getByRole("heading", { name: "完整关系" })).toBeTruthy();
    expect(screen.getByText(/设计建议，不代表 EE2 已实现机制/)).toBeTruthy();
    expect(screen.queryByText(/气绝|稳定值|击晕|护甲/)).toBeNull();
    expect(screen.getByRole("button", { name: "立回与破绽" })).toBeTruthy();
  });

  it("focuses one EE2 interaction route and restores the complete graph", async () => {
    const user = userEvent.setup();
    render(<EE2CombatView dataset={dataset} onSelect={vi.fn()} />);

    const compare = screen.getByRole("button", { name: "比：招式等级对等" });
    const opening = screen.getByRole("button", { name: "抓：抓主动破绽" });
    const detail = screen.getByRole("status");

    await user.click(compare);
    expect(compare.getAttribute("aria-pressed")).toBe("true");
    expect([...document.querySelectorAll('[data-route="compare"]')].map((node) => node.getAttribute("data-state")))
      .toEqual(["active", "active", "active"]);
    expect(opening.closest("[data-route]")?.getAttribute("data-state")).toBe("muted");
    expect(within(detail).getByRole("heading", { name: "比 · 招式等级对等" })).toBeTruthy();
    expect(within(detail).getByText("双方招式相交时，比较打断等级与抗打断等级。")).toBeTruthy();

    await user.click(compare);
    expect(compare.getAttribute("aria-pressed")).toBe("false");
    expect(within(detail).getByRole("heading", { name: "完整关系" })).toBeTruthy();
  });

  it.each([
    ["比：招式等级对等", "比 · 招式等级对等", "compare"],
    ["抓：抓主动破绽", "抓 · 抓主动破绽", "opening"],
    ["触：触发弱点机制", "触 · 触发弱点机制", "weakness"]
  ])("activates the %s path from the keyboard", async (buttonName, detailHeading, routeId) => {
    const user = userEvent.setup();
    render(<EE2CombatView dataset={dataset} onSelect={vi.fn()} />);

    const button = screen.getByRole("button", { name: buttonName });
    button.focus();
    await user.keyboard("{Enter}");

    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect([...document.querySelectorAll(`[data-route="${routeId}"]`)].map((node) => node.getAttribute("data-state")))
      .toEqual(["active", "active", "active"]);
    expect(within(screen.getByRole("status")).getByRole("heading", { name: detailHeading })).toBeTruthy();
  });

  it("stacks the interaction map before its four-column minimum and keeps muted paths readable", () => {
    const css = readFileSync("src/styles.css", "utf8");

    expect(css).toMatch(/@media\s*\(max-width:\s*1024px\)[\s\S]*?\.ee2-interaction-map\s*\{\s*grid-template-columns:\s*1fr/u);
    expect(css).toMatch(/\.ee2-interaction-map\s+\[data-state="muted"\]\s*\{\s*opacity:\s*0\.68/u);
    expect(css).not.toMatch(/\.ee2-interaction-map\s+\[data-state="muted"\]\s*\{\s*opacity:\s*0\.28/u);
  });

  it("opens the EE2 design page from the main navigation", async () => {
    const user = userEvent.setup();
    render(<App dataset={dataset} />);

    await user.click(screen.getByRole("button", { name: "EE2 战斗" }));

    expect(screen.getByRole("heading", { name: "EE2 战斗玩法与博弈" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "EE2 战斗" }).getAttribute("aria-current")).toBe("page");
  });

  it("hides the graph detail panel after switching to the EE2 design page", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "#node=neutral-and-openings");
    render(<App dataset={dataset} />);

    expect(screen.getByRole("complementary")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "EE2 战斗" }));

    expect(screen.queryByRole("complementary")).toBeNull();
  });

  it("navigates from an EE2 rule to its supporting knowledge node", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<EE2CombatView dataset={dataset} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "立回与破绽" }));

    expect(onSelect).toHaveBeenCalledWith("neutral-and-openings");
  });
});
