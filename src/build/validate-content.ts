import { accessSync, constants } from "node:fs";
import path from "node:path";
import type { KnowledgeEdge, KnowledgeEntity, RelationKind, ValidationIssue } from "../model";
import type { LoadedContent } from "./load-content";

const symmetricRelationKinds = new Set<RelationKind>([
  "related_to",
  "contrasts_with",
  "conflicts_with"
]);

function edgeKey(edge: KnowledgeEdge): string {
  return `${edge.source}\u0000${edge.target}\u0000${edge.kind}`;
}

export function compileEdges(declaredEdges: KnowledgeEdge[]): KnowledgeEdge[] {
  const edges = [...declaredEdges];
  const keys = new Set(edges.map(edgeKey));

  for (const edge of declaredEdges) {
    const reverseKind: RelationKind | undefined = edge.kind === "parent_of"
      ? "child_of"
      : edge.kind === "child_of"
        ? "parent_of"
        : symmetricRelationKinds.has(edge.kind)
          ? edge.kind
          : undefined;
    if (!reverseKind) continue;

    const reverse: KnowledgeEdge = { source: edge.target, target: edge.source, kind: reverseKind };
    if (!keys.has(edgeKey(reverse))) {
      edges.push(reverse);
      keys.add(edgeKey(reverse));
    }
  }

  return edges;
}

function issue(
  severity: ValidationIssue["severity"],
  code: string,
  file: string,
  message: string
): ValidationIssue {
  return { severity, code, file, message };
}

function fileFor(content: LoadedContent, id: string): string {
  return content.filesById.get(id)?.join(", ") ?? id;
}

function hasReadableLocalMedia(entity: KnowledgeEntity, content: LoadedContent): boolean {
  const sourceFile = content.filesById.get(entity.id)?.[0];
  return (entity.media ?? []).every((media) => {
    if (/^(https?:|data:)/i.test(media.src)) return true;
    const mediaPath = sourceFile ? path.resolve(path.dirname(sourceFile), media.src) : media.src;
    try {
      accessSync(mediaPath, constants.R_OK);
      return true;
    } catch {
      return false;
    }
  });
}

function containsExternalLink(entity: KnowledgeEntity): boolean {
  const body = entity.bodyHtml ?? "";
  return /(?:href|src)=(?:"|')https?:\/\//i.test(body)
    || (entity.media ?? []).some((media) => /^https?:/i.test(media.src));
}

export function validateContent(content: LoadedContent): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const entitiesById = new Map<string, KnowledgeEntity>();

  if (content.entities.length === 0) {
    issues.push(issue("error", "empty-graph", "content", "No knowledge entities were loaded."));
    issues.push(issue("error", "empty-search-index", "content", "No searchable knowledge entities were loaded."));
    return issues;
  }

  for (const entity of content.entities) {
    const entityId = entity.id?.trim();
    if (!entityId) {
      issues.push(issue("error", "missing-id", "unknown", "Every entity requires an id."));
      continue;
    }
    if (ids.has(entityId)) {
      issues.push(issue("error", "duplicate-id", fileFor(content, entityId), `Duplicate entity id: ${entityId}.`));
      continue;
    }
    ids.add(entityId);
    entitiesById.set(entityId, entity);
  }

  const hasSearchableText = content.entities.some((entity) => [
    entity.title,
    entity.summary,
    entity.bodyHtml,
    ...(entity.aliases ?? [])
  ].some((value) => value?.trim()));
  if (!hasSearchableText) {
    issues.push(issue("error", "empty-search-index", "content", "No entity contains searchable text."));
  }

  for (const edge of content.declaredEdges) {
    if (!entitiesById.has(edge.target)) {
      issues.push(issue(
        "error",
        "missing-target",
        fileFor(content, edge.source),
        `Relation from ${edge.source} targets unknown entity ${edge.target}.`
      ));
    }
  }

  const compiledEdges = compileEdges(content.declaredEdges);
  const inboundIds = new Set(compiledEdges.map((edge) => edge.target));

  for (const entity of entitiesById.values()) {
    const entityFile = fileFor(content, entity.id);
    const examples = entity.examples ?? [];

    if (entity.kind === "case") {
      const relatedConcept = content.declaredEdges.some((edge) => {
        if (edge.source !== entity.id && edge.target !== entity.id) return false;
        const relatedId = edge.source === entity.id ? edge.target : edge.source;
        return entitiesById.get(relatedId)?.kind === "concept";
      });
      if (examples.length === 0 || examples.some((example) =>
        !example.gameId?.trim() || entitiesById.get(example.gameId)?.kind !== "game"
      )) {
        issues.push(issue("error", "case-missing-game", entityFile, "Cases require a game reference."));
      }
      if (examples.length === 0 || examples.some((example) => !example.mechanism?.trim())) {
        issues.push(issue("error", "case-missing-mechanism", entityFile, "Cases require a mechanism."));
      }
      if (examples.length === 0 || examples.some((example) =>
        !example.sourceIds?.length || example.sourceIds.some((sourceId) => entitiesById.get(sourceId)?.kind !== "source")
      )) {
        issues.push(issue("error", "case-missing-source", entityFile, "Cases require at least one source."));
      }
      if (!relatedConcept) {
        issues.push(issue("error", "case-missing-concept", entityFile, "Cases must relate to a concept."));
      }
    }

    if (entity.kind === "conflict") {
      const sides = entity.conflictSides ?? [];
      if (sides.length < 2) {
        issues.push(issue("error", "one-sided-conflict", entityFile, "Conflicts require at least two sides."));
      }
      if (sides.some((side) =>
        !side.sourceIds?.length || side.sourceIds.some((sourceId) => entitiesById.get(sourceId)?.kind !== "source")
      )) {
        issues.push(issue("error", "conflict-missing-source", entityFile, "Every conflict side requires a source."));
      }
    }

    if (!hasReadableLocalMedia(entity, content)) {
      issues.push(issue("error", "unreadable-media", entityFile, "A referenced local media file is missing or unreadable."));
    }

    if (examples.length === 0) {
      issues.push(issue("warning", "no-examples", entityFile, "This node has no examples."));
    }
    if (!inboundIds.has(entity.id)) {
      issues.push(issue("warning", "no-inbound-edge", entityFile, "This node has no incoming relation."));
    }
    if (containsExternalLink(entity)) {
      issues.push(issue("warning", "external-link-unverified", entityFile, "External links cannot be verified locally."));
    }
    if (entity.kind === "source" && !containsExternalLink(entity)) {
      issues.push(issue("warning", "source-no-primary-link", entityFile, "This source has no primary external link."));
    }
    if (entity.kind === "concept" && (entity.aliases ?? []).length === 0) {
      issues.push(issue("warning", "missing-alias", entityFile, "Terms should include aliases for search."));
    }
  }

  return issues;
}
