import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/about", "/contact", "/pricing", "/api/webhook", "/api/webhooks/clerk", "/learn", "/practice", "/analysis", "/login", "/register"];

// Combined middleware
export default clerkMiddleware((auth, req) => {
  // Handle Stockfish files
  if (req.url.includes('/stockfish.js') || req.url.includes('/Stockfish.wasm')) {
    return NextResponse.next();
  }
  
  const isPublicRoute = publicRoutes.some((route) => 
    req.url.includes(route)
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  return NextResponse.redirect(new URL('/', req.url));
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};