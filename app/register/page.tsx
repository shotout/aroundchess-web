"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Apple, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { signinWithGoogle } from "@/utils/supabase/actions";
import { useProfileStore } from "../store/profile";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const baseUrl = process.env.BASE_URL;
  const { setSessionId } = useProfileStore();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      //  register
      const response = await fetch(`${baseUrl}/auth/register`, {
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

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setEmailSent(true);
      toast.success("Verification code sent to your email!");

      setTimeout(() => {
        if (codeInputRef.current) {
          codeInputRef.current.focus();
        }
      }, 100);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerify(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsVerifying(true);

    try {
      const response = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      if (data.data && data.data.access_token) {
        setSessionId(data.data.access_token);

        document.cookie = `token=${data.data.access_token}; path=/`;

        toast.success("Account verified and logged in successfully!");

        window.location.href = "/analysis";
      } else if (data.token) {
        setSessionId(data.token);
        document.cookie = `token=${data.token}; path=/`;

        toast.success("Account verified and logged in successfully!");
        window.location.href = "/analysis";
      } else {
        toast.error("No authentication token received");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      toast.error(errorMessage);
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  }

  async function resendVerificationCode() {
    try {
      setIsLoading(true);

      // Resend the OTP
      const response = await fetch(`${baseUrl}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      toast.success("Verification code resent to your email!");

      setVerificationCode("");
      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend code";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleGoogleSignUp = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/sso/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: "web",
        }),
      });

      const data = await response.json();
      console.log("Google SSO response:", data);

      // if (data) {
      //   window.location.href = "/sso-callback";
      // } else {
      //   toast.error("Failed to initiate Facebook signup");
      // }
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign up with Google");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/sso/facebook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: "web",
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Failed to initiate Facebook signup");
      }
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign up with Facebook");
    }
  };

  const handleAppleSignUp = async () => {
    try {
      // For SSO, we need to generate a callback URL that your backend expects
      const callbackUrl = `${window.location.origin}/sso-callback`;

      const response = await fetch(`${baseUrl}/auth/sso/apple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: "web",
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error("Failed to initiate Apple signup");
      }
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error("Failed to sign up with Apple");
    }
  };

  return (
    <>
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

        {/* <SiteHeaderNew /> */}

        {/* Main Content with fixed dimensions based on device */}
        <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
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
                {!emailSent ? "Create an account" : "Verify Your Email"}
              </h1>
              {!emailSent ? (
                <p className="text-black/80 mt-1">
                  Enter your details to create your account
                </p>
              ) : (
                <p className="text-black/80 mt-1 font-medium">
                  We've sent a verification code to{" "}
                  <span className="text-blue-base">{email}</span>
                </p>
              )}
            </div>

            {!emailSent ? (
              <div className="flex-1">
                <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
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
                          placeholder="Enter your new Password"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="new-password"
                          autoCorrect="off"
                          required
                          className="bg-light-10 border-2 border-gray-300 rounded-md h-12 text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Lock className="h-5 w-5 text-black mr-2" />
                        <span className="text-black font-medium">
                          Confirm Password
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your new Password"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="new-password"
                          autoCorrect="off"
                          required
                          className="bg-light-10 border-2 border-gray-300 rounded-md h-12 text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full h-12 btn-primary text-white font-medium text-base rounded-full transition-colors"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Sign-up"}
                  </button>
                </form>

                <div className="relative my-5 sm:my-6">
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className=" px-2 text-black font-medium">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <form>
                    <button
                      // onClick={handleGoogleSignUp}
                      formAction={signinWithGoogle}
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
                  </form>

                  <button
                    onClick={handleFacebookSignUp}
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
                    onClick={handleAppleSignUp}
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
            ) : (
              <div className="text-center flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="flex justify-center my-4 sm:my-6">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                      <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
                      <div className="z-10">
                        <Image
                          src={"/icons/email-sent.png"}
                          alt="Email sent"
                          width={180}
                          height={180}
                          className="text-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={onVerify} className="space-y-6">
                  <div>
                    <div className="mb-4">
                      <p className="text-black/80 mb-2">
                        Enter verification code
                      </p>
                      <div className="flex justify-center gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <Input
                            key={index}
                            ref={index === 0 ? codeInputRef : null}
                            id={`verificationCode-${index}`}
                            value={verificationCode[index] || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value && !/^[0-9]$/.test(value)) return;

                              const newCode = verificationCode.split("");
                              newCode[index] = value;
                              setVerificationCode(newCode.join(""));

                              // Auto-focus next input when a digit is entered
                              if (value && index < 5) {
                                const nextInput = document.getElementById(
                                  `verificationCode-${index + 1}`
                                );
                                if (nextInput) nextInput.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle backspace to move to previous input
                              if (
                                e.key === "Backspace" &&
                                !verificationCode[index] &&
                                index > 0
                              ) {
                                const prevInput = document.getElementById(
                                  `verificationCode-${index - 1}`
                                );
                                if (prevInput) prevInput.focus();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedData = e.clipboardData
                                .getData("text")
                                .trim();
                              if (/^\d+$/.test(pastedData)) {
                                // Get only up to 6 digits
                                const digits = pastedData
                                  .substring(0, 6)
                                  .split("");
                                setVerificationCode(
                                  digits.join("") +
                                    verificationCode
                                      .substring(digits.length)
                                      .substring(0, 6)
                                );

                                // Focus the next empty input or the last input if all filled
                                if (digits.length < 6) {
                                  const nextInput = document.getElementById(
                                    `verificationCode-${Math.min(
                                      digits.length,
                                      5
                                    )}`
                                  );
                                  if (nextInput) nextInput.focus();
                                }
                              }
                            }}
                            type="text"
                            inputMode="numeric"
                            autoCapitalize="none"
                            autoCorrect="off"
                            maxLength={1}
                            className="bg-white/40 border-white/40 rounded-md h-14 w-14 text-black text-center text-xl font-medium"
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full flex items-center justify-center gap-2 transition-colors"
                      disabled={isVerifying || verificationCode.length !== 6}
                    >
                      {isVerifying ? (
                        "Verifying..."
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Verify Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={resendVerificationCode}
                    className="h-12 bg-white/40 hover:bg-white/60 text-blue-600 font-medium rounded-md transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Resend code"}
                  </button>

                  <button
                    onClick={() => setEmailSent(false)}
                    className="h-12 bg-white/40 hover:bg-white/60 text-black font-medium rounded-md transition-colors"
                  >
                    Change email
                  </button>
                </div>
              </div>
            )}

            {!emailSent ? (
              <div className="text-center mt-6 border bg-white/40 py-2 px-4 border-white/40 rounded-md">
                <p className="text-black/90 font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-base font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        </main>
        {/* <SiteFooterNew /> */}
      </div>
    </>
  );
}
