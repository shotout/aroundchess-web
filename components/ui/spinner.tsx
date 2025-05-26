"use client";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { useLoadingNumber } from "@/app/store/loadingNumber";
import { usePgnStore } from "@/app/store/zustandStore";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoadingSpinner() {
  const [progress, setProgress] = useState(0);
  const { isLoading, dataAnalysis } = usePgnStore(); // Get PGN from the Zustand store
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
      // Update every 50ms for smooth animation
      interval = setInterval(() => {
        const newProgress = (1 - timeLeft / totalTimeLeft) * 100;
        setProgress(newProgress);
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            // setIsRunning(false);
            return 0;
          }
          return prev - 0.05; // Decrement by 50ms in seconds
        });
      }, 50);
    } else if (progress >= 100) {
      setProgress(100);
      setTimeLeft(0);
      setEstimateMinute(0);
      setEstimateSecond(0);
      // setIsRunning(false);
    }
    // console.log("cek data analysis", dataAnalysis);
    return () => clearInterval(interval);
  }, [isLoading, progress, timeLeft, dataAnalysis]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (dataAnalysis == null && progress <= 95) {
  //       setProgress((prev) =>
  //         prev < 95 ? prev + 5 : 95
  //       // prev < 99 ? prev + Math.floor(Math.random() * 10) + 3 : 99
  //       );
  //     } else if (dataAnalysis != null) {
  //       setProgress(100);
  //     }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [dataAnalysis]);

  // Calculate rotation angle for the image
  const rotationAngle = (progress / 100) * 360;

  return (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <div className="relative w-24 h-24">
        {/* Background Circle */}
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

        {/* Progress Circle with Gradient */}
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

        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-700">
          {Math.round(progress)}%
        </div>

        {/* <div
          className="absolute w-6 h-6 bg-[red] transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `0`, // Moves to edge of progress circle
            left: "0",
            transform: `rotate(${rotationAngle}deg) translateX(50px) rotate(-${rotationAngle}deg)`,
          }}
        >
          <Image
            alt="logo"
            src="/icons/hero-section.png"
            className="w-4 h-4 object-contain"
            width={1000}
            height={1000}
          />
        </div> */}
      </div>

      <p className="mt-4 sm:text-md text-sm md:text-[36px] font-semibold text-gray-700">
        AI Analyzing Now...
      </p>
    </div>
  );
}
