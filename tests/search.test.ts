import { describe, expect, it } from "vitest";
import { compileContent } from "../src/build/compile-content";
import { searchDataset } from "../src/search";
import type { KnowledgeEntity } from "../src/model";

const generatedAt = "2026-07-17T00:00:00.000Z";

function entity(overrides: Partial<KnowledgeEntity> & Pick<KnowledgeEntity, "id" | "kind" | "title">): KnowledgeEntity {
  return {
    aliases: [],
    summary: "",
    bodyHtml: "",
    domainIds: [],
    depth: 1,
    tags: [],
    reviewStatus: "reviewed",
    updated: "2026-07-17",
    citations: [],
    media: [],
    examples: [],
    ...overrides
  };
}

describe("compileContent", () => {
  it("sorts data, adds reverse edges, computes counters, and compiles normalized search records", () => {
    const loaded = {
      entities: [
        entity({
          id: "z-case",
          kind: "case",
          title: "低韧性 Boss",
          aliases: ["低强韧"],
          summary: "斋藤利三与贞德",
          bodyHtml: "<p>压制窗口</p>",
          tags: ["Boss"],
          media: [{ src: "media/example.gif", alt: "示例", caption: "窗口", kind: "gif", sourceId: "a-source" }],
          examples: [{ id: "example", gameId: "nioh-2", subject: "斋藤利三", mechanism: "削韧", outcome: "处决", sourceIds: ["a-source"] }]
        }),
        entity({ id: "a-source", kind: "source", title: "来源" }),
        entity({ id: "m-conflict", kind: "conflict", title: "冲突", conflictType: "goal" })
      ],
      declaredEdges: [{ source: "z-case", target: "a-source", kind: "related_to" as const }],
      filesById: new Map()
    };

    const dataset = compileContent(loaded, generatedAt);

    expect(dataset.entities.map(({ id }) => id)).toEqual(["a-source", "m-conflict", "z-case"]);
    expect(dataset.edges).toEqual([
      { source: "a-source", target: "z-case", kind: "related_to" },
      { source: "z-case", target: "a-source", kind: "related_to" }
    ]);
    expect(dataset.stats).toEqual({ concepts: 0, cases: 1, conflicts: 1, sources: 1, games: 0, media: 1 });
    expect(dataset.searchRecords.find(({ id }) => id === "z-case")).toMatchObject({
      id: "z-case",
      title: "低韧性 Boss"
    });
    expect(dataset.searchRecords.find(({ id }) => id === "z-case")?.text).toContain("斋藤利三");
    expect(dataset.searchRecords.find(({ id }) => id === "z-case")?.text).not.toMatch(/[A-Z\s]/);
  });
});

describe("searchDataset", () => {
  const dataset = compileContent({
    entities: [
      entity({ id: "exact-title", kind: "concept", title: "低韧性 Boss", aliases: ["低强韧"], summary: "斋藤利三与贞德", tags: ["Boss"] }),
      entity({ id: "alias", kind: "concept", title: "强韧系统", aliases: ["低韧性 Boss"], domainIds: ["combat"], reviewStatus: "draft" }),
      entity({ id: "title-substring", kind: "concept", title: "关于低韧性 Boss的设计", domainIds: ["combat"] }),
      entity({ id: "token", kind: "case", title: "案例", tags: ["低韧性 Boss"], examples: [{ id: "e", gameId: "nioh-2", subject: "斋藤利三", mechanism: "削韧", outcome: "压制", sourceIds: [] }] }),
      entity({ id: "body", kind: "conflict", title: "观点", summary: "讨论低韧性 Boss", conflictType: "goal" })
    ],
    declaredEdges: [],
    filesById: new Map()
  }, generatedAt);

  it("matches titles, aliases, games, and Boss names with normalized Chinese text", () => {
    expect(searchDataset(dataset, "斋藤 利三", {})).toEqual(["token", "exact-title"]);
    const gameDataset = compileContent({
      entities: [
        entity({ id: "nioh-2", kind: "game", title: "仁王 2", aliases: ["Nioh 2"] }),
        entity({ id: "nioh-case", kind: "case", title: "仁王案例", examples: [{ id: "game-example", gameId: "nioh-2", subject: "Boss", mechanism: "削韧", outcome: "压制", sourceIds: [] }] })
      ],
      declaredEdges: [],
      filesById: new Map()
    }, generatedAt);
    expect(searchDataset(gameDataset, "仁王 2", {})).toEqual(["nioh-2", "nioh-case"]);
  });

  it("orders exact titles, aliases, title substrings, tokens, and body matches deterministically", () => {
    expect(searchDataset(dataset, "低韧性 Boss", {})).toEqual([
      "exact-title",
      "alias",
      "title-substring",
      "token",
      "body"
    ]);
  });

  it("applies domain, game, conflict type, and review status filters", () => {
    expect(searchDataset(dataset, "", { domains: ["combat"], reviewStatuses: ["draft"] })).toEqual(["alias"]);
    expect(searchDataset(dataset, "", { games: ["nioh-2"] })).toEqual(["token"]);
    expect(searchDataset(dataset, "", { conflictTypes: ["goal"] })).toEqual(["body"]);
  });
});
