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
  });
});
