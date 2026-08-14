"use client";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { useLoadingNumber } from "@/app/store/loadingNumber";
import { usePgnStore } from "@/app/store/zustandStore";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoadingSpinner() {
  const [progress, setProgress] = useState(0);
  const { isLoading, dataAnalysis } = usePgnStore();
  const {
    setEstimateMinute,
    setEstimateSecond,
    estimateMinute,
    estimateSecond,
  } = useLoadingAPI();
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);

  useEffect(() => {
    const totalTime = estimateMinute * 60 + estimateSecond;
    if (totalTimeLeft == 0) {
      setTotalTimeLeft(totalTime);
    }
    setTimeLeft(totalTime);
  }, [estimateMinute, estimateSecond]);
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (dataAnalysis != null) {
      setProgress(100);
      setEstimateMinute(0);
      setEstimateSecond(0);
      setTimeLeft(0);
    }
    if (isLoading && progress < 100 && timeLeft != 0 && dataAnalysis == null) {
      interval = setInterval(() => {
        const newProgress = (1 - timeLeft / totalTimeLeft) * 100;
        setProgress(newProgress);
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 0.05;
        });
      }, 50);
    } else if (progress >= 100) {
      setProgress(100);
      setTimeLeft(0);
      setEstimateMinute(0);
      setEstimateSecond(0);
    }
    return () => clearInterval(interval);
  }, [isLoading, progress, timeLeft, dataAnalysis]);

  const rotationAngle = (progress / 100) * 360;

  return (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <div className="relative w-24 h-24">
        <svg
          className="absolute inset-0"
          width="100"
          height="100"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            className="text-gray-300"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        <svg
          className="absolute inset-0 transform -rotate-90"
          width="100"
          height="100"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient
              id="gradientColor"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#221AE9" />
              <stop offset="50%" stopColor="#9BBBFF" />
              <stop offset="100%" stopColor="#221AE9" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            stroke="url(#gradientColor)"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (progress / 100) * 251.2}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-700">
          {Math.round(progress)}%
        </div>

      </div>

      <p className="mt-4 sm:text-md text-[14px] --sm md:text-[36px] font-semibold text-gray-700">
        AI Analyzing Now...
      </p>
    </div>
  );
}
