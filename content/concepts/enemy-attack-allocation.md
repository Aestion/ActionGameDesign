---
id: enemy-attack-allocation
kind: concept
title: 敌群出手分配
aliases: [敌人出手机制, 2+1 模式, 1+1 模式]
summary: 清版战场通过限制近战、远程和屏外敌人的同时出手数，控制玩家的被动反应频率。
domainIds: [domain-system-depth]
depth: 3
tags: [敌群AI, 出手分配, 反应频率]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: reaction-frequency }
  - { kind: related_to, target: clearing-and-non-clearing }
  - { kind: related_to, target: auxiliary-cues }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.2.1 被动反应频率的控制 }
media:
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/103949wxc368k8ce38lmxi.jpg
    src: media/103949wxc368k8ce38lmxi.jpg
    alt: 中土世界暗影魔多中主角被大量兽人包围的战斗画面
    caption: 《中土：暗影魔多》的大规模包围场面；原文用它说明“1+1”出手分配看似人多、实际一次仅少数敌人进攻。
    kind: image
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/103951bbizu5bbp5p6ppb5.gif
    src: media/103951bbizu5bbp5p6ppb5.gif
    alt: 中土世界暗影魔多战斗中敌人轮流出手并伴随自动摇镜
    caption: 原说明：《中土：暗影魔多》中的怪物出手机制和微妙的自动摇镜；画面展示包围敌群轮流进入攻击。
    kind: gif
    sourceId: source-action-design-difficulty
examples:
  - { id: allocation-bayonetta, gameId: bayonetta, subject: 猎天使魔女的 2+1, mechanism: 最多两个近战交战单位和一个远程或冲锋单位，其余敌人游荡示威且不同时攻击, outcome: 玩家可专注当前目标并留意少量威胁，屏外攻击配明显音效, sourceIds: [source-action-design-difficulty] }
  - { id: allocation-dmc, gameId: devil-may-cry, subject: DmC Devil May Cry 的 2+?, mechanism: 视野内约两只可同时出手，许多敌人前摇很长，视野外敌人不攻击, outcome: 避免屏外伤害但鼓励用相机把敌人排除出视野，显得生硬, sourceIds: [source-action-design-difficulty] }
  - { id: allocation-mordor, gameId: middle-earth-shadow, subject: 中土世界暗影魔多的 1+1, mechanism: 包围者中一次一个近战单位出手，另有一个远程单位, outcome: 可支持极大群体和表演性，却因主动操作死板而显得不刺激, sourceIds: [source-action-design-difficulty] }
  - { id: allocation-batman-arkham, gameId: batman-arkham, subject: 蝙蝠侠阿卡姆类的 1+1, mechanism: 来源把蝙蝠侠类游戏与暗影魔多并列在 1+1 机制讨论中，即围攻时主要由一个近战和一个远程单位形成威胁, outcome: 来源认为此类玩家主动操作过于死板，使相同作用机理的 AI 也受到诟病, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：2+1、2+?、1+1 是来源作者描述特定作品表现的速记，不是可直接套用的 AI 标准；战场可控性、相机和提示共同决定实际压力。
---

## 清版为何需要分配

非清版游戏允许玩家选择战场，陷入一对多常可归因于引怪；封闭清版遭遇则必须主动控制敌群出手。来源作者因此用“近战交战数 + 远程交战数”比较三种方案。

## 三种方案

《猎天使魔女》的 2+1 让参战单位随玩家移动切换，但避免两只敌人同时发起攻击，并以声音提示屏外远程威胁。DmC 允许约两只屏内敌人出手，以长前摇补偿，却直接禁止视野外敌人攻击，产生“转开相机逐个处理”的反直觉最优解。《暗影魔多》容纳近乎无限包围者，却用 1+1 轮流攻击和招架摇镜偏向表演；来源把“蝙蝠侠类游戏”并列为相同作用机理的例子。

## 条件与反例

- 同样的数字分配会因玩家动作自由、敌人前摇、相机和提示而产生不同体验。
- 原文称赞《猎天使魔女》的控制，也同时批评 DmC 和《暗影魔多》的可利用/表演性结果；这些评价属于作者观点。
- 非清版游戏并非无需 AI 约束，只是玩家选场、脱离和引怪让责任分配不同。
