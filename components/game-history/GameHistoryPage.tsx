"use client";

import Analytics from "@/components/game-history/Analytics";
import DialogButton from "@/components/game-history/DialogButton";
import GamesTab from "@/components/game-history/GamesTab/GamesTab";
import Performance from "@/components/game-history/Performance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

import {
  Star,
  Target,
  Trophy,
  Swords,
  BarChart2,
  Download,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChessConnectDialog } from "../analysis/onboarding/ChessConnectPopover";
import { useAuth } from "@clerk/nextjs";
import { usePgnStore } from "@/app/store/zustandStore";
import UserHistory from "./UserHistory";
import OtherHistory from "./OtherHistory";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const GameHistoryPage = () => {
  const Section = ["Blitzmystic", "Other Games"];
  const [sect, setSect] = useState(Section[0]);
  const { sessionId, isLoaded: authIsLoaded, isSignedIn } = useAuth();
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  const { setUsername, username } = usePgnStore();

  const handleConnectSuccess = (username: string) => {
    setShowConnectDialog(false);
    setUsername(username);
    toast.success(`Successfully connected to Chess.com as ${username}`);
  };

  // Fetch profile as soon as authentication is loaded
  useEffect(() => {
    const fetchProfileData = async () => {
      // Only proceed if auth is loaded and user is signed in
      if (!authIsLoaded || !isSignedIn || !sessionId) {
        if (authIsLoaded) {
          setIsLoading(false);
        }
        return;
      }

      // Prevent multiple fetch attempts
      if (fetchAttempted) return;
      setFetchAttempted(true);

      setIsLoading(true);
      console.log("Fetching profile data...");

      try {
        console.log("Using sessionId:", sessionId.substring(0, 10) + "...");

        // Make direct API request with authentication token
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${sessionId}`,
            Accept: "application/json",
          },
        });

        console.log("Profile API response:", response.data);

        // Extract username from response data
        if (response.data) {
          const profileData = response.data;
          const extractedUsername =
            profileData.username ||
            (profileData.data && profileData.data.username);

          if (extractedUsername) {
            console.log("Found username:", extractedUsername);
            setUsername(extractedUsername);
            setShowConnectDialog(false);
          } else {
            console.log("No username found in profile");
            setShowConnectDialog(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setShowConnectDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [authIsLoaded, isSignedIn, sessionId, setUsername, fetchAttempted]);

  return (
    <>
      <main className="w-full px-4 py-4 space-y-[16px] bg-primary-white">
        {/* Chess.com Connection Dialog */}
        <ChessConnectDialog
          open={showConnectDialog}
          onOpenChange={setShowConnectDialog}
          onSuccess={handleConnectSuccess}
        />

        {/* top menu */}
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

          {/* overall statistic */}
          <div className="xl:block xl:p-3 xl:border xl:border-primary-gray xl:rounded-md bg-transparent xl:bg-white shadow-card">
            <div className="font-semibold text-sm py-2 lg:text-xl">
              Overall Statistic
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Best Win Card */}
              <Card className="p-3 h-[120px] lg:h-[147px] bg-gradient-to-br from-[#A855F7] to-[#CF9DFF] text-white rounded-lg overflow-hidden relative flex flex-col justify-between">
                <div className="flex items-center">
                  <Swords className="h-4 w-4" fill="white" />
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
              </Card>

              {/* Win Rate Card */}
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
              </Card>

              {/* Average ELO Card */}
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
              </Card>

              {/* Total Games Card */}
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

        {/* Tab navigation */}
        <div className="lg:border-2 lg:p-4 xl:p-0 lg:rounded-md bg-white">
          <div className="flex justify-center flex-col">
            {/* Tab navigation */}
            <div className="xl:flex justify-center hidden">
              {Section.map((t, index) => (
                <button
                  key={index}
                  onClick={() => setSect(t)}
                  className={`flex-1 text-center py-3  text-lg
            ${
              sect !== t
                ? "text-black border-b  border-light-40 shadow-[inset_1px_1px_1px_1px_rgba(0,0,0,0.1)]"
                : "font-bold"
            }
            ${
              t === "Blitzmystic" && sect === "Blitzmystic"
                ? "rounded-tl-md"
                : t === "Other Games" && sect === "Other Games"
                ? "rounded-tr-md"
                : ""
            }
            ${index === 0 ? "border-r border-gray-200" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <div>{sect === "Blitzmystic" && <UserHistory />}</div>
              <div>{sect === "Other Games" && <OtherHistory />}</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default GameHistoryPage;
