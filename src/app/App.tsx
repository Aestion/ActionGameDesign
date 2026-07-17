import { useEffect, useMemo, useReducer } from "react";
import type { KnowledgeDataset } from "../model";
import { atlasReducer, createInitialState, nodeHash, nodeIdFromHash } from "./app-state";
import {
  AtlasHeader,
  AtlasNavigation,
  AtlasWorkspace,
  EmptyDetail,
  getDomainEntities,
  NodeDetail
} from "./components";

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
  const fallbackId = getDomainEntities(dataset)[0]?.id ?? dataset.entities[0]?.id ?? "";
  const selectedId = entityIds.has(state.selectedId) ? state.selectedId : fallbackId;
  const selected = dataset.entities.find(({ id }) => id === selectedId);

  useEffect(() => {
    const onHashChange = () => {
      const id = nodeIdFromHash(window.location.hash);
      if (entityIds.has(id)) dispatch({ type: "hydrate-hash", id });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [entityIds]);

  const selectEntity = (id: string) => {
    if (!entityIds.has(id)) return;
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
        <AtlasWorkspace
          dataset={dataset}
          selectedId={selectedId}
          view={state.view}
          onSelect={selectEntity}
        />
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
