import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function createBuildFixture(roots: string[]): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "atlas-build-"));
  roots.push(root);
  await mkdir(path.join(root, "src"), { recursive: true });
  await mkdir(path.join(root, "assets"), { recursive: true });
  await mkdir(path.join(root, "content", "concepts"), { recursive: true });
  await mkdir(path.join(root, "content", "sources"), { recursive: true });
  await writeFile(path.join(root, "index.html"), `<!doctype html>
<html><head></head><body><main id="app"></main><img src="./media/sample.gif" alt="sample"><script type="module" src="/src/main.ts"></script></body></html>`);
  await writeFile(path.join(root, "src", "main.ts"), `import "./styles.css";
import dataset from "./generated/knowledge";
const largeAsset = new URL("../assets/large.svg", import.meta.url).href;
const app = document.querySelector("#app")!;
app.textContent = String(dataset.stats.concepts);
app.setAttribute("data-large-asset", largeAsset);`);
  await writeFile(path.join(root, "src", "styles.css"), `.fixture { color: rgb(1, 2, 3); }`);
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
  - sourcePath: ../../assets/sample.gif
    src: media/sample.gif
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
  primaryUrls: [https://example.com/source]
  secondaryUrls: []
---

来源正文。
`);
  await writeFile(path.join(root, "assets", "sample.gif"), Buffer.from("GIF89a"));
  await writeFile(path.join(root, "assets", "large.svg"), `<svg xmlns="http://www.w3.org/2000/svg"><desc>large-fixture-marker</desc><path d="${"M0 0h1v1z".repeat(500)}"/></svg>`);
  return root;
}
