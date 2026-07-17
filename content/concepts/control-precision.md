---
id: control-precision
kind: concept
title: 操控精度
aliases: [操作精度, 输入准确度]
summary: 用时间窗口、方位距离与指令决策/执行三个维度观察常规环境对玩家输入准确度的要求。
domainIds: [domain-system-depth]
depth: 2
tags: [操控, 精度, 输入]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-system-depth }
  - { kind: parent_of, target: time-precision }
  - { kind: parent_of, target: space-precision }
  - { kind: parent_of, target: command-dimension }
  - { kind: related_to, target: reaction-frequency }
  - { kind: conflicts_with, target: difficulty-sources }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.3 操控精度；3.3.1 至 3.3.4 }
media: []
examples:
  - { id: precision-mh, gameId: monster-hunter, subject: 怪物猎人, mechanism: 低频动作要求细致控制攻击方位、距离、轨迹和打点, outcome: 用高空间精度补充慢速系统的区分度, sourceIds: [source-action-design-difficulty] }
  - { id: precision-nier, gameId: nier, subject: 尼尔机械纪元, mechanism: 极快出手与高度自由取消降低执行失败成本, outcome: 快速并不自动等于高操控精度, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者解释：时间、空间、指令三轴可用于描述倾向，但原文的乘法公式没有统一单位；本图谱不据此计算总分。
---

## 来源作者的简化模型

来源将操控精度限定为“常规游戏环境对玩家输入准确度的要求”，排除低生命值或战斗时长等外部规则，并写作：

> 操控精度 = 操控时间精度 × 操控空间精度 × 指令维度

该式是作者为了拆分讨论提出的粗略模型，不是普遍定律。三者会相互补偿、相互干扰，也没有共同量纲可直接相乘。

## 三个观察轴

- 时间精度：在连续时间中何时输入离散指令，如精确闪避、格挡、盾反和招架。
- 空间精度：输入方向、角色方位、攻击距离、轨迹和打点要多准确。
- 指令维度：事件发生时有多少可选对策，以及把指令执行出来有多难。

## 条件与边界

反应频率高不必然精度高；高频作品常用吸附、宽判定和自动追击减少空间校准。低频作品则可用空间与资源规则建立深度。平台、赛车、音乐、STG 与 MOBA 也有精确操作，说明三轴不属于动作游戏专有。
