import React, { useState } from "react";
import { Info, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { useApiClient } from "@/functions/api-client";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import CacheUtil from "@/app/training-plan/api/cacheUtils";

const APPLE_SUBSCRIPTIONS_URL = "https://apps.apple.com/account/subscriptions/";

const PERMANENCE_NOTE = (
  <>
    Please note that account deletion is{" "}
    <strong>permanent and cannot be undone</strong>. Once your account is
    deleted, all of your data, activity history, preferences, and Tokens cannot
    be recovered. Please make sure you are absolutely certain before proceeding.
  </>
);

const DeleteAccount = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logOut } = useApiClient();
  const {
    clearAll: clearProfile,
    sessionId,
    isMember,
    isMemberMonthly,
  } = useProfileStore();
  const { clearAll } = usePgnStore();

  const isSubscriber = Boolean(isMember || isMemberMonthly);

  const baseUrl = process.env.BASE_URL;

  const handleSignOut = async () => {
    try {
      await logOut({ sessionId });
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      clearAll();
      CacheUtil.clearAll();

      localStorage.removeItem("sessionId");
      localStorage.removeItem("token");
      localStorage.removeItem("background-analysis-storage");
      localStorage.removeItem("pgn-local-storage");
      setPersistedCookie("token", "", 365);
    }
  };

  const handleLogout = async () => {
    clearAll();
    clearProfile();
    await handleSignOut();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          reason: "User requested account deletion",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.status}`);
      }

      await handleLogout();
      setIsOpen(false);
      router.replace("/delete-account");
    } catch (err) {
      console.error("Error deleting account:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete account. Please try again.";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1"></div>

      <div className="flex flex-col md:flex-row border border-blue-500 bg-blue-50 bg-opacity-8 rounded-[12px] p-3 md:px-4 items-center gap-3">
        <div className="flex items-center gap-x-2 flex-1">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <h1 className="text-[13px] text-gray-700">{PERMANENCE_NOTE}</h1>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="rounded-full border border-[#C01B1B] bg-white px-12 py-2 hover:bg-red-50 transition-colors w-full md:w-auto flex-shrink-0">
              <h1 className="text-[#C01B1B] font-medium whitespace-nowrap">
                Delete Account
              </h1>
            </button>
          </DialogTrigger>

          <DialogContent className="w-[92%] max-w-[560px] max-h-[95%] rounded-[24px] sm:rounded-[16px] overflow-y-auto">
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src={"/images/delete-knight.png"}
                  alt=""
                  width={100}
                  height={100}
                />
              </div>

              <DialogTitle className="text-xl font-semibold text-gray-900">
                Are you sure you want to delete your account?
              </DialogTitle>

              <DialogDescription className="text-gray-600 mt-2">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="flex border border-blue-500 bg-blue-50 rounded-[8px] px-3 py-3 items-center gap-x-2 my-4">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="flex flex-col gap-2">
                {isSubscriber && (
                  <p className="text-[13px] font-bold text-gray-800">
                    You have an active auto-renewable subscription. We suggest
                    you to cancel your subscription on{" "}
                    <a
                      href={APPLE_SUBSCRIPTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 break-all"
                    >
                      {APPLE_SUBSCRIPTIONS_URL}
                    </a>{" "}
                    before proceeding with the account deletion.
                  </p>
                )}
                <p className="text-[13px] text-gray-700">{PERMANENCE_NOTE}</p>
              </div>
            </div>

            {error && (
              <div className="flex border border-red-500 bg-red-50 rounded-md p-3 items-center gap-x-2 my-4">
                <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-[14px] --xs text-red-700">{error}</p>
              </div>
            )}

            <DialogFooter className="flex flex-row gap-3 sm:gap-3 sm:space-x-0">
              <button
                className="flex-1 border border-red-600 text-red-600 bg-white hover:bg-red-50 px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting Account..." : "Delete Account"}
              </button>
              <button
                className="flex-1 bg-red-600 text-white hover:bg-red-700 border-red-600 px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteAccount;
