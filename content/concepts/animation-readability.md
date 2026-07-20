---
id: animation-readability
kind: concept
title: 动画可读性：剪影、动势与特征帧
aliases: [动作可读性, 剪影, 动势, 特征帧, Line of Action]
summary: 以完整轮廓、运动趋势、准备时长和关键姿态传达动作功能，也可用拖延与假动作有意挑战阅读。
domainIds: [domain-presentation]
depth: 2
tags: [动画, 剪影, 动势, 特征帧]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-presentation }
  - { kind: related_to, target: intuitive-experience }
  - { kind: related_to, target: time-precision }
  - { kind: related_to, target: training-and-depth }
citations:
  - { sourceId: source-action-design-difficulty, locator: 4.1.2 动画设计；怪物猎人世界龙吼；围绕读的设计 }
media:
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104005mmsd44qgp5qgqca4.gif
    src: media/104005mmsd44qgp5qgqca4.gif
    alt: 怪物猎人世界雄火龙收缩头颈翅膀后全身舒张吼叫
    caption: 原说明：《怪物猎人：世界》雄火龙龙吼；素材源自 KCGemini 的 MHW Roar Dodging Compilation。原文用它展示清楚的全身动势与特征帧。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104016u9d46hnu9uuhnc3u.gif
    src: media/104016u9d46hnu9uuhnc3u.gif
    alt: 怪物猎人世界角龙主要收缩头颈后吼叫
    caption: 原说明：《怪物猎人：世界》角龙吼；运动集中在头颈且收缩位置停留较久，原文据此解释特征帧较模糊。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104020sa0qkz9uzapir4au.gif
    src: media/104020sa0qkz9uzapir4au.gif
    alt: 怪物猎人世界炎王龙躯干和翅膀运动与吼叫错开
    caption: 原说明：《怪物猎人：世界》炎王龙吼；准备较短，头部缺乏预期，躯干翅膀节律与吼声错开。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104029yxj1d1zq338l4mzd.gif
    src: media/104029yxj1d1zq338l4mzd.gif
    alt: 黑暗之魂3无名王者收紧长枪后延迟刺击
    caption: 原说明：《黑暗之魂3》无名王者的拖延攻击；素材源自 RabbitRetrospectGames 的全 Boss 战录像，展示延迟约 11/30 帧针对 Panic Roll。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104031tr4dxulrx0bxcyuj.gif
    src: media/104031tr4dxulrx0bxcyuj.gif
    alt: 黑暗之魂3猎龙铠甲先做假动势再追加远距离攻击
    caption: 原说明：《黑暗之魂3》猎龙铠甲的假动作；素材来源同无名王者图，先骗出闪避再追加攻击。
    kind: gif
    sourceId: source-action-design-difficulty
  - sourcePath: ../../原始资料/动作游戏设计之难_assets/104035u1nhfn4p32p0b184.gif
    src: media/104035u1nhfn4p32p0b184.gif
    alt: 血源诅咒老猎人研究所小怪以缺少预兆的连续攻击压迫玩家
    caption: 原说明：《血源诅咒：老猎人》小怪连击；素材源自 FightingCowboy 攻略，原文批评其低可读、高惩罚并针对 Panic Roll。
    kind: gif
    sourceId: source-action-design-difficulty
examples:
  - { id: readable-rathalos, gameId: monster-hunter, subject: 雄火龙龙吼, mechanism: 约 56/30 帧准备、头颈翅膀同步挤压舒张，约 6/30 帧完成特征变化, outcome: 全身多处可作为闪避视觉参照，来源认为最易读, sourceIds: [source-action-design-difficulty] }
  - { id: readable-diablos, gameId: monster-hunter, subject: 角龙龙吼, mechanism: 约 58/30 帧准备但运动集中头颈，收缩附近停留约 12/30 帧, outcome: 特征变化不明确，来源认为比雄火龙难躲, sourceIds: [source-action-design-difficulty] }
  - { id: readable-teostra, gameId: monster-hunter, subject: 炎王龙龙吼, mechanism: 约 27/30 帧准备，头部缺少挤压舒张，身体节律与吼声错开, outcome: 视觉参照少且干扰强，来源认为三者中最难读, sourceIds: [source-action-design-difficulty] }
  - { id: readable-nameless, gameId: dark-souls, subject: 黑暗之魂3无名王者, mechanism: 在动势收紧处拖延长刺约 11/30 帧, outcome: 来源称它会刻意错开 Panic Roll 无敌，并在翻滚时造成 40% 额外伤害, sourceIds: [source-action-design-difficulty] }
  - { id: readable-dragonslayer, gameId: dark-souls, subject: 黑暗之魂3猎龙铠甲, mechanism: 先给假动势诱骗闪避，再用长距离攻击追击, outcome: 以降低可读性挑战既有直观，来源评价更为恶劣, sourceIds: [source-action-design-difficulty] }
  - { id: readable-bloodborne-dlc, gameId: bloodborne, subject: 老猎人研究所小怪与鲨鱼, mechanism: 无明显前兆的连击要求从受击节奏中寻找闪避或枪反, outcome: 来源认为可读性低、惩罚高、体验差，是作者明确负面评价, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：同一功能的帧数相近不保证同样好读；身体各部位是否给出一致趋势、特征姿态是否稳定、相机能否看到完整轮廓同样关键。
---

## 剪影、动势和特征帧

来源作者把 Mariel Cartwright 的 GDC 讲座称为“针对动作游戏的动画设计”的最佳材料，并在原文附有站外搬运链接；本节点只保留这一来源指引，不把讲座内容冒充本文论证。

剪影是动作外轮廓，完整且差异清楚时更易识别。大型怪物占满画面却只露腹部，尺寸虽大仍因剪影破坏而难读。动势是运动将往哪里发展的趋势；挤压、拉伸、重心和准备幅度会建立对力量与方向的预期。特征帧则是最能帮助识别功能的关键姿态或趋势节点。

## 编者解释（补充术语）：动作线

Task 5 简报要求补充动作线（Line of Action）这一检索术语：它可用来概括身体姿态和力量传递的主方向，帮助分析剪影与动势。原文没有使用或定义该术语，因此本段属于编者解释，不是五十万文章的来源观点，也不由本页的来源引文为它背书。

## 三个龙吼

雄火龙、角龙和炎王龙都提供较长或可见准备，却因全身同步、动作幅度、停留和声画节律不同而可读性不同。来源逐帧数值是对素材的作者测量，受录像帧率与截取方式限制，不应当作官方数据。

## 有意降低可读性

魂系用快慢不同的招式奖励观察。拖延攻击在收紧处停留，专打立即翻滚；假动作先给错误趋势；《血源》DLC 小怪则用缺少征兆的连击要求从受击节奏寻找逃脱。来源既承认“读”可成为低频 PVE 的玩法，也对极端低读、高惩罚案例给出明确负面评价。

## 条件与反例

可读不是所有动作都必须匀速、写实或提前很久。关键是产品是否希望玩家预判、反应、背板或被惊吓，以及失败后能否建立稳定参照。低读性只有在训练能产生有意义区分时才可能成为深度，而不是任意性。
