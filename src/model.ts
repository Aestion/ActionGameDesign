export const entityKinds = ["concept", "case", "conflict", "source", "game"] as const;
export type EntityKind = (typeof entityKinds)[number];

export const relationKinds = [
  "parent_of", "child_of", "related_to", "supports", "contrasts_with",
  "conflicts_with", "applies_to", "exemplified_by"
] as const;
export type RelationKind = (typeof relationKinds)[number];
export type ReviewStatus = "draft" | "reviewed";
export const conflictTypes = ["definition", "goal", "condition", "direct"] as const;
export type ConflictType = (typeof conflictTypes)[number];

export interface MediaRef {
  src: string;
  alt: string;
  caption: string;
  kind: "image" | "gif";
  sourceId: string;
}

export interface SourceCitation { sourceId: string; locator: string; }
export interface SourceMeta {
  rawPath?: string;
  primaryUrls: string[];
  secondaryUrls: string[];
}
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
  sourceMeta?: SourceMeta;
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
