---
id: round-based-humanoid
kind: concept
title: 回合制攻防型低韧人形
aliases: [回合制人形, 低韧回合 Boss]
summary: 用稳定破绽与可识别脱离建立敌方回合和玩家回合，解决低韧 Boss 被连续硬直到死或无法出手的问题。
domainIds: [domain-enemy-boss]
depth: 2
tags: [低韧性, 人形Boss, 攻防回合]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-enemy-boss }
  - { kind: related_to, target: low-poise-neutral }
  - { kind: contrasts_with, target: pseudo-equal-humanoid }
citations:
  - { sourceId: source-low-poise-boss, locator: 二、回合制人形 }
media: []
examples: []
editorialSynthesis: 编者归纳：所谓“回合”不是强制停手脚本，而是稳定窗口与可读退出共同形成的攻守节奏。
---

## 低韧的两个致命问题

低韧人形体型小、动作更难看清，出手更快、招式密度更大，却又需要普通攻击能造成硬直才符合直觉。若一直受击硬直，就会被连到死，因此必须用切防御、架开、闪走、保护吹飞或霸体反击等脱离；若出招前和发生中都能被随意打断，Boss 又根本无法行动。

## 让 Boss 出手

来源列出五种解法：出手快到难以反应；自由态读指令闪避或抢先手；高攻击欲望和密度迫使玩家精准打康；出手带霸体；允许被打断但迅速脱离。它们可以组合使用，但每一种都会改变玩家的可预测性和反应负担。

## 顺畅攻守转换

回合结构还需要两项可读条件：破绽形式基本稳定，能把敌方回合转成玩家回合；玩家能识别 Boss 何时脱离，把玩家回合转回敌方回合。若使用霸体反击，还必须让反击出手速度足够可判断，或给出可预判规律。

## 与拟似对等的关系

两者同属低韧人形，初见体验可能相似。差别不在是否会读指令，而在破绽和退出是否稳定到足以学习。
