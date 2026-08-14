"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { usechangePassword } from "@/app/store/changePassword";
import { useProfileStore } from "@/app/store/profile";
import { useApiClient } from "@/functions/api-client";
import { supabase } from "@/lib/supabase";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import CacheUtil from "@/app/training-plan/api/cacheUtils";
import DotSpinner from "../game-history/Spinner";
import {
  PASSWORD_CONDITIONS,
  VERIFY_ROUTE,
} from "@/components/v2/change-password-flow";

const BASE_URL = process.env.BASE_URL;

const FIELD_CLASS =
  "w-full h-[56px] rounded-[12px] bg-[#F7FCFF] border border-[#DCE9F0] pl-[48px] pr-[48px] text-[15px] placeholder:text-[#9CA3AF] focus-visible:ring-0 focus-visible:border-[#221AE9]";

/** Every key the old session leaves behind in localStorage. */
const AUTH_STORAGE_KEYS = [
  "sessionId",
  "token",
  "access_token",
  "refresh_token",
  "Profile-storage",
  "background-analysis-storage",
  "pgn-local-storage",
];

/** How long the modal will hold its spinner waiting on session revocation. */
const REVOKE_TIMEOUT_MS = 8000;

/**
 * Wait for a best-effort call to settle, but never longer than `ms`. Failures
 * resolve like successes: the local teardown is what actually ends the session,
 * so nothing here is worth blocking the user on — and a hung endpoint must not
 * leave the modal spinning forever with no way forward.
 */
const settleWithin = (run: () => Promise<unknown>, ms: number) =>
  Promise.race([
    Promise.resolve()
      .then(run)
      .catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);

/** Icon inside the field on the left, optional action on the right. */
const IconField = ({
  icon,
  action,
  children,
}: {
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="relative w-full">
    <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
      {icon}
    </span>
    {children}
    {action && (
      <span className="absolute right-[16px] top-1/2 -translate-y-1/2">
        {action}
      </span>
    )}
  </div>
);

export function ChangePassword() {
  const router = useRouter();
  const { open, setOpen, step, setStep, email, setEmail, token, reset } =
    usechangePassword();
  const { profile, sessionId } = useProfileStore();
  const { logOut } = useApiClient();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  // Prefill with the signed-in address — the code has to go to the account's
  // own inbox anyway.
  useEffect(() => {
    if (open && step === "email" && !email && profile?.email) {
      setEmail(profile.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step, profile?.email]);

  // Step 3 starts from empty fields each time it opens.
  useEffect(() => {
    if (step === "password") {
      setNewPassword("");
      setConfirmPassword("");
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [step]);

  const conditions = PASSWORD_CONDITIONS.map((c) => ({
    ...c,
    isValid: c.validator(newPassword),
  }));
  const allConditionsMet = conditions.every((c) => c.isValid);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";
  const canSave = allConditionsMet && passwordsMatch && !busy;

  /** Step 1 -> send the reset code, then hand over to the verification page. */
  const handleSendEmail = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const address = email.trim();
    if (!address) {
      toast.error("Please enter your Email Address");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setEmail(address);
      toast.success("Reset code sent to your email!");
      setOpen(false);
      router.push(VERIFY_ROUTE);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email");
    } finally {
      setBusy(false);
    }
  };

  /**
   * Revoke the old session, drop every trace of it, then go to /login. The
   * password it was issued against no longer exists, so nothing here is worth
   * keeping. Awaited rather than fire-and-forget so the modal can hold its
   * spinner until revocation is really done — a redirect fired in the same tick
   * would abort these requests on unload and leave the tokens live server-side.
   */
  const signOutToLogin = async () => {
    // In parallel, and capped: the user is staring at a spinner for this.
    await Promise.all([
      settleWithin(() => logOut({ sessionId }), REVOKE_TIMEOUT_MS),
      settleWithin(() => supabase.auth.signOut(), REVOKE_TIMEOUT_MS),
    ]);

    try {
      // Persisted state only — deliberately no clearAll() on the Zustand
      // stores. Emptying those re-renders the page behind the modal into its
      // signed-out shape for the moment before the document navigates, which
      // is the flicker. A full page load rebuilds them from scratch anyway, so
      // wiping what they persist is what actually matters.
      setPersistedCookie("token", "", 0);
      // Training-plan data is cached per account in localStorage; leaving it
      // behind serves this user's progress to whoever logs in next.
      CacheUtil.clearAll();
      // "Profile-storage" is the persisted profile store — access token,
      // refresh token and expiry all live in it, so removing the key takes the
      // whole session with it. The app's Log Out button clears only sessionId
      // and token, which is how a live refresh token could outlive the
      // password it was issued under.
      AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } finally {
      // Always reached: a storage failure must not leave the user parked on
      // /profile with credentials that no longer work. `replace`, not `href`,
      // so Back can't return to the signed-in page, and a full document load
      // rather than router.push so no in-memory store survives the trip.
      window.location.replace("/login");
    }
  };

  /** Step 3 -> set the new password using the token the verify page confirmed. */
  const handleSavePassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!canSave) return;

    setBusy(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/set-new-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save your new Password");
      }

      toast.success("Password changed successfully! Please log in again.");
      // The modal stays open and `busy` stays set for the whole revoke, so Save
      // holds its spinner and can't be pressed again. No reset() either — the
      // navigation tears the modal down, whereas closing it first would flash
      // the profile page still showing the old session's data.
      await signOutToLogin();
    } catch (err: any) {
      toast.error(err.message || "Failed to save your new Password");
      setBusy(false);
    }
  };

  const isPasswordStep = step === "password";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Closing abandons the flow, so don't leave a half-finished step behind.
        if (!next) reset();
        else setOpen(true);
      }}
    >
      {/* Explicit radius at both breakpoints — the dialog base ships
          `sm:rounded-lg`, which would otherwise win from sm up. */}
      <DialogContent className="w-[92%] max-w-[440px] sm:max-w-[520px] max-h-[95%] rounded-[24px] sm:rounded-[16px] bg-white p-0 md:p-0 gap-0 overflow-y-auto">
        <div className="flex flex-col items-center px-[20px] pt-[28px] pb-[24px] sm:px-[40px] sm:pt-[32px] sm:pb-[32px]">
          <Image
            src="/images/v2/profile/sparks.png"
            alt=""
            width={220}
            height={160}
            className="w-[108px] sm:w-[96px] h-auto object-contain"
            aria-hidden="true"
          />

          <DialogHeader className="mt-[12px] flex flex-col items-center gap-[6px] space-y-0 z-20">
            <DialogTitle className="text-[24px] sm:text-[22px] font-bold text-center text-[#111827] leading-[130%]">
              {isPasswordStep ? "Change your Password" : "Change Password"}
            </DialogTitle>
            <DialogDescription
              className={`text-[15px] font-normal text-center text-[#2E2E2E] leading-[140%] ${
                isPasswordStep ? "sr-only" : ""
              }`}
            >
              {isPasswordStep
                ? "Choose a new Password for your Account."
                : "Enter your Email Address and get an OTP to reset your Password."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-[20px] flex w-full flex-col gap-[16px]">
            {!isPasswordStep && (
              <>
                <IconField icon={<Mail size={20} />}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your Email Address"
                    className={FIELD_CLASS}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // The OTP can only go to the account's own inbox, so the
                    // prefilled address isn't editable. It stays editable only
                    // in the edge case where the profile has no email yet.
                    disabled={busy || !!profile?.email}
                  />
                </IconField>
                <button
                  onClick={handleSendEmail}
                  disabled={busy}
                  className="btn-primary w-full h-[56px] rounded-full text-[16px] font-semibold text-white disabled:opacity-70"
                >
                  {busy ? <DotSpinner size={8} /> : "Send Email"}
                </button>
              </>
            )}

            {isPasswordStep && (
              <>
                <IconField
                  icon={<Lock size={20} />}
                  action={
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="text-[#221AE9]"
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                >
                  <Input
                    id="new-password"
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter your new Password"
                    className={FIELD_CLASS}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={busy}
                  />
                </IconField>

                <IconField
                  icon={<Lock size={20} />}
                  action={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="text-[#221AE9]"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                >
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your new Password"
                    className={FIELD_CLASS}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={busy}
                  />
                </IconField>

                <ul className="rounded-[12px] border border-[#DCE9F0] bg-[#F7FCFF] px-[14px] py-[12px] flex flex-col gap-[7px]">
                  {conditions.map((c) => (
                    <li key={c.id} className="flex items-center gap-[8px]">
                      <Image
                        src="/images/v2/profile/check 1.png"
                        alt=""
                        width={16}
                        height={16}
                        className={`w-[14px] h-[14px] object-contain shrink-0 ${
                          c.isValid ? "opacity-100" : "opacity-30 grayscale"
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[13px] leading-[130%] ${
                          c.isValid ? "text-[#16A34A]" : "text-[#9CA3AF]"
                        }`}
                      >
                        {c.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {confirmPassword !== "" && !passwordsMatch && (
                  <p className="text-[13px] text-red-500">
                    Passwords do not match.
                  </p>
                )}

                {/* Label stays put while saving — the spinner sits beside it
                    so the button keeps its identity instead of blanking out. */}
                <button
                  onClick={handleSavePassword}
                  disabled={!canSave}
                  className="btn-primary w-full h-[56px] rounded-full text-[16px] font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-[8px]"
                >
                  {busy && (
                    <Loader2 className="w-[18px] h-[18px] animate-spin" aria-hidden="true" />
                  )}
                  Save Password
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
