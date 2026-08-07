"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { GameLeaveGuardType } from "@/app/store/gameLeaveGuard";

const ICON = "/images/v2/play-vs-ai/warning_knight.png";

const LOSE_PROGRESS = "You will lose all progress in your current game.";

const CONTENT: Record<
  GameLeaveGuardType,
  { title: string; body: ReactNode; confirmLabel: string }
> = {
  resign: {
    title: "Are you sure you want to resign?",
    body: (
      <>
        Resigning will count as a loss, and you will
        <br />
        <span className="font-bold text-[#FD0000]">
          lose ELO points for this game
        </span>
        .
      </>
    ),
    confirmLabel: "Resign",
  },
  restart: {
    title: "Are you sure you want to restart this game?",
    body: LOSE_PROGRESS,
    confirmLabel: "Start new Game",
  },
  leaderboard: {
    title: "Are you sure you want to open the Leaderboard?",
    body: LOSE_PROGRESS,
    confirmLabel: "Go to the Leaderboard",
  },
  leave: {
    title: "Are you sure you want to leave this Game?",
    body: "Leaving this game will lead you to the previous page and end your current game. Your progress will not be saved.",
    confirmLabel: "Leave Game",
  },
};

interface PlayVsAiLeaveGuardModalProps {
  type: GameLeaveGuardType;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PlayVsAiLeaveGuardModal({
  type,
  onCancel,
  onConfirm,
}: PlayVsAiLeaveGuardModalProps) {
  const content = CONTENT[type];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[545px] bg-white rounded-2xl shadow-2xl px-[24px] sm:px-[48px] py-[28px]">
        <button
          onClick={onCancel}
          className="absolute top-[18px] right-[20px] text-[#111827] hover:text-[#374151]"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-[16px]">
          <Image
            src={ICON}
            alt=""
            width={200}
            height={200}
            className="w-[132px] h-auto object-contain"
          />
        </div>

        <h2 className="mx-auto max-w-[380px] text-center font-bold text-[24px] leading-[130%] text-[#111827] mb-[12px]">
          {content.title}
        </h2>

        <p className="mx-auto max-w-[420px] text-center text-[15px] leading-[150%] text-[#111827] mb-[20px]">
          {content.body}
        </p>

        <div className="flex flex-col gap-[12px]">
          <button
            onClick={onConfirm}
            className="w-full py-[12px] rounded-full bg-[#221AE9] text-white font-semibold text-[15px] hover:bg-[#2d25ea] transition-colors"
          >
            {content.confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-[12px] rounded-full border border-[#221AE9] text-[#221AE9] font-semibold text-[15px] hover:bg-[#221AE908] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
