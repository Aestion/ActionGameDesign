import { z } from "zod";
import { entityKinds, relationKinds } from "../model";

const RelationSchema = z.object({
  kind: z.enum(relationKinds),
  target: z.string().min(1),
  note: z.string().optional()
});
const CitationSchema = z.object({ sourceId: z.string().min(1), locator: z.string().min(1) });
const MediaSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1),
  kind: z.enum(["image", "gif"]),
  sourceId: z.string().min(1)
});
const ExampleSchema = z.object({
  id: z.string().min(1),
  gameId: z.string().min(1),
  subject: z.string().min(1),
  mechanism: z.string().min(1),
  outcome: z.string().min(1),
  sourceIds: z.array(z.string()).min(1)
});
const ConflictSideSchema = z.object({
  label: z.string().min(1),
  claim: z.string().min(1),
  conditions: z.string().min(1),
  sourceIds: z.array(z.string()).min(1)
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
    id: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    aliases: z.array(z.string()).default([]),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    matrix: z.record(z.string(), z.string()).default({})
  })).min(1)
});
