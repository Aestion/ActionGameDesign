import { access, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build as viteBuild } from "vite";
import { createEmptyDataset, type BuildReport, type ValidationIssue } from "../src/model";
import { isPathWithin } from "../src/build/media-paths";
import { copyMedia } from "./copy-media";
import { generateContent } from "./generate-content";

export interface BuildAtlasOptions {
  root: string;
  contentRoot: string;
  now?: () => Date;
  renamePath?: (oldPath: string, newPath: string) => Promise<void>;
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
  const pathOnly = reference.split(/[?#]/u, 1)[0];
  const resolved = path.resolve(outputDir, pathOnly);
  if (!isPathWithin(outputDir, resolved)) {
    throw new Error(`Build asset escapes the output directory: ${reference}`);
  }
  return resolved;
}

async function replaceAsync(
  input: string,
  pattern: RegExp,
  replacer: (match: RegExpMatchArray) => Promise<string>
): Promise<string> {
  let output = "";
  let cursor = 0;
  for (const match of input.matchAll(pattern)) {
    const index = match.index ?? 0;
    output += input.slice(cursor, index) + await replacer(match);
    cursor = index + match[0].length;
  }
  return output + input.slice(cursor);
}

function rewriteCssUrls(css: string, cssFile: string, outputDir: string): string {
  return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/giu, (whole, quote: string, reference: string) => {
    if (/^(?:data:|#)/iu.test(reference)) return whole;
    if (/^[a-z][a-z0-9+.-]*:/iu.test(reference) || reference.startsWith("/")) {
      throw new Error(`Offline CSS contains a non-local URL: ${reference}`);
    }
    const sourceAsset = path.resolve(path.dirname(cssFile), reference.split(/[?#]/u, 1)[0]);
    if (!isPathWithin(outputDir, sourceAsset)) throw new Error(`Offline CSS URL escapes the output: ${reference}`);
    const relative = path.relative(outputDir, sourceAsset).split(path.sep).join("/");
    return `url(${quote}./${relative}${quote})`;
  });
}

function rebaseJavaScriptAsset(reference: string, scriptFile: string, outputDir: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/iu.test(reference)) return reference;
  const suffixIndex = reference.search(/[?#]/u);
  const pathPart = suffixIndex === -1 ? reference : reference.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : reference.slice(suffixIndex);
  const assetFile = path.resolve(path.dirname(scriptFile), pathPart);
  if (!isPathWithin(outputDir, assetFile)) {
    throw new Error(`JavaScript asset URL escapes the output: ${reference}`);
  }
  const relative = path.relative(outputDir, assetFile).split(path.sep).join("/");
  return `./${relative}${suffix}`;
}

function rewriteJavaScriptAssetUrls(code: string, scriptFile: string, outputDir: string): string {
  return code.replace(
    /new URL\(\s*(["'`])([^"'`]+)\1\s*,\s*import\.meta\.url\s*\)/gu,
    (_whole, quote: string, reference: string) =>
      `new URL(${quote}${rebaseJavaScriptAsset(reference, scriptFile, outputDir)}${quote}, import.meta.url)`
  );
}

export async function inlineApplicationAssets(outputDir: string): Promise<void> {
  const indexFile = path.join(outputDir, "index.html");
  const inlinedFiles = new Set<string>();
  let html = await readFile(indexFile, "utf8");
  html = await replaceAsync(
    html,
    /<script\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*><\/script>/giu,
    async (match) => {
      const scriptFile = resolveOutputAsset(outputDir, match[2]);
      const applicationCode = rewriteJavaScriptAssetUrls(await readFile(scriptFile, "utf8"), scriptFile, outputDir);
      inlinedFiles.add(scriptFile);
      return `<script type="module">${applicationCode.replace(/<\/script/giu, "<\\/script")}</script>`;
    }
  );
  html = await replaceAsync(html, /<link\b[^>]*>/giu, async (match) => {
    const tag = match[0];
    const rel = tag.match(/\brel=(["'])([^"']+)\1/iu)?.[2] ?? "";
    if (!rel.split(/\s+/u).includes("stylesheet")) return tag;
    const reference = tag.match(/\bhref=(["'])([^"']+)\1/iu)?.[2];
    if (!reference) throw new Error("Stylesheet link has no href.");
    const cssFile = resolveOutputAsset(outputDir, reference);
    const css = rewriteCssUrls(await readFile(cssFile, "utf8"), cssFile, outputDir);
    inlinedFiles.add(cssFile);
    return `<style>${css.replace(/<\/style/giu, "<\\/style")}</style>`;
  });
  await writeFile(indexFile, html, "utf8");
  await Promise.all([...inlinedFiles].map((file) => rm(file, { force: true })));
}

async function verifyLocalReference(outputDir: string, reference: string): Promise<void> {
  if (/^(?:data:|#)/iu.test(reference)) return;
  if (/^[a-z][a-z0-9+.-]*:/iu.test(reference) || !reference.startsWith("./")) {
    throw new Error(`Offline package contains a non-file-compatible reference: ${reference}`);
  }
  await access(resolveOutputAsset(outputDir, reference));
}

function parseTagAttributes(tagSource: string): Map<string, string> {
  const attributes = new Map<string, string>();
  for (const match of tagSource.matchAll(/\s([a-z_:][a-z0-9_.:-]*)\s*=\s*(?:(["'])(.*?)\2|([^\s"'=<>`]+))/giu)) {
    attributes.set(match[1].toLowerCase(), match[3] ?? match[4]);
  }
  return attributes;
}

export async function verifyOfflinePackage(outputDir: string, mediaPaths: string[]): Promise<void> {
  const indexFile = path.join(outputDir, "index.html");
  const html = await readFile(indexFile, "utf8");
  if (/<script\b[^>]*\bsrc=/iu.test(html)) throw new Error("Offline package contains an external script entry.");
  for (const link of html.matchAll(/<link\b[^>]*>/giu)) {
    const attributes = parseTagAttributes(link[0]);
    const rel = attributes.get("rel")?.toLowerCase() ?? "";
    if (rel.split(/\s+/u).includes("stylesheet") && attributes.has("href")) {
      throw new Error("Offline package contains an external stylesheet entry.");
    }
  }
  if (!/<script\b[^>]*>[\s\S]*\S[\s\S]*<\/script>/iu.test(html)) {
    throw new Error("Offline package has no inline application code.");
  }
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/giu)].map((match) => match[1]);
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/giu)].map((match) => match[1]);
  const markup = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "");
  const executable = scripts.join("\n");
  const forbidden: Array<[RegExp, string]> = [
    [/\bfetch\s*\(/iu, "fetch"],
    [/\bXMLHttpRequest\b/u, "XMLHttpRequest"],
    [/\bWebSocket\b/u, "WebSocket"],
    [/\bEventSource\b/u, "EventSource"],
    [/\bsendBeacon\b/u, "sendBeacon"],
    [/\bimport\s*\(/u, "dynamic import"]
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(executable)) throw new Error(`Offline package contains network-capable ${label}.`);
  }
  const markupReferences: Array<{ tag: string; attribute: string; reference: string }> = [];
  const inlineStyles: string[] = [];
  for (const tagMatch of markup.matchAll(/<([a-z][a-z0-9:-]*)\b[^>]*>/giu)) {
    const tag = tagMatch[1].toLowerCase();
    const attributes = parseTagAttributes(tagMatch[0]);
    for (const attribute of ["src", "href", "action", "poster"]) {
      const reference = attributes.get(attribute);
      if (reference) markupReferences.push({ tag, attribute, reference });
    }
    const style = attributes.get("style");
    if (style) inlineStyles.push(style);
  }
  for (const { tag, attribute, reference } of markupReferences) {
    if (tag === "a" && attribute === "href" && /^https?:\/\//iu.test(reference)) continue;
    await verifyLocalReference(outputDir, reference);
  }
  const cssSources = [...styles, ...inlineStyles];
  const cssReferences = cssSources.flatMap((css) => [
    ...[...css.matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/giu)].map((match) => match[2]),
    ...[...css.matchAll(/@import\s+(["'])([^"']+)\1/giu)].map((match) => match[2])
  ]);
  await Promise.all(cssReferences.map((reference) => verifyLocalReference(outputDir, reference)));
  const javaScriptAssets = scripts.flatMap((script) =>
    [...script.matchAll(/new URL\(\s*(["'`])(\.\.?\/[^"'`]+)\1\s*,\s*import\.meta\.url\s*\)/gu)]
      .map((match) => match[2])
  );
  await Promise.all(javaScriptAssets.map((reference) => verifyLocalReference(outputDir, reference)));
  await Promise.all(mediaPaths.map((mediaPath) => verifyLocalReference(outputDir, `./${mediaPath}`)));
}

function buildIssue(root: string, error: unknown): ValidationIssue {
  return {
    severity: "error",
    code: "build-failed",
    file: root,
    message: error instanceof Error ? error.message : String(error)
  };
}

async function publish(
  tempDir: string,
  distDir: string,
  backupDir: string,
  renamePath: (oldPath: string, newPath: string) => Promise<void>
): Promise<void> {
  let movedPreviousBuild = false;

  try {
    if (await exists(distDir)) {
      await rm(backupDir, { recursive: true, force: true });
      await renamePath(distDir, backupDir);
      movedPreviousBuild = true;
    }
    await renamePath(tempDir, distDir);
  } catch (error) {
    if (movedPreviousBuild) {
      await rm(distDir, { recursive: true, force: true });
      await renamePath(backupDir, distDir);
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
  const contentRoot = path.isAbsolute(options.contentRoot) ? options.contentRoot : path.resolve(root, options.contentRoot);
  let issues: ValidationIssue[] = [];
  let stats = createEmptyDataset(generatedAt).stats;

  try {
    await rm(tempDir, { recursive: true, force: true });
    const generated = await generateContent({
      root,
      contentRoot: options.contentRoot,
      generatedAt,
      approvedMediaRoots: [root, contentRoot]
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
        emptyOutDir: false,
        modulePreload: false,
        cssCodeSplit: false,
        rollupOptions: { output: { codeSplitting: false } }
      }
    });
    const mediaPaths = await copyMedia(generated.loaded, tempDir, { approvedSourceRoots: [root, contentRoot] });
    await inlineApplicationAssets(tempDir);
    await verifyOfflinePackage(tempDir, mediaPaths);
    await publish(tempDir, outputDir, backupDir, options.renamePath ?? rename);
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
