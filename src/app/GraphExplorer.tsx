import cytoscape, { type Core, type ElementDefinition, type StylesheetJson } from "cytoscape";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KnowledgeDataset, KnowledgeEdge, KnowledgeEntity, RelationKind } from "../model";

export const GRAPH_ROOT_ID = "root-action-design";

const domainOrder = [
  "domain-type-boundary", "domain-system-depth", "domain-combat", "domain-enemy-boss",
  "domain-presentation", "domain-production-philosophy"
];

const rootEntity: KnowledgeEntity = {
  id: GRAPH_ROOT_ID, kind: "concept", title: "动作游戏设计", aliases: [],
  summary: "从六大知识域进入动作游戏设计的概念、案例、冲突与来源。", bodyHtml: "",
  domainIds: [], depth: 1, tags: [], reviewStatus: "reviewed", updated: "2026-07-17",
  citations: [], media: [], examples: []
};

const relationPriority: Record<RelationKind, number> = {
  conflicts_with: 0, contrasts_with: 1, related_to: 2, exemplified_by: 3,
  applies_to: 4, supports: 5, parent_of: 6, child_of: 6
};

function domainsOf(dataset: KnowledgeDataset) {
  return dataset.entities.filter(({ id }) => id.startsWith("domain-")).sort((a, b) => {
    const ai = domainOrder.indexOf(a.id);
    const bi = domainOrder.indexOf(b.id);
    return (ai < 0 ? domainOrder.length : ai) - (bi < 0 ? domainOrder.length : bi);
  }).slice(0, 6);
}

function otherId(edge: KnowledgeEdge, id: string) {
  return edge.source === id ? edge.target : edge.source;
}

function parentIdFor(id: string, dataset: KnowledgeDataset): string | undefined {
  if (id === GRAPH_ROOT_ID) return undefined;
  if (id.startsWith("domain-")) return GRAPH_ROOT_ID;
  const edge = dataset.edges.find((candidate) =>
    (candidate.kind === "parent_of" && candidate.target === id) ||
    (candidate.kind === "child_of" && candidate.source === id)
  );
  if (edge) return otherId(edge, id);
  return dataset.entities.find(({ id: candidateId }) => candidateId === id)?.domainIds[0];
}

function childIdsFor(id: string, dataset: KnowledgeDataset): string[] {
  if (id === GRAPH_ROOT_ID) return domainsOf(dataset).map(({ id: domainId }) => domainId);
  return dataset.edges.filter((edge) =>
    (edge.kind === "parent_of" && edge.source === id) ||
    (edge.kind === "child_of" && edge.target === id)
  ).map((edge) => otherId(edge, id));
}

function visibleData(dataset: KnowledgeDataset, selectedId: string) {
  const domains = domainsOf(dataset);
  const ids = new Set([GRAPH_ROOT_ID, ...domains.map(({ id }) => id)]);
  const selected = dataset.entities.find(({ id }) => id === selectedId);
  if (selected) {
    ids.add(selected.id);
    const parentId = parentIdFor(selected.id, dataset);
    if (parentId) ids.add(parentId);
    childIdsFor(selected.id, dataset).forEach((id) => ids.add(id));
    const crossEdges = dataset.edges
      .filter((edge) => edge.source === selected.id || edge.target === selected.id)
      .filter((edge) => !["parent_of", "child_of"].includes(edge.kind))
      .sort((a, b) => relationPriority[a.kind] - relationPriority[b.kind]);
    crossEdges.filter(({ kind }) => kind === "conflicts_with" || kind === "contrasts_with")
      .forEach((edge) => ids.add(otherId(edge, selected.id)));
    crossEdges.filter(({ kind }) => kind !== "conflicts_with" && kind !== "contrasts_with")
      .slice(0, 8).forEach((edge) => ids.add(otherId(edge, selected.id)));
  }
  const entities = [rootEntity, ...dataset.entities].filter(({ id }) => ids.has(id));
  const edges: KnowledgeEdge[] = domains.map(({ id }): KnowledgeEdge => ({ source: GRAPH_ROOT_ID, target: id, kind: "parent_of" }))
    .concat(dataset.edges.filter(({ source, target }) => ids.has(source) && ids.has(target) && (source === selectedId || target === selectedId)));
  return { entities, edges };
}

function graphPosition(entity: KnowledgeEntity, entities: KnowledgeEntity[], selectedId: string) {
  if (entity.id === GRAPH_ROOT_ID) return { x: 0, y: 0 };
  const domainIndex = domainOrder.indexOf(entity.id);
  if (domainIndex >= 0) {
    const angle = (Math.PI * 2 * domainIndex / 6) - Math.PI / 2;
    return { x: Math.cos(angle) * 300, y: Math.sin(angle) * 210 };
  }
  const selected = entities.find(({ id }) => id === selectedId);
  const anchorId = selected?.id.startsWith("domain-") ? selected.id : selected?.domainIds[0];
  const anchorIndex = Math.max(0, domainOrder.indexOf(anchorId ?? ""));
  const anchorAngle = (Math.PI * 2 * anchorIndex / 6) - Math.PI / 2;
  const siblings = entities.filter(({ id }) => !id.startsWith("domain-") && id !== GRAPH_ROOT_ID);
  const index = Math.max(0, siblings.findIndex(({ id }) => id === entity.id));
  const spread = (index - (siblings.length - 1) / 2) * 0.28;
  return { x: Math.cos(anchorAngle + spread) * 500, y: Math.sin(anchorAngle + spread) * 350 };
}

function countMetrics(entity: KnowledgeEntity, dataset: KnowledgeDataset) {
  const relations = dataset.edges.filter(({ source, target }) => source === entity.id || target === entity.id);
  const conflicts = relations.filter(({ kind }) => kind === "conflicts_with").length + (entity.kind === "conflict" ? 1 : 0);
  return { relations: relations.length, cases: entity.examples.length, conflicts };
}

const graphStyles: StylesheetJson = [
  { selector: "node", style: { "background-color": "#142633", "border-color": "#61e4c9", "border-width": 2, color: "#e7f0f2", label: "data(label)", "font-size": "12px", "text-wrap": "wrap", "text-max-width": "110px", "text-valign": "center", "text-halign": "center", width: 112, height: 54, shape: "ellipse" } },
  { selector: "node.domain", style: { shape: "round-rectangle", width: 142, height: 64 } },
  { selector: "node.root", style: { shape: "diamond", width: 126, height: 126, "background-color": "#0f1b25", "font-weight": "bold" } },
  { selector: "node[kind = 'case']", style: { shape: "round-rectangle", "border-style": "double" } },
  { selector: "node[kind = 'conflict']", style: { shape: "diamond", "border-color": "#ff7a52", "border-width": 4 } },
  { selector: "node[kind = 'source']", style: { shape: "rectangle", "border-style": "dashed" } },
  { selector: "node[kind = 'game']", style: { shape: "hexagon" } },
  { selector: "node.selected", style: { "background-color": "#244653", "border-width": 4, "overlay-opacity": 0 } },
  { selector: "node.highlighted", style: { "background-color": "#365e65", "border-color": "#ffffff" } },
  { selector: "edge", style: { width: 1.5, "line-color": "#4b6974", "target-arrow-color": "#4b6974", "target-arrow-shape": "triangle", "curve-style": "bezier" } },
  { selector: "edge[kind = 'conflicts_with']", style: { width: 3, "line-color": "#ff7a52", "target-arrow-color": "#ff7a52", "line-style": "dashed" } },
  { selector: "edge[kind = 'contrasts_with']", style: { width: 2, "line-color": "#ffb36b", "target-arrow-color": "#ffb36b", "line-style": "dotted" } },
  { selector: "edge[kind = 'related_to']", style: { "line-style": "dashed", "target-arrow-shape": "none" } }
];

export interface GraphExplorerProps {
  dataset: KnowledgeDataset;
  selectedId: string;
  highlightedIds: string[];
  onSelect: (id: string) => void;
}

export function GraphExplorer({ dataset, selectedId, highlightedIds, onSelect }: GraphExplorerProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const selectRef = useRef(onSelect);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [tooltipId, setTooltipId] = useState<string>();
  const visible = useMemo(() => visibleData(dataset, selectedId), [dataset, selectedId]);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!canvasRef.current) return;
    const headless = typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent);
    const cy = cytoscape({ container: headless ? undefined : canvasRef.current, headless, style: graphStyles, elements: [] });
    cy.on("tap", "node", (event) => selectRef.current(event.target.id()));
    cy.on("mouseover", "node", (event) => setTooltipId(event.target.id()));
    cy.on("mouseout", "node", () => setTooltipId(undefined));
    cyRef.current = cy;
    return () => { cy.destroy(); cyRef.current = null; };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const highlighted = new Set(highlightedIds);
    const nodes: ElementDefinition[] = visible.entities.map((entity) => ({
      group: "nodes", data: { id: entity.id, label: entity.title, kind: entity.kind },
      classes: [entity.id === GRAPH_ROOT_ID ? "root" : "", entity.id.startsWith("domain-") ? "domain" : "", entity.id === selectedId ? "selected" : "", highlighted.has(entity.id) ? "highlighted" : ""].filter(Boolean).join(" "),
      position: graphPosition(entity, visible.entities, selectedId)
    }));
    const edges: ElementDefinition[] = visible.edges.map((edge, index) => ({
      group: "edges", data: { id: `${edge.source}-${edge.kind}-${edge.target}-${index}`, source: edge.source, target: edge.target, kind: edge.kind }
    }));
    cy.batch(() => { cy.elements().remove(); cy.add([...nodes, ...edges]); });
    cy.layout({ name: "preset", fit: true, padding: 44, animate: false }).run();
  }, [visible, selectedId, highlightedIds]);

  const entityById = (id: string) => id === GRAPH_ROOT_ID ? rootEntity : dataset.entities.find((entity) => entity.id === id);
  const highlightedSet = new Set(highlightedIds);
  const selectedParentId = parentIdFor(selectedId, dataset);
  const crumbs = [rootEntity];
  if (selectedId !== GRAPH_ROOT_ID) {
    const parent = selectedParentId && entityById(selectedParentId);
    const selected = entityById(selectedId);
    if (parent && parent.id !== GRAPH_ROOT_ID) crumbs.push(parent);
    if (selected && !crumbs.some(({ id }) => id === selected.id)) crumbs.push(selected);
  }
  const tooltip = tooltipId && entityById(tooltipId);

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + visible.entities.length) % visible.entities.length;
      buttonRefs.current[next]?.focus();
    } else if (event.key === "Enter") {
      onSelect(visible.entities[index].id);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onSelect(parentIdFor(selectedId, dataset) ?? GRAPH_ROOT_ID);
    }
  };

  return (
    <section className="graph-explorer" aria-labelledby="graph-title">
      <h2 className="visually-hidden" id="graph-title">动作游戏设计概念星图</h2>
      <nav className="graph-breadcrumbs" aria-label="图谱路径">
        {crumbs.map((crumb, index) => <span key={crumb.id}>{index > 0 && <i aria-hidden="true">/</i>}<button type="button" aria-current={crumb.id === selectedId ? "page" : undefined} onClick={() => onSelect(crumb.id)}>{crumb.title}</button></span>)}
      </nav>
      <div className="graph-stage">
        <div ref={canvasRef} className="graph-canvas" aria-hidden="true" />
        <div className="graph-legend" aria-label="关系图例"><span>○ 概念</span><span>◇ 冲突</span><span>┄ 对照</span><span>╌ 冲突关系</span></div>
        {tooltip && <div className="graph-tooltip" role="tooltip"><strong>{tooltip.title}</strong><p>{tooltip.summary}</p>{(() => { const metrics = countMetrics(tooltip, dataset); return <span>关系 {metrics.relations} · 案例 {metrics.cases} · 冲突 {metrics.conflicts}</span>; })()}</div>}
      </div>
      <div className="graph-node-access" role="list" aria-label="可键盘浏览的图谱节点">
        {visible.entities.map((entity, index) => {
          const metrics = countMetrics(entity, dataset);
          return <span role="listitem" key={entity.id} data-testid={`graph-node-${entity.id}`} data-highlighted={highlightedSet.has(entity.id) ? "true" : "false"}><button ref={(node) => { buttonRefs.current[index] = node; }} type="button" data-testid="graph-node" data-kind={entity.kind} data-active={entity.id === selectedId || undefined} data-highlighted={highlightedSet.has(entity.id) ? "true" : undefined} onFocus={() => setTooltipId(entity.id)} onBlur={() => setTooltipId(undefined)} onMouseEnter={() => setTooltipId(entity.id)} onMouseLeave={() => setTooltipId(undefined)} onKeyDown={(event) => onKeyDown(index, event)} onClick={() => onSelect(entity.id)} aria-label={`${entity.title}，关系 ${metrics.relations}，案例 ${metrics.cases}，冲突 ${metrics.conflicts}`}><span aria-hidden="true">{entity.kind === "conflict" ? "◇" : entity.id === GRAPH_ROOT_ID ? "◆" : "○"}</span>{entity.title}</button></span>;
        })}
      </div>
    </section>
  );
}
