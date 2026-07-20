import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchPanel } from "../src/app/SearchPanel";
import type { KnowledgeDataset, KnowledgeEntity } from "../src/model";

afterEach(cleanup);

function entity(id: string, title: string): KnowledgeEntity {
  return {
    id, kind: "concept", title, aliases: [], summary: `${title}摘要`, bodyHtml: "",
    domainIds: [], depth: 2, tags: [], reviewStatus: "reviewed", updated: "2026-07-17",
    citations: [], media: [], examples: []
  };
}

const entities = Array.from({ length: 15 }, (_, index) =>
  entity(`node-${index}`, `命中节点 ${String(index + 1).padStart(2, "0")}`));

const dataset: KnowledgeDataset = {
  version: 1, generatedAt: "2026-07-17T00:00:00.000Z",
  entities,
  edges: [],
  searchRecords: [],
  stats: { concepts: 15, cases: 0, conflicts: 0, sources: 0, games: 0, media: 0 }
};

const resultIds = entities.map(({ id }) => id);

function renderPanel(overrides: Partial<React.ComponentProps<typeof SearchPanel>> = {}) {
  return render(
    <SearchPanel
      dataset={dataset}
      query="命中"
      filters={{ domains: [], games: [], conflictTypes: [], reviewStatuses: [] }}
      resultIds={resultIds}
      onQueryChange={vi.fn()}
      onFiltersChange={vi.fn()}
      onClear={vi.fn()}
      onSelect={vi.fn()}
      {...overrides}
    />
  );
}

describe("SearchPanel result pagination", () => {
  it("reveals more results beyond the initial cap via a show-more control", async () => {
    const user = userEvent.setup();
    renderPanel();

    // 初始只显示前 12 条，第 13 条不可达
    expect(screen.getByText("15 项结果")).toBeTruthy();
    expect(screen.getByText("命中节点 12")).toBeTruthy();
    expect(screen.queryByText("命中节点 13")).toBeNull();
    expect(screen.getByRole("button", { name: /显示更多/ })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /显示更多/ }));

    expect(screen.getByText("命中节点 13")).toBeTruthy();
    expect(screen.getByText("命中节点 15")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /显示更多/ })).toBeNull();
  });

  it("resets the visible cap when the query changes", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const { rerender } = renderPanel({ onQueryChange });

    await user.click(screen.getByRole("button", { name: /显示更多/ }));
    expect(screen.getByText("命中节点 15")).toBeTruthy();

    // 模拟查询变更后结果集缩小到 5 条，不应残留展开态
    rerender(
      <SearchPanel
        dataset={dataset}
        query="命中节点"
        filters={{ domains: [], games: [], conflictTypes: [], reviewStatuses: [] }}
        resultIds={resultIds.slice(0, 5)}
        onQueryChange={onQueryChange}
        onFiltersChange={vi.fn()}
        onClear={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("5 项结果")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /显示更多/ })).toBeNull();
  });
});
