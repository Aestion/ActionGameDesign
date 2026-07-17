import { access, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build as viteBuild } from "vite";
import { createEmptyDataset, type BuildReport, type ValidationIssue } from "../src/model";
import { copyMedia } from "./copy-media";
import { generateContent } from "./generate-content";

export interface BuildAtlasOptions {
  root: string;
  contentRoot: string;
  now?: () => Date;
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function resolveOutputAsset(outputDir: string, reference: string): string {
  if (!reference.startsWith("./")) throw new Error(`Build asset is not relative: ${reference}`);
  const resolved = path.resolve(outputDir, reference);
  const relative = path.relative(outputDir, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Build asset escapes the output directory: ${reference}`);
  }
  return resolved;
}

async function verifyOutput(outputDir: string, mediaPaths: string[]): Promise<void> {
  const indexFile = path.join(outputDir, "index.html");
  const html = await readFile(indexFile, "utf8");
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/giu)].map((match) => match[1]);
  if (scripts.length === 0) throw new Error("Built index.html does not reference an application bundle.");
  await Promise.all(scripts.map((script) => access(resolveOutputAsset(outputDir, script))));
  await Promise.all(mediaPaths.map((mediaPath) => access(resolveOutputAsset(outputDir, `./${mediaPath}`))));
}

function buildIssue(root: string, error: unknown): ValidationIssue {
  return {
    severity: "error",
    code: "build-failed",
    file: root,
    message: error instanceof Error ? error.message : String(error)
  };
}

async function publish(tempDir: string, distDir: string, backupDir: string): Promise<void> {
  let movedPreviousBuild = false;

  try {
    if (await exists(distDir)) {
      await rm(backupDir, { recursive: true, force: true });
      await rename(distDir, backupDir);
      movedPreviousBuild = true;
    }
    await rename(tempDir, distDir);
  } catch (error) {
    if (movedPreviousBuild) {
      await rm(distDir, { recursive: true, force: true });
      await rename(backupDir, distDir);
    }
    throw error;
  }
}

export async function buildAtlas(options: BuildAtlasOptions): Promise<BuildReport> {
  const root = path.resolve(options.root);
  const generatedAt = (options.now ?? (() => new Date()))().toISOString();
  const outputDir = path.join(root, "dist");
  const backupDir = path.join(root, "dist-last-good");
  const tempDir = path.join(root, ".build-tmp", "current");
  let issues: ValidationIssue[] = [];
  let stats = createEmptyDataset(generatedAt).stats;

  try {
    await rm(tempDir, { recursive: true, force: true });
    const generated = await generateContent({
      root,
      contentRoot: options.contentRoot,
      generatedAt
    });
    issues = generated.issues;
    stats = generated.dataset.stats;
    if (issues.some(({ severity }) => severity === "error")) {
      return { success: false, generatedAt, outputDir, issues, stats };
    }

    const configFile = path.join(root, "vite.config.ts");
    await viteBuild({
      root,
      base: "./",
      configFile: await exists(configFile) ? configFile : false,
      logLevel: "silent",
      build: {
        outDir: tempDir,
        emptyOutDir: false
      }
    });
    const mediaPaths = await copyMedia(generated.loaded, tempDir);
    await verifyOutput(tempDir, mediaPaths);
    await publish(tempDir, outputDir, backupDir);
    return { success: true, generatedAt, outputDir, issues, stats };
  } catch (error) {
    return { success: false, generatedAt, outputDir, issues: [...issues, buildIssue(root, error)], stats };
  }
}

async function runCli(): Promise<void> {
  const report = await buildAtlas({ root: process.cwd(), contentRoot: process.argv[2] ?? "content" });
  for (const item of report.issues) {
    console[item.severity === "error" ? "error" : "warn"](`${item.severity}: ${item.file}: ${item.message}`);
  }
  if (!report.success) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runCli().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
