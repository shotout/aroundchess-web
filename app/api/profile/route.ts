import { NextRequest, NextResponse } from "next/server";

// Proxies partial profile updates to the backend. Same reason as
// app/api/profile/username/route.ts: the browser blocks direct PATCH calls
// because the API's CORS config doesn't allow the PATCH method, while
// server-to-server requests are not subject to CORS.
//
// Used for `{ chesscomBannerShown: true }` (the backend increments
// chesscomBannerShownCount and stamps chesscomBannerLastShownAt itself), but
// the body is forwarded verbatim so any other partial update can reuse it.
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await fetch(`${process.env.BASE_URL}/profile`, {
      method: "PATCH",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: request.headers.get("authorization") ?? "",
      },
      body,
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { statusCode: 500, message: error?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
