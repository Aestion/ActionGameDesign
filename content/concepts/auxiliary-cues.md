---
id: auxiliary-cues
kind: concept
title: 辅助提示：UI、特效与音效
aliases: [辅助设计, UI提示, 音效提示]
summary: 当动画轮廓不足、对象太小或威胁来自屏外时，用额外视觉与声音信号补充出手时机和方向。
domainIds: [domain-presentation]
depth: 2
tags: [UI, 特效, 音效, 可读性]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-presentation }
  - { kind: related_to, target: animation-readability }
  - { kind: related_to, target: camera-and-fov }
  - { kind: related_to, target: enemy-attack-allocation }
citations:
  - { sourceId: source-action-design-difficulty, locator: 4.1.3 辅助设计 }
media:
  - sourcePath: ../../动作游戏设计之难_assets/104038ydudihxjxvxxiddk.jpg
    src: media/104038ydudihxjxvxxiddk.jpg
    alt: 死亡细胞中敌人攻击前头顶出现黄色感叹号
    caption: 原说明：《死亡细胞》中怪物攻击前的感叹号提示；大视野令单位较小，UI 同时提高可读性并降低独立动画成本。
    kind: image
    sourceId: source-action-design-difficulty
examples:
  - { id: cue-dead-cells, gameId: dead-cells, subject: 死亡细胞黄色感叹号, mechanism: 高速移动和大视野下在小单位攻击前显示 UI, outcome: 补足短帧动画的时机可读性并节约动画成本, sourceIds: [source-action-design-difficulty] }
  - { id: cue-gow, gameId: god-of-war, subject: 战神2018黄圈与腰间罗盘, mechanism: 圈形与方位 UI 标示攻击性质和屏外方向, outcome: 越肩小视野下仍能处理周边威胁, sourceIds: [source-action-design-difficulty] }
  - { id: cue-bayo, gameId: bayonetta, subject: 猎天使魔女白光与喇叭声, mechanism: 敌人出手前白光，号兵远程攻击配独特音效, outcome: 在高速群战与屏外威胁中提供跨模态提示, sourceIds: [source-action-design-difficulty] }
  - { id: cue-mordor, gameId: middle-earth-shadow, subject: 暗影魔多招架与射击提示, mechanism: UI 明示近战招架和远程攻击, outcome: 让大量包围敌人的轮流出手易于处理, sourceIds: [source-action-design-difficulty] }
  - { id: cue-hellblade, gameId: hellblade, subject: 地狱之刃脑内声音, mechanism: 语音提醒视野外威胁, outcome: 用角色叙事化声音承担战斗提示, sourceIds: [source-action-design-difficulty] }
  - { id: cue-furi, gameId: furi, subject: Furi近战出剑音效, mechanism: 敌人攻击前用声音标记时机, outcome: 在视觉弹幕和近战信息重叠时补充反应线索, sourceIds: [source-action-design-difficulty] }
editorialSynthesis: 编者归纳：UI/音效不是动画“失败后的补丁”这一种角色；它也可表达屏外方向、无障碍和角色主题，但必须与真实窗口稳定对应。
---

## 为什么需要辅助

相机需要大视野、对象很小、动作帧数少或威胁来自屏外时，动画本身可能无法传达足够信息。感叹号、圆环、闪光、罗盘、语音和辨识度高的效果音可标记攻击是否发生、来自哪里、何时需要回应。

## 来源立场与条件

来源认为，越依赖动作表现的游戏越不愿只用纯 UI 指示出手，但特效经常不可少。《死亡细胞》也说明独立团队可以用 UI/特效在低动画成本下获得足够功能传达。这个判断是倾向，不是“UI 越少越高级”的排名。

## 设计检查

提示需与动作窗口一致，避免视觉和声音互相冲突；屏外提示要区分方向或威胁类型；多通道提示能降低只依赖颜色或单一听觉的障碍。
