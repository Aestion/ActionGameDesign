---
id: depth-width-feedback-time
kind: concept
title: 深度、宽度与反馈时间
aliases: [深度公式, 可能空间与反馈时间, Skill Ceiling]
summary: 来源作者用宽度、信息蕴含、对策数量和反馈时间构成简化模型，以解释玩家处理复杂信息的速度。
domainIds: [domain-system-depth]
depth: 2
tags: [深度, 宽度, 反馈时间, 来源模型]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-system-depth }
  - { kind: related_to, target: reaction-frequency }
  - { kind: related_to, target: control-precision }
  - { kind: related_to, target: external-rules-and-difficulty }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.1 深度；3.1.1 深度与宽度；3.1.2 动作游戏中的深度 }
media: []
examples:
  - { id: depth-osu, gameId: osu, subject: osu! 与 osu!mania, mechanism: 高密度节奏输入压缩反馈时间；点击模式用一部分指令维度交换空间精度, outcome: 较窄的基础规则仍能产生很高的信息处理要求, sourceIds: [source-action-design-difficulty] }
  - { id: depth-mh-slow, gameId: monster-hunter, subject: 怪物猎人的慢速系统, mechanism: 低反应频率与高空间精度、外部规则和长期学习结合, outcome: 反驳“动作越快才越深”的单轴判断, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：这些等式应读作来源作者的概念关系图，而不是可跨作品代入数值、计算客观排名的科学公式。
---

## 来源作者的简化模型

为区分“加深”与“加宽”，来源作者提出：

> 深度 = 宽度 / 反馈时间

并把动作游戏中“发生了什么—会怎么样—该怎么办”的处理过程继续拆为：

> 深度 = 发生的情况总量 × 蕴含的情况总量 × 对策与执行总量 / 反馈时间

原文随后将三个部分命名为反应频率、外部规则空间和操控精度。以上是作者为了梳理个人经验而使用的“简单粗暴”“民科式”模型；本图谱不把它们宣称为普遍定律，也不把乘法视为已验证的量纲关系。

## 宽度与速度

来源把宽度理解为系统可能呈现的情况总量，并以卡牌新机制说明规则增加可扩大宽度；音乐游戏则说明规则很窄但反馈时间极短仍可产生深度。作者还把 Probability Space 与宽度、Skill Ceiling 与深度近似对应。这些等价关系保留为作者口径，而不是行业统一定义。

来源认为动作游戏受复合输入和直观约束，宽度常偏小，因而更多用及时、准确回应来形成区分度。但《怪物猎人》等低频案例表明，反馈时间只是多轴之一。

## 限定与反例

- “宽度变大且反馈时间不变，深度随之增加”只描述作者模型内部关系。
- 技巧天花板、系统复杂度、难度与学习时长相互相关但不是同义词。
- 玩家通过训练形成直观后，原先需要推理的信息可以更快处理，因此深度/难度会随学习进程而变化。
