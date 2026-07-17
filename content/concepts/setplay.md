---
id: setplay
kind: concept
title: 定番
aliases: [稳定流程, 引招, 控制循环]
summary: 事先规划并稳定复刻战斗，使敌方行动规律被玩家掌控，即使未持续硬直也降低随机性。
domainIds: [domain-combat]
depth: 2
tags: [定番, 控制循环, 引招, 控血]
reviewStatus: reviewed
updated: 2026-07-17
relations:
  - { kind: child_of, target: domain-combat }
  - { kind: related_to, target: suppression }
  - { kind: related_to, target: fixed-sequence }
citations:
  - { sourceId: source-combat-approaches, locator: 四、定番 }
media: []
examples:
  - { id: setplay-mh-kushala, gameId: monster-hunter, subject: 怪物猎人钢龙头部硬直循环, mechanism: 精确积累头部伤害反复触发倒地, outcome: 用控制效果把大型霸体敌人锁入可复刻循环, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc5-goliath, gameId: devil-may-cry, subject: 鬼泣 5 歌莉娅火箭拳, mechanism: 火箭拳配合破甲倒地硬直, outcome: 将 Boss 锁在第一阶段, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc4-dante-grab, gameId: devil-may-cry, subject: 鬼泣 4 但丁抓取硬直, mechanism: 抓取重置空中受击脱离次数并穿插挑空与浮空技, outcome: 对有脱离保护的人形形成无限连, sourceIds: [source-combat-approaches] }
  - { id: setplay-nioh2-spear-loop, gameId: nioh, subject: 仁王 2 长枪素质三连, mechanism: 人形大硬直后固定防御，闪身造成换位硬直并迅速追刀, outcome: 反复利用固定防御 AI 长时间屈死, sourceIds: [source-combat-approaches] }
  - { id: setplay-sifu-wall, gameId: sifu, subject: 师父墙边眩晕循环, mechanism: 抛掷、掌击、蓄力和再次抛掷反复触发撞墙小眩晕, outcome: 把 Boss 固定在墙边硬直循环, sourceIds: [source-combat-approaches] }
  - { id: setplay-doom-control, gameId: doom, subject: DOOM 永恒控制覆盖, mechanism: 弱硬直、强硬直配合冰冻、眩晕与微波控制按冷却和覆盖关系连接, outcome: 用一套组合控制抬走敌人, sourceIds: [source-combat-approaches] }
  - { id: setplay-killing-floor-2, gameId: killing-floor-2, subject: 杀戮空间 2 元素与物理控制, mechanism: 理解控制优先级、覆盖和触发冷却后依次施加, outcome: 使敌人进入可规划硬直循环, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc5-nero-urizen, gameId: devil-may-cry, subject: 鬼泣 5 尼禄 M8 站立尤里森, mechanism: 打断三次水晶修复, outcome: 大幅减少有水晶立回时长并缩减无水晶招式类型, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc5-dante-familiars, gameId: devil-may-cry, subject: 鬼泣 5 但丁 M18 三魔宠, mechanism: 打空两只宠物血量后打断噩梦回血, outcome: 把多目标战转化为一对一, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc3-cerberus, gameId: devil-may-cry, subject: 鬼泣 3 冰狗驯狗腿, mechanism: 打趴后利用固定低吼恢复冰块的后摇打满伤害再次击倒，并先诱导朝向避免地形挤压, outcome: 根据硬直后规律行动形成循环, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc3-geryon, gameId: devil-may-cry, subject: 鬼泣 3 时停马 DMD, mechanism: 场地中央击倒后诱导固定大回旋，起步瞬间跳劈阻止再次起步, outcome: 避免时停脱离并形成伪锁, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc1-nelo-angelo, gameId: devil-may-cry, subject: 鬼泣 1 黑骑士, mechanism: 利用小硬直一击即防与大硬直延迟防御的交替规律，安排逼防和破防, outcome: 构造可重复的小硬直与大硬直循环, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc3-beowulf, gameId: devil-may-cry, subject: 鬼泣 3 贝奥武夫控血, mechanism: 在固定缩角落扔铁笼的转阶段行为前磨血并集中爆发, outcome: 跳过难规避的二阶段乃至羽毛射击三阶段, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc5-urizen-health, gameId: devil-may-cry, subject: 鬼泣 5 拳皇尤里森控血, mechanism: 预存爆发跨越血线, outcome: 禁真魔人无伤条件下跳过弹幕齐发二阶段, sourceIds: [source-combat-approaches] }
  - { id: setplay-nioh2-kashin-koji, gameId: nioh, subject: 仁王 2 果心居士控血控精, mechanism: 先引一次无分身常暗，再在第二次强制血线前压低精力并空精混沌爆发, outcome: 避开低于半血常暗分身机制, sourceIds: [source-combat-approaches] }
  - { id: setplay-sifu-fajar, gameId: sifu, subject: 师父大师法贾一阶段, mechanism: 保持特定距离让 AI 复读蹬墙下劈, outcome: 位置引招把多种行动收束为固定招式, sourceIds: [source-combat-approaches] }
  - { id: setplay-nioh-nightmare-bringer, gameId: nioh, subject: 仁王祸梦鬼, mechanism: 拉远后仅保留地波、剑插地和红光冲撞，并用纳闪远程逼红光, outcome: 稳定削精上限或妖反倒地, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc3-nevan, gameId: devil-may-cry, subject: 鬼泣 3 奈文, mechanism: 破衣恢复时读取远距离位置并在舞台聚集旋转，此时用冲拳或升龙一击破衣, outcome: 稳定循环破衣并无限压制, sourceIds: [source-combat-approaches] }
  - { id: setplay-sifu-yang, gameId: sifu, subject: 师父杨一阶段骤雨引招, mechanism: 骤雨两击后扫腿使杨固定下段闪避并二连爪反击, outcome: 指令读取被转化为可重复反击循环, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc4-dante-gun-bait, gameId: devil-may-cry, subject: 鬼泣 4 但丁对枪引招, mechanism: 玩家开枪使但丁必定对枪，期间不读指令闪避鬼手抓取, outcome: 不会无限连的玩家也能用引招建立定番, sourceIds: [source-combat-approaches] }
  - { id: setplay-nioh2-ren-hayabusa, gameId: nioh, subject: 仁王 2 隼涟反击读取, mechanism: 小硬直后必定立刻反击，可用风神三接霜风诱导百舌鸟接白刃, outcome: 把固定反击组织成百分百可复刻组合, sourceIds: [source-combat-approaches] }
  - { id: setplay-ng2-blood-genshin, gameId: ninja-gaiden, subject: 忍龙 2 血神屈上, mechanism: 特定招式触发读指令反应后复读同一行动, outcome: 形成特殊的指令型定番, sourceIds: [source-combat-approaches] }
  - { id: setplay-souls-build, gameId: souls-series, subject: 魂系配装爆发定番, mechanism: 事前准备增益、道具和资源集中输出, outcome: 用数值和资源跳过部分行动阶段, sourceIds: [source-combat-approaches] }
  - { id: setplay-nioh-build, gameId: nioh, subject: 仁王配装爆发定番, mechanism: 用构筑、增益和资源预先安排爆发窗口, outcome: 在 ARPG 配装条件下缩短或固定 Boss 流程, sourceIds: [source-combat-approaches] }
  - { id: setplay-gow4-build, gameId: god-of-war, subject: 战神 4 配装爆发定番, mechanism: 用增益、道具和蓝量或冷却资源事前准备, outcome: 把 Boss 处理压缩为规划好的爆发段, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc4-burst, gameId: devil-may-cry, subject: 鬼泣 4 大型 Boss 爆发, mechanism: 利用 Boss 普遍较薄的血量和角色高爆发, outcome: 可在一轮输出内击杀, sourceIds: [source-combat-approaches] }
  - { id: setplay-dmc5-m8-rocket-fist, gameId: devil-may-cry, subject: 鬼泣 5 M8 尤里森火箭手多策略定番, mechanism: 三轮破甲、投技压血线、火箭拳打断回盾，并调整伤害破甲比与预存眩晕, outcome: 同时运用打断特定行动和控血控制规律，消掉全部护盾, sourceIds: [source-combat-approaches] }
editorialSynthesis: 编者归纳：定番的核心不是“敌人一直硬直”，而是敌方选择被位置、指令、血线、硬直恢复或控制冷却压缩到可计划范围。
---

## 来源定义

定番是按事先规划的策略让战斗沿玩家设计的流程运行，熟练后可稳定复刻。它与压制重叠，但真正特征是玩家掌控敌方行动规律；敌人即使仍在行动，也像提线木偶，随机性很小。

## 七类入口

来源依次列出：循环触发控制；控制打断特定行动；利用硬直恢复后的固定行动；控血跨阶段；以位置或指令引招；配装或资源爆发；利用环境与地形。每类都可能只覆盖局部，不要求整场无缝锁死。

## 多策略并行

鬼泣 5 M8 尤里森案例同时处理破甲、血线、回盾、眩晕和招式伤害比。来源用它说明硬核定番通常不是单一技巧，而是多个可复刻策略叠加，并有实际练习成本。

## 条件与边界

定番可以来自设计明确给出的规律，也可以来自玩家发现的 AI 行为。它不是对所有作品都适用的最佳答案；当敌人取消、随机反击或系统保护打破复刻，流程会重新转为立回。
