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
  - { id: conflict-difficulty-souls, gameId: dark-souls, subject: 黑暗之魂 Boss, mechanism: 单次受击高伤、整体容错低，死亡后重试, outcome: 在反应频率和操控精度不变时，低容错与高惩罚仍会降低达成率并要求重试, sourceIds: [source-action-design-difficulty] }
  - { id: conflict-difficulty-ng, gameId: ninja-gaiden, subject: 忍者龙剑传高频战斗, mechanism: 敌我出手快、威胁密集并要求连续精确回应, outcome: 失败更容易归因于反应和执行，掌握后能直接改变战斗表现, sourceIds: [source-action-design-difficulty] }
  - { id: conflict-difficulty-mh, gameId: monster-hunter, subject: 怪物猎人, mechanism: 低频动作配高空间精度、长目标与资源约束, outcome: 证明两类来源可在一款游戏中混合，不能严格二分, sourceIds: [source-action-design-difficulty] }
conflictType: condition
conflictSides:
  - label: 反应频率与操控精度形成挑战
    claim: 来源作者主张，针对动作游戏，若要提高难度最好从反应频率和操控精度入手，使失败更容易归因于玩家并进入失败—学习—掌握—成功。
    conditions: 给定目标不变，提高反应频率或操控精度都会提高难度；来源同时指出不同玩家对操控精度的耐受不同，Sweet Spot 很复杂。
    sourceIds: [source-action-design-difficulty]
  - label: 低容错、高惩罚与目标长度形成难度
    claim: 在反应频率和操控精度不变时，外部规则通过增加综合目标所需成功反应次数、降低容错或提高单次失败惩罚来降低达成率。
    conditions: 反应频率与操控精度保持不变、只改变血量、伤害、允许失败次数或目标长度时成立；来源认为玩家一般不喜欢单靠外部规则加难，游戏也不会因此自动更有趣。
    sourceIds: [source-action-design-difficulty]
editorialSynthesis: 编者归纳：两种机制并不互斥；实际遭遇可同时改变动作要求、目标长度、容错与惩罚。是否服务沉浸、资源规划、探索压力或耐久目标属于本图谱的适用性推导，不是来源作者在这张冲突卡中给出的第二套主张；本卡不把其偏好升级为普遍排名。
---

## 争议问题

让动作游戏更难，应提高玩家每次回应的速度/精度，还是通过血量、伤害、容错和惩罚改变综合目标？

## 来源立场

来源作者偏好前者，认为失败更容易进入“失败—学习—掌握—成功”；同时承认玩家精度耐受不同，合适失败点难以确定。作者认为单纯外部规则变难通常不自动更有趣；《黑暗之魂》的例子把 Boss 高伤视为高惩罚、低容错，并指出在完成全游戏的尺度上，篝火和捷径会降低小目标失败的惩罚。

## 混合条件

Boss 血量、伤害、阶段和资源会改变压力与学习；高频攻击也可能同时高伤。《怪物猎人》把低频、高空间精度、长战斗和外部准备混合。因而本卡区分主要因果入口，不把作品硬分成两类。
