import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildAtlas } from "../scripts/build-atlas";

const roots: string[] = [];
const fixedNow = () => new Date("2026-07-17T00:00:00.000Z");

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("buildAtlas safety", () => {
  it("does not replace dist or remove unrelated temporary files when validation fails", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "atlas-build-safety-"));
    roots.push(root);
    await mkdir(path.join(root, "dist"), { recursive: true });
    await mkdir(path.join(root, ".build-tmp", "current"), { recursive: true });
    await mkdir(path.join(root, "broken-content"), { recursive: true });
    await writeFile(path.join(root, "dist", "sentinel.txt"), "last-good");
    await writeFile(path.join(root, ".build-tmp", "keep.txt"), "keep");
    await writeFile(path.join(root, ".build-tmp", "current", "stale.txt"), "stale");

    const report = await buildAtlas({ root, contentRoot: "broken-content", now: fixedNow });

    expect(report.success).toBe(false);
    expect(report.generatedAt).toBe("2026-07-17T00:00:00.000Z");
    expect(report.issues.map(({ code }) => code)).toEqual(expect.arrayContaining(["empty-graph", "empty-search-index"]));
    expect(await readFile(path.join(root, "dist", "sentinel.txt"), "utf8")).toBe("last-good");
    expect(await readFile(path.join(root, ".build-tmp", "keep.txt"), "utf8")).toBe("keep");
    await expect(readFile(path.join(root, ".build-tmp", "current", "stale.txt"), "utf8")).rejects.toThrow();
  });
});
