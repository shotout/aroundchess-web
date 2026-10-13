import { NextRequest, NextResponse } from "next/server";
import {
  CANCEL_OFFER_PENDING_COOKIE,
  CANCEL_OFFER_PENDING_MAX_AGE_S,
  CANCEL_OFFER_QUERY_PARAM,
} from "./constants/cancelOffer";

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
  "/s",
  "/api/share-image",
  "/analysis",
  "/login",
  "/register",
  "/forgot-password",
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

  const loginRedirect = NextResponse.redirect(new URL("/login", req.url));

  // The redirect drops the query string, so a resubscribe link to a protected
  // page opened while signed out would lose its banner. Park it in a cookie;
  // the banner host opens it once they have logged in.
  if (req.nextUrl.searchParams.has(CANCEL_OFFER_QUERY_PARAM)) {
    loginRedirect.cookies.set(CANCEL_OFFER_PENDING_COOKIE, "1", {
      path: "/",
      maxAge: CANCEL_OFFER_PENDING_MAX_AGE_S,
      sameSite: "lax",
    });
  }

  return loginRedirect;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
