import { afterEach, describe, expect, it } from "vitest";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildAtlas, verifyOfflinePackage } from "../scripts/build-atlas";
import { copyMedia } from "../scripts/copy-media";
import { createBuildFixture } from "./helpers/build-fixture";

const roots: string[] = [];
const fixedNow = () => new Date("2026-07-17T00:00:00.000Z");

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("offline build output", () => {
  it("inlines application code and styles while keeping every remaining local reference file-compatible", async () => {
    const root = await createBuildFixture(roots);

    const report = await buildAtlas({ root, contentRoot: "content", now: fixedNow });

    expect(report.success).toBe(true);
    expect(report.stats).toMatchObject({ concepts: 1, sources: 1, media: 1 });
    const html = await readFile(path.join(root, "dist", "index.html"), "utf8");
    expect(html).toContain("<script type=\"module\">");
    expect(html).toContain("textContent");
    expect(html).toContain("<style>");
    expect(html).not.toMatch(/<script\b[^>]*\bsrc=/iu);
    expect(html).not.toMatch(/<link\b[^>]*rel=["']stylesheet["'][^>]*\bhref=/iu);
    expect(html).not.toMatch(/\bimport\s*\(/u);
    const localReferences = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/giu)]
      .map((match) => match[1])
      .filter((reference) => !reference.startsWith("#") && !reference.startsWith("data:"));
    expect(localReferences).toEqual(["./media/sample.gif"]);
    expect(await readFile(path.join(root, "dist", "media", "sample.gif"), "utf8")).toBe("GIF89a");
    const generated = await readFile(path.join(root, "src", "generated", "knowledge.ts"), "utf8");
    expect(generated).toContain("satisfies KnowledgeDataset");
    expect(generated).toContain('"generatedAt": "2026-07-17T00:00:00.000Z"');
  });

  it.each([
    ["fetch", "fetch('./data.json')"],
    ["XMLHttpRequest", "new XMLHttpRequest()"],
    ["WebSocket", "new WebSocket('ws://localhost')"],
    ["EventSource", "new EventSource('./events')"],
    ["sendBeacon", "navigator.sendBeacon('./log')"],
    ["remote URL", "const endpoint = 'https://example.com/api'"],
    ["dynamic import", "import('./chunk.js')"]
  ])("rejects the network-capable %s pattern in the final package", async (_label, injected) => {
    const root = await createBuildFixture(roots);
    const outputDir = path.join(root, "adversarial-output");
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), `<!doctype html><script>${injected}</script>`);

    await expect(verifyOfflinePackage(outputDir, [])).rejects.toThrow(/offline|network|dynamic/i);
  });

  it.each([
    ["CSS URL", `<style>.broken { background: url('./missing.png'); }</style>`],
    ["preload href", `<link rel="preload" href="./missing.js">`],
    ["image src", `<img src="/absolute.png" alt="broken">`]
  ])("rejects an invalid final %s reference", async (_label, injected) => {
    const root = await createBuildFixture(roots);
    const outputDir = path.join(root, "reference-output");
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), `<!doctype html>${injected}<script>void 0</script>`);

    await expect(verifyOfflinePackage(outputDir, [])).rejects.toThrow();
  });

  it("rejects publish-path traversal and destination collisions before copying media", async () => {
    const root = await createBuildFixture(roots);
    const sourceFile = path.join(root, "content", "concepts", "concept.md");
    const common = { sourcePath: "../../assets/sample.gif", alt: "sample", caption: "sample", kind: "gif", sourceId: "source" } as const;
    const loaded = {
      entities: [
        { id: "first", media: [{ ...common, src: "media/shared.gif" }] },
        { id: "second", media: [{ ...common, src: "media/shared.gif" }] }
      ],
      declaredEdges: [],
      filesById: new Map([["first", [sourceFile]], ["second", [sourceFile]]])
    };
    await expect(copyMedia(loaded as never, path.join(root, "copy-output"), { approvedSourceRoots: [root] }))
      .rejects.toThrow(/collision/i);

    loaded.entities[1].media[0].src = "../escape.gif";
    await expect(copyMedia(loaded as never, path.join(root, "copy-output"), { approvedSourceRoots: [root] }))
      .rejects.toThrow(/escapes|publish path/i);
  });
});
