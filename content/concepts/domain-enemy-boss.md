---
id: domain-enemy-boss
kind: concept
title: 敌人与 Boss 设计
aliases: [Boss 设计, 敌人设计]
summary: 以韧性、攻防回合、拟似对等 AI、脱离、资源和流程约束组织敌人与 Boss 的互动。
domainIds: []
depth: 1
tags: [一级知识域, Boss, 敌人AI]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: parent_of, target: boss-poise-taxonomy }
  - { kind: parent_of, target: round-based-humanoid }
  - { kind: parent_of, target: pseudo-equal-humanoid }
  - { kind: parent_of, target: souls-low-poise-exception }
  - { kind: parent_of, target: fixed-sequence }
  - { kind: parent_of, target: anti-armor-neutral }
  - { kind: parent_of, target: low-poise-neutral }
  - { kind: parent_of, target: wakeup-and-resource-suppression }
  - { kind: related_to, target: enemy-attack-allocation }
  - { kind: related_to, target: domain-combat }
  - { kind: conflicts_with, target: high-ai-vs-learnability }
citations:
  - { sourceId: source-low-poise-boss, locator: 概述；一、Boss 类别；二至五 }
  - { sourceId: source-combat-approaches, locator: 一、立回；五、固定流程 }
media: []
examples: []
editorialSynthesis: 编者归纳：韧性只是入口；真正决定体验的是出手保护、破绽稳定性、脱离可读性、AI 随机性和玩家能否建立第二层目标。
---

## 来源观点

“低韧性 Boss”没有绝对定义。来源用它指相对于常驻霸体、只能靠少数高削韧招式或数值积累才硬直的 Boss：多为人形，普通攻击能造成硬直，但时机可能受限。作者认为绝大多数低韧 Boss 底层仍偏攻防回合，真正机制对等的高 AI Boss 很少。

## 分析轴

本域先按五类 Boss 框架定位战斗，再深入比较回合制低韧与拟似对等低韧。重点不是把“高 AI”当作质量排名，而是检查自由态防硬直、出手保护、基础破绽、脱离、随机性、学习成本和受众条件。

## 与战斗思路的关系

同一 Boss 会同时涉及立回、断招、压制、资源和定番。固定流程型甚至不以常规韧性互动为主，因此韧性分类不能替代完整的战斗流程分析。
