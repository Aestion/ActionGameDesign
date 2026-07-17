---
id: difficulty-sources
kind: conflict
title: 动作挑战与外部规则难度
aliases: [反应精度 vs 低容错高惩罚, 难度来源冲突]
summary: 相同的低达成率既可来自更快更准的操作要求，也可来自更长目标、更低容错和更高失败惩罚，两者的学习归因不同。
domainIds: [domain-system-depth]
depth: 3
tags: [冲突卡, 条件差异, 难度]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: conflicts_with, target: reaction-frequency }
  - { kind: conflicts_with, target: control-precision }
  - { kind: conflicts_with, target: external-rules-and-difficulty }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.4.1 关于难度；小结 }
media: []
examples:
  - { id: conflict-difficulty-souls, gameId: dark-souls, subject: 黑暗之魂 Boss, mechanism: 单次受击高伤、整体容错低，死亡后重试, outcome: 在动作频率和精度不极端时仍可产生高失败率与沉浸压力, sourceIds: [source-action-design-difficulty] }
  - { id: conflict-difficulty-ng, gameId: ninja-gaiden, subject: 忍者龙剑传高频战斗, mechanism: 敌我出手快、威胁密集并要求连续精确回应, outcome: 失败更容易归因于反应和执行，掌握后能直接改变战斗表现, sourceIds: [source-action-design-difficulty] }
  - { id: conflict-difficulty-mh, gameId: monster-hunter, subject: 怪物猎人, mechanism: 低频动作配高空间精度、长目标与资源约束, outcome: 证明两类来源可在一款游戏中混合，不能严格二分, sourceIds: [source-action-design-difficulty] }
conflictType: condition
conflictSides:
  - label: 反应频率与操控精度形成挑战
    claim: 通过更密集的可回应事件、更窄时机、更精确方位距离或更丰富指令，提高单次和连续操作的信息处理要求。
    conditions: 适合希望失败能稳定归因于观察、选择和执行，并能通过练习直接掌握的动作挑战；必须考虑不同玩家对精度的耐受与提示质量。
    sourceIds: [source-action-design-difficulty]
  - label: 低容错、高惩罚与目标长度形成难度
    claim: 在单次反应要求不变时，用更多必需成功次数、更少允许失败次数、更高伤害或死亡重试降低目标达成率。
    conditions: 适合强调风险、沉浸、资源规划、探索压力或耐久目标；若只有血量和伤害增长，玩家可能不认为它增加了有趣的动作深度。
    sourceIds: [source-action-design-difficulty]
editorialSynthesis: 编者归纳：这是来源口径内的条件差异，不是两类互斥配方；实际遭遇常同时改变动作、规则、压力和学习。冲突卡不为难度来源做高低排名。
---

## 争议问题

让动作游戏更难，应提高玩家每次回应的速度/精度，还是通过血量、伤害、容错和惩罚改变综合目标？

## 来源立场

来源作者偏好前者，认为失败更容易进入“失败—学习—掌握—成功”；同时承认玩家精度耐受不同，合适失败点难以确定。作者认为单纯外部规则变难通常不自动更有趣，但《黑暗之魂》的高风险也服务沉浸，并通过篝火、捷径和成长调节更大尺度的惩罚。

## 混合条件

Boss 血量、伤害、阶段和资源会改变压力与学习；高频攻击也可能同时高伤。《怪物猎人》把低频、高空间精度、长战斗和外部准备混合。因而本卡区分主要因果入口，不把作品硬分成两类。
