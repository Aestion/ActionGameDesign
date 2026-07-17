---
id: invulnerable-suppression
kind: concept
title: 无敌与半无敌压制
aliases: [无敌压制, 资源循环强攻]
summary: 玩家通过时停、伤害吸收、隐身或半无敌状态绕过敌方攻势，并以资源循环延长压制。
domainIds: [domain-combat]
depth: 3
tags: [压制, 无敌, 时停, 资源循环]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: suppression }
  - { kind: related_to, target: feedback-loops }
citations:
  - { sourceId: source-combat-approaches, locator: 二、压制／⑤ 自身进入无敌或半无敌状态 }
media: []
examples:
  - { id: invulnerable-bayonetta3-clock-tower, gameId: bayonetta, subject: 猎天使魔女 3 钟楼压制罗丹, mechanism: 时停期间回复魔力，使资源支出与补充形成循环, outcome: 可让罗丹长时间被固定在魔女时间中, sourceIds: [source-combat-approaches] }
  - { id: invulnerable-scarlet-nexus-sas, gameId: scarlet-nexus, subject: 绯红结系 SAS 循环, mechanism: 超加速、硬质化和透明化配合念力追击、处决、脑驱动刷新与脑内空间重置冷却, outcome: 通过时停、吸收、隐身和半无敌资源循环碾过 Boss, sourceIds: [source-combat-approaches] }
editorialSynthesis: 编者归纳：此路线不是让敌人进入硬直，而是让敌人的行动暂时失去意义；资源再生与冷却重置决定它是爆发窗口还是持续压制。
---

## 来源观点

前四类压制依赖敌人进入硬直、浮空、倒地或空资源状态；无敌/半无敌压制则改变玩家自身，使其无视敌方攻势强攻。此类状态通常消耗资源，但若能在状态中回资源或刷新冷却，就可能形成持续循环。

## 条件与风险

时停、伤害吸收和隐身并非同一种防御，但都降低敌人行动的实际影响。设计时需要明确资源能否在压制期回复、刷新条件和 Boss 免疫，否则短期奖励可能扩展为整场无交互。
