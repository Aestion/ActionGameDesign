---
id: feedback-loops
kind: concept
title: 动作系统中的正负反馈循环
aliases: [正反馈, 负反馈, 资源循环, 受击保护]
summary: 正反馈放大优势，负反馈抑制偏差；硬直、资源、保护和恢复共同塑造战斗动态。
domainIds: [domain-system-depth]
depth: 2
tags: [反馈循环, 资源, 硬直, 保护]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-system-depth }
  - { kind: related_to, target: external-rules-and-difficulty }
  - { kind: related_to, target: action-external-interoperation }
citations:
  - { sourceId: source-action-design-difficulty, locator: 3.4.2 关于反馈循环；3.4.2.1 至 3.4.2.3 }
media: []
examples:
  - { id: loop-honkai-armor, gameId: honkai-impact-3rd, subject: 崩坏3怪物护甲, mechanism: 外部护甲规则限制连续受击硬直的正反馈效率, outcome: 控制链仍存在但不能无条件持续, sourceIds: [source-action-design-difficulty] }
  - { id: loop-bayo-stun, gameId: bayonetta, subject: 猎天使魔女击晕与魔晶, mechanism: 伤害积累制造击晕，命中与精确闪避又积累爆发资源, outcome: 优势可继续转化为控制和魔女时间收益, sourceIds: [source-action-design-difficulty] }
  - { id: loop-souls-poise, gameId: dark-souls, subject: 黑暗之魂韧性与体力, mechanism: 韧性限制受击硬直，体力以消耗后恢复抑制连续扩张优势, outcome: 正反馈受击与负反馈资源同时存在, sourceIds: [source-action-design-difficulty] }
  - { id: loop-ng-limb, gameId: ninja-gaiden, subject: 忍者龙剑传断肢处决, mechanism: 伤害造成断肢后开放即时处决, outcome: 已取得的伤害优势加速后续击杀, sourceIds: [source-action-design-difficulty] }
  - { id: loop-dmc-dt, gameId: devil-may-cry, subject: 但丁 Devil Trigger, mechanism: 战斗积累魔力后进入爆发状态, outcome: 以积累到爆发放大主动进攻爽快感, sourceIds: [source-action-design-difficulty] }
  - { id: loop-gow-rage, gameId: god-of-war, subject: 奎托斯斯巴达之怒, mechanism: 战斗资源积累后换取高强度输出, outcome: 属于积累到爆发的正反馈资源模式, sourceIds: [source-action-design-difficulty] }
  - { id: loop-dnf-protection, gameId: dnf, subject: DNF 浮空保护, mechanism: 浮空受伤越多落地越快, outcome: 连续控制越久越难追加，形成负反馈保护, sourceIds: [source-action-design-difficulty] }
  - { id: loop-sf-scaling, gameId: street-fighter, subject: 街头霸王连段伤害修正, mechanism: 同一连段越长后续伤害效率越低, outcome: 抑制单次命中无限放大优势, sourceIds: [source-action-design-difficulty] }
  - { id: loop-muramasa-durability, gameId: muramasa, subject: 胧村正武器耐久, mechanism: 扩大攻势消耗有限耐久并等待恢复, outcome: 消耗恢复约束持续进攻, sourceIds: [source-action-design-difficulty] }
  - { id: loop-mh-mixed, gameId: monster-hunter, subject: 怪物猎人的混合循环, mechanism: 耐力道具弹药负反馈与武器强化、部位硬直、异常、疲劳、骑乘、环境正反馈叠加，再以抗性和击飞保护抑制失控, outcome: 长狩猎产生丰富动态同时避免无限控制或受击连死, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：正/负描述状态偏离方向，不等于好/坏；PVE/PVP、战斗时长和参与感决定需要多强的放大或抑制。
---

## 定义

来源把正反馈定义为某状态出现后更容易继续出现，因而放大偏差；负反馈则让同状态更难继续，促使系统回到稳定附近。动作中的受击硬直天然正反馈：挨打动作让受击方更容易继续挨打，于是形成 Combo 与控制链。

## 常见正反馈

护甲、击晕、韧性、大受击和断肢处决限制但没有消除受击正反馈。资源则常采用“积累—爆发”：命中或造成伤害积累 Devil Trigger、魔晶、怒气或格斗 Power，再换取更大优势。

## 常见负反馈

浮空保护、连段伤害修正、击倒/起身无敌让已受击者更难继续受伤。体力、技能冷却和武器耐久属于“消耗—恢复”：扩大优势必须支付有限资源，供应速率限制连续进攻。

## 《怪物猎人》的结合

来源以《怪物猎人》说明长战斗如何叠加循环：基础耐力、道具和弹药偏负反馈；太刀、双剑、斩斧与狩技增加正反馈；部位、异常、疲劳、骑乘和环境制造窗口；异常抗性、疲劳/骑乘保护和玩家击飞保护又避免无限连。作者还保留白电龙连段致死作为“保护并未完全杜绝极端情况”的反例。

## 条件差异

来源倾向认为 PVE 可更放心地用正反馈制造爽快，PVP 需更多负反馈维持失败方参与；高频动作更常用积累爆发，低频动作更常用消耗恢复平衡节奏。它们是倾向，不是排他规则。
