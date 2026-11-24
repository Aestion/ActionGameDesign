import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../src/build/render-markdown";

describe("renderMarkdown", () => {
  it("adds stable, unique heading anchors and derives reading metadata", async () => {
    const result = await renderMarkdown("## 核心定义\n\n正文。\n\n## 核心定义\n\n补充。\n\n### 条件与边界\n\n适用范围。");

    expect(result.headings).toEqual([
      { id: "核心定义", text: "核心定义", level: 2 },
      { id: "核心定义-2", text: "核心定义", level: 2 },
      { id: "条件与边界", text: "条件与边界", level: 3 }
    ]);
    expect(result.html).toContain('<h2 id="核心定义">核心定义</h2>');
    expect(result.html).toContain('<h2 id="核心定义-2">核心定义</h2>');
    expect(result.html).toContain('<h3 id="条件与边界">条件与边界</h3>');
    expect(result.readingMinutes).toBeGreaterThanOrEqual(1);
  });
});
