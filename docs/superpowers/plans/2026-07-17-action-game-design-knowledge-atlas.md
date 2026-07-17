# 动作游戏设计知识图谱 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 6 篇动作游戏设计资料和 31 个媒体文件整理为可持续维护、可离线打开、可部署到内网的交互式知识图谱网站。

**Architecture:** 使用结构化 Markdown 作为唯一人工维护内容源，由 TypeScript 构建程序校验并编译为一个内嵌知识数据的静态 React 应用。运行时不请求本地 JSON、不依赖 CDN 或数据库；概念星图是主入口，游戏比较矩阵、案例、冲突、术语、来源和全文搜索共享同一规范化数据集。

**Tech Stack:** Node.js 24、TypeScript、React、Vite、Cytoscape.js、Zod、gray-matter、Unified/Remark/Rehype、Vitest、Testing Library。

## Global Constraints

- 产品是持续演进的动作游戏设计知识图谱，不是课程。
- 内容达到“观点级完整”，不逐字复制全文；所有论点、限定条件、反例、分歧、引用和游戏案例必须保留。
- 同一设计维度的冲突并列呈现，不做正确性排名；条件差异不得误标为直接冲突。
- 原作者观点、编者解释、编者归纳和案例事实必须在语义与视觉上分开。
- 首页采用中心辐射的概念星图，游戏比较矩阵仅作为辅助研究工具。
- 视觉采用“战术终端”：深蓝黑背景、青绿色关系/交互、橙色冲突/警示、冷白正文。
- 输出为 HTML 与媒体分离的静态目录，支持 `file://` 直接打开和普通内网静态服务器部署。
- 运行时不得依赖数据库、CDN、在线字体、远程搜索服务或网络请求。
- 31 个现有图片/GIF 全部保留、延迟加载、带原说明，并可从案例或观点定位。
- 小屏端使用分层树状列表，不压缩桌面星图。
- 所有关系、冲突和状态不能仅靠颜色表达；支持键盘操作与 `prefers-reduced-motion`。

---

## Planned File Structure

```text
.
├─ content/
│  ├─ concepts/          # 一个概念节点一个 Markdown
│  ├─ cases/             # 详细案例节点；简短案例可由概念 frontmatter 生成
│  ├─ conflicts/         # 一个冲突主题一个 Markdown
│  ├─ sources/           # 六篇资料及外部出处的来源元数据
│  ├─ catalogs/games.md  # 游戏规范名、别名与矩阵字段
│  └─ coverage.json      # 原资料段落/案例/媒体到知识节点的覆盖账本
├─ public/media/         # 31 个发布媒体文件
├─ scripts/
│  ├─ generate-content.ts # 内容加载、校验和数据编译入口
│  ├─ build-atlas.ts      # 临时构建、最后可用版本保护和发布
│  └─ copy-media.ts       # 校验并复制媒体
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ app-state.ts
│  │  ├─ GraphExplorer.tsx
│  │  ├─ MobileTree.tsx
│  │  ├─ NodeDetail.tsx
│  │  ├─ SearchPanel.tsx
│  │  ├─ ComparisonMatrix.tsx
│  │  ├─ IndexViews.tsx
│  │  └─ components.tsx
│  ├─ build/
│  │  ├─ schemas.ts
│  │  ├─ load-content.ts
│  │  ├─ validate-content.ts
│  │  ├─ compile-content.ts
│  │  └─ render-markdown.ts
│  ├─ generated/knowledge.ts # 构建生成，不人工编辑
│  ├─ model.ts
│  ├─ search.ts
│  ├─ styles.css
│  └─ main.tsx
├─ tests/
│  ├─ fixtures/content/
│  ├─ model.test.ts
│  ├─ content-loader.test.ts
│  ├─ content-validation.test.ts
│  ├─ build-safety.test.ts
│  ├─ coverage.test.ts
│  ├─ search.test.ts
│  ├─ graph.test.tsx
│  ├─ detail.test.tsx
│  ├─ matrix.test.tsx
│  └─ offline-output.test.ts
├─ docs/content-authoring.md
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ vitest.config.ts
├─ 更新知识库.cmd
└─ .gitignore
```

Each file has one responsibility: build code never imports React, UI code never reads Markdown, and generated data is the only interface between them.

---

### Task 1: Establish the project, repository, and shared data contracts

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/model.ts`
- Create: `tests/model.test.ts`
- Track: the six root Markdown sources, `动作游戏设计之难_assets/`, `docs/superpowers/specs/`, and this plan

**Interfaces:**
- Produces: `KnowledgeEntity`, `KnowledgeEdge`, `KnowledgeDataset`, `ValidationIssue`, `BuildReport`, and the relation/status union types used by every later task.
- Consumes: none.

- [ ] **Step 1: Initialize Git and write the package/tooling files**

Run:

```powershell
git init -b main
npm init -y
npm install react react-dom cytoscape zod gray-matter unified remark-parse remark-rehype rehype-sanitize rehype-stringify
npm install -D typescript vite @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/user-event @types/react @types/react-dom tsx
```

Set package scripts to:

```json
{
  "scripts": {
    "dev": "npm run content:generate && vite",
    "content:generate": "tsx scripts/generate-content.ts",
    "build": "tsx scripts/build-atlas.ts",
    "build:site": "vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Set `.gitignore` to:

```gitignore
node_modules/
dist/
dist-last-good/
.build-tmp/
.superpowers/
src/generated/knowledge.ts
```

Set Vite `base: "./"`, React plugin, and Vitest `environment: "jsdom"`. This relative base is required for `file://` output.

- [ ] **Step 2: Write the failing model contract test**

```ts
// tests/model.test.ts
import { describe, expect, it } from "vitest";
import { createEmptyDataset, isRelationKind } from "../src/model";

describe("knowledge model", () => {
  it("creates a versioned empty dataset with all counters", () => {
    expect(createEmptyDataset("2026-07-17T00:00:00.000Z")).toEqual({
      version: 1,
      generatedAt: "2026-07-17T00:00:00.000Z",
      entities: [],
      edges: [],
      searchRecords: [],
      stats: { concepts: 0, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 }
    });
  });

  it("accepts only declared relation kinds", () => {
    expect(isRelationKind("exemplified_by")).toBe(true);
    expect(isRelationKind("looks_like")).toBe(false);
  });
});
```

- [ ] **Step 3: Run the model test and verify the expected failure**

Run: `npm test -- tests/model.test.ts`

Expected: FAIL because `../src/model` does not exist.

- [ ] **Step 4: Implement the complete shared model**

```ts
// src/model.ts
export const entityKinds = ["concept", "case", "conflict", "source", "game"] as const;
export type EntityKind = (typeof entityKinds)[number];

export const relationKinds = [
  "parent_of", "child_of", "related_to", "supports", "contrasts_with",
  "conflicts_with", "applies_to", "exemplified_by"
] as const;
export type RelationKind = (typeof relationKinds)[number];
export type ReviewStatus = "draft" | "reviewed";
export type ConflictType = "definition" | "goal" | "condition" | "direct";

export interface MediaRef {
  src: string;
  alt: string;
  caption: string;
  kind: "image" | "gif";
  sourceId: string;
}

export interface SourceCitation { sourceId: string; locator: string; }
export interface InlineExample {
  id: string;
  gameId: string;
  subject: string;
  mechanism: string;
  outcome: string;
  sourceIds: string[];
}

export interface KnowledgeEntity {
  id: string;
  kind: EntityKind;
  title: string;
  aliases: string[];
  summary: string;
  bodyHtml: string;
  domainIds: string[];
  depth: 1 | 2 | 3;
  tags: string[];
  reviewStatus: ReviewStatus;
  updated: string;
  citations: SourceCitation[];
  media: MediaRef[];
  examples: InlineExample[];
  conflictType?: ConflictType;
  conflictSides?: Array<{ label: string; claim: string; conditions: string; sourceIds: string[] }>;
  editorialSynthesis?: string;
  matrix?: Record<string, string>;
}

export interface KnowledgeEdge { source: string; target: string; kind: RelationKind; note?: string; }
export interface SearchRecord { id: string; title: string; text: string; tokens: string[]; }
export interface KnowledgeDataset {
  version: 1;
  generatedAt: string;
  entities: KnowledgeEntity[];
  edges: KnowledgeEdge[];
  searchRecords: SearchRecord[];
  stats: { concepts: number; cases: number; conflicts: number; sources: number; games: number; media: number };
}
export interface ValidationIssue { severity: "error" | "warning"; code: string; file: string; message: string; }
export interface BuildReport { success: boolean; generatedAt: string; outputDir: string; issues: ValidationIssue[]; stats: KnowledgeDataset["stats"]; }

export const isRelationKind = (value: string): value is RelationKind =>
  relationKinds.includes(value as RelationKind);

export function createEmptyDataset(generatedAt: string): KnowledgeDataset {
  return { version: 1, generatedAt, entities: [], edges: [], searchRecords: [], stats: { concepts: 0, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 } };
}
```

- [ ] **Step 5: Run the model test and commit the baseline**

Run: `npm test -- tests/model.test.ts`

Expected: 2 tests PASS.

```powershell
git add .gitignore package.json package-lock.json tsconfig.json vite.config.ts vitest.config.ts index.html src/model.ts tests/model.test.ts docs *.md 动作游戏设计之难_assets
git commit -m "chore: establish knowledge atlas project"
```

---

### Task 2: Parse structured Markdown and validate the knowledge graph

**Files:**
- Create: `src/build/schemas.ts`
- Create: `src/build/render-markdown.ts`
- Create: `src/build/load-content.ts`
- Create: `src/build/validate-content.ts`
- Create: `tests/fixtures/content/concepts/sample.md`
- Create: `tests/content-loader.test.ts`
- Create: `tests/content-validation.test.ts`

**Interfaces:**
- Consumes: types from `src/model.ts`.
- Produces: `loadContent(contentRoot: string): Promise<LoadedContent>` and `validateContent(content: LoadedContent): ValidationIssue[]`.

- [ ] **Step 1: Create a valid fixture and write the failing loader test**

Use this fixture frontmatter:

```md
---
id: concept-sample
kind: concept
title: 示例概念
aliases: [示例]
summary: 用于验证 Markdown 内容加载。
domainIds: [domain-systems]
depth: 1
tags: [测试]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - kind: related_to
    target: concept-peer
citations:
  - sourceId: source-sample
    locator: 第 1 节
media: []
examples: []
---

## 详细解释

这是 **Markdown** 正文。
```

```ts
// tests/content-loader.test.ts
import { describe, expect, it } from "vitest";
import { loadContent } from "../src/build/load-content";

describe("loadContent", () => {
  it("parses frontmatter, renders safe HTML, and preserves declared relations", async () => {
    const result = await loadContent("tests/fixtures/content");
    expect(result.entities[0].id).toBe("concept-sample");
    expect(result.entities[0].bodyHtml).toContain("<strong>Markdown</strong>");
    expect(result.declaredEdges).toEqual([{ source: "concept-sample", target: "concept-peer", kind: "related_to" }]);
  });
});
```

- [ ] **Step 2: Run the loader test and verify it fails**

Run: `npm test -- tests/content-loader.test.ts`

Expected: FAIL because `load-content.ts` does not exist.

- [ ] **Step 3: Implement schemas, safe Markdown rendering, and recursive loading**

Use the following parser boundary. `EntityFileSchema` validates one entity file; `GameCatalogSchema` is the only multi-record exception and expands every catalog entry into a normal `game` entity.

```ts
// src/build/schemas.ts
import { z } from "zod";
import { entityKinds, relationKinds } from "../model";

const RelationSchema = z.object({ kind: z.enum(relationKinds), target: z.string().min(1), note: z.string().optional() });
const CitationSchema = z.object({ sourceId: z.string().min(1), locator: z.string().min(1) });
const MediaSchema = z.object({
  src: z.string().min(1), alt: z.string().min(1), caption: z.string().min(1),
  kind: z.enum(["image", "gif"]), sourceId: z.string().min(1)
});
const ExampleSchema = z.object({
  id: z.string().min(1), gameId: z.string().min(1), subject: z.string().min(1),
  mechanism: z.string().min(1), outcome: z.string().min(1), sourceIds: z.array(z.string()).min(1)
});
const ConflictSideSchema = z.object({
  label: z.string().min(1), claim: z.string().min(1), conditions: z.string().min(1), sourceIds: z.array(z.string()).min(1)
});

export const EntityFileSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(entityKinds),
  title: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  summary: z.string().min(1),
  domainIds: z.array(z.string()).default([]),
  depth: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  tags: z.array(z.string()).default([]),
  reviewStatus: z.enum(["draft", "reviewed"]),
  updated: z.coerce.string(),
  relations: z.array(RelationSchema).default([]),
  citations: z.array(CitationSchema).default([]),
  media: z.array(MediaSchema).default([]),
  examples: z.array(ExampleSchema).default([]),
  conflictType: z.enum(["definition", "goal", "condition", "direct"]).optional(),
  conflictSides: z.array(ConflictSideSchema).optional(),
  editorialSynthesis: z.string().optional(),
  matrix: z.record(z.string(), z.string()).optional()
});

export const GameCatalogSchema = z.object({
  kind: z.literal("game-catalog"),
  games: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/), title: z.string().min(1),
    aliases: z.array(z.string()).default([]), summary: z.string().min(1),
    tags: z.array(z.string()).default([]), matrix: z.record(z.string(), z.string()).default({})
  })).min(1)
});
```

```ts
// src/build/render-markdown.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

export async function renderMarkdown(source: string): Promise<string> {
  return String(await unified().use(remarkParse).use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(source));
}
```

```ts
// src/build/load-content.ts
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { KnowledgeEdge, KnowledgeEntity } from "../model";
import { EntityFileSchema, GameCatalogSchema } from "./schemas";
import { renderMarkdown } from "./render-markdown";

export interface LoadedContent {
  entities: KnowledgeEntity[];
  declaredEdges: KnowledgeEdge[];
  filesById: Map<string, string[]>;
}

async function collectMarkdownFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const full = path.join(root, entry.name);
    return entry.isDirectory() ? collectMarkdownFiles(full) : entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  }));
  return nested.flat().sort();
}

export async function loadContent(contentRoot: string): Promise<LoadedContent> {
  const entities: KnowledgeEntity[] = [];
  const declaredEdges: KnowledgeEdge[] = [];
  const filesById = new Map<string, string[]>();
  for (const file of await collectMarkdownFiles(contentRoot)) {
    const parsed = matter(await readFile(file, "utf8"));
    if (parsed.data.kind === "game-catalog") {
      const catalog = GameCatalogSchema.parse(parsed.data);
      for (const game of catalog.games) {
        entities.push({ ...game, kind: "game", bodyHtml: "", domainIds: [], depth: 1, reviewStatus: "reviewed", updated: "2026-07-17", citations: [], media: [], examples: [] });
        filesById.set(game.id, [...(filesById.get(game.id) ?? []), file]);
      }
      continue;
    }
    const data = EntityFileSchema.parse(parsed.data);
    entities.push({
      id: data.id, kind: data.kind, title: data.title, aliases: data.aliases,
      summary: data.summary, bodyHtml: await renderMarkdown(parsed.content), domainIds: data.domainIds,
      depth: data.depth, tags: data.tags, reviewStatus: data.reviewStatus, updated: data.updated,
      citations: data.citations, media: data.media, examples: data.examples,
      conflictType: data.conflictType, conflictSides: data.conflictSides,
      editorialSynthesis: data.editorialSynthesis, matrix: data.matrix
    });
    for (const relation of data.relations) declaredEdges.push({ source: data.id, target: relation.target, kind: relation.kind, note: relation.note });
    filesById.set(data.id, [...(filesById.get(data.id) ?? []), file]);
  }
  return { entities, declaredEdges, filesById };
}
```

`rehype-sanitize` allows headings, paragraphs, emphasis, lists, tables, links and images while stripping raw scripts and event-handler attributes.

- [ ] **Step 4: Write failing validation tests for blocking and warning rules**

```ts
// tests/content-validation.test.ts
import { describe, expect, it } from "vitest";
import { validateContent } from "../src/build/validate-content";

describe("validateContent", () => {
  it("blocks duplicate IDs, missing relation targets, and one-sided conflicts", () => {
    const issues = validateContent({
      entities: [
        { id: "same", kind: "concept", title: "A" },
        { id: "same", kind: "concept", title: "B" },
        { id: "conflict", kind: "conflict", title: "冲突", conflictSides: [{ label: "A", claim: "观点", conditions: "同条件", sourceIds: ["s"] }] }
      ],
      declaredEdges: [{ source: "same", target: "missing", kind: "related_to" }],
      filesById: new Map()
    } as never);
    expect(issues.filter((item) => item.severity === "error").map((item) => item.code)).toEqual(
      expect.arrayContaining(["duplicate-id", "missing-target", "one-sided-conflict"])
    );
  });
});
```

- [ ] **Step 5: Implement validation and reverse-edge generation**

`validateContent` must implement every blocking/warning rule from design spec section 12. Add `compileEdges` in `validate-content.ts`; `parent_of` creates `child_of`, while symmetric relations create one reverse edge only when absent.

- [ ] **Step 6: Run the parser/validation tests and commit**

Run: `npm test -- tests/content-loader.test.ts tests/content-validation.test.ts`

Expected: all tests PASS.

```powershell
git add src/build tests/fixtures tests/content-loader.test.ts tests/content-validation.test.ts
git commit -m "feat: parse and validate knowledge content"
```

---

### Task 3: Compile search data and build a last-known-good offline package

**Files:**
- Create: `src/build/compile-content.ts`
- Create: `src/search.ts`
- Create: `scripts/generate-content.ts`
- Create: `scripts/copy-media.ts`
- Create: `scripts/build-atlas.ts`
- Create: `更新知识库.cmd`
- Create: `tests/search.test.ts`
- Create: `tests/build-safety.test.ts`
- Create: `tests/offline-output.test.ts`

**Interfaces:**
- Consumes: `LoadedContent`, `KnowledgeDataset`, and `ValidationIssue`.
- Produces: `compileContent(loaded, generatedAt): KnowledgeDataset`, `searchDataset(dataset, query, filters): string[]`, and `buildAtlas(options): Promise<BuildReport>`.

- [ ] **Step 1: Write the failing Chinese search test**

```ts
// tests/search.test.ts
import { expect, it } from "vitest";
import { searchDataset } from "../src/search";

it("matches titles, aliases, games, and Boss names with normalized Chinese text", () => {
  const dataset = {
    entities: [{ id: "low-poise", title: "低韧性 Boss", aliases: ["低强韧"], summary: "斋藤利三与贞德", tags: ["Boss"], examples: [] }],
    searchRecords: [{ id: "low-poise", title: "低韧性 Boss", text: "低韧性 boss 低强韧 斋藤利三 贞德", tokens: ["低韧性", "boss", "斋藤利三", "贞德"] }]
  } as never;
  expect(searchDataset(dataset, "斋藤 利三", {})).toEqual(["low-poise"]);
});
```

- [ ] **Step 2: Run the search test and verify it fails**

Run: `npm test -- tests/search.test.ts`

Expected: FAIL because `search.ts` does not exist.

- [ ] **Step 3: Implement deterministic compilation and search**

`compileContent` sorts entities/edges by stable ID, computes counters, builds reverse edges, and creates normalized lowercase search text with whitespace removed. `searchDataset` scores exact title, alias, title substring, token and body matches in that order, then applies domain, game, conflict-type and review-status filters.

- [ ] **Step 4: Write failing build-safety and offline-output tests**

```ts
// tests/build-safety.test.ts
it("does not replace dist when validation fails", async () => {
  await fs.writeFile(path.join(root, "dist", "sentinel.txt"), "last-good");
  const report = await buildAtlas({ root, contentRoot: "broken-content", now: fixedNow });
  expect(report.success).toBe(false);
  expect(await fs.readFile(path.join(root, "dist", "sentinel.txt"), "utf8")).toBe("last-good");
});

// tests/offline-output.test.ts
it("emits relative assets and no runtime fetch or remote URLs", async () => {
  const html = await fs.readFile("dist/index.html", "utf8");
  expect(html).toMatch(/(?:src|href)="\.\//);
  expect(html).not.toMatch(/https?:\/\//);
  expect(html).not.toContain("fetch(");
});
```

- [ ] **Step 5: Implement content generation, media copy, and protected publication**

`generate-content.ts` writes `src/generated/knowledge.ts` as a typed exported object. `copy-media.ts` opens every listed media file during validation and copies it to the temporary output. `build-atlas.ts` must:

1. remove only its exact `.build-tmp/current` directory;
2. generate and validate content;
3. run `vite build --outDir .build-tmp/current` with `base: "./"`;
4. verify `index.html`, the application bundle, and every media path;
5. rename existing `dist` to `dist-last-good`, then rename the temporary directory to `dist`;
6. restore `dist-last-good` if the publication rename fails.

`更新知识库.cmd` contains:

```bat
@echo off
chcp 65001 >nul
cd /d "%~dp0"
call npm run build
if errorlevel 1 (
  echo.
  echo 生成失败，上一可用版本已保留。
  pause
  exit /b 1
)
echo.
echo 知识库已更新：%cd%\dist\index.html
pause
```

- [ ] **Step 6: Run build/search tests and commit**

Run: `npm test -- tests/search.test.ts tests/build-safety.test.ts tests/offline-output.test.ts`

Expected: all tests PASS.

```powershell
git add src/build/compile-content.ts src/search.ts scripts tests 更新知识库.cmd
git commit -m "feat: generate protected offline atlas builds"
```

---

### Task 4: Migrate sources, taxonomy, classification, and design philosophy

**Files:**
- Create: `content/sources/action-design-difficulty.md`
- Create: `content/sources/act-classification-1.md`
- Create: `content/sources/act-classification-2.md`
- Create: `content/sources/combat-approaches.md`
- Create: `content/sources/low-poise-boss.md`
- Create: `content/sources/inaba-interviews.md`
- Create: `content/catalogs/games.md`
- Create: `content/concepts/domain-type-boundary.md`
- Create: `content/concepts/broad-act.md`
- Create: `content/concepts/common-act.md`
- Create: `content/concepts/traditional-act.md`
- Create: `content/concepts/traditional-act-subtypes.md`
- Create: `content/concepts/action-adventure.md`
- Create: `content/concepts/souls-framework.md`
- Create: `content/concepts/coop-musou-action-shooter-jrpg.md`
- Create: `content/concepts/domain-production-philosophy.md`
- Create: `content/concepts/producer-director.md`
- Create: `content/concepts/vision-pivot-and-strengths.md`
- Create: `content/concepts/talent-practice-preservation.md`
- Create: `content/conflicts/act-definition-boundaries.md`
- Create: `content/conflicts/action-depth-vs-content-breadth.md`
- Create: `tests/coverage.test.ts`

**Interfaces:**
- Consumes: the six original root Markdown files and content schema from Task 2.
- Produces: valid source/classification/philosophy entities and the initial game catalog.

- [ ] **Step 1: Write the failing source and taxonomy coverage test**

```ts
  it("contains all six source records and the initial top-level domains", async () => {
  const content = await loadContent("content");
  const ids = new Set(content.entities.map((entity) => entity.id));
  expect(["source-action-design-difficulty", "source-act-classification-1", "source-act-classification-2", "source-combat-approaches", "source-low-poise-boss", "source-inaba-interviews"].every((id) => ids.has(id))).toBe(true);
  expect(["domain-type-boundary", "domain-production-philosophy"].every((id) => ids.has(id))).toBe(true);
});
```

- [ ] **Step 2: Run the coverage test and verify it fails**

Run: `npm test -- tests/coverage.test.ts`

Expected: FAIL with missing content IDs.

- [ ] **Step 3: Add the six source records and game catalog**

Each source record must include the local raw filename, author, publication, date, external links, language availability, and a concise scope note. `content/catalogs/games.md` contains one canonical ID per game/series mentioned in these two classification sources and the Inaba summary, with Chinese/English/Japanese aliases where present.

- [ ] **Step 4: Add classification and production-philosophy nodes**

Preserve every classification branch and every named example. Use inline examples for brief lists and dedicated concept text for the nine traditional ACT subtypes, six action-adventure patterns, three Souls-framework variants, co-op, Musou, action FPS/TPS, and action-oriented JRPGs. Capture all ten Inaba themes, their source attribution, and the distinction between quoted view and editorial synthesis.

- [ ] **Step 5: Add the two conflicts with complete sides and conditions**

`act-definition-boundaries.md` compares broad/common/narrow definitions as a definition conflict. `action-depth-vs-content-breadth.md` compares deep action-system specialization with broader exploration/narrative/content investment as a goal/condition conflict, using traditional ACT, Souls games and old God of War examples.

- [ ] **Step 6: Run validation and commit**

Run: `npm run content:generate && npm test -- tests/coverage.test.ts tests/content-validation.test.ts`

Expected: six sources and the two domains introduced by this task exist; no validation errors.

```powershell
git add content tests/coverage.test.ts
git commit -m "content: add sources classification and production philosophy"
```

---

### Task 5: Migrate system depth, difficulty, readability, and presentation knowledge

**Files:**
- Create: `content/concepts/domain-system-depth.md`
- Create: `content/concepts/compound-decisions.md`
- Create: `content/concepts/depth-width-feedback-time.md`
- Create: `content/concepts/reaction-frequency.md`
- Create: `content/concepts/enemy-attack-allocation.md`
- Create: `content/concepts/control-precision.md`
- Create: `content/concepts/time-precision.md`
- Create: `content/concepts/space-precision.md`
- Create: `content/concepts/command-dimension.md`
- Create: `content/concepts/external-rules-and-difficulty.md`
- Create: `content/concepts/feedback-loops.md`
- Create: `content/concepts/clearing-and-non-clearing.md`
- Create: `content/concepts/action-external-interoperation.md`
- Create: `content/concepts/domain-presentation.md`
- Create: `content/concepts/intuitive-experience.md`
- Create: `content/concepts/camera-and-fov.md`
- Create: `content/concepts/animation-readability.md`
- Create: `content/concepts/auxiliary-cues.md`
- Create: `content/concepts/spectacle-techniques.md`
- Create: `content/concepts/readability-vs-spectacle.md`
- Create: `content/concepts/training-and-depth.md`
- Create: `content/conflicts/difficulty-sources.md`
- Create: `content/conflicts/readability-vs-spectacle.md`

**Interfaces:**
- Consumes: source records and game catalog from Task 4.
- Produces: the full system-depth and presentation branches plus related examples/media references.

- [ ] **Step 1: Extend the coverage test with required system and presentation IDs**

Assert that every file listed above loads, both conflicts have two or more sides, and every media reference targets `source-action-design-difficulty`.

- [ ] **Step 2: Run the focused coverage test and verify it fails**

Run: `npm test -- tests/coverage.test.ts -t "system and presentation"`

Expected: FAIL with the first missing concept ID.

- [ ] **Step 3: Migrate the complete system-depth branch**

Preserve the article's formulas as attributed models rather than universal laws. Include active/passive reaction-frequency examples (Monster Hunter, Ninja Gaiden, Muramasa, Titan Souls), time/space/command precision, difficulty/tolerance/punishment, positive/negative loops, clearing structures, Souls/MH/Nioh external-rule examples, and every named game example.

- [ ] **Step 4: Migrate the complete readability/presentation branch and bind media**

Cover FOV, camera modes, motion blur, silhouette, line of action, feature frames, Monster Hunter roar comparisons, Dark Souls delayed/fake attacks, UI/audio cues, anticipation/ease/arcs, hit stop, time scaling, screen shake, close-ups, readability-versus-spectacle counterexamples, and training/intuition. Bind all 31 media files to their original nearby claims with captions and source IDs.

- [ ] **Step 5: Add conflict cards and run content validation**

`difficulty-sources.md` separates reaction/precision difficulty from low-tolerance/high-punishment external-rule difficulty. `readability-vs-spectacle.md` presents the priority conflict and conditions, including NieR, God of War: Ascension and Darksiders 2 examples.

Run: `npm run content:generate && npm test -- tests/coverage.test.ts tests/content-validation.test.ts`

Expected: no validation errors; dataset media count is exactly 31.

- [ ] **Step 6: Commit**

```powershell
git add content tests/coverage.test.ts
git commit -m "content: add system depth and presentation knowledge"
```

---

### Task 6: Migrate combat approaches, Boss design, detailed cases, and the coverage ledger

**Files:**
- Create: `content/concepts/domain-combat.md`
- Create: `content/concepts/neutral-and-openings.md`
- Create: `content/concepts/anti-armor-neutral.md`
- Create: `content/concepts/low-poise-neutral.md`
- Create: `content/concepts/interruption.md`
- Create: `content/concepts/suppression.md`
- Create: `content/concepts/continuous-hitstun-and-launch.md`
- Create: `content/concepts/wakeup-and-resource-suppression.md`
- Create: `content/concepts/invulnerable-suppression.md`
- Create: `content/concepts/instant-kill.md`
- Create: `content/concepts/setplay.md`
- Create: `content/concepts/fixed-sequence.md`
- Create: `content/concepts/domain-enemy-boss.md`
- Create: `content/concepts/boss-poise-taxonomy.md`
- Create: `content/concepts/round-based-humanoid.md`
- Create: `content/concepts/pseudo-equal-humanoid.md`
- Create: `content/concepts/souls-low-poise-exception.md`
- Create: `content/cases/dmc4-dante.md`
- Create: `content/cases/bayonetta-jeanne.md`
- Create: `content/cases/ninja-gaiden-doppelganger.md`
- Create: `content/cases/nioh2-saito-toshimitsu.md`
- Create: `content/conflicts/high-ai-vs-learnability.md`
- Create: `content/coverage.json`

**Interfaces:**
- Consumes: the combat and low-poise source files plus existing domains/catalog.
- Produces: complete combat/Boss branches, four deep cases, lightweight case entries for every other named example, and a machine-checkable coverage ledger.

- [ ] **Step 1: Write failing coverage-ledger tests**

```ts
it("has no unmapped source sections, examples, or media", async () => {
  const ledger = JSON.parse(await fs.readFile("content/coverage.json", "utf8"));
  expect(ledger.items.length).toBeGreaterThan(0);
  expect(ledger.items.filter((item: { status: string }) => item.status === "unmapped")).toEqual([]);
  expect(ledger.items.filter((item: { kind: string; targets: string[] }) => item.kind === "game-example" && item.targets.length === 0)).toEqual([]);
  expect(ledger.items.filter((item: { kind: string; targets: string[] }) => item.kind === "media" && item.targets.length === 0)).toEqual([]);
});
```

- [ ] **Step 2: Run the ledger test and verify it fails**

Run: `npm test -- tests/coverage.test.ts -t "unmapped"`

Expected: FAIL because `content/coverage.json` does not exist.

- [ ] **Step 3: Migrate all combat-approach nodes and examples**

Preserve every example under neutral, interruption, suppression, instant-kill, setplay and fixed-sequence. Store brief examples inline so they appear in the global case index; use full case files only for cases with multi-paragraph analysis.

- [ ] **Step 4: Migrate Boss taxonomy and the four detailed low-poise cases**

Capture all five Boss categories, round-based low-poise constraints, pseudo-equal defensive/offensive/escape patterns, DMC4 Dante, Bayonetta Jeanne, Ninja Gaiden doppelganger, Nioh 2 Saito Toshimitsu, the summary criticisms, ARPG applicability limits, and the Souls exception.

- [ ] **Step 5: Add the high-AI conflict and complete the ledger**

The conflict must distinguish “interaction authenticity and mirrored capability” from “randomness, input reading, unreactable actions and reduced learnability”, list conditions, and link all four cases. Build `coverage.json` with one item per source heading/paragraph group, named game example and media file. Excluded items require explicit dispositions such as `duplicate`, `contact-info`, or `search-method`.

- [ ] **Step 6: Validate complete content and commit**

Run: `npm run content:generate && npm test -- tests/coverage.test.ts tests/content-validation.test.ts`

Expected: no errors, no unmapped items, exactly 31 media references, all six sources represented.

```powershell
git add content tests/coverage.test.ts
git commit -m "content: add combat boss cases and coverage audit"
```

---

### Task 7: Build the tactical-terminal shell and shared application state

**Files:**
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/app-state.ts`
- Create: `src/app/components.tsx`
- Create: `src/styles.css`
- Create: `tests/detail.test.tsx`

**Interfaces:**
- Consumes: `KnowledgeDataset` from `src/generated/knowledge.ts`.
- Produces: `AtlasState`, reducer actions, shared navigation/header/panel components, and the three-depth node detail shell.

- [ ] **Step 1: Write failing reducer and node-detail tests**

```ts
it("selects a node and preserves a shareable hash", async () => {
  render(<App dataset={fixtureDataset} />);
  await user.click(screen.getByRole("button", { name: "战斗思路" }));
  expect(window.location.hash).toBe("#node=domain-combat");
  expect(screen.getByRole("heading", { name: "战斗思路" })).toBeVisible();
});

it("labels source view, editorial explanation, and editorial synthesis separately", () => {
  render(<NodeDetail entity={fixtureEntity} />);
  expect(screen.getByText("来源观点")).toBeVisible();
  expect(screen.getByText("编者解释")).toBeVisible();
  expect(screen.getByText("编者归纳")).toBeVisible();
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test -- tests/detail.test.tsx`

Expected: FAIL because application components do not exist.

- [ ] **Step 3: Implement state, hash navigation, layout, and theme**

Use reducer state:

```ts
export interface AtlasState {
  selectedId: string;
  view: "graph" | "matrix" | "cases" | "conflicts" | "sources";
  query: string;
  filters: { domains: string[]; games: string[]; conflictTypes: string[]; reviewStatuses: string[] };
  detailDepth: 1 | 2 | 3;
}
```

Define CSS variables exactly once: `--bg: #081119`, `--surface: #0f1b25`, `--surface-raised: #142633`, `--text: #e7f0f2`, `--muted: #8fa3ad`, `--cyan: #61e4c9`, `--orange: #ff7a52`, `--line: #29404b`. Build a fixed header, left navigation, central workspace and right detail panel; keep typography local/system-only.

- [ ] **Step 4: Implement the three-level detail shell**

Depth 1 shows summary, domains, relation/case/conflict counts; depth 2 shows rendered explanation, conditions and related concepts; depth 3 shows cases, conflicts, media, citations and editorial synthesis. All sections use semantic headings and buttons.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- tests/detail.test.tsx`

Expected: all tests PASS.

```powershell
git add src/main.tsx src/app src/styles.css tests/detail.test.tsx
git commit -m "feat: add tactical terminal application shell"
```

---

### Task 8: Implement the progressive concept star map and mobile tree

**Files:**
- Create: `src/app/GraphExplorer.tsx`
- Create: `src/app/MobileTree.tsx`
- Create: `tests/graph.test.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: selected node, dataset entities/edges, search result IDs, and reducer actions.
- Produces: node selection callbacks, progressive graph elements, breadcrumb navigation, and mobile hierarchical browsing.

- [ ] **Step 1: Write failing graph-behavior tests**

```ts
it("starts with the root and six first-ring domains", () => {
  render(<GraphExplorer dataset={fixtureDataset} selectedId="root-action-design" highlightedIds={[]} onSelect={vi.fn()} />);
  expect(screen.getAllByTestId("graph-node")).toHaveLength(7);
});

it("expands only direct children and important cross-links after selection", () => {
  render(<GraphExplorer dataset={fixtureDataset} selectedId="domain-combat" highlightedIds={[]} onSelect={vi.fn()} />);
  expect(screen.getByText("立回")).toBeVisible();
  expect(screen.queryByText("制作人与导演")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run graph tests and verify they fail**

Run: `npm test -- tests/graph.test.tsx`

Expected: FAIL because graph components do not exist.

- [ ] **Step 3: Implement Cytoscape lifecycle and progressive graph elements**

Create one Cytoscape instance per mounted explorer, destroy it on unmount, and update elements/styles without recreating the canvas. Show the selected node, its parent, direct children, `conflicts_with`, `contrasts_with` and up to eight highest-priority related nodes. Use node shape/label/line style as well as color for kinds and conflicts.

- [ ] **Step 4: Implement keyboard, breadcrumbs, tooltip, and mobile tree**

Graph nodes must be reachable through an accompanying DOM node list for keyboard users. Arrow keys move within the list, Enter selects, Escape moves to the parent. The tooltip includes summary, relation count, case count and conflict count. `MobileTree` uses nested disclosure buttons and the same `onSelect` action.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- tests/graph.test.tsx tests/detail.test.tsx`

Expected: all tests PASS.

```powershell
git add src/app/GraphExplorer.tsx src/app/MobileTree.tsx src/app/App.tsx src/styles.css tests/graph.test.tsx
git commit -m "feat: add progressive knowledge graph navigation"
```

---

### Task 9: Add search, filters, indexes, conflicts, media, and comparison matrix

**Files:**
- Create: `src/app/SearchPanel.tsx`
- Create: `src/app/ComparisonMatrix.tsx`
- Create: `src/app/IndexViews.tsx`
- Modify: `src/app/NodeDetail.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/styles.css`
- Create: `tests/matrix.test.tsx`
- Modify: `tests/detail.test.tsx`

**Interfaces:**
- Consumes: `searchDataset`, compiled matrix fields, entity relations, cases, conflicts, media and citations.
- Produces: filter state changes, highlighted graph IDs, matrix-to-node navigation, case/conflict/source indexes, and media lightbox behavior.

- [ ] **Step 1: Write failing search-highlight, conflict, and matrix tests**

```ts
it("highlights graph results for a game search", async () => {
  render(<App dataset={fixtureDataset} />);
  await user.type(screen.getByRole("searchbox"), "鬼泣");
  expect(screen.getByTestId("graph-node-domain-combat")).toHaveAttribute("data-highlighted", "true");
});

it("opens evidence from a matrix cell and returns to its concept", async () => {
  render(<ComparisonMatrix dataset={fixtureDataset} onSelect={onSelect} />);
  await user.click(screen.getByRole("button", { name: "鬼泣：核心战斗" }));
  expect(screen.getByText("压制 / 定番")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "查看战斗思路节点" }));
  expect(onSelect).toHaveBeenCalledWith("domain-combat");
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test -- tests/matrix.test.tsx tests/detail.test.tsx`

Expected: FAIL because search/matrix/index components do not exist.

- [ ] **Step 3: Implement search and filter controls**

Search results update the visible list and pass result IDs to `GraphExplorer`. Filters use native checkboxes grouped by domain, game, conflict type and review status. The no-result state lists active filters, a clear-all button and up to three alias-prefix suggestions.

- [ ] **Step 4: Implement matrix and indexes**

Matrix rows are games with non-empty `matrix` metadata; columns are the seven approved design dimensions. Each cell is a button that opens evidence, conditions, cases, citations and a concept-link action. `IndexViews` renders sortable case, conflict and source lists with bidirectional navigation.

- [ ] **Step 5: Implement conflict cards, lazy media, and lightbox**

Conflict cards show type, question, every side's claim/conditions/sources, then the separately labeled editorial synthesis. Media uses `loading="lazy"`, explicit alt/caption/source, an error fallback, and a dialog-based enlargement. GIFs never autoplay outside their visible detail section.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- tests/search.test.ts tests/matrix.test.tsx tests/detail.test.tsx tests/graph.test.tsx`

Expected: all tests PASS.

```powershell
git add src/app src/styles.css tests
git commit -m "feat: add atlas research and comparison tools"
```

---

### Task 10: Finish authoring docs, responsive/accessibility behavior, and full verification

**Files:**
- Create: `docs/content-authoring.md`
- Modify: `src/styles.css`
- Modify: `src/app/App.tsx`
- Modify: `tests/offline-output.test.ts`
- Modify: `tests/coverage.test.ts`
- Create: `README.md`

**Interfaces:**
- Consumes: all prior build/content/UI interfaces.
- Produces: documented maintenance workflow and a verified release in `dist/`.

- [ ] **Step 1: Write final failing acceptance assertions**

Add assertions that the compiled dataset contains six domains, six sources, exactly 31 media, no unmapped coverage items, every conflict declares one of the four valid conflict types, and no remote runtime URLs. Add a DOM test that every icon-only control has an accessible name and the small-screen mode exposes the tree navigation.

- [ ] **Step 2: Run the full suite and record the expected failures**

Run: `npm test`

Expected: FAIL only on acceptance assertions not yet satisfied; no unrelated regression failures.

- [ ] **Step 3: Complete responsive, reduced-motion, focus, and empty/error states**

At widths below 800px hide the Cytoscape canvas and show `MobileTree`; convert the right panel into a full-width drawer. Add visible `:focus-visible` styles, non-color conflict markers, `@media (prefers-reduced-motion: reduce)`, media error messaging and build/report error pages.

- [ ] **Step 4: Write the maintainer documentation**

`docs/content-authoring.md` must document every frontmatter field, the five content kinds, eight relation kinds, conflict-side requirements, lightweight versus detailed cases, media/citation rules, review status, game catalog naming, coverage-ledger dispositions, validation errors, and the exact one-click build workflow. `README.md` explains opening `dist/index.html`, deploying the entire `dist` directory and running `更新知识库.cmd`.

- [ ] **Step 5: Run complete verification**

Run:

```powershell
npm test
npm run build
Select-String -Path 'dist\index.html' -Pattern 'https?://|fetch\(' -AllMatches
Get-ChildItem -LiteralPath 'dist\media' -File | Measure-Object
```

Expected:

- all tests PASS;
- build exits 0 and reports six sources, six domains and 31 media;
- `Select-String` produces no matches;
- media count is exactly 31;
- `dist/index.html` exists and all referenced assets use relative paths.

- [ ] **Step 6: Commit the verified release**

```powershell
git add README.md docs/content-authoring.md src tests content scripts package.json package-lock.json vite.config.ts vitest.config.ts 更新知识库.cmd
git commit -m "feat: complete offline action design knowledge atlas"
git status --short
```

Expected: final `git status --short` is empty except ignored generated/output directories.

---

## Execution Notes

- Use `apply_patch` for all handwritten files. Package installation and formatter-generated lockfile changes may be produced by their normal commands.
- Preserve all six original Markdown files and `动作游戏设计之难_assets/`; migration adds structured content and never rewrites the source material.
- Do not mark a source paragraph “covered” merely because its source file exists. Every substantive viewpoint, condition, counterexample, named game example and media item needs a target node or an explicit excluded disposition.
- Run the focused tests after every task and the full suite before any completion claim.
