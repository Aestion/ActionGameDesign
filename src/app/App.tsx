import { useEffect, useMemo, useReducer } from "react";
import type { BuildReport, KnowledgeDataset } from "../model";
import { searchDataset } from "../search";
import { atlasReducer, createInitialState, nodeHash, nodeIdFromHash } from "./app-state";
import {
  AtlasHeader,
  AtlasNavigation,
  EmptyDetail,
  NodeDetail
} from "./components";
import { ComparisonMatrix } from "./ComparisonMatrix";
import { GRAPH_ROOT_ID, GraphExplorer } from "./GraphExplorer";
import { IndexViews } from "./IndexViews";
import { MobileTree } from "./MobileTree";
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
            <li key={`${issue.code}-${issue.file}-${index}`}>
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
      if (entityIds.has(id) || id === GRAPH_ROOT_ID) dispatch({ type: "hydrate-hash", id });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [entityIds]);

  const selectEntity = (id: string) => {
    if (!entityIds.has(id) && id !== GRAPH_ROOT_ID) return;
    dispatch({ type: "select-node", id });
    const nextHash = nodeHash(id);
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  };
  const openInGraph = (id: string) => {
    dispatch({ type: "set-view", view: "graph" });
    selectEntity(id);
  };

  return (
    <div className="atlas-shell">
      <AtlasHeader dataset={dataset}>
        <SearchPanel dataset={dataset} query={state.query} filters={state.filters} resultIds={resultIds}
          onQueryChange={(query) => dispatch({ type: "set-query", query })}
          onFiltersChange={(filters) => dispatch({ type: "set-filters", filters })}
          onClear={() => { dispatch({ type: "set-query", query: "" }); dispatch({ type: "clear-filters" }); }}
          onSelect={openInGraph} />
      </AtlasHeader>
      <div className="atlas-layout">
        <AtlasNavigation
          view={state.view}
          onViewChange={(view) => dispatch({ type: "set-view", view })}
        />
        {state.view === "graph" ? (
          <main className="atlas-workspace" id="atlas-workspace">
            <div className="workspace-heading">
              <div><p className="eyebrow">概念星图</p><h1>动作游戏设计</h1></div>
              <p className="workspace-instruction">拖动、缩放图谱；选择节点展开直接关系。键盘可用方向键、Enter 与 Escape 导航。</p>
            </div>
            <GraphExplorer dataset={dataset} selectedId={selectedId} highlightedIds={highlightedIds} onSelect={selectEntity} />
            <MobileTree dataset={dataset} selectedId={selectedId} onSelect={selectEntity} />
          </main>
        ) : (
          <main className="atlas-workspace" id="atlas-workspace">
            <div className="workspace-heading"><div><p className="eyebrow">研究视图</p><h1>{state.view === "matrix" ? "游戏比较矩阵" : state.view === "cases" ? "案例索引" : state.view === "conflicts" ? "冲突索引" : "来源档案"}</h1></div><p className="workspace-instruction">从结构化记录打开依据；右侧详情与稳定链接会同步保留。</p></div>
            {state.view === "matrix" ? <ComparisonMatrix dataset={dataset} onSelect={openInGraph} /> : <IndexViews dataset={dataset} view={state.view} onSelect={selectEntity} />}
          </main>
        )}
        {selected ? (
          <NodeDetail
            entity={selected}
            dataset={dataset}
            depth={state.detailDepth}
            onDepthChange={(depth) => dispatch({ type: "set-detail-depth", depth })}
            onSelectEntity={selectEntity}
          />
        ) : <EmptyDetail />}
      </div>
    </div>
  );
}
