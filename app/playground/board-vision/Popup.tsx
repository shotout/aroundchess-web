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
import Image from "next/image";
import axios from "axios";
import { Chess } from "chess.js";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";

const endpoint = process.env.BASE_URL;

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleUsernameClicked: (value: boolean) => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, handleUsernameClicked }) => {
  const { sessionId } = useProfileStore();
  const { username: globalUsername } = usePgnStore();

  const router = useRouter();
  const {
    username,
    setUsername,
    loadUserPositions,
    loadDefaultPositions,
    isLoading,
    loadingError,
  } = useBoardVisionStore();

  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
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
    if (debouncedQuery && debouncedQuery.trim() !== "" && sessionId) {
      setUsernameStatus("loading");
      fetchUserGames();
    } else if (!debouncedQuery || debouncedQuery.trim() === "") {
      setUsernameStatus("idle");
      setAvailableGames([]);
      setSelectedGames([]);
    }
  }, [debouncedQuery, sessionId, gameCount]);

  useEffect(() => {
    if (isOpen) {
      setShowErrorModal(false);

      if (globalUsername && globalUsername.trim() !== "") {
        setUsernameInput(globalUsername);
        setDebouncedQuery("");
      } else if (username && username.trim() !== "") {
        // setUsernameInput(username);
        // setDebouncedQuery("");
      } else {
        setUsernameInput("");
        setDebouncedQuery("");
        setUsernameStatus("idle");
        setAvailableGames([]);
        setSelectedGames([]);
      }
    }
  }, [isOpen, globalUsername, username]);

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
        const games = response.data.data;
        setAvailableGames(games);

        const gamesReturned = games.length;

        const gameDetails = games.map((game: any) => {
          try {
            const chess = new Chess();
            chess.loadPgn(game.value);
            const headers = chess.header();

            return {
              value: game.value,
              opponent:
                headers.White?.toLowerCase() === debouncedQuery.toLowerCase()
                  ? headers.Black
                  : headers.White,
            };
          } catch (error) {
            console.error("Error parsing PGN:", error);
            return { value: game.value, opponent: "Unknown" };
          }
        });

        const uniqueOpponents = new Set(
          gameDetails.map((g: any) => g.opponent)
        );

        setSelectedGames(games.map((game: any) => game.value));
      } else {
        setUsernameStatus("not-found");
        setAvailableGames([]);
        setSelectedGames([]);
      }
    } catch (error) {
      console.error("Error fetching user games:", error);
      setUsernameStatus("not-found");
      setAvailableGames([]);
      setSelectedGames([]);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUsernameInput(newValue);

    if (newValue.trim() === "") {
      setUsernameStatus("idle");
      setAvailableGames([]);
      setSelectedGames([]);
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

    try {
      if (usernameStatus === "found" && selectedGames.length > 0) {
        setUsername(usernameInput);

        try {
          await loadUserPositions(selectedGames, usernameInput);

          onClose();
          router.push("/playground/board-vision/user");
        } catch (error) {
          console.error("Error loading user positions:", error);
          setShowErrorModal(true);
        }
      } else if (usernameStatus === "found") {
        setShowErrorModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error in handleStartClick:", error);
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
          <div className="flex gap-[16px] mb-[20px] flex-col md:flex-row justify-between space-x-4">
            <div className="w-full md:w-1/2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-700">♞</span>
                <span>Chess.com Username</span>
              </div>
              <div 
                onClick={() => {
                  console.log("Username clicked", usernameInput);
                  if (!usernameInput) {
                    handleUsernameClicked(true);
                  }
                }} 
                className="flex flex-row items-center w-full p-3 bg-[#2E507708] rounded-lg shadow-sm cursor-pointer"
              >
                <input
                  type="text"
                  id="username"
                  value={usernameInput}
                  placeholder={
                    usernameInput ? "" : "Enter your Chess.com Username"
                  }
                  onChange={handleUsernameChange}
                  className="w-full bg-transparent h-[24px] focus:outline-none"
                  readOnly
                />
                <div className="flex items-center">
                  {usernameStatus === "loading" && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  )}
                  {usernameStatus === "found" && (
                    <div className="flex items-center text-green-500 whitespace-nowrap">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-[14px] --xs">Found</span>
                    </div>
                  )}
                  {usernameStatus === "not-found" && (
                    <div className="flex items-center text-red-500 whitespace-nowrap">
                      <X className="h-4 w-4 mr-1" />
                      <span className="text-[14px] --xs">Not found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 !mx-0">
              <p className="block text-base sm:text-[14px] --sm text-black">
                Ask Questions from my last...
              </p>

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
              disabled={
                isLoading ||
                usernameStatus === "loading" ||
                (usernameStatus === "found" && selectedGames.length === 0)
              }
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
