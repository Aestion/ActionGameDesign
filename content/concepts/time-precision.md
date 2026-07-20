---
id: time-precision
kind: concept
title: 时间精度与反应窗口
aliases: [时机精度, 精确闪避窗口, 标准反应时间]
summary: 观察离散输入的时机窗口，以及动作出手、命中停顿和事件错开如何帮助玩家察觉并回应。
domainIds: [domain-system-depth, domain-presentation]
depth: 3
tags: [时间精度, 反应窗口, 帧数]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: control-precision }
  - { kind: child_of, target: domain-presentation }
  - { kind: related_to, target: animation-readability }
  - { kind: related_to, target: spectacle-techniques }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.3.1 时间精度；标准反应时间；时间精度的应用 }
media:
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/103953agjvlaeyt5tze51v.gif
    src: media/103953agjvlaeyt5tze51v.gif
    alt: 怪物猎人X盾斧光剑命中怪物时出现长时间帧冻结
    caption: 原说明：《怪物猎人X》盾斧光剑命中低肉质部位时约 8/30 秒帧冻结；素材源自 Arekkz Gaming 的 Monster Hunter Generations Blade Tutorial。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/103953ewp5o4sv6w6ccjwz.jpg
    src: media/103953ewp5o4sv6w6ccjwz.jpg
    alt: GDC 幻灯片展示尼尔机械纪元输入后十帧约零点一六秒出手
    caption: 原说明：田浦贵久在 GDC 分享《尼尔：机械纪元》动作输入响应，图示小剑轻攻击约 10/60 帧；素材源自 GDC 演讲录像。
    kind: image
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/103955eetgdwpwby6ywyw3.gif
    src: media/103955eetgdwpwby6ywyw3.gif
    alt: 鬼泣4尼禄在攻击中精确充能使红皇后剑身变红
    caption: 原说明：《鬼泣4》尼禄在攻击动作的精确时机充能可获得三倍效果；素材源自 ChaserTech 的 Nero Advanced Combat Tutorial。
    kind: gif
    sourceId: source-action-design-difficulty
examples:
  - { id: time-mhx-hitstop, gameId: monster-hunter, subject: 怪物猎人X盾斧狩技, mechanism: 夸张命中配约 8/30 秒帧冻结, outcome: 接近来源作者所称察觉阈值，依赖动作与特效建立预期, sourceIds: [source-action-design-difficulty] }
  - { id: time-nier-startup, gameId: nier, subject: 尼尔机械纪元小剑轻攻击, mechanism: 前摇约 10/60 帧，完整动势约 16 至 18/60 帧, outcome: 形成极快输入响应，并以自由取消降低后续思考约束, sourceIds: [source-action-design-difficulty] }
  - { id: time-sfv-jab, gameId: street-fighter, subject: 街头霸王5站轻拳, mechanism: 多数角色约 4/60 帧出手，完整打击帧总长约 8 至 10/60，并配 10 至 14/60 帧命中冻结, outcome: 快出手后仍给需要决策与搓招的玩家察觉命中的时间, sourceIds: [source-action-design-difficulty] }
  - { id: time-dmc4-exceed, gameId: devil-may-cry, subject: 鬼泣4尼禄红剑充能, mechanism: 约零点二秒或更窄窗口内精确输入, outcome: 精确操作获得三倍于非精确操作的充能效果, sourceIds: [source-action-design-difficulty] }
  - { id: time-dmc-precise-dodge, gameId: devil-may-cry, subject: DMC 的精确闪避, mechanism: 来源把精确闪避列入约 0.2 至 0.4 秒的中时间精度玩法, outcome: 作为多数动作游戏精确玩法窗口的一个来源例子, sourceIds: [source-action-design-difficulty] }
  - { id: time-mhx-bushido, gameId: monster-hunter, subject: 怪物猎人X的武士道风格, mechanism: 来源把武士道风格列入约 0.2 至 0.4 秒的中时间精度玩法, outcome: 与 DMC 精确闪避并列说明该经验分档, sourceIds: [source-action-design-difficulty] }
  - { id: time-dead-cells-parry, gameId: dead-cells, subject: 死亡细胞盾反, mechanism: 来源把判定列为零点四秒以上的宽松精确玩法, outcome: 降低严格时机门槛, sourceIds: [source-action-design-difficulty] }
  - { id: time-mordor-parry, gameId: middle-earth-shadow, subject: 暗影魔多招架, mechanism: 宽时机窗口配 UI 提示, outcome: 把重点放在群战表演而非极限时间执行, sourceIds: [source-action-design-difficulty] }
  - { id: time-nioh-pulse, gameId: nioh, subject: 仁王残心, mechanism: 在动作后较宽时机内输入以回收精力, outcome: 时间操作与资源收益互通, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：零点三秒、零点六秒及高/中/低窗口均是来源作者的经验尺度，不是人体反应或动画调度的普遍常数；实际窗口还受帧率、输入延迟、预判和提示影响。
---

## 定义边界

本节点只讨论连续时间中“何时按一次离散指令”，不把“摇杆保持多久”纳入。典型玩法是精确闪避、精确格挡、盾反与招架。

## 来源作者的经验尺度

原文把人的反应时间概括为约 0.1 至 0.5 秒、平均约 0.3 秒，并据此讨论三类表现：常见命中停顿多在 0.1 至 0.2 秒，即 3～5/30 帧；来源作者称自己见过最长的是《怪物猎人X》盾斧光剑命中低肉质部位时的 8/30 = 0.27 秒冻结。动作快到约 0.2 秒时需要用停顿帮助察觉；《街头霸王5》多数角色站轻拳约 4/60 帧出手，算上完整打击帧总长约 8 至 10/60，再以 10 至 14/60 帧命中冻结补偿；连续舞台事件最好充分错开，作者给出至少约 0.6 秒的经验值。这些数字保留为来源作者的经验尺度，不能脱离设备、刺激类型和玩家条件当作生理定律。

## 精度分档

- 高：约 0.2 秒或以下，如《鬼泣4》尼禄红剑精确充能。
- 中：约 0.2 至 0.4 秒，多数精确闪避与《怪物猎人X》武士道风格。
- 低：约 0.4 秒以上，或没有严格精确玩法，如《死亡细胞》盾反、《暗影魔多》招架、《仁王》残心。

分档是原文用于比较的近似，不说明某档天然更好。窗口越窄会抬高门槛；足够清楚的预备动作、音画提示和稳定帧率会改变玩家的实际可应对性。
