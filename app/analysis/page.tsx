"use client";
import Navigation from "@/components/navigator/navigation";
import AnalysisLatestGame from "./AnalysisLatestGame";
import AnalysisResult from "./AnalysisResult";
import { useEffect, useState } from "react";
import { usePgnStore } from "../store/zustandStore";
import { motion } from "framer-motion";
export default function AnalysisPage() {
  const { setHideDiv, hideDiv } = usePgnStore(); // Get PGN from the Zustand store

  const [isVisible, setIsVisible] = useState<boolean>(true);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window?.innerWidth <= 1024) {
        if (window?.scrollY > lastScrollY) {
          setHideDiv(true);
          setIsVisible(false);
        } else if (window?.scrollY == 0) {
          setHideDiv(false);
          setIsVisible(true);
        }
      }
      lastScrollY = window?.scrollY;
      console.log("scrolling", lastScrollY);
    };
    window?.addEventListener("scroll", handleScroll);
    return () => window?.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <Navigation>
      <div className="flex flex-col overflow-y-auto">
        <div
          className={`flex flex-col bg-white px-2 sm:px-4 md:px-6 lg:px-6 pb-2 sm:pb-4 md:pb-6 lg:pb-8 ${
            hideDiv && "hidden"
          }`}
        >
          <h2 className="text-md pt-4 text-center lg:text-left sm:text-lg md:text-xl lg:text-2xl font-bold">
            Analysis Result from{" "}
            <span className="text-[#4E7838]">Chess.com</span>
          </h2>
          <span className="hidden lg:block text-xs sm:text-sm md:text-md lg:text-lg">
            Discover an Analysis of your latest Chess.com Game.
          </span>
          <div className="hidden lg:block text-xs sm:text-sm md:text-md lg:text-lg">
            AI-powered chess analysis provides deep insights into positional and
            tactical aspects of a game. It evaluates piece coordination, pawn
            structure, king safety, and overall positional advantages, helping
            players understand strategic strengths and weaknesses
          </div>
        </div>
        <div className="flex flex-col xl:flex-row-reverse gap-4 bg-white px-4">
          <AnalysisResult />
          <div className="xl:w-3/4">
            <AnalysisLatestGame />
          </div>
        </div>
      </div>
    </Navigation>
  );
}
