"use client";

import React, { useEffect, useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";

import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { gameHistoryApi } from "@/components/game-history/services/api";

interface ChessAccountSetupProps {
  isLoading?: boolean;
  debugMode?: boolean;
}

const ChessAccountSetup: React.FC<ChessAccountSetupProps> = ({
  isLoading = false,
  debugMode = false,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const sessionId = localStorage.getItem("token");

  useEffect(() => {
    const checkSession = () => {
      const sessionId = localStorage.getItem("token");
      if (sessionId) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    checkSession();
  }, [sessionId, isSignedIn]);

  const { setUsername, username } = usePgnStore();

  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  const handleConnectSuccess = (username: string) => {
    setShowConnectDialog(false);
    setUsername(username);
    setShowPremiumDialog(true);
  };

  const handleConnectClose = () => {
    setShowConnectDialog(false);
    setShowPremiumDialog(true);
  };

  const handleClosePremium = () => {
    setShowPremiumDialog(false);
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
    toast.success("Thank you for subscribing to Premium!");
  };

  const triggerConnectDialog = () => setShowConnectDialog(!showConnectDialog);
  const triggerPremiumDialog = () => setShowPremiumDialog(!showPremiumDialog);

  useEffect(() => {
    // Skip API checks in debug mode
    if (debugMode) {
      setCheckComplete(true);
      return;
    }

    // If we already have a username, don't check
    if (username) {
      setCheckComplete(true);
      return;
    }

    const fetchProfileData = async () => {
      if (!isSignedIn || !sessionId) {
        setCheckComplete(true);
        return;
      }

      // Show toast with spinning indicator
      const toastId = toast.loading("Verifying username...");

      setShowConnectDialog(false);
      setShowPremiumDialog(false);

      try {
        const response = await gameHistoryApi.getProfile(sessionId);
        console.log(
          "Profile response structure:",
          JSON.stringify(response).substring(0, 200)
        );

        if (response?.success && response?.data?.username) {
          setUsername(response.data.username);
        } else {
          console.log("No username found in response:", response);
          setShowConnectDialog(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setShowConnectDialog(true);
      } finally {
        // Dismiss the toast when check completes
        toast.dismiss(toastId);
        setCheckComplete(true);
      }
    };

    fetchProfileData();
  }, [isSignedIn, sessionId, setUsername, username, debugMode]);

  return (
    <>
      {debugMode && (
        <div className="flex gap-2 mb-4 bg-yellow-100 p-2 rounded-md border border-yellow-300">
          <button
            onClick={triggerConnectDialog}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            {showConnectDialog ? "Close" : "Open"} Chess Connect
          </button>
          <button
            onClick={triggerPremiumDialog}
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
          >
            {showPremiumDialog ? "Close" : "Open"} Premium Dialog
          </button>
          <span className="text-xs self-center text-yellow-800">
            DEBUG MODE
          </span>
        </div>
      )}

      {(checkComplete || debugMode) && (
        <>
          <ChessConnectDialog
            open={showConnectDialog && !isLoading}
            onOpenChange={(open) => {
              setShowConnectDialog(open);
              if (!open && !debugMode) {
                handleConnectClose();
              }
            }}
            onSuccess={handleConnectSuccess}
          />

          <PremiumSubscription
            visible={showPremiumDialog && !isLoading}
            onClose={handleClosePremium}
            onGetPremium={handleGetPremium}
          />
        </>
      )}
    </>
  );
};

export default ChessAccountSetup;
