"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { usePgnStore } from "@/app/store/zustandStore";
import { ChessApiService } from "./store/APIService";

export interface ChessConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (username: string) => void;
}

export const ChessConnectDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: ChessConnectDialogProps) => {
  const [username, setUsername] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const sessionId = localStorage.getItem("token");

  const { setUsername: setStoreUsername } = usePgnStore();

  const handleSave = async () => {
    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Please enter a valid Chess.com username");
      toast.error("Please enter a valid Chess.com username");
      return;
    }

    if (!sessionId) {
      setErrorMessage(
        "You must be logged in to connect your Chess.com account"
      );
      toast.error("Authentication error. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await ChessApiService.setUsername(username, sessionId);

      setStoreUsername(username);

      if (result.usernameAlreadyExists) {
        toast.success(`Connected to Chess.com as ${username}`);
        toast.info(`Username ${username} is already exist`);
      } else {
        toast.success(`Successfully connected to Chess.com as ${username}`);
      }

      onSuccess(username);
    } catch (error: any) {
      const errorMsg =
        error.message || "Failed to connect to Chess.com. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSave();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 md:p-0"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full mx-auto rounded-md p-4 bg-white overflow-hidden md:w-[640px] xl:w-[600px] h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-center p-4">
          <div className="w-full h-48 relative">
            <Image
              src="/icons/onboarding-popup.png"
              alt="Chess.com Connection"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="w-full p-4 md:p-6">
          <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold text-center">
              Welcome on Board!
            </h2>
            <p className="text-center text-xs md:text-base text-black">
              Enter your Chess.com Username and find your previously played
              Games right away.
            </p>
            <div className="text-blue-base border border-blue-base bg-blue-base/5 flex gap-x-2 items-center p-2 rounded-md">
              <AlertCircle className="w-10 h-10" />
              <h1 className="text-[10px] md:text-xs">
                Enter the Chess.com Username that you would like to connect to
                your AroundChess Account (Once you save it, it cannot be
                changed)
              </h1>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-x-2">
              <Image
                src={"/my-game-history/knight.png"}
                width={18}
                height={18}
                alt="knight icon"
              />
              <p className="text-sm text-left text-gray-700">
                Chess.com Username
              </p>
            </div>

            <Input
              placeholder="Enter your Chess.com Username"
              className="w-full h-12 px-4 rounded-lg border-light-60 bg-[#F2FBFE]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
            />

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <button
              className="w-full h-12 btn-primary text-white font-medium rounded-full"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connecting..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
