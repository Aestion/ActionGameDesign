---
id: souls-low-poise-exception
kind: concept
title: 魂类低韧人形的例外条件
aliases: [魂系低韧例外, 无取消低韧人形]
summary: 魂类玩家与敌人出手较慢、基本没有取消，使读指令低韧人形仍能被走位和提前打断稳定处理。
domainIds: [domain-enemy-boss]
depth: 3
tags: [魂系, 低韧性, 取消, 例外]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-enemy-boss }
  - { kind: contrasts_with, target: pseudo-equal-humanoid }
  - { kind: related_to, target: souls-framework }
citations:
  - { sourceId: source-low-poise-boss, locator: 五、例外（魂类游戏） }
media: []
examples:
  - { id: souls-exception-malenia, gameId: elden-ring, subject: 艾尔登法环玛莲妮亚, mechanism: 读指令低韧人形在无取消和较慢动作密度下仍可用走位提前打断出手, outcome: 来源认为其主要争议在水鸟等招式而非低韧对等机制本身, sourceIds: [source-low-poise-boss] }
editorialSynthesis: 编者归纳：这是一组改变适用性的条件差异，不是“魂系 AI 更公平”的普遍排名；具体招式仍可独立失败。
---

## 来源例外

魂类有 PVP、玩家机制 NPC 模组和近似玩家的 Boss，也会读指令，却没有产生与高速 ACT 案例同等的压制感。来源给出两个关键条件：己方和多数敌人出手没有过快到传统 ACT 自机的程度；魂游基本没有取消机制。

## 为什么更稳定

若玩家用走位而非翻滚规避，敌人不能靠取消在受击前立刻逃走，玩家可在其翻滚前打断出手。双方出手速度和攻击密度也不过分高，提前断招相对可执行。

## 玛莲妮亚的限制说明

来源用玛莲妮亚说明低韧机制可以稳定处理，并特别限定：女武神的主要争议来自水鸟等具体招式，而不是低韧、读指令和玩家近似机制本身。机制可接受不等于每个招式都合理。
