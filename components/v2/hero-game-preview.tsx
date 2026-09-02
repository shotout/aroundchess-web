"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroPlayVSAIPreview } from "./hero-play-vs-ai-preview";
import { AiOpponentPreviewBar } from "@/components/v2/ai-opponent-preview-bar";
import { PieceAvatar } from "@/components/v2/piece-avatar";
import { useEffectiveElo } from "@/components/v2/hooks/useEffectiveElo";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { useProfileStore } from "@/app/store/profile";
import { usePgnStore } from "@/app/store/zustandStore";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";

// Standard starting position for the (non-interactive) board preview.
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Footer strip under the preview board: a prompt to sign in for visitors, the
 * signed-in player's own avatar and username once they have.
 */
function BoardFooterIdentity() {
  const { profile, sessionId, hydrated } = useProfileStore();
  const { username: pgnUsername } = usePgnStore();
  // Same resolver the play page uses. Not leaderboard.my_elo directly: the
  // homepage never fetches leaderboard data, so this falls back to the
  // onboarding rating from /profile, and returns 0 when neither is known.
  const elo = useEffectiveElo();
  const [pictureFailed, setPictureFailed] = useState(false);

  // Gated on `hydrated`: the store rehydrates from localStorage after mount, so
  // reading sessionId any earlier would render the signed-in strip on the
  // client while the server rendered the signed-out one.
  const isSignedIn = hydrated && (sessionId?.length ?? 0) > 0;
  const displayName = profile?.username || profile?.name || pgnUsername || "";
  const pictureUrl = pictureFailed ? null : profile?.imageUrl || null;

  if (!isSignedIn) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      {/* Sized off the in-game player card, not the 26px visitor placeholder
          this row used to share: a two-line name + ELO block needs an avatar
          tall enough to sit against both lines. */}
      {pictureUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pictureUrl}
          alt=""
          className="w-[40px] h-[40px] rounded-full object-cover shrink-0"
          onError={() => setPictureFailed(true)}
        />
      ) : (
        // No picture uploaded (or it failed to load) — the app's standard pawn
        // fallback rather than the visitor placeholder.
        <PieceAvatar
          seed={displayName || "user"}
          className="w-[40px] h-[40px]"
          pieceClassName="w-[17px] h-[22px]"
        />
      )}
      {/* text-left because the hero wrapper sets text-center, which cascades
          in: the username fills the width so it looks left-aligned anyway, but
          the shorter ELO line centered itself under it.
          min-w-0 so a long username truncates instead of stretching the row. */}
      <div className="flex flex-col leading-tight min-w-0 text-left">
        <p className="truncate text-[clamp(13px,1.35vw,17px)] font-semibold text-[#040404]">
          {displayName}
        </p>
        {/* Hidden rather than shown as "ELO 0" while an account is still
            calibrating — same rule as the in-game player card. */}
        {elo > 0 && (
          <span className="text-[clamp(11px,1.05vw,13px)] text-[#6B7280]">
            ELO {elo}
          </span>
        )}
      </div>
    </>
  );
}

export function HeroGamePreview({ recommendedListHeightClass }: { recommendedListHeightClass?: string }) {
  // Flip the preview board when "Black" is chosen in the color picker.
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

  // Match the opponent panel's height to the board card so the AI list
  // scrolls inside instead of stretching the whole column taller than the
  // board. Measured on desktop; mobile keeps auto height.
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
          <BoardFooterIdentity />
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
