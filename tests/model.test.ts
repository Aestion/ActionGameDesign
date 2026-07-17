import { describe, expect, it } from "vitest";
import { createEmptyDataset, isRelationKind } from "../src/model";

describe("knowledge model", () => {
  it("creates a versioned empty dataset with all counters", () => {
    expect(createEmptyDataset("2026-07-17T00:00:00.000Z")).toEqual({
      version: 1,
      generatedAt: "2026-07-17T00:00:00.000Z",
      entities: [],
      edges: [],
      searchRecords: [],
      stats: { concepts: 0, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 }
    });
  });

  it("accepts only declared relation kinds", () => {
    expect(isRelationKind("exemplified_by")).toBe(true);
    expect(isRelationKind("looks_like")).toBe(false);
  });
});
