import { mkdir, open, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LoadedContent } from "../src/build/load-content";

function outputPathFor(outputDir: string, source: string): { absolute: string; relative: string } {
  const relative = path.normalize(source.replace(/^\.([/\\])/, ""));
  const absolute = path.resolve(outputDir, relative);
  const relativeToOutput = path.relative(outputDir, absolute);
  if (path.isAbsolute(source) || relativeToOutput.startsWith("..") || path.isAbsolute(relativeToOutput)) {
    throw new Error(`Media output path escapes the build directory: ${source}`);
  }
  return { absolute, relative: relativeToOutput.split(path.sep).join("/") };
}

export async function copyMedia(loaded: LoadedContent, outputDir: string): Promise<string[]> {
  const copiedPaths: string[] = [];

  for (const entity of loaded.entities) {
    const sourceFile = loaded.filesById.get(entity.id)?.[0];
    for (const media of entity.media ?? []) {
      if (!sourceFile) throw new Error(`Cannot locate source file for media on entity ${entity.id}.`);
      const sourcePath = path.resolve(path.dirname(sourceFile), media.src);
      const destination = outputPathFor(outputDir, media.src);
      const handle = await open(sourcePath, "r");
      try {
        const bytes = await handle.readFile();
        await mkdir(path.dirname(destination.absolute), { recursive: true });
        await writeFile(destination.absolute, bytes);
      } finally {
        await handle.close();
      }
      copiedPaths.push(destination.relative);
    }
  }

  return copiedPaths;
}
