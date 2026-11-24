import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/app/App";
import { nodeHash, viewFromHash } from "../src/app/app-state";
import type { KnowledgeDataset, KnowledgeEntity } from "../src/model";

const bodyHtml = '<h2 id="核心定义">核心定义</h2><p>动作反馈需要清楚。</p><h2 id="条件与边界">条件与边界</h2><p>适用于高响应动作。</p>';

function entity(): KnowledgeEntity {
  return {
    id: "readable-concept",
    kind: "concept",
    title: "可读的动作反馈",
    aliases: [],
    summary: "让玩家在正确时机看懂、判断并回应动作。",
    bodyHtml,
    headings: [
      { id: "核心定义", text: "核心定义", level: 2 },
      { id: "条件与边界", text: "条件与边界", level: 2 }
    ],
    readingMinutes: 2,
    domainIds: ["domain-combat"],
    depth: 3,
    tags: ["可读性", "反馈"],
    reviewStatus: "reviewed",
    updated: "2026-11-20",
    citations: [],
    media: [],
    examples: []
  };
}

const concept = entity();
const dataset: KnowledgeDataset = {
  version: 1,
  generatedAt: "2026-11-20T00:00:00.000Z",
  entities: [
    {
      ...concept,
      id: "domain-combat",
      kind: "concept",
      title: "战斗与操作",
      summary: "战斗系统的总览。",
      bodyHtml: "",
      headings: [],
      domainIds: [],
      depth: 1
    },
    concept
  ],
  edges: [{ source: "domain-combat", target: "readable-concept", kind: "parent_of" }],
  searchRecords: [],
  stats: { concepts: 2, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 }
};

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname);
});

describe("reading mode", () => {
  it("restores reader view and section context from a shareable hash", () => {
    expect(viewFromHash(nodeHash("readable-concept", "reader"))).toBe("reader");
    expect(nodeHash("readable-concept", "reader")).toContain("view=reader");
  });

  it("renders article navigation and retains section links without leaving the article", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/" + nodeHash("readable-concept", "reader"));
    render(<App dataset={dataset} />);

    expect(screen.getByRole("heading", { level: 1, name: "可读的动作反馈" })).toBeTruthy();
    expect(screen.getByText("约 2 分钟")).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /核心定义/ }).length).toBeGreaterThan(0);

    await user.click(screen.getAllByRole("link", { name: /条件与边界/ })[0]);
    expect(window.location.hash).toContain("node=readable-concept");
    expect(window.location.hash).toContain("view=reader");
    expect(window.location.hash).toContain("section=");
  });
});
