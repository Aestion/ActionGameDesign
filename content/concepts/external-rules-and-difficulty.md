---
id: external-rules-and-difficulty
kind: concept
title: 外部规则、难度、容错与惩罚
aliases: [难度来源, 容错性, 惩罚性, 难度曲线]
summary: 把反应/执行本身的要求与血量、伤害、目标长度、容错和失败惩罚造成的达成率变化分开。
domainIds: [domain-system-depth]
depth: 2
tags: [外部规则, 难度, 容错, 惩罚]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-system-depth }
  - { kind: related_to, target: depth-width-feedback-time }
  - { kind: related_to, target: feedback-loops }
  - { kind: related_to, target: training-and-depth }
  - { kind: conflicts_with, target: difficulty-sources }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.4 外部规则空间；3.4.1 关于难度 }
media: []
examples:
  - { id: difficulty-souls-boss, gameId: dark-souls, subject: 黑暗之魂 Boss, mechanism: 高伤使单次失败惩罚高、低回复余量使容错低，篝火和捷径降低完成全游戏时的小目标惩罚, outcome: 来源认为主要靠低容错和高惩罚要求重试, sourceIds: [source-action-design-difficulty] }
  - { id: difficulty-souls-curve, gameId: dark-souls, subject: 黑暗之魂进程, mechanism: 动作规则早期基本暴露，后续更多用数值和组合延长目标, outcome: 来源观察到玩家熟练增长可能让后段主观变简单并产生成就感, sourceIds: [source-action-design-difficulty] }
  - { id: difficulty-dmc-rank, gameId: devil-may-cry, subject: 鬼泣 SSS 评价, mechanism: 外部评分要求驱动玩家主动探索招式和系统边界, outcome: 不必把通关硬门槛设得极高也能引导精通, sourceIds: [source-action-design-difficulty] }
  - { id: difficulty-bayo-medal, gameId: bayonetta, subject: 猎天使魔女白金奖章, mechanism: 评价系统奖励速度、伤害控制和技巧, outcome: 把深度作为自选挑战而非统一通关门槛, sourceIds: [source-action-design-difficulty] }
  - { id: difficulty-ng-karma, gameId: ninja-gaiden, subject: 忍者龙剑传 Karma, mechanism: 分数目标驱动更高效和更危险的打法, outcome: 以外部评价引导玩家钻研高频系统, sourceIds: [source-action-design-difficulty] }
  - { id: difficulty-mh-speedrun, gameId: monster-hunter, subject: 怪物猎人速杀, mechanism: 玩家自定完成时间目标并优化打点、路线和配装, outcome: 深度可由个人能力探索而非强制难度入口发现, sourceIds: [source-action-design-difficulty] }
  - { id: difficulty-souls-no-hit, gameId: dark-souls, subject: 黑暗之魂无伤通关, mechanism: 玩家凭个人意志把不受伤完成流程设为自选目标, outcome: 来源用它说明系统深度可由玩家自主探索，不必依赖强制难度入口, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者解释：来源的达成率、反应次数和容错推导是分析模型；目标、玩家群体与统计方式不固定时，不能把难度约化为单一客观数值。
---

## 深度与难度的来源口径

来源把深度描述为系统理论上可有效区分的最高信息处理速度，把难度描述为达成某个目标所要求的信息处理速度，并建议用特定水平玩家的达成率描述目标难度。这是作者口径，不是行业统一测量标准。

## 外部规则怎样变难

在反应频率与操控精度不变的假设下，作者认为外部规则只能让综合目标包含更多成功反应，或允许更少失败。例如“命中 Boss 20 次且最多受击 5 次”改为命中 40 次，或改为最多受击约 3 次，都会降低达成率；单次反应本身没有变快或变精确。

这一推导依赖“其他条件不变”和把遭遇拆为独立反应的简化假设，现实中的血量、阶段、资源、压力与学习会互相改变，不能视为普遍定律。

## 容错与惩罚

- 容错性：达成综合目标时，允许多少子目标失败。
- 惩罚性：某个子目标失败会在多大程度上阻断主目标。

提高某次 Boss 攻击伤害会提高该失败的惩罚并略降整体容错；强化回复主要提高容错；来源用“从被 Boss 连续击中 2 下就死，变成连续击中 3 下才死”说明增加生命会同时降低惩罚、提高容错。这是用于解释模型的个案数值，不是魂系通用伤害规格。尺度取决于目标：单场 Boss 的死亡惩罚很高，全游戏尺度上篝火与捷径又降低了局部失败的长期损失。

来源还把奖励看作惩罚的反面：奖惩仍可生效通常意味着综合目标尚未彻底结束。这个对称说法用于理解局部结果怎样改变后续机会，不等于所有奖励都能换算成同量惩罚。

## 黑暗之魂的难度曲线：来源观点

来源作者判断，《黑暗之魂》的反应频率偏低、指令维度低、时空精度中等，因此“绝对深度并不高”；作者认为其动作相关深度很早暴露，后续难度更多来自外部规则，而玩家熟练度持续增长，所以许多人感觉越往后越简单并从中获得成就感。这是作者具有争议的个案判断，本图谱保留并明确归属，不把它推广为魂式作品的普遍结论。

## 来源立场与限定

来源作者偏好从反应频率和操控精度提高动作挑战，因为失败更易进入“失败—学习—掌握—成功”；但作者也承认玩家对精度耐受不同，Sweet Spot 很复杂。难度不是探索深度的唯一或最佳入口，评分、奖章、速杀、无伤等自选目标可保持低门槛高上限。
