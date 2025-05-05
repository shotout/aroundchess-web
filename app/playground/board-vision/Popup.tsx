"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoardVisionStore } from "./utils/BoardvisionStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import axios from "axios";

const endpoint = process.env.BASE_URL;

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const { sessionId } = useAuth();
  const router = useRouter();
  const {
    username,
    setUsername,
    loadUserPositions,
    loadDefaultPositions,
    isLoading,
    loadingError,
  } = useBoardVisionStore();

  const [usernameInput, setUsernameInput] = useState(username);
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | undefined>(
    undefined
  );
  const [debouncedQuery, setDebouncedQuery] = useState(usernameInput);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [gameCount, setGameCount] = useState("50");

  const gameCountOptions = Array.from({ length: 10 }, (_, i) =>
    ((i + 1) * 10).toString()
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(usernameInput), 500);
    return () => clearTimeout(timer);
  }, [usernameInput]);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim() !== "") {
      setUsernameStatus("loading");
      fetchUserGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, sessionId, gameCount]);

  const fetchUserGames = async () => {
    try {
      const url = `${endpoint}/games/get-data/${debouncedQuery}?limit=${gameCount}`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: `Bearer ${sessionId}`,
        },
      });

      if (response.status === 200 && response.data.data?.length > 0) {
        setUsernameStatus("found");
        setAvailableGames(response.data.data);

        // Safely handle the case where fewer games are returned than requested
        const gamesReturned = response.data.data.length;
        console.log(
          `Requested ${gameCount} games, received ${gamesReturned} games`
        );

        // Randomly select a game from available games
        const randomIndex = Math.floor(Math.random() * gamesReturned);
        setSelectedGame(response.data.data[randomIndex]?.value);

        // Add a fallback in case the selected game is undefined
        if (!response.data.data[randomIndex]?.value && gamesReturned > 0) {
          // If the random selection failed but we have games, use the first one
          setSelectedGame(response.data.data[0].value);
        }
      } else {
        setUsernameStatus("not-found");
        setAvailableGames([]);
        setSelectedGame(undefined);
      }
    } catch (error) {
      console.error("Error fetching user games:", error);
      setUsernameStatus("not-found");
      setAvailableGames([]);
      setSelectedGame(undefined);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
    if (e.target.value.trim() === "") {
      setUsernameStatus("idle");
      setAvailableGames([]);
      setSelectedGame(undefined);
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
    if (usernameInput.trim() === "") {
      handleDefaultPositionClick();
      return;
    }

    setUsername(usernameInput);

    try {
      if (usernameStatus === "found" && selectedGame) {
        router.push("/playground/board-vision/user");
        onClose();

        loadUserPositions(selectedGame, usernameInput).catch((error) => {
          console.error("Error loading user positions:", error);
        });
      } else if (usernameStatus === "found") {
        setShowErrorModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error loading user positions:", error);
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowErrorModal(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-lg shadow-lg p-4 sm:max-w-md w-[90%]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/playground/board-vision")}
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
          <p className="text-center text-gray-800 text-sm mb-1">
            Answer technical Chess Questions from positions of your previous
            Games to improve your Board Vision.
          </p>
        </div>

        <div className="space-y-3">
          {/* Updated layout - Labels in same line */}
          <div className="flex justify-between space-x-4">
            <div className="flex items-center space-x-2 w-1/2">
              <span className="text-blue-700">♞</span>
              <span>Chess.com Username</span>
            </div>
            <div className="w-1/2">
              <p className="block text-base sm:text-sm text-black">
                Ask Questions from my last...
              </p>
            </div>
          </div>

          {/* Updated layout - Input fields in same line and equal sizes */}
          <div className="flex justify-between space-x-4">
            <div className="w-1/2">
              <div className="flex flex-row items-center w-full p-3 bg-[#2E507708] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <input
                  type="text"
                  id="username"
                  value={usernameInput}
                  placeholder="Enter your Chess.com Username"
                  onChange={handleUsernameChange}
                  className="w-full bg-transparent h-[24px] focus:outline-none"
                />
                <div className="flex items-center">
                  {usernameStatus === "loading" && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  )}
                  {usernameStatus === "found" && (
                    <div className="flex items-center text-green-500 whitespace-nowrap">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs">Found</span>
                    </div>
                  )}
                  {usernameStatus === "not-found" && (
                    <div className="flex items-center text-red-500 whitespace-nowrap">
                      <X className="h-4 w-4 mr-1" />
                      <span className="text-xs">Not found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-1/2">
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
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-200"
              onClick={handleDefaultPositionClick}
              disabled={isLoading}
            >
              Default Quiz
            </Button>

            <Button
              variant="default"
              className="w-full py-2 rounded-full bg-blue-600 text-white"
              onClick={handleStartClick}
              disabled={
                isLoading || (usernameStatus === "found" && !selectedGame)
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
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
                  "There was an error loading the games. Please try another game or username."}
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
