---
id: pseudo-equal-humanoid
kind: concept
title: 拟似对等型低韧人形
aliases: [对等型人形, 高 AI 人形 Boss, 类格斗 AI]
summary: 局部模拟玩家性能和 PVP 交互，以读指令、快速出手、取消和早脱离避免变成沙包，却提高随机性与学习成本。
domainIds: [domain-enemy-boss]
depth: 2
tags: [低韧性, 高AI, 读指令, 人形Boss]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-enemy-boss }
  - { kind: contrasts_with, target: round-based-humanoid }
  - { kind: conflicts_with, target: high-ai-vs-learnability }
  - { kind: exemplified_by, target: dmc4-dante }
  - { kind: exemplified_by, target: bayonetta-jeanne }
  - { kind: exemplified_by, target: ninja-gaiden-doppelganger }
  - { kind: exemplified_by, target: nioh2-saito-toshimitsu }
  - { kind: related_to, target: wakeup-and-resource-suppression }
citations:
  - { sourceId: source-low-poise-boss, locator: 三、对等型人形；四、小结 }
media: []
examples: []
editorialSynthesis: 编者归纳：高 AI、玩家镜像与高质量不是同义词；应分别检查能力是否对等、反馈是否可读、学习是否能稳定降低不确定性。
---

## 设计目标

拟似对等型试图模拟玩家性能并局部复刻 PVP。它不能随意加霸体，又不能成为沙包，因此在四个方面呈现共同结构。

## 自由态防硬直

自由态用读指令闪避、读指令防御，或结合位置和指令抢先反攻，让玩家不能随意起手。

## 出手时防硬直

Boss 可能出手极快、攻势密度高而难在发生中打断，或仅给特定动作霸体。它不必全程高韧，也能让主动断招变得不稳定。

## 基础破绽

玩家仍可抓后摇、用反技打硬直或提前打康；但后摇短、概率取消、任意阶段取消，以及玩家追击性能受限，会让这些入口难以稳定。反技也可能只针对少数攻击，或要求预判 AI。

## 脱离形式

常见退出是切防御、后撤、架开和强制击飞。来源特别说明，许多看似“霸体反击”的过程其实先切防御，切防御动作才是脱离本体。相比标准回合型，这类 Boss 通常更早退出玩家回合。

## 来源批评与反论

来源总结四类负面结果：随机性高、处理不稳定；玩家级性能带来拼反应乃至不可反应招；学习成本远高于单纯背招；复杂 AI 又容易暴露漏洞，最终被大众用逃课方法打成沙包。它要求玩家长期训练感官、熟悉双方每个动作的硬直，并研究抢先手、追击和压起身；即使如此仍可能充满随机性。

另一方面，拟似对等能提供交互真实性、镜像能力和近似 PVP 的压迫。冲突卡保留这项目标，不把作者对大众接受度的批评变成无条件排名。

## 主流 ARPG 适用限制

来源认为它不适合直接用于主流 ARPG：玩家进度、构筑和容错差异大，若学习成本与随机性很高而数值又不匹配，就会出现磨很久血皮却反手被秒的挫败，玩家只想逃课。《仁王》的低精力压制改善中后期体验，但新手开荒不熟 AI、精力也难支撑操作，初期仍可能成为劝退点。
