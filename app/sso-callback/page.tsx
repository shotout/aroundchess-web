"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "../store/profile";
import { toast } from "sonner";
import createClientForBrowser from "@/utils/supabase/client";

export default function SSOCallback() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSessionId } = useProfileStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClientForBrowser();

        // Get the current URL to check for code parameter
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        // If there's a code in the URL, we need to handle it
        if (code) {
          // The code is automatically handled by Supabase's internal processes
          await supabase.auth.exchangeCodeForSession(code);
        }

        // Exchange the code for a session
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!data?.session) {
          throw new Error("No session found");
        }

        // Get the access token
        const token = data.session.access_token;

        // Store token in cookie and state
        document.cookie = `token=${token}; path=/`;
        setSessionId(token);

        toast.success("Successfully signed in!");

        // Redirect to the dashboard
        router.push("/analysis");
      } catch (err: any) {
        console.error("SSO callback error:", err);
        setError(err.message || "Failed to complete authentication");
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [router, setSessionId]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Authentication Error
          </h1>
          <p className="mb-6 text-gray-700">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Completing Sign In</h1>
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <span className="ml-3 text-gray-700">Authenticating...</span>
        </div>
      </div>
    </div>
  );
}
