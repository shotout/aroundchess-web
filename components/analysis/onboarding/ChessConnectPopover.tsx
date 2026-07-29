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
import { AlertCircle, Info, X, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { usePgnStore } from "@/app/store/zustandStore";
import { ChessApiService } from "./store/APIService";
import { useProfileStore } from "@/app/store/profile";
import { usePlayerStatsStore } from "./store/usePlayerStatsStore";
import { trackCustomEvent } from "@/app/utils/facebookPixel";

export interface ChessConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (username: string) => void;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ChessConnectDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: ChessConnectDialogProps) => {
  const [username, setUsername] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  const { sessionId } = useProfileStore();
  const { setUsername: setStoreUsername } = usePgnStore();

  const {
    username: storeUsername,
    gameTypesData,
    selectedGameType,
    isValidatingUsername,
    usernameFound,
    setPlayerData,
    setSelectedGameType,
    setIsValidatingUsername,
    setUsernameFound,
    clearPlayerStats,
    getSelectedGameData,
  } = usePlayerStatsStore();

  const debouncedUsername = useDebounce(username.trim(), 800);

  useEffect(() => {
    const checkPlayerStats = async () => {
      if (!debouncedUsername || debouncedUsername.length < 3 || !sessionId) {
        clearPlayerStats();
        return;
      }

      setIsValidatingUsername(true);
      setErrorMessage("");

      try {
        const response = await ChessApiService.checkPlayerStats(
          debouncedUsername,
          sessionId
        );

        if (response.success && response.data && Array.isArray(response.data)) {
          setPlayerData(debouncedUsername, response.data);
          setUsernameFound(true);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error: any) {
        clearPlayerStats();
        setUsernameFound(false);
      } finally {
        setIsValidatingUsername(false);
      }
    };

    checkPlayerStats();
  }, [
    debouncedUsername,
    sessionId,
    setPlayerData,
    setIsValidatingUsername,
    setUsernameFound,
    clearPlayerStats,
  ]);

  useEffect(() => {
    if (!open) {
      setUsername("");
      setErrorMessage("");
      clearPlayerStats();
    }
  }, [open, clearPlayerStats]);

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

    if (!storeUsername || !usernameFound) {
      setErrorMessage("Please enter a valid Chess.com username that exists");
      toast.error("Username not found. Please check and try again.");
      return;
    }

    if (!selectedGameType) {
      setErrorMessage("Please select a game type");
      toast.error("Please select a game type");
      return;
    }

    const selectedGameData = getSelectedGameData();
    if (!selectedGameData) {
      setErrorMessage("Invalid game type selected");
      toast.error("Invalid game type selected");
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

    trackCustomEvent("Saved Username", {
      username: storeUsername,
    });

    try {
      const result = await ChessApiService.setUsername(
        storeUsername,
        selectedGameData.game_type,
        selectedGameData.elo,
        sessionId
      );

      setStoreUsername(storeUsername);

      if (result.usernameAlreadyExists) {
        toast.success(`Connected to Chess.com as ${storeUsername}`);
        toast.info(`Username ${storeUsername} already exists`);
      } else {
        toast.success(
          `Successfully connected to Chess.com as ${storeUsername}`
        );
      }

      onSuccess(storeUsername);
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
    if (
      e.key === "Enter" &&
      !isSubmitting &&
      storeUsername &&
      selectedGameType
    ) {
      handleSave();
    }
  };

  const handleGameTypeChange = (gameType: string) => {
    setSelectedGameType(gameType);
  };

  if (!open) return null;

  const isDesktop = windowDimensions.width >= 1280;
  const sidebarWidth = isDesktop ? windowDimensions.width / 6 : 0;
  const headerHeight = 72;
  const headerHeightLg = 96;

  const topOffset =
    windowDimensions.width >= 1024 ? headerHeightLg : headerHeight;
  const availableHeight = windowDimensions.height - topOffset - 32;

  const getInputRightIcon = () => {
    if (!username.trim() || username.trim().length < 3) return null;

    if (isValidatingUsername) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }

    if (usernameFound && gameTypesData.length > 0) {
      return (
        <div className="flex items-center gap-x-2 text-[#186027]">
          <CheckCircle2 className="w-4 h-4 text-white" fill="#186027" />
          <h1>Username found</h1>
        </div>
      );
    }

    if (debouncedUsername && !usernameFound) {
      return (
        <div className="flex items-center gap-x-2 text-red-500">
          <AlertCircle className="w-4 h-4 text-white" fill="#ef4444" />
          <h1>Username Not Found</h1>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed bg-black/50 z-[10] flex items-center justify-center p-4 top-0 left-0 right-0 bottom-0"
      style={{
        top: topOffset,
        left: sidebarWidth,
        right: 0,
        bottom: 0,
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full mx-auto rounded-md bg-white overflow-hidden md:w-[640px] xl:w-[600px] flex flex-col relative"
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
              <h2 className="text-[18px] md:text-2xl font-bold text-center">
                Connect your Chess.com Account
              </h2>
              <p className="text-center text-[14px] --xs md:text-base text-black">
                Enter your Chess.com Username to analyze your Chess.com Games on
                AroundChess. Understand your Mistakes easily!
              </p>
              <div className="mt-2 text-blue-base border border-blue-base bg-blue-base/5 flex gap-x-2 items-center px-2 py-[6px] rounded-md">
                <Info className="w-4 h-4 flex-shrink-0" />
                <p className="min-w-0 text-[12px] md:text-[14px] leading-snug">
                  Once saved, this cannot be changed
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {/* Field labels are dropped on mobile (mockup) — the placeholders
                  already say what each field is. */}
              <div className="hidden sm:flex items-center gap-x-2">
                <Image
                  src={"/my-game-history/knight.png"}
                  width={18}
                  height={18}
                  alt="knight icon"
                />
                <p className="text-[14px] text-left text-gray-700">
                  Chess.com Username
                </p>
              </div>

              <div className="relative">
                <Input
                  placeholder="Enter your Chess.com Username"
                  className="w-full h-12 px-4 pr-10 rounded-lg border-light-60 bg-[#F2FBFE]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getInputRightIcon()}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-x-2">
                <p className="text-[14px] text-left text-gray-700">Game Type</p>
              </div>

              <Select
                value={selectedGameType || ""}
                onValueChange={handleGameTypeChange}
                disabled={
                  isSubmitting || !storeUsername || gameTypesData.length === 0
                }
              >
                <SelectTrigger className="w-full h-12 px-4 rounded-lg border-light-60 bg-[#F2FBFE]">
                  <SelectValue
                    placeholder={
                      storeUsername
                        ? "Select your Game Type"
                        : "Enter username first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {gameTypesData.map((gameData) => (
                    <SelectItem
                      key={gameData.game_type}
                      value={gameData.game_type}
                    >
                      {gameData.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center gap-x-2 text-blue-base">
                <Info className="w-4 h-4 flex-shrink-0 text-blue-base" />
                <p className="text-[14px]">You can still change the Game type later in the Profile Settings</p>
              </div>

              {errorMessage && (
                <p className="text-[14px] text-red-500">{errorMessage}</p>
              )}

              <button
                className="w-full h-12 btn-primary text-white font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={
                  isSubmitting ||
                  !storeUsername ||
                  !selectedGameType ||
                  isValidatingUsername
                }
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
