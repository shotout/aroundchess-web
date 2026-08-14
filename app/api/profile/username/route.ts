import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await fetch(`${process.env.BASE_URL}/profile/username`, {
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
      { statusCode: 500, message: error?.message || "Failed to update username" },
      { status: 500 }
    );
  }
}
