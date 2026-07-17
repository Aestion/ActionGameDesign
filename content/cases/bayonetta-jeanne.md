---
id: bayonetta-jeanne
kind: case
title: 猎天使魔女 1 贞德
aliases: [Bayonetta Jeanne, 贞德]
summary: 以读指令闪避、蝙蝠闪、玩家模组高速编织和短硬直脱离构成的拟似对等人形。
domainIds: [domain-enemy-boss, domain-combat]
depth: 3
tags: [详细案例, 低韧性, 读指令, 拟似对等]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: applies_to, target: pseudo-equal-humanoid }
  - { kind: applies_to, target: low-poise-neutral }
  - { kind: related_to, target: continuous-hitstun-and-launch }
citations:
  - { sourceId: source-low-poise-boss, locator: 三、对等型人形／2. 猎天使魔女1 贞德 }
  - { sourceId: source-combat-approaches, locator: 一、立回／② 补充 }
media: []
examples:
  - { id: case-bayonetta-jeanne-ai, gameId: bayonetta, subject: 猎天使魔女 1 贞德完整 AI 案例, mechanism: 自由态闪避弹反、受击蝙蝠闪、玩家模组快速编织、动作中读指令取消与短硬直脱离共同压缩先手和输出, outcome: 可用编织硬直与女王踩压制，也可用 yyby 或火箭筒路线；正常立回要求高熟练控距、预判与 offset, sourceIds: [source-low-poise-boss, source-combat-approaches] }
editorialSynthesis: 编者归纳：贞德的可学部分来自控距、后摇和编织硬直，负反馈则集中在概率取消与近乎不可反应的高速动作；二者应并列记录。
---

## 来源事实：自由态防硬直

贞德会闪避普通近战与强力攻击；对强攻的闪避带概率，避免玩家一直打空气。她能弹反普通近战、概率格挡子弹，并可在受击瞬间用蝙蝠闪脱离。抢先手本身只造成少量伤害，但持续剥夺玩家稳定起手权。

## 来源事实：出手与取消

除少数召唤魔兽和响指编织外，她基本套用玩家模组，出手比黑但丁更快。上挑编织前摇极短、缺少提示、出伤快且全图追踪，来源通常视为不可反应，只能依据 AI 习惯预判。部分出手过程还能读指令强制取消，而且不限于后摇。

## 来源事实：破绽、脱离与打法

抓后摇相对稳定，但普通受击若不能挑空、扣落或吹飞，她会很快闪避脱离。编织造成硬直后可连续用女王踩压制。来源列出的路线包括火爪妖刀 yyby 伪连、卡距离火箭筒拉扯，以及高熟练度正常立回：控距防零帧近战、预判快速编织、抓破绽用 dodge offset 衔接绊倒或编织挑空吹飞。

## 条件与限制

概率闪避与概率取消使同一输入不总产生同一结果；但并非所有破绽都随机。该案例保留“后摇相对稳定”这个反面限定，避免把 Boss 简化成全程不可学。
