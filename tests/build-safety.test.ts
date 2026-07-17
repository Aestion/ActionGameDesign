import { afterEach, describe, expect, it } from "vitest";
import { access, mkdtemp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildAtlas } from "../scripts/build-atlas";
import { createBuildFixture } from "./helpers/build-fixture";

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

  it("moves an existing successful build to dist-last-good", async () => {
    const root = await createBuildFixture(roots);
    await mkdir(path.join(root, "dist"), { recursive: true });
    await writeFile(path.join(root, "dist", "sentinel.txt"), "last-good");

    const report = await buildAtlas({ root, contentRoot: "content", now: fixedNow });

    expect(report.success).toBe(true);
    expect(await readFile(path.join(root, "dist-last-good", "sentinel.txt"), "utf8")).toBe("last-good");
    expect(await readFile(path.join(root, "dist", "index.html"), "utf8")).toContain("<script type=\"module\">");
  });

  it("restores the exact previous dist when staging promotion fails", async () => {
    const root = await createBuildFixture(roots);
    await mkdir(path.join(root, "dist", "nested"), { recursive: true });
    await writeFile(path.join(root, "dist", "sentinel.txt"), "last-good");
    await writeFile(path.join(root, "dist", "nested", "bytes.bin"), Buffer.from([0, 1, 2, 255]));
    const distDir = path.join(root, "dist");
    const tempDir = path.join(root, ".build-tmp", "current");

    const report = await buildAtlas({
      root,
      contentRoot: "content",
      now: fixedNow,
      renamePath: async (from, to) => {
        if (path.resolve(from) === tempDir && path.resolve(to) === distDir) {
          throw new Error("injected staging promotion failure");
        }
        await rename(from, to);
      }
    });

    expect(report.success).toBe(false);
    expect(report.issues.at(-1)?.message).toContain("injected staging promotion failure");
    expect(await readFile(path.join(root, "dist", "sentinel.txt"), "utf8")).toBe("last-good");
    expect(await readFile(path.join(root, "dist", "nested", "bytes.bin"))).toEqual(Buffer.from([0, 1, 2, 255]));
    await expect(access(path.join(root, "dist", "index.html"))).rejects.toThrow();
    await expect(access(path.join(root, "dist-last-good"))).rejects.toThrow();
  });
});
