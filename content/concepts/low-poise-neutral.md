---
id: low-poise-neutral
kind: concept
title: 低韧性敌人的立回
aliases: [无常驻霸体立回, 低韧人形破绽]
summary: 低韧人形以动作霸体、读指令、防御、闪避、受身和反击限制先手与无限输出。
domainIds: [domain-combat, domain-enemy-boss]
depth: 3
tags: [立回, 低韧性, 人形Boss]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: neutral-and-openings }
  - { kind: related_to, target: round-based-humanoid }
  - { kind: related_to, target: pseudo-equal-humanoid }
  - { kind: exemplified_by, target: nioh2-saito-toshimitsu }
citations:
  - { sourceId: source-combat-approaches, locator: 一、立回／② 抓时机反击打出硬直 }
media: []
examples:
  - { id: neutral-dmc3-vergil, gameId: devil-may-cry, subject: 鬼泣 3 维吉尔, mechanism: 自由态架开先手，攻击动作受击后短退；抓攻击后摇可打满 13hit，拼刀中断攻击可输出更长, outcome: 破绽中攻击间隔过长会触发 Boss 提前反击, sourceIds: [source-combat-approaches] }
  - { id: neutral-bayonetta2-balder, gameId: bayonetta, subject: 猎天使魔女 2 巴尔德, mechanism: 常态大量读指令闪避，主要通过闪避进入魔女时间反击，持续射击是少数常态硬直窗口, outcome: 把魔女时间明确设为主要反击入口, sourceIds: [source-combat-approaches] }
  - { id: neutral-ngs2-genshin, gameId: ninja-gaiden, subject: 忍龙 Sigma 2 幻心, mechanism: 约三至四招后脱离且可闪避取消部分后摇, outcome: 并非每招有破绽，抓后摇具有较大随机性, sourceIds: [source-combat-approaches] }
  - { id: neutral-gow4-sigrun, gameId: god-of-war, subject: 战神 4 希格露恩, mechanism: 动作与后撤多带霸体，攻击后摇才是窗口，受击后撤或反击有可辨前摇, outcome: 难点集中在记忆多套连段并正确应对, sourceIds: [source-combat-approaches] }
  - { id: neutral-elden-malenia, gameId: elden-ring, subject: 艾尔登法环玛莲妮亚, mechanism: 动作期间霸体但无常驻霸体，并有可正常打断的低韧招式；机制层面另有吸血, outcome: 具体招式的水鸟、魂系神经刀、出手择和 combo 快慢变化构成立回难点，并与有意压低的人物性能密不可分, sourceIds: [source-combat-approaches] }
  - { id: neutral-sekiro-isshin, gameId: sekiro, subject: 只狼一心, mechanism: 受击后转防御再架开反击，双方弹开信号决定攻守转换, outcome: 规律性高于来源对忍龙和仁王案例的描述，但来源明确说不一定需遵循此思路, sourceIds: [source-combat-approaches] }
  - { id: neutral-sekiro-genichiro-phase-3, gameId: sekiro, subject: 只狼三阶段弦一郎, mechanism: 霸体人形也会规律转防御再反击, outcome: 说明稳定攻守转换并非低韧一心案例的专属规则，也构成“不一定需遵循此思路”的并列限定, sourceIds: [source-combat-approaches] }
  - { id: neutral-nioh2-saito, gameId: nioh, subject: 仁王 2 斋藤利三的基础立回, mechanism: 两击硬直或一击大硬直后防御，防御受击时随机后撤、侧闪、防反或直接反击, outcome: 立回主要承担压低精力的前置作用, sourceIds: [source-combat-approaches] }
  - { id: neutral-sifu-yang, gameId: sifu, subject: 师父杨, mechanism: 记忆连段、反应出手与变招，通过闪避短时停和弹反架开特定招式创造破绽, outcome: 进攻节奏快且反应要求高, sourceIds: [source-combat-approaches] }
  - { id: neutral-mgrr-sam, gameId: metal-gear-rising, subject: MGRR 山姆, mechanism: 常驻霸体需积累削韧，但弹反可直接造成硬直并作为空连起手, outcome: 可弹反招式本身就是可识别破绽, sourceIds: [source-combat-approaches] }
editorialSynthesis: 编者归纳：低韧不等于玩家拥有先手权；“何时能打肉、何时会退出、退出是否可读”才决定立回结构。
---

## 来源观点

若无霸体敌人一摸就持续硬直，立回便会消失。常见限制包括：只在攻击动作期间霸体；从受击中转防御、弹开、受身、后撤或反击；自由态以高优先级读指令回避、防反，甚至在动作中取消。它们共同限制随意先手和无限输出，使玩家只能抓特定窗口进行有限反击。

## 案例差异

十个来源案例都围绕“抓破绽打一套”，但破绽分别来自固定后摇、魔女时间、随机脱离间隙、连段记忆、可打断招式、弹开信号、精力压制前置或弹反硬直。仅凭共同标签无法预测具体打法。

玛莲妮亚的来源描述必须分层：机制上另有吸血；具体招式层面包括水鸟、魂系神经刀、出手择与 combo 快慢变化；这些立回难点又与有意压低的人物性能密不可分。不能把吸血机制、水鸟等招式限制和玩家性能限制混成同一个机制判断。

一心遵循受击后转防御、再架开反击的规律，但来源明确说明玩家不一定需遵循此思路；同时，霸体人形三阶段弦一郎也会规律转防御再反击。这个并列例子限制了把该攻守转换写成低韧一心专属解法的范围。

## 高 AI 补充

来源另提到《忍龙》初代假龙、《猎天使魔女 1》贞德、《神之手》魔之手和《鬼泣 4》黑但丁等拟似对等人形。它们缺少稳定破绽，并把玩家端零帧或高性能动作搬给 AI；当硬直中仍随机防反、闪避或霸体反击时，来源认为通常不再适合用普通立回思路概括。
