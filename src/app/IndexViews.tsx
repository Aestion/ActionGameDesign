import { useMemo, useState } from "react";
import type { KnowledgeDataset, KnowledgeEntity } from "../model";
import type { AtlasView } from "./app-state";

interface IndexViewsProps {
  dataset: KnowledgeDataset;
  view: Extract<AtlasView, "cases" | "conflicts" | "sources">;
  onSelect: (id: string) => void;
}

const kindForView = { cases: "case", conflicts: "conflict", sources: "source" } as const;
const conflictLabels: Record<string, string> = { definition: "定义冲突", goal: "目标冲突", condition: "条件差异", direct: "直接分歧" };

function sourceNames(ids: string[], dataset: KnowledgeDataset) {
  return ids.map((id) => dataset.entities.find((entity) => entity.id === id)?.title ?? id);
}

export function ConflictCard({ entity, dataset, onSelect }: { entity: KnowledgeEntity; dataset: KnowledgeDataset; onSelect: (id: string) => void }) {
  const synthesis = entity.editorialSynthesis?.replace(/^编者归纳[：:]\s*/, "");
  return (
    <article className="index-card conflict-index-card">
      <button type="button" className="index-card-title" onClick={() => onSelect(entity.id)}><strong>{entity.title}</strong><span>打开冲突节点 ↗</span></button>
      <p className="conflict-question">争议问题：{entity.summary}</p>
      <span className="conflict-type-label">{conflictLabels[entity.conflictType ?? ""] ?? "未分类冲突"}</span>
      <div className="conflict-sides">
        {(entity.conflictSides ?? []).map((side) => (
          <section key={side.label}>
            <h3>{side.label}</h3><p>{side.claim}</p><p><strong>条件：</strong>{side.conditions || "未单独记录"}</p>
            <p><strong>来源：</strong>{sourceNames(side.sourceIds, dataset).join("、") || "未记录"}</p>
          </section>
        ))}
      </div>
      <section className="editorial-synthesis"><h3>编者归纳</h3><p>{synthesis || "暂无编者归纳。"}</p></section>
    </article>
  );
}

export function IndexViews({ dataset, view, onSelect }: IndexViewsProps) {
  const [sort, setSort] = useState<"title" | "updated">("title");
  const entities = useMemo(() => dataset.entities.filter(({ kind }) => kind === kindForView[view]).sort((a, b) => sort === "updated" ? b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title, "zh-CN") : a.title.localeCompare(b.title, "zh-CN")), [dataset.entities, sort, view]);
  return (
    <section className="index-view" aria-label={view === "cases" ? "案例索引" : view === "conflicts" ? "冲突索引" : "来源索引"}>
      <div className="index-toolbar"><p>{entities.length} 条结构化记录</p><label>排序<select value={sort} onChange={(event) => setSort(event.currentTarget.value as "title" | "updated")}><option value="title">标题</option><option value="updated">更新时间</option></select></label></div>
      {view === "conflicts" ? entities.map((entity) => <ConflictCard key={entity.id} entity={entity} dataset={dataset} onSelect={onSelect} />) : (
        <div className="index-list">{entities.map((entity) => {
          const gameIds = [...new Set(entity.examples.map(({ gameId }) => gameId))];
          const sources = [...new Set([...entity.citations.map(({ sourceId }) => sourceId), ...entity.examples.flatMap(({ sourceIds }) => sourceIds)])];
          return <article className="index-card" key={entity.id}><button type="button" className="index-card-title" onClick={() => onSelect(entity.id)}><strong>{entity.title}</strong><span>查看详情 ↗</span></button><p>{entity.summary || "暂无摘要。"}</p>{view === "cases" && <p className="index-meta">游戏：{sourceNames(gameIds, dataset).join("、") || "未记录"} · 来源：{sourceNames(sources, dataset).join("、") || "未记录"}</p>}{view === "sources" && <p className="index-meta">{entity.sourceMeta?.rawPath ? `本地档案：${entity.sourceMeta.rawPath}` : "来源说明已离线保存"}</p>}</article>;
        })}</div>
      )}
    </section>
  );
}
