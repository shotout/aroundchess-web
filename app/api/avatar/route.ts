import { NextRequest } from "next/server";
import { AVATAR_PREFIX } from "@/components/v2/share-link";

export const runtime = "nodejs";

/**
 * Same-origin proxy for profile pictures, so the share card can draw one onto a
 * canvas.
 *
 * The bucket serves avatars with no Access-Control-Allow-Origin header, and
 * share-image-canvas.ts loads them with `crossOrigin = "anonymous"` (it has to —
 * an un-CORSed image taints the canvas and toBlob() then throws). The browser
 * blocks the load, onerror fires, and the card silently falls back to the
 * trophy placeholder — which is why the clipboard card showed a trophy while the
 * server-rendered preview card showed the real photo.
 *
 * Deliberately NOT a general URL proxy: it takes an object KEY and rebuilds the
 * URL against AVATAR_PREFIX itself, so it can only ever reach that one bucket.
 * A `?url=` parameter here would be an SSRF hole.
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("k");

  // No traversal, no scheme, no host — a bare object key only.
  if (!key || key.includes("..") || /^[a-z]+:/i.test(key)) {
    return new Response("Bad avatar key", { status: 400 });
  }

  try {
    const upstream = await fetch(`${AVATAR_PREFIX}${key}`, {
      cache: "no-store",
    });
    if (!upstream.ok || !upstream.body) {
      return new Response("Avatar not found", { status: 404 });
    }

    const type = upstream.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) {
      return new Response("Not an image", { status: 415 });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": type,
        // Avatars are content-addressed by key, so they never change in place.
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Could not load the avatar", { status: 502 });
  }
}
