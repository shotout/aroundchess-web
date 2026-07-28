"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const HEADLINE = ["Play against AI:", "Analyze the Mistakes of your", "first game for free"];

export default function AnalyzeGameFreePopup({ visible, onClose }: Props) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-[460] flex items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ---------- mobile: the banner ships as one flattened asset ---------- */}
      <div className="relative z-10 sm:hidden w-full h-full flex flex-col items-center overflow-y-auto bg-gradient-to-b from-[#DCF0FB] via-white to-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-[#101828] hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-7 h-7" strokeWidth={2.5} />
        </button>

        {/* The asset carries 320 fully transparent rows below the artwork
            (content ends at row 1384/1704). Cropping those plus the sparse
            tail of the diamond fan pulls the CTA up under the image. */}
        <div className="relative w-full shrink-0 aspect-[786/1210]">
          <Image
            src="/images/v2/tutorial/Analyze 10 Games for Free - Banner.png"
            alt="Play against AI: Analyze the Mistakes of your first game for free"
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "top" }}
            priority
          />
        </div>

        <div className="w-full px-5 pt-3 pb-6 shrink-0">
          <button
            onClick={onClose}
            className="h-12 w-full btn-primary text-white font-medium text-base rounded-full whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Discover how it works
          </button>
        </div>
      </div>

      {/* ---------- desktop: composed from the split layers ---------- */}
      {/* Card is ~1:1 (798x780 in the design), so cap the width by viewport
          height too and every child can then be sized as a % of the width. */}
      <div className="relative z-10 hidden sm:flex flex-col w-full max-w-[min(800px,90vh)] bg-white rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-7 right-7 z-40 text-[#101828] hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-7 h-7" strokeWidth={2.5} />
        </button>

        {/* Art stage: top of the card down to the bottom of the board. */}
        <div className="relative w-full aspect-[798/575]">
          {/* Sunburst overflows the card on all sides and is clipped by it. */}
          <Image
            src="/images/v2/tutorial/star-background.png"
            alt=""
            width={1548}
            height={1060}
            aria-hidden="true"
            className="absolute z-0 left-1/2 -translate-x-1/2 top-[-18.8%] w-[136%] max-w-none h-auto"
            priority
          />
          <Image
            src="/images/v2/tutorial/stars-background.png"
            alt=""
            width={1214}
            height={407}
            aria-hidden="true"
            className="absolute z-10 left-1/2 -translate-x-1/2 top-[10.3%] w-[76%] max-w-none h-auto"
            priority
          />
          <h2 className="absolute z-20 left-1/2 -translate-x-1/2 top-[21.2%] w-[88%] text-center font-bold leading-[1.28] text-[#2422A2] text-[22px] md:text-[25px] lg:text-[28px]">
            {HEADLINE.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <Image
            src="/images/v2/tutorial/analyze-chessboard.png"
            alt="Opening, Movement Details, Middlegame, Threats, Endgame and Improvement analysis on a chess board"
            width={1040}
            height={640}
            className="absolute z-30 left-1/2 -translate-x-1/2 top-[43.8%] w-[65%] max-w-none h-auto"
            priority
          />
        </div>

        <div className="w-full flex justify-center pt-[5.5%] pb-[17%]">
          <button
            onClick={onClose}
            className="h-12 w-[45.4%] min-w-[260px] btn-primary text-white font-medium text-base rounded-full whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Discover how it works
          </button>
        </div>
      </div>
    </div>
  );
}
