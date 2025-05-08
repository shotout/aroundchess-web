"use client";
import React, { useState, useEffect, useRef } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { SiteFooterNew } from "@/components/site-footer-new";
import { SiteHeaderNew } from "@/components/site-header-new";
import Image from "next/image";
import { toast } from "sonner";

const backgroundStyles = {
  "--bg-position-x": "center",
  "--bg-position-y": "top",
  "--bg-size": "cover",
} as React.CSSProperties;

const BASE_URL = process.env.BASE_URL;

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function startPasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setEmailSent(true);
      toast.success("Reset code sent to your email!");

      setTimeout(() => {
        if (codeInputRef.current) {
          codeInputRef.current.focus();
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  }

  // Reset password with the verification code
  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsVerifying(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/reset-password/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password reset successfully!");
      setResetComplete(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
      toast.error("Failed to reset password");
    } finally {
      setIsVerifying(false);
    }
  }

  async function resendVerificationCode() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      toast.success("Reset code resent to your email!");

      // Clear the input fields
      setVerificationCode("");
      if (codeInputRef.current) {
        codeInputRef.current.focus();
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
      toast.error("Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col relative">
        {/* Background with adjustable positioning */}
        <div className="absolute inset-0 -z-10" style={backgroundStyles}>
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
                href="/login"
                className="text-black hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>

            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-medium text-black">
                {resetComplete
                  ? "Password Reset Complete"
                  : !emailSent
                  ? "Forgot your Password?"
                  : "Reset Your Password"}
              </h1>
              {!emailSent && !resetComplete && (
                <p className="text-black/80 mt-1">
                  Enter your email to receive a password reset code
                </p>
              )}
              {emailSent && !resetComplete && (
                <p className="text-black/80 mt-1 font-medium">
                  We've sent a verification code to{" "}
                  <span className="text-blue-base">{email}</span>
                </p>
              )}
              {resetComplete && (
                <p className="text-black/80 mt-1">
                  Your password has been reset successfully. Redirecting to
                  login...
                </p>
              )}
            </div>

            {!emailSent && !resetComplete ? (
              <div className="flex-1">
                <form
                  onSubmit={startPasswordReset}
                  className="space-y-4 sm:space-y-5"
                >
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
                  </div>

                  <button
                    className="w-full h-12 btn-primary text-white font-medium text-base rounded-full transition-colors"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Send Reset Code"}
                  </button>
                </form>
              </div>
            ) : emailSent && !resetComplete ? (
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

                <form onSubmit={resetPassword} className="space-y-6">
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

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Lock className="h-5 w-5 text-black mr-2" />
                          <span className="text-black font-medium">
                            New Password
                          </span>
                        </div>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
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
                            placeholder="Confirm your new password"
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
                      type="submit"
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full flex items-center justify-center gap-2 transition-colors mt-6"
                      disabled={
                        isVerifying ||
                        verificationCode.length !== 6 ||
                        !newPassword ||
                        !confirmPassword
                      }
                    >
                      {isVerifying ? (
                        "Processing..."
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Reset Password
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
            ) : (
              <div className="text-center flex-1 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 mb-6">
                  <CheckCircle className="w-full h-full text-green-500" />
                </div>
                <p className="text-black/80 mb-4">
                  Your password has been reset successfully.
                </p>
                <p className="text-black/60">
                  You will be redirected to the login page momentarily...
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100/70 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}
          </div>
        </main>
        <SiteFooterNew />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
