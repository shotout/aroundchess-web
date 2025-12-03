"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { SiteHeaderNew } from "@/components/site-header-new";
import { SiteFooterNew } from "@/components/site-footer-new";
import Image from "next/image";
import { trackCustomEvent } from "../utils/facebookPixel";
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams?.get("code");

  async function handlePasswordReset(e: React.FormEvent) {}
  useEffect(() => {
    trackCustomEvent("ViewResetPassword");
  }, []);
  useEffect(() => {
    if (!code) {
      router.push("/forgot-password");
    }
  }, [code, router]);

  if (!code) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-cover mb-48">
        <Image fill src={"/images/auth-background.png"} className="" alt={""} />
      </div>

      <SiteHeaderNew />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md xl:max-w-[668px] z-10 bg-white/20 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 p-8">
          <div className="flex items-center mb-6">
            <Link href="/login" className="text-black hover:text-blue-200">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-black">
              {!resetComplete
                ? "Create New Password"
                : "Password Reset Complete!"}
            </h1>
            {!resetComplete && (
              <p className="text-black/80 mt-1">
                Enter your new password below
              </p>
            )}
          </div>

          {!resetComplete ? (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-black mr-2" />
                    <span className="text-black font-medium">New Password</span>
                  </div>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    required
                    className="bg-white/30 border-white/30 rounded-md h-12 text-black placeholder:text-black/70"
                  />
                </div>
              </div>

              <button
                className="w-full h-12 btn-primary text-black font-medium rounded-full"
                type="submit"
                disabled={isResetting}
              >
                {isResetting ? "Processing..." : "Reset Password"}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-100/70 border border-red-200 rounded-md">
                  <p className="text-[14px] --sm text-red-600 text-center">{error}</p>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center flex flex-col items-center">
              <div className="mb-6">
                <div className="flex justify-center my-6">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Success icon with background */}
                    <div className="absolute inset-0 bg-green-100 rounded-full opacity-30"></div>
                    <div className="z-10">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                  </div>
                </div>
                <p className="text-black/80">
                  Your password has been successfully reset.
                  <br />
                  You will be redirected to the login page.
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-6 border bg-light-10 py-2 px-4 border-gray-400 rounded-md">
            <p className="text-black/90">
              Remember your password?
              <Link
                href="/login"
                className="ml-1 text-blue-300 hover:text-blue-100 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooterNew />
    </div>
  );
}
export default function Page() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
