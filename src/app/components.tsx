import { useState, type ReactNode } from "react";
import type {
  InlineExample,
  KnowledgeDataset,
  KnowledgeEdge,
  KnowledgeEntity,
  MediaRef
} from "../model";
import type { AtlasView } from "./app-state";

const domainOrder = [
  "domain-type-boundary",
  "domain-system-depth",
  "domain-combat",
  "domain-enemy-boss",
  "domain-presentation",
  "domain-production-philosophy"
];

const viewLabels: Array<{ id: AtlasView; label: string; code: string }> = [
  { id: "graph", label: "概念星图", code: "01" },
  { id: "matrix", label: "游戏矩阵", code: "02" },
  { id: "cases", label: "案例索引", code: "03" },
  { id: "conflicts", label: "冲突索引", code: "04" },
  { id: "sources", label: "来源档案", code: "05" }
];
const conflictTypeLabels: Record<string, string> = {
  definition: "定义冲突", goal: "目标冲突", condition: "条件差异", direct: "直接分歧"
};

export function getDomainEntities(dataset: KnowledgeDataset): KnowledgeEntity[] {
  return dataset.entities
    .filter(({ id }) => id.startsWith("domain-"))
    .sort((a, b) => {
      const aIndex = domainOrder.indexOf(a.id);
      const bIndex = domainOrder.indexOf(b.id);
      return (aIndex < 0 ? domainOrder.length : aIndex) -
        (bIndex < 0 ? domainOrder.length : bIndex);
    });
}

interface AtlasHeaderProps {
  dataset: KnowledgeDataset;
  children: ReactNode;
}

export function AtlasHeader({ dataset, children }: AtlasHeaderProps) {
  return (
    <header className="atlas-header">
      <a className="atlas-brand" href="#atlas-workspace" aria-label="动作游戏设计知识图谱首页">
        <span aria-hidden="true" className="brand-mark">A/D</span>
        <span>
          <strong>动作设计图谱</strong>
          <small>TACTICAL KNOWLEDGE ATLAS</small>
        </span>
      </a>
      {children}
      <dl className="build-status" aria-label="知识库状态">
        <div><dt>节点</dt><dd>{dataset.stats.concepts}</dd></div>
        <div><dt>案例</dt><dd>{dataset.stats.cases}</dd></div>
        <div><dt>冲突</dt><dd>{dataset.stats.conflicts}</dd></div>
        <div><dt>状态</dt><dd className="status-ready">离线就绪</dd></div>
      </dl>
    </header>
  );
}

interface AtlasNavigationProps {
  view: AtlasView;
  onViewChange: (view: AtlasView) => void;
}

export function AtlasNavigation({ view, onViewChange }: AtlasNavigationProps) {
  return (
    <nav className="atlas-navigation" aria-label="研究工具">
      <p className="eyebrow">研究视图</p>
      <ul>
        {viewLabels.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => onViewChange(item.id)}
            >
              <span aria-hidden="true">{item.code}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="navigation-note">
        <span aria-hidden="true">⌁</span>
        <p>所有页面数据已嵌入本地构建，无运行时网络请求。</p>
      </div>
    </nav>
  );
}

interface AtlasWorkspaceProps {
  dataset: KnowledgeDataset;
  selectedId: string;
  view: AtlasView;
  onSelect: (id: string) => void;
}

export function AtlasWorkspace({ dataset, selectedId, view, onSelect }: AtlasWorkspaceProps) {
  const domains = getDomainEntities(dataset);
  const selected = dataset.entities.find(({ id }) => id === selectedId);

  return (
    <main className="atlas-workspace" id="atlas-workspace">
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">{viewLabels.find(({ id }) => id === view)?.label}</p>
          <h1>动作游戏设计</h1>
        </div>
        <p className="workspace-instruction">选择知识域以聚焦直接关系与研究材料</p>
      </div>

      {view === "graph" ? (
        <section className="domain-map" aria-labelledby="domain-map-title">
          <h2 className="visually-hidden" id="domain-map-title">六大知识域</h2>
          <div className="domain-core" aria-hidden="true">
            <span>CORE</span>
            <strong>动作游戏<br />设计</strong>
          </div>
          <div className="domain-grid">
            {domains.map((domain, index) => (
              <button
                type="button"
                key={domain.id}
                className="domain-node"
                data-active={selectedId === domain.id ? "true" : undefined}
                aria-pressed={selectedId === domain.id}
                aria-label={domain.title}
                onClick={() => onSelect(domain.id)}
              >
                <span className="domain-index">D-{String(index + 1).padStart(2, "0")}</span>
                <strong>{domain.title}</strong>
                <span>{domain.summary}</span>
              </button>
            ))}
          </div>
          <div className="focus-readout" aria-live="polite">
            <span>当前焦点</span>
            <strong>{selected?.title ?? "等待选择"}</strong>
            <span>{selected?.summary ?? "从六个知识域开始探索。"}</span>
          </div>
        </section>
      ) : (
        <section className="view-placeholder" aria-labelledby="view-placeholder-title">
          <p className="eyebrow">模块接口已就绪</p>
          <h2 id="view-placeholder-title">
            {viewLabels.find(({ id }) => id === view)?.label}
          </h2>
          <p>本视图将复用当前选择、搜索条件与右侧分层详情。</p>
        </section>
      )}
    </main>
  );
}

interface NodeDetailProps {
  entity: KnowledgeEntity;
  dataset?: KnowledgeDataset;
  depth?: 1 | 2 | 3;
  onDepthChange?: (depth: 1 | 2 | 3) => void;
  onSelectEntity?: (id: string) => void;
}

function edgesFor(entity: KnowledgeEntity, dataset?: KnowledgeDataset): KnowledgeEdge[] {
  return dataset?.edges.filter(({ source, target }) => source === entity.id || target === entity.id) ?? [];
}

function relatedEntities(entity: KnowledgeEntity, dataset?: KnowledgeDataset): KnowledgeEntity[] {
  if (!dataset) return [];
  const ids = new Set(
    edgesFor(entity, dataset).map(({ source, target }) => source === entity.id ? target : source)
  );
  return dataset.entities.filter(({ id }) => ids.has(id));
}

function Metric({ value, children }: { value: number; children: ReactNode }) {
  return <li><strong>{String(value).padStart(2, "0")}</strong><span>{children}</span></li>;
}

function ExampleCard({ example, dataset }: { example: InlineExample; dataset?: KnowledgeDataset }) {
  const game = dataset?.entities.find(({ id }) => id === example.gameId);
  return (
    <article className="research-card">
      <p className="card-kicker">{game?.title ?? example.gameId}</p>
      <h4>{example.subject}</h4>
      <p>{example.mechanism}</p>
      <p className="card-outcome">结果：{example.outcome}</p>
    </article>
  );
}

function MediaCard({ media, dataset }: { media: MediaRef; dataset?: KnowledgeDataset }) {
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const source = dataset?.entities.find(({ id }) => id === media.sourceId);
  return (
    <>
      <figure className="media-card">
        {failed ? <div className="media-fallback" role="status">媒体加载失败：{media.alt}<small>{media.caption}</small></div> : (
          <button type="button" className="media-open" aria-label={`放大：${media.alt}`} onClick={() => setOpen(true)}>
            <img src={media.src} alt={media.alt} loading="lazy" onError={() => setFailed(true)} />
          </button>
        )}
        <figcaption><span>{media.caption || media.alt}</span><small>来源：{source?.title ?? media.sourceId}</small></figcaption>
      </figure>
      {open && !failed && <dialog className="media-dialog" open aria-label={media.alt} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <div><button type="button" className="dialog-close" onClick={() => setOpen(false)} aria-label="关闭媒体">×</button><img src={media.src} alt={media.alt} /><p>{media.caption || media.alt}</p><small>来源：{source?.title ?? media.sourceId}</small></div>
      </dialog>}
    </>
  );
}

export function NodeDetail({
  entity,
  dataset,
  depth = 1,
  onDepthChange,
  onSelectEntity
}: NodeDetailProps) {
  const relations = edgesFor(entity, dataset);
  const related = relatedEntities(entity, dataset);
  const relatedConcepts = related.filter(({ kind }) => kind === "concept");
  const relatedCases = related.filter(({ kind }) => kind === "case");
  const conflicts = related.filter(({ kind }) => kind === "conflict");
  const domainTitles = entity.domainIds.map((id) =>
    dataset?.entities.find((candidate) => candidate.id === id)?.title ?? id
  );
  const synthesis = entity.editorialSynthesis?.replace(/^编者归纳[：:]\s*/, "");

  return (
    <aside className="detail-panel" aria-labelledby="detail-title">
      <div className="detail-panel-heading">
        <div>
          <p className="eyebrow">{entity.kind} / {entity.reviewStatus}</p>
          <h2 id="detail-title">{entity.title}</h2>
        </div>
        <span className="depth-indicator" aria-label={`当前信息深度 ${depth}`}>L{depth}</span>
      </div>

      <div className="provenance-key" aria-label="内容归属标记">
        <span data-provenance="source">来源观点</span>
        <span data-provenance="explanation">编者解释</span>
        <span data-provenance="synthesis">编者归纳</span>
      </div>

      <div className="detail-depth-controls" aria-label="信息深度">
        {([
          [1, "一眼看懂"],
          [2, "展开理解"],
          [3, "深入研究"]
        ] as const).map(([level, label]) => (
          <button
            type="button"
            key={level}
            aria-label={label}
            aria-pressed={depth === level}
            onClick={() => onDepthChange?.(level)}
          >
            <span>L{level}</span>{label}
          </button>
        ))}
      </div>

      <div className="detail-scroll-region">
        <section className="detail-section" aria-labelledby="detail-summary-title">
          <h3 id="detail-summary-title">节点速览</h3>
          <p className="detail-summary">{entity.summary || "此节点尚无摘要。"}</p>
          <dl className="detail-metadata">
            <div><dt>知识域</dt><dd>{domainTitles.join(" / ") || (entity.id.startsWith("domain-") ? entity.title : "跨域")}</dd></div>
            <div><dt>复核</dt><dd>{entity.reviewStatus === "reviewed" ? "已复核" : "待复核"}</dd></div>
          </dl>
          <ul className="metric-list" aria-label="节点关系计数">
            <Metric value={relations.length}>关系</Metric>
            <Metric value={entity.examples.length}>案例</Metric>
            <Metric value={conflicts.length + (entity.kind === "conflict" ? 1 : 0)}>冲突</Metric>
          </ul>
        </section>

        {depth >= 2 && (
          <>
            <section className="detail-section" aria-labelledby="detail-explanation-title">
              <h3 id="detail-explanation-title">结构化解释</h3>
              {entity.bodyHtml ? (
                <div className="prose" dangerouslySetInnerHTML={{ __html: entity.bodyHtml }} />
              ) : (
                <p className="empty-state">此节点暂无展开正文。</p>
              )}
            </section>
            <section className="detail-section" aria-labelledby="detail-conditions-title">
              <h3 id="detail-conditions-title">适用条件</h3>
              {entity.tags.length ? (
                <ul className="tag-list">{entity.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              ) : (
                <p className="empty-state">条件与边界见上方结构化解释。</p>
              )}
            </section>
            <section className="detail-section" aria-labelledby="detail-related-title">
              <h3 id="detail-related-title">相关概念</h3>
              {relatedConcepts.length ? (
                <ul className="related-list">
                  {relatedConcepts.map((concept) => (
                    <li key={concept.id}>
                      <button type="button" onClick={() => onSelectEntity?.(concept.id)}>
                        {concept.title}<span aria-hidden="true">↗</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">暂无直接关联概念。</p>
              )}
            </section>
          </>
        )}

        {depth >= 3 && (
          <>
            <section className="detail-section" aria-labelledby="detail-cases-title">
              <h3 id="detail-cases-title">案例</h3>
              {entity.examples.length ? (
                <div className="research-grid">
                  {entity.examples.map((example) => (
                    <ExampleCard key={example.id} example={example} dataset={dataset} />
                  ))}
                </div>
              ) : relatedCases.length ? (
                <ul className="related-list">{relatedCases.map((caseEntity) => <li key={caseEntity.id}><button type="button" onClick={() => onSelectEntity?.(caseEntity.id)}>{caseEntity.title}<span aria-hidden="true">↗</span></button></li>)}</ul>
              ) : <p className="empty-state">暂无直接案例。</p>}
            </section>
            <section className="detail-section" aria-labelledby="detail-conflicts-title">
              <h3 id="detail-conflicts-title">冲突观点</h3>
              {entity.conflictSides?.length ? (
                <><p className="conflict-question">争议问题：{entity.summary}</p><p className="conflict-type-label">类型：{conflictTypeLabels[entity.conflictType ?? ""] ?? "未分类"}</p><div className="research-grid">
                  {entity.conflictSides.map((side) => (
                    <article className="research-card conflict-card" key={side.label}>
                      <h4>{side.label}</h4>
                      <p>{side.claim}</p>
                      <p className="card-outcome">条件：{side.conditions}</p>
                      <p className="conflict-sources"><strong>来源：</strong>{side.sourceIds.map((id) => dataset?.entities.find((source) => source.id === id)?.title ?? id).join("、") || "未记录"}</p>
                    </article>
                  ))}
                </div></>
              ) : conflicts.length ? (
                <ul className="related-list">{conflicts.map((conflict) => <li key={conflict.id}><button type="button" onClick={() => onSelectEntity?.(conflict.id)}>{conflict.title}<span aria-hidden="true">↗</span></button></li>)}</ul>
              ) : <p className="empty-state">当前节点没有直接冲突卡。</p>}
            </section>
            <section className="detail-section" aria-labelledby="detail-media-title">
              <h3 id="detail-media-title">媒体</h3>
              {entity.media.length ? (
                <div className="media-grid">{entity.media.map((media) => <MediaCard key={media.src} media={media} dataset={dataset} />)}</div>
              ) : <p className="empty-state">当前节点没有关联媒体。</p>}
            </section>
            <section className="detail-section" aria-labelledby="detail-citations-title">
              <h3 id="detail-citations-title">引用与来源</h3>
              {entity.citations.length ? (
                <ol className="citation-list">
                  {entity.citations.map((citation, index) => {
                    const source = dataset?.entities.find(({ id }) => id === citation.sourceId);
                    return <li key={`${citation.sourceId}-${citation.locator}-${index}`}><strong>{source?.title ?? citation.sourceId}</strong><span>{citation.locator}</span></li>;
                  })}
                </ol>
              ) : <p className="empty-state">当前节点没有引用记录。</p>}
            </section>
            <section className="detail-section editorial-synthesis" aria-labelledby="detail-synthesis-title">
              <h3 id="detail-synthesis-title">综合判断</h3>
              <p>{synthesis || "此节点暂未形成编者综合判断。"}</p>
            </section>
          </>
        )}
      </div>
    </aside>
  );
}

export function EmptyDetail() {
  return (
    <aside className="detail-panel empty-detail" aria-label="节点详情">
      <p className="eyebrow">NODE DETAIL</p>
      <h2>选择一个知识节点</h2>
      <p>详情将在此按速览、理解和研究三层展开。</p>
    </aside>
  );
}
