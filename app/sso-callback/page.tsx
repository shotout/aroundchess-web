"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useProfileStore } from "../store/profile";

export default function SSOCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = process.env.BASE_URL;
  const { setSessionId } = useProfileStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!searchParams) {
          setError("No search parameters found in the URL");
          setIsProcessing(false);
          return;
        }
        const code = searchParams.get("code");

        if (!code) {
          setError("No authorization code received");
          setIsProcessing(false);
          return;
        }

        const response = await fetch(
          `${baseUrl}/auth/auth/callback?code=${code}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        if (data.token) {
          setSessionId(data.token);
          document.cookie = `token=${data.token}; path=/`;

          toast.success("Successfully authenticated");

          window.location.href = "/analysis";
        } else {
          throw new Error("No authentication token received");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed"
        );
        setIsProcessing(false);
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, baseUrl]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background with adjustable positioning */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/auth-background.png"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition:
              "var(--bg-position-x, center) var(--bg-position-y, top)",
          }}
          alt="Authentication background"
        />
        {/* overlay*/}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md glassmorphismLogin p-8 rounded-lg shadow-lg text-center">
          {isProcessing ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
                  <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-black">
                Completing Authentication
              </h1>
              <p className="mt-2 text-black/80">
                Please wait while we finish the process...
              </p>
            </>
          ) : (
            <>
              <div className="text-red-500 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-black">
                Authentication Error
              </h1>
              <p className="mt-4 text-red-600">{error}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-6 w-full h-12 btn-primary text-white font-medium text-base rounded-full"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
