"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Cat, Icon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const { sessionId } = useAuth();

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
      console.log("Setting username:", username);

      // Call the API to set the username
      const result = await ChessApiService.setUsername(username, sessionId);
      console.log("API response:", result);

      // Update the Zustand store
      setStoreUsername(username);

      // Call the success callback
      onSuccess(username);

      // Show success message
      toast.success(`Successfully connected to Chess.com as ${username}`);
    } catch (error: any) {
      console.error("Chess.com connection error:", error);

      // If the error contains "already exists" it likely means this username is already set
      // for this user, which we can treat as a success.
      if (error.message && error.message.includes("already exists")) {
        console.log("Username already exists in database, treating as success");

        // Update the Zustand store
        setStoreUsername(username);

        // Call the success callback
        onSuccess(username);

        toast.success(`Connected to Chess.com as ${username}`);
      } else {
        // For other errors, show the error message
        const errorMsg =
          error.message || "Failed to connect to Chess.com. Please try again.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[358px] mx-auto rounded-md p-4 overflow-hidden [&>button]:hidden md:w-[640px] xl:w-[600px] h-auto">
        {/* Top section - Image */}
        <div className="w-full  flex items-center justify-center p-4">
          <div className="w-full h-48 relative">
            <Image
              src="/icons/onboarding-popup.png"
              alt="Chess.com Connection"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Bottom section - Form */}
        <div className="w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Welcome on Board!
            </DialogTitle>
            <DialogDescription className="text-center text-black">
              Enter your Chess.com Username and find your previously played
              Games right away.
            </DialogDescription>
            <div className=" text-blue-base text-xs border border-blue-base bg-blue-base/5 flex gap-x-2 items-center p-2 rounded-md">
              <AlertCircle className="w-10 h-10" />
              <div>
                Enter the Chess.com Username that you would like to connect to
                your AroundChess Account (Once you save it, it cannot be
                changed)
              </div>
            </div>
          </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};
