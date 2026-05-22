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
  "/analysis",
  "/login",
  "/register",
  "/forgot-password",
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
