import { NextRequest, NextResponse } from "next/server";
import { createClientForServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  if (error) {
    console.error("OAuth error from provider:", error);
    return redirect(`/login?error=${error}`);
  }

  if (code) {
    try {
      const supabase = await createClientForServer();
      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("Error exchanging code:", exchangeError);
        return redirect(`/login?error=${exchangeError.message}`);
      }

      if (data?.session?.access_token) {
        cookies().set("token", data.session.access_token, { path: "/" });
        return redirect("/analysis");
      } else {
        console.error("No access token received after code exchange");
        return redirect("/login?error=No access token received");
      }
    } catch (error: any) {
      console.error("Error processing OAuth callback:", error);
      return redirect(`/login?error=${error.message}`);
    }
  }

  // If no code or error, redirect to login
  return redirect("/login");
}
