import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import type { Element, Root, RootContent } from "hast";

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

export interface RenderedMarkdown {
  html: string;
  headings: ArticleHeading[];
  readingMinutes: number;
}

function textContent(node: RootContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map((child) => textContent(child)).join("");
  return "";
}

function slugBase(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("und")
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function createHeadingStructure(headings: ArticleHeading[]) {
  return () => (tree: Root) => {
    const seen = new Map<string, number>();

    const visit = (node: Root | RootContent) => {
      if (node.type === "element") {
        const match = /^h([2-4])$/.exec(node.tagName);
        if (match) {
          const text = textContent(node).trim();
          const base = slugBase(text) || "section";
          const count = (seen.get(base) ?? 0) + 1;
          seen.set(base, count);
          const id = count === 1 ? base : `${base}-${count}`;
          node.properties = { ...node.properties, id };
          headings.push({ id, text, level: Number(match[1]) as 2 | 3 | 4 });
        }
      }

      if ("children" in node) node.children.forEach((child) => visit(child));
    };

    visit(tree);
  };
}

function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/gu, " ").trim();
  const cjk = (text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu) ?? []).length;
  const latinWords = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(cjk / 420 + latinWords / 220));
}

export async function renderMarkdown(source: string): Promise<RenderedMarkdown> {
  const headings: ArticleHeading[] = [];
  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(createHeadingStructure(headings))
      .use(rehypeStringify)
      .process(source)
  );

  return { html, headings, readingMinutes: estimateReadingMinutes(html) };
}
