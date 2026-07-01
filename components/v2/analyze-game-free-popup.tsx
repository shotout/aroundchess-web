"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AnalyzeGameFreePopup({ visible, onClose }: Props) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-[460] flex items-start justify-center p-4 sm:p-8 pt-6 sm:pt-8">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-[850px] bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="relative w-full aspect-[16/9] sm:aspect-[12/9]">
          <Image
            src="/images/homepage/analyze-game-for-free.png"
            alt="Play against AI: Analyze the Mistakes of your first game for free"
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
            priority
          />
        </div>

        <div className="px-6 pb-10 pt-2 flex justify-center">
          <button
            onClick={onClose}
            className="h-11 px-20 btn-primary text-white font-medium text-base rounded-full hover:opacity-90 transition-opacity"
          >
            Discover how it works
          </button>
        </div>
      </div>
    </div>
  );
}
