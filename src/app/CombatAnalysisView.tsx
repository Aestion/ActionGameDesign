import type { KnowledgeDataset } from "../model";
import {
  combatAnalysisDimensions,
  combatComparisons,
  combatCycles,
  combatKnowledgeReferences,
  combatSourceDiagramUrl,
  combatSourceTitle,
  combatSourceTopics
} from "./combat-analysis-data";

interface CombatAnalysisViewProps {
  dataset: KnowledgeDataset;
  onSelect: (id: string) => void;
}

export function CombatAnalysisView({ dataset, onSelect }: CombatAnalysisViewProps) {
  const entityIds = new Set(dataset.entities.map(({ id }) => id));
  const references = combatKnowledgeReferences.filter(({ id }) => entityIds.has(id));

  return (
    <div className="combat-analysis" aria-labelledby="combat-analysis-title">
      <header className="combat-analysis-header">
        <div>
          <p className="eyebrow">战斗博弈 / SOURCE SYNTHESIS</p>
          <h1 id="combat-analysis-title">战斗博弈分析</h1>
        </div>
        <p className="combat-analysis-lede">
          将《战斗博弈梳理2.vsdx》的鬼泣 5 与 EE2 两条脉络整理成可执行的战斗规则，重点追踪破绽、僵直、输出和脱离如何交接。
        </p>
      </header>

      <section className="analysis-verdict" aria-labelledby="analysis-verdict-title">
        <div>
          <p className="eyebrow">先看结论</p>
          <h2 id="analysis-verdict-title">用 EE2 的攻守骨架承载鬼泣 5 的表达宽度</h2>
        </div>
        <p>
          当前最需要解决的不是再增加一种破防或硬直，而是统一“谁拥有行动权”的表达。先让玩家看懂状态转移，再让招式、部位和高阶手段提供不同的转移路径与收益。
        </p>
      </section>

      <section className="analysis-cycles" aria-labelledby="analysis-cycles-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">SOURCE FRAME</p>
          <h2 id="analysis-cycles-title">两条原始战斗循环</h2>
        </div>
        <div className="analysis-cycle-grid">
          {combatCycles.map((cycle) => (
            <article className="analysis-cycle" key={cycle.title}>
              <h3>{cycle.title}</h3>
              <p>{cycle.summary}</p>
              <ol className="cycle-steps">
                {cycle.steps.map((step, index) => <li key={`${cycle.title}-${step}`}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="analysis-source-topics" aria-labelledby="analysis-source-topics-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">SOURCE NOTES</p>
          <h2 id="analysis-source-topics-title">文档信息归纳</h2>
        </div>
        <div className="analysis-source-topic-grid">
          {combatSourceTopics.map((group) => (
            <section className="analysis-source-topic" key={group.title} aria-label={group.title}>
              <h3>{group.title}</h3>
              <dl>
                {group.items.map((item) => (
                  <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <section className="analysis-comparison" aria-labelledby="analysis-comparison-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">COMPARISON</p>
          <h2 id="analysis-comparison-title">鬼泣 5 / EE2 对照</h2>
        </div>
        <div className="analysis-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">维度</th><th scope="col">鬼泣 5</th><th scope="col">EE2</th><th scope="col">设计含义</th></tr>
            </thead>
            <tbody>
              {combatComparisons.map((comparison) => (
                <tr key={comparison.dimension}>
                  <th scope="row">{comparison.dimension}</th>
                  <td>{comparison.dmc5}</td>
                  <td>{comparison.ee2}</td>
                  <td>{comparison.implication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="analysis-dimensions">
        {combatAnalysisDimensions.map((dimension) => (
          <section className={`analysis-dimension analysis-dimension-${dimension.id}`} key={dimension.id} aria-labelledby={`analysis-${dimension.id}-title`}>
            <div className="analysis-section-heading">
              <p className="eyebrow">{String(combatAnalysisDimensions.indexOf(dimension) + 1).padStart(2, "0")}</p>
              <h2 id={`analysis-${dimension.id}-title`}>{dimension.label}</h2>
            </div>
            <p className="analysis-thesis">{dimension.thesis}</p>
            <div className="analysis-point-grid">
              {dimension.points.map((point) => (
                <article className="analysis-point" key={point.label}>
                  <h3>{point.label}</h3>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="analysis-references" aria-labelledby="analysis-references-title">
        <div className="analysis-section-heading">
          <p className="eyebrow">KNOWLEDGE LINKS</p>
          <h2 id="analysis-references-title">当前知识库关联</h2>
        </div>
        <p className="analysis-section-note">这些节点用于校验本页判断的适用边界。点击后回到概念星图，并保留稳定节点链接。</p>
        {references.length ? (
          <div className="analysis-reference-grid">
            {references.map((reference) => (
              <button type="button" className="analysis-reference" key={reference.id} aria-label={reference.title} onClick={() => onSelect(reference.id)}>
                <strong>{reference.title}</strong>
                <span>{reference.reason}</span>
                <span className="analysis-reference-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        ) : <p className="analysis-empty">当前知识库暂未收录可直接跳转的关联节点。</p>}
      </section>

      <details className="analysis-source">
        <summary>原始资料：{combatSourceTitle}</summary>
        <figure>
          <a href={combatSourceDiagramUrl} target="_blank" rel="noreferrer" title="在新窗口打开原始图谱">
            <img src={combatSourceDiagramUrl} alt={`${combatSourceTitle} 原始图谱`} loading="lazy" />
          </a>
          <figcaption>原始图谱快照。网页正文为编者结构化整理，未将图中所有连接线直接复制为交互关系。</figcaption>
        </figure>
      </details>
    </div>
  );
}
