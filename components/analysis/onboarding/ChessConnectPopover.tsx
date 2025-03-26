"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cat } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthStore } from "./store/AuthStore";
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

  const { sessionId } = useAuthStore();

  const { setIsChessConnected, setChessComUsername } = usePgnStore();

  const handleSave = async () => {
    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Please enter a valid Chess.com username");
      toast.error("Please enter a valid Chess.com username");
      return;
    }

    if (!sessionId) {
      setErrorMessage("Authentication required. Please sign in again.");
      toast.error("Authentication required. Please sign in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Connecting with username:", username);
      console.log("Using session ID:", sessionId);

      await ChessApiService.setUsername(username, sessionId);

      setChessComUsername(username);
      setIsChessConnected(true);

      onSuccess(username);
    } catch (error: any) {
      console.error("Chess.com connection error:", error);
      const errorMsg =
        error.message || "Failed to connect to Chess.com. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[358px] mx-auto rounded-md p-0 overflow-hidden [&>button]:hidden md:w-[640px] xl:w-[600px] xl:h-[613px]">
        {/* Top section - Image */}
        <div className="w-full bg-blue-50 flex items-center justify-center p-6">
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
            <DialogDescription className="text-center">
              Enter your Chess.com Username and find your previously played
              Games right away.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1 rounded-md">
                <Cat className="text-blue-base" />
              </div>
              <p className="text-sm text-left text-gray-700">
                Enter the Chess.com Username that you would like to connect
              </p>
            </div>

            <Input
              placeholder="Enter your Chess.com Username"
              className="w-full h-12 px-4 rounded-lg border-gray-200 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <Button
              className="w-full h-12 btn-primary text-white font-medium rounded-full"
              onClick={handleSave}
              disabled={isSubmitting || !sessionId}
            >
              {isSubmitting ? "Connecting..." : "Save"}
            </Button>

            {!sessionId && (
              <p className="text-sm text-red-500 text-center">
                Session not found. Please sign in again.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
