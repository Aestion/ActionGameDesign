import { useEffect, useMemo, useRef, useState } from "react";
import type { KnowledgeDataset, KnowledgeEntity } from "../model";
import { GRAPH_ROOT_ID, GraphExplorer, rootEntity } from "./GraphExplorer";
import { MobileTree } from "./MobileTree";

export { GRAPH_ROOT_ID };

const domainOrder = [
  "domain-type-boundary",
  "domain-system-depth",
  "domain-combat",
  "domain-enemy-boss",
  "domain-presentation",
  "domain-production-philosophy"
];

export interface OutlineNode {
  entity: KnowledgeEntity;
  children: OutlineNode[];
}

interface StructurePair {
  parent: string;
  child: string;
}

function orderedDomains(dataset: KnowledgeDataset): KnowledgeEntity[] {
  return dataset.entities
    .filter(({ id }) => id.startsWith("domain-"))
    .sort((a, b) => {
      const ai = domainOrder.indexOf(a.id);
      const bi = domainOrder.indexOf(b.id);
      return (ai < 0 ? domainOrder.length : ai) - (bi < 0 ? domainOrder.length : bi);
    });
}

function structuralPairs(dataset: KnowledgeDataset): StructurePair[] {
  const pairs: StructurePair[] = orderedDomains(dataset).map(({ id }) => ({ parent: GRAPH_ROOT_ID, child: id }));
  for (const edge of dataset.edges) {
    if (edge.kind === "parent_of") pairs.push({ parent: edge.source, child: edge.target });
    if (edge.kind === "child_of") pairs.push({ parent: edge.target, child: edge.source });
  }
  const seen = new Set<string>();
  return pairs.filter(({ parent, child }) => {
    const key = `${parent}\u0000${child}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Builds the full concept hierarchy from the root. A node only appears once: its first parent claims it. */
export function buildOutlineTree(dataset: KnowledgeDataset): OutlineNode {
  const entityMap = new Map<string, KnowledgeEntity>([rootEntity, ...dataset.entities].map((entity) => [entity.id, entity]));
  const childIds = new Map<string, string[]>();
  for (const { parent, child } of structuralPairs(dataset)) {
    if (!entityMap.has(parent) || !entityMap.has(child)) continue;
    const list = childIds.get(parent) ?? [];
    if (!list.includes(child)) list.push(child);
    childIds.set(parent, list);
  }

  const claimed = new Set<string>([GRAPH_ROOT_ID]);
  const build = (id: string): OutlineNode => {
    const entity = entityMap.get(id) ?? rootEntity;
    const children = (childIds.get(id) ?? [])
      .filter((childId) => !claimed.has(childId))
      .sort((left, right) => {
        if (id === GRAPH_ROOT_ID) {
          return domainOrder.indexOf(left) - domainOrder.indexOf(right) || left.localeCompare(right);
        }
        const a = entityMap.get(left);
        const b = entityMap.get(right);
        return (a?.title ?? left).localeCompare(b?.title ?? right, "zh-CN") || left.localeCompare(right);
      })
      .map((childId) => {
        claimed.add(childId);
        return build(childId);
      });
    return { entity, children };
  };

  return build(GRAPH_ROOT_ID);
}

/** Breadcrumb path for the selected node, root first. Unknown nodes fall back to root + node. */
export function outlinePath(dataset: KnowledgeDataset, selectedId: string): KnowledgeEntity[] {
  const entityMap = new Map<string, KnowledgeEntity>([rootEntity, ...dataset.entities].map((entity) => [entity.id, entity]));
  const parentOf = new Map<string, string>();
  for (const { parent, child } of structuralPairs(dataset)) {
    if (parentOf.has(child) || !entityMap.has(parent)) continue;
    parentOf.set(child, parent);
  }

  const path: KnowledgeEntity[] = [];
  const guard = new Set<string>();
  let cursor = selectedId;
  while (cursor && !guard.has(cursor)) {
    guard.add(cursor);
    const entity = entityMap.get(cursor);
    if (entity) path.unshift(entity);
    cursor = parentOf.get(cursor) ?? "";
  }
  if (!path.some(({ id }) => id === GRAPH_ROOT_ID)) path.unshift(rootEntity);
  return path;
}

function collectExpandableIds(node: OutlineNode, target: Set<string>) {
  if (node.children.length > 0) target.add(node.entity.id);
  node.children.forEach((child) => collectExpandableIds(child, target));
  return target;
}

interface StructureOutlineProps {
  dataset: KnowledgeDataset;
  selectedId: string;
  highlightedIds: string[];
  onSelect: (id: string) => void;
  onRead?: (id: string) => void;
}

function OutlineNodeRow({
  node,
  level,
  selectedId,
  highlighted,
  expandedIds,
  relationCounts,
  onToggle,
  onSelect,
  onRead
}: {
  node: OutlineNode;
  level: number;
  selectedId: string;
  highlighted: Set<string>;
  expandedIds: Set<string>;
  relationCounts: Map<string, number>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onRead?: (id: string) => void;
}) {
  const { entity, children } = node;
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(entity.id);
  const isSelected = entity.id === selectedId;
  const isHighlighted = highlighted.has(entity.id);
  const relationCount = relationCounts.get(entity.id) ?? 0;
  const meta = [
    hasChildren ? `${children.length} 个子项` : "无下级",
    relationCount > 0 ? `${relationCount} 条关系` : ""
  ].filter(Boolean).join(" · ");

  return (
    <li
      className="structure-node"
      data-testid={`graph-node-${entity.id}`}
      data-level={level}
      data-kind={entity.kind}
      data-highlighted={isHighlighted ? "true" : "false"}
      data-selected={isSelected ? "true" : undefined}
    >
      <div className="structure-row" style={{ paddingLeft: 8 + level * 18 }}>
        {hasChildren ? (
          <button
            type="button"
            className="structure-toggle"
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "收起" : "展开"} ${entity.title} 的下一级`}
            onClick={() => onToggle(entity.id)}
          >
            {isExpanded ? "−" : "+"}
          </button>
        ) : (
          <span className="structure-toggle-spacer" aria-hidden="true" />
        )}
        <button
          type="button"
          className="structure-title"
          data-level={level}
          aria-current={isSelected ? "page" : undefined}
          onClick={() => onSelect(entity.id)}
        >
          {entity.title}
        </button>
        <span className="structure-summary-text">{entity.summary}</span>
        <span className="structure-meta">{meta}</span>
        {entity.bodyHtml && onRead && (
          <button type="button" className="structure-read" onClick={() => onRead(entity.id)}>全文</button>
        )}
      </div>
      {hasChildren && isExpanded && (
        <ul className="structure-children">
          {children.map((child) => (
            <OutlineNodeRow
              key={child.entity.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              highlighted={highlighted}
              expandedIds={expandedIds}
              relationCounts={relationCounts}
              onToggle={onToggle}
              onSelect={onSelect}
              onRead={onRead}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function StructureOutline({ dataset, selectedId, highlightedIds, onSelect, onRead }: StructureOutlineProps) {
  const tree = useMemo(() => buildOutlineTree(dataset), [dataset]);
  const path = useMemo(() => outlinePath(dataset, selectedId), [dataset, selectedId]);
  const highlighted = useMemo(() => new Set(highlightedIds), [highlightedIds]);
  const relationCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const edge of dataset.edges) {
      counts.set(edge.source, (counts.get(edge.source) ?? 0) + 1);
      counts.set(edge.target, (counts.get(edge.target) ?? 0) + 1);
    }
    return counts;
  }, [dataset.edges]);
  const domainCount = useMemo(() => dataset.entities.filter(({ id }) => id.startsWith("domain-")).length, [dataset.entities]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(path.map(({ id }) => id)));
  const lastSelected = useRef(selectedId);

  useEffect(() => {
    if (lastSelected.current === selectedId) return;
    lastSelected.current = selectedId;
    setExpandedIds((current) => {
      const next = new Set(current);
      path.forEach(({ id }) => next.add(id));
      return next;
    });
  }, [path, selectedId]);

  const toggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <div className="structure-bar">
        <nav className="structure-breadcrumbs" aria-label="结构路径">
          {path.map((entity, index) => (
            <span key={entity.id} className="structure-crumb">
              {index > 0 && <i aria-hidden="true">/</i>}
              <button type="button" aria-current={entity.id === selectedId ? "page" : undefined} onClick={() => onSelect(entity.id)}>
                {entity.title}
              </button>
            </span>
          ))}
        </nav>
        <div className="structure-actions">
          <button type="button" onClick={() => setExpandedIds(collectExpandableIds(tree, new Set()))}>展开全部</button>
          <button type="button" onClick={() => setExpandedIds(new Set([GRAPH_ROOT_ID]))}>收起全部</button>
        </div>
      </div>
      <p className="structure-summary" aria-label="结构统计">
        <span><b>{domainCount}</b> 个知识域</span>
        <span><b>{dataset.stats.concepts}</b> 个概念节点</span>
        <span><b>{dataset.edges.length}</b> 条关系</span>
        <span>点标题选中节点，点 + 展开下一级</span>
      </p>
      <ul className="structure-tree" aria-label="知识结构目录">
        <OutlineNodeRow
          node={tree}
          level={0}
          selectedId={selectedId}
          highlighted={highlighted}
          expandedIds={expandedIds}
          relationCounts={relationCounts}
          onToggle={toggle}
          onSelect={onSelect}
          onRead={onRead}
        />
      </ul>
    </>
  );
}

export interface StructureExplorerProps {
  dataset: KnowledgeDataset;
  selectedId: string;
  highlightedIds: string[];
  onSelect: (id: string) => void;
  onRead?: (id: string) => void;
}

export function StructureExplorer({ dataset, selectedId, highlightedIds, onSelect, onRead }: StructureExplorerProps) {
  const [mode, setMode] = useState<"outline" | "map">("outline");
  return (
    <section className="structure-explorer" aria-labelledby="structure-title">
      <h2 className="visually-hidden" id="structure-title">动作游戏设计知识结构</h2>
      <div className="structure-toolbar">
        <div className="structure-tabs" role="tablist" aria-label="结构视图">
          <button
            type="button"
            role="tab"
            id="structure-tab-outline"
            aria-selected={mode === "outline"}
            aria-controls="structure-panel-outline"
            onClick={() => setMode("outline")}
          >
            目录
          </button>
          <button
            type="button"
            role="tab"
            id="structure-tab-map"
            aria-selected={mode === "map"}
            aria-controls="structure-panel-map"
            onClick={() => setMode("map")}
          >
            关系图
          </button>
        </div>
      </div>
      {mode === "outline" ? (
        <div id="structure-panel-outline" role="tabpanel" aria-labelledby="structure-tab-outline">
          <StructureOutline
            dataset={dataset}
            selectedId={selectedId}
            highlightedIds={highlightedIds}
            onSelect={onSelect}
            onRead={onRead}
          />
        </div>
      ) : (
        <div id="structure-panel-map" role="tabpanel" aria-labelledby="structure-tab-map" className="structure-map">
          <GraphExplorer dataset={dataset} selectedId={selectedId} highlightedIds={highlightedIds} onSelect={onSelect} />
          <MobileTree dataset={dataset} selectedId={selectedId} onSelect={onSelect} />
        </div>
      )}
    </section>
  );
}
