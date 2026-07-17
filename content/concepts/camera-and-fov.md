---
id: camera-and-fov
kind: concept
title: 相机、FOV 与后处理
aliases: [视野设计, Field of View, 战斗相机, 锁定相机]
summary: 用视野范围、对象大小、注意位置、相机模式和动态模糊分配玩家能看见与能读懂的信息。
domainIds: [domain-presentation]
depth: 2
tags: [相机, FOV, 动态模糊, 可读性]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-presentation }
  - { kind: related_to, target: space-precision }
  - { kind: related_to, target: enemy-attack-allocation }
  - { kind: related_to, target: spectacle-techniques }
citations:
  - { sourceId: source-action-design-difficulty, locator: 4.1.1 相机；Field of View；相机运动模式；后处理 }
media:
  - sourcePath: ../../动作游戏设计之难_assets/103959jihtubqjbth59det.jpg
    src: media/103959jihtubqjbth59det.jpg
    alt: 大FOV与小FOV动作游戏画面对照图
    caption: 原文 FOV 对照图：大 FOV 一侧列《鬼泣》《猎天使魔女》《忍者龙剑传》，小 FOV 一侧列《荣耀战魂》《血源诅咒》《怪物猎人》，展示视野范围与对象大小的取舍。
    kind: image
    sourceId: source-action-design-difficulty
  - sourcePath: ../../动作游戏设计之难_assets/104002gihz9rd995r44djc.gif
    src: media/104002gihz9rd995r44djc.gif
    alt: 四分之一速度下血源诅咒孤儿Boss快速动作带动态模糊
    caption: 原说明：1/4 速度下《血源诅咒》，动态模糊帮助捕捉 Boss 最快动作，锁定相机强化 1v1；素材源自 Kamies 的 Orphan of Kos 指南。
    kind: gif
    sourceId: source-action-design-difficulty
examples:
  - { id: fov-dmc, gameId: devil-may-cry, subject: 鬼泣, mechanism: 较大 FOV 容纳群战和空间运动, outcome: 更早看见周边威胁但单个对象变小, sourceIds: [source-action-design-difficulty] }
  - { id: fov-bayo, gameId: bayonetta, subject: 猎天使魔女, mechanism: 大视野配自由/锁定相机和屏外声音, outcome: 支撑 1vN 的环境掌握, sourceIds: [source-action-design-difficulty] }
  - { id: fov-ng, gameId: ninja-gaiden, subject: 忍者龙剑传, mechanism: 较大视野呈现高速群战, outcome: 给进入视野的高速对象更多应对时间, sourceIds: [source-action-design-difficulty] }
  - { id: fov-for-honor, gameId: for-honor, subject: 荣耀战魂, mechanism: 较小 FOV 和锁定构图集中当前对手, outcome: 强化方向攻防与 1v1 阅读, sourceIds: [source-action-design-difficulty] }
  - { id: fov-bloodborne, gameId: bloodborne, subject: 血源诅咒, mechanism: 小视野与锁定相机放大单个 Boss，动态模糊保留快速轨迹, outcome: 便于读招拆招但压缩周边信息, sourceIds: [source-action-design-difficulty] }
  - { id: fov-mh, gameId: monster-hunter, subject: 怪物猎人, mechanism: 相对集中视野放大大型目标部位, outcome: 有利观察打点但贴身时可能破坏完整剪影, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：图中的“大/小”是来源的相对比较，不是固定角度数据；FOV、屏幕比例、相机距离和目标大小必须一起判断。
---

## 基本取舍

来源归纳四条可读性倾向：对象越大、越靠近注意中心、画面越简单、图像越清晰，越容易读。FOV 大能看更多环境并提前发现高速进入的物体，适合 1vN 和速度感；FOV 小让每个对象更大、注意更集中，适合 1v1 读招。

## 相机模式

- 自由相机在看环境和看角色之间平衡。
- 战斗相机可进入战斗后增大 FOV，帮助掌握遭遇。
- 锁定相机让目标保持在特定位置，服务高速追踪或 1v1。
- 演出相机让构图和镜头运动成为表演的一部分。

开放世界常在玩法间切换模式；变化既可能服务演出，也要帮助玩家理解空间。

## 后处理

多数后处理偏艺术效果；动态模糊却可把极快动作连接成可捕捉轨迹。《血源诅咒》素材同时展示动态模糊和锁定构图。模糊过强也可能掩盖轮廓，因此它是条件性辅助，不是速度越快越该增加。
