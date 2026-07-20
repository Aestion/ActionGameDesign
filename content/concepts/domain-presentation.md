---
id: domain-presentation
kind: concept
title: 动作表现与可读性
aliases: [表现与可读性, 动作演出]
summary: 从直观经验出发，用相机、动画、辅助提示和演出技巧平衡动作功能传达与视觉欣赏。
domainIds: []
depth: 1
tags: [一级知识域, 可读性, 观赏性]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: parent_of, target: intuitive-experience }
  - { kind: parent_of, target: camera-and-fov }
  - { kind: parent_of, target: animation-readability }
  - { kind: parent_of, target: auxiliary-cues }
  - { kind: parent_of, target: spectacle-techniques }
  - { kind: parent_of, target: readability-priority-principles }
  - { kind: parent_of, target: training-and-depth }
  - { kind: parent_of, target: time-precision }
  - { kind: conflicts_with, target: readability-vs-spectacle }
citations:
  - { sourceId: source-action-design-difficulty, locator: 2.2 受到人的直观感觉的约束；4 动作游戏与直观经验；4.1 至 4.3 }
media: []
examples:
  - { id: presentation-mh, gameId: monster-hunter, subject: 怪物猎人世界龙吼, mechanism: 用剪影、全身动势、特征帧和准备时长形成不同可读性, outcome: 相近功能的三个动作仍能呈现显著不同的应对难度, sourceIds: [source-action-design-difficulty] }
  - { id: presentation-nier, gameId: nier, subject: 尼尔机械纪元动作, mechanism: 短预期、长缓出、弧线与高速取消兼顾优雅和响应, outcome: 某些回避攻击又因角色轮廓消失牺牲可读性, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：本域保留来源作者“先满足可读性”的倾向，同时单列其明确例外——可读性可由训练部分补回，特定体验也可能有条件地优先观赏性。
---

## 核心定义

可读性是综合表现能多准确地传达动作所指示的游戏功能；观赏性是专供审美欣赏的部分。相机决定看见什么，动画决定动作轮廓与趋势，UI/音效在动画不足时补充提示，时间、震屏和特写则强化视觉节奏与力量。

## 直观约束

人长期积累空间运动、四肢、重力、表情等经验，常能立刻感到不自然却说不出原因。来源作者因此尝试用 FOV、剪影、动势、特征帧、预备动作、缓入缓出和弧线等词汇，把直观判断转成可讨论语言。

## 设计边界

来源不是动画/特效制作规范，也多次承认作者并非动画师、相关内容只作科普。十二原则和经验帧数是观察入口；角色性格、情绪、演技、特效、表情与 UI 还有大量未展开空间。

## 编者归纳

判断表现不宜只问“好不好看”。更具体的问题是：玩家是否看得到关键对象、能否识别功能、提示是否与窗口匹配、演出是否破坏方向感，以及训练后低读性是否会转化为有意义的技巧。
