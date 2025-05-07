"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Apple, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SiteFooterNew } from "@/components/site-footer-new";
import { SiteHeaderNew } from "@/components/site-header-new";
import Image from "next/image";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useProfileStore } from "../store/profile";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const baseUrl = process.env.BASE_URL;
  const { sessionId, setSessionId } = useProfileStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data.data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.data.access_token) {
        document.cookie = `token=${data.data.access_token}; path=/`;
        setSessionId(data.data.access_token);
         
        toast.success("Logged in successfully!");
        window.location.href = "/analysis";
      } else {
        toast.error("No authentication token received");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/google`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Failed to initiate Google login");
      }
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/facebook`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Failed to initiate Facebook login");
      }
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign in with Facebook");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/apple`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Failed to initiate Apple login");
      }
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign in with Apple");
    }
  };

  const headerHeight = 80;

  return (
    <>
      <div className="min-h-screen flex flex-col relative">
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
          {/* Optional overlay for improved text clarity */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <SiteHeaderNew />

        {/* Main Content with fixed dimensions based on device */}
        <main
          style={{ height: `calc(100vh - ${headerHeight}px)` }}
          className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          <div
            className={`
            w-full
            md:max-w-2xl
            z-10 
            glassmorphismLogin
            p-4 sm:p-6 md:p-8
            flex flex-col
          `}
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <Link
                href="/"
                className="text-black hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>

            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-medium text-black">
                Welcome Back!
              </h1>
              <p className="text-black/80 mt-1">
                Enter your credentials to sign in to your account
              </p>
            </div>

            <div className="flex-1">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Mail className="h-5 w-5 text-black mr-2" />
                      <span className="text-black font-medium">Email</span>
                    </div>
                    <div className="relative">
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your Email Address"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                        className="bg-light-10 border-2 border-gray-300 rounded-md h-12 text-black placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Lock className="h-5 w-5 text-black mr-2" />
                      <span className="text-black font-medium">Password</span>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your Password"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="current-password"
                        autoCorrect="off"
                        required
                        className="bg-light-10 border-2 border-gray-300 rounded-md h-12 text-black placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-base hover:text-blue-700 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  className="w-full h-12 btn-primary text-white font-medium text-base rounded-full transition-colors"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign-in"}
                </button>
              </form>

              <div className="relative my-5 sm:my-6">
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-black font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center h-12 bg-white/40 rounded-md hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-x-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="hidden sm:inline text-black font-medium">
                      Google
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleFacebookSignIn}
                  className="flex items-center justify-center h-12 bg-white/40 rounded-md hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="#1877F2"
                    >
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 12-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                    </svg>
                    <span className="hidden sm:inline text-black font-medium">
                      Facebook
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleAppleSignIn}
                  className="flex items-center justify-center h-12 bg-white/40 rounded-md hover:bg-white/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-x-2">
                    <Apple className="h-5 w-5 text-black" />
                    <span className="hidden sm:inline text-black font-medium">
                      Apple
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center mt-6 border bg-white/40 py-2 px-4 border-white/40 rounded-md">
              <p className="text-black/90 font-medium">
                Don't have an account yet?{" "}
                <Link
                  href="/register"
                  className="text-blue-base font-medium transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </main>
        <SiteFooterNew />
      </div>
    </>
  );
}
