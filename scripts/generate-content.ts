import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { KnowledgeDataset, ValidationIssue } from "../src/model";
import { compileContent } from "../src/build/compile-content";
import { loadContent, type LoadedContent } from "../src/build/load-content";
import { validateContent } from "../src/build/validate-content";

export interface GenerateContentOptions {
  root: string;
  contentRoot: string;
  generatedAt: string;
  approvedMediaRoots?: string[];
}

export interface GenerateContentResult {
  loaded: LoadedContent;
  dataset: KnowledgeDataset;
  issues: ValidationIssue[];
  outputFile?: string;
}

export async function writeGeneratedContent(root: string, dataset: KnowledgeDataset): Promise<string> {
  const outputFile = path.join(root, "src", "generated", "knowledge.ts");
  const source = `import type { KnowledgeDataset } from "../model";\n\n`
    + `export const knowledgeDataset = ${JSON.stringify(dataset, null, 2)} satisfies KnowledgeDataset;\n\n`
    + `export default knowledgeDataset;\n`;
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, source, "utf8");
  return outputFile;
}

export async function generateContent(options: GenerateContentOptions): Promise<GenerateContentResult> {
  const contentRoot = path.isAbsolute(options.contentRoot)
    ? options.contentRoot
    : path.resolve(options.root, options.contentRoot);
  const loaded = await loadContent(contentRoot);
  const issues = validateContent(loaded, { approvedMediaRoots: options.approvedMediaRoots });
  const dataset = compileContent(loaded, options.generatedAt);

  if (issues.some(({ severity }) => severity === "error")) {
    return { loaded, dataset, issues };
  }

  const outputFile = await writeGeneratedContent(options.root, dataset);
  return { loaded, dataset, issues, outputFile };
}

async function runCli(): Promise<void> {
  const root = process.cwd();
  const result = await generateContent({
    root,
    contentRoot: process.argv[2] ?? "content",
    generatedAt: new Date().toISOString()
  });
  for (const item of result.issues) {
    console[item.severity === "error" ? "error" : "warn"](`${item.severity}: ${item.file}: ${item.message}`);
  }
  if (!result.outputFile) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runCli().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
