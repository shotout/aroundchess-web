import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { LoadingStateProps } from "../types/default-pgn";

const LoadingState: React.FC<LoadingStateProps> = ({
  setShowSetupPopup,
  message = "Please enter your Chess.com username to load your games or try again.",
}) => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-4">No games loaded</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={() => setShowSetupPopup(true)}>
          Load Chess.com Games
        </Button>
      </div>
    </div>
  );
};

export default LoadingState;
