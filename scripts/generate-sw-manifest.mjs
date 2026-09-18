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
 *
 * The selected files are also packed into a handful of bundle chunks beside
 * the list, which is how the worker actually downloads them — see
 * writeBundle() at the bottom.
 */

import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUTPUT = path.join(PUBLIC_DIR, "sw-manifest.json");
const BUNDLE_DIR = path.join(PUBLIC_DIR, "sw-bundle");

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

/**
 * Directories taken whole, because their files are never named in the source.
 *
 * The board picks its sprites at runtime — `/pieces/${set}/${piece}.png`,
 * `/boards/${board}.png`, `/3d-pieces/${piece}.webp` — and a scanner looking
 * for string literals cannot see any of them. That is why a new game offline
 * came up with no pieces on it: not one of them was ever in the precache.
 * Fonts are the same story from the other direction, referenced by unquoted
 * `url()` in CSS, and the analysis icons are built from a classification name.
 *
 * Taking a directory whole is the only honest answer for these — the set that
 * will be needed is not knowable until a player picks a theme. They are
 * candidates like any other, so the size cap and the budget still apply, and
 * the smallest-first order means the sprites (a few KB each) are never the
 * ones trimmed.
 */
const DYNAMIC_ASSET_DIRS = [
  "pieces",
  "classic",
  "default",
  "crownforge",
  "boards",
  "3d-pieces",
  "3d-wood-pieces",
  "icons",
  "fonts",
];

/** The board's own sprites, which sit at the root rather than in a directory.
 *  Same list the worker's ROOT_ASSET pattern serves. */
const ROOT_ASSETS = [
  "/bB.png",
  "/bK.png",
  "/bN.png",
  "/bP.png",
  "/bQ.png",
  "/bR.png",
  "/wB.png",
  "/wK.png",
  "/wN.png",
  "/wP.png",
  "/wQ.png",
  "/wR.png",
  "/chess.png",
  "/chess-pattern.png",
  "/wood-pattern.png",
];

const ASSET_EXTENSIONS =
  /\.(?:png|jpe?g|svg|webp|gif|avif|mp3|wav|woff2?|ttf|otf)$/i;

/**
 * The board itself: its surfaces and its piece sprites.
 *
 * These are not decoration and they are not interchangeable with anything
 * else — without them a game in progress is a grid of nothing, which is what
 * "the board did not load offline" turned out to mean. `/boards/wood.png` is
 * 146KB and was precached; `/boards/wood-flipped.png` is 500KB and was not, so
 * the default theme rendered for White and broke for Black. Nothing about that
 * distinction was intentional: it fell out of the size cap and a budget that
 * was being spent on page banners before it reached the board.
 *
 * So they are taken first, and the per-file cap does not apply to them. Which
 * one a player needs is unknowable here — the theme is a stored preference and
 * can be changed offline, and each theme has a flipped variant for playing
 * Black — so the whole set has to be there.
 *
 * `/3d-pieces/chess.png` is deliberately not matched: despite the directory it
 * is a 2.2MB illustration on the analysis loading screen, not a sprite, and
 * the board never asks for it. It stays an ordinary candidate.
 */
const ESSENTIAL_PATTERNS = [
  /^\/boards\//,
  /^\/pieces\//,
  /^\/3d-pieces\/[^/]+\.webp$/i,
  /^\/3d-wood-pieces\//,
  /^\/classic\//,
  /^\/default\//,
  /^\/crownforge\//,
];

function isEssential(assetPath) {
  return (
    ESSENTIAL_PATTERNS.some((pattern) => pattern.test(assetPath)) ||
    ROOT_ASSETS.includes(assetPath)
  );
}

/** Anything larger is left to on-demand caching. Raised from 200KB because
 *  several of the files that showed as broken squares offline are icons in
 *  name only — /endgame-training/move-icon.png is half a megabyte — and the
 *  old cap excluded exactly the ones people noticed.
 *
 *  Does not apply to the essential set below, where a file being large is not
 *  a reason to do without it. */
const MAX_ASSET_BYTES = 600 * 1024;
/** A ceiling on the whole precache, so one careless commit cannot turn the
 *  first visit into a multi-megabyte download without anyone noticing.
 *  Selection runs smallest-first, so what this trims is always the largest
 *  decoration, never an icon.
 *
 *  Raised from 18MB to cover the board surfaces, which are ~9MB of the total
 *  on their own: 16 board images across four themes and two orientations, plus
 *  the sprite sets. Under the old ceiling they competed with the page art and
 *  lost. Everything that fitted before still fits. */
const MAX_TOTAL_BYTES = 28 * 1024 * 1024;

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

/**
 * Roughly how much goes into one bundle chunk.
 *
 * One file would be tidiest in the network panel and the worst thing to lose:
 * a warm interrupted at 26MB would have nothing to show for it, because a
 * chunk is only useful once it has arrived whole. A few megabytes each means a
 * dropped connection costs one chunk, and — since the packing follows the warm
 * order — whatever did arrive is the most important part of the list.
 */
const CHUNK_TARGET_BYTES = 4 * 1024 * 1024;

/** Cache Storage keeps whatever Content-Type it is handed, and the entries
 *  written out of a bundle are built here rather than fetched, so the type has
 *  to travel with them. Getting this wrong is a font that does not apply or an
 *  image the browser refuses to decode. */
const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".json": "application/json",
};

function contentTypeOf(assetPath) {
  return (
    CONTENT_TYPES[path.extname(assetPath).toLowerCase()] ??
    "application/octet-stream"
  );
}

/**
 * Pack the selected assets into a few binary chunks.
 *
 * The warm used to issue one request per file. That works, but 688 of them
 * bury everything else in the network panel for as long as it runs, and each
 * one carries a full set of request and response headers for a file that is
 * often smaller than they are. A chunk is one request for a few hundred files.
 *
 * Layout, which sw.js reads back:
 *
 *   "ACB1"                4 bytes, so a truncated or misrouted response (an
 *                         SPA fallback page, say) is rejected rather than
 *                         parsed into nonsense
 *   headerLength          uint32, little-endian
 *   header                JSON: [{ p: path, o: offset, l: length, t: type }]
 *   body                  the files, concatenated, offsets relative to here
 *
 * Chunk order follows `selected`, which is warm order — the board first, then
 * smallest-first — so an interrupted warm loses the least important chunks.
 *
 * Each chunk is named after its own contents rather than the manifest version.
 * A deploy bumps the version whenever any asset changes, and a version-named
 * chunk would then be a new URL with nothing to revalidate against — 27MB back
 * over the wire to pick up one redrawn icon. Named this way, the chunks that
 * did not change keep their URL and answer 304 out of the HTTP cache. Packing
 * still shifts when a file is added or resized, so this is an opportunity
 * rather than a guarantee; it costs nothing to take.
 */
async function writeBundle(selected) {
  // Wiped rather than merged: chunks are named after the manifest version, so
  // last build's would otherwise pile up in /public for every deploy.
  await rm(BUNDLE_DIR, { recursive: true, force: true });
  await mkdir(BUNDLE_DIR, { recursive: true });

  const chunks = [];
  let index = 0;

  while (index < selected.length) {
    const from = index;
    const entries = [];
    const bodies = [];
    let offset = 0;

    // `offset === 0` keeps a file larger than the target on its own rather
    // than looping forever trying to find room for it.
    while (
      index < selected.length &&
      (offset === 0 || offset + selected[index].size <= CHUNK_TARGET_BYTES)
    ) {
      const entry = selected[index];
      const data = await readFile(entry.filePath);
      entries.push({
        p: entry.assetPath,
        o: offset,
        l: data.length,
        t: contentTypeOf(entry.assetPath),
      });
      bodies.push(data);
      offset += data.length;
      index += 1;
    }

    const header = Buffer.from(JSON.stringify(entries), "utf8");
    const prefix = Buffer.alloc(8);
    prefix.write("ACB1", 0, "ascii");
    prefix.writeUInt32LE(header.length, 4);
    const file = Buffer.concat([prefix, header, ...bodies]);

    const name = `${createHash("sha256")
      .update(file)
      .digest("hex")
      .slice(0, 16)}.bin`;
    await writeFile(path.join(BUNDLE_DIR, name), file);
    chunks.push({
      url: `/sw-bundle/${name}`,
      bytes: file.length,
      // Into `manifest.assets`, which is this same list in this same order.
      // Two integers rather than repeating every path a second time.
      from,
      count: entries.length,
    });
  }

  return chunks;
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

/** Every asset file under one of the whole-directory entries above. */
async function collectDirectoryAssets(dirName, out = []) {
  const base = path.join(PUBLIC_DIR, dirName);
  if (!existsSync(base)) return out;

  const walk = async (dir, prefix) => {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const nested = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), nested);
      } else if (ASSET_EXTENSIONS.test(entry.name)) {
        out.push(nested);
      }
    }
  };

  await walk(base, `/${dirName}`);
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

  // The runtime-addressed sets, which no amount of reading the source finds.
  for (const dirName of DYNAMIC_ASSET_DIRS) {
    for (const assetPath of await collectDirectoryAssets(dirName)) {
      referenced.add(assetPath);
    }
  }
  for (const assetPath of ROOT_ASSETS) {
    referenced.add(assetPath);
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
    const essential = isEssential(assetPath);
    if (!essential && info.size > MAX_ASSET_BYTES) {
      skippedLarge += 1;
      continue;
    }
    found.push({ assetPath, filePath, size: info.size, essential });
  }

  /**
   * The board first, then everything else smallest first — and that order is
   * shipped as well as used here.
   *
   * It decides two things. The budget below trims the heaviest decorations
   * rather than whatever happened to sort last (`/images/...` alphabetically,
   * which is where nearly every icon lives), and it can no longer reach the
   * board at all. And the worker warms the cache in this order, so a warm that
   * is cut short — the tab closed, the connection dropped — has already
   * covered the board and then the small files the UI is built out of, rather
   * than having spent the whole time on three background images.
   *
   * Putting the board ahead of the icons does mean a couple of megabytes land
   * before them. That is the right way round: a missing icon is a gap in a
   * panel, a missing board is the game.
   */
  found.sort(
    (a, b) =>
      Number(b.essential) - Number(a.essential) ||
      a.size - b.size ||
      a.assetPath.localeCompare(b.assetPath)
  );

  const selected = [];
  let total = 0;
  for (const entry of found) {
    // Essentials are not subject to the budget — they are the reason there is
    // an offline mode. They sort first, so they are also charged against it
    // before anything else can spend it.
    if (!entry.essential && total + entry.size > MAX_TOTAL_BYTES) {
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
  const version = hash.digest("hex").slice(0, 16);

  // Best effort. A build that cannot write the bundle still produces a usable
  // manifest, and the worker falls back to fetching the files one by one —
  // noisier, but not broken.
  let chunks = [];
  try {
    chunks = await writeBundle(selected);
  } catch (error) {
    console.warn("[sw-manifest] bundle generation failed:", error);
    await rm(BUNDLE_DIR, { recursive: true, force: true }).catch(() => {});
  }

  const manifest = {
    version,
    generatedAt: new Date().toISOString(),
    totalBytes: total,
    assets,
    chunks,
  };

  await writeFile(OUTPUT, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(
    `[sw-manifest] ${assets.length} assets, ${(total / 1024 / 1024).toFixed(2)} MB ` +
      `in ${chunks.length} chunks ` +
      `(skipped ${skippedLarge} large, ${skippedMissing} missing) → version ${version}`
  );
}

main().catch((error) => {
  // A missing precache list degrades the app to "no offline assets", which is
  // where it was before. Failing the build over it would be worse.
  console.error("[sw-manifest] generation failed:", error);
});
