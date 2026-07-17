---
id: space-precision
kind: concept
title: 空间精度
aliases: [方位精度, 距离精度, 打点控制]
summary: 比较游戏要求玩家多精确地处理方向、距离、攻击轨迹、目标部位和三维地形。
domainIds: [domain-system-depth]
depth: 3
tags: [空间, 方位, 距离, 打点]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: control-precision }
  - { kind: related_to, target: camera-and-fov }
  - { kind: related_to, target: reaction-frequency }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.3.2 空间精度 }
media:
  - sourcePath: ../../动作游戏设计之难_assets/103957fk51ektj9te2j42p.gif
    src: media/103957fk51ektj9te2j42p.gif
    alt: 猎天使魔女的编织攻击和冲刺攻击自动追上远处目标
    caption: 原说明：《猎天使魔女》的编织攻击与冲刺攻击可从很远处命中；素材源自 yoshesque 的 Bayonetta Pure Platinum Explained。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../动作游戏设计之难_assets/103958ug878jjngcv5d44c.gif
    src: media/103958ug878jjngcv5d44c.gif
    alt: 怪物猎人X重弩手动瞄准岚龙头部射击
    caption: 原说明：《怪物猎人X》重弩锁头要求很高的操作精度；素材源自 TGBUS 电玩巴士的岚龙狩猎演示。
    kind: gif
    sourceId: source-action-design-difficulty
examples:
  - { id: space-hellblade, gameId: hellblade, subject: 地狱之刃, mechanism: 强制锁定、上步或原地两档距离、横纵攻击对应固定闪避方向, outcome: 来源认为几乎没有空间设计，作为低精度标尺, sourceIds: [source-action-design-difficulty] }
  - { id: space-bayonetta, gameId: bayonetta, subject: 猎天使魔女, mechanism: 万向翻滚、宽处决、自动追击和编织定位降低校准压力，同时保留形态和方向技表, outcome: 中等空间精度让玩家更专注攻防节奏但未完全放弃空间玩法, sourceIds: [source-action-design-difficulty] }
  - { id: space-old-gow, gameId: god-of-war, subject: 老战神, mechanism: 双链刃大范围自动覆盖方向, outcome: 来源将其列在更低空间精度一端, sourceIds: [source-action-design-difficulty] }
  - { id: space-dmc, gameId: devil-may-cry, subject: 鬼泣, mechanism: 保留方向技与武器范围，同时以强制锁定和拉取降低校准, outcome: 比老战神略高但仍属宽松空间控制, sourceIds: [source-action-design-difficulty] }
  - { id: space-bloodborne, gameId: bloodborne, subject: 血源诅咒, mechanism: 缺少距离吸附且 PVP 存在距离博弈, outcome: 来源认为空间要求高于猎天使魔女, sourceIds: [source-action-design-difficulty] }
  - { id: space-ng, gameId: ninja-gaiden, subject: 忍者龙剑传, mechanism: 飞燕、落地吸魂等高端操作要求位置和路线控制, outcome: 进一步提高空间执行要求, sourceIds: [source-action-design-difficulty] }
  - { id: space-mh, gameId: monster-hunter, subject: 怪物猎人, mechanism: 无距离/朝向吸附，肉质、体型、轨迹、动作值、弹道和地形共同决定打点, outcome: 来源把它作为高空间精度代表, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：原文高/中/低排序是作者的定性比较，且仅讨论 3D 游戏；辅助吸附不是“坏设计”，它把注意力预算让给其他轴。
---

## 低、中、高三档

《地狱之刃》以强锁定和有限位置响应作为低档参照。《猎天使魔女》用吸附、宽判定、自动追击和目标定位减轻负担，却仍保留猫/鸟形态、方向技、方向防御圣物、空地远打点和跳跃关卡。《怪物猎人》则把肉质、部位、体型、运动、武器轨迹、浮动动作值、弹道与高低差都放进打点控制。

## 频率与空间的互补

来源认为，高反应频率作品通常减少空间校准，让玩家把注意力放在技表和变招；低频作品可提高空间精度增加深度。PVP 也会放大玩家距离控制差异。这个倾向不是互斥规则，《猎天使魔女》保留的空间动作就是反例。

## 设计风险

时间窗口可以围绕反应经验反复测试，空间精度却缺少同样明确的标尺。来源把优秀空间设计归因于长时间迭代和玩家群体反馈，这也是作者经验判断，不应理解成只有老系列才能做好空间玩法。
