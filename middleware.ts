import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/about", "/contact", "/pricing", "/api/webhook", "/api/webhooks/clerk", "/learn", "/practice", "/analysis", "/login", "/register"];

export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req);
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If the user is not signed in and the route is not public, redirect to sign in
  if (!userId) {
    const signInUrl = new URL("/login", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};