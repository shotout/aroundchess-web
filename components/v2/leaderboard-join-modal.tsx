"use client";

import Image from "next/image";

interface LeaderboardJoinModalProps {
  title: string;
  description: string;
  image?: string;
  onBack: () => void;
  onPlayNow: () => void;
}

export function LeaderboardJoinModal({
  title,
  description,
  image = "/images/v2/leaderboard/leaderboard_search.png",
  onBack,
  onPlayNow,
}: LeaderboardJoinModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onBack}
    >
      <div
        className="w-full max-w-[420px] bg-white rounded-[24px] shadow-xl p-[24px] sm:p-[32px] flex flex-col items-center gap-[16px] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image}
          alt=""
          width={140}
          height={116}
          className="w-[120px] h-auto object-contain"
        />

        <h2 className="font-bold text-[18px] sm:text-[20px] text-[#111827]">{title}</h2>

        <p className="text-[14px] text-[#6B7280]">{description}</p>

        <div className="flex items-center gap-[12px] w-full pt-[8px]">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-[12px] rounded-full border border-[#221AE9] text-[#221AE9] font-semibold text-[15px] hover:bg-[#221AE9]/5 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onPlayNow}
            className="flex-1 py-[12px] rounded-full bg-[#221AE9] text-white font-semibold text-[15px] hover:opacity-90 transition-opacity"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}
