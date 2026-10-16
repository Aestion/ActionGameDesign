export interface CombatCycle {
  title: string;
  summary: string;
  steps: string[];
}

export interface CombatComparison {
  dimension: string;
  dmc5: string;
  ee2: string;
  implication: string;
}

export interface AnalysisPoint {
  label: string;
  text: string;
}

export interface AnalysisDimension {
  id: "problems" | "strengths" | "direction" | "differences" | "focus";
  label: string;
  thesis: string;
  points: AnalysisPoint[];
}

export interface CombatKnowledgeReference {
  id: string;
  title: string;
  reason: string;
}

export interface SourceTopicGroup {
  title: string;
  items: Array<{ label: string; text: string }>;
}

export const combatSourceTitle = "战斗博弈梳理2.vsdx";
export const combatSourceDiagramUrl = new URL("../assets/battle-gameplay-source.png", import.meta.url).href;

export const combatCycles: CombatCycle[] = [
  {
    title: "鬼泣 5：围绕敌人破防，进入玩家输出回合",
    summary: "原图把重点放在多层招式关系与玩家手段的组合，敌人更多承担被抓破绽、被压制和被击破的角色。",
    steps: ["战斗开始", "招式博弈", "敌人破防", "玩家输出", "敌人死亡"]
  },
  {
    title: "EE2：围绕僵直与脱离，明确攻守转换",
    summary: "原图将战斗抽象成敌我回合，并要求破绽与脱离都可识别，避免敌人被连续硬直到死或永远无法行动。",
    steps: ["战斗开始", "招式博弈", "敌人僵直", "玩家输出", "敌人脱离 / 死亡"]
  }
];

export const combatSourceTopics: SourceTopicGroup[] = [
  {
    title: "鬼泣 5：多层招式与破防",
    items: [
      { label: "玩家手段", text: "普攻 / 远程、打击 / 投、闪避、防御 / 格挡、跳跃、相杀与无敌招。" },
      { label: "敌人状态", text: "护甲值、气绝值、眩晕、破绽招、防御 / 格挡和瞬移共同影响玩家能否进入输出。" },
      { label: "招式属性", text: "斩 / 打 / 射的部位伤害差异，以及伤害、属性伤害、气绝攻击、破甲攻击和击晕结果。" },
      { label: "待确认关系", text: "相杀是否区分招式轻重与属性；伤害、属性和气绝如何换算；破甲、击倒、击晕与护甲状态如何互斥；哪些敌人拥有气绝 / 眩晕。" }
    ]
  },
  {
    title: "EE2：以僵直组织攻守回合",
    items: [
      { label: "四个设计维度", text: "分别定义敌人的自由态、出招时、破绽形式和脱离形式，形成完整的敌人权限说明。" },
      { label: "三条僵直路径", text: "打断等级克制；敌人主动暴露破绽；部位弱点或机制弱点触发僵直。数值累积和强制僵直招式作为补充。" },
      { label: "输出窗口来源", text: "后摇、散步、攻击间隙、不可攻击位置、不可攻击状态、取消防御 / 闪避、无敌与时停等机制。" },
      { label: "设计分类", text: "区分主动型 / 被动型敌人，以及通用手段、个性手段、高阶手段；再检查战斗方式、攻击目标与基础进攻累积。" }
    ]
  }
];

export const combatComparisons: CombatComparison[] = [
  {
    dimension: "核心目标",
    dmc5: "让玩家用丰富招式取得压制，并把输出做成风格表达。",
    ee2: "让玩家看懂如何取得僵直，再稳定完成一次输出回合。",
    implication: "前者奖励表达宽度，后者优先保证攻守节奏。"
  },
  {
    dimension: "僵直入口",
    dmc5: "护甲、气绝、眩晕、破绽招、部位和属性等多条线并行。",
    ee2: "收束为打断等级克制、敌人主动破绽、部位或机制弱点三条路。",
    implication: "EE2 的三路模型更适合做规则底座，避免每个敌人都新增一套状态。"
  },
  {
    dimension: "玩家手段",
    dmc5: "普攻、远程、打击、投、闪避、防御、跳跃、相杀和无敌招共同构成选择面。",
    ee2: "区分通用、个性和高阶手段，再把基础攻击、相杀、高削甲、部位破坏等手段放入招式关系。",
    implication: "EE2 可以保留招式宽度，但必须明确每种手段解决哪一种敌人权限。"
  },
  {
    dimension: "敌人权限",
    dmc5: "敌人有护甲、格挡、瞬移和多种受击结果，规则容易被招式和敌人类型切碎。",
    ee2: "重点追问自由态、出招时、破绽形式、脱离形式四个状态维度。",
    implication: "四维框架能把复杂敌人能力放回可观察的状态，而不是堆属性名。"
  },
  {
    dimension: "输出结束",
    dmc5: "更强调持续压制、连段和敌人死亡前的表达空间。",
    ee2: "明确要求敌人有可识别脱离，主动结束玩家回合并回到博弈。",
    implication: "EE2 的脱离设计是防止僵直循环失控的关键约束。"
  }
];

export const combatAnalysisDimensions: AnalysisDimension[] = [
  {
    id: "problems",
    label: "问题",
    thesis: "当前最大风险不是机制少，而是同一件事被多个名词重复描述，导致玩家、策划和敌人脚本都不清楚谁拥有行动权。",
    points: [
      {
        label: "状态边界重叠",
        text: "护甲、破甲、打断、气绝、击倒、击晕和僵直之间的优先级没有被明确区分。若它们都能改变敌人行动，最终会变成多个隐藏血条。"
      },
      {
        label: "输出窗口缺少闭环",
        text: "原图写清了如何进入输出，却没有统一说明输出何时结束、敌人如何脱离、脱离后玩家能否再次抢回先手。没有退出规则，就容易出现无限压制或突然被打断。"
      },
      {
        label: "复杂度没有绑定收益",
        text: "相杀、远程、部位、属性、无敌、取消和时停都能增加深度，但如果招式只增加操作负担而不改变选择，就会变成记忆成本而不是博弈。"
      },
      {
        label: "反馈负担过高",
        text: "玩家需要同时判断动作前摇、部位、护甲、气绝条、属性结果和敌人逃脱信号。视觉、音效和命中停顿必须围绕同一个状态转移服务。"
      }
    ]
  },
  {
    id: "strengths",
    label: "优劣",
    thesis: "鬼泣 5 提供表现与招式宽度，EE2 提供可落地的攻守骨架；两者不能直接叠加，需要先确定谁是底层规则、谁是上层表达。",
    points: [
      {
        label: "鬼泣 5 的优势",
        text: "玩家手段丰富，敌人破绽可以被多种招式转化为连段、评价和风格；成功不只等于造成伤害，还包括用更漂亮、更高效的方式维持优势。"
      },
      {
        label: "鬼泣 5 的代价",
        text: "系统更依赖玩家长期学习和敌人内容量。若基础状态没有统一，护甲、气绝、部位与属性会把可读性和测试成本一起推高。"
      },
      {
        label: "EE2 的优势",
        text: "四个维度和三条僵直路径把敌人设计问题拆成可检查的规则，适合先做少量原型，再逐步增加个性手段。"
      },
      {
        label: "EE2 的代价",
        text: "如果所有敌人都按固定回合交接，玩家可能只是在等待窗口；如果每次脱离都由系统强制执行，又会削弱动作表达和主动压制的成就感。"
      }
    ]
  },
  {
    id: "direction",
    label: "方向",
    thesis: "建议用 EE2 的攻守状态做底座，用鬼泣 5 的招式宽度做上层表达，把复杂关联压缩成“行动权如何转移”。",
    points: [
      {
        label: "先统一一条主状态",
        text: "用“自由态 → 争夺态 → 僵直态 / 输出态 → 脱离态 → 自由态”描述行动权。护甲、气绝和部位不再各自定义回合，而是作为进入或延长僵直的条件。"
      },
      {
        label: "保留三条入口",
        text: "招式关系打断、敌人主动破绽、部位或机制弱点分别对应技术、反应和观察三种能力；每个敌人只选择其中一条主入口，再配置一条补充入口。"
      },
      {
        label: "限制每次输出的权限",
        text: "输出窗口至少绑定一种结束条件：时间、伤害预算或敌人脱离动作。不要让护甲、瞬移和无敌同时成为无提示的强制结束。"
      },
      {
        label: "把高阶手段变成变体",
        text: "相杀、高削甲和部位破坏应改变获取窗口的方式或收益，而不是再创建一套平行状态。这样既能保留操作上限，也能让基础玩家先读懂主循环。"
      }
    ]
  },
  {
    id: "differences",
    label: "差异",
    thesis: "两份材料的差异不只是“复杂 / 简单”，而是对玩家回合的定义不同：鬼泣 5 把回合当作持续表达，EE2 把回合当作可验证的攻守协议。",
    points: [
      {
        label: "表达型 vs 协议型",
        text: "鬼泣 5 关心玩家拿到优势后能做出多少变化；EE2 关心玩家为什么拿到优势、何时必须交还优势。"
      },
      {
        label: "敌人作为素材 vs 对手",
        text: "鬼泣 5 的许多敌人服务于连段和场面管理；EE2 需要敌人具备主动破绽、反击和脱离，让玩家感到自己在处理一个会争夺行动权的对手。"
      },
      {
        label: "状态叠加 vs 状态解释",
        text: "鬼泣 5 可以用多种结果叠加来制造层次；EE2 更适合先解释一个状态转移，再用数值和招式差异丰富它。"
      },
      {
        label: "内容规模不同",
        text: "鬼泣 5 的深度由角色招式、敌人组合和连段空间共同支撑；EE2 若没有同等内容量，应把复杂度投入到少数关键敌人的可学习行为，而不是复制名词数量。"
      }
    ]
  },
  {
    id: "focus",
    label: "重心",
    thesis: "开发重心应从“增加更多招式和状态”转到“让玩家稳定看见行动权转移，并且每次转移都有不同的决策收益”。",
    points: [
      {
        label: "第一优先：读得懂",
        text: "玩家要能从动作、命中反馈和敌人姿态判断三件事：当前谁能主动、我用什么手段能改变状态、敌人准备如何脱离。"
      },
      {
        label: "第二优先：打得开",
        text: "每个敌人至少提供一种稳定主解和一种高阶替代解。主解保证可学习，高阶解奖励熟练度，避免所有敌人只靠同一个高削甲招。"
      },
      {
        label: "第三优先：收得住",
        text: "输出回合必须有边界，脱离必须有预兆，脱离之后还要给玩家重新争夺先手的空间。循环稳定比单次连段长度更重要。"
      },
      {
        label: "验证指标",
        text: "原型阶段重点观察首次抓到破绽的时间、玩家能否说出破绽来源、输出窗口平均持续时间、脱离信号被识别的比例，以及是否出现单一解法垄断。"
      }
    ]
  }
];

export const combatKnowledgeReferences: CombatKnowledgeReference[] = [
  { id: "round-based-humanoid", title: "回合制攻防型低韧人形", reason: "对应稳定破绽、可识别脱离和攻守转换。" },
  { id: "interruption", title: "打断", reason: "对应打断等级、僵直入口和招式关系。" },
  { id: "suppression", title: "压制", reason: "对应持续硬直、压制边界和防滥用。" },
  { id: "anti-armor-neutral", title: "霸体敌人的立回", reason: "对应自由态、后摇、盲区和敌人主动权限。" },
  { id: "readability-priority-principles", title: "可读性优先的原则与条件", reason: "对应反馈、读性与观赏性的取舍。" },
  { id: "pseudo-equal-humanoid", title: "拟似对等人形", reason: "对应高 AI 权限、镜像互动与学习成本风险。" }
];
