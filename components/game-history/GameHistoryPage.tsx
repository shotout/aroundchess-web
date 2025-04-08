"use client";

import DialogButton from "@/components/game-history/DialogButton";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

import { Star, Target, Trophy, Swords, BarChart2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChessConnectDialog } from "../analysis/onboarding/ChessConnectPopover";
import { useAuth } from "@clerk/nextjs";
import { usePgnStore } from "@/app/store/zustandStore";
import UserHistory from "./UserHistory";
import OtherHistory from "./OtherHistory";
import Image from "next/image";
import { PremiumSubscription } from "../analysis/onboarding/PremiumSubscription";
import { ChessApiService } from "../analysis/onboarding/store/APIService";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_AUTH;

const GameHistoryPage = () => {
  const { sessionId, isLoaded: authIsLoaded, isSignedIn } = useAuth();
  const { setUsername, username } = usePgnStore();

  const [devMode] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(devMode);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("user");

  const handleConnectSuccess = (username: string) => {
    setShowConnectDialog(false);
    setUsername(username);
    toast.success(`Successfully connected to Chess.com as ${username}`);
    // Show Premium dialog after successful connection
    setShowPremiumDialog(true);
  };

  const handleConnectClose = () => {
    setShowConnectDialog(false);
    // Show Premium dialog even if they close without connecting
    setShowPremiumDialog(true);
  };

  const handleClosePremium = () => {
    setShowPremiumDialog(false);
  };

  const handleGetPremium = () => {
    // Handle premium subscription logic here
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
      setShowConnectDialog(false);
      setShowPremiumDialog(false);

      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${sessionId}`,
            Accept: "application/json",
          },
        });

        if (response.data) {
          const profileData = response.data;
          const extractedUsername =
            profileData.username ||
            (profileData.data && profileData.data.username);

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
      }
    };

    fetchProfileData();
  }, [authIsLoaded, isSignedIn, sessionId, setUsername]);

  useEffect(() => {
    if (authIsLoaded && !isLoading && !username) {
      setShowConnectDialog(true);
    }
  }, [authIsLoaded, isLoading, username]);

  return (
    <>
      <main className="w-full px-4 py-4 space-y-[16px] bg-primary-white relative">
        {/* DEV: Toggle buttons for dialogs */}
        {devMode && (
          <div className="flex gap-2 mb-4 bg-yellow-100 p-2 rounded-md border border-yellow-300">
            <button
              onClick={() => setShowConnectDialog(!showConnectDialog)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              {showConnectDialog ? "Close" : "Open"} Chess Connect
            </button>
            <button
              onClick={() => setShowPremiumDialog(!showPremiumDialog)}
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
            >
              {showPremiumDialog ? "Close" : "Open"} Premium Dialog
            </button>
            <span className="text-xs self-center text-yellow-800">
              DEV MODE
            </span>
          </div>
        )}

        {/* Chess Connect Dialog */}
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

        {/* Premium Subscription Component - Now directly in the page */}
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
                <p className="text-xs text-gray-500 lg:text-[18px]">
                  {username ? `(${username})` : "(No username set)"}
                </p>
              </div>
            </div>

            <DialogButton />
          </div>

          <div className="xl:block xl:p-3 xl:border xl:border-primary-gray  xl:rounded-md bg-transparent xl:bg-white xl:shadow-card">
            <div className="font-semibold text-sm py-2 lg:text-xl">
              Overall Statistic
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Card className="p-3 h-[120px] lg:h-[147px] bg-gradient-to-br from-[#A855F7] to-[#CF9DFF] text-white rounded-lg overflow-hidden relative flex flex-col justify-between">
                <div className="flex items-center ">
                  <Swords className="h-4 w-4 mr-1" fill="white" />
                  <h1 className="text-sm lg:text-lg">Best Win (rating)</h1>
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <h1 className="text-lg font-bold lg:text-[28px]">
                      {"2,100"}
                    </h1>
                    <Star fill="white" />
                  </div>
                  <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
                    vs {"IM_ChessMaster"}
                  </span>
                </div>

                <Image
                  width={200}
                  height={200}
                  alt=""
                  src={"/my-game-history/background.png"}
                  className="top-5 right-0 absolute "
                />
                <Image
                  width={30}
                  height={30}
                  alt=""
                  src={"/my-game-history/star.png"}
                  className="top-10 right-[150px] absolute "
                />
              </Card>

              <Card className="p-3 h-[120px] lg:h-[147px] bg-[#F6FFFA] border-[1px] border-[#029A46] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <h1 className="text-sm font-light  lg:text-lg">Win Rate</h1>
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <h1 className="text-lg font-bold lg:text-[28px] bg-gradient-to-b from-[#029A46]  to-[#42F993] inline-block text-transparent bg-clip-text">
                      {"90%"}
                    </h1>
                  </div>
                  <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
                    {"+5% this month"}
                  </span>
                </div>
                <Image
                  width={200}
                  height={200}
                  alt=""
                  src={"/my-game-history/background-g.png"}
                  className="-top-3 left-0 absolute text-black "
                />
                <Image
                  width={20}
                  height={20}
                  alt=""
                  src={"/my-game-history/rectangle-g.png"}
                  className="top-10 left-[80px] absolute "
                />
              </Card>

              <Card className="p-3 h-[120px] lg:h-[147px] border-[1px] bg-[#F6F9FF] border-[#3871EC] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-blue-500" />
                  <h1 className="text-sm font-light lg:text-lg">
                    Average ELO Rating
                  </h1>
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <h1 className="text-lg font-bold lg:text-[28px] bg-gradient-to-b from-[#3871EC]  to-[#80A8FF] inline-block text-transparent bg-clip-text">
                      {"1,850"}
                    </h1>
                  </div>
                  <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
                    {"+25 points this month"}
                  </span>
                </div>

                <Image
                  width={200}
                  height={200}
                  alt=""
                  src={"/my-game-history/background-b.png"}
                  className="top-5 right-0 absolute text-black "
                />
                <Image
                  width={20}
                  height={20}
                  alt=""
                  src={"/my-game-history/rectangle-b.png"}
                  className="top-10 right-[150px] absolute "
                />
              </Card>

              <Card className="p-3 h-[120px] lg:h-[147px] border-[1px] border-[#DEDEDE] text-black rounded-lg overflow-hidden relative flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" fill="#eab308" />
                  <h1 className="text-sm font-light">Total Games</h1>
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <h1 className="text-lg font-bold lg:text-[28px]">
                      {"1,234"}
                    </h1>
                  </div>
                  <span className="text-xs mt-1 lg:mt-4 font-light lg:text-sm">
                    {"+45 this month"}
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="lg:border-2 lg:p-4 xl:p-0 lg:rounded-md bg-white">
          <div className="flex justify-center flex-col">
            <div className="xl:flex justify-center hidden">
              <button
                onClick={() => setActiveTab("user")}
                className={`flex-1 text-center py-3 text-lg
                ${
                  activeTab !== "user"
                    ? "text-black border-b border-light-40 shadow-[inset_1px_1px_1px_1px_rgba(0,0,0,0.1)]"
                    : "font-bold"
                }
                ${activeTab === "user" ? "rounded-tl-md" : ""}
                border-r border-gray-200`}
              >
                {username || "My Games"}
              </button>
              <button
                onClick={() => setActiveTab("other")}
                className={`flex-1 text-center py-3 text-lg
                ${
                  activeTab !== "other"
                    ? "text-black border-b border-light-40 shadow-[inset_1px_1px_1px_1px_rgba(0,0,0,0.1)]"
                    : "font-bold"
                }
                ${activeTab === "other" ? "rounded-tr-md" : ""}`}
              >
                Other Games
              </button>
            </div>
            <div className="mt-4">
              {activeTab === "user" && <UserHistory />}
              {activeTab === "other" && <OtherHistory />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default GameHistoryPage;
