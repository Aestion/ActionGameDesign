import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { compileEdges, validateContent } from "../src/build/validate-content";

const mediaRoots: string[] = [];

afterEach(() => {
  for (const root of mediaRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("validateContent", () => {
  it("blocks duplicate IDs, missing relation targets, and one-sided conflicts", () => {
    const issues = validateContent({
      entities: [
        { id: "same", kind: "concept", title: "A" },
        { id: "same", kind: "concept", title: "B" },
        {
          id: "conflict",
          kind: "conflict",
          title: "冲突",
          conflictSides: [{ label: "A", claim: "观点", conditions: "同条件", sourceIds: ["s"] }]
        }
      ],
      declaredEdges: [{ source: "same", target: "missing", kind: "related_to" }],
      filesById: new Map()
    } as never);

    expect(issues.filter((item) => item.severity === "error").map((item) => item.code)).toEqual(
      expect.arrayContaining(["duplicate-id", "missing-target", "one-sided-conflict"])
    );
  });

  it("blocks incomplete cases, unreadable local media, and empty content", () => {
    const issues = validateContent({
      entities: [
        { id: "case", kind: "case", title: "Case", media: [{ sourcePath: "missing.gif", src: "media/missing.gif" }] }
      ],
      declaredEdges: [],
      filesById: new Map([["case", ["C:/content/cases/case.md"]]])
    } as never);

    expect(issues.filter((item) => item.severity === "error").map((item) => item.code)).toEqual(
      expect.arrayContaining([
        "case-missing-game",
        "case-missing-mechanism",
        "case-missing-source",
        "case-missing-concept",
        "unreadable-media"
      ])
    );
    expect(validateContent({ entities: [], declaredEdges: [], filesById: new Map() } as never)
      .map((item) => item.code)).toEqual(expect.arrayContaining(["empty-graph", "empty-search-index"]));
  });

  it("blocks case and conflict source references that do not resolve to catalogued entities", () => {
    const issues = validateContent({
      entities: [{ id: "concept", kind: "concept", title: "Concept" }, {
        id: "case", kind: "case", title: "Case", examples: [{
          id: "example",
          gameId: "missing-game",
          subject: "Subject",
          mechanism: "Mechanism",
          outcome: "Outcome",
          sourceIds: ["missing-source"]
        }]
      }, {
        id: "conflict",
        kind: "conflict",
        title: "Conflict",
        conflictSides: [
          { label: "A", claim: "Claim A", conditions: "Condition", sourceIds: ["missing-source"] },
          { label: "B", claim: "Claim B", conditions: "Condition", sourceIds: ["missing-source"] }
        ]
      }],
      declaredEdges: [{ source: "case", target: "concept", kind: "exemplified_by" }],
      filesById: new Map()
    } as never);

    expect(issues.filter((item) => item.severity === "error").map((item) => item.code)).toEqual(
      expect.arrayContaining(["case-missing-game", "case-missing-source", "conflict-missing-source"])
    );
  });

  it("requires every conflict to declare a valid conflict type", () => {
    const issues = validateContent({
      entities: [{ id: "source", kind: "source", title: "Source" }, {
        id: "conflict", kind: "conflict", title: "Conflict", conflictSides: [
          { label: "A", claim: "Claim A", conditions: "Condition", sourceIds: ["source"] },
          { label: "B", claim: "Claim B", conditions: "Condition", sourceIds: ["source"] }
        ]
      }],
      declaredEdges: [],
      filesById: new Map()
    } as never);

    expect(issues.map((item) => item.code)).toContain("missing-conflict-type");

    const invalidTypeIssues = validateContent({
      entities: [{ id: "source", kind: "source", title: "Source" }, {
        id: "invalid-conflict",
        kind: "conflict",
        title: "Invalid conflict",
        conflictType: "unsupported",
        conflictSides: [
          { label: "A", claim: "Claim A", conditions: "Condition", sourceIds: ["source"] },
          { label: "B", claim: "Claim B", conditions: "Condition", sourceIds: ["source"] }
        ]
      }],
      declaredEdges: [],
      filesById: new Map()
    } as never);

    expect(invalidTypeIssues.map((item) => item.code)).toContain("invalid-conflict-type");
  });

  it("blocks non-local media and unresolved media or citation sources", () => {
    const issues = validateContent({
      entities: [{
        id: "concept",
        kind: "concept",
        title: "Concept",
        media: [
          { src: "https://example.com/image.png", sourceId: "source" },
          { src: "data:image/png;base64,AAAA", sourceId: "source" },
          { src: "sample.md", sourceId: "missing-source" }
        ],
        citations: [{ sourceId: "missing-source", locator: "Section 1" }]
      }, { id: "source", kind: "source", title: "Source" }],
      declaredEdges: [],
      filesById: new Map([["concept", ["tests/fixtures/content/concepts/sample.md"]]])
    } as never);

    expect(issues.filter((item) => item.severity === "error").map((item) => item.code)).toEqual(
      expect.arrayContaining(["nonlocal-media", "missing-media-source", "missing-citation-source"])
    );
  });

  it("rejects media outside approved roots, publish traversal, and destination collisions", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "atlas-media-validation-"));
    const outside = mkdtempSync(path.join(os.tmpdir(), "atlas-media-outside-"));
    mediaRoots.push(root, outside);
    const contentFile = path.join(root, "content", "concepts", "item.md");
    const approvedAsset = path.join(root, "assets", "approved.gif");
    const outsideAsset = path.join(outside, "outside.gif");
    mkdirSync(path.dirname(contentFile), { recursive: true });
    mkdirSync(path.dirname(approvedAsset), { recursive: true });
    writeFileSync(contentFile, "fixture");
    writeFileSync(approvedAsset, "GIF89a");
    writeFileSync(outsideAsset, "GIF89a");
    const relativeApproved = path.relative(path.dirname(contentFile), approvedAsset);
    const relativeOutside = path.relative(path.dirname(contentFile), outsideAsset);
    const content = {
      entities: [{ id: "traversal", kind: "concept", title: "Traversal", media: [{ sourcePath: relativeApproved, src: "../escape.gif", sourceId: "source" }] },
        { id: "collision-a", kind: "concept", title: "A", media: [{ sourcePath: relativeApproved, src: "media/shared.gif", sourceId: "source" }] },
        { id: "collision-b", kind: "concept", title: "B", media: [{ sourcePath: relativeApproved, src: "media/shared.gif", sourceId: "source" }] },
        { id: "outside", kind: "concept", title: "Outside", media: [{ sourcePath: relativeOutside, src: "media/outside.gif", sourceId: "source" }] },
        { id: "source", kind: "source", title: "Source" }],
      declaredEdges: [],
      filesById: new Map([
        ["traversal", [contentFile]], ["collision-a", [contentFile]], ["collision-b", [contentFile]],
        ["outside", [contentFile]], ["source", [contentFile]]
      ])
    } as never;

    const issues = validateContent(content, { approvedMediaRoots: [root] });

    expect(issues.map(({ code }) => code)).toEqual(expect.arrayContaining([
      "invalid-media-destination",
      "duplicate-media-destination",
      "unapproved-media-source"
    ]));
    expect(validateContent(content).map(({ code }) => code)).toContain("unapproved-media-source");
  });

  it("warns about missing examples, isolated nodes, unverified external links, indirect sources, and term aliases", () => {
    const issues = validateContent({
      entities: [{
        id: "concept",
        kind: "concept",
        title: "Term",
        aliases: [],
        examples: [],
        bodyHtml: '<p><a href="https://example.com">External</a></p>'
      }, {
        id: "source",
        kind: "source",
        title: "Indirect source",
        examples: [],
        bodyHtml: ""
      }],
      declaredEdges: [],
      filesById: new Map()
    } as never);

    expect(issues.filter((item) => item.severity === "warning").map((item) => item.code)).toEqual(
      expect.arrayContaining([
        "no-examples",
        "no-inbound-edge",
        "external-link-unverified",
        "source-no-primary-link",
        "missing-alias"
      ])
    );
  });

  it("warns when a source has secondary URLs but no primary URLs", () => {
    const issues = validateContent({
      entities: [{
        id: "source",
        kind: "source",
        title: "Secondary only",
        bodyHtml: '<p><a href="https://secondary.example.com">Secondary</a></p>',
        sourceMeta: { primaryUrls: [], secondaryUrls: ["https://secondary.example.com"] }
      }],
      declaredEdges: [],
      filesById: new Map()
    } as never);

    expect(issues.map((item) => item.code)).toContain("source-no-primary-link");
  });

  it("adds reverse hierarchy and symmetric relations without duplicating declared reverse edges", () => {
    expect(compileEdges([
      { source: "parent", target: "child", kind: "parent_of" },
      { source: "first", target: "second", kind: "related_to" },
      { source: "second", target: "first", kind: "related_to" }
    ])).toEqual(expect.arrayContaining([
      { source: "child", target: "parent", kind: "child_of" },
      { source: "second", target: "first", kind: "related_to" }
    ]));
    expect(compileEdges([
      { source: "parent", target: "child", kind: "parent_of" },
      { source: "child", target: "parent", kind: "child_of" }
    ])).toHaveLength(2);
  });
});
