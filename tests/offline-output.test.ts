import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildAtlas } from "../scripts/build-atlas";

const roots: string[] = [];
const fixedNow = () => new Date("2026-07-17T00:00:00.000Z");

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function createBuildFixture(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "atlas-offline-"));
  roots.push(root);
  await mkdir(path.join(root, "src"), { recursive: true });
  await mkdir(path.join(root, "content", "concepts", "media"), { recursive: true });
  await mkdir(path.join(root, "content", "sources"), { recursive: true });
  await writeFile(path.join(root, "index.html"), `<!doctype html>
<html><body><main id="app"></main><script type="module" src="/src/main.ts"></script></body></html>`);
  await writeFile(path.join(root, "src", "main.ts"), `import dataset from "./generated/knowledge";
document.querySelector("#app")!.textContent = String(dataset.stats.concepts);`);
  await writeFile(path.join(root, "content", "concepts", "concept.md"), `---
id: local-concept
kind: concept
title: 本地概念
aliases: [离线概念]
summary: 一个完全本地的示例
domainIds: [combat]
depth: 1
tags: [本地]
reviewStatus: reviewed
updated: 2026-07-17
relations: []
citations: []
media:
  - src: media/sample.gif
    alt: 本地示例
    caption: 本地媒体
    kind: gif
    sourceId: local-source
examples: []
---

正文。
`);
  await writeFile(path.join(root, "content", "sources", "source.md"), `---
id: local-source
kind: source
title: 本地来源
aliases: []
summary: 本地来源说明
domainIds: []
depth: 1
tags: []
reviewStatus: reviewed
updated: 2026-07-17
relations: []
citations: []
media: []
examples: []
sourceMeta:
  primaryUrls: []
  secondaryUrls: []
---

来源正文。
`);
  await writeFile(path.join(root, "content", "concepts", "media", "sample.gif"), Buffer.from("GIF89a"));
  return root;
}

describe("offline build output", () => {
  it("emits relative assets, generated data, and copied media without runtime network access", async () => {
    const root = await createBuildFixture();

    const report = await buildAtlas({ root, contentRoot: "content", now: fixedNow });

    expect(report.success).toBe(true);
    expect(report.stats).toMatchObject({ concepts: 1, sources: 1, media: 1 });
    const html = await readFile(path.join(root, "dist", "index.html"), "utf8");
    expect(html).toMatch(/(?:src|href)="\.\//);
    expect(html).not.toMatch(/https?:\/\//);
    expect(html).not.toContain("fetch(");
    expect(await readFile(path.join(root, "dist", "media", "sample.gif"), "utf8")).toBe("GIF89a");
    const generated = await readFile(path.join(root, "src", "generated", "knowledge.ts"), "utf8");
    expect(generated).toContain("satisfies KnowledgeDataset");
    expect(generated).toContain('"generatedAt": "2026-07-17T00:00:00.000Z"');
    expect((await readdir(path.join(root, "dist", "assets"))).some((file) => file.endsWith(".js"))).toBe(true);
  });
});
