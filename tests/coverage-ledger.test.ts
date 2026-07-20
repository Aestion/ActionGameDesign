import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  parseCoverageLedger,
  type CoverageLedger
} from "../src/build/coverage-ledger";
import { loadContent } from "../src/build/load-content";

type LoadedContent = Awaited<ReturnType<typeof loadContent>>;

const sourceSectionExpectation = {
  total: 270,
  counts: {
    "source-act-classification-1": 28,
    "source-act-classification-2": 34,
    "source-action-design-difficulty": 110,
    "source-combat-approaches": 52,
    "source-inaba-interviews": 16,
    "source-low-poise-boss": 30
  },
  digest: "4a03d9f760983713118bffb7bfbc83d624bc59d90b454e851d741c93c2be9cc3"
} as const;

async function readLedgerInput(): Promise<unknown> {
  return JSON.parse(await readFile("content/coverage.json", "utf8"));
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function assertSourceSectionInventory(ledger: CoverageLedger): void {
  const sections = ledger.items.filter(({ kind }) => kind === "source-section");
  const counts = Object.fromEntries(Object.keys(sourceSectionExpectation.counts).map((sourceId) => [
    sourceId,
    sections.filter((item) => item.sourceId === sourceId).length
  ]));
  const digest = createHash("sha256")
    .update(sections.map(({ id }) => id).sort().join("\n"), "utf8")
    .digest("hex");

  expect(sections).toHaveLength(sourceSectionExpectation.total);
  expect(counts).toEqual(sourceSectionExpectation.counts);
  expect(digest).toBe(sourceSectionExpectation.digest);
}

function assertExactExampleSourcePairs(content: LoadedContent, ledger: CoverageLedger): void {
  const expected = content.entities.flatMap(({ examples }) => examples.flatMap(({ id, sourceIds }) =>
    sourceIds.map((sourceId) => `${sourceId}\u0000example:${id}`)
  )).sort();
  const actual = ledger.items
    .filter(({ kind, status }) => kind === "game-example" && status === "mapped")
    .flatMap(({ sourceId, targets }) => targets.map((target) => `${sourceId}\u0000${target}`))
    .sort();

  expect(actual).toEqual(expected);
}

function assertMediaProvenance(content: LoadedContent, ledger: CoverageLedger, rawSource: string): void {
  const mediaRefs = content.entities.flatMap(({ media }) => media);
  const expected = mediaRefs.map(({ src, sourceId, sourcePath }) =>
    `media:${src}\u0000${sourceId}\u0000${sourcePath}`
  ).sort();
  const mediaRows = ledger.items.filter(({ kind, status }) => kind === "media" && status === "mapped");
  const actual = mediaRows.map(({ targets, sourceId, sourcePath }) =>
    `${targets[0]}\u0000${sourceId}\u0000${sourcePath ?? "<missing>"}`
  ).sort();
  const sourceLines = rawSource.split(/\r?\n/u);

  expect(mediaRows).toHaveLength(31);
  expect(actual).toEqual(expected);
  for (const row of mediaRows) {
    const locatorMatch = /^动作游戏设计之难\.md:(\d+) — (.+)$/u.exec(row.locator);
    expect(locatorMatch, row.id).not.toBeNull();
    if (!locatorMatch) continue;

    const sourceLine = sourceLines[Number(locatorMatch[1]) - 1];
    const filename = row.sourcePath?.split(/[\\/]/u).at(-1);
    expect(sourceLine, row.id).toContain(filename);
    expect(locatorMatch[2].trim().length, row.id).toBeGreaterThan(0);
  }
}

describe("coverage ledger runtime schema", () => {
  it("parses the checked-in ledger through a strict runtime schema", async () => {
    const ledger = parseCoverageLedger(await readLedgerInput());

    expect(ledger.version).toBe(1);
    expect(ledger.items).not.toHaveLength(0);
  });

  it("rejects unknown kind, status, source, and disposition values", async () => {
    const input = await readLedgerInput() as { items: Array<Record<string, unknown>> };
    const excludedIndex = input.items.findIndex(({ status }) => status === "excluded");
    const mutations = [
      (value: typeof input) => { value.items[0].kind = "unknown-kind"; },
      (value: typeof input) => { value.items[0].status = "unknown-status"; },
      (value: typeof input) => { value.items[0].sourceId = "source-unknown"; },
      (value: typeof input) => { value.items[excludedIndex].disposition = "unknown-disposition"; }
    ];

    for (const mutate of mutations) {
      const mutated = clone(input);
      mutate(mutated);
      expect(() => parseCoverageLedger(mutated)).toThrow();
    }
  });

  it("rejects unstable or duplicate row IDs and empty locators or duplicate targets", async () => {
    const input = await readLedgerInput() as { items: Array<Record<string, unknown>> };
    const mutations = [
      (value: typeof input) => { value.items[0].id = ""; },
      (value: typeof input) => { value.items[0].id = "not stable"; },
      (value: typeof input) => { value.items[1].id = value.items[0].id; },
      (value: typeof input) => { value.items[0].locator = ""; },
      (value: typeof input) => {
        const targets = value.items[0].targets as string[];
        value.items[0].targets = [targets[0], targets[0]];
      }
    ];

    for (const mutate of mutations) {
      const mutated = clone(input);
      mutate(mutated);
      expect(() => parseCoverageLedger(mutated)).toThrow();
    }
  });

  it("pins the complete source-section inventory and rejects a deleted row", async () => {
    const ledger = parseCoverageLedger(await readLedgerInput());
    assertSourceSectionInventory(ledger);

    const mutated = clone(ledger);
    mutated.items.splice(mutated.items.findIndex(({ kind }) => kind === "source-section"), 1);
    expect(() => assertSourceSectionInventory(mutated)).toThrow();
  });

  it("requires raw sourcePath provenance on every media row", async () => {
    const input = await readLedgerInput() as { items: Array<Record<string, unknown>> };
    const mutated = clone(input);
    const mediaRow = mutated.items.find(({ kind }) => kind === "media");
    delete mediaRow?.sourcePath;

    expect(() => parseCoverageLedger(mutated)).toThrow();
  });
});

describe("coverage ledger exact provenance", () => {
  it("matches the exact InlineExample/source multiset and rejects pair mutations", async () => {
    const [content, ledger] = await Promise.all([
      loadContent("content"),
      readLedgerInput().then(parseCoverageLedger)
    ]);
    assertExactExampleSourcePairs(content, ledger);

    const target = "example:neutral-dmc3-vergil";
    const pairIndex = ledger.items.findIndex(({ kind, targets }) => kind === "game-example" && targets.includes(target));

    const missing = clone(ledger);
    missing.items.splice(pairIndex, 1);
    expect(() => assertExactExampleSourcePairs(content, missing)).toThrow();

    const duplicate = clone(ledger);
    duplicate.items.push({ ...clone(duplicate.items[pairIndex]), id: "example-review-duplicate-probe" });
    expect(() => assertExactExampleSourcePairs(content, duplicate)).toThrow();

    const wrongSource = clone(ledger);
    wrongSource.items[pairIndex].sourceId = "source-low-poise-boss";
    expect(() => assertExactExampleSourcePairs(content, wrongSource)).toThrow();
  });

  it("matches generated target, source ID, raw sourcePath, and original occurrence locator", async () => {
    const [content, ledger, rawSource] = await Promise.all([
      loadContent("content"),
      readLedgerInput().then(parseCoverageLedger),
      readFile("原始资料/动作游戏设计之难.md", "utf8")
    ]);
    assertMediaProvenance(content, ledger, rawSource);

    const mediaIndex = ledger.items.findIndex(({ kind }) => kind === "media");
    const wrongSource = clone(ledger);
    wrongSource.items[mediaIndex].sourceId = "source-act-classification-1";
    expect(() => assertMediaProvenance(content, wrongSource, rawSource)).toThrow();

    const wrongPath = clone(ledger);
    wrongPath.items[mediaIndex].sourcePath = "../../原始资料/动作游戏设计之难_assets/not-the-source-file.jpg";
    expect(() => assertMediaProvenance(content, wrongPath, rawSource)).toThrow();
  });
});
