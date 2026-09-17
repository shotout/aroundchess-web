/* eslint-disable no-restricted-globals */
/**
 * Asset-only service worker.
 *
 * Exists for one reason: without it, an icon the browser has never fetched
 * cannot appear offline, no matter how generous the cache headers are. Cache
 * headers only help on a second look at something; this makes the first one
 * work too.
 *
 * Deliberately narrow. It does NOT cache HTML, API responses, or navigation
 * requests — an offline page load still fails, exactly as before. Getting that
 * wrong is how a service worker starts serving a version of the app nobody can
 * shake off, so requests it has no business answering are left completely
 * alone (no respondWith, so the browser behaves as if no worker existed).
 *
 * Nothing here runs on the critical path. Install does no network work at all;
 * the precache is warmed later, a few files at a time, at low priority, and
 * only once the page tells us it has finished loading.
 */

const MANIFEST_URL = "/sw-manifest.json";
const CACHE_PREFIX = "aroundchess-assets-";

/** Same list the manifest generator walks. */
const ASSET_DIRS = [
  "/images/",
  "/icons/",
  "/avatars/",
  "/fonts/",
  "/pieces/",
  "/classic/",
  "/default/",
  "/crownforge/",
  "/boards/",
  "/3d-pieces/",
  "/3d-wood-pieces/",
  "/play-vs-ai/",
  "/tutorial/",
  "/onboarding/",
  "/my-game-history/",
  "/training-plan/",
  "/puzzle/",
  "/board-vision/",
  "/endgame-training/",
  "/offers/",
  "/special-offer/",
  "/auth/",
  "/handbooks/",
  "/audio/",
];

/** The board's piece sprites and page backgrounds live at the root. */
const ROOT_ASSET = /^\/(?:[bw][BKNPQR]|chess|chess-pattern|wood-pattern)\.png$/;

/** How many precache requests may be in flight. Small on purpose: the warm
 *  runs while the user is reading the page, and saturating their connection to
 *  prepare for an outage that may never come is a bad trade. */
const WARM_CONCURRENCY = 4;

let manifestPromise = null;

/**
 * The manifest, from the network, then from the cache.
 *
 * A failure is deliberately NOT memoised. It used to be, and that was the
 * whole offline bug: a service worker is stopped whenever it goes idle and
 * restarted on the next request, so a worker that woke up while the connection
 * was down cached `null` here for the rest of its life — and every asset
 * lookup after that opened the cache named below.
 */
function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL, { cache: "no-cache" })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then(async (manifest) => {
        if (manifest) return manifest;
        // Offline: the copy stored by the last warm. caches.match() with no
        // cache named searches all of them, so this works without already
        // knowing the version — which is precisely what we are missing.
        const cached = await caches.match(MANIFEST_URL).catch(() => null);
        const fromCache = cached ? await cached.json().catch(() => null) : null;
        // Retry on the next call either way: a manifest recovered from the
        // cache is the right answer offline, and the wrong one the moment the
        // connection is back and a new version has been deployed.
        manifestPromise = null;
        return fromCache;
      });
  }
  return manifestPromise;
}

/** Only ever set from a manifest that was actually read, so a guess made while
 *  offline can never be remembered as the answer. */
let resolvedCacheName = null;

async function cacheName() {
  if (resolvedCacheName) return resolvedCacheName;

  const manifest = await loadManifest();
  if (manifest?.version) {
    // Version comes from the manifest's content hash, so a deploy that changed
    // no assets keeps the same cache and re-downloads nothing.
    resolvedCacheName = CACHE_PREFIX + manifest.version;
    return resolvedCacheName;
  }

  // No manifest at all — offline on a worker that has never read one. Ask the
  // browser what it already has rather than opening an empty cache under a
  // made-up name and reporting every precached asset as missing. `activate`
  // prunes to a single cache, so there is normally exactly one.
  const names = await caches.keys().catch(() => []);
  const existing = names.filter((name) => name.startsWith(CACHE_PREFIX));
  if (existing.length > 0) return existing[existing.length - 1];

  return CACHE_PREFIX + "unversioned";
}

function isAssetPath(pathname) {
  return ASSET_DIRS.some((dir) => pathname.startsWith(dir)) || ROOT_ASSET.test(pathname);
}

self.addEventListener("install", (event) => {
  // No precaching here. addAll() during install would hold the worker in
  // "installing" while several megabytes download, which is precisely the
  // load-time cost this is supposed to avoid.
  event.waitUntil(self.skipWaiting());
});

/**
 * Drop the caches from older versions — but only once the new one is filled.
 *
 * This used to run on activate, which meant every deploy that touched an asset
 * emptied the offline cache the moment the worker took over and left it empty
 * until a full warm finished. Anyone who went offline in that window saw
 * exactly what an unwarmed cache looks like: the page renders, and every
 * image, icon and sound it had not already fetched is missing. The previous
 * version's copies are a little stale at worst, and staleWhileRevalidate
 * replaces them as they are used, so keeping them until the replacement is
 * ready costs nothing and covers the gap.
 */
async function prunePreviousCaches() {
  const keep = await cacheName();
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((name) => name.startsWith(CACHE_PREFIX) && name !== keep)
      .map((name) => caches.delete(name))
  );
}

self.addEventListener("activate", (event) => {
  // Claim only. The pruning waits for the warm — see prunePreviousCaches.
  event.waitUntil(self.clients.claim());
});

let warming = false;

/** Fill the precache, gently. Skips anything already stored, so a repeat visit
 *  costs nothing and an interrupted warm resumes where it stopped.
 *
 *  Manifest order is kept deliberately: it is smallest-first, so the icons and
 *  glyphs the UI is built out of are all in place long before the background
 *  images, and a warm that never finishes still leaves a usable offline app.
 *  See scripts/generate-sw-manifest.mjs. */
async function warmPrecache() {
  if (warming) return;
  warming = true;
  try {
    const manifest = await loadManifest();
    if (!manifest?.assets?.length) return;

    const cache = await caches.open(await cacheName());

    // Keep a copy of the manifest beside the assets it describes. A worker
    // that restarts while offline has no other way to learn which cache the
    // precache is in; the fetch handler never serves this entry, it only
    // exists for loadManifest's fallback.
    try {
      await cache.put(
        MANIFEST_URL,
        new Response(JSON.stringify(manifest), {
          headers: { "Content-Type": "application/json" },
        })
      );
    } catch {
      // Storage full or blocked: the caches.keys() fallback still covers it.
    }

    const missing = [];
    for (const asset of manifest.assets) {
      if (!(await cache.match(asset))) missing.push(asset);
    }
    if (missing.length === 0) {
      // Already complete: nothing to fetch, and the older versions are now
      // safe to let go of.
      await prunePreviousCaches();
      return;
    }

    let cursor = 0;
    const workers = Array.from({ length: WARM_CONCURRENCY }, async () => {
      while (cursor < missing.length) {
        const asset = missing[cursor++];
        try {
          // `priority: low` keeps these behind anything the page actually
          // needs, on browsers that support it; ignored elsewhere.
          const response = await fetch(asset, {
            cache: "no-cache",
            priority: "low",
          });
          if (response.ok) await cache.put(asset, response.clone());
        } catch {
          // One unreachable file must not stop the rest — this is why the warm
          // does not use cache.addAll(), which rejects the whole batch.
        }
      }
    });
    await Promise.all(workers);
    // Whatever could be fetched has been. An interrupted warm simply leaves
    // the older caches in place for the next attempt to finish behind.
    await prunePreviousCaches();
  } finally {
    warming = false;
  }
}

self.addEventListener("message", (event) => {
  // The page decides when: after load and an idle callback. See
  // components/v2/service-worker-host.tsx.
  if (event.data?.type === "warm-precache") {
    event.waitUntil ? event.waitUntil(warmPrecache()) : warmPrecache();
  }
});

/** Serve from cache, and refresh in the background when online. Used for asset
 *  files that are not in the manifest, where the cache is the only copy but
 *  may be older than what is deployed. */
/**
 * Last resort: search every cache this origin owns, rather than only the one
 * we believe is current.
 *
 * The cache is named after the manifest's version, and every way of learning
 * that version can fail — offline, mid-deploy, on a worker that restarted at
 * the wrong moment. When it does, the asset is sitting in a cache under a name
 * we did not guess, and the page shows a broken square for a file the browser
 * already has. CacheStorage.match() searches all of them, so this answers
 * correctly no matter which name the file was stored under.
 */
async function matchAnyCache(request) {
  try {
    return (await caches.match(request)) ?? null;
  } catch {
    return null;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(await cacheName());
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) return cached;
  const fresh = await network;
  if (fresh) return fresh;

  const anywhere = await matchAnyCache(request);
  if (anywhere) return anywhere;

  return new Response("", { status: 504, statusText: "Offline" });
}

/** next/image requests cannot be precached — the URL carries a width and
 *  quality, so one source file has many variants and no way to know which the
 *  page will ask for. Tried over the network first, then answered with the raw
 *  precached original: unoptimised and a little larger, but it renders, which
 *  is the whole point. Online behaviour is untouched. */
async function optimizedImage(request, url) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(await cacheName());
      cache.put(request, response.clone());
      return response;
    }
  } catch {
    // fall through to the cache
  }

  const cache = await caches.open(await cacheName());
  const cachedVariant =
    (await cache.match(request)) ?? (await matchAnyCache(request));
  if (cachedVariant) return cachedVariant;

  const source = url.searchParams.get("url");
  if (source && source.startsWith("/")) {
    const original =
      (await cache.match(source)) ?? (await matchAnyCache(source));
    if (original) return original;
  }

  return new Response("", { status: 504, statusText: "Offline" });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Navigations, documents and anything cross-origin are none of our business.
  if (request.mode === "navigate") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Never come between the app and its API, its auth, its Sentry tunnel or
  // Next's own data requests.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/monitoring") ||
    url.pathname.startsWith("/_next/data/") ||
    url.pathname === MANIFEST_URL
  ) {
    return;
  }

  if (url.pathname === "/_next/image") {
    event.respondWith(optimizedImage(request, url));
    return;
  }

  // Hashed build output: the URL changes whenever the content does, so the
  // cached copy can never be the wrong one.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(await cacheName());
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("", { status: 504, statusText: "Offline" });
        }
      })()
    );
    return;
  }

  if (isAssetPath(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
