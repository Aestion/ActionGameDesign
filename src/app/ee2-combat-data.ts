export interface EE2Principle {
  index: string;
  title: string;
  text: string;
  playerQuestion: string;
}

export interface EE2LoopStage {
  index: string;
  state: string;
  owner: string;
  playerTask: string;
  transition: string;
}

export type EE2InteractionRouteId = "compare" | "opening" | "weakness";

export interface EE2ControlRoute {
  id: EE2InteractionRouteId;
  verb: string;
  title: string;
  playerAction: string;
  enemyState: string;
  trigger: string;
  tools: string;
  reward: string;
  boundary: string;
}

export interface EE2EnemyRule {
  dimension: string;
  question: string;
  decision: string;
}

export interface EE2SystemDecision {
  problem: string;
  decision: string;
  rationale: string;
}

export interface EE2Prototype {
  type: string;
  purpose: string;
  mainRoute: string;
  alternateRoute: string;
  exit: string;
  proves: string;
}

export interface EE2KnowledgeReference {
  id: string;
  title: string;
  contribution: string;
}

export const ee2Principles: EE2Principle[] = [
  {
    index: "01",
    title: "读懂当前权限",
    text: "先判断敌人处于自由、出招、破绽还是脱离阶段，再观察距离、朝向、攻击趋势和可攻击部位。",
    playerQuestion: "现在谁能主动？"
  },
  {
    index: "02",
    title: "选择夺权方式",
    text: "根据敌人的状态选择招式等级对等、抓主动破绽，或触发弱点与特定机制。",
    playerQuestion: "我用什么改变状态？"
  },
  {
    index: "03",
    title: "兑现并交还权限",
    text: "进入有限输出后，在即时伤害、站位延续和安全收手之间取舍，并识别敌人的脱离信号。",
    playerQuestion: "这次窗口换什么收益？"
  }
];

export const ee2LoopStages: EE2LoopStage[] = [
  {
    index: "01",
    state: "自由态",
    owner: "双方都可主动",
    playerTask: "走位、试探、观察攻击倾向，为招式博弈准备距离与时机。",
    transition: "敌我任一方出招后进入争夺态。"
  },
  {
    index: "02",
    state: "争夺态",
    owner: "行动权正在交换",
    playerTask: "在闪避、防御、相杀、断招和抢位置之间选择，不只等待敌人动作结束。",
    transition: "成功处理敌招或完成机制条件后进入破绽态；失败则承受敌方输出。"
  },
  {
    index: "03",
    state: "破绽态",
    owner: "玩家获得确认",
    playerTask: "确认破绽来源和窗口长度，决定立刻输出还是调整站位、目标与资源。",
    transition: "首个有效攻击或处决动作将破绽转为输出态。"
  },
  {
    index: "04",
    state: "输出态",
    owner: "玩家暂时主导",
    playerTask: "在有限窗口内完成伤害，并决定继续贴身、调整站位还是提前收手。",
    transition: "窗口预算耗尽、敌人执行可读脱离或敌人死亡后结束。"
  },
  {
    index: "05",
    state: "脱离态",
    owner: "权限返回中",
    playerTask: "识别防御、后撤、反击或保护动作，选择停手、追击或提前准备下一轮。",
    transition: "脱离完成后回到自由态；高阶追击只能缩短重置，不能取消所有边界。"
  }
];

export const ee2ControlRoutes: EE2ControlRoute[] = [
  {
    id: "compare",
    verb: "比",
    title: "招式等级对等",
    playerAction: "选择出招时机与招式等级",
    enemyState: "敌人正在出招",
    trigger: "双方招式相交时，比较打断等级与抗打断等级。",
    tools: "选择合适的出招时机与招式等级，或用相杀反制敌招。",
    reward: "直接把敌人打入僵直，提前取得玩家输出回合。",
    boundary: "等级关系必须稳定且可读；频繁例外会让玩家无法形成判断。"
  },
  {
    id: "opening",
    verb: "抓",
    title: "抓主动破绽",
    playerAction: "走位、闪避或防御后反击",
    enemyState: "敌人暴露后摇或攻击间隙",
    trigger: "敌人使用破绽招，或进入固定后摇、散步和攻击间隙。",
    tools: "走位、闪避、防御和对敌人收招规律的观察。",
    reward: "稳定取得一次基础输出窗口，是学习敌人的主要路径。",
    boundary: "破绽必须可以复盘，不能被随机取消或无提示脱离反复没收。"
  },
  {
    id: "weakness",
    verb: "触",
    title: "触发弱点机制",
    playerAction: "使用弱点对应手段",
    enemyState: "敌人满足专属弱点条件",
    trigger: "命中特定弱点、使用指定手段，或完成敌人专属条件。",
    tools: "弱点打击、特定招式、背向攻击或明确的条件累积。",
    reward: "用更高准备成本换取更长僵直，或改变当前战斗阶段。",
    boundary: "这是按敌人配置的入口，默认不新增所有敌人共享的通用计量条。"
  }
];

export const ee2InteractionOutcome = [
  "敌人僵直",
  "玩家有限输出",
  "敌人可读脱离",
  "回到招式博弈"
] as const;

export const ee2EnemyRules: EE2EnemyRule[] = [
  {
    dimension: "自由态",
    question: "敌人未出招时如何争夺先手？",
    decision: "为追击、散步、防御、回避或读指令选一个主要行为。自由态可以强势，但不能同时拥有高速先手、无条件闪避和无提示反击。"
  },
  {
    dimension: "出招时",
    question: "哪些招式能被什么手段打断？",
    decision: "明确敌招的打断等级与抗打断等级，并固定比较规则。玩家应能从前摇、特效或姿态判断这次对等关系。"
  },
  {
    dimension: "破绽形式",
    question: "玩家如何稳定取得一次确认？",
    decision: "配置一种稳定主破绽和一种高阶替代破绽。主破绽保证可学习，高阶破绽允许熟练玩家提前夺权或换取更高收益。"
  },
  {
    dimension: "脱离形式",
    question: "敌人何时、怎样结束玩家输出？",
    decision: "只配置一种主要脱离和一种紧急保护，动作必须有可辨前兆。确认窗口内不随机闪避、霸体或瞬移。"
  }
];

export const ee2SystemDecisions: EE2SystemDecision[] = [
  {
    problem: "资料边界必须先分清",
    decision: "EE2 原图只确认招式博弈、敌人僵直、玩家输出、敌人脱离，以及三类僵直入口；其他游戏的状态线不写入 EE2 既有规则。",
    rationale: "先保证事实层准确，再讨论哪些知识可以转化成设计建议。"
  },
  {
    problem: "招式等级容易退化成纯数值比较",
    decision: "等级只回答招式相交时谁能打断谁；距离、时机和风险仍由动作本身决定，并用统一表现提示比较结果。",
    rationale: "保留对等博弈，同时避免更高等级招式成为无条件最优解。"
  },
  {
    problem: "输出窗口可能无限延长或突然结束",
    decision: "每次破绽产生明确的窗口预算，由时间、承受伤害或脱离动作三者中的一种主要规则结算。窗口内的有效连段不能被随机权限打断。",
    rationale: "稳定窗口建立学习，明确退出避免敌人被连续硬直到死。"
  },
  {
    problem: "弱点机制容易变成固定解题",
    decision: "弱点应提供更长窗口或改变阶段，但不应删除招式对等与抓破绽两条基础路径。",
    rationale: "让专属机制增加敌人个性，而不是把战斗降成只找唯一开关。"
  },
  {
    problem: "条件累积只是可选入口",
    decision: "若个别敌人使用伤害次数或特定条件累积，应作为该敌人的专属规则；默认不增加一条全敌人共享的计量系统。",
    rationale: "保留原图提到的数值累积可能性，但不把可能方案误写成基础机制。"
  },
  {
    problem: "玩家无法分辨为什么成功或失败",
    decision: "为夺权成功、破绽确认、窗口将尽和敌人脱离分别使用稳定且不同的动作、声音与命中特征。表现可以华丽，但不能遮蔽人物位置和状态趋势。",
    rationale: "训练只能压缩稳定信息，无法补偿每次变化的提示。"
  }
];

export const ee2Prototypes: EE2Prototype[] = [
  {
    type: "主动型压迫者",
    purpose: "验证主动型敌人如何通过招式对等与明确后摇形成攻守转换。",
    mainRoute: "比：以合适等级的招式或相杀赢得僵直。",
    alternateRoute: "抓：绕开攻击范围或抓固定后摇。",
    exit: "窗口结束后用有前兆的震退回到自由态。",
    proves: "招式对等与抓破绽能否提供两种清晰但风险不同的处理。"
  },
  {
    type: "被动型破绽敌人",
    purpose: "验证敌人主动暴露破绽时，玩家能否识别并稳定完成一次输出。",
    mainRoute: "抓：识别敌人的破绽招和固定收招。",
    alternateRoute: "触：使用特定手段触发额外僵直。",
    exit: "输出结束后防御、后撤或反击，重新进入招式博弈。",
    proves: "玩家能否说清何时进攻、何时停手，以及敌人如何重新出手。"
  },
  {
    type: "弱点机制敌人",
    purpose: "验证专属弱点能否增加敌人个性，而不被误解为通用基础系统。",
    mainRoute: "触：命中明确弱点或完成特定条件，触发较长僵直。",
    alternateRoute: "抓：不触发机制时仍保留较短的基础破绽。",
    exit: "恢复动作结束输出，并改变下一轮的距离或朝向。",
    proves: "专属机制是否增加计划感，同时保留普通招式博弈。"
  }
];

export const ee2ValidationChecks = [
  "新玩家在三次遭遇后，能说出敌人的主破绽、主要脱离和至少一种替代夺权路径。",
  "记录首次取得破绽的时间、三条路径使用占比、窗口平均时长与重复同一解法的比例。",
  "复盘每次非预期受击：是读错招式等级或破绽信号、执行失败，还是敌人权限在相同表现下发生变化。",
  "任何敌人若同时依赖随机取消、无提示霸体和强制瞬移维持难度，应退回四维规则重新设计。"
];

export const ee2KnowledgeReferences: EE2KnowledgeReference[] = [
  { id: "neutral-and-openings", title: "立回与破绽", contribution: "定义破绽是站位、后摇、保护、反技与追击性能共同形成的状态。" },
  { id: "interruption", title: "断招", contribution: "补足主动 / 被动断招，以及资源、免疫和保护等防滥用边界。" },
  { id: "round-based-humanoid", title: "回合制攻防型低韧人形", contribution: "要求稳定破绽与可识别脱离共同构成攻守转换。" },
  { id: "low-poise-neutral", title: "低韧性敌人的立回", contribution: "解释低韧不等于玩家永久先手，关键是打肉窗口与退出是否可读。" },
  { id: "anti-armor-neutral", title: "霸体敌人的立回", contribution: "补足后摇、散步、盲区、距离和攻防一体技等主动窗口。" },
  { id: "feedback-loops", title: "动作系统中的正负反馈循环", contribution: "仅用于检查输出与脱离边界，不作为 EE2 既有机制的来源。" },
  { id: "compound-decisions", title: "高度复合型决策", contribution: "用于审视招式选择价值，不把节点中的游戏案例直接移植到 EE2。" },
  { id: "readability-priority-principles", title: "可读性优先的原则与条件", contribution: "要求状态、趋势和结果先被稳定传达，再增加表现复杂度。" }
];
