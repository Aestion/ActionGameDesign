---
id: nioh2-saito-toshimitsu
kind: case
title: 仁王 2 斋藤利三
aliases: [Saito Toshimitsu, 斋藤利三]
summary: 以位置与指令读取、防御对策、随机后摇取消和精力条第二目标构成的低韧人形。
domainIds: [domain-enemy-boss, domain-combat]
depth: 3
tags: [详细案例, 低韧性, 读指令, 精力]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: applies_to, target: pseudo-equal-humanoid }
  - { kind: applies_to, target: low-poise-neutral }
  - { kind: related_to, target: wakeup-and-resource-suppression }
citations:
  - { sourceId: source-low-poise-boss, locator: 三、对等型人形／4. 仁王2 斋藤利三 }
  - { sourceId: source-combat-approaches, locator: 一、立回／② 仁王2 斋藤利三 }
media: []
examples:
  - { id: case-nioh2-saito-ai, gameId: nioh, subject: 仁王 2 斋藤利三完整 AI 案例, mechanism: 位置与指令读取、可打断出手、呼子鸟防反、防御和精力 AI、后摇随机取消共同形成高随机纯立回, outcome: 低精力压制绕开部分直接交互，把学习目标转成有操作成本的资源循环, sourceIds: [source-low-poise-boss, source-combat-approaches] }
editorialSynthesis: 编者归纳：精力条没有让读指令消失，而是提供一条可规划的第二目标；其改善依赖玩家已具备中后期资源和操作能力。
---

## 来源事实：先手与动作韧性

自由态读取玩家位置直接出手，也会概率读指令侧闪、后滚或抢先手；出手快、距离远或带无敌的攻击更易取得先手。除拔即斩、雪月花、后跳爆气及派生外，多数招式出手无霸体，可在攻击间隙打断。发光突刺前摇有霸体，但发生和后摇可断。

## 来源事实：防御 AI 与呼子鸟

呼子鸟和逆水带防御判定，受击不硬直，前者会高速反击。人形 AI 在打肉硬直累积后倾向防御，崩解后可能后撤、侧闪、反击、死防等；红精有保护，会检测精伤选择不防，三 hit 能拉起身，精力低于半数时更偏防守。出手速度大多仍可反应，但呼子鸟可自由态裸出、崩解后反击或直接读指令出，是关键例外。

## 来源事实：后摇与随机性

不同招式后摇差异很大，Boss 可能残心或闪避取消后摇，也可能直接衔接霸体切段，导致抓后摇不稳定。纯立回因此难度和随机性都高。

## 精力条第二目标：低精力压制

来源认为《仁王》的关键改造是精力条。玩家不必一直与高随机 AI 正面博弈，可把低精力倾向防守、空精和拉起身转化为有操作成本的压制；这一思路从一代局部发展，到二代形成成熟系统。

## 适用限制

压制改善主要出现在中后期。新手开荒既不熟敌人 AI，也未必有足够精力和操作资源完成循环，仍可能只能基础立回。
