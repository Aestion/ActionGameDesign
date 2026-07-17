import type { ConflictType, KnowledgeDataset, KnowledgeEntity, ReviewStatus } from "./model";

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("und").replace(/\s+/gu, "");
}

export interface SearchFilters {
  domains?: string[];
  games?: string[];
  conflictTypes?: Array<ConflictType | string>;
  reviewStatuses?: Array<ReviewStatus | string>;
}

function intersects(values: string[], selected: string[] | undefined): boolean {
  return !selected?.length || selected.some((value) => values.includes(value));
}

function matchesFilters(entity: KnowledgeEntity, filters: SearchFilters): boolean {
  const gameIds = entity.kind === "game"
    ? [entity.id]
    : (entity.examples ?? []).map((example) => example.gameId);

  return intersects(entity.domainIds ?? [], filters.domains)
    && intersects(gameIds, filters.games)
    && (!filters.conflictTypes?.length || Boolean(entity.conflictType && filters.conflictTypes.includes(entity.conflictType)))
    && (!filters.reviewStatuses?.length || filters.reviewStatuses.includes(entity.reviewStatus));
}

export function searchDataset(
  dataset: KnowledgeDataset,
  query: string,
  filters: SearchFilters = {}
): string[] {
  const normalizedQuery = normalizeSearchText(query);
  const recordsById = new Map(dataset.searchRecords.map((record) => [record.id, record]));

  return dataset.entities
    .filter((entity) => matchesFilters(entity, filters))
    .map((entity) => {
      if (!normalizedQuery) return { id: entity.id, score: 0 };

      const title = normalizeSearchText(entity.title);
      const aliases = (entity.aliases ?? []).map(normalizeSearchText);
      const record = recordsById.get(entity.id);
      let score = -1;

      if (title === normalizedQuery) score = 500;
      else if (aliases.includes(normalizedQuery)) score = 400;
      else if (title.includes(normalizedQuery)) score = 300;
      else if (record?.tokens.some((token) => token === normalizedQuery || token.includes(normalizedQuery))) score = 200;
      else if (record?.text.includes(normalizedQuery)) score = 100;

      return { id: entity.id, score };
    })
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0))
    .map(({ id }) => id);
}
