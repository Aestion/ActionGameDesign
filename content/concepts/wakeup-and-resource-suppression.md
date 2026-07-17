---
id: wakeup-and-resource-suppression
kind: concept
title: 压起身与行动资源条压制
aliases: [压起身, 空精压制, 资源条压制]
summary: 循环击倒、破甲或压低行动资源，在保护结束前重新建立硬直与倒地。
domainIds: [domain-combat, domain-enemy-boss]
depth: 3
tags: [压起身, 精力, 破甲]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: suppression }
  - { kind: related_to, target: low-poise-neutral }
  - { kind: related_to, target: pseudo-equal-humanoid }
citations:
  - { sourceId: source-combat-approaches, locator: 二、压制／③ 压起身；④ 行动资源条压制 }
  - { sourceId: source-low-poise-boss, locator: 三、对等型人形／斋藤利三；四、小结 }
media: []
examples:
  - { id: wakeup-dmc3-demon-armor, gameId: devil-may-cry, subject: 鬼泣 3 魔化怪破甲循环, mechanism: 浮空或倒地期间继续积累破甲并在墙角重新触发倒地, outcome: 以数值积累循环压起身, sourceIds: [source-combat-approaches] }
  - { id: wakeup-monster-hunter-overdamage, gameId: monster-hunter, subject: 怪物猎人部位硬直循环, mechanism: 在上一硬直动画结束前触发下一部位硬直会受超伤机制影响, outcome: 需要细致计算而不能简单连续触发, sourceIds: [source-combat-approaches] }
  - { id: wakeup-bayonetta-dog, gameId: bayonetta, subject: 猎天使魔女 1 妖刀 yyby 屈狗, mechanism: 特定招式前置短于敌人起身时间，在无敌起身脱离前重新按倒, outcome: 形成特定招式压起身循环, sourceIds: [source-combat-approaches] }
  - { id: wakeup-nioh1-backstab, gameId: nioh, subject: 仁王 1 搓背, mechanism: 利用倒地与起身窗口再次使人形敌人倒地, outcome: 在保护结束边界循环压起身, sourceIds: [source-combat-approaches] }
  - { id: wakeup-nioh2-thunder, gameId: nioh, subject: 仁王 2 轰雷打年糕, mechanism: 以特定攻击反复把起身敌人重新击倒, outcome: 把起身时序转化为持续压制流程, sourceIds: [source-combat-approaches] }
  - { id: resource-nioh-zero-ki, gameId: nioh, subject: 仁王空精压制, mechanism: 受击与防御受击削精或崩解，空精受击一击倒地、倒地两击起身，再迅速拉起身崩解, outcome: 以动作速度、崩解性能、回精量和身位形成有操作成本的循环, sourceIds: [source-combat-approaches, source-low-poise-boss] }
editorialSynthesis: 编者归纳：资源条为低韧人形提供了比纯读 AI 更可规划的第二层目标，但保护、回精与拉起身规则必须共同存在。
---

## 压起身

这里的“压起身”指循环把敌人打回倒地。带霸体的敌人需反复破除霸体；起身无敌者要在其脱离前重新击倒。数值积累与特定招式是来源列出的两条主要路线。

## 行动资源条

来源以《仁王》空精压制为代表：攻击和防御受击消耗精力，空精后一击倒地并高速回精，倒地受两击重新起身。玩家要迅速拉起身并再次崩解，过程受动作速度、招式崩解、敌人身位与实际回精量约束。

## 与低韧 Boss 的关系

低韧拟似对等 Boss 的纯立回可能随机且负反馈强；精力条把目标转成有操作成本的低精力压制。低韧来源认为《仁王 2》已把这一路线发展成熟，但明确限制在中后期：新手开荒既不熟 AI，也缺精力与操作能力，仍可能只能基础立回并被劝退。
