import { afterEach, describe, expect, it } from "vitest";
import { access, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildAtlas, inlineApplicationAssets, verifyOfflinePackage } from "../scripts/build-atlas";
import { copyMedia } from "../scripts/copy-media";
import { createBuildFixture } from "./helpers/build-fixture";

const roots: string[] = [];
const fixedNow = () => new Date("2026-07-17T00:00:00.000Z");

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function writePackagedCandidate(outputDir: string, body: string): Promise<void> {
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), `<!doctype html><html><head></head><body>${body}</body></html>`);
  await inlineApplicationAssets(outputDir);
}

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
    expect(html).toContain("https://example.com/source");
    const inlinedAssetReference = html.match(/new URL\((["'`])(\.\/assets\/[^"'`]+\.svg)\1,\s*import\.meta\.url\)/u)?.[2];
    expect(inlinedAssetReference).toBeTruthy();
    await expect(access(path.join(root, "dist", inlinedAssetReference!.slice(2)))).resolves.toBeUndefined();
    const publishedSvg = (await readdir(path.join(root, "dist", "assets"))).find((file) => file.endsWith(".svg"));
    expect(publishedSvg).toBeTruthy();
    expect(await readFile(path.join(root, "dist", "assets", publishedSvg!), "utf8")).toContain("large-fixture-marker");
    const localReferences = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/giu)]
      .map((match) => match[1])
      .filter((reference) => !reference.startsWith("#") && !reference.startsWith("data:"));
    expect(localReferences).toEqual(["./media/sample.gif"]);
    expect(await readFile(path.join(root, "dist", "media", "sample.gif"), "utf8")).toBe("GIF89a");
    const generated = await readFile(path.join(root, "src", "generated", "knowledge.ts"), "utf8");
    expect(generated).toContain("satisfies KnowledgeDataset");
    expect(generated).toContain('"generatedAt": "2026-07-17T00:00:00.000Z"');
    expect(generated).toContain('"https://example.com/source"');
  });

  it("rebases Vite-style JavaScript asset URLs when moving code from assets into index.html", async () => {
    const root = await createBuildFixture(roots);
    const outputDir = path.join(root, "manual-inline-output");
    await mkdir(path.join(outputDir, "assets"), { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), `<!doctype html><script type="module" src="./assets/app.js"></script>`);
    await writeFile(path.join(outputDir, "assets", "app.js"), `const icon = new URL("./large.svg", import.meta.url).href; document.body.dataset.icon = icon;`);
    await writeFile(path.join(outputDir, "assets", "large.svg"), `<svg><desc>manual-large-asset</desc></svg>`);

    await inlineApplicationAssets(outputDir);
    const html = await readFile(path.join(outputDir, "index.html"), "utf8");

    expect(html).toContain(`new URL("./assets/large.svg", import.meta.url)`);
    await expect(verifyOfflinePackage(outputDir, [])).resolves.toBeUndefined();
  });

  it("does not treat JavaScript URL construction or citation literals as CSS requests", async () => {
    const root = await createBuildFixture(roots);
    const outputDir = path.join(root, "citation-output");
    await writePackagedCandidate(outputDir, `<a href="https://example.com/source">Citation</a><script>const citation = "https://example.com/source"; const parsed = new URL(citation);</script>`);

    await expect(verifyOfflinePackage(outputDir, [])).resolves.toBeUndefined();
  });

  it("requires and generates a restrictive file-compatible content security policy", async () => {
    const root = await createBuildFixture(roots);
    const outputDir = path.join(root, "csp-output");
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, "index.html"), `<!doctype html><html><head></head><body><script>void 0</script></body></html>`);

    await expect(verifyOfflinePackage(outputDir, [])).rejects.toThrow(/content security policy|CSP/i);
    await inlineApplicationAssets(outputDir);
    const html = await readFile(path.join(outputDir, "index.html"), "utf8");
    expect(html).toContain(`default-src 'none'`);
    expect(html).toContain(`script-src 'unsafe-inline'`);
    expect(html).toContain(`style-src 'unsafe-inline'`);
    expect(html).toContain(`img-src 'self' file: data: blob:`);
    expect(html).toContain(`connect-src 'none'`);
    expect(html).toContain(`object-src 'none'`);
    expect(html).toContain(`form-action 'none'`);
    await expect(verifyOfflinePackage(outputDir, [])).resolves.toBeUndefined();
  });

  it.each([
    ["fetch", "fetch('./data.json')"],
    ["XMLHttpRequest", "new XMLHttpRequest()"],
    ["WebSocket", "new WebSocket('ws://localhost')"],
    ["EventSource", "new EventSource('./events')"],
    ["sendBeacon", "navigator.sendBeacon('./log')"],
    ["dynamic import", "import('./chunk.js')"]
  ])("rejects the network-capable %s pattern in the final package", async (_label, injected) => {
    const root = await createBuildFixture(roots);
    const outputDir = path.join(root, "adversarial-output");
    await writePackagedCandidate(outputDir, `<script>${injected}</script>`);

    await expect(verifyOfflinePackage(outputDir, [])).rejects.toThrow(/offline|network|dynamic/i);
  });

  it.each([
    ["CSS URL", `<style>.broken { background: url('./missing.png'); }</style>`],
    ["remote CSS URL", `<style>.broken { background: url('https://example.com/image.png'); }</style>`],
    ["preload href", `<link rel="preload" href="./missing.js">`],
    ["image src", `<img src="/absolute.png" alt="broken">`],
    ["remote image src", `<img src="https://example.com/image.png" alt="broken">`],
    ["unquoted remote image src", `<img src=https://example.com/image.png alt=broken>`],
    ["unquoted remote stylesheet", `<link rel=stylesheet href=https://example.com/site.css>`],
    ["remote image srcset", `<img srcset="https://example.com/one.png 1x, https://example.com/two.png 2x" alt="broken">`],
    ["remote object data", `<object data="https://example.com/plugin.bin"></object>`],
    ["remote button formaction", `<button formaction="https://example.com/submit">Submit</button>`],
    ["meta refresh", `<meta http-equiv="refresh" content="0; url=https://example.com/redirect">`]
  ])("rejects an invalid final %s reference", async (_label, injected) => {
    const root = await createBuildFixture(roots);
    const outputDir = path.join(root, "reference-output");
    await writePackagedCandidate(outputDir, `${injected}<script>void 0</script>`);

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
