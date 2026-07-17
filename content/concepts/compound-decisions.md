---
id: compound-decisions
kind: concept
title: 高度复合型决策
aliases: [复合决策, 复合选项]
summary: 动作输入把范围、帧数、伤害、派生、攻防状态和资源变化打包成一个最小操作与反馈单位。
domainIds: [domain-system-depth]
depth: 2
tags: [决策, 输入, 反馈]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-system-depth }
  - { kind: related_to, target: depth-width-feedback-time }
  - { kind: related_to, target: action-external-interoperation }
citations:
  - { sourceId: source-action-design-difficulty, locator: 2.1 先天的高度复合型决策设计；3 动作游戏与复合型决策 }
media: []
examples:
  - { id: compound-dmc, gameId: devil-may-cry, subject: 鬼泣的单次攻击输入, mechanism: 输入同时决定动作帧数、范围、伤害、连段派生、浮空和评价资源, outcome: 选择价值不能只用伤害高低概括, sourceIds: [source-action-design-difficulty] }
  - { id: compound-nioh, gameId: nioh, subject: 仁王的攻击与残心, mechanism: 攻击消耗精力，动作后时机输入又改变精力恢复和后续进攻, outcome: 动作执行与外部资源在一个决策链内互相影响, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者解释：把复合选项拆字段是为了比较，不代表玩家在实战中会逐项进行显式计算。
---

## 核心定义

来源作者认为，动作游戏的最小操作/反馈单位往往已经高度集成。基础信息有攻击范围、攻击帧数和攻击力；更复杂时还会涉及连段、派生、打断、异常、浮空、免伤/霸体/无敌、破招关系，以及资源消耗和补充。

## 设计问题

只增加动作数量不等于建立复杂系统。玩家与敌人的选项还要形成足够丰富又可理解的相互作用，并满足特定产品所追求的均衡、可能空间和学习曲线。一个招式在多个维度都优于其他招式，会压缩真实决策；差异很多却没有产生可区分情境，也可能被玩家归并为“都一样”。

## 条件与限定

- 复合决策存在于许多游戏类型，动作游戏不是专属拥有者。
- 动作中的信息由表现、规则和玩家训练共同传达；字段表只是分析语言。
- 原文把工程执行和市场问题明确排除在本文分析之外，不能由本节点推导“动作游戏只难在决策设计”。

## 来源观点与编者解释

“高度复合”是来源作者对动作输入的概括；将它拆成可检索字段是编者解释，不是新增的普遍设计定律。
