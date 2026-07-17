---
id: dmc4-dante
kind: case
title: 鬼泣 4 但丁／黑但丁
aliases: [DMC4 Dante, 黑但丁]
summary: 以玩家同模组、读指令回避、风格切换、保护吹飞和可利用 AI 构成的拟似对等人形。
domainIds: [domain-enemy-boss, domain-combat]
depth: 3
tags: [详细案例, 低韧性, 读指令, 拟似对等]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: applies_to, target: pseudo-equal-humanoid }
  - { kind: applies_to, target: low-poise-neutral }
  - { kind: related_to, target: setplay }
citations:
  - { sourceId: source-low-poise-boss, locator: 三、对等型人形／1. 鬼泣4 但丁／黑但丁 }
  - { sourceId: source-combat-approaches, locator: 一、立回／② 补充 }
media: []
examples:
  - { id: case-dmc4-dante-ai, gameId: devil-may-cry, subject: 鬼泣 4 但丁与黑但丁完整 AI 案例, mechanism: 同模组高速出手、读指令跳滚反击、皇家护卫一闪、取消、保护吹飞与攻击密度反击共同限制先手和连击, outcome: 正常互动随机且破绽短，玩家常转而利用对枪、距离、风格和保护规则形成伪连或速杀, sourceIds: [source-low-poise-boss, source-combat-approaches] }
editorialSynthesis: 编者归纳：该案例同时展示“镜像能力带来真实交互”和“AI 权限与可利用漏洞削弱稳定学习”，不能只用高 AI 或粪怪概括。
---

## 来源事实：自由态与出手

自由态会读指令跳跃或翻滚，随后派生突刺、下劈、跳喷和落地平 A；读取还结合招式与位置，所以可被丢玫瑰骗躲，远距离次元斩则可能不触发回避。Boss 与玩家使用同模组，出手极快且可拼刀、打断，但招式间隔能以跳跃或翻滚取消，使主动断招不稳定。

## 来源事实：防御、破绽与脱离

切换皇家护卫后会在自由态一闪玩家招式，需要先骗一闪并等待风格切换。后摇短而难抓，面对长连段时百万突刺等抢断更实用；读指令翻滚派生突刺又可被一闪加升龙反利用。连击到一定 hit 会触发强制保护性吹飞，带破甲枪械能延长吹飞；攻击密度不足则可能触发后撤冲拳等反击。

## 来源事实：AI 漏洞与实际路线

来源列出大量实际利用：对枪时不规避尼禄鬼手，可形成伪连或无限连；百万突刺抢先手；远距离次元斩磨血；抛剑控制后阎魔刀输出；利用反击 AI 一闪接真升龙；降低攻击节奏让百裂脚不触发保护；特别版还可能被无限浮空。这些路线说明复杂 AI 不会自动带来稳定的正面立回。

## 条件与限制

“与玩家同模组”不代表控制权限、读取信息与决策延迟真正对等。来源的机制描述和价值判断均保留为作者立场；本案例不把利用漏洞视为唯一正确打法。
