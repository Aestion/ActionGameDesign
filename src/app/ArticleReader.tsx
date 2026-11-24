import { useEffect, useMemo, useRef, useState } from "react";
import type { ArticleHeading, KnowledgeDataset, KnowledgeEntity } from "../model";
import { ExampleCard, MediaCard } from "./components";

interface ArticleReaderProps {
  entity: KnowledgeEntity;
  dataset: KnowledgeDataset;
  onBack: () => void;
  onSelectEntity: (id: string) => void;
}

function canUseWindowScroll(): boolean {
  return typeof window !== "undefined"
    && typeof window.scrollTo === "function"
    && !/jsdom/i.test(typeof navigator === "undefined" ? "" : navigator.userAgent);
}

function sectionFromHash(hash: string): string {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(value).get("section")?.trim() ?? "";
}

function relatedEntities(entity: KnowledgeEntity, dataset: KnowledgeDataset): KnowledgeEntity[] {
  const ids = new Set<string>();
  for (const edge of dataset.edges) {
    if (edge.source === entity.id) ids.add(edge.target);
    if (edge.target === entity.id) ids.add(edge.source);
  }
  entity.domainIds.forEach((id) => ids.add(id));
  ids.delete(entity.id);
  return [...ids].map((id) => dataset.entities.find((candidate) => candidate.id === id)).filter((candidate): candidate is KnowledgeEntity => Boolean(candidate)).slice(0, 8);
}

function TOC({
  headings,
  activeId,
  onJump,
  compact = false
}: {
  headings: ArticleHeading[];
  activeId: string;
  onJump: (id: string) => void;
  compact?: boolean;
}) {
  if (headings.length === 0) {
    return <p className="reader-toc-empty">本文暂无可导航章节。</p>;
  }

  const counters = [0, 0, 0];
  const numbered = headings.map((heading) => {
    const index = Math.max(0, heading.level - 2);
    counters[index] += 1;
    for (let deeper = index + 1; deeper < counters.length; deeper += 1) counters[deeper] = 0;
    return { ...heading, number: counters.slice(0, index + 1).join(".") };
  });

  const content = (
    <nav aria-label={compact ? "本文目录（移动）" : "本文目录"} className={compact ? "reader-toc-nav reader-toc-nav--compact" : "reader-toc-nav"}>
      {numbered.map((heading) => (
        <a
          key={heading.id}
          href={"#" + heading.id}
          data-level={heading.level}
          aria-current={activeId === heading.id ? "location" : undefined}
          onClick={(event) => {
            event.preventDefault();
            onJump(heading.id);
          }}
        >
          <span>{heading.number}</span>
          {heading.text}
        </a>
      ))}
    </nav>
  );

  if (compact) {
    return <details className="reader-toc-mobile"><summary>展开本文目录 · {headings.length} 节</summary>{content}</details>;
  }

  return (
    <aside className="reader-toc" aria-label="阅读导航">
      <div className="reader-toc-heading"><span>ON THIS PAGE</span><strong>本文目录</strong></div>
      {content}
      <p className="reader-toc-hint">点击章节可快速定位；链接会保留当前文章。</p>
    </aside>
  );
}

export function ArticleReader({ entity, dataset, onBack, onSelectEntity }: ArticleReaderProps) {
  const articleRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState(entity.headings?.[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const headings = entity.headings ?? [];
  const domainTitles = entity.domainIds.map((id) => dataset.entities.find((candidate) => candidate.id === id)?.title ?? id);
  const related = useMemo(() => relatedEntities(entity, dataset), [dataset, entity]);
  const peers = useMemo(() => dataset.entities.filter((candidate) => candidate.id !== entity.id && candidate.kind === entity.kind && candidate.bodyHtml && (candidate.domainIds.some((id) => entity.domainIds.includes(id)) || candidate.kind === "source")), [dataset.entities, entity]);
  const currentIndex = dataset.entities.findIndex((candidate) => candidate.id === entity.id);
  const orderedPeers = [...peers].sort((left, right) => dataset.entities.findIndex((candidate) => candidate.id === left.id) - dataset.entities.findIndex((candidate) => candidate.id === right.id));
  const previous = orderedPeers.filter((candidate) => dataset.entities.findIndex((item) => item.id === candidate.id) < currentIndex).at(-1);
  const next = orderedPeers.find((candidate) => dataset.entities.findIndex((item) => item.id === candidate.id) > currentIndex);
  const synthesis = entity.editorialSynthesis?.replace(/^编者归纳[：:]\s*/, "");

  useEffect(() => {
    setActiveId(entity.headings?.[0]?.id ?? "");
    setProgress(0);
    if (canUseWindowScroll()) window.scrollTo({ top: 0, behavior: "auto" });
    const requested = sectionFromHash(window.location.hash);
    if (!requested || typeof window.requestAnimationFrame !== "function") return;
    const frame = window.requestAnimationFrame(() => {
      const element = document.getElementById(requested);
      if (element && typeof element.scrollIntoView === "function") element.scrollIntoView({ block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [entity.id, entity.headings]);

  useEffect(() => {
    const update = () => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
      if (!headings.length) return;
      const threshold = 170;
      let current = headings[0].id;
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= threshold) current = heading.id;
        else break;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [entity.id, headings]);

  const jumpTo = (id: string) => {
    const element = document.getElementById(id);
    if (element && typeof element.scrollIntoView === "function") {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const params = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash);
    params.set("section", id);
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search + "#" + params.toString());
  };

  return (
    <main className="page reader-page" id="atlas-workspace">
      <div className="reader-progress" aria-hidden="true"><span style={{ width: (progress * 100).toFixed(2) + "%" }} /></div>
      <div className="reader-toolbar">
        <button type="button" className="reader-back" onClick={onBack}><span aria-hidden="true">←</span> 返回图谱</button>
        <div className="reader-meta">
          <span>{entity.kind}</span>
          <span>约 {entity.readingMinutes ?? 1} 分钟</span>
          <span>{entity.reviewStatus === "reviewed" ? "已复核" : "待复核"}</span>
        </div>
      </div>

      <article className="reader-paper" ref={articleRef}>
        <header className="page-head reader-header">
          <div className="reader-kicker">
            <span>{domainTitles.join(" / ") || "专题阅读"}</span>
            <span>更新于 {entity.updated}</span>
          </div>
          <h1>{entity.title}</h1>
          <p className="page-lede reader-summary">{entity.summary}</p>
          {entity.tags.length > 0 && <ul className="reader-tags" aria-label="主题标签">{entity.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
          {headings.length > 0 && <TOC headings={headings} activeId={activeId} onJump={jumpTo} compact />}
        </header>

        <div className="reader-layout">
          <div className="reader-main">
            {entity.bodyHtml ? (
              <div className="prose reader-body" dangerouslySetInnerHTML={{ __html: entity.bodyHtml }} />
            ) : (
              <p className="empty-state reader-empty">此节点尚未提供完整正文。</p>
            )}

            {entity.examples.length > 0 && (
              <section className="reader-appendix" aria-labelledby="reader-cases">
                <div className="reader-section-title"><span>EVIDENCE</span><h2 id="reader-cases">案例证据</h2></div>
                <div className="research-grid">{entity.examples.map((example) => <ExampleCard key={example.id} example={example} dataset={dataset} />)}</div>
              </section>
            )}

            {entity.media.length > 0 && (
              <section className="reader-appendix" aria-labelledby="reader-media">
                <div className="reader-section-title"><span>MEDIA</span><h2 id="reader-media">动作样本</h2></div>
                <div className="media-grid">{entity.media.map((media) => <MediaCard key={media.src} media={media} dataset={dataset} />)}</div>
              </section>
            )}

            {entity.citations.length > 0 && (
              <section className="reader-appendix" aria-labelledby="reader-sources">
                <div className="reader-section-title"><span>SOURCES</span><h2 id="reader-sources">引用与来源</h2></div>
                <ol className="citation-list">{entity.citations.map((citation, index) => {
                  const source = dataset.entities.find(({ id }) => id === citation.sourceId);
                  return <li key={citation.sourceId + "-" + citation.locator + "-" + index}><strong>{source?.title ?? citation.sourceId}</strong><span>{citation.locator}</span></li>;
                })}</ol>
              </section>
            )}

            {synthesis && <section className="reader-synthesis"><span>EDITOR'S NOTE</span><h2>编者归纳</h2><p>{synthesis}</p></section>}

            {related.length > 0 && (
              <section className="reader-appendix" aria-labelledby="reader-related">
                <div className="reader-section-title"><span>CONNECTIONS</span><h2 id="reader-related">继续探索</h2></div>
                <div className="reader-related-grid">{related.map((item) => <button type="button" key={item.id} onClick={() => onSelectEntity(item.id)}><small>{item.kind}</small><strong>{item.title}</strong><span>{item.summary}</span></button>)}</div>
              </section>
            )}
          </div>

          <TOC headings={headings} activeId={activeId} onJump={jumpTo} />
        </div>

        <footer className="reader-footer">
          <div className="reader-pager">
            {previous ? <button type="button" onClick={() => onSelectEntity(previous.id)}><span>← 上一篇</span><strong>{previous.title}</strong></button> : <span />}
            {next ? <button type="button" onClick={() => onSelectEntity(next.id)}><span>下一篇 →</span><strong>{next.title}</strong></button> : <span />}
          </div>
          <p>内容随知识库本地构建，引用、媒体与关系均可在图谱中继续追溯。</p>
        </footer>
      </article>
    </main>
  );
}
