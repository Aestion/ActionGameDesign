export type AtlasView = "graph" | "matrix" | "cases" | "conflicts" | "sources" | "reader";
const atlasViews = new Set<AtlasView>(["graph", "matrix", "cases", "conflicts", "sources", "reader"]);

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
}

export type AtlasAction =
  | { type: "select-node"; id: string }
  | { type: "hydrate-hash"; id: string; view?: AtlasView }
  | { type: "set-view"; view: AtlasView }
  | { type: "set-query"; query: string }
  | { type: "set-filters"; filters: Partial<AtlasFilters> }
  | { type: "clear-filters" };

const emptyFilters = (): AtlasFilters => ({
  domains: [],
  games: [],
  conflictTypes: [],
  reviewStatuses: []
});

function hashParams(hash: string): URLSearchParams {
  return new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
}

export function nodeIdFromHash(hash: string): string {
  return hashParams(hash).get("node")?.trim() ?? "";
}

export function viewFromHash(hash: string): AtlasView {
  const view = hashParams(hash).get("view");
  return view && atlasViews.has(view as AtlasView) ? view as AtlasView : "graph";
}

export function nodeHash(id: string, view: AtlasView = "graph"): string {
  if (!id) return "";
  const params = new URLSearchParams({ node: id });
  if (view !== "graph") params.set("view", view);
  return "#" + params.toString();
}

export function createInitialState(hash = ""): AtlasState {
  return {
    selectedId: nodeIdFromHash(hash),
    view: viewFromHash(hash),
    query: "",
    filters: emptyFilters()
  };
}

export function atlasReducer(state: AtlasState, action: AtlasAction): AtlasState {
  switch (action.type) {
    case "select-node":
      return { ...state, selectedId: action.id };
    case "hydrate-hash":
      if (!action.id) return state;
      return action.id !== state.selectedId || (action.view && action.view !== state.view)
        ? { ...state, selectedId: action.id, view: action.view ?? state.view }
        : state;
    case "set-view":
      return { ...state, view: action.view };
    case "set-query":
      return { ...state, query: action.query };
    case "set-filters":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case "clear-filters":
      return { ...state, filters: emptyFilters() };
  }
}
