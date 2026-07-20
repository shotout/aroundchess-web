"use client";

import Image from "next/image";
import { X } from "lucide-react";

export type PlayVsAiConfirmType = "undo" | "hint";

const CONTENT: Record<
  PlayVsAiConfirmType,
  {
    icon: string;
    titleLine1: string;
    titleLine2: string;
    bodyStart: string;
    bodyKeyword: string;
    bodyMiddle: string;
    confirmLabel: string;
  }
> = {
  undo: {
    icon: "/images/v2/play-vs-ai/undo_move.png",
    titleLine1: "Are you sure you want to",
    titleLine2: "undo this move?",
    bodyStart: "Using the",
    bodyKeyword: "undo",
    bodyMiddle: "button takes back your last move,",
    confirmLabel: "Yes, undo move",
  },
  hint: {
    icon: "/images/v2/play-vs-ai/hint_move.png",
    titleLine1: "Are you sure you want",
    titleLine2: "to use a hint?",
    bodyStart: "Using a",
    bodyKeyword: "hint",
    bodyMiddle: "will reveal a suggested move,",
    confirmLabel: "Yes, show me a hint",
  },
};

interface PlayVsAiConfirmModalProps {
  type: PlayVsAiConfirmType;
  dontShowAgain: boolean;
  onDontShowAgainChange: (checked: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PlayVsAiConfirmModal({
  type,
  dontShowAgain,
  onDontShowAgainChange,
  onCancel,
  onConfirm,
}: PlayVsAiConfirmModalProps) {
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
            src={content.icon}
            alt=""
            width={200}
            height={200}
            className="w-[88px] h-auto object-contain"
          />
        </div>

        <h2 className="text-center font-bold text-[24px] leading-[130%] text-[#111827] mb-[12px]">
          {content.titleLine1}
          <br />
          {content.titleLine2}
        </h2>

        <p className="text-center text-[15px] leading-[150%] text-[#111827] mb-[14px]">
          {content.bodyStart} <span className="font-bold">{content.bodyKeyword}</span>{" "}
          {content.bodyMiddle}
          <br />
          but you will{" "}
          <span className="font-bold text-[#FD0000]">
            not earn any ELO points for this game
          </span>
          .
        </p>

        <label className="flex items-center justify-center gap-[8px] mb-[20px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => onDontShowAgainChange(e.target.checked)}
            className="w-[16px] h-[16px] accent-[#221AE9]"
          />
          <span className="text-[14px] text-[#111827]">
            Do not show this message again
          </span>
        </label>

        <div className="flex gap-[16px]">
          <button
            onClick={onCancel}
            className="w-1/2 py-[12px] rounded-full border border-[#221AE9] text-[#221AE9] font-semibold text-[15px] hover:bg-[#221AE908] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-[12px] rounded-full bg-[#221AE9] text-white font-semibold text-[15px] hover:bg-[#2d25ea] transition-colors"
          >
            {content.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
