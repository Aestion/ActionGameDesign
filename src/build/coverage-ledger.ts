import { z } from "zod";

export const coverageSourceIds = [
  "source-action-design-difficulty",
  "source-act-classification-1",
  "source-act-classification-2",
  "source-combat-approaches",
  "source-low-poise-boss",
  "source-inaba-interviews"
] as const;

const CoverageKindSchema = z.enum(["source-section", "game-example", "media"]);
const CoverageStatusSchema = z.enum(["mapped", "excluded", "unmapped"]);
const CoverageDispositionSchema = z.enum(["duplicate", "contact-info", "search-method", "non-design"]);
const StableRowIdSchema = z.string().trim().min(1).regex(/^[a-z0-9][a-z0-9.-]*$/u);
const CoverageTargetSchema = z.string().trim().min(1).regex(
  /^(?:[a-z0-9][a-z0-9-]*|example:[a-z0-9][a-z0-9-]*|media:media\/[a-z0-9][a-z0-9.-]*)$/u
);

const CoverageItemSchema = z.object({
  id: StableRowIdSchema,
  sourceId: z.enum(coverageSourceIds),
  kind: CoverageKindSchema,
  locator: z.string().trim().min(1),
  status: CoverageStatusSchema,
  targets: z.array(CoverageTargetSchema),
  disposition: CoverageDispositionSchema.optional(),
  sourcePath: z.string().trim().min(1).optional()
}).strict().superRefine((item, context) => {
  if (new Set(item.targets).size !== item.targets.length) {
    context.addIssue({ code: "custom", path: ["targets"], message: "Coverage targets must be unique within a row." });
  }

  if (item.status === "mapped" && item.targets.length === 0) {
    context.addIssue({ code: "custom", path: ["targets"], message: "Mapped coverage rows require at least one target." });
  }
  if (item.status === "excluded" && (item.targets.length > 0 || item.disposition === undefined)) {
    context.addIssue({ code: "custom", path: ["disposition"], message: "Excluded rows require a disposition and no targets." });
  }
  if (item.status !== "excluded" && item.disposition !== undefined) {
    context.addIssue({ code: "custom", path: ["disposition"], message: "Only excluded rows may have a disposition." });
  }
  if (item.status === "unmapped" && item.targets.length > 0) {
    context.addIssue({ code: "custom", path: ["targets"], message: "Unmapped rows cannot claim mapped targets." });
  }

  const invalidTarget = item.targets.find((target) =>
    (item.kind === "source-section" && target.includes(":"))
    || (item.kind === "game-example" && !target.startsWith("example:"))
    || (item.kind === "media" && !target.startsWith("media:"))
  );
  if (invalidTarget !== undefined) {
    context.addIssue({ code: "custom", path: ["targets"], message: `Target ${invalidTarget} does not match row kind ${item.kind}.` });
  }
  if (item.kind !== "media" && item.sourcePath !== undefined) {
    context.addIssue({ code: "custom", path: ["sourcePath"], message: "Only media rows may declare sourcePath." });
  }
  if (item.kind === "media" && item.sourcePath === undefined) {
    context.addIssue({ code: "custom", path: ["sourcePath"], message: "Media rows require the raw sourcePath." });
  }
});

const CoverageLedgerSchema = z.object({
  version: z.literal(1),
  methodology: z.object({
    unit: z.string().trim().min(1),
    targetSyntax: z.object({
      entity: z.string().trim().min(1),
      example: z.string().trim().min(1),
      media: z.string().trim().min(1)
    }).strict(),
    excludedDispositions: z.array(CoverageDispositionSchema).length(4)
  }).strict(),
  items: z.array(CoverageItemSchema).min(1)
}).strict().superRefine((ledger, context) => {
  const seen = new Set<string>();
  for (const [index, item] of ledger.items.entries()) {
    if (seen.has(item.id)) {
      context.addIssue({ code: "custom", path: ["items", index, "id"], message: `Duplicate coverage row ID: ${item.id}.` });
    }
    seen.add(item.id);
  }
});

export type CoverageItem = z.infer<typeof CoverageItemSchema>;
export type CoverageLedger = z.infer<typeof CoverageLedgerSchema>;

export function parseCoverageLedger(input: unknown): CoverageLedger {
  return CoverageLedgerSchema.parse(input);
}
