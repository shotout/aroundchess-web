"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SiteFooterNew } from "@/components/site-footer-new";
import { SiteHeaderNew } from "@/components/site-header-new";
import DotSpinner from "@/components/game-history/Spinner";
import { usechangePassword } from "@/app/store/changePassword";
import {
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from "@/components/v2/change-password-flow";

const BASE_URL = process.env.BASE_URL;

/** mm:ss for the resend countdown. */
const formatCountdown = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * Step 2 of the change-password flow: confirm the code emailed by
 * /auth/reset-password. On success it stores the verified token and returns to
 * /profile, where the "Change your Password" modal takes over.
 */
export default function ChangePasswordVerifyPage() {
  const router = useRouter();
  const { email, setOpen, setStep, setToken, reset } = usechangePassword();

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [busy, setBusy] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;

  // Reached without going through step 1 (e.g. a hard reload cleared the
  // store) — there's no address to verify against, so start over.
  useEffect(() => {
    if (!email) {
      router.replace("/profile");
      setOpen(true);
      setStep("email");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      setDigitAt(index, "");
      return;
    }
    // Pasting the whole code into one box spreads it across the rest.
    if (cleaned.length > 1) {
      setDigits((prev) => {
        const next = [...prev];
        cleaned
          .slice(0, OTP_LENGTH - index)
          .split("")
          .forEach((char, offset) => {
            next[index + offset] = char;
          });
        return next;
      });
      const landing = Math.min(index + cleaned.length, OTP_LENGTH - 1);
      inputsRef.current[landing]?.focus();
      return;
    }
    setDigitAt(index, cleaned);
    if (index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      setDigitAt(index - 1, "");
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      inputsRef.current[index + 1]?.focus();
  };

  const handleSubmit = async () => {
    if (!isComplete || busy) return;
    setBusy(true);
    try {
      const response = await fetch(
        `${BASE_URL}/auth/verify-token-reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: code }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid verification code");
      }

      setToken(code);
      setStep("password");
      setOpen(true);
      router.push("/profile");
    } catch (err: any) {
      toast.error(err.message || "Invalid verification code");
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || busy) return;
    setBusy(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }
      toast.success("Reset code resent to your email!");
      setDigits(Array(OTP_LENGTH).fill(""));
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setBusy(false);
    }
  };

  /** Back to step 1 so a different address can be used. */
  const handleChangeEmail = () => {
    setStep("email");
    setOpen(true);
    router.push("/profile");
  };

  /** Abandon the flow entirely. */
  const handleBack = () => {
    reset();
    router.push("/profile");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Mobile gets the full-bleed cyan artwork; sm+ keeps the auth backdrop. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/v2/profile/Verify Email Background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:hidden"
          aria-hidden="true"
        />
        <Image
          src="/images/auth-background.png"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="hidden sm:block object-cover object-top"
          aria-hidden="true"
        />
      </div>

      <div className="hidden sm:block">
        <SiteHeaderNew />
      </div>

      {/* Mobile header: back arrow + white wordmark, per the mockup. */}
      <div className="sm:hidden flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="shrink-0 w-[40px] h-[40px] rounded-[10px] border border-white/70 bg-white/15 flex items-center justify-center text-white"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <div className="flex-1 flex justify-center pr-[40px]">
          <Image
            src="/images/v2/profile/Logo AroundChess - White 1.png"
            alt="AroundChess"
            width={320}
            height={80}
            className="h-[38px] w-auto object-contain"
            priority
          />
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="relative w-full max-w-[640px] sm:bg-white/80 sm:backdrop-blur-sm sm:rounded-[20px] sm:shadow-xl px-2 py-4 sm:px-10 sm:py-10">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="hidden sm:flex absolute left-6 top-6 text-[#111827]"
          >
            <ArrowLeft size={26} strokeWidth={2.5} />
          </button>

          <div className="flex flex-col items-center">
            <Image
              src="/images/v2/profile/asset-icon-_email sent 1.png"
              alt=""
              width={420}
              height={330}
              className="w-[190px] sm:w-[180px] h-auto object-contain"
              aria-hidden="true"
            />

            <h1 className="mt-[10px] text-[26px] sm:text-[28px] font-bold text-[#111827] text-center">
              Email Verification
            </h1>
            <p className="mt-[8px] text-[16px] sm:text-[15px] text-center text-[#111827] leading-[145%]">
              We have sent a Code to the following Inbox to verify your Email
              Address:
              <br />
              <span className="font-bold text-[#221AE9] break-all">{email}</span>
              <br />
              Please Check your Inbox and Spam Folder.
            </p>

            <div className="mt-[18px] flex w-full items-center justify-center gap-[8px] sm:gap-[10px]">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-label={`Digit ${index + 1}`}
                  disabled={busy}
                  className="w-full max-w-[56px] aspect-square rounded-[12px] border border-[#BFE7F5] bg-[#E8F8FD] text-center text-[22px] font-semibold text-[#111827] outline-none focus:border-[#221AE9] focus:bg-white"
                />
              ))}
            </div>

            <div className="mt-[14px] grid w-full grid-cols-2 gap-[10px]">
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || busy}
                className="h-[48px] rounded-full bg-[#C9C9C9] text-[15px] font-medium text-[#4B5563] disabled:cursor-not-allowed enabled:bg-[#81CFF3] enabled:text-[#111827]"
              >
                {secondsLeft > 0 ? (
                  <>
                    Resend code in:{" "}
                    <span className="font-bold">
                      {formatCountdown(secondsLeft)}
                    </span>
                  </>
                ) : (
                  "Resend code"
                )}
              </button>
              <button
                type="button"
                onClick={handleChangeEmail}
                disabled={busy}
                className="h-[48px] rounded-full bg-[#81CFF3] text-[15px] font-bold text-[#221AE9]"
              >
                Change Email
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isComplete || busy}
              className="btn-primary mt-[12px] w-full h-[52px] rounded-full text-[16px] font-semibold text-white disabled:opacity-60"
            >
              {busy ? <DotSpinner size={8} /> : "Submit"}
            </button>
          </div>
        </div>
      </main>

      <div className="hidden sm:block">
        <SiteFooterNew />
      </div>
    </div>
  );
}
