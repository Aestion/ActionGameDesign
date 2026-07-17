import type { KnowledgeDataset, KnowledgeEdge, KnowledgeEntity, SearchRecord } from "../model";
import { normalizeSearchText } from "../search";
import type { LoadedContent } from "./load-content";
import { compileEdges } from "./validate-content";

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareEdges(left: KnowledgeEdge, right: KnowledgeEdge): number {
  return compareText(left.source, right.source)
    || compareText(left.target, right.target)
    || compareText(left.kind, right.kind)
    || compareText(left.note ?? "", right.note ?? "");
}

function referencedGameValues(entity: KnowledgeEntity, entitiesById: Map<string, KnowledgeEntity>): string[] {
  return (entity.examples ?? []).flatMap((example) => {
    const game = entitiesById.get(example.gameId);
    return game?.kind === "game" ? [game.title, ...(game.aliases ?? [])] : [];
  });
}

function searchableValues(entity: KnowledgeEntity, entitiesById: Map<string, KnowledgeEntity>): string[] {
  return [
    entity.title,
    ...(entity.aliases ?? []),
    entity.summary,
    entity.bodyHtml,
    ...(entity.tags ?? []),
    ...referencedGameValues(entity, entitiesById),
    ...(entity.examples ?? []).flatMap((example) => [
      example.gameId,
      example.subject,
      example.mechanism,
      example.outcome
    ])
  ].filter((value): value is string => Boolean(value));
}

function tokenValues(entity: KnowledgeEntity, entitiesById: Map<string, KnowledgeEntity>): string[] {
  return [
    ...entity.title.split(/\s+/u),
    ...(entity.aliases ?? []),
    ...(entity.tags ?? []),
    ...referencedGameValues(entity, entitiesById),
    ...(entity.examples ?? []).flatMap((example) => [
      example.gameId,
      example.subject,
      example.mechanism,
      example.outcome
    ])
  ];
}

function compileSearchRecord(entity: KnowledgeEntity, entitiesById: Map<string, KnowledgeEntity>): SearchRecord {
  const tokens = tokenValues(entity, entitiesById)
    .map(normalizeSearchText)
    .filter(Boolean);

  return {
    id: entity.id,
    title: entity.title,
    text: normalizeSearchText(searchableValues(entity, entitiesById).join(" ")),
    tokens: [...new Set(tokens)]
  };
}

export function compileContent(loaded: LoadedContent, generatedAt: string): KnowledgeDataset {
  const entities = [...loaded.entities].sort((left, right) => compareText(left.id, right.id));
  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
  const stats = { concepts: 0, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 };

  for (const entity of entities) {
    if (entity.kind === "concept") stats.concepts += 1;
    if (entity.kind === "case") stats.cases += 1;
    if (entity.kind === "conflict") stats.conflicts += 1;
    if (entity.kind === "source") stats.sources += 1;
    if (entity.kind === "game") stats.games += 1;
    stats.media += entity.media.length;
  }

  return {
    version: 1,
    generatedAt,
    entities,
    edges: compileEdges(loaded.declaredEdges).sort(compareEdges),
    searchRecords: entities.map((entity) => compileSearchRecord(entity, entitiesById)),
    stats
  };
}
