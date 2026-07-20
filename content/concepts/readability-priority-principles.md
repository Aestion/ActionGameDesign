---
id: readability-priority-principles
kind: concept
title: 可读性优先的原则与条件
aliases: [好看与好读, 视觉趣味与功能传达, 可读性优先原则]
summary: 来源作者通常把可读性置于观赏性之前，但承认可通过训练掌握部分低读设计，并允许条件性取舍。
domainIds: [domain-presentation]
depth: 2
tags: [可读性, 观赏性, 取舍]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-presentation }
  - { kind: related_to, target: animation-readability }
  - { kind: related_to, target: spectacle-techniques }
  - { kind: conflicts_with, target: readability-vs-spectacle }
citations:
  - { sourceId: source-action-design-difficulty, locator: 4.2.4 观赏性与可读性的平衡；小结 }
media:
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104129zrymyzjzmj4l7l4e.gif
    src: media/104129zrymyzjzmj4l7l4e.gif
    alt: 尼尔机械纪元长枪回避攻击中角色高速旋转并短暂难以辨认
    caption: 原说明：《尼尔》长枪回避攻击“好看是很好看的，只是闪避的时候我人哪去了”，展示轮廓消失造成的读性代价。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104139sr4qmojfjpfcp0y9.gif
    src: media/104139sr4qmojfjpfcp0y9.gif
    alt: 战神升天巨蛇宏大场面中玩家角色与战斗信息被景物遮蔽
    caption: 原说明：《战神：升天》巨蛇盘山场景；素材源自 MKIceAndFire 攻略，若不看连击数几乎难以判断战斗正在发生。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104147nefrajq0fjxjjx9r.gif
    src: media/104147nefrajq0fjxjjx9r.gif
    alt: 暗黑血统2怪物从准备姿态突然横向漂移攻击玩家
    caption: 原说明：《暗黑血统2》怪物漂移攻击；素材源自 TurboButtons，准备动作没有显示即将发生的位移。
    kind: gif
    sourceId: source-action-design-difficulty
examples:
  - { id: balance-nier-spear, gameId: nier, subject: 尼尔长枪回避攻击, mechanism: 高速旋转、特效和姿态形成优美表演却掩盖角色位置, outcome: 玩家难以持续读取自身空间状态, sourceIds: [source-action-design-difficulty] }
  - { id: balance-gow-ascension, gameId: god-of-war, subject: 战神升天巨蛇场景, mechanism: 宏大景物和镜头优先，角色与命中反馈在画面中极小, outcome: 连击数之外几乎看不出战斗是否发生, sourceIds: [source-action-design-difficulty] }
  - { id: balance-darksiders2, gameId: darksiders, subject: 暗黑血统2漂移攻击, mechanism: 准备动作没有呈现后续大位移趋势, outcome: 观赏性位移破坏功能预告，被来源视为反面教材, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：优先级不是固定胜负；可学习性、失败成本、演出阶段是否接管操作、视觉卖点和目标受众共同决定可牺牲多少读性。
---

## 来源作者的倾向

作者个人倾向“可读性永远大于观赏性”，理由是游戏首先需要可玩；但紧接着明确说并非绝对，适度牺牲可读性换取观赏性问题不大，因为“读”可以通过练习掌握。两句话必须一起保留，不能把来源压缩成绝对禁令。

## 三种失衡

《尼尔》用高速姿态和特效让玩家难找自身位置；《战神：升天》让宏大场景吞没角色与战斗反馈；《暗黑血统2》的准备动作没有预告位移。三者分别破坏自我状态、事件显著性和动作趋势。

## 条件与反例

- 角色展示、必杀、过场或低失败成本阶段可更偏观赏性。
- 若玩家能通过稳定反馈学会低读动作，它可能成为技巧；若每次表现不一致，训练无法补回。
- 好看的动作由广泛直观支撑，仍是扎实卖点；来源要求的是先守住基本功能传达，不是否定视觉趣味。
