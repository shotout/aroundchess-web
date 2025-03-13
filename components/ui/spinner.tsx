"use client";
import { usePgnStore } from "@/app/store/zustandStore";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoadingSpinner() {
  const [progress, setProgress] = useState(0);
  const { isLoading } = usePgnStore(); // Get PGN from the Zustand store

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoading && progress <=95) {
        setProgress((prev) => (prev < 100 ? prev + 5 : 100));
      }else if (!isLoading) {
        setProgress(100);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
          {progress}%
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

      <p className="mt-4 text-lg font-semibold text-gray-700">
        AI Analyzing Now...
      </p>
    </div>
  );
}
