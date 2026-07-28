"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HeroPlayVSAIPreview } from "./hero-play-vs-ai-preview";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { GamePlayerAvatar } from "@/components/v2/game-player-avatar";
import { AiOpponentPreviewBar } from "@/components/v2/ai-opponent-preview-bar";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";

// Standard starting position for the (non-interactive) board preview.
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function PlayHeroGamePreview({ recommendedListHeightClass }: { recommendedListHeightClass?: string }) {
  const { profile } = useProfileStore();
  const { leaderboard } = usePlayPageStore();
  // Flip the preview board when "Black" is chosen in the color picker.
  const selectedColor = usePlayVSAIStore((s) => s.selectedColor);
  const username = profile?.username || profile?.name || "User";
  const elo = leaderboard?.my_elo ?? 0;
  // Same seed recipe as the sidebar so the placeholder color is stable per user.
  const avatarSeed = profile?.username || profile?.name || profile?.email || "user";

  // react-chessboard needs a pixel width; track the container so the preview
  // board stays responsive with the panel.
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

  // Match the opponent panel's height to the board card so the AI list
  // scrolls inside instead of stretching the whole column taller than the
  // board. (Normal document flow has no definite height to size against, so
  // the height is measured and applied on desktop; mobile keeps auto height.)
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
    <div id="play-vs-ai" data-tour-anchor="playground-hero" className="w-full flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center mt-4 sm:mt-3">
      <div ref={boardCardRef} data-tour-anchor="board-preview" className="hidden sm:flex sm:w-[70%] self-start bg-white rounded-2xl shadow-lg p-3 sm:p-4 flex-col gap-2">
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
        <div data-preview-bar="player" className="flex items-center justify-left gap-2 pt-2 sm:pt-2 border-t-2">
          <GamePlayerAvatar imageUrl={profile?.imageUrl} seed={avatarSeed} />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-bold text-[clamp(14px,1.4vw,18px)] text-[#040404] truncate">
              {username}
            </span>
            <span className="text-[clamp(11px,1.1vw,14px)] text-gray-500">
              ELO {elo}
            </span>
          </div>
        </div>
      </div>

      <div
        data-tour-anchor="opponent-panel"
        style={{ height: panelHeight }}
        className="w-full sm:w-[42%] max-sm:!h-auto bg-white rounded-2xl shadow-lg border-2 border-[#81CFF3] p-3 sm:p-4 flex flex-col"
      >
        <h1 className="sm:hidden text-center font-bold text-[28px] text-[#221AE9] mb-[8px]">
          Play VS AI
        </h1>
        <HeroPlayVSAIPreview recommendedListHeightClass={recommendedListHeightClass} />
      </div>
    </div>
  );
}
