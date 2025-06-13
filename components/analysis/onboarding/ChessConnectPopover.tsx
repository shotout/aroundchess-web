"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Info, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { usePgnStore } from "@/app/store/zustandStore";
import { ChessApiService } from "./store/APIService";
import { useProfileStore } from "@/app/store/profile";

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
  const [gameType, setGameType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  const { sessionId } = useProfileStore();

  const { setUsername: setStoreUsername } = usePgnStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(document.documentElement);
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleSave = async () => {
    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Please enter a valid Chess.com username");
      toast.error("Please enter a valid Chess.com username");
      return;
    }

    if (!gameType) {
      setErrorMessage("Please select a game type");
      toast.error("Please select a game type");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSave();
    }
  };

  if (!open) return null;

  const isDesktop = windowDimensions.width >= 1280;
  const sidebarWidth = isDesktop ? windowDimensions.width / 6 : 0;
  const headerHeight = 72;
  const headerHeightLg = 96;

  const topOffset =
    windowDimensions.width >= 1024 ? headerHeightLg : headerHeight;
  const availableHeight = windowDimensions.height - topOffset - 32;

  return (
    <div
      className="fixed bg-black/50 z-50 flex items-center justify-center p-4"
      style={{
        top: topOffset,
        left: sidebarWidth,
        right: 0,
        bottom: 0,
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full mx-auto rounded-md  bg-white overflow-hidden md:w-[640px] xl:w-[600px] flex flex-col relative"
        style={{
          maxHeight: Math.min(availableHeight, windowDimensions.height * 0.9),
          height: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 p-1 border-gray-200 border rounded-full bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 transition-colors z-20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 overflow-y-auto">
          <div className="w-full flex items-center justify-center p-2 2xl:p-4">
            <div className="w-full relative h-24 sm:h-32 md:h-40">
              <Image
                src="/icons/onboarding-popup.png"
                alt="Chess.com Connection"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="w-full p-4 md:p-6">
            <div className="flex flex-col gap-y-1">
              <h2 className="text-2xl font-bold text-center">
                Welcome on Board!
              </h2>
              <p className="text-center text-xs md:text-base text-black">
                Enter your Chess.com Username and find your previously played
                Games right away.
              </p>
              <div className="text-blue-base border border-blue-base bg-blue-base/5 flex gap-x-2 items-center p-2 rounded-md">
                <AlertCircle className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
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

              <div className="flex items-center gap-x-2">
                <p className="text-sm text-left text-gray-700">Game Type</p>
              </div>

              <Select
                value={gameType}
                onValueChange={setGameType}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full h-12 px-4 rounded-lg border-light-60 bg-[#F2FBFE]">
                  <SelectValue placeholder="Select your Game Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rapid">Rapid</SelectItem>
                  <SelectItem value="blitz">Blitz</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-x-2 text-blue-base">
                <Info className="w-4 h-4 flex-shrink-0 text-blue-base" />
                <p className="text-xs">
                  You can still change the Game type later in the Profile
                  Settings
                </p>
              </div>

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
    </div>
  );
};
