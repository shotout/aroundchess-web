"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroPlayVSAIPreview } from "./hero-play-vs-ai-preview";
import { AiOpponentPreviewBar } from "@/components/v2/ai-opponent-preview-bar";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function HeroGamePreview({ recommendedListHeightClass }: { recommendedListHeightClass?: string }) {
  const selectedColor = usePlayVSAIStore((s) => s.selectedColor);
  const boardWrapRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState(320);
  useEffect(() => {
    const el = boardWrapRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth > 0) setBoardWidth(el.clientWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const boardCardRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = boardCardRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setPanelHeight(h);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center mt-4 sm:mt-3">
      <div ref={boardCardRef} className="hidden sm:flex sm:w-[70%] self-start bg-white rounded-2xl shadow-lg border border-[#DEDEDE] p-3 sm:p-4 flex-col gap-2">
        <AiOpponentPreviewBar />
        <div ref={boardWrapRef} data-preview-board className="w-full">
          <TwoDChessboard
            position={START_FEN}
            boardWidth={boardWidth}
            orientation={selectedColor}
            arePiecesDraggable={false}
            arePiecesClickable={false}
            areArrowsAllowed={false}
            onPromotionPieceSelect={() => false}
          />
        </div>
        <Image
          src="/images/homepage/v2/homepage_board_asset_3.png"
          alt="Move legend"
          width={1050}
          height={36}
          className="w-full h-auto"
        />
        <div className="flex items-center justify-left gap-2 pt-2 sm:pt-2 border-t-2">
          <Image
            src="/images/homepage/v2/homepage_board_asset_4.png"
            alt=""
            width={86}
            height={88}
            className="w-[26px] h-auto shrink-0"
          />
          <p className="text-[clamp(10px,1.1vw,14px)] text-[#040404] whitespace-nowrap">
            <Link href="/login" className="font-semibold text-primary underline">
              Sign-in
            </Link>{" "}
            or{" "}
            <Link href="/register" className="font-semibold text-primary underline">
              sign-up
            </Link>{" "}
            to start the game
          </p>
        </div>
      </div>

      <div
        style={{ height: panelHeight }}
        className="w-full sm:w-[42%] max-sm:!h-auto bg-white rounded-2xl shadow-lg border-2 border-[#7CC0F2] p-3 sm:p-4 flex flex-col"
      >
        <HeroPlayVSAIPreview recommendedListHeightClass={recommendedListHeightClass} />
      </div>
    </div>
  );
}
