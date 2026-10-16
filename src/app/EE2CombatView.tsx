import type { KnowledgeDataset } from "../model";
import { EE2CombatInteractionDiagram } from "./EE2CombatInteractionDiagram";
import {
  ee2ControlRoutes,
  ee2EnemyRules,
  ee2KnowledgeReferences,
  ee2LoopStages,
  ee2Principles,
  ee2Prototypes,
  ee2SystemDecisions,
  ee2ValidationChecks
} from "./ee2-combat-data";

interface EE2CombatViewProps {
  dataset: KnowledgeDataset;
  onSelect: (id: string) => void;
}

export function EE2CombatView({ dataset, onSelect }: EE2CombatViewProps) {
  const entityIds = new Set(dataset.entities.map(({ id }) => id));
  const references = ee2KnowledgeReferences.filter(({ id }) => entityIds.has(id));

  return (
    <div className="ee2-combat" aria-labelledby="ee2-combat-title">
      <header className="combat-analysis-header ee2-combat-header">
        <div>
          <p className="eyebrow">EE2 / COMBAT DESIGN</p>
          <h1 id="ee2-combat-title">EE2 战斗玩法与博弈</h1>
        </div>
        <p className="combat-analysis-lede">
          EE2 原图围绕招式博弈、敌人僵直、玩家输出和敌人脱离组织战斗。本页先还原这套框架，再把知识库补充明确标为设计建议，不把其他游戏机制写成 EE2 既有规则。
        </p>
      </header>

      <section className="ee2-definition" aria-labelledby="ee2-definition-title">
        <div>
          <p className="eyebrow">一句话定义</p>
          <h2 id="ee2-definition-title">围绕僵直与脱离组织攻守回合</h2>
        </div>
        <p className="ee2-state-formula">招式博弈 → 敌人僵直 → 玩家输出 → 敌人脱离 / 死亡</p>
        <p>原图确认的是攻守交接和僵直入口；另一侧图谱的状态线不属于 EE2 的既有规则。</p>
      </section>

      <EE2CombatInteractionDiagram />

      <section className="ee2-section" aria-labelledby="ee2-play-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">PLAY</p>
          <h2 id="ee2-play-title">玩家如何战斗</h2>
        </div>
        <p className="analysis-thesis">玩家每一轮都完成三个判断：读权限、选路径、换收益。操作复杂度必须服务这三个判断，而不是增加记忆负担。</p>
        <div className="ee2-principle-grid">
          {ee2Principles.map((principle) => (
            <article className="ee2-principle" key={principle.index}>
              <span>{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
              <strong>{principle.playerQuestion}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="ee2-section" aria-labelledby="ee2-loop-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">LOOP</p>
          <h2 id="ee2-loop-title">核心博弈循环</h2>
        </div>
        <ol className="ee2-loop">
          {ee2LoopStages.map((stage) => (
            <li key={stage.state}>
              <div className="ee2-loop-state"><span>{stage.index}</span><h3>{stage.state}</h3><strong>{stage.owner}</strong></div>
              <p>{stage.playerTask}</p>
              <p className="ee2-loop-transition">{stage.transition}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ee2-section" aria-labelledby="ee2-routes-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">CONTROL</p>
          <h2 id="ee2-routes-title">三类僵直入口</h2>
        </div>
        <div className="ee2-route-grid">
          {ee2ControlRoutes.map((route) => (
            <article className="ee2-route" key={route.verb}>
              <div><span>{route.verb}</span><h3>{route.title}</h3></div>
              <dl>
                <div><dt>触发</dt><dd>{route.trigger}</dd></div>
                <div><dt>手段</dt><dd>{route.tools}</dd></div>
                <div><dt>收益</dt><dd>{route.reward}</dd></div>
                <div><dt>边界</dt><dd>{route.boundary}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="ee2-section" aria-labelledby="ee2-enemy-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">ENEMY</p>
          <h2 id="ee2-enemy-title">敌人设计规则</h2>
        </div>
        <p className="analysis-thesis">每个敌人必须回答四个问题。个性来自四项答案的组合，而不是增加新的通用状态名。</p>
        <div className="ee2-enemy-rules">
          {ee2EnemyRules.map((rule) => (
            <article key={rule.dimension}>
              <h3>{rule.dimension}</h3>
              <strong>{rule.question}</strong>
              <p>{rule.decision}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ee2-section" aria-labelledby="ee2-system-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">SYNTHESIS</p>
          <h2 id="ee2-system-title">设计边界与补全</h2>
        </div>
        <p className="analysis-thesis">以下属于设计建议，不代表 EE2 已实现机制。它们只用于补齐窗口、防滥用和反馈边界，并与原图内容分开阅读。</p>
        <div className="ee2-system-list">
          {ee2SystemDecisions.map((item, index) => (
            <article key={item.problem}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.problem}</h3><p>{item.decision}</p><small>{item.rationale}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="ee2-section" aria-labelledby="ee2-prototype-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">PROTOTYPE</p>
          <h2 id="ee2-prototype-title">原型与验证</h2>
        </div>
        <div className="ee2-prototype-grid">
          {ee2Prototypes.map((prototype) => (
            <article className="ee2-prototype" key={prototype.type}>
              <h3>{prototype.type}</h3>
              <p>{prototype.purpose}</p>
              <dl>
                <div><dt>主路径</dt><dd>{prototype.mainRoute}</dd></div>
                <div><dt>替代</dt><dd>{prototype.alternateRoute}</dd></div>
                <div><dt>脱离</dt><dd>{prototype.exit}</dd></div>
                <div><dt>验证</dt><dd>{prototype.proves}</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <ol className="ee2-validation-list">
          {ee2ValidationChecks.map((check) => <li key={check}>{check}</li>)}
        </ol>
      </section>

      <section className="ee2-section ee2-knowledge" aria-labelledby="ee2-knowledge-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">KNOWLEDGE BASIS</p>
          <h2 id="ee2-knowledge-title">知识库补充</h2>
        </div>
        <p className="analysis-section-note">这些节点用于审视和补全 EE2 原图，不代表其中案例已经成为 EE2 的设定。点击可回到概念星图查看来源与适用条件。</p>
        <div className="analysis-reference-grid">
          {references.map((reference) => (
            <button type="button" className="analysis-reference" key={reference.id} aria-label={reference.title} onClick={() => onSelect(reference.id)}>
              <strong>{reference.title}</strong>
              <span>{reference.contribution}</span>
              <span className="analysis-reference-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
