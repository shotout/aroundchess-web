/** @type {import('next').NextConfig} */                                                                                                                                                                     
const nextConfig = {                                                                                                                                                                                         
  env: {                                                                                                                                                                                                     
    BASE_URL: process.env.BASE_URL,                                                                                                                                                                          
    BASE_URL_STAGING: process.env.BASE_URL_STAGING,                                                                                                                                                          
    BASE_URL_IP: process.env.BASE_URL_IP,                                                                                                                                                                    
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,                                                                                                                                                        
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY                                                                                                                                         
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  experimental: {
    missingSuspenseWithCSRBailout: false,
    // Trades a little build time for a much lower peak heap.
    webpackMemoryOptimizations: true,
  },

  eslint: {
    // Lint is run separately (`yarn lint`); doing it inside `next build` was
    // tipping the Vercel builder over its memory limit.
    ignoreDuringBuilds: true,
  },

  webpack: (config, { dev }) => {
    // The filesystem cache keeps the whole module graph resident and then
    // serializes it (the PackFileCacheStrategy "Serializing big strings"
    // warnings) — that peak is what gets the build OOM-killed on Vercel.
    // It buys nothing on a cold CI builder anyway.
    if (!dev) config.cache = false;
    return config;
  },

  async redirects() {
    return [
      {
        source: '/api/newsletter/unsubscribe',
        destination: 'https://ac-socialmedia.vercel.app/api/newsletter/unsubscribe',
        permanent: false,
      },
      {
        source: '/play-practice',
        destination: '/play',
        permanent: true,
      },
    ]
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  // Long-lived caching for the assets the board fetches on demand.
  //
  // Next.js serves everything in /public as `max-age=0, must-revalidate`, so
  // every one of these needs the network the moment it is first requested:
  // Stockfish is started with `new Worker("/stockfish/...")` (a second one for
  // move classification) and each move sound is a fresh `new Audio(...)`. A
  // connection that drops mid-game then took the AI opponent down with it,
  // even though the engine runs entirely on the device. Cached properly, a
  // game already in progress plays on with no connection at all.
  //
  // None of these filenames are content-hashed, so a replaced engine build or
  // sound effect needs a new name (or a ?v= query) to reach clients that
  // already cached the old one.
  async headers() {
    const ENGINE_CACHE = "public, max-age=31536000, immutable";
    // Shorter than the engine, and not immutable: sound effects are small and
    // far likelier to actually be swapped out.
    const AUDIO_CACHE = "public, max-age=2592000";

    // Product imagery and fonts, and the same story again: an icon the page
    // only asks for once something has happened — the resign warning, the
    // end-of-game banner, the offline card's own wifi glyph — is fetched at
    // that moment, which offline means a broken image. That is exactly what a
    // real device showed. 30 days, and revalidatable rather than immutable,
    // because these do get redrawn occasionally; it is long enough that
    // anything seen on a previous visit is still valid when the connection
    // goes.
    const STATIC_ASSET_CACHE = "public, max-age=2592000";

    // Every /public directory that holds something the UI renders. Listed one
    // by one rather than matched by extension: an extension pattern here is
    // easy to get subtly wrong in path-to-regexp and silently match nothing.
    const assetDirs = [
      "/images",
      "/icons",
      "/avatars",
      "/fonts",
      "/pieces",
      "/classic",
      "/default",
      "/crownforge",
      "/boards",
      "/3d-pieces",
      "/3d-wood-pieces",
      "/play-vs-ai",
      "/tutorial",
      "/onboarding",
      "/my-game-history",
      "/training-plan",
      "/puzzle",
      "/board-vision",
      "/endgame-training",
      "/offers",
      "/special-offer",
      "/auth",
      "/handbooks",
    ];

    // The board's piece sprites and page backgrounds sit at the root rather
    // than in a directory, so they need naming. A fixed set, so spelling them
    // out beats a regex over the whole root.
    const rootImages = [
      ...["b", "w"].flatMap((colour) =>
        ["B", "K", "N", "P", "Q", "R"].map((piece) => `/${colour}${piece}.png`)
      ),
      "/chess.png",
      "/chess-pattern.png",
      "/wood-pattern.png",
    ];

    // Vendored engine builds. The root-level three are the ones layout.tsx
    // loads via <script src="/stockfish.js">; /stockfish/* holds the NNUE
    // builds the play-vs-AI board and the move classifier run as workers.
    const engineAssets = [
      "/stockfish/:path*",
      "/stockfish.js",
      "/stockfish.wasm.js",
      "/Stockfish.wasm",
    ];
                                                                                                                                                                                          
    return [                                                                                                                                                                                                 
      {                                                                                                                                                                                                      
        // matching all API routes                                                                                                                                                                           
        source: "/api/:path*",                                                                                                                                                                               
        headers: [                                                                                                                                                                                           
          { key: "Access-Control-Allow-Credentials", value: "true" },                                                                                                                                        
          { key: "Access-Control-Allow-Origin", value: "*" },                                                                                                                                                
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },                                                                                                               
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },                          
        ]                                                                                                                                                                                                    
      },                                                                                                                                                                                                      
      ...engineAssets.map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: ENGINE_CACHE }],
      })),
      {
        source: "/audio/:path*",
        headers: [{ key: "Cache-Control", value: AUDIO_CACHE }],
      },
      ...assetDirs.map((dir) => ({
        source: `${dir}/:path*`,
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      })),
      ...rootImages.map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      })),
      // The one pair that must NOT be cached. The worker script and its
      // precache list are how a deploy reaches a browser that already has an
      // older worker installed; served stale, the old one would keep serving
      // the old assets and there would be no way to correct it.
      ...["/sw.js", "/sw-manifest.json"].map((source) => ({
        source,
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      })),
    ]                                                                                                                                                                                                        
  },                                                                                                                                                                                                         
                                                                                                                                                                                                             
  images: {
    dangerouslyAllowSVG: true,
    // Next's default is 60 SECONDS, which is the main reason icons broke
    // offline on a real device: almost everything on the page goes through
    // next/image, so it is served from /_next/image and expires a minute
    // after it is fetched. Once expired the browser tries to revalidate, and
    // offline that fails and renders a broken image. Matched to
    // STATIC_ASSET_CACHE in headers() above so the optimised variant and its
    // source file agree on how long they are good for.
    minimumCacheTTL: 2592000,

    remotePatterns: [                                                                                                                                                                                        
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'img.clerk.com',                                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'images.clerk.dev',                                                                                                                                                                        
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'avatars.githubusercontent.com',                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'images.chesscomfiles.com',                                                                                                                                                                
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'placehold.co',                                                                                                                                                                            
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'api.chess.com',                                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'www.chess.com'                                                                                                                                                                            
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'cdn.chess.com',                                                                                                                                                                           
      },                                                                                                                                                                                                     
      {                                                                                                                                                                                                      
        protocol: 'https',                                                                                                                                                                                   
        hostname: 'aroundchess-news.s3.amazonaws.com',                                                                                                                                                       
      }                                                                                                                                                                                                      
    ],                                                                                                                                                                                                       
  },                                                                                                                                                                                                         
}                                                                                                                                                                                                            
                                                                                                                                                                                                             
// Injected content via Sentry wizard below

import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "aroundchess",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Off: no SENTRY_AUTH_TOKEN is set in CI, so the widened source maps are
  // generated and held in memory but never actually uploaded.
  widenClientFileUpload: false,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
