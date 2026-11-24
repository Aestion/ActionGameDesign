import { useEffect, useMemo, useReducer } from "react";
import type { BuildReport, KnowledgeDataset } from "../model";
import { searchDataset } from "../search";
import { atlasReducer, createInitialState, nodeHash, nodeIdFromHash, viewFromHash, type AtlasView } from "./app-state";
import {
  AtlasFooter,
  AtlasHeader,
  AtlasNavigation,
  EmptyDetail,
  NodeDetail,
  viewEntryFor,
  type ViewId
} from "./components";
import { ArticleReader } from "./ArticleReader";
import { ComparisonMatrix } from "./ComparisonMatrix";
import { GRAPH_ROOT_ID, StructureExplorer } from "./StructureExplorer";
import { IndexViews } from "./IndexViews";
import { SearchPanel } from "./SearchPanel";

export interface AppProps {
  dataset: KnowledgeDataset;
  buildReport?: BuildReport;
}

function BuildStatePage({ report }: { report?: BuildReport }) {
  if (report && !report.success) {
    return (
      <main className="atlas-message-page" role="alert" aria-label="知识库构建失败">
        <p className="eyebrow">BUILD FAILED</p>
        <h1>知识库构建失败</h1>
        <p>请按下面的文件与错误信息修复内容，然后重新运行“更新知识库.cmd”。上一版可用网站不会被覆盖。</p>
        <ul>
          {report.issues.length ? report.issues.map((issue, index) => (
            <li key={issue.code + "-" + issue.file + "-" + index}>
              <strong>{issue.file}</strong>
              <span>{issue.message}</span>
              <small>错误代码：{issue.code}</small>
            </li>
          )) : <li><span>构建未提供具体错误；请在命令窗口中查看完整输出。</span></li>}
        </ul>
      </main>
    );
  }

  return (
    <main className="atlas-message-page" role="status" aria-label="知识库为空">
      <p className="eyebrow">EMPTY DATASET</p>
      <h1>知识库为空</h1>
      <p>当前构建没有可显示的知识节点。请检查 <code>content/</code>，再运行“更新知识库.cmd”。</p>
    </main>
  );
}

export function App({ dataset, buildReport }: AppProps) {
  if (!buildReport?.success && buildReport) return <BuildStatePage report={buildReport} />;
  if (dataset.entities.length === 0) return <BuildStatePage />;
  return <AtlasApplication dataset={dataset} />;
}

function AtlasApplication({ dataset }: { dataset: KnowledgeDataset }) {
  const [state, dispatch] = useReducer(
    atlasReducer,
    typeof window === "undefined" ? "" : window.location.hash,
    createInitialState
  );
  const entityIds = useMemo(() => new Set(dataset.entities.map(({ id }) => id)), [dataset]);
  const selectedId = entityIds.has(state.selectedId) || state.selectedId === GRAPH_ROOT_ID
    ? state.selectedId
    : GRAPH_ROOT_ID;
  const selected = dataset.entities.find(({ id }) => id === selectedId);
  const searchActive = Boolean(state.query.trim() || Object.values(state.filters).some((values) => values.length));
  const resultIds = useMemo(() => searchDataset(dataset, state.query, state.filters), [dataset, state.filters, state.query]);
  const highlightedIds = useMemo(() => {
    if (!searchActive) return [];
    const highlighted = new Set(resultIds);
    const resultSet = new Set(resultIds);
    for (const entity of dataset.entities) {
      if (resultSet.has(entity.id)) entity.domainIds.forEach((id) => highlighted.add(id));
      if (entity.examples.some(({ gameId }) => resultSet.has(gameId))) {
        highlighted.add(entity.id);
        entity.domainIds.forEach((id) => highlighted.add(id));
      }
    }
    for (const edge of dataset.edges) {
      if (resultSet.has(edge.source) || resultSet.has(edge.target)) {
        const relatedId = resultSet.has(edge.source) ? edge.target : edge.source;
        dataset.entities.find(({ id }) => id === relatedId)?.domainIds.forEach((id) => highlighted.add(id));
      }
    }
    return [...highlighted];
  }, [dataset.edges, dataset.entities, resultIds, searchActive]);

  useEffect(() => {
    const onHashChange = () => {
      const id = nodeIdFromHash(window.location.hash);
      if (entityIds.has(id) || id === GRAPH_ROOT_ID) {
        dispatch({ type: "hydrate-hash", id, view: viewFromHash(window.location.hash) });
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [entityIds]);

  const writeHash = (id: string, view: AtlasView) => {
    const nextUrl = window.location.pathname + window.location.search + nodeHash(id, view);
    window.history.pushState(window.history.state, "", nextUrl);
  };

  const selectEntity = (id: string) => {
    if (!entityIds.has(id) && id !== GRAPH_ROOT_ID) return;
    dispatch({ type: "select-node", id });
    writeHash(id, state.view);
  };

  const changeView = (view: AtlasView, id = selectedId) => {
    if (!entityIds.has(id) && id !== GRAPH_ROOT_ID) return;
    dispatch({ type: "set-view", view });
    if (id !== selectedId) dispatch({ type: "select-node", id });
    writeHash(id, view);
  };

  const openInGraph = (id: string) => changeView("graph", id);
  const openView = (view: ViewId) => changeView(view);
  const showDetailPanel = state.view === "graph"
    || state.view === "cases"
    || state.view === "conflicts"
    || state.view === "sources";
  const entry = viewEntryFor(state.view);

  return (
    <div className="atlas-shell">
      <AtlasHeader dataset={dataset}>
        <AtlasNavigation view={state.view} onViewChange={openView} />
        <SearchPanel dataset={dataset} query={state.query} filters={state.filters} resultIds={resultIds}
          onQueryChange={(query) => dispatch({ type: "set-query", query })}
          onFiltersChange={(filters) => dispatch({ type: "set-filters", filters })}
          onClear={() => { dispatch({ type: "set-query", query: "" }); dispatch({ type: "clear-filters" }); }}
          onSelect={openInGraph} />
      </AtlasHeader>

      {state.view === "reader" ? (
        selected?.bodyHtml ? (
          <ArticleReader
            key={selected.id}
            entity={selected}
            dataset={dataset}
            onBack={() => changeView("graph")}
            onSelectEntity={selectEntity}
          />
        ) : (
          <main className="page reader-empty-page" id="atlas-workspace">
            <div className="page-head">
              <p className="kicker">READING MODE</p>
              <h1>此节点暂时没有完整正文</h1>
              <p className="page-lede">请返回图谱选择带正文的概念、案例或来源节点；这类记录仍可在右侧详情里查看结构化依据。</p>
            </div>
            <button type="button" className="reader-back" onClick={() => changeView("graph")}>返回图谱</button>
          </main>
        )
      ) : (
        <main className="page" id="atlas-page">
          <div className="page-head">
            <p className="kicker">{entry.code} / {entry.label}</p>
            <h1>{entry.title}</h1>
            <p className="page-lede">{entry.lede}</p>
          </div>
          <div className={"page-body" + (showDetailPanel ? "" : " page-body--full")}>
            <section className="atlas-workspace" id="atlas-workspace" aria-label={entry.label}>
              {state.view === "graph" ? (
                <StructureExplorer
                  dataset={dataset}
                  selectedId={selectedId}
                  highlightedIds={highlightedIds}
                  onSelect={selectEntity}
                  onRead={(id) => changeView("reader", id)}
                />
              ) : state.view === "matrix" ? (
                <ComparisonMatrix dataset={dataset} onSelect={openInGraph} />
              ) : (
                <IndexViews dataset={dataset} view={state.view} onSelect={selectEntity} />
              )}
            </section>
            {showDetailPanel && (selected ? (
              <NodeDetail
                entity={selected}
                dataset={dataset}
                onSelectEntity={selectEntity}
                onRead={(id) => changeView("reader", id)}
              />
            ) : <EmptyDetail />)}
          </div>
        </main>
      )}

      {state.view !== "reader" && (
        <AtlasFooter view={state.view} dataset={dataset} onViewChange={openView} />
      )}
    </div>
  );
}
