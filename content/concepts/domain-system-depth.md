---
id: domain-system-depth
kind: concept
title: 复合决策与系统深度
aliases: [系统深度, 复合型决策]
summary: 从反应频率、操控精度与外部规则三个方向拆解动作游戏如何组织复合决策、难度和动态。
domainIds: []
depth: 1
tags: [一级知识域, 系统深度, 决策]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: parent_of, target: compound-decisions }
  - { kind: parent_of, target: depth-width-feedback-time }
  - { kind: parent_of, target: reaction-frequency }
  - { kind: parent_of, target: control-precision }
  - { kind: parent_of, target: external-rules-and-difficulty }
  - { kind: parent_of, target: feedback-loops }
  - { kind: parent_of, target: clearing-and-non-clearing }
  - { kind: parent_of, target: action-external-interoperation }
  - { kind: conflicts_with, target: difficulty-sources }
citations:
  - { sourceId: source-action-design-difficulty, locator: 2.1 先天的高度复合型决策设计；3 动作游戏与复合型决策 }
media:
  - sourcePath: ../../动作游戏设计之难_assets/103949bhlivcuahomevxlx.jpg
    src: media/103949bhlivcuahomevxlx.jpg
    alt: 猎天使魔女角色与敌人构成的红蓝对照宣传图
    caption: 原文开篇配图，原文未另附说明；画面以《猎天使魔女》的角色、武器与敌人作为动作游戏主题视觉。
    kind: image
    sourceId: source-action-design-difficulty
examples:
  - { id: system-depth-bayonetta, gameId: bayonetta, subject: 猎天使魔女, mechanism: 高频攻防、技表、敌群出手分配和外部资源共同构成复合决策, outcome: 同一输入同时携带范围、帧数、派生、攻防和资源信息, sourceIds: [source-action-design-difficulty] }
  - { id: system-depth-mh, gameId: monster-hunter, subject: 怪物猎人, mechanism: 低反应频率配合高空间精度、肉质、装备和反馈循环, outcome: 说明慢速动作也可形成可长期钻研的系统, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：本域把原文的一套个人分析框架拆成可互查节点；公式和分档均保留为作者用于观察案例的模型，不作为跨游戏的普遍定律或精确测量尺度。
---

## 核心定义

动作游戏的一次按键常不是单一选择，而会同时确定攻击范围、帧数、伤害、派生、打断、浮空、攻防状态与资源变化。玩家和敌人需要许多这种打包选项，系统还要兼顾博弈、可能空间与学习曲线，因此形成高度复合的设计问题。

## 分析入口

来源作者先以“宽度与反馈时间”解释深度，再把动作游戏中的信息处理拆为反应频率、操控精度与外部规则空间。后续的难度、正负反馈、清版结构和内外规则互通，都是对这三个入口的展开。

## 条件与边界

- 复合决策并非动作游戏独有；原文也明确提到其他游戏和博弈论。
- 动作游戏的选择常高度集成，并受到物理与人体直观约束，因而可能空间未必像大规则系统那样宽。
- 本域讨论设计关系，不覆盖原文略去的工程流程、迭代周期、市场动力等外部问题。

## 编者归纳

这里不以单一“深度分数”给游戏排序。更有用的做法是分别说明反应密度、时空与指令要求、规则后果，以及它们在特定目标和受众下如何组合。
