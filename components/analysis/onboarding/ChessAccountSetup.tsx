"use client";

import React, { useState, useEffect } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";

import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { AnalyzeGameDialog } from "./AnalyzeGameDialog";
import { useChessProfile } from "./useChessProfile";
import DialogAnalyzeFree from "@/components/modal/DialogAnalyzeFree";

interface ChessAccountSetupProps {
  isLoading?: boolean;
  debugMode?: boolean;
}

const ChessAccountSetup: React.FC<ChessAccountSetupProps> = ({
  isLoading = false,
}) => {
  const { setUsername } = usePgnStore();
  const { isSignedIn, hasUsername, checkComplete } = useChessProfile();

  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showAnalyzeDialog, setShowAnalyzeDialog] = useState(false);

  useEffect(() => {
    if (!checkComplete || isLoading) return;

    if (isSignedIn && !hasUsername) {
      setShowConnectDialog(true);
      setShowPremiumDialog(false);
      setShowAnalyzeDialog(false);
    } else {
      setShowConnectDialog(false);
    }
  }, [isSignedIn, hasUsername, checkComplete, isLoading]);

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

  if (!checkComplete) {
    return null;
  }

  return (
    <>
      <DialogAnalyzeFree open={true} />
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
  );
};

export default ChessAccountSetup;
