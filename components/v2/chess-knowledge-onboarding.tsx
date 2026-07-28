"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useProfileStore } from "@/app/store/profile";
import { queuePlaygroundTour } from "@/components/v2/playground-tour-gate";

const BASE_URL = process.env.BASE_URL;

const OPTIONS = [
  {
    level: 1,
    label: "Just Starting Out",
    image: "/images/homepage/v2/pawn.png",
  },
  {
    level: 2,
    label: "I know the basics",
    image: "/images/homepage/v2/knight.png",
  },
  {
    level: 3,
    label: "I know common strategies and patterns",
    image: "/images/homepage/v2/rook.png",
  },
  {
    level: 4,
    label: "I am an advanced player",
    image: "/images/homepage/v2/queen.png",
  },
];

export default function ChessKnowledgeOnboarding() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { sessionId, setProfile } = useProfileStore();
  const router = useRouter();

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await fetch(`${BASE_URL}/profile/onboard-elo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ level: selectedLevel }),
      });

      // The stored profile was fetched at login, before this level existed, so
      // re-read it now — otherwise profile.onboardElo stays empty and the play
      // page recommends beginner opponents regardless of what was picked here.
      const profileResponse = await fetch(`${BASE_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      });
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.data ?? profileData);
      }
    } catch (error) {
      console.error("Failed to save chess level:", error);
    } finally {
      sessionStorage.setItem("showAnalyzePopup", "true");
      // A brand-new account always gets the playground tour — onboarding is
      // the only thing that queues an auto-run.
      queuePlaygroundTour();
      router.push("/playground/play-vs-ai");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-black hover:text-blue-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-medium text-black flex-grow text-center mr-5">
          Your knowledge about Chess
        </h1>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((option) => {
          const isSelected = selectedLevel === option.level;
          return (
            <button
              key={option.level}
              onClick={() => setSelectedLevel(option.level)}
              className={`
                flex items-center justify-between
                w-full px-4 py-3 rounded-xl border-2
                transition-colors text-left
                ${
                  isSelected
                    ? "border-blue-base bg-white"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex-shrink-0 relative
                    ${isSelected ? "border-blue-base" : "border-gray-400"}
                  `}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-base" />
                    </div>
                  )}
                </div>
                <span
                  className={`font-medium text-sm sm:text-base ${
                    isSelected ? "text-blue-base" : "text-black"
                  }`}
                >
                  {option.label}
                </span>
              </div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <Image
                  src={option.image}
                  alt={option.label}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleFinish}
        disabled={isLoading}
        className="w-full h-12 btn-primary text-white font-medium text-base rounded-full transition-colors disabled:opacity-70"
      >
        {isLoading ? "Saving..." : "Finish"}
      </button>
    </div>
  );
}
