import { mkdir, open, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LoadedContent } from "../src/build/load-content";
import { canonicalMediaDestination, isPathWithin, isRelativeMediaSource } from "../src/build/media-paths";

export interface CopyMediaOptions {
  approvedSourceRoots: string[];
}

interface MediaCopy {
  source: string;
  destination: string;
  relativeDestination: string;
}

export async function copyMedia(
  loaded: LoadedContent,
  outputDir: string,
  options: CopyMediaOptions
): Promise<string[]> {
  const approvedRoots = await Promise.all(options.approvedSourceRoots.map((root) => realpath(root)));
  const destinations = new Set<string>();
  const copies: MediaCopy[] = [];

  for (const entity of loaded.entities) {
    const sourceFile = loaded.filesById.get(entity.id)?.[0];
    for (const media of entity.media ?? []) {
      if (!sourceFile) throw new Error(`Cannot locate source file for media on entity ${entity.id}.`);
      if (!isRelativeMediaSource(media.sourcePath)) {
        throw new Error(`Media sourcePath must be local and relative: ${media.sourcePath}`);
      }
      const relativeDestination = canonicalMediaDestination(media.src);
      const collisionKey = relativeDestination.toLowerCase();
      if (destinations.has(collisionKey)) throw new Error(`Media destination collision: ${relativeDestination}`);
      destinations.add(collisionKey);
      const source = await realpath(path.resolve(path.dirname(sourceFile), media.sourcePath));
      if (!approvedRoots.some((root) => isPathWithin(root, source))) {
        throw new Error(`Media source resolves outside approved roots: ${media.sourcePath}`);
      }
      const destination = path.resolve(outputDir, ...relativeDestination.split("/"));
      if (!isPathWithin(path.resolve(outputDir), destination)) {
        throw new Error(`Media publish path escapes the output directory: ${media.src}`);
      }
      copies.push({ source, destination, relativeDestination });
    }
  }

  for (const copy of copies) {
    const handle = await open(copy.source, "r");
    try {
      const bytes = await handle.readFile();
      await mkdir(path.dirname(copy.destination), { recursive: true });
      await writeFile(copy.destination, bytes);
    } finally {
      await handle.close();
    }
  }

  return copies.map(({ relativeDestination }) => relativeDestination);
}
