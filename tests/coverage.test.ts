import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { parseCoverageLedger } from "../src/build/coverage-ledger";
import { loadContent } from "../src/build/load-content";

const sourceIds = [
  "source-action-design-difficulty",
  "source-act-classification-1",
  "source-act-classification-2",
  "source-combat-approaches",
  "source-low-poise-boss",
  "source-inaba-interviews"
] as const;

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

const combatAndBossEntityIds = [
  "domain-combat",
  "neutral-and-openings",
  "anti-armor-neutral",
  "low-poise-neutral",
  "interruption",
  "suppression",
  "continuous-hitstun-and-launch",
  "wakeup-and-resource-suppression",
  "invulnerable-suppression",
  "instant-kill",
  "setplay",
  "fixed-sequence",
  "domain-enemy-boss",
  "boss-poise-taxonomy",
  "round-based-humanoid",
  "pseudo-equal-humanoid",
  "souls-low-poise-exception",
  "dmc4-dante",
  "bayonetta-jeanne",
  "ninja-gaiden-doppelganger",
  "nioh2-saito-toshimitsu",
  "high-ai-vs-learnability"
];

const combatAndBossScenarioIds: Array<[id: string, gameId: string]> = [
  ["combat-substitute-sekiro", "sekiro"],
  ["combat-substitute-dmc", "devil-may-cry"],
  ["combat-substitute-nioh", "nioh"],
  ["neutral-nioh-yoshitsune-nyotengu", "nioh"],
  ["neutral-souls-blindspot", "souls-series"],
  ["neutral-dmc-airborne", "devil-may-cry"],
  ["neutral-bayonetta-kiting", "bayonetta"],
  ["neutral-souls-stagger-execution", "souls-series"],
  ["neutral-nioh-zero-ki-staking", "nioh"],
  ["neutral-dmc3-vergil", "devil-may-cry"],
  ["neutral-bayonetta2-balder", "bayonetta"],
  ["neutral-ngs2-genshin", "ninja-gaiden"],
  ["neutral-gow4-sigrun", "god-of-war"],
  ["neutral-elden-malenia", "elden-ring"],
  ["neutral-sekiro-isshin", "sekiro"],
  ["neutral-sekiro-genichiro-phase-3", "sekiro"],
  ["neutral-nioh2-saito", "nioh"],
  ["neutral-sifu-yang", "sifu"],
  ["neutral-mgrr-sam", "metal-gear-rising"],
  ["interruption-bloodborne-gun-parry", "bloodborne"],
  ["interruption-nioh2-burst-counter", "nioh"],
  ["interruption-souls-parry", "souls-series"],
  ["interruption-dmc-royal-release", "devil-may-cry"],
  ["interruption-nioh2-yokai", "nioh"],
  ["interruption-gow4-runic", "god-of-war"],
  ["interruption-nioh2-red-aura", "nioh"],
  ["interruption-gow4-hidden-poise", "god-of-war"],
  ["interruption-sifu-counters", "sifu"],
  ["suppression-dmc3-dt", "devil-may-cry"],
  ["suppression-sifu-enrage", "sifu"],
  ["suppression-mgrr-khamsin", "metal-gear-rising"],
  ["wakeup-dmc3-demon-armor", "devil-may-cry"],
  ["wakeup-monster-hunter-overdamage", "monster-hunter"],
  ["wakeup-bayonetta-dog", "bayonetta"],
  ["wakeup-nioh1-backstab", "nioh"],
  ["wakeup-nioh2-thunder", "nioh"],
  ["resource-nioh-zero-ki", "nioh"],
  ["invulnerable-bayonetta3-clock-tower", "bayonetta"],
  ["invulnerable-scarlet-nexus-sas", "scarlet-nexus"],
  ["instant-ninja-gaiden-ot", "ninja-gaiden"],
  ["instant-mgrr-zandatsu", "metal-gear-rising"],
  ["instant-gow4-wall-stun", "god-of-war"],
  ["instant-shinobi-tate", "shinobi"],
  ["instant-doom-eternal", "doom"],
  ["instant-mgrr-routing", "metal-gear-rising"],
  ["instant-gow4-early-encounters", "god-of-war"],
  ["instant-doom-cacodemon", "doom"],
  ["setplay-mh-kushala", "monster-hunter"],
  ["setplay-dmc5-goliath", "devil-may-cry"],
  ["setplay-dmc4-dante-grab", "devil-may-cry"],
  ["setplay-nioh2-spear-loop", "nioh"],
  ["setplay-sifu-wall", "sifu"],
  ["setplay-doom-control", "doom"],
  ["setplay-killing-floor-2", "killing-floor-2"],
  ["setplay-dmc5-nero-urizen", "devil-may-cry"],
  ["setplay-dmc5-dante-familiars", "devil-may-cry"],
  ["setplay-dmc3-cerberus", "devil-may-cry"],
  ["setplay-dmc3-geryon", "devil-may-cry"],
  ["setplay-dmc1-nelo-angelo", "devil-may-cry"],
  ["setplay-dmc3-beowulf", "devil-may-cry"],
  ["setplay-dmc5-urizen-health", "devil-may-cry"],
  ["setplay-nioh2-kashin-koji", "nioh"],
  ["setplay-sifu-fajar", "sifu"],
  ["setplay-nioh-nightmare-bringer", "nioh"],
  ["setplay-dmc3-nevan", "devil-may-cry"],
  ["setplay-sifu-yang", "sifu"],
  ["setplay-dmc4-dante-gun-bait", "devil-may-cry"],
  ["setplay-nioh2-ren-hayabusa", "nioh"],
  ["setplay-ng2-blood-genshin", "ninja-gaiden"],
  ["setplay-souls-build", "souls-series"],
  ["setplay-nioh-build", "nioh"],
  ["setplay-gow4-build", "god-of-war"],
  ["setplay-dmc4-burst", "devil-may-cry"],
  ["setplay-dmc5-m8-rocket-fist", "devil-may-cry"],
  ["fixed-dmc", "devil-may-cry"],
  ["fixed-gow3", "god-of-war"],
  ["fixed-bayonetta1", "bayonetta"],
  ["fixed-ng3", "ninja-gaiden"],
  ["fixed-nioh", "nioh"],
  ["fixed-mgrr", "metal-gear-rising"],
  ["fixed-darksiders1", "darksiders"],
  ["fixed-ff16", "final-fantasy-16"],
  ["boss-god-hand-humanoids", "god-hand"],
  ["boss-fear-kratos", "god-of-war"],
  ["boss-bloodborne-maria", "bloodborne"],
  ["boss-ds3-abyss-watchers", "dark-souls"],
  ["boss-ds3-friede", "dark-souls"],
  ["boss-elden-malenia", "elden-ring"],
  ["boss-nioh-humanoids", "nioh"],
  ["case-dmc4-dante-ai", "devil-may-cry"],
  ["case-bayonetta-jeanne-ai", "bayonetta"],
  ["case-ninja-gaiden-doppelganger-ai", "ninja-gaiden"],
  ["case-nioh2-saito-ai", "nioh"],
  ["souls-exception-malenia", "elden-ring"]
];

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
  "batman-arkham",
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
      .toEqual([
        "domain-combat",
        "domain-enemy-boss",
        "domain-presentation",
        "domain-production-philosophy",
        "domain-system-depth",
        "domain-type-boundary"
      ]);
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

  it("separates source and editor boundaries in the Task 5 migration", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));
    const commandDimension = entitiesById.get("command-dimension");
    const interoperation = entitiesById.get("action-external-interoperation");
    const animation = entitiesById.get("animation-readability");
    const spectacle = entitiesById.get("spectacle-techniques");

    expect(commandDimension?.examples.find(({ id }) => id === "command-bayonetta-offset")).toBeUndefined();
    expect(commandDimension?.bodyHtml).toMatch(/Dodge Offset[\s\S]*未完成/u);
    expect(interoperation?.examples.find(({ id }) => id === "interop-vindictus")?.mechanism)
      .toMatch(/重氪金[\s\S]*往往[\s\S]*转化途径/u);
    expect(interoperation?.examples.find(({ id }) => id === "interop-vindictus")?.outcome)
      .toMatch(/来源未说明[\s\S]*付费资源[\s\S]*降低[\s\S]*挑战/u);
    expect(animation?.bodyHtml).toMatch(/编者解释（补充术语）[\s\S]*动作线/u);
    expect(spectacle?.bodyHtml).toMatch(/编者解释（补充术语）[\s\S]*动作线/u);
    expect(spectacle?.examples.find(({ id }) => id === "spectacle-souls-arcs")?.mechanism)
      .not.toMatch(/动作线|Line of Action/u);
  });

  it("keeps Task 5 conflict-side evidence within the source and labels applicability synthesis", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));
    const difficulty = entitiesById.get("difficulty-sources");
    const readability = entitiesById.get("readability-vs-spectacle");
    const difficultySides = difficulty?.conflictSides ?? [];
    const difficultyExamples = difficulty?.examples ?? [];
    const readabilitySides = readability?.conflictSides ?? [];
    const difficultySideSourceText = difficultySides
      .map(({ claim, conditions }) => `${claim}\n${conditions}`)
      .join("\n");
    const difficultyExampleSourceText = difficultyExamples
      .map(({ subject, mechanism, outcome }) => `${subject}\n${mechanism}\n${outcome}`)
      .join("\n");

    expect(difficulty?.conflictType).toBe("condition");
    expect(difficultySides[0]?.claim).toMatch(/来源作者[\s\S]*反应频率[\s\S]*操控精度/u);
    expect(difficultySides[0]?.conditions).toMatch(/玩家[\s\S]*耐受[\s\S]*Sweet Spot/u);
    expect(difficultySides[1]?.conditions).toMatch(/反应频率[\s\S]*操控精度[\s\S]*不变/u);
    expect(difficultySideSourceText)
      .not.toMatch(/沉浸|资源规划|探索压力|耐久目标/u);
    expect(difficultyExampleSourceText)
      .not.toMatch(/沉浸|资源规划|探索压力|耐久目标/u);
    expect(difficulty?.editorialSynthesis).toMatch(/编者归纳[\s\S]*并不互斥/u);
    expect(difficulty?.bodyHtml).not.toMatch(/沉浸/u);
    expect(difficulty?.editorialSynthesis).toMatch(/沉浸[\s\S]*适用性推导/u);

    expect(readabilitySides[0]?.conditions).toMatch(/动作[\s\S]*功能|游戏[\s\S]*玩家/u);
    expect(readabilitySides[1]?.conditions).toMatch(/一部分可读性[\s\S]*练习/u);
    expect(readabilitySides.map(({ claim, conditions }) => `${claim}\n${conditions}`).join("\n"))
      .not.toMatch(/失败成本|接管|提示补偿|视觉卖点|随机|不一致/u);
    expect(readability?.editorialSynthesis)
      .toMatch(/编者归纳[\s\S]*失败成本[\s\S]*操作权[\s\S]*提示补偿[\s\S]*视觉卖点[\s\S]*随机或不一致/u);
  });

  it("indexes the omitted Task 5 source scenarios individually", async () => {
    const content = await loadContent("content");
    const examples = content.entities.flatMap(({ examples }) => examples);
    const examplesById = new Map(examples.map((example) => [example.id, example]));
    const expected = [
      ["allocation-batman-arkham", "batman-arkham", /蝙蝠侠|阿卡姆/u],
      ["time-dmc-precise-dodge", "devil-may-cry", /DMC.*精确闪避|鬼泣.*精确闪避/u],
      ["time-mhx-bushido", "monster-hunter", /怪物猎人X.*武士道/u],
      ["difficulty-souls-no-hit", "dark-souls", /黑暗之魂.*无伤通关/u],
      ["nonclearing-dw-growth", "dynasty-warriors", /真三国无双.*角色养成/u]
    ] as const;

    for (const [id, gameId, subject] of expected) {
      expect(examplesById.get(id)?.gameId, id).toBe(gameId);
      expect(examplesById.get(id)?.subject, id).toMatch(subject);
    }
  });

  it("preserves Task 5 formulas, numerical qualifiers, and named references", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));
    const depth = entitiesById.get("depth-width-feedback-time");
    const time = entitiesById.get("time-precision");
    const animation = entitiesById.get("animation-readability");
    const cues = entitiesById.get("auxiliary-cues");
    const feedback = entitiesById.get("feedback-loops");
    const difficulty = entitiesById.get("external-rules-and-difficulty");
    const spectacle = entitiesById.get("spectacle-techniques");

    expect(depth?.bodyHtml).toMatch(/发生的情况总量\s*\/\s*反馈时间[\s\S]*蕴含的情况总量[\s\S]*对策与执行总量/u);
    expect(depth?.bodyHtml).toMatch(/外部规则空间\s*=\s*每一个发生的情况所能够造成的其他情况的总量/u);
    expect(depth?.editorialSynthesis).toMatch(/不是[\s\S]*科学公式|不是[\s\S]*普遍定律/u);

    expect(time?.bodyHtml).toMatch(/3\s*(?:至|～|—|-)\s*5\/30/u);
    expect(time?.bodyHtml).toMatch(/8\/30\s*=\s*0\.27\s*秒/u);
    expect(time?.bodyHtml).toMatch(/街头霸王5[\s\S]*8\s*(?:至|～|—|-)\s*10\/60/u);
    expect(time?.bodyHtml).toMatch(/来源作者[\s\S]*经验尺度[\s\S]*(?:不能|不是)/u);

    expect(animation?.examples.find(({ id }) => id === "readable-nameless")?.outcome).toMatch(/40%/u);
    expect(cues?.bodyHtml).toMatch(/死亡细胞[\s\S]*2\s*帧/u);
    expect(feedback?.bodyHtml).toMatch(/怪物猎人[\s\S]*15\s*(?:至|～|—|-)\s*30\s*分钟/u);
    expect(difficulty?.bodyHtml).toMatch(/连续击中\s*2\s*下[\s\S]*3\s*下/u);

    expect(animation?.bodyHtml).toMatch(/Mariel Cartwright[\s\S]*GDC/u);
    expect(spectacle?.bodyHtml).toMatch(/Squirrel Eiserloh[\s\S]*Jan Willem Nijman[\s\S]*(?:震屏|Screenshake)/u);
  });
});

describe("combat, Boss, detailed-case, and ledger migration", () => {
  it("has no unmapped source sections, examples, or media and only allowed exclusions", async () => {
    const ledger = parseCoverageLedger(JSON.parse(await readFile("content/coverage.json", "utf8")));
    const allowedDispositions = new Set(["duplicate", "contact-info", "search-method", "non-design"]);

    expect(ledger.version).toBe(1);
    expect(ledger.items.length).toBeGreaterThan(0);
    expect(new Set(ledger.items.map(({ id }) => id)).size).toBe(ledger.items.length);
    expect(ledger.items.filter(({ status }) => status === "unmapped")).toEqual([]);
    expect(ledger.items.filter(({ status, targets }) => status === "mapped" && targets.length === 0)).toEqual([]);
    expect(ledger.items.filter(({ status, targets, disposition }) =>
      status === "excluded" && (targets.length > 0 || !disposition || !allowedDispositions.has(disposition))
    )).toEqual([]);
    expect(ledger.items.filter(({ kind, status, targets }) =>
      (kind === "game-example" || kind === "media") && status === "mapped" && targets.length === 0
    )).toEqual([]);
  });

  it("keeps exactly the two remaining domains and every Task 6 entity", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));
    const domainIds = content.entities.filter(({ id }) => id.startsWith("domain-")).map(({ id }) => id).sort();

    expect(domainIds).toEqual([
      "domain-combat",
      "domain-enemy-boss",
      "domain-presentation",
      "domain-production-philosophy",
      "domain-system-depth",
      "domain-type-boundary"
    ]);
    expect(combatAndBossEntityIds.filter((id) => !entitiesById.has(id))).toEqual([]);
    expect(entitiesById.get("domain-combat")?.depth).toBe(1);
    expect(entitiesById.get("domain-enemy-boss")?.depth).toBe(1);
    expect(entitiesById.get("high-ai-vs-learnability")?.conflictType).toBe("goal");
  });

  it("indexes every combat and low-poise source scenario by stable example ID", async () => {
    const content = await loadContent("content");
    const examples = content.entities.flatMap(({ examples }) => examples);
    const examplesById = new Map(examples.map((example) => [example.id, example]));
    const gameIds = new Set(content.entities.filter(({ kind }) => kind === "game").map(({ id }) => id));
    const sourceIdSet = new Set(content.entities.filter(({ kind }) => kind === "source").map(({ id }) => id));

    expect(combatAndBossScenarioIds).toHaveLength(94);
    expect(new Set(examples.map(({ id }) => id)).size).toBe(examples.length);
    for (const [id, gameId] of combatAndBossScenarioIds) {
      expect(examplesById.get(id)?.gameId, id).toBe(gameId);
    }
    expect(examples.filter(({ gameId }) => !gameIds.has(gameId))).toEqual([]);
    expect(examples.filter(({ sourceIds }) => sourceIds.some((sourceId) => !sourceIdSet.has(sourceId)))).toEqual([]);
  });

  it("preserves the exact Vergil, Malenia, Isshin, and Genichiro qualifiers", async () => {
    const content = await loadContent("content");
    const examples = content.entities.flatMap(({ examples }) => examples);
    const examplesById = new Map(examples.map((example) => [example.id, example]));
    const lowPoise = content.entities.find(({ id }) => id === "low-poise-neutral");
    const vergil = examplesById.get("neutral-dmc3-vergil");
    const malenia = examplesById.get("neutral-elden-malenia");
    const isshin = examplesById.get("neutral-sekiro-isshin");
    const genichiro = examplesById.get("neutral-sekiro-genichiro-phase-3");

    expect(`${vergil?.mechanism} ${vergil?.outcome}`).toMatch(/13\s*hit/iu);
    expect(malenia?.mechanism).toMatch(/吸血/u);
    expect(malenia?.outcome).toMatch(/水鸟[\s\S]*神经刀[\s\S]*出手择[\s\S]*(?:combo|连段)[\s\S]*有意压低[\s\S]*人物性能/iu);
    expect(isshin?.outcome).toMatch(/不一定[\s\S]*遵循[\s\S]*思路/u);
    expect(genichiro?.subject).toMatch(/三阶段弦一郎/u);
    expect(`${genichiro?.mechanism} ${genichiro?.outcome}`).toMatch(/霸体人形[\s\S]*转防御[\s\S]*反击/u);
    expect(genichiro?.sourceIds).toEqual(["source-combat-approaches"]);
    expect(lowPoise?.bodyHtml).toMatch(/机制[\s\S]*吸血[\s\S]*招式[\s\S]*水鸟[\s\S]*神经刀[\s\S]*人物性能/u);
    expect(lowPoise?.bodyHtml).toMatch(/一心[\s\S]*不一定[\s\S]*遵循[\s\S]*三阶段弦一郎/u);
  });

  it("keeps the three action TPS examples source-neutral and positive AI applicability editorial", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));
    const tps = entitiesById.get("coop-musou-action-shooter-jrpg");
    const conflict = entitiesById.get("high-ai-vs-learnability");
    const tpsExamples = new Map(tps?.examples.map((example) => [example.id, example]));

    for (const id of ["shooter-gungrave", "shooter-bionic", "shooter-nelo"]) {
      const example = tpsExamples.get(id);
      const sourceText = `${example?.mechanism} ${example?.outcome}`;
      expect(sourceText, id).toMatch(/风格迥异[\s\S]*动作 TPS|动作 TPS[\s\S]*风格差异/u);
      expect(sourceText, id).toMatch(/未展开[\s\S]*具体机制/u);
      expect(sourceText, id).not.toMatch(/机械臂|高速[\s\S]*动作移动|角色动作感|机动路线|独立作品路线/u);
      expect(example?.sourceIds, id).toEqual(["source-act-classification-2"]);
    }
    expect(tps?.bodyHtml).toMatch(/动作 TPS[\s\S]*铳墓[\s\S]*生化尖兵[\s\S]*Nelo[\s\S]*展示不同[\s\S]*风格/u);

    const positive = conflict?.conflictSides?.[0];
    expect(positive?.conditions).toMatch(/^来源只说明模拟玩家性能与局部复刻 PVP 的设计初衷，没有给出正向适用条件。$/u);
    expect(positive?.conditions).not.toMatch(/可读|练习|稳定|边界/u);
    expect(positive?.sourceIds).toEqual(["source-low-poise-boss"]);
    expect(conflict?.editorialSynthesis).toMatch(/编者归纳[\s\S]*可识别边界[\s\S]*练习[\s\S]*稳定性[\s\S]*适用性推导[\s\S]*不属于来源/u);
  });

  it("makes every ledger target auditable against an entity, example, or media reference", async () => {
    const [content, ledgerText] = await Promise.all([
      loadContent("content"),
      readFile("content/coverage.json", "utf8")
    ]);
    const ledger = parseCoverageLedger(JSON.parse(ledgerText));
    const entityIds = new Set(content.entities.map(({ id }) => id));
    const exampleIds = new Set(content.entities.flatMap(({ examples }) => examples).map(({ id }) => id));
    const mediaTargets = new Set(content.entities.flatMap(({ media }) => media).map(({ src }) => `media:${src}`));
    const validTargets = new Set([
      ...entityIds,
      ...[...exampleIds].map((id) => `example:${id}`),
      ...mediaTargets
    ]);
    const invalidTargets = ledger.items
      .flatMap(({ id, targets }) => targets.map((target) => ({ id, target })))
      .filter(({ target }) => !validTargets.has(target));
    const sourceSections = ledger.items.filter(({ kind }) => kind === "source-section");
    const ledgerSourceIds = new Set(sourceSections.map(({ sourceId }) => sourceId));
    const gameExampleTargets = new Set(ledger.items
      .filter(({ kind, status }) => kind === "game-example" && status === "mapped")
      .flatMap(({ targets }) => targets.filter((target) => target.startsWith("example:"))));
    const allExampleTargets = [...exampleIds].map((id) => `example:${id}`);

    expect(invalidTargets).toEqual([]);
    expect([...sourceIds].filter((sourceId) => !ledgerSourceIds.has(sourceId))).toEqual([]);
    expect(combatAndBossScenarioIds
      .map(([id]) => `example:${id}`)
      .filter((target) => !gameExampleTargets.has(target))).toEqual([]);
    expect(allExampleTargets.filter((target) => !gameExampleTargets.has(target))).toEqual([]);
  });

  it("audits all 31 media exactly once and against the content references", async () => {
    const [content, ledgerText] = await Promise.all([
      loadContent("content"),
      readFile("content/coverage.json", "utf8")
    ]);
    const ledger = parseCoverageLedger(JSON.parse(ledgerText));
    const ledgerMedia = ledger.items.filter(({ kind, status }) => kind === "media" && status === "mapped");
    const ledgerTargets = ledgerMedia.flatMap(({ targets }) => targets);
    const contentTargets = content.entities.flatMap(({ media }) => media).map(({ src }) => `media:${src}`);

    expect(ledgerMedia).toHaveLength(31);
    expect(new Set(ledgerTargets).size).toBe(31);
    expect([...ledgerTargets].sort()).toEqual([...contentTargets].sort());
  });

  it("preserves round-based constraints, pseudo-equal criticisms, ARPG limits, and the Souls exception", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));
    const roundBased = entitiesById.get("round-based-humanoid");
    const pseudoEqual = entitiesById.get("pseudo-equal-humanoid");
    const soulsException = entitiesById.get("souls-low-poise-exception");
    const antiArmor = entitiesById.get("anti-armor-neutral");

    expect(roundBased?.bodyHtml).toMatch(/一直受击硬直[\s\S]*脱离[\s\S]*出招前[\s\S]*打断/u);
    expect(roundBased?.bodyHtml).toMatch(/破绽[\s\S]*稳定[\s\S]*识别[\s\S]*脱离/u);
    expect(pseudoEqual?.bodyHtml).toMatch(/自由态防硬直[\s\S]*出手时防硬直[\s\S]*基础破绽[\s\S]*脱离形式/u);
    expect(pseudoEqual?.bodyHtml).toMatch(/随机性[\s\S]*不可反应[\s\S]*学习成本[\s\S]*漏洞/u);
    expect(pseudoEqual?.bodyHtml).toMatch(/不适合[\s\S]*主流 ARPG[\s\S]*容错[\s\S]*仁王[\s\S]*中后期/u);
    expect(soulsException?.bodyHtml).toMatch(/出手[\s\S]*没有[\s\S]*过快[\s\S]*没有取消机制/u);
    expect(soulsException?.bodyHtml).toMatch(/玛莲妮亚[\s\S]*招式[\s\S]*机制/u);
    expect(antiArmor?.bodyHtml).toMatch(/输出奖励[\s\S]*后跳[\s\S]*输出机会/u);
  });

  it("models four source-complete detailed cases and links both sides of the high-AI conflict", async () => {
    const content = await loadContent("content");
    const entitiesById = new Map(content.entities.map((entity) => [entity.id, entity]));
    const caseIds = ["dmc4-dante", "bayonetta-jeanne", "ninja-gaiden-doppelganger", "nioh2-saito-toshimitsu"];
    const conflict = entitiesById.get("high-ai-vs-learnability");
    const conflictTargets = new Set(content.declaredEdges
      .filter(({ source }) => source === "high-ai-vs-learnability")
      .map(({ target }) => target));

    for (const id of caseIds) {
      const entity = entitiesById.get(id);
      expect(entity?.kind, id).toBe("case");
      expect(entity?.examples).toHaveLength(1);
      expect(entity?.citations.some(({ sourceId }) => sourceId === "source-low-poise-boss"), id).toBe(true);
      expect(entity?.editorialSynthesis, id).toMatch(/^编者归纳/u);
      expect(conflictTargets.has(id), id).toBe(true);
    }
    expect(entitiesById.get("dmc4-dante")?.bodyHtml).toMatch(/读指令[\s\S]*皇家护卫[\s\S]*强制[\s\S]*吹飞[\s\S]*AI 漏洞/u);
    expect(entitiesById.get("bayonetta-jeanne")?.bodyHtml).toMatch(/蝙蝠闪[\s\S]*上挑编织[\s\S]*不可反应[\s\S]*offset/u);
    expect(entitiesById.get("ninja-gaiden-doppelganger")?.bodyHtml).toMatch(/手里剑[\s\S]*断头摔[\s\S]*性能不对等[\s\S]*卖破绽/u);
    expect(entitiesById.get("nioh2-saito-toshimitsu")?.bodyHtml).toMatch(/呼子鸟[\s\S]*随机[\s\S]*精力[\s\S]*低精力压制/u);
    expect(conflict?.conflictSides).toHaveLength(2);
    expect(conflict?.conflictSides?.[0]?.claim).toMatch(/交互[\s\S]*镜像|对等[\s\S]*能力/u);
    expect(conflict?.conflictSides?.[1]?.claim).toMatch(/随机[\s\S]*读指令[\s\S]*不可反应[\s\S]*可学习/u);
    expect(conflict?.editorialSynthesis).toMatch(/编者归纳[\s\S]*不做[\s\S]*排名/u);
  });
});
