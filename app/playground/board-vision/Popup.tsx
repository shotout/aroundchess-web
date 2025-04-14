"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const {
    username,
    setUsername,
    currentYear,
    currentMonth,
    loadUserPositions,
    loadDefaultPositions,
    isLoading,
    loadingError,
  } = useBoardVisionStore();

  const [usernameInput, setUsernameInput] = useState(username);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const currentSystemYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 10 },
    (_, i) => currentSystemYear - i
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
  };

  const handleYearChange = (value: string) => {
    setYear(parseInt(value));
  };

  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value));
  };

  const handleDefaultPositionClick = () => {
    loadDefaultPositions();
    onClose();
    router.push("/playground/board-vision/default");
  };

  const handleStartClick = async () => {
    if (usernameInput.trim() === "") {
      handleDefaultPositionClick();
      return;
    }

    setUsername(usernameInput);

    try {
      await loadUserPositions(usernameInput, year, month);

      if (!loadingError) {
        router.push("/playground/board-vision/user");
        onClose();
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error loading user positions:", error);
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

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
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="120" height="120" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="40" fill="transparent" />
                    <circle cx="85" cy="55" r="4" fill="#13CDD9" />
                    <circle cx="100" cy="70" r="4" fill="#13CDD9" />
                    <circle cx="55" cy="55" r="4" fill="#13CDD9" />
                    <circle cx="40" cy="70" r="4" fill="#13CDD9" />
                  </svg>
                </div>
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 100 100"
                  className="relative"
                >
                  <path
                    d="M50 20 C 45 40, 35 50, 35 70 L 65 70 C 65 50, 55 40, 50 20"
                    fill="#13CDD9"
                  />
                  <circle cx="50" cy="35" r="15" fill="#13CDD9" />
                  <rect
                    x="30"
                    y="70"
                    width="40"
                    height="10"
                    rx="5"
                    fill="#13CDD9"
                  />
                  <rect
                    x="25"
                    y="80"
                    width="50"
                    height="10"
                    rx="5"
                    fill="#13CDD9"
                  />
                </svg>
                <div className="absolute bottom-0 right-0">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
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
          <div className="flex items-center space-x-2">
            <span className="text-blue-700">♞</span>
            <span>Chess.com Username</span>
          </div>

          <Input
            placeholder="Blitzmystic"
            value={usernameInput}
            onChange={handleUsernameChange}
            className="w-full"
          />

          <div>
            <p className="mb-1 text-sm">
              Show questions for my Games in the following month:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={month.toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={monthNames[month - 1]} />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((name, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={year.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((yearOption) => (
                    <SelectItem key={yearOption} value={yearOption.toString()}>
                      {yearOption}
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
              Default Position
            </Button>

            <Button
              variant="default"
              className="w-full py-2 rounded-full bg-blue-600 text-white"
              onClick={handleStartClick}
              disabled={isLoading}
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
                  "There was an error loading the games. Please try another month or username."}
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
