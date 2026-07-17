import { useMemo, useState } from "react";
import type { KnowledgeDataset } from "../model";
import { normalizeSearchText } from "../search";
import type { AtlasFilters } from "./app-state";

interface SearchPanelProps {
  dataset: KnowledgeDataset;
  query: string;
  filters: AtlasFilters;
  resultIds: string[];
  onQueryChange: (query: string) => void;
  onFiltersChange: (filters: Partial<AtlasFilters>) => void;
  onClear: () => void;
  onSelect: (id: string) => void;
}

const conflictLabels: Record<string, string> = {
  definition: "定义冲突", goal: "目标冲突", condition: "条件差异", direct: "直接分歧"
};
const statusLabels: Record<string, string> = { reviewed: "已复核", draft: "待复核" };

function toggle(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((candidate) => candidate !== value) : [...values, value];
}

export function SearchPanel({ dataset, query, filters, resultIds, onQueryChange, onFiltersChange, onClear, onSelect }: SearchPanelProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const active = Boolean(query.trim() || Object.values(filters).some((values) => values.length));
  const entities = useMemo(() => new Map(dataset.entities.map((entity) => [entity.id, entity])), [dataset]);
  const results = resultIds.map((id) => entities.get(id)).filter((entity) => entity !== undefined);
  const domains = dataset.entities.filter(({ id }) => id.startsWith("domain-"));
  const games = dataset.entities.filter(({ kind }) => kind === "game");
  const suggestions = useMemo(() => {
    const prefix = normalizeSearchText(query);
    if (!prefix || results.length) return [];
    const found: Array<{ label: string; query: string }> = [];
    for (const entity of dataset.entities) {
      for (const term of [entity.title, ...entity.aliases]) {
        if (normalizeSearchText(term).startsWith(prefix) && !found.some(({ query: value }) => value === term)) {
          found.push({ label: term, query: term });
          if (found.length === 3) return found;
        }
      }
    }
    return found;
  }, [dataset.entities, query, results.length]);

  const activeLabels = [
    ...filters.domains.map((id) => entities.get(id)?.title ?? id),
    ...filters.games.map((id) => entities.get(id)?.title ?? id),
    ...filters.conflictTypes.map((id) => conflictLabels[id] ?? id),
    ...filters.reviewStatuses.map((id) => statusLabels[id] ?? id)
  ];

  const group = (title: string, key: keyof AtlasFilters, options: Array<{ id: string; label: string }>) => (
    <fieldset>
      <legend>{title}</legend>
      <div className="filter-options">
        {options.map(({ id, label }) => (
          <label key={id}>
            <input type="checkbox" checked={filters[key].includes(id)} onChange={() => onFiltersChange({ [key]: toggle(filters[key], id) })} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className="search-panel">
      <div className="search-row">
        <label className="global-search">
          <span>全局检索</span>
          <input type="search" value={query} onChange={(event) => onQueryChange(event.currentTarget.value)} placeholder="概念 / 游戏 / Boss / 来源" />
        </label>
        <button type="button" className="filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
          {filtersOpen ? "收起筛选" : "展开筛选"}{activeLabels.length ? ` · ${activeLabels.length}` : ""}
        </button>
      </div>
      {filtersOpen && (
        <div className="filter-drawer">
          {group("知识域", "domains", domains.map(({ id, title }) => ({ id, label: title })))}
          {group("游戏 / 系列", "games", games.map(({ id, title }) => ({ id, label: title })))}
          {group("冲突类型", "conflictTypes", Object.entries(conflictLabels).map(([id, label]) => ({ id, label })))}
          {group("复核状态", "reviewStatuses", Object.entries(statusLabels).map(([id, label]) => ({ id, label })))}
        </div>
      )}
      {active && (
        <div className="search-results" aria-live="polite">
          {results.length ? (
            <><p>{results.length} 项结果</p><ul>{results.slice(0, 12).map((entity) => <li key={entity.id}><button type="button" onClick={() => onSelect(entity.id)}><strong>{entity.title}</strong><span>{entity.kind} · {entity.summary}</span></button></li>)}</ul></>
          ) : (
            <div className="search-empty">
              <strong>没有符合条件的结果</strong>
              <p>{activeLabels.length ? `当前筛选：${activeLabels.join("、")}` : "当前搜索没有直接命中。"}</p>
              {suggestions.length > 0 && <div className="search-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion.query} aria-label={`建议：${suggestion.label}`} onClick={() => onQueryChange(suggestion.query)}>{suggestion.label}</button>)}</div>}
              <button type="button" className="clear-search" onClick={onClear}>清除全部条件</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
