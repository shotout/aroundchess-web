"use client";
import React, { useState, useRef, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { SiteFooterNew } from "@/components/site-footer-new";
import { SiteHeaderNew } from "@/components/site-header-new";
import Image from "next/image";
import { toast } from "sonner";
import { useProfileStore } from "@/app/store/profile";

const backgroundStyles = {
  "--bg-position-x": "center",
  "--bg-position-y": "top",
  "--bg-size": "cover",
} as React.CSSProperties;

const BASE_URL = process.env.BASE_URL;

interface PasswordCondition {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}
const ForgotPasswordPage: NextPage = () => {
  const { profile } = useProfileStore();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [tokenVerified, setTokenVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const isLoggedIn = profile && profile.email;

  useEffect(() => {
    if (isLoggedIn) {
      setEmail(profile.email);
    }
  }, [profile, isLoggedIn]);
  const passwordConditions: PasswordCondition[] = [
    {
      id: "minLength",
      text: "Minimum 8 characters",
      validator: (password) => password.length >= 8,
    },
    {
      id: "uppercase",
      text: "At least 1 uppercase letter (A-Z)",
      validator: (password) => /[A-Z]/.test(password),
    },
    {
      id: "number",
      text: "At least 1 number (0-9)",
      validator: (password) => /\d/.test(password),
    },
    {
      id: "lowercase",
      text: "At least 1 lowercase letter (a-z)",
      validator: (password) => /[a-z]/.test(password),
    },
  ];
  const validatePassword = (password: string) => {
    return passwordConditions.map((condition) => ({
      ...condition,
      isValid: condition.validator(password),
    }));
  };

  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword !== "";
  const allConditionsMet = passwordConditions.every((condition) =>
    condition.validator(newPassword)
  );
  const canContinue = allConditionsMet && passwordsMatch;

  const validatedConditions = validatePassword(newPassword);

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

  // Verify the token first
  async function verifyToken(e: React.FormEvent) {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/auth/verify-token-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            token: verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

      setTokenVerified(true);
      toast.success("Verification code confirmed!");
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      toast.error("Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  }

  // Reset password with the verified token
  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setIsResettingPassword(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsResettingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      setIsResettingPassword(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/set-new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          token: verificationCode,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password reset successfully!");
      setResetComplete(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
      toast.error("Failed to reset password");
    } finally {
      setIsResettingPassword(false);
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

      // Clear the input fields and reset verification state
      setVerificationCode("");
      setTokenVerified(false);
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

  function changeEmail() {
    setEmailSent(false);
    setTokenVerified(false);
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  }

  return (
    <>
      <div className="min-h-screen flex flex-col relative">
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
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <SiteHeaderNew />

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
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <Link
                href="/login"
                className="text-black hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-medium text-black flex-1 text-center">
                {resetComplete
                  ? "Password Reset Complete"
                  : !emailSent
                  ? "Forgot your Password?"
                  : !tokenVerified
                  ? "Verify Your Code"
                  : "Reset Your Password"}
              </h1>
              <div className="w-5"></div>
            </div>

            <div className="text-center mb-5 sm:mb-6">
              {!emailSent && !resetComplete && (
                <p className="text-black/80 mt-1">
                  {isLoggedIn
                    ? "Enter your verification code to reset your password"
                    : "Enter your email to receive a password reset code"}
                </p>
              )}
              {emailSent && !tokenVerified && !resetComplete && (
                <p className="text-black/80 mt-1 font-medium">
                  We've sent a verification code to{" "}
                  <span className="text-blue-base">{email}</span>
                </p>
              )}
              {tokenVerified && !resetComplete && (
                <p className="text-black/80 mt-1">
                  Code verified! Now set your new password.
                </p>
              )}
              {resetComplete && (
                <p className="text-black/80 mt-1">
                  Your password has been reset successfully. Redirecting to
                  login...
                </p>
              )}
            </div>

            {/* Step 1: Email Input */}
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
                          disabled={isLoggedIn}
                          required
                          className={`w-full shadow-sm min-h-[44px] border ${
                            isLoggedIn
                              ? "bg-[#C0CED4] border-[#737c7f]"
                              : "bg-light-10 border-gray-300"
                          } rounded-md h-12 text-black placeholder:text-gray-300`}
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
            ) : /* Step 2: Token Verification */
            emailSent && !tokenVerified && !resetComplete ? (
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

                <form onSubmit={verifyToken} className="space-y-6">
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
                          Verify Code
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
                    onClick={changeEmail}
                    className="h-12 bg-white/40 hover:bg-white/60 text-black font-medium rounded-md transition-colors"
                  >
                    Change email
                  </button>
                </div>
              </div>
            ) : /* Step 3: Password Reset */
            tokenVerified && !resetComplete ? (
              <div className="text-center flex-1 flex flex-col">
                <form onSubmit={resetPassword} className="space-y-6">
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
                  {newPassword !== confirmPassword && (
                    <span className="text-[#FF383C] text-[12px] mb-2 ml-2">
                      Password doesn't match
                    </span>
                  )}
                  <div className="mb-6 bg-[#FAFDFF] border border-[#C0CED4] rounded-[4px] p-[8px]">
                    <div className="flex flex-row flex-wrap">
                      {validatedConditions.map((condition, index) => (
                        <div key={condition.id} className="w-1/2">
                          <div className="flex flex-row items-center">
                            <Image
                              alt=""
                              width={16}
                              height={16}
                              src={
                                condition.isValid
                                  ? "/auth/checkmark-circle.png"
                                  : (newPassword.length > 0 ||
                                      confirmPassword.length > 0) &&
                                    !condition.isValid
                                  ? "/auth/close-circle.png"
                                  : "/auth/dot-circle.png"
                              }
                              className="w-[16px] h-[16px]"
                            />
                            <span
                              className={`ml-2 flex-1 font-normal text-[12px] ${
                                condition.isValid
                                  ? "text-[#34C759]"
                                  : (newPassword.length > 0 ||
                                      confirmPassword.length > 0) &&
                                    !condition.isValid
                                  ? "text-[#FF383C]"
                                  : "text-[#2E3133]"
                              }`}
                            >
                              {condition.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`w-full h-12  ${
                      !canContinue ? `bg-light-60 text-light-80` : `bg-blue-600 hover:bg-blue-700 text-white`
                    } font-medium rounded-full flex items-center justify-center gap-2 transition-colors`}
                    disabled={
                      isResettingPassword || !newPassword || !confirmPassword || !canContinue
                    }
                  >
                    {isResettingPassword ? (
                      "Resetting Password..."
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6">
                  <button
                    onClick={() => setTokenVerified(false)}
                    className="h-12 bg-white/40 hover:bg-white/60 text-black font-medium rounded-md transition-colors w-full"
                  >
                    Back to verification
                  </button>
                </div>
              </div>
            ) : /* Step 4: Success */
            resetComplete ? (
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
            ) : null}

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
