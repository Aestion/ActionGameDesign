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

const systemAndPresentationConceptIds = [
  "domain-system-depth",
  "compound-decisions",
  "depth-width-feedback-time",
  "reaction-frequency",
  "enemy-attack-allocation",
  "control-precision",
  "time-precision",
  "space-precision",
  "command-dimension",
  "external-rules-and-difficulty",
  "feedback-loops",
  "clearing-and-non-clearing",
  "action-external-interoperation",
  "domain-presentation",
  "intuitive-experience",
  "camera-and-fov",
  "animation-readability",
  "auxiliary-cues",
  "spectacle-techniques",
  "readability-spectacle-balance",
  "training-and-depth"
];

const systemAndPresentationConflictIds = ["difficulty-sources", "readability-vs-spectacle"];

const actionDesignMediaFiles = [
  "103949bhlivcuahomevxlx.jpg",
  "103949wxc368k8ce38lmxi.jpg",
  "103951bbizu5bbp5p6ppb5.gif",
  "103953agjvlaeyt5tze51v.gif",
  "103953ewp5o4sv6w6ccjwz.jpg",
  "103955eetgdwpwby6ywyw3.gif",
  "103957fk51ektj9te2j42p.gif",
  "103958j1i1w8mm7m7nsi1o.jpg",
  "103958ug878jjngcv5d44c.gif",
  "103959jihtubqjbth59det.jpg",
  "104002gihz9rd995r44djc.gif",
  "104005mmsd44qgp5qgqca4.gif",
  "104016u9d46hnu9uuhnc3u.gif",
  "104020sa0qkz9uzapir4au.gif",
  "104029yxj1d1zq338l4mzd.gif",
  "104031tr4dxulrx0bxcyuj.gif",
  "104035u1nhfn4p32p0b184.gif",
  "104038ydudihxjxvxxiddk.jpg",
  "104040ba6iy30ay1hy96i2.gif",
  "104043k9g9y04csxk4se46.gif",
  "104045igd3gcq43scc3qfg.gif",
  "104049nqw8oqoyknyoywty.jpg",
  "104101x0qjqvrj62z8up5b.gif",
  "104105h2kb279pwo7x3bkf.gif",
  "104108bviiivxio0boir3b.gif",
  "104113q4c11mb99cwblnl4.gif",
  "104115sg7xzps8xkq8kh67.gif",
  "104125vphmmjpj3whmm0wu.gif",
  "104129zrymyzjzmj4l7l4e.gif",
  "104139sr4qmojfjpfcp0y9.gif",
  "104147nefrajq0fjxjjx9r.gif"
];

const systemAndPresentationGameIds = [
  "assassins-creed", "bayonetta", "bloodborne", "dark-souls", "darksiders", "dead-cells",
  "devil-may-cry", "dnf", "double-dragon", "dragons-dogma", "dynasty-warriors", "for-honor",
  "furi", "god-of-war", "hellblade", "honkai-impact-3rd", "knights-of-valour", "middle-earth-shadow",
  "monster-hunter", "muramasa", "naruto-ultimate-ninja-storm", "nier", "ninja-gaiden", "nioh",
  "odin-sphere", "osu", "overwatch", "shadow-of-the-colossus", "stanley-parable", "street-fighter",
  "the-king-of-fighters", "titan-souls", "vindictus"
];

const classificationAndInabaGameIds = [
  "ikaruga", "touhou-project", "dodonpachi", "contra", "metal-slug", "metroid",
  "wolfenstein", "doom", "super-mario", "celeste", "the-legend-of-zelda",
  "cadillacs-and-dinosaurs", "cuphead", "ghosts-n-goblins", "bayonetta",
  "castlevania", "devil-may-cry", "ninja-gaiden", "god-of-war", "metal-gear-rising",
  "sekiro", "nioh", "dark-souls", "souls-series", "onimusha", "god-hand", "urban-reign", "absolver",
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
      .toEqual(["domain-presentation", "domain-production-philosophy", "domain-system-depth", "domain-type-boundary"]);
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

  it("does not turn interview topic listings into source-backed production examples", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));

    expect(entitiesById.get("producer-director")?.examples.map(({ id }) => id)).not.toContain("producer-w101");
    expect(entitiesById.get("vision-pivot-and-strengths")?.examples.map(({ id }) => id)).not.toContain("vision-project-gg");
  });

  it("preserves the source author's qualified action-adventure framing", async () => {
    const content = await loadContent("content");
    const actionAdventure = content.entities.find(({ id }) => id === "action-adventure");

    expect(actionAdventure?.examples.find(({ id }) => id === "aavg-gow-prince")?.outcome).toMatch(/来源作者/u);
    expect(actionAdventure?.examples.find(({ id }) => id === "aavg-gow-god")?.outcome).toMatch(/来源作者/u);
    expect(actionAdventure?.bodyHtml).toContain("来源作者把《波斯王子：时之沙》视为可能的始祖");
    expect(actionAdventure?.bodyHtml).toMatch(/通常不会把动作系统继续推到传统 ACT 的深度/u);
  });

  it("catalogues every game or series named by the classification sources and Inaba summary", async () => {
    const content = await loadContent("content");
    const games = content.entities.filter(({ kind }) => kind === "game");
    const gamesById = new Map(games.map((game) => [game.id, game]));
    const gameIds = new Set(gamesById.keys());

    expect(classificationAndInabaGameIds.filter((id) => !gameIds.has(id))).toEqual([]);
    expect(gamesById.get("souls-series")?.aliases).toEqual(expect.arrayContaining(["魂系列", "Souls series"]));
    expect(gamesById.get("dark-souls")?.aliases).not.toContain("魂系列");
    for (const game of games) {
      const normalizedNames = [game.title, ...game.aliases].map((name) => name.toLocaleLowerCase());
      expect(new Set(normalizedNames).size, game.id).toBe(normalizedNames.length);
    }
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
    expect(conflicts[1]?.examples.find(({ id }) => id === "conflict-breadth-souls")?.gameId)
      .toBe("souls-series");
    expect(conflicts[1]?.conflictSides?.every(({ sourceIds }) =>
      !sourceIds.includes("source-inaba-interviews")
    )).toBe(true);
  });

  it("classifies official direct recordings as primary source URLs", async () => {
    const content = await loadContent("content");
    const inaba = content.entities.find(({ id }) => id === "source-inaba-interviews");
    const directUrls = [
      "https://www.bilibili.com/video/BV1TU4y1F7Cu",
      "https://www.youtube.com/watch?v=sgkPw0BPL1s"
    ];

    expect(inaba?.sourceMeta?.primaryUrls).toEqual(expect.arrayContaining(directUrls));
    expect(inaba?.sourceMeta?.secondaryUrls).not.toEqual(expect.arrayContaining(directUrls));
  });
});

describe("system and presentation migration", () => {
  it("loads both complete branches and two sourced multi-sided conflicts", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));

    for (const id of [...systemAndPresentationConceptIds, ...systemAndPresentationConflictIds]) {
      expect(entitiesById.get(id), `missing Task 5 entity ${id}`).toBeDefined();
    }
    expect(["domain-system-depth", "domain-presentation"].every((id) =>
      entitiesById.get(id)?.kind === "concept" && entitiesById.get(id)?.depth === 1
    )).toBe(true);
    for (const id of systemAndPresentationConflictIds) {
      const conflict = entitiesById.get(id);
      expect(conflict?.kind).toBe("conflict");
      expect(conflict?.conflictSides?.length).toBeGreaterThanOrEqual(2);
      expect(conflict?.conflictSides?.every((side) => side.sourceIds.length > 0)).toBe(true);
    }
  });

  it("binds every original media file exactly once with complete local provenance", async () => {
    const content = await loadContent("content");
    const taskIds = new Set([...systemAndPresentationConceptIds, ...systemAndPresentationConflictIds]);
    const media = content.entities.filter(({ id }) => taskIds.has(id)).flatMap((entity) => entity.media);

    expect(media).toHaveLength(31);
    expect(media.map(({ sourcePath }) => sourcePath.split(/[\\/]/u).at(-1)).sort())
      .toEqual([...actionDesignMediaFiles].sort());
    expect(new Set(media.map(({ src }) => src)).size).toBe(31);
    expect(media.every(({ sourceId }) => sourceId === "source-action-design-difficulty")).toBe(true);
    expect(media.every(({ sourcePath, src, alt, caption, kind }) =>
      sourcePath.startsWith("../../动作游戏设计之难_assets/")
      && src.startsWith("media/")
      && alt.trim().length > 0
      && caption.trim().length > 0
      && ((kind === "gif") === sourcePath.endsWith(".gif"))
    )).toBe(true);
  });

  it("catalogues every game named by the system and presentation source examples", async () => {
    const content = await loadContent("content");
    const games = new Set(content.entities.filter(({ kind }) => kind === "game").map(({ id }) => id));
    const taskIds = new Set([...systemAndPresentationConceptIds, ...systemAndPresentationConflictIds]);
    const taskExampleGameIds = content.entities
      .filter(({ id }) => taskIds.has(id))
      .flatMap(({ examples }) => examples)
      .map(({ gameId }) => gameId);
    const unresolvedExampleGames = taskExampleGameIds.filter((gameId) => !games.has(gameId));

    expect(systemAndPresentationGameIds.filter((id) => !games.has(id))).toEqual([]);
    expect(systemAndPresentationGameIds.filter((id) => !taskExampleGameIds.includes(id))).toEqual([]);
    expect(unresolvedExampleGames).toEqual([]);
  });
});
