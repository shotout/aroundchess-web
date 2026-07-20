"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoardVisionStore } from "./utils/BoardvisionStore";
import { QuizGame } from "./types/default-pgn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { CACHE_EXPIRATION } from "@/components/game-history/hooks/useGameData";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const { sessionId } = useProfileStore();
  const {
    username: globalUsername,
    gamesData,
    gamesLastFetched,
  } = usePgnStore();

  const router = useRouter();
  const { loadUserPositions, loadDefaultPositions, isLoading, loadingError } =
    useBoardVisionStore();

  const [gamesStatus, setGamesStatus] = useState("idle");
  const [selectedGames, setSelectedGames] = useState<QuizGame[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [gameCount, setGameCount] = useState("50");

  const gameCountOptions = Array.from({ length: 10 }, (_, i) =>
    ((i + 1) * 10).toString()
  );

  // Both the raw API shape and the UI-shaped cached Game carry pgn + username.
  const toQuizGames = (items: any[]): QuizGame[] =>
    items
      .filter((g) => typeof g?.pgn === "string" && g.pgn.trim() !== "")
      .map((g) => ({ pgn: g.pgn, username: g.username || globalUsername || "" }));

  useEffect(() => {
    if (!isOpen) return;
    setShowErrorModal(false);
    loadGames();
  }, [isOpen, sessionId, gameCount]);

  const loadGames = async () => {
    const limit = parseInt(gameCount, 10);
    const cached = Array.isArray(gamesData) ? toQuizGames(gamesData) : [];
    const cacheFresh =
      !!gamesLastFetched && Date.now() - gamesLastFetched < CACHE_EXPIRATION;

    if (cacheFresh && cached.length >= limit) {
      setSelectedGames(cached.slice(0, limit));
      setGamesStatus("found");
      return;
    }

    if (!sessionId) {
      setSelectedGames(cached.slice(0, limit));
      setGamesStatus(cached.length > 0 ? "found" : "not-found");
      return;
    }

    setGamesStatus("loading");
    try {
      const res = await gameHistoryApi.getUserGames(sessionId, { limit });
      const games = toQuizGames(res?.data || []);

      if (games.length > 0) {
        setSelectedGames(games.slice(0, limit));
        setGamesStatus("found");
      } else if (cached.length > 0) {
        setSelectedGames(cached.slice(0, limit));
        setGamesStatus("found");
      } else {
        setSelectedGames([]);
        setGamesStatus("not-found");
      }
    } catch (error) {
      console.error("Error fetching game history:", error);
      if (cached.length > 0) {
        setSelectedGames(cached.slice(0, limit));
        setGamesStatus("found");
      } else {
        setSelectedGames([]);
        setGamesStatus("not-found");
      }
    }
  };

  const handleDefaultPositionClick = () => {
    loadDefaultPositions();
    onClose();
    router.push("/playground/board-vision/default");
  };

  const handleGameCountChange = (value: string) => {
    setGameCount(value);
  };

  const handleStartClick = async () => {
    // No game history available — fall back to the default quiz.
    if (gamesStatus !== "found" || selectedGames.length === 0) {
      handleDefaultPositionClick();
      return;
    }

    try {
      await loadUserPositions(selectedGames);

      const { userGame, loadingError: positionsError } =
        useBoardVisionStore.getState();
      if (positionsError || userGame.positions.length === 0) {
        setShowErrorModal(true);
        return;
      }

      onClose();
      router.push("/playground/board-vision/user");
    } catch (error) {
      console.error("Error loading user positions:", error);
      setShowErrorModal(true);
    }
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = 72;
  const headerHeightLg = 96;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        top:
          typeof window !== "undefined" && window.innerWidth >= 1024
            ? headerHeightLg
            : headerHeight,
        left: sidebarWidth,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 bg-white rounded-lg shadow-lg p-4 sm:max-w-md w-[90%]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/play")}
            className="flex items-center"
          >
            <ChevronLeft className="h-6 w-6 text-black" />
          </button>

          <button
            className="rounded-full p-1 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative mb-2">
            <div className="text-cyan-400 flex items-center justify-center">
              <div className="relative">
                <Image
                  src={"/board-vision/board-icon.png"}
                  alt=""
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </div>

          <h1 className="text-xl font-bold mb-1 text-center">Board Vision</h1>
          <p className="text-center text-gray-800 text-[14px] --sm mb-1">
            Answer technical Chess Questions from positions of your previous
            Games to improve your Board Vision.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-full mb-[20px]">
            <div className="flex items-center gap-2 mb-1">
              <p className="block text-base sm:text-[14px] --sm text-black">
                Ask Questions from my last...
              </p>
              {gamesStatus === "loading" && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              )}
            </div>

            <Select
              name="gameCount"
              value={gameCount}
              onValueChange={handleGameCountChange}
            >
              <SelectTrigger className="w-full h-[48px]">
                <SelectValue placeholder="Select number of games" />
              </SelectTrigger>
              <SelectContent>
                {gameCountOptions.map((count) => (
                  <SelectItem key={count} value={count}>
                    {count} Games
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full py-2 rounded-full btn-tertiary text-blue-base border border-blue-200"
              onClick={handleDefaultPositionClick}
              disabled={isLoading}
            >
              Default Quiz
            </Button>

            <Button
              variant="default"
              className="w-full py-2 rounded-full bg-blue-base btn-primary text-white"
              onClick={handleStartClick}
              disabled={isLoading || gamesStatus === "loading"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Games...
                </>
              ) : (
                "Start"
              )}
            </Button>
          </div>
        </div>
      </div>

      {showErrorModal && (
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>
                {loadingError ||
                  "There was an error loading the games. Please try again."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowErrorModal(false)}>Ok</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Popup;
