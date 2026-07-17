import { useMemo, useState } from "react";
import type { KnowledgeDataset, KnowledgeEntity } from "../model";
import { GRAPH_ROOT_ID } from "./GraphExplorer";

export interface MobileTreeProps {
  dataset: KnowledgeDataset;
  selectedId: string;
  onSelect: (id: string) => void;
}

function directChildren(parent: KnowledgeEntity, dataset: KnowledgeDataset) {
  const edgeIds = dataset.edges.filter((edge) =>
    (edge.kind === "parent_of" && edge.source === parent.id) ||
    (edge.kind === "child_of" && edge.target === parent.id)
  ).map((edge) => edge.source === parent.id ? edge.target : edge.source);
  const ids = new Set(edgeIds);
  return dataset.entities.filter((entity) => ids.has(entity.id));
}

export function MobileTree({ dataset, selectedId, onSelect }: MobileTreeProps) {
  const domains = useMemo(() => dataset.entities.filter(({ id }) => id.startsWith("domain-")), [dataset]);
  const [expanded, setExpanded] = useState(() => new Set(domains.filter(({ id }) => id === selectedId || dataset.entities.find(({ id: candidate }) => candidate === selectedId)?.domainIds.includes(id)).map(({ id }) => id)));
  const toggle = (id: string) => setExpanded((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  return (
    <section className="mobile-tree" aria-labelledby="mobile-tree-title">
      <h2 id="mobile-tree-title">分层知识树</h2>
      <button type="button" className="mobile-root" aria-current={selectedId === GRAPH_ROOT_ID ? "page" : undefined} onClick={() => onSelect(GRAPH_ROOT_ID)}>动作游戏设计</button>
      <ul>
        {domains.map((domain) => {
          const children = directChildren(domain, dataset);
          const isExpanded = expanded.has(domain.id);
          return <li key={domain.id}>
            <div className="mobile-tree-row"><button type="button" className="disclosure-button" aria-expanded={isExpanded} aria-label={`${isExpanded ? "收起" : "展开"} ${domain.title}`} onClick={() => toggle(domain.id)}>{isExpanded ? "−" : "+"}</button><button type="button" aria-current={selectedId === domain.id ? "page" : undefined} onClick={() => onSelect(domain.id)}>{domain.title}</button></div>
            {isExpanded && children.length > 0 && <ul>{children.map((child) => <li key={child.id}><button type="button" data-kind={child.kind} aria-current={selectedId === child.id ? "page" : undefined} onClick={() => onSelect(child.id)}>{child.kind === "conflict" ? "◇ " : ""}{child.title}</button></li>)}</ul>}
          </li>;
        })}
      </ul>
    </section>
  );
}
