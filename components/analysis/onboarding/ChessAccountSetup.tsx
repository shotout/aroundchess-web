"use client";

import React, { useState, useEffect } from "react";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";

import { ChessConnectDialog } from "@/components/analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "@/components/analysis/onboarding/PremiumSubscription";
import { useChessProfile } from "./useChessProfile";
import DialogAnalyzeFree from "@/components/modal/DialogAnalyzeFree";
import DialogSpecialDiscount from "@/components/modal/DialogSpecialDiscount";
import { useTutorial } from "@/components/TutorialProvider";
import { usePathname, useRouter } from "next/navigation";
import { useProfileStore } from "@/app/store/profile";
import { useProfileFetch } from "@/components/navigator/hook/useProfileFetch";
import { formatTimePgn } from "@/functions/format-date";
import { useApiClient } from "@/functions/api-client";
import { useTutorialStore } from "@/app/store/tutorialStore";
import { ChessApiService } from "./store/APIService";

interface ChessAccountSetupProps {
  isLoading?: boolean;
  debugMode?: boolean;

  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const ChessAccountSetup: React.FC<ChessAccountSetupProps> = ({
  isLoading = false,
  open = false,
  setOpen = () => {},
}) => {
  const { setUsername, setIsOpenTutorial } = usePgnStore();
  const { setCallFetch } = useProfileFetch();
  const { setToken, sessionId } = useProfileStore();
  const { isSignedIn, hasUsername, checkComplete } = useChessProfile();
  const { getTokenBalance } = useApiClient();
  const { startTutorial } = useTutorial();
  const {
    tutorialType,
    hasCompletedTutorial,
    setTutorialType,
    setHasCompletedTutorial,
    setIsCheckingTutorial,
  } = useTutorialStore();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showAnalyzeFreeBanner, setShowAnalyzeFreeBanner] = useState(false);
  const [showSpecialDiscount, setShowSpecialDiscount] = useState(false);
  const [closeConnectDialog, setCloseConnectDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      setShowConnectDialog(true);
    }
  }, [open]);

  // Check tutorial status on mount
  useEffect(() => {
    const checkTutorialStatus = async () => {
      console.log("🔍 [ChessAccountSetup] Checking tutorial status on mount:", {
        isSignedIn,
        sessionId: !!sessionId,
        hasCompletedTutorial,
      });

      if (!isSignedIn || !sessionId) {
        console.log("⏹️ [ChessAccountSetup] Skipping tutorial check - user not signed in or no sessionId");
        return;
      }

      if (hasCompletedTutorial) {
        console.log("✅ [ChessAccountSetup] Tutorial already completed (local state), skipping API check");
        return;
      }

      setIsCheckingTutorial(true);

      try {
        console.log("📡 [ChessAccountSetup] Fetching tutorial status from API...");
        // Only check chesscom tutorial status
        const chesscomStatus = await ChessApiService.getTutorialStatus("chesscom", sessionId).catch(
          (err) => {
            console.log("⚠️ Chesscom tutorial status error:", err);
            return null;
          }
        );

        console.log("📊 [ChessAccountSetup] Tutorial status results:", {
          chesscomStatus,
        });

        // Check if tutorial is completed
        // API returns: data.isChesscomTutorialComplete
        const isCompleted = chesscomStatus?.data?.isChesscomTutorialComplete === true;

        console.log("🎯 [ChessAccountSetup] Tutorial completion status:", {
          isCompleted,
        });

        if (isCompleted) {
          console.log("✅ [ChessAccountSetup] Tutorial completed, setting hasCompletedTutorial = true");
          setHasCompletedTutorial(true);
        } else {
          console.log("📝 [ChessAccountSetup] Tutorial not completed yet");
        }
      } catch (error) {
        console.error("❌ [ChessAccountSetup] Error checking tutorial status:", error);
      } finally {
        setIsCheckingTutorial(false);
      }
    };

    checkTutorialStatus();
  }, [isSignedIn, sessionId, hasCompletedTutorial, setHasCompletedTutorial, setIsCheckingTutorial]);

  useEffect(() => {
    console.log("🔍 [ChessAccountSetup] Checking if should show dialog:", {
      checkComplete,
      isLoading,
      isSignedIn,
      hasUsername,
      hasCompletedTutorial,
      shouldShow: isSignedIn && !hasUsername,
    });

    if (!checkComplete || isLoading) {
      console.log("⏳ [ChessAccountSetup] Waiting for profile check to complete or loading...");
      return;
    }

    // Show ChessAccountSetup for ALL users without username
    // Tutorial completion only affects whether we show tutorial AFTER they interact with the dialog
    if (isSignedIn && !hasUsername) {
      console.log("✅ [ChessAccountSetup] Showing ChessAccountSetup dialog for user without username");
      setShowConnectDialog(true);
      setShowPremiumDialog(false);
    } else {
      console.log("❌ [ChessAccountSetup] Not showing dialog because:", {
        notSignedIn: !isSignedIn,
        alreadyHasUsername: hasUsername,
      });
      setShowConnectDialog(false);
    }
  }, [isSignedIn, hasUsername, checkComplete, isLoading]);

  const handleConnectSuccess = async (username: string) => {
    setShowConnectDialog(false);
    setUsername(username);

    // Always fetch token balance
    getTokenBalance({}).then((response) => {
      if (response.data != null) {
        const data = response.data;
        setToken(data);
      }
    });

    // Check if user already completed tutorial (chesscom only)
    if (sessionId) {
      try {
        console.log("🔍 Checking tutorial status from API...");
        const chesscomStatus = await ChessApiService.getTutorialStatus(
          "chesscom",
          sessionId
        );

        console.log("📊 Tutorial status response:", chesscomStatus);

        // If already completed, just close without showing tutorial
        if (chesscomStatus?.data?.isChesscomTutorialComplete === true) {
          console.log("✅ Tutorial already completed, skipping tutorial");
          setHasCompletedTutorial(true);
          toast.info("You have already completed the tutorial");
          return;
        } else {
          console.log("❌ Tutorial not completed, showing tutorial");
        }
      } catch (error) {
        console.error("❌ Error checking tutorial status:", error);
        // Continue to show tutorial on error to be safe
      }
    }

    // Set tutorial type to chesscom since user entered username
    setTutorialType("chesscom");
    console.log("📝 Set tutorial type to: chesscom");
    console.log("🎯 Opening DialogAnalyzeFree for chesscom tutorial");

    // Show DialogAnalyzeFree to start the tutorial
    handleOpenAnalyzeFree();
  };

  const handleOpenAnalyzeFree = () => {
    setShowAnalyzeFreeBanner(true);
  };
  const handleCloseFreeBanner = () => {
    setShowAnalyzeFreeBanner(false);

    if (closeConnectDialog) {
      if (!pathname.includes("/playground/play-vs-ai") 
        || pathname.includes("/playground/play-vs-ai/playing")
      ) {
        router.replace("/playground/play-vs-ai");
      }
    } else {
      if (!pathname.includes("/my-game-history")) {
        router.replace("/my-game-history");
      }
    }

    setTimeout(() => {
      setIsOpenTutorial(true);
      startTutorial();
    }, 300);

    // if (!pathname.includes("/analysis")) {
    //   router.replace("/analysis");
    //   setShowAnalyzeFreeBanner(false);
    //   setIsOpenTutorial(true);
    //   startTutorial();
    // } else {
    //   setShowAnalyzeFreeBanner(false);
    //   setIsOpenTutorial(true);
    //   startTutorial();
    // }
  };

  const handleSpecialDiscount = () => {
    setShowSpecialDiscount(false);
    setShowPremiumDialog(true);
  };

  const handleConnectClose = async () => {
    setShowConnectDialog(false);

    // Check if user already completed tutorial (chesscom only)
    if (sessionId) {
      try {
        console.log("🔍 Checking tutorial status from API...");
        const chesscomStatus = await ChessApiService.getTutorialStatus(
          "chesscom",
          sessionId
        );

        console.log("📊 Tutorial status response:", chesscomStatus);

        // If already completed, just close without showing tutorial
        if (chesscomStatus?.data?.isChesscomTutorialComplete === true) {
          console.log("✅ Tutorial already completed, skipping tutorial");
          setHasCompletedTutorial(true);
          toast.info("You have already completed the tutorial");
          return;
        } else {
          console.log("❌ Tutorial not completed, showing tutorial");
        }
      } catch (error) {
        console.error("❌ Error checking tutorial status:", error);
        // Continue to show tutorial on error to be safe
      }
    }

    // Set tutorial type to no-chesscom since user closed without entering username
    setTutorialType("no-chesscom");
    console.log("📝 Set tutorial type to: no-chesscom");
    console.log("🎯 Opening DialogAnalyzeFree for no-chesscom tutorial");

    setCloseConnectDialog(true);
    // Show DialogAnalyzeFree to start the tutorial
    handleOpenAnalyzeFree();
  };

  const handleClosePremium = () => {
    setShowPremiumDialog(false);
    // Redirect to game history instead of showing AnalyzeGameDialog
    router.push("/my-game-history");
  };

  const handleGetPremium = () => {
    setShowPremiumDialog(false);
    toast.success("Thank you for subscribing to Premium!");
    // Redirect to game history instead of showing AnalyzeGameDialog
    router.push("/my-game-history");
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
          setOpen(open);
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
    </>
  );
};

export default ChessAccountSetup;
