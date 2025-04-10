"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePgnStore } from "@/app/store/zustandStore";
import { toast } from "sonner";

import { ChessConnectDialog } from "../analysis/onboarding/ChessConnectPopover";
import { PremiumSubscription } from "../analysis/onboarding/PremiumSubscription";
import { gameHistoryApi } from "./services/api";
import DotSpinner from "./Spinner";
import HistoryTabs from "./components/HistoryTabs";
import StatisticsSection from "./components/StatisticsSection";
import ImportDialogButton from "./components/ImportDialogButton";
import LoadingDot from "./components/LoadingDot";

const DEV_MODE = false;

const GameHistoryPage: React.FC = () => {
  const { sessionId, isLoaded: authIsLoaded, isSignedIn } = useAuth();
  const { setUsername, username } = usePgnStore();

  const [devMode] = useState(DEV_MODE);
  const [showConnectDialog, setShowConnectDialog] = useState(devMode);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsernameFetching, setIsUsernameFetching] = useState(false);

  const handleConnectSuccess = (username: string) => {
    setShowConnectDialog(false);
    setUsername(username);
    toast.success(`Successfully connected to Chess.com as ${username}`);
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authIsLoaded) {
        return;
      }

      if (!isSignedIn || !sessionId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsUsernameFetching(true);
      setShowConnectDialog(false);
      setShowPremiumDialog(false);

      try {
        const response = await gameHistoryApi.getProfile(sessionId);

        if (response) {
          const extractedUsername =
            response.username || (response.data && response.data.username);

          if (extractedUsername) {
            setUsername(extractedUsername);
          } else {
            setShowConnectDialog(true);
          }
        } else {
          setShowConnectDialog(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setShowConnectDialog(true);
      } finally {
        setIsLoading(false);
        setIsUsernameFetching(false);
      }
    };

    fetchProfileData();
  }, [authIsLoaded, isSignedIn, sessionId, setUsername]);

  useEffect(() => {
    if (authIsLoaded && !isLoading && !username) {
      setShowConnectDialog(true);
    }
  }, [authIsLoaded, isLoading, username]);

  const triggerConnectDialog = () => setShowConnectDialog(!showConnectDialog);
  const triggerPremiumDialog = () => setShowPremiumDialog(!showPremiumDialog);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotSpinner />
      </div>
    );
  }

  return (
    <>
      <main className="w-full px-4 py-4 space-y-[16px] bg-primary-white relative">
        {devMode && (
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
              DEV MODE
            </span>
          </div>
        )}

        <ChessConnectDialog
          open={
            devMode
              ? showConnectDialog
              : showConnectDialog && !isLoading && !username
          }
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

        <div className="">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-row items-end gap-2">
              <h1 className="text-base lg:text-[32px] font-bold">
                My Game History
              </h1>
              <div className="flex justify-center items-end h-full">
                {isUsernameFetching ? (
                  <LoadingDot />
                ) : (
                  <p className="text-xs text-gray-500 lg:text-[18px]">
                    {username ? `(${username})` : "(No username set)"}
                  </p>
                )}
              </div>
            </div>

            <ImportDialogButton />
          </div>

          <StatisticsSection username={username} />
        </div>

        <HistoryTabs username={username} />
      </main>
    </>
  );
};

export default GameHistoryPage;
