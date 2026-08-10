import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/apps-use/terms-of-service",
  "/apps-use/privacy-policy",
  "/apps-use/eu-compliance",
  "/faq",
  "/chessboard",
  "/about-us",
  "/privacy-policy",
  "/terms-of-service",
  "/eu-compliance",
  "/contact-us",
  "/chess-blog",
  "/api/webhook",
  "/api/webhooks/clerk",
  // Shared game results: the social-network crawlers arrive without a token,
  // and they have to reach both the page and its OpenGraph image or the post
  // falls back to a bare link.
  "/s",
  "/api/share-image",
  "/analysis",
  "/login",
  "/register",
  "/forgot-password",
  // Shown right after the account is deleted, by which point the session is
  // already gone — it has to be reachable without a token or the confirmation
  // gets redirected straight to /login.
  "/delete-account",
  "/auth/callback",
  "/support",
  "/contact",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (
    (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
    token != undefined &&
    token != ""
  ) {
    return NextResponse.redirect(new URL("/my-game-history", req.url));
  }

  if (pathname === "/auth/callback") {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/analyzer") ||
    pathname.startsWith("/chessdotcom") ||
    pathname.startsWith("/playground/computer") ||
    pathname.startsWith("/playground/online-multiplayer") ||
    pathname.startsWith("/playground/two-player") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/puzzle")
  ) {
    return NextResponse.redirect(new URL("/analysis", req.url));
  }

  if (
    req.url.includes("/stockfish.js") ||
    req.url.includes("/Stockfish.wasm")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/monitoring")) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) => pathname === route) || pathname.startsWith("/chess-blog/");
  if (isPublicRoute || (token != undefined && token != "")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
