import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("atlas typography", () => {
  it("keeps explicit UI font sizes at or above the readable minimum", () => {
    const css = readFileSync("src/styles.css", "utf8");
    const sizes = [...css.matchAll(/font-size:\s*(\d+)px/g)].map((match) => Number(match[1]));

    expect(sizes.length).toBeGreaterThan(0);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(11);
  });
});
