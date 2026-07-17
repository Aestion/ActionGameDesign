import { useMemo, useState } from "react";
import type { KnowledgeDataset, KnowledgeEntity } from "../model";

interface ComparisonMatrixProps { dataset: KnowledgeDataset; onSelect: (id: string) => void; }

interface Dimension {
  id: string; label: string; keys: string[]; domains: string[]; terms: string[];
}

export const matrixDimensions: Dimension[] = [
  { id: "framework", label: "类型与框架", keys: ["framework", "type", "genre"], domains: ["domain-type-boundary"], terms: ["类型", "框架", "act-definition"] },
  { id: "reaction", label: "反应频率", keys: ["reaction", "reactionFrequency", "frequency"], domains: ["domain-system-depth"], terms: ["反应频率", "reaction-frequency"] },
  { id: "precision", label: "时间 / 空间 / 指令精度", keys: ["precision", "timeSpaceCommand", "controlPrecision"], domains: ["domain-system-depth"], terms: ["精度", "precision"] },
  { id: "combat", label: "主要战斗思路", keys: ["combat", "combatApproach", "approach"], domains: ["domain-combat"], terms: ["战斗思路", "立回", "压制", "定番"] },
  { id: "enemy", label: "敌人 / Boss 韧性与 AI", keys: ["enemy", "boss", "poise", "enemyAi"], domains: ["domain-enemy-boss"], terms: ["敌人", "boss", "韧性", "enemy-ai"] },
  { id: "external", label: "外部规则与反馈循环", keys: ["external", "rules", "feedbackLoop"], domains: ["domain-system-depth"], terms: ["外部规则", "反馈循环", "external", "feedback"] },
  { id: "presentation", label: "可读性与表现", keys: ["presentation", "readability", "spectacle"], domains: ["domain-presentation"], terms: ["可读性", "表现", "readability", "spectacle"] }
];

function explicitValue(game: KnowledgeEntity, dimension: Dimension): string | undefined {
  for (const key of dimension.keys) {
    const value = game.matrix?.[key]?.trim();
    if (value) return value;
  }
}

function matchesDimension(entity: KnowledgeEntity, dimension: Dimension): boolean {
  const haystack = `${entity.id} ${entity.title} ${entity.tags.join(" ")}`.toLocaleLowerCase();
  if (entity.domainIds.some((id) => dimension.domains.includes(id))) {
    if (dimension.id !== "reaction" && dimension.id !== "precision" && dimension.id !== "external") return true;
  }
  return dimension.terms.some((term) => haystack.includes(term.toLocaleLowerCase()));
}

function evidenceFor(dataset: KnowledgeDataset, gameId: string, dimension: Dimension) {
  return dataset.entities.filter((entity) => entity.examples.some((example) => example.gameId === gameId) && matchesDimension(entity, dimension));
}

export function ComparisonMatrix({ dataset, onSelect }: ComparisonMatrixProps) {
  const games = useMemo(() => dataset.entities.filter(({ kind }) => kind === "game").sort((a, b) => a.title.localeCompare(b.title, "zh-CN")), [dataset.entities]);
  const [selected, setSelected] = useState<{ game: KnowledgeEntity; dimension: Dimension } | null>(null);
  const evidence = selected ? evidenceFor(dataset, selected.game.id, selected.dimension) : [];
  const judgment = selected ? explicitValue(selected.game, selected.dimension) : undefined;
  const sources = selected ? [...new Set(evidence.flatMap((entity) => [...entity.citations.map(({ sourceId }) => sourceId), ...entity.examples.flatMap(({ sourceIds }) => sourceIds)]))] : [];
  const sourceTitle = (id: string) => dataset.entities.find((entity) => entity.id === id)?.title ?? id;
  const concept = evidence.find(({ kind }) => kind === "concept") ?? (selected ? dataset.entities.find((entity) => entity.kind === "concept" && matchesDimension(entity, selected.dimension)) : undefined);

  return (
    <section className="matrix-view" aria-label="游戏比较矩阵">
      <p className="matrix-note">矩阵呈现结构化倾向与可追溯材料，不是评分。没有资料的格子会明确标记为空。</p>
      <div className="matrix-scroll"><table><thead><tr><th scope="col">游戏 / 系列</th>{matrixDimensions.map((dimension) => <th scope="col" key={dimension.id}>{dimension.label}</th>)}</tr></thead><tbody>{games.map((game) => <tr key={game.id}><th scope="row">{game.title}</th>{matrixDimensions.map((dimension) => {
        const explicit = explicitValue(game, dimension);
        const count = evidenceFor(dataset, game.id, dimension).length;
        return <td key={dimension.id}><button type="button" aria-label={`${game.title}：${dimension.label}`} data-has-evidence={Boolean(explicit || count)} onClick={() => setSelected({ game, dimension })}>{explicit ?? (count ? `${count} 条相关材料` : "暂无结构化判断")}</button></td>;
      })}</tr>)}</tbody></table></div>
      {selected && <aside className="matrix-evidence" aria-live="polite"><div className="matrix-evidence-heading"><div><p className="eyebrow">{selected.game.title} / {selected.dimension.label}</p><h2>{judgment ?? (evidence.length ? "仅有相关材料，尚无结构化判断" : "暂无结构化判断")}</h2></div><button type="button" onClick={() => setSelected(null)} aria-label="关闭矩阵依据">×</button></div>
        {evidence.length ? <><section><h3>判断依据与案例</h3>{evidence.map((entity) => <article key={entity.id}><strong>{entity.title}</strong><p>{entity.summary}</p>{entity.examples.filter(({ gameId }) => gameId === selected.game.id).map((example) => <div key={example.id}><b>{example.subject}</b><span>{example.mechanism} → {example.outcome}</span></div>)}</article>)}</section><section><h3>适用条件</h3><p>{[...new Set(evidence.flatMap(({ tags }) => tags))].join("、") || "资料未单独记录条件；请查看原节点上下文。"}</p></section><section><h3>来源</h3><p>{sources.map(sourceTitle).join("、") || "没有单独的来源标注。"}</p></section></> : <p className="matrix-empty">当前资料没有可用于这一维度的判断或证据。</p>}
        {concept && <button type="button" className="matrix-concept-link" onClick={() => onSelect(concept.id)}>查看{concept.title}节点</button>}
      </aside>}
    </section>
  );
}
