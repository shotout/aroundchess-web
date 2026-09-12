/**
 * Builds the service worker's precache list.
 *
 * Run from `prebuild`, so the list is regenerated on every deploy and cannot
 * drift from the code the way a hand-written one would.
 *
 * Only assets the source actually references are included, and only small
 * ones. /public is around 800MB — a single 36MB about-us header among it — so
 * precaching it wholesale is not an option. Referenced-and-small comes to a
 * few megabytes and covers what the offline complaint was really about: the
 * icons, glyphs and piece sprites the UI reaches for at the moment something
 * happens. Anything bigger is decorative, and the service worker still caches
 * it on demand once it has been seen.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUTPUT = path.join(PUBLIC_DIR, "sw-manifest.json");

/** Directories under /public whose contents the UI renders. */
const ASSET_DIRS = [
  "images",
  "icons",
  "avatars",
  "fonts",
  "pieces",
  "classic",
  "default",
  "crownforge",
  "boards",
  "3d-pieces",
  "3d-wood-pieces",
  "play-vs-ai",
  "tutorial",
  "onboarding",
  "my-game-history",
  "training-plan",
  "puzzle",
  "board-vision",
  "endgame-training",
  "offers",
  "special-offer",
  "auth",
  "handbooks",
  "audio",
];

/** Anything larger is left to on-demand caching. */
const MAX_ASSET_BYTES = 200 * 1024;
/** A ceiling on the whole precache, so one careless commit cannot turn the
 *  first visit into a multi-megabyte download without anyone noticing. */
const MAX_TOTAL_BYTES = 12 * 1024 * 1024;

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public", ".vercel"]);

const ASSET_REFERENCE = new RegExp(
  `["'\`](/(?:${ASSET_DIRS.map((d) => d.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|")})/[^"'\`\\s]+?` +
    `\\.(?:png|jpe?g|svg|webp|gif|avif|mp3|wav|woff2?|ttf|otf|json))["'\`]`,
  "g"
);

/**
 * Does this path exist with exactly this capitalisation?
 *
 * stat() is not enough. macOS and Windows filesystems are case-insensitive,
 * so `/default/black/P.png` stats happily on a dev machine while the real file
 * is `p.png` — and then 404s on a case-sensitive deploy. Precaching a path
 * that only resolves locally would ship a hole in the cache that no one could
 * reproduce, so each segment is checked against the directory's real entries.
 */
async function existsCaseExact(assetPath) {
  const segments = assetPath.replace(/^\//, "").split("/");
  let dir = PUBLIC_DIR;
  for (let i = 0; i < segments.length; i += 1) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return false;
    }
    const match = entries.find((entry) => entry.name === segments[i]);
    if (!match) return false;
    const last = i === segments.length - 1;
    if (last) return match.isFile();
    if (!match.isDirectory()) return false;
    dir = path.join(dir, match.name);
  }
  return false;
}

async function collectSourceFiles(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
      await collectSourceFiles(path.join(dir, entry.name), out);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

async function main() {
  if (!existsSync(PUBLIC_DIR)) {
    console.warn("[sw-manifest] no public/ directory; nothing to do");
    return;
  }

  const sources = await collectSourceFiles(ROOT);
  const referenced = new Set();

  for (const file of sources) {
    const text = await readFile(file, "utf8").catch(() => "");
    for (const match of text.matchAll(ASSET_REFERENCE)) {
      referenced.add(match[1]);
    }
  }

  // Sorted so the version hash depends on the content, not on the order the
  // filesystem happened to hand back.
  const candidates = [...referenced].sort();
  const assets = [];
  const hash = createHash("sha256");
  let total = 0;
  let skippedMissing = 0;
  let skippedLarge = 0;

  for (const assetPath of candidates) {
    const filePath = path.join(PUBLIC_DIR, assetPath.replace(/^\//, ""));
    if (!(await existsCaseExact(assetPath))) {
      skippedMissing += 1;
      continue;
    }
    let info;
    try {
      info = await stat(filePath);
    } catch {
      // Referenced but not shipped: a stale path, or built at runtime. Not an
      // error here — the app already copes, and precaching a 404 would make
      // the whole install fail.
      skippedMissing += 1;
      continue;
    }
    if (!info.isFile()) continue;
    if (info.size > MAX_ASSET_BYTES) {
      skippedLarge += 1;
      continue;
    }
    if (total + info.size > MAX_TOTAL_BYTES) {
      skippedLarge += 1;
      continue;
    }

    assets.push(assetPath);
    total += info.size;
    // Content, not mtime: a CI checkout rewrites mtimes, and a version that
    // changed on every deploy would re-download the whole precache each time.
    hash.update(assetPath);
    hash.update(await readFile(filePath));
  }

  const manifest = {
    version: hash.digest("hex").slice(0, 16),
    generatedAt: new Date().toISOString(),
    totalBytes: total,
    assets,
  };

  await writeFile(OUTPUT, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(
    `[sw-manifest] ${assets.length} assets, ${(total / 1024 / 1024).toFixed(2)} MB ` +
      `(skipped ${skippedLarge} large, ${skippedMissing} missing) → version ${manifest.version}`
  );
}

main().catch((error) => {
  // A missing precache list degrades the app to "no offline assets", which is
  // where it was before. Failing the build over it would be worse.
  console.error("[sw-manifest] generation failed:", error);
});
