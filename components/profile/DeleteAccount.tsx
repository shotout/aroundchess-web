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

const DeleteAccount = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logOut } = useApiClient();
  const { clearAll: clearProfile, sessionId } = useProfileStore();
  const { clearAll } = usePgnStore();

  const baseUrl = process.env.BASE_URL;

  const handleSignOut = async () => {
    try {
      await logOut({ sessionId });
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      clearAll();

      localStorage.removeItem("sessionId");
      localStorage.removeItem("token");
      localStorage.removeItem("background-analysis-storage");
      localStorage.removeItem("training_schedule");
      localStorage.removeItem("training_topics");
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

      // Call handleLogout after successful account deletion
      await handleLogout();

      // Then navigate to the delete-account page
      router.push("/delete-account");
      setIsOpen(false);
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

      {/* Info box with fixed background opacity */}
      <div className="flex border border-blue-500 bg-blue-50 bg-opacity-8 rounded-md p-3 items-center gap-x-2">
        <Info className="w-5 h-5 text-blue-500" />
        <h1 className="text-[13px] text-gray-700">
          Please note that account deletion is permanent and cannot be undone.
          Once your account is deleted, all of your data, activity history,
          preferences, and Tokens cannot be recovered. Please make sure you are
          absolutely certain before proceeding.
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="rounded-full border border-[#C01B1B] px-16 py-2 hover:bg-red-50 transition-colors">
              <h1 className="text-[#C01B1B] font-medium">Delete Account</h1>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader className="text-center">
              {/* Chess knight icon with red X */}
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

            {/* Warning info box inside modal */}
            <div className="flex border border-blue-500 bg-blue-50 rounded-md p-3 items-center gap-x-2 my-4">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700">
                Please note that account deletion is{" "}
                <strong>permanent and cannot be undone</strong>. Once your
                account is deleted, all of your data, activity history,
                preferences, and Tokens cannot be recovered. Please make sure
                you are absolutely certain before proceeding.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex border border-red-500 bg-red-50 rounded-md p-3 items-center gap-x-2 my-4">
                <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <DialogFooter className="flex gap-3 sm:gap-3">
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
