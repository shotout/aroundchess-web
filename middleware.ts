import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/about",
  "/contact-us",
  "/chess-news",
  "/api/webhook",
  "/api/webhooks/clerk",
  "/analysis",
  "/login",
  "/register",
];
// Combined middleware
export default clerkMiddleware(async (auth, req) => {
  // Handle Stockfish files
  const { pathname } = req.nextUrl;
  const { sessionId } = await auth();
  //if already login
  if (
    (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
    sessionId != null
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  //old file hide
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/analyzer") ||
    pathname.startsWith("/chessboard") ||
    pathname.startsWith("/chessdotcom") ||
    pathname.startsWith("/playground/computer") ||
    pathname.startsWith("/playground/online-multiplayer") ||
    pathname.startsWith("/playground/two-player") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/puzzle")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (
    req.url.includes("/stockfish.js") ||
    req.url.includes("/Stockfish.wasm")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) => pathname == route);
  if (isPublicRoute || sessionId != null) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
