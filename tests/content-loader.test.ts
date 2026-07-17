import { describe, expect, it } from "vitest";
import { loadContent } from "../src/build/load-content";

describe("loadContent", () => {
  it("parses frontmatter, renders safe HTML, and preserves declared relations", async () => {
    const result = await loadContent("tests/fixtures/content");

    expect(result.entities[0].id).toBe("concept-sample");
    expect(result.entities[0].bodyHtml).toContain("<strong>Markdown</strong>");
    expect(result.declaredEdges).toEqual([
      { source: "concept-sample", target: "concept-peer", kind: "related_to" }
    ]);
    expect((result.entities.find((entity) => entity.id === "source-sample") as {
      sourceMeta?: { primaryUrls: string[]; secondaryUrls: string[] };
    }).sourceMeta).toEqual({
      rawPath: "原始资料/sample.md",
      primaryUrls: ["https://primary.example.com"],
      secondaryUrls: ["https://secondary.example.com"]
    });
  });

  it("includes the originating path when frontmatter schema validation fails", async () => {
    await expect(loadContent("tests/fixtures/invalid-content")).rejects.toThrow(/broken\.md/);
  });
});
