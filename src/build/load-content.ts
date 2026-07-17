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
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) return collectMarkdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
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
        entities.push({
          ...game,
          kind: "game",
          bodyHtml: "",
          domainIds: [],
          depth: 1,
          reviewStatus: "reviewed",
          updated: "2026-07-17",
          citations: [],
          media: [],
          examples: []
        });
        filesById.set(game.id, [...(filesById.get(game.id) ?? []), file]);
      }
      continue;
    }

    const data = EntityFileSchema.parse(parsed.data);
    entities.push({
      id: data.id,
      kind: data.kind,
      title: data.title,
      aliases: data.aliases,
      summary: data.summary,
      bodyHtml: await renderMarkdown(parsed.content),
      domainIds: data.domainIds,
      depth: data.depth,
      tags: data.tags,
      reviewStatus: data.reviewStatus,
      updated: data.updated,
      citations: data.citations,
      media: data.media,
      examples: data.examples,
      conflictType: data.conflictType,
      conflictSides: data.conflictSides,
      editorialSynthesis: data.editorialSynthesis,
      matrix: data.matrix
    });
    for (const relation of data.relations) {
      declaredEdges.push({
        source: data.id,
        target: relation.target,
        kind: relation.kind,
        note: relation.note
      });
    }
    filesById.set(data.id, [...(filesById.get(data.id) ?? []), file]);
  }

  return { entities, declaredEdges, filesById };
}
