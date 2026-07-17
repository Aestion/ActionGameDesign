---
id: reaction-frequency
kind: concept
title: 主动与被动反应频率
aliases: [反应频率, 主动反应, 被动反应, 操控频率]
summary: 用单位时间内需要处理的环境事件与玩家主动出手，观察动作游戏的压力、流畅感和表达空间。
domainIds: [domain-system-depth]
depth: 2
tags: [反应频率, 主动, 被动]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-system-depth }
  - { kind: parent_of, target: enemy-attack-allocation }
  - { kind: related_to, target: depth-width-feedback-time }
  - { kind: related_to, target: control-precision }
  - { kind: conflicts_with, target: difficulty-sources }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.2 反应频率；3.2.1 至 3.2.3 }
media: []
examples:
  - { id: reaction-mh, gameId: monster-hunter, subject: 怪物猎人, mechanism: 武器与怪物大动作都常持续一秒到数秒, outcome: 主被动双低，以慢制慢服务大型武器狩猎且并不消除深度, sourceIds: [source-action-design-difficulty] }
  - { id: reaction-colossus, gameId: shadow-of-the-colossus, subject: 旺达与巨像, mechanism: 战斗主被动频率更低但战斗不是全作核心, outcome: 是“双低”的更极端对照，来源因此没有继续展开, sourceIds: [source-action-design-difficulty] }
  - { id: reaction-ng, gameId: ninja-gaiden, subject: 忍者龙剑传, mechanism: 玩家与小怪大量动作在 15/30 帧以内，并有连段、斩杀和凶悍 AI, outcome: 主被动双高形成紧张残酷的高速搏杀, sourceIds: [source-action-design-difficulty] }
  - { id: reaction-muramasa, gameId: muramasa, subject: 胧村正, mechanism: 攻防同键、主动连击密集而敌人回应较少, outcome: 低被动高主动形成易上手、乱按也爽快的体验, sourceIds: [source-action-design-difficulty] }
  - { id: reaction-odin, gameId: odin-sphere, subject: 奥丁领域, mechanism: 与香草社同类作品一样用简化输入支持高主动频率, outcome: 作为攻防同键的并列例子扩大易上手倾向, sourceIds: [source-action-design-difficulty] }
  - { id: reaction-titan, gameId: titan-souls, subject: 泰坦之魂, mechanism: 玩家与 Boss 均一击致命，玩家长时间闪躲等待唯一出手窗口, outcome: 高被动低主动以僵化和高期待塑造异质战斗, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者解释：四象限是来源作者的定性观察，不是固定类型；主动动作也可理解为响应敌人 Opening，攻防一体动作还会模糊边界。
---

## 来源作者的模型

来源作者把反应频率理解为一定时间内玩家操作或需要回应的次数，类比 RTS 的 APM，并写作：

> 反应频率 = 发生情况数量 / 允许的反馈时间

> 反应频率 = 被动反应频率 + 主动反应频率

它源自作者对稻叶敦志 2016 年演讲“动作游戏基于反应”的延伸解释。这里的式子是概念模型，不是普遍定律；不同动作是否算一次反应、窗口如何计数，原文没有给出可复现实验标准。

## 主动与被动

- 被动反应是用防御、闪避等回应环境，主要由敌人攻击动作、数量和出手机制决定。
- 主动反应是玩家选择攻击动作，受动作时长、后摇、取消、目押与序列技表影响；接续越自由，主动频率通常越高。
- 来源也承认主动攻击可被解释为响应敌人空档，Counter、无敌或霸体动作兼具攻防，所以区分有意保持宽松。

## 四种组合与限定

来源以《怪物猎人》《忍者龙剑传》《胧村正》《泰坦之魂》展示四个象限。高主动频率常带来自由表达、流畅和爽快；低主动频率提高每次输入的期待，可能更显真实或异质。低被动通常更轻松，高被动通常更紧张，但难度还会被操控精度、容错、惩罚和训练显著改变，不能由频率单独决定。
