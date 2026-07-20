---
id: readability-vs-spectacle
kind: conflict
title: 可读性优先还是观赏性优先
aliases: [可读性 vs 观赏性, 动作表现优先级冲突]
summary: 实时高惩罚操作要求稳定功能传达，角色卖点与宏大演出又可能有条件地接受低读性换取视觉冲击。
domainIds: [domain-presentation]
depth: 3
tags: [冲突卡, 目标冲突, 可读性, 观赏性]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: conflicts_with, target: readability-priority-principles }
  - { kind: conflicts_with, target: spectacle-techniques }
  - { kind: related_to, target: training-and-depth }
citations:
  - { sourceId: source-action-design-difficulty, locator: 4.2.4 观赏性与可读性的平衡；4.3 直观与训练 }
media: []
examples:
  - { id: conflict-readability-nier, gameId: nier, subject: 尼尔长枪回避攻击, mechanism: 华丽旋转和特效遮蔽角色位置, outcome: 视觉卖点强但即时空间状态难读, sourceIds: [source-action-design-difficulty] }
  - { id: conflict-readability-gow, gameId: god-of-war, subject: 战神升天巨蛇场景, mechanism: 宏大镜头和景物把角色、敌人和命中压到次要位置, outcome: 场面壮观却需依赖连击 UI 才能确认战斗, sourceIds: [source-action-design-difficulty] }
  - { id: conflict-readability-darksiders, gameId: darksiders, subject: 暗黑血统2漂移攻击, mechanism: 准备姿势未预告大幅位移, outcome: 玩家无法从动势预测功能，被来源视为纯反面教材, sourceIds: [source-action-design-difficulty] }
conflictType: goal
conflictSides:
  - label: 实时玩法优先可读性
    claim: 来源作者个人倾向可读性大于观赏性，理由是游戏给玩家玩，动作应先准确传达功能、方向、时机和结果。
    conditions: 来源作者认为游戏给玩家玩，动作应先准确传达功能；因此主张尽可能优先满足动画可读性的基本要求，再谈观赏性。
    sourceIds: [source-action-design-difficulty]
  - label: 有条件牺牲读性换取观赏性
    claim: 来源作者同时明确该倾向并非绝对：牺牲一部分可读性换取观赏性问题不大，因为“读”是玩家可通过练习掌握的技能。
    conditions: 只支持“牺牲一部分可读性”且该读法能够通过练习掌握的非绝对例外；来源未进一步列出产品阶段条件。
    sourceIds: [source-action-design-difficulty]
editorialSynthesis: 编者归纳：以下适用性判断是对来源关系的结构化推导，不是原文逐项条件：失败成本低或操作权被演出暂时接管时，观赏性空间可能增大；提示补偿与视觉卖点会改变取舍；随机或不一致的信号难以由训练补回。来源总体偏向可读性，但本卡不把偏好升级为永久排名。
---

## 同一维度的目标冲突

动作表现既要告诉玩家“发生什么、该怎样回应”，也承担角色魅力、力量、速度与宏大场面。画面资源有限时，两者会争夺对象大小、轮廓、镜头中心、特效强度和时间。

## 三个反例

《尼尔》牺牲自我位置，《战神：升天》牺牲战斗显著性，《暗黑血统2》牺牲趋势预告。前两者仍有明确视觉意图；第三个被来源作者视为没有合理补偿的反面教材。保留差别可避免把所有低读性简单归为同一种错误。

## 编者归纳

当玩家必须立即负责结果时，可读性权重上升；当演出暂时接管、失败成本低或另有可靠提示时，观赏性空间变大。训练只会补回稳定可学习的模式，不能修复不一致信号。
