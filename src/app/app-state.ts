export type AtlasView = "graph" | "matrix" | "cases" | "conflicts" | "sources";

export interface AtlasFilters {
  domains: string[];
  games: string[];
  conflictTypes: string[];
  reviewStatuses: string[];
}

export interface AtlasState {
  selectedId: string;
  view: AtlasView;
  query: string;
  filters: AtlasFilters;
  detailDepth: 1 | 2 | 3;
}

export type AtlasAction =
  | { type: "select-node"; id: string }
  | { type: "hydrate-hash"; id: string }
  | { type: "set-view"; view: AtlasView }
  | { type: "set-query"; query: string }
  | { type: "set-detail-depth"; depth: 1 | 2 | 3 }
  | { type: "set-filters"; filters: Partial<AtlasFilters> }
  | { type: "clear-filters" };

const emptyFilters = (): AtlasFilters => ({
  domains: [],
  games: [],
  conflictTypes: [],
  reviewStatuses: []
});

export function nodeIdFromHash(hash: string): string {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(value).get("node")?.trim() ?? "";
}

export function nodeHash(id: string): string {
  return id ? `#${new URLSearchParams({ node: id }).toString()}` : "";
}

export function createInitialState(hash = ""): AtlasState {
  return {
    selectedId: nodeIdFromHash(hash),
    view: "graph",
    query: "",
    filters: emptyFilters(),
    detailDepth: 1
  };
}

export function atlasReducer(state: AtlasState, action: AtlasAction): AtlasState {
  switch (action.type) {
    case "select-node":
      return { ...state, selectedId: action.id, detailDepth: 1 };
    case "hydrate-hash":
      return action.id && action.id !== state.selectedId
        ? { ...state, selectedId: action.id, detailDepth: 1 }
        : state;
    case "set-view":
      return { ...state, view: action.view };
    case "set-query":
      return { ...state, query: action.query };
    case "set-detail-depth":
      return { ...state, detailDepth: action.depth };
    case "set-filters":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case "clear-filters":
      return { ...state, filters: emptyFilters() };
  }
}
