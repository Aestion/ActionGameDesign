---
id: ninja-gaiden-doppelganger
kind: case
title: 忍者龙剑传 Sigma 假龙
aliases: [忍龙假龙, Ninja Gaiden Doppelganger, 假龙]
summary: 以读指令回避防御、手里剑取消、近乎无解投技和不对等动作权限构成的类格斗 AI。
domainIds: [domain-enemy-boss, domain-combat]
depth: 3
tags: [详细案例, 低韧性, 读指令, 拟似对等]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: applies_to, target: pseudo-equal-humanoid }
  - { kind: applies_to, target: low-poise-neutral }
  - { kind: related_to, target: wakeup-and-resource-suppression }
citations:
  - { sourceId: source-low-poise-boss, locator: 三、对等型人形／3. 忍龙Σ 假龙 }
  - { sourceId: source-combat-approaches, locator: 一、立回／② 补充 }
media: []
examples:
  - { id: case-ninja-gaiden-doppelganger-ai, gameId: ninja-gaiden, subject: 忍者龙剑传 Sigma 假龙完整 AI 案例, mechanism: 读指令回避防御、手里剑打断、霸体忍法、断头摔、不对等取消和随机挑空共同压缩玩家先手, outcome: 稳定处理多为等少数后摇低责任试探，成功爆发并尝试压起身；大众常选择逃课, sourceIds: [source-low-poise-boss, source-combat-approaches] }
editorialSynthesis: 编者归纳：假龙不是“真正对等的 PVP 对手”；相同模组表象下，自动防御、取消权限和信息读取形成了性能不对等。
---

## 来源事实：读取与进攻

假龙自由态读指令回避或防御，会用手里剑打断玩家出招，部分情形还会防反；玩家里风也会触发其翻滚，某些时候以霸体忍法抢先。断头摔作为 Boss 端快速投技近乎无解。

## 来源事实：性能不对等

它基本使用玩家模组，却拥有玩家没有的权限：大量动作可在挨打时自动切防御；读指令里风能取消玩家无法取消的招式；手里剑还能取消玩家端长连段的后摇再追击。因此“镜像”并不等于性能不对等被消除。

## 来源事实：破绽与保护

除大刀形态外缺少稳定破绽。前 Y 只破防不一定挑空，防御后继续防、松防或闪避随机；XY 和前 XY 是否挑空也随机。少数后摇如妖刀 Yh 无法切防御，可用前 Y 挑空。被硬直一次后通常立刻防御或里风，偶尔吃两次；挑空、扣落和倒地有无敌保护，卡时机只能概率压起身。

## 来源评价与稳定路线

来源把它视为典型拟似对等类格斗 AI，但指出传统差合、确反和打康不能正常套用，大伤害常来自 Boss 卖破绽。读指令、手里剑、霸体忍法和无前摇断头摔带来强负反馈。较稳定处理是等后摇用低责任招试探挑空，失败后用风车手里剑或跳劈牵制、扣倒，成功才爆发并尝试压起身；非刷片玩家多用逃课。
