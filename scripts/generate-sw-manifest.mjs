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

/** Anything larger is left to on-demand caching. Raised from 200KB because
 *  several of the files that showed as broken squares offline are icons in
 *  name only — /endgame-training/move-icon.png is half a megabyte — and the
 *  old cap excluded exactly the ones people noticed. */
const MAX_ASSET_BYTES = 600 * 1024;
/** A ceiling on the whole precache, so one careless commit cannot turn the
 *  first visit into a multi-megabyte download without anyone noticing.
 *  Selection runs smallest-first, so what this trims is always the largest
 *  decoration, never an icon. */
const MAX_TOTAL_BYTES = 18 * 1024 * 1024;

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public", ".vercel"]);

/**
 * Spaces are allowed inside the path on purpose.
 *
 * This used to stop at `\s`, and a good part of /public is named the way it
 * came out of the design tool — `/images/v2/AI avatar/Beginner/Thomas.png`,
 * `/images/v2/profile/icon-_Board Vision 1.png`. Those 95 files were never in
 * the precache at all, which is why every AI opponent's face was a broken
 * square offline while the files right beside them were fine.
 *
 * A newline still ends a match, so a stray quote cannot run away with the rest
 * of the file, and anything this over-matches is dropped by the existence
 * check below rather than shipped as a hole in the cache.
 */
const ASSET_REFERENCE = new RegExp(
  `["'\`](/(?:${ASSET_DIRS.map((d) => d.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|")})/[^"'\`\\n]+?` +
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
      // A template literal's path is not known until it runs — `/pieces/
      // ${colour}/${piece}.png` is a pattern, not a file — so it is left to
      // on-demand caching rather than precached as a 404.
      if (match[1].includes("${")) continue;
      referenced.add(match[1]);
    }
  }

  // Sorted so what follows depends on the content, not on the order the
  // filesystem happened to hand back.
  const candidates = [...referenced].sort();
  const found = [];
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
    found.push({ assetPath, filePath, size: info.size });
  }

  /**
   * Smallest first, and that order is shipped as well as used here.
   *
   * It decides two things. The budget below now trims the heaviest
   * decorations instead of whatever happened to sort last — `/images/...`
   * alphabetically, which is where nearly every icon lives. And the worker
   * warms the cache in this order, so a warm that is cut short (the tab
   * closed, the connection dropped) has already covered the small files the
   * UI is built out of, rather than having spent the whole time on three
   * background images.
   */
  found.sort((a, b) =>
    a.size - b.size || a.assetPath.localeCompare(b.assetPath)
  );

  const selected = [];
  let total = 0;
  for (const entry of found) {
    if (total + entry.size > MAX_TOTAL_BYTES) {
      skippedLarge += 1;
      continue;
    }
    selected.push(entry);
    total += entry.size;
  }

  const hash = createHash("sha256");
  // Hashed in path order, so the version tracks the content and not the size
  // ordering — a file that grows must not invalidate the whole cache.
  for (const entry of [...selected].sort((a, b) =>
    a.assetPath.localeCompare(b.assetPath)
  )) {
    // Content, not mtime: a CI checkout rewrites mtimes, and a version that
    // changed on every deploy would re-download the whole precache each time.
    hash.update(entry.assetPath);
    hash.update(await readFile(entry.filePath));
  }

  const assets = selected.map((entry) => entry.assetPath);

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
