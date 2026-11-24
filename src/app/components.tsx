import { useEffect, useRef, useState, type ReactNode } from "react";
import type {
  InlineExample,
  KnowledgeDataset,
  KnowledgeEdge,
  KnowledgeEntity,
  MediaRef
} from "../model";
import type { AtlasView } from "./app-state";

export type ViewId = Exclude<AtlasView, "reader">;

export interface ViewEntry {
  id: ViewId;
  code: string;
  label: string;
  title: string;
  lede: string;
}

export const viewEntries: ViewEntry[] = [
  {
    id: "graph",
    code: "01",
    label: "知识结构",
    title: "动作游戏设计",
    lede: "按知识域逐层展开目录，点标题选中节点、点 + 展开下一级；右侧详情追溯关系与正文全文，需要整体关系时切换到关系图。"
  },
  {
    id: "matrix",
    code: "02",
    label: "游戏矩阵",
    title: "同一维度上，各家怎么做",
    lede: "矩阵呈现结构化倾向与可追溯材料，不是评分。没有资料的格子会明确标记为空，不自动补判断。"
  },
  {
    id: "cases",
    code: "03",
    label: "案例索引",
    title: "案例索引",
    lede: "按标题或更新时间排列的结构化案例；打开任意一条可在右侧查看依据，或直接进入全文阅读。"
  },
  {
    id: "conflicts",
    code: "04",
    label: "冲突索引",
    title: "冲突与分歧",
    lede: "同一问题下的不同主张并列呈现，不做正确性排名；每一侧都带适用条件与来源。"
  },
  {
    id: "sources",
    code: "05",
    label: "来源档案",
    title: "来源与方法",
    lede: "来源观点与编者解释分开记录；引用可回到正文、案例与图谱节点，未完成处保持空白。"
  }
];

export function viewEntryFor(view: AtlasView): ViewEntry {
  const id: ViewId = view === "reader" ? "graph" : view;
  return viewEntries.find((entry) => entry.id === id) ?? viewEntries[0];
}
const conflictTypeLabels: Record<string, string> = {
  definition: "定义冲突", goal: "目标冲突", condition: "条件差异", direct: "直接分歧"
};

interface AtlasHeaderProps {
  dataset: KnowledgeDataset;
  children: ReactNode;
}

export function AtlasHeader({ dataset, children }: AtlasHeaderProps) {
  return (
    <header className="atlas-header">
      <div className="atlas-header-inner">
        <a className="atlas-brand" href="#atlas-workspace" aria-label="动作游戏设计知识图谱首页">
          <strong>动作设计图谱</strong>
          <small>TACTICAL KNOWLEDGE ATLAS</small>
        </a>
        {children}
        <p className="atlas-status" aria-label="知识库状态">
          <span className="status-ready">离线就绪</span>
          <span>本地构建</span>
        </p>
      </div>
    </header>
  );
}

interface AtlasNavigationProps {
  view: AtlasView;
  onViewChange: (view: ViewId) => void;
}

export function AtlasNavigation({ view, onViewChange }: AtlasNavigationProps) {
  const active = view === "reader" ? "graph" : view;
  return (
    <nav className="atlas-navigation" aria-label="研究视图">
      <ul>
        {viewEntries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              aria-current={active === entry.id ? "page" : undefined}
              onClick={() => onViewChange(entry.id)}
            >
              <span aria-hidden="true">{entry.code}</span>
              {entry.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface AtlasFooterProps {
  view: AtlasView;
  dataset: KnowledgeDataset;
  onViewChange: (view: ViewId) => void;
}

export function AtlasFooter({ view, dataset, onViewChange }: AtlasFooterProps) {
  const active = viewEntryFor(view);
  const index = Math.max(0, viewEntries.findIndex((entry) => entry.id === active.id));
  const previous = viewEntries[(index - 1 + viewEntries.length) % viewEntries.length];
  const next = viewEntries[(index + 1) % viewEntries.length];
  return (
    <footer className="page-foot">
      <button
        type="button"
        className="page-foot-link"
        aria-label={`上一视图：${previous.label}`}
        onClick={() => onViewChange(previous.id)}
      >
        <span aria-hidden="true">←</span> {previous.code} / {previous.label}
      </button>
      <span className="count">
        {active.code} / {String(viewEntries.length).padStart(2, "0")} · 节点 {dataset.stats.concepts} · 案例 {dataset.stats.cases} · 冲突 {dataset.stats.conflicts}
      </span>
      <button
        type="button"
        className="page-foot-link"
        aria-label={`下一视图：${next.label}`}
        onClick={() => onViewChange(next.id)}
      >
        {next.code} / {next.label} <span aria-hidden="true">→</span>
      </button>
    </footer>
  );
}

interface NodeDetailProps {
  entity: KnowledgeEntity;
  dataset?: KnowledgeDataset;
  onSelectEntity?: (id: string) => void;
  onRead?: (id: string) => void;
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

export function ExampleCard({ example, dataset }: { example: InlineExample; dataset?: KnowledgeDataset }) {
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

export function MediaCard({ media, dataset }: { media: MediaRef; dataset?: KnowledgeDataset }) {
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(media.kind !== "gif");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const source = dataset?.entities.find(({ id }) => id === media.sourceId);

  useEffect(() => {
    setFailed(false);
    setOpen(false);
    setLoaded(media.kind !== "gif");
  }, [media.kind, media.src]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else if (!open && dialog.open && typeof dialog.close === "function") {
      dialog.close();
    }
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <figure className="media-card">
        {failed ? <div className="media-fallback" role="status">媒体加载失败：{media.alt}<small>{media.caption}</small></div> : !loaded ? (
          <button type="button" className="media-deferred" aria-label={`加载并放大动图：${media.alt}`} onClick={() => { setLoaded(true); setOpen(true); }}>
            <span className="media-deferred-mark" aria-hidden="true">▶</span>
            <strong>加载动作样本</strong>
            <small>为减少离线包首屏流量，动图在点击后载入。</small>
          </button>
        ) : (
          <button type="button" className="media-open" aria-label={`放大：${media.alt}`} onClick={() => setOpen(true)}>
            <img src={media.src} alt={media.alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
          </button>
        )}
        <figcaption><span>{media.caption || media.alt}</span><small>来源：{source?.title ?? media.sourceId}</small></figcaption>
      </figure>
      {open && !failed && <dialog
        ref={dialogRef}
        className="media-dialog"
        open={typeof HTMLDialogElement === "undefined" || !HTMLDialogElement.prototype?.showModal ? true : undefined}
        aria-label={media.alt}
        onCancel={close}
        onClose={close}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      >
        <div><button type="button" className="dialog-close" onClick={close} aria-label="关闭媒体">×</button><img src={media.src} alt={media.alt} /><p>{media.caption || media.alt}</p><small>来源：{source?.title ?? media.sourceId}</small></div>
      </dialog>}
    </>
  );
}

export function NodeDetail({
  entity,
  dataset,
  onSelectEntity,
  onRead
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
        {entity.bodyHtml && onRead && (
          <button type="button" className="read-mode-button" onClick={() => onRead(entity.id)}>
            阅读全文 <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>

      <div className="provenance-key" aria-label="内容归属标记">
        <span data-provenance="source">来源观点</span>
        <span data-provenance="explanation">编者解释</span>
        <span data-provenance="synthesis">编者归纳</span>
      </div>

      <div className="detail-scroll-region">
        <section className="detail-section detail-brief" aria-labelledby="detail-brief-title">
          <h3 id="detail-brief-title">简述</h3>
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

        <section className="detail-section detail-detailed" aria-labelledby="detail-detailed-title">
          <h3 id="detail-detailed-title">详细</h3>
          <div className="detail-subsection">
            <h4 id="detail-explanation-title">结构化解释</h4>
              {entity.bodyHtml ? (
                <div className="prose" dangerouslySetInnerHTML={{ __html: entity.bodyHtml }} />
              ) : (
                <p className="empty-state">此节点暂无展开正文。</p>
              )}
          </div>
          <div className="detail-subsection">
            <h4 id="detail-conditions-title">适用条件</h4>
              {entity.tags.length ? (
                <ul className="tag-list">{entity.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              ) : (
                <p className="empty-state">条件与边界见上方结构化解释。</p>
              )}
          </div>
          <div className="detail-subsection">
            <h4 id="detail-related-title">相关概念</h4>
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
          </div>
        </section>

        <section className="detail-section detail-supplement" aria-labelledby="detail-supplement-title">
          <h3 id="detail-supplement-title">补充</h3>
          <div className="detail-subsection">
            <h4 id="detail-cases-title">案例</h4>
              {entity.examples.length ? (
                <div className="research-grid">
                  {entity.examples.map((example) => (
                    <ExampleCard key={example.id} example={example} dataset={dataset} />
                  ))}
                </div>
              ) : relatedCases.length ? (
                <ul className="related-list">{relatedCases.map((caseEntity) => <li key={caseEntity.id}><button type="button" onClick={() => onSelectEntity?.(caseEntity.id)}>{caseEntity.title}<span aria-hidden="true">↗</span></button></li>)}</ul>
              ) : <p className="empty-state">暂无直接案例。</p>}
          </div>
          <div className="detail-subsection">
            <h4 id="detail-conflicts-title">冲突观点</h4>
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
          </div>
          <div className="detail-subsection">
            <h4 id="detail-media-title">媒体</h4>
              {entity.media.length ? (
                <div className="media-grid">{entity.media.map((media) => <MediaCard key={media.src} media={media} dataset={dataset} />)}</div>
              ) : <p className="empty-state">当前节点没有关联媒体。</p>}
          </div>
          <div className="detail-subsection">
            <h4 id="detail-citations-title">引用与来源</h4>
              {entity.citations.length ? (
                <ol className="citation-list">
                  {entity.citations.map((citation, index) => {
                    const source = dataset?.entities.find(({ id }) => id === citation.sourceId);
                    return <li key={`${citation.sourceId}-${citation.locator}-${index}`}><strong>{source?.title ?? citation.sourceId}</strong><span>{citation.locator}</span></li>;
                  })}
                </ol>
              ) : <p className="empty-state">当前节点没有引用记录。</p>}
          </div>
          <div className="detail-subsection editorial-synthesis">
            <h4 id="detail-synthesis-title">综合判断</h4>
              <p>{synthesis || "此节点暂未形成编者综合判断。"}</p>
          </div>
        </section>
      </div>
    </aside>
  );
}

export function EmptyDetail() {
  return (
    <aside className="detail-panel empty-detail" aria-label="节点详情">
      <p className="eyebrow">NODE DETAIL</p>
      <h2>选择一个知识节点</h2>
      <p>详情将在此按简述、详细和补充三段展开。</p>
    </aside>
  );
}
