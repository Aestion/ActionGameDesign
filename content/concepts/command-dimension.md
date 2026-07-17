---
id: command-dimension
kind: concept
title: 指令维度
aliases: [指令空间, 决策与执行, 技表维度]
summary: 把事件发生时可选的对策数量与执行这些指令的难度分开观察。
domainIds: [domain-system-depth]
depth: 3
tags: [指令, 决策, 执行, 技表]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: control-precision }
  - { kind: related_to, target: compound-decisions }
  - { kind: related_to, target: reaction-frequency }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.2.2 主动反应频率的控制；3.3.3 指令维度；3.3.4 其他类型游戏中的操控精度与深度 }
media: []
examples:
  - { id: command-osu-modes, gameId: osu, subject: osu!mania 与 osu! 点击模式, mechanism: 点击模式减少一部分键位指令并增加光标空间定位, outcome: 指令维度与空间精度可以交换，深度不由单轴决定, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者说明：原文把本节标为未完成；除已写出的定义、定性判断和跨类型例子外，不补写作者没有完成的技表理论。
---

## 两个部分

决策指事件出现时可选择哪些反应，依赖指令技表、序列技表、组合键等规则。执行指把选定指令准确输入出来，与时间精度略有重叠。来源给出的定性结论是：选择越丰富，理论深度越大；执行越难，区分度和难度也可能增加。

## 接续规则

后摇、取消、目押和序列技表决定动作能否自由接续。来源认为接续越自由，主动反应频率通常越高；越死板则越低。但自由输入若没有情境差异，仍可能退化为无脑连打。

## 跨类型对照

平台与赛车用连续时空控制形成自足玩法；音乐游戏依赖高时间精度和频率；STG 主要依赖高被动频率与空间精度；MOBA 的大量深度来自外部规则。它们说明指令数量不是深度的唯一来源。

## 未完成边界

来源作者明确说本节因精力有限留坑，并提到以后想讨论 Dodge Offset；Dodge Offset 的具体机制说明在来源中并未完成。本节点只保留这个待讨论题目，不为它建立来源支持的机制案例，也不把编者知识写成来源结论。
