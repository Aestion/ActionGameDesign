import { useEffect, useMemo, useReducer } from "react";
import type { KnowledgeDataset } from "../model";
import { atlasReducer, createInitialState, nodeHash, nodeIdFromHash } from "./app-state";
import {
  AtlasHeader,
  AtlasNavigation,
  AtlasWorkspace,
  EmptyDetail,
  NodeDetail
} from "./components";
import { GRAPH_ROOT_ID, GraphExplorer } from "./GraphExplorer";
import { MobileTree } from "./MobileTree";

export interface AppProps {
  dataset: KnowledgeDataset;
}

export function App({ dataset }: AppProps) {
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
  const highlightedIds = useMemo(() => {
    const query = state.query.trim().toLocaleLowerCase();
    if (!query) return [];
    return dataset.searchRecords.filter((record) =>
      `${record.title} ${record.text} ${record.tokens.join(" ")}`.toLocaleLowerCase().includes(query)
    ).map(({ id }) => id);
  }, [dataset.searchRecords, state.query]);

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

  return (
    <div className="atlas-shell">
      <AtlasHeader
        dataset={dataset}
        query={state.query}
        onQueryChange={(query) => dispatch({ type: "set-query", query })}
      />
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
        ) : <AtlasWorkspace dataset={dataset} selectedId={selectedId} view={state.view} onSelect={selectEntity} />}
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
