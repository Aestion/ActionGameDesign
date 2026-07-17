import { describe, expect, it } from "vitest";
import { loadContent } from "../src/build/load-content";

const sourceIds = [
  "source-action-design-difficulty",
  "source-act-classification-1",
  "source-act-classification-2",
  "source-combat-approaches",
  "source-low-poise-boss",
  "source-inaba-interviews"
];

const taskConceptIds = [
  "domain-type-boundary",
  "broad-act",
  "common-act",
  "traditional-act",
  "traditional-act-subtypes",
  "action-adventure",
  "souls-framework",
  "coop-musou-action-shooter-jrpg",
  "domain-production-philosophy",
  "producer-director",
  "vision-pivot-and-strengths",
  "talent-practice-preservation"
];

const classificationAndInabaGameIds = [
  "ikaruga", "touhou-project", "dodonpachi", "contra", "metal-slug", "metroid",
  "wolfenstein", "doom", "super-mario", "celeste", "the-legend-of-zelda",
  "cadillacs-and-dinosaurs", "cuphead", "ghosts-n-goblins", "bayonetta",
  "castlevania", "devil-may-cry", "ninja-gaiden", "god-of-war", "metal-gear-rising",
  "sekiro", "nioh", "dark-souls", "onimusha", "god-hand", "urban-reign", "absolver",
  "sifu", "shinobi", "ghostrunner", "okami", "the-wonderful-101", "killer7",
  "no-more-heroes", "lollipop-chainsaw", "asuras-wrath", "detroit-become-human",
  "naruto-ultimate-ninja-storm",
  "tomb-raider", "prince-of-persia", "darksiders", "heavenly-sword", "dantes-inferno",
  "x-men-origins-wolverine", "batman-arkham", "marvels-spider-man", "middle-earth-shadow",
  "remember-me", "assassins-creed", "ryse-son-of-rome", "hellblade", "ghost-of-tsushima",
  "prototype", "infamous", "gravity-rush", "saints-row", "yakuza", "shenmue", "judgment",
  "sleeping-dogs", "akibas-trip", "dying-light", "dishonored", "vermintide",
  "shadow-of-the-colossus", "bloodborne", "elden-ring", "the-surge", "code-vein",
  "salt-and-sanctuary", "star-wars-jedi", "thymesia", "stranger-of-paradise",
  "monster-hunter", "god-eater", "toukiden", "dynasty-warriors", "sengoku-basara",
  "yoshitsune-eiyuden", "onechanbara", "chaos-legion", "drakengard", "half-life", "halo",
  "call-of-duty", "shadow-warrior", "borderlands", "vanquish", "gungrave",
  "bionic-commando", "nelo", "the-elder-scrolls", "diablo", "the-witcher", "ys",
  "scarlet-nexus", "nier", "tales", "kingdom-hearts", "viewtiful-joe", "scalebound",
  "babylons-fall", "sol-cresta", "project-gg"
];

describe("initial source, taxonomy, and philosophy migration", () => {
  it("contains all six source records and the two top-level domains introduced in Task 4", async () => {
    const content = await loadContent("content");
    const ids = new Set(content.entities.map((entity) => entity.id));

    expect(sourceIds.every((id) => ids.has(id))).toBe(true);
    expect(["domain-type-boundary", "domain-production-philosophy"].every((id) => ids.has(id))).toBe(true);
    expect(content.entities.filter(({ id }) => id.startsWith("domain-")).map(({ id }) => id).sort())
      .toEqual(["domain-production-philosophy", "domain-type-boundary"]);
  });

  it("records local provenance, external links, language availability, and scoped source notes", async () => {
    const content = await loadContent("content");
    const sources = sourceIds.map((id) => content.entities.find((entity) => entity.id === id));

    expect(sources.every((source) => source?.kind === "source" && source.sourceMeta?.rawPath)).toBe(true);
    expect(sources.every((source) => source?.sourceMeta?.primaryUrls.length)).toBe(true);
    for (const source of sources) {
      expect(source?.bodyHtml).toMatch(/作者/u);
      expect(source?.bodyHtml).toMatch(/出处|发布平台/u);
      expect(source?.bodyHtml).toMatch(/日期/u);
      expect(source?.bodyHtml).toMatch(/语言可用性/u);
      expect(source?.bodyHtml).toMatch(/范围/u);
    }
  });

  it("preserves every requested classification branch and all ten Inaba themes with locators", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));

    expect(taskConceptIds.every((id) => entitiesById.has(id))).toBe(true);
    expect(entitiesById.get("traditional-act-subtypes")?.bodyHtml).toMatch(/打沙包[\s\S]*快节奏乱战[\s\S]*闪避与风筝[\s\S]*防御反击[\s\S]*类格斗[\s\S]*跑酷背板[\s\S]*艺术特色[\s\S]*须田刚一[\s\S]*演出播片/u);
    expect(entitiesById.get("traditional-act-subtypes")?.bodyHtml).toContain("底特律");
    expect(entitiesById.get("action-adventure")?.bodyHtml).toMatch(/类战神[\s\S]*磁铁吸附式[\s\S]*简易化近战[\s\S]*混合超能力[\s\S]*街头肉搏与械斗[\s\S]*第一人称动作/u);
    expect(entitiesById.get("souls-framework")?.bodyHtml).toMatch(/精力条回合制[\s\S]*简化攻防[\s\S]*传统 ACT 化/u);

    const philosophyHtml = ["producer-director", "vision-pivot-and-strengths", "talent-practice-preservation"]
      .map((id) => entitiesById.get(id)?.bodyHtml ?? "")
      .join("\n");
    for (const theme of [
      "入行动机", "制作人 vs 导演", "概念不可行时果断转向", "不能一味迎合用户",
      "人才观", "继承自三上真司", "动作游戏的 know-how", "不愿被定型",
      "游戏文化的保存与传承", "对中国游戏行业的观察"
    ]) expect(philosophyHtml).toContain(theme);

    for (const id of taskConceptIds.filter((id) => !id.startsWith("domain-"))) {
      expect(entitiesById.get(id)?.citations.some(({ locator }) => locator.length > 0)).toBe(true);
    }
    expect(entitiesById.get("vision-pivot-and-strengths")?.editorialSynthesis).toMatch(/编者归纳/u);
  });

  it("catalogues every game or series named by the classification sources and Inaba summary", async () => {
    const content = await loadContent("content");
    const gameIds = new Set(content.entities.filter(({ kind }) => kind === "game").map(({ id }) => id));

    expect(classificationAndInabaGameIds.filter((id) => !gameIds.has(id))).toEqual([]);
  });

  it("models both conflicts with complete sourced sides and explicit conditions", async () => {
    const content = await loadContent("content");
    const conflicts = ["act-definition-boundaries", "action-depth-vs-content-breadth"]
      .map((id) => content.entities.find((entity) => entity.id === id));

    expect(conflicts.map((conflict) => conflict?.conflictType)).toEqual(["definition", "goal"]);
    expect(conflicts[0]?.conflictSides).toHaveLength(3);
    expect(conflicts[1]?.conflictSides).toHaveLength(2);
    expect(conflicts.every((conflict) => conflict?.conflictSides?.every((side) =>
      side.conditions.length > 0 && side.sourceIds.length > 0
    ))).toBe(true);
    expect(conflicts[1]?.bodyHtml).toMatch(/传统 ACT[\s\S]*魂[\s\S]*老战神/u);
  });
});
