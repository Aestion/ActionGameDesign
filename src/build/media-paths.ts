import path from "node:path";

export function canonicalMediaDestination(src: string): string {
  if (!src || src.includes("\\") || src.includes("\0") || path.posix.isAbsolute(src) || /^[a-z][a-z0-9+.-]*:/iu.test(src)) {
    throw new Error(`Invalid media publish path: ${src}`);
  }
  const normalized = path.posix.normalize(src);
  if (normalized !== src || normalized === "." || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new Error(`Media publish path escapes the output directory: ${src}`);
  }
  return normalized;
}

export function isRelativeMediaSource(sourcePath: string): boolean {
  return Boolean(sourcePath)
    && !sourcePath.includes("\0")
    && !path.isAbsolute(sourcePath)
    && !/^[a-z][a-z0-9+.-]*:/iu.test(sourcePath);
}

export function isPathWithin(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
