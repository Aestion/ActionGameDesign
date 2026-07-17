---
id: action-adventure
kind: concept
title: 动作冒险及六种战斗模式
aliases: [AAVG, Action Adventure, 剧情驱动动作冒险]
summary: 以剧情、探索、解谜、攀爬或潜入扩展动作战斗，并形成六种常见战斗模式的融合类型。
domainIds: [domain-type-boundary]
depth: 2
tags: [AAVG, 动作冒险, 类型分支]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: contrasts_with, target: traditional-act }
  - { kind: contrasts_with, target: souls-framework }
  - { kind: conflicts_with, target: action-depth-vs-content-breadth }
citations:
  - { sourceId: source-act-classification-2, locator: 二、剧情驱动的动作冒险游戏，①至⑥ }
  - { sourceId: source-act-classification-1, locator: 二、普遍认知的 ACT }
media: []
examples:
  - { id: aavg-history-wolfenstein, gameId: wolfenstein, subject: 德军总部, mechanism: 早期第一人称 3D 射击, outcome: 作为 3D 动作类型分化的历史参照, sourceIds: [source-act-classification-2] }
  - { id: aavg-history-doom, gameId: doom, subject: DOOM, mechanism: 早期第一人称 3D 射击, outcome: 作为 3D 动作类型分化的历史参照, sourceIds: [source-act-classification-2] }
  - { id: aavg-history-mario64, gameId: super-mario, subject: 马里奥 64, mechanism: 3D 平台跳跃, outcome: 代表不同于 AAVG 战斗的 3D 动作路径, sourceIds: [source-act-classification-2] }
  - { id: aavg-history-tomb-raider, gameId: tomb-raider, subject: 古墓丽影, mechanism: 3D 探索、解谜和射击, outcome: 奠定美式冒险框架, sourceIds: [source-act-classification-2] }
  - { id: aavg-history-zelda, gameId: the-legend-of-zelda, subject: 塞尔达时之笛, mechanism: 3D 即时战斗、探索和成长, outcome: 代表早期 ARPG 路径, sourceIds: [source-act-classification-2] }
  - { id: aavg-gow-prince, gameId: prince-of-persia, subject: 波斯王子：时之沙, mechanism: 动作战斗与大量攀爬、解谜、探索结合, outcome: 构成类战神 AAVG 的始祖框架, sourceIds: [source-act-classification-2] }
  - { id: aavg-gow-god, gameId: god-of-war, subject: 战神, mechanism: 派生出招、魔法资源与强流程演出, outcome: 集大成并引来大量模仿, sourceIds: [source-act-classification-2] }
  - { id: aavg-gow-darksiders, gameId: darksiders, subject: 暗黑血统, mechanism: 类战神战斗配合探索解谜, outcome: 复用成熟 AAVG 风险较低, sourceIds: [source-act-classification-2] }
  - { id: aavg-gow-castlevania, gameId: castlevania, subject: 恶魔城：暗影之王, mechanism: 类战神派生和线性流程, outcome: 以既有框架承载系列题材, sourceIds: [source-act-classification-2] }
  - { id: aavg-gow-heavenly, gameId: heavenly-sword, subject: 天剑, mechanism: 线性类战神战斗与演出, outcome: 动作深度让位于流程整体, sourceIds: [source-act-classification-2] }
  - { id: aavg-gow-dante, gameId: dantes-inferno, subject: 但丁地狱, mechanism: 类战神动作与资源能力, outcome: 采用成熟商业框架, sourceIds: [source-act-classification-2] }
  - { id: aavg-gow-wolverine, gameId: x-men-origins-wolverine, subject: 金刚狼, mechanism: 连招和资源能力服务线性流程, outcome: 漫改内容借类战神结构落地, sourceIds: [source-act-classification-2] }
  - { id: aavg-magnet-batman, gameId: batman-arkham, subject: 蝙蝠侠：阿卡姆, mechanism: 强自动锁定、远距离吸附与简化输入, outcome: 形成半自动表演式 1vN 框架, sourceIds: [source-act-classification-2] }
  - { id: aavg-magnet-spider, gameId: marvels-spider-man, subject: 蜘蛛侠系列, mechanism: 吸附式近战混合特殊连击和道具, outcome: 通用框架由角色能力扩展, sourceIds: [source-act-classification-2] }
  - { id: aavg-magnet-middle, gameId: middle-earth-shadow, subject: 中土世界, mechanism: 吸附反击式群战混合特殊能力, outcome: 强化表演性与易用性, sourceIds: [source-act-classification-2] }
  - { id: aavg-magnet-remember, gameId: remember-me, subject: 勿忘我, mechanism: 吸附近战与特殊连击, outcome: 用额外机制补充简化基础操作, sourceIds: [source-act-classification-2] }
  - { id: aavg-simple-ac, gameId: assassins-creed, subject: 早期刺客信条, mechanism: 少量基础攻击、闪防配合潜入攀爬, outcome: 以沉浸和流程替代复杂动作，后续再从机制扩展, sourceIds: [source-act-classification-2] }
  - { id: aavg-simple-ryse, gameId: ryse-son-of-rome, subject: 罗马之子, mechanism: 简单攻防与 QTE 处决, outcome: 操作简明但营造真实战斗感, sourceIds: [source-act-classification-2] }
  - { id: aavg-simple-hellblade, gameId: hellblade, subject: 地狱之刃, mechanism: 简易近战服务叙事与沉浸, outcome: 长期重复时可能显得单调, sourceIds: [source-act-classification-2] }
  - { id: aavg-simple-tsushima, gameId: ghost-of-tsushima, subject: 对马岛之魂, mechanism: 不显著增加操作复杂度而增加架势与情境机制, outcome: 以机制丰富化回应单一战斗, sourceIds: [source-act-classification-2] }
  - { id: aavg-power-prototype, gameId: prototype, subject: 虐杀原形, mechanism: 简单近战混合易释放超能力, outcome: 开放世界战斗强调自由与想象力, sourceIds: [source-act-classification-2] }
  - { id: aavg-power-infamous, gameId: infamous, subject: 声名狼藉, mechanism: 超能力与开放世界机动结合, outcome: 用能力组合丰富基础动作, sourceIds: [source-act-classification-2] }
  - { id: aavg-power-gravity, gameId: gravity-rush, subject: 重力异想少女, mechanism: 重力超能力改变移动和攻击, outcome: 将机制广度转成战斗差异, sourceIds: [source-act-classification-2] }
  - { id: aavg-power-saints, gameId: saints-row, subject: 黑道圣徒, mechanism: 开放世界动作混合夸张超能力, outcome: 以系统玩具增加自由度, sourceIds: [source-act-classification-2] }
  - { id: aavg-street-yakuza, gameId: yakuza, subject: 如龙, mechanism: 街头肉搏与城市剧情内容结合, outcome: 沉浸和角色塑造优先于硬核类格斗深度, sourceIds: [source-act-classification-2] }
  - { id: aavg-street-shenmue, gameId: shenmue, subject: 莎木, mechanism: 开放城市探索与格斗结合, outcome: 为如龙式结构提供精神谱系, sourceIds: [source-act-classification-2] }
  - { id: aavg-street-judgment, gameId: judgment, subject: 审判系列, mechanism: 在如龙城市框架中改进动作系统, outcome: 与回合制如龙路线形成分叉, sourceIds: [source-act-classification-2] }
  - { id: aavg-street-sleeping, gameId: sleeping-dogs, subject: 热血无赖, mechanism: 街头肉搏、械斗和环境处决, outcome: 以城市沉浸承载动作, sourceIds: [source-act-classification-2] }
  - { id: aavg-street-akiba, gameId: akibas-trip, subject: 秋叶原之旅, mechanism: 城市场景中的街头群战, outcome: 题材与剧情内容构成主要差异, sourceIds: [source-act-classification-2] }
  - { id: aavg-fpa-dying, gameId: dying-light, subject: 消逝的光芒, mechanism: 第一人称近战配合跑酷战术, outcome: 用机制而非夸张翻转动作增加乐趣, sourceIds: [source-act-classification-2] }
  - { id: aavg-fpa-dishonored, gameId: dishonored, subject: 耻辱, mechanism: 第一人称近战、潜行与超能力混合, outcome: 丰富机制弥补视角对动作多样性的限制, sourceIds: [source-act-classification-2] }
  - { id: aavg-fpa-vermin, gameId: vermintide, subject: 末世鼠疫, mechanism: 第一人称近战与合作职业机制, outcome: 视角代入与机制组合主导体验, sourceIds: [source-act-classification-2] }
  - { id: aavg-other-colossus, gameId: shadow-of-the-colossus, subject: 旺达与巨像, mechanism: 攀爬与解谜化巨像战斗, outcome: 说明仍有无法归入六类的独特 AAVG, sourceIds: [source-act-classification-2] }
editorialSynthesis: 编者归纳：六类描述战斗实现惯性，不是地图结构的同义词；线性/开放世界和六种战斗模式应作为两条维度分别观察。
---

## 核心定义

动作冒险由剧情驱动，并常加入探索、解谜、攀爬、潜入乃至 RPG 成长。它可偏探索或偏战斗、偏射击或偏动作；这里讨论偏战斗的动作型 AAVG。线性与开放/半开放世界是流程维度，不直接等同于某一种战斗系统。

来源作者推测，成功作品带来的行业模仿会让相同流程模式使用相近战斗方案，从而降低商业风险。这是作者推测，不是已证实的因果规律。

## 历史框架

《德军总部》《DOOM》《马里奥 64》《古墓丽影》《塞尔达时之笛》分别展示早期 3D FPS、平台、探索射击和 ARPG 路径。《波斯王子：时之沙》继承类似《古墓丽影》的探索框架，再将动作战斗与攀爬解谜结合，为动作型 AAVG 建立基础。

## ① 类战神

派生出招加魔法等资源管理，但不把动作系统继续推到传统 ACT 的深度，而把投入放在地图、解谜、攀爬和剧情演出。《波斯王子：时之沙》是始祖参照，《战神》集大成；《暗黑血统》《恶魔城：暗影之王》《天剑》《但丁地狱》《金刚狼》等沿用。新《战神》改为越肩视角、取消跳跃并强化 RPG，但基本战斗/流程思路与老作连续。

## ② 磁铁吸附式

《蝙蝠侠：阿卡姆》把 1vN 自动锁定做成强吸附：角色可跨较远距离自动贴近目标，输入简化、表演性强。《蜘蛛侠》《中土世界》《勿忘我》等在此基础上用特殊连击、道具或角色能力补充趣味。

## ③ 简易化近战

《刺客信条》早期、《罗马之子》《地狱之刃》用少量攻、闪、防，着重 QTE、叙事、攀爬和探索。简单操作有沉浸优势，长期则易单调；后续《刺客信条》和《对马岛之魂》更多从情境机制而非输入复杂度扩展。

## ④ 混合超能力

《虐杀原形》《声名狼藉》在简单近战上加入易释放超能力，以开放世界的自由组合弥补动作专长不足；《重力异想少女》《黑道圣徒》也是机制扩展例。

## ⑤ 街头肉搏与械斗

《如龙》承接《莎木》的城市生活/叙事框架，以街头肉搏营造沉浸而非追求《神之手》式硬核类格斗。《审判》深化动作，与转为回合制 RPG 的《如龙 7》形成两条路线；《热血无赖》《秋叶原之旅》是相近例子。

## ⑥ 第一人称动作

第一人称增强代入，却不适合大量翻转腾挪，限制动作外形多样性。《消逝的光芒》以跑酷、《耻辱》以超能力和潜行、《末世鼠疫》以合作职业机制扩展战斗。它与动作 FPS 可重叠，但“以近战/机制为核心的第一人称动作”和“动作化射击”不是同一概念。

## 条件与反例

《旺达与巨像》的解谜化战斗难归六类，证明分类不穷举。AAVG 是否“偏动作”仍取决于战斗要素占比和设计投入，不能由是否线性或是否开放世界单独决定。
