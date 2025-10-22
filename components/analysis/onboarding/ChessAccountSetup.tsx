"use client";

import React, { useState, useEffect } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";

import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { AnalyzeGameDialog } from "./AnalyzeGameDialog";
import { useChessProfile } from "./useChessProfile";
import DialogAnalyzeFree from "@/components/modal/DialogAnalyzeFree";
import DialogSpecialDiscount from "@/components/modal/DialogSpecialDiscount";
import { useTutorial } from "@/components/TutorialProvider";
import { usePathname, useRouter } from "next/navigation";

interface ChessAccountSetupProps {
  isLoading?: boolean;
  debugMode?: boolean;
}

const ChessAccountSetup: React.FC<ChessAccountSetupProps> = ({
  isLoading = false,
}) => {
  const { setUsername, setIsOpenTutorial } = usePgnStore();
  const { isSignedIn, hasUsername, checkComplete } = useChessProfile();
  const { startTutorial } = useTutorial();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showAnalyzeDialog, setShowAnalyzeDialog] = useState(false);
  const [showAnalyzeFreeBanner, setShowAnalyzeFreeBanner] = useState(false);
  const [showSpecialDiscount, setShowSpecialDiscount] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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
    handleOpenAnalyzeFree();
  };

  const handleOpenAnalyzeFree = () => {
    setShowAnalyzeFreeBanner(true);
  };
  const handleCloseFreeBanner = () => {
    if (!pathname.includes("/analysis")) {
      router.replace("/analysis");
      setShowAnalyzeFreeBanner(false);
      setIsOpenTutorial(true);
      startTutorial();
    } else {
      setShowAnalyzeFreeBanner(false);
      setIsOpenTutorial(true);
      startTutorial();
    }
  };

  const handleSpecialDiscount = () => {
    setShowSpecialDiscount(false);
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
      <DialogAnalyzeFree
        open={showAnalyzeFreeBanner}
        setOpen={handleCloseFreeBanner}
        onClose={setShowAnalyzeFreeBanner}
      />
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
