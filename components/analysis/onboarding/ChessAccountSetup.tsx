"use client";

import React, { useEffect, useState } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";

import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { useProfileStore } from "@/app/store/profile";
import { AnalyzeGameDialog } from "./AnalyzeGameDialog";

interface ChessAccountSetupProps {
  isLoading?: boolean;
  debugMode?: boolean;
}

const ChessAccountSetup: React.FC<ChessAccountSetupProps> = ({
  isLoading = false,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { sessionId } = useProfileStore();

  useEffect(() => {
    const checkSession = () => {
      if (sessionId != "") {
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
  const [showAnalyzeDialog, setShowAnalyzeDialog] = useState(false);
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
    setShowAnalyzeDialog(true);
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
    setShowAnalyzeDialog(true);
    toast.success("Thank you for subscribing to Premium!");
  };

  const triggerConnectDialog = () => setShowConnectDialog(!showConnectDialog);
  const triggerPremiumDialog = () => setShowPremiumDialog(!showPremiumDialog);
  const triggerAnalyzeDialog = () => setShowAnalyzeDialog(!showAnalyzeDialog);

  useEffect(() => {
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
      setShowAnalyzeDialog(false);

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
  }, [isSignedIn, sessionId, setUsername, username]);

  return (
    <>
      {checkComplete && (
        <>
          <ChessConnectDialog
            open={showConnectDialog && !isLoading}
            onOpenChange={(open) => {
              setShowConnectDialog(open);
              if (!open) {
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

          <AnalyzeGameDialog
            open={showAnalyzeDialog && !isLoading}
            onOpenChange={setShowAnalyzeDialog}
          />
        </>
      )}
    </>
  );
};

export default ChessAccountSetup;
