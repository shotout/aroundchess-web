"use client";

import Image from "next/image";
import Lottie from "lottie-react";
import { Bookmark, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Chess } from "chess.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import TwoDChessboard from "@/components/chessboard/2d/TwoDChessboard";
import { CustomChessArrows } from "@/components/game-history/components/CustomChessArrows";
import { EloOdometer } from "@/components/v2/elo-odometer";
import { preloadLottie, useLottieData } from "@/components/v2/hooks/useLottieData";
import { pickRecommendedOpponents } from "@/components/v2/play-vs-ai-roster-data";
import { openDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";
import { getLocalDateStamp, useStreakStore } from "@/app/store/streak";

// Interactive remake of the playground tutorial video (tutorial.json).
// Fully self-contained: renders in a portal above everything (win/lose
// modals sit at z-[500]), never mutates page state, and only reads the
// two data-tour-anchor attributes on the play hero to draw its spotlight.

const WIN_LOTTIE = "/images/v2/play-vs-ai/WON.min.json";
const LOSE_LOTTIE = "/images/v2/play-vs-ai/LOSE.min.json";
const BOARD_IMG = "/images/homepage/v2/homepage_board_asset_2.png";

const DONE_KEY = "ac_playground_tour_done_v1";

// Programmatic trigger: call startPlaygroundTour() from any component (e.g.
// a "Replay tutorial" button), or run __startPlaygroundTour() in the browser
// console while on the play page — both replay the tour regardless of the
// "already seen" flag.
export const PLAYGROUND_TOUR_EVENT = "playground-tour:start";

export function startPlaygroundTour() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PLAYGROUND_TOUR_EVENT));
  }
}

declare global {
  interface Window {
    __startPlaygroundTour?: () => void;
  }
}

type TourStep = {
  title: string;
  content: string;
  /**
   * [data-tour-anchor] candidates to spotlight — the first one that is
   * actually visible wins (the board preview is hidden on mobile, where the
   * opponent panel takes its place). Demo steps have none.
   */
  anchors?: string[];
  /** extra anchors merged into the spotlight so they stay undimmed */
  include?: string[];
  /** which anchor to scroll into view (defaults to the resolved primary) */
  scrollAnchor?: string;
  /** px kept clear above the scrolled anchor (defaults to 110, the navbar) */
  scrollMargin?: number;
  /**
   * pins the tooltip's bottom edge at primaryRect.top + this offset instead
   * of the automatic above/below/over placement (falls back to "over" when
   * the tooltip would leave the viewport)
   */
  tooltipBottomAt?: number;
  /** auto-scroll the opponent list inside the target, like the video demo */
  scrollShowcase?: boolean;
  demo?: "win" | "lose" | "analyze";
};

const STEPS: TourStep[] = [
  {
    title: "Tutorial: Welcome to The Playground",
    content: "Start your Game against one of our many AI opponents.",
    anchors: ["board-preview", "opponent-panel"],
    include: ["play-top-bar"],
    scrollAnchor: "play-top-bar",
    tooltipBottomAt: 96,
  },
  {
    title: "Tutorial: Choose your opponent",
    content:
      "Select an Opponent with an ELO score close to yours. The Recommended tab shows the best match automatically. Hit Start Game - and the match begins.",
    anchors: ["opponent-panel"],
    scrollMargin: 224,
    tooltipBottomAt: -14,
    scrollShowcase: true,
  },
  {
    title: "Tutorial: Rise up when you win",
    content:
      "Winning games can increase your ELO score. Every match affects your ELO score based on the skill level of your opponent.",
    demo: "win",
  },
  {
    title: "Tutorial: When you lose a game, your ELO decreases.",
    content:
      "But don't worry – tap Discover Mistakes to review where the game went wrong and learn how to play better next time.",
    demo: "lose",
  },
  {
    title: "Tutorial: Analyze Game",
    content:
      "Here you can discover your biggest mistakes and get a suggestion how to avoid them in the future.",
    demo: "analyze",
  },
];

const FINALE_INDEX = STEPS.length; // virtual "You're All Set" screen

type Rect = { top: number; left: number; width: number; height: number };
type Viewport = { vw: number; vh: number };

function findAnchor(anchors: string[] | undefined): HTMLElement | null {
  for (const anchor of anchors ?? []) {
    const el = document.querySelector<HTMLElement>(
      `[data-tour-anchor="${anchor}"]`
    );
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

function toRect(r: DOMRect): Rect {
  return {
    top: Math.round(r.top),
    left: Math.round(r.left),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
}

function unionRects(a: Rect, b: Rect): Rect {
  const top = Math.min(a.top, b.top);
  const left = Math.min(a.left, b.left);
  const right = Math.max(a.left + a.width, b.left + b.width);
  const bottom = Math.max(a.top + a.height, b.top + b.height);
  return { top, left, width: right - left, height: bottom - top };
}

function sameRect(a: Rect | null, b: Rect | null): boolean {
  if (a === null || b === null) return a === b;
  return (
    a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height
  );
}

/* ------------------------------- tooltip -------------------------------- */

function TourTooltip({
  step,
  index,
  onSkip,
  onPrev,
  onNext,
  caret,
}: {
  step: TourStep;
  index: number;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  caret?: "top" | "bottom";
  }) {
  const isLast = index === STEPS.length - 1;
  return (
    <div className="relative w-[min(430px,calc(100vw-24px))] rounded-[14px] bg-white shadow-2xl ring-2 ring-[#7CC0F2] p-[14px] sm:p-[16px] pointer-events-auto">
      {caret && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 ${
            caret === "bottom" ? "-bottom-[7px] shadow-md" : "-top-[7px]"
          }`}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold text-[13px] sm:text-[14px] text-[#221AE9] leading-snug">
          {step.title}
        </p>
        <span className="text-[11px] sm:text-[12px] text-gray-400 font-medium shrink-0 pt-[1px]">
          {index + 1}/{STEPS.length}
        </span>
      </div>
      <p className="text-[12px] sm:text-[13px] text-gray-600 mt-[6px] leading-relaxed">
        {step.content}
      </p>
      <div className="flex items-center justify-between mt-[12px]">
        <button
          type="button"
          onClick={onSkip}
          className="px-4 py-[6px] rounded-[8px] bg-[#D9F1FF] text-[#221AE9] text-[12px] sm:text-[13px] font-semibold hover:bg-[#c4e9ff] transition-colors"
        >
          Skip
        </button>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-[6px] rounded-[8px] bg-[#D9F1FF] text-[#221AE9] text-[12px] sm:text-[13px] font-semibold hover:bg-[#c4e9ff] transition-colors"
            >
              Prev
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-[6px] rounded-[8px] bg-[#221AE9] text-white text-[12px] sm:text-[13px] font-semibold hover:bg-[#2d25ea] transition-colors"
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- demo (mock) modals --------------------------- */
// Non-interactive replicas of the real win/lose/analysis screens, so the
// tour can show them without touching any live game state.

function DemoWinCard() {
  const animationData = useLottieData(WIN_LOTTIE);
  const opponents = useMemo(() => pickRecommendedOpponents(400), []);
  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden select-none pointer-events-none">
      <div className="w-[64%] mx-auto aspect-[540/400] max-h-[24vh]">
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={false}
            rendererSettings={{ preserveAspectRatio: "xMidYMin slice" }}
            className="w-full h-full"
          />
        )}
      </div>
      <div className="px-[20px] pb-[16px]">
        <h2 className="text-center font-bold text-[22px] text-[#34C759] mt-[4px] mb-[10px]">
          You Won
        </h2>
        <div className="flex items-center justify-center gap-[8px] mb-[12px]">
          <div className="flex items-center justify-between gap-[12px] bg-[#34C759] rounded-[10px] px-[14px] py-[7px] flex-1 min-w-0 max-w-[280px]">
            <span className="text-white font-semibold text-[13px] whitespace-nowrap">
              Your Current ELO
            </span>
            <span className="flex items-center gap-[6px]">
              <svg viewBox="0 0 20 20" fill="none" className="w-[15px] h-[15px] shrink-0">
                <path d="M10 2L17 10H13V15H7V10H3L10 2Z" fill="white" />
                <rect x="7" y="16.5" width="6" height="1.8" rx="0.9" fill="white" />
              </svg>
              <span className="text-white font-bold text-[20px] leading-none pt-[2px]">
                <EloOdometer from={375} to={400} delay={0.4} duration={1.4} />
              </span>
            </span>
          </div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.35 }}
            className="text-[#34C759] font-bold text-[18px] shrink-0"
          >
            +25
          </motion.span>
        </div>
        <p className="text-center font-bold text-[13px] text-[#111827]">
          That was a good call!
        </p>
        <p className="text-center text-[12px] text-[#111827] mb-[10px]">
          Ready to face more challenging opponents?
        </p>
        <div className="rounded-[12px] border border-[#7CC0F2] p-[8px] mb-[10px]">
          <p className="text-center text-[11px] font-medium text-[#111827] mb-[4px]">
            Challenge those Opponents next:
          </p>
          <div className="grid grid-cols-4 gap-[4px]">
            {opponents.map((opponent, i) => (
              <div
                key={opponent.id}
                className={`flex flex-col items-center gap-[2px] p-[4px] rounded-[10px] border ${
                  i === 0 ? "border-[#7CC0F2] bg-[#E6F7FE]" : "border-transparent"
                }`}
              >
                <Image
                  src={opponent.img}
                  alt={opponent.name}
                  width={40}
                  height={40}
                  className="w-[30px] h-[30px] rounded-full object-cover"
                />
                <span className={`text-[11px] font-semibold truncate max-w-full ${i === 0 ? "text-[#221AE9]" : "text-[#111827]"}`}>
                  {opponent.name}
                </span>
                <span className={`text-[10px] whitespace-nowrap ${i === 0 ? "text-[#221AE9]" : "text-[#6B7280]"}`}>
                  ELO {opponent.elo}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full py-[10px] rounded-full bg-[#221AE9] text-white font-semibold text-[13px] text-center">
          Start Game
        </div>
      </div>
    </div>
  );
}

function DemoLoseCard() {
  const animationData = useLottieData(LOSE_LOTTIE);
  return (
    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden select-none pointer-events-none">
      <div className="w-[72%] mx-auto aspect-[540/400] max-h-[26vh]">
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={false}
            rendererSettings={{ preserveAspectRatio: "xMidYMin slice" }}
            className="w-full h-full"
          />
        )}
      </div>
      <div className="px-[20px] pb-[18px]">
        <h2 className="text-center font-bold text-[22px] text-[#DC2626] mt-[4px] mb-[10px]">
          You Lost
        </h2>
        <div className="flex items-center justify-center gap-[8px] mb-[12px]">
          <div className="flex items-center justify-between gap-[12px] bg-[#DC2626] rounded-[10px] px-[14px] py-[7px] flex-1 min-w-0 max-w-[280px]">
            <span className="text-white font-semibold text-[13px] whitespace-nowrap">
              Your Current ELO
            </span>
            <span className="flex items-center gap-[6px]">
              <svg viewBox="0 0 20 20" fill="none" className="w-[15px] h-[15px] shrink-0">
                <path d="M10 18L3 10H7V5H13V10H17L10 18Z" fill="white" />
                <rect x="7" y="1.7" width="6" height="1.8" rx="0.9" fill="white" />
              </svg>
              <span className="text-white font-bold text-[20px] leading-none pt-[2px]">
                <EloOdometer from={400} to={375} delay={0.4} duration={1.4} />
              </span>
            </span>
          </div>
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.35 }}
            className="text-[#DC2626] font-bold text-[18px] shrink-0"
          >
            -25
          </motion.span>
        </div>
        <p className="text-center font-bold text-[13px] text-[#111827]">
          That was close!
        </p>
        <p className="text-center text-[12px] text-[#111827] mb-[12px]">
          Discover your biggest mistakes now to see how to win next time!
        </p>
        <div className="w-full py-[10px] rounded-full bg-[#221AE9] text-white font-semibold text-[13px] text-center">
          Discover Mistakes
        </div>
      </div>
    </div>
  );
}

/* ------------------- scripted demo game (chess.js) ---------------------- */
// Scholar's mate — short, dramatic, and ends in a win: the interlude plays it
// on the page's board, and the analysis demo reviews it from the loser's side.
const DEMO_GAME_MOVES = ["e4", "e5", "Qh5", "Nc6", "Bc4", "Nf6", "Qxf7#"];

type DemoFrame = { fen: string; from: string | null; to: string | null };

function buildDemoFrames(): DemoFrame[] {
  const chess = new Chess();
  const frames: DemoFrame[] = [{ fen: chess.fen(), from: null, to: null }];
  for (const san of DEMO_GAME_MOVES) {
    const mv = chess.move(san);
    frames.push({ fen: chess.fen(), from: mv?.from ?? null, to: mv?.to ?? null });
  }
  return frames;
}

function fenAfter(moves: string[]): string {
  const chess = new Chess();
  for (const san of moves) chess.move(san);
  return chess.fen();
}

function isKnightMove(from: string, to: string): boolean {
  const fileDiff = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
  const rankDiff = Math.abs(parseInt(from[1]) - parseInt(to[1]));
  return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
}

const arrow = (from: string, to: string, color: string) => ({
  from,
  to,
  color,
  isKnightMove: isKnightMove(from, to),
});

const BAD_ARROW = "rgba(239, 68, 68, 0.5)";
const GOOD_ARROW = "rgba(34, 197, 94, 0.5)";

/* -------------------- gameplay interlude (step 2 -> 3) ------------------ */
// Plays the scripted game directly over the page's static board image so the
// chessboard "comes alive" before the You Won step, like in the video.

function InterludeBoard({ rect, onDone }: { rect: Rect; onDone: () => void }) {
  const frames = useMemo(buildDemoFrames, []);
  const [frame, setFrame] = useState(0);
  const last = frames.length - 1;
  const showHint = frame === last - 1; // green arrow before the winning move

  useEffect(() => {
    const delay =
      frame === 0 ? 900 : frame === last - 1 ? 1700 : frame === last ? 1600 : 850;
    const t = setTimeout(() => {
      if (frame >= last) onDone();
      else setFrame((f) => f + 1);
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame, last]);

  const current = frames[frame];
  const squareStyles: Record<string, React.CSSProperties> = {};
  if (current.from) squareStyles[current.from] = { background: "#F5F682" };
  if (current.to)
    squareStyles[current.to] = {
      background: frame === last ? "rgba(239, 68, 68, 0.45)" : "#B9E67B",
    };

  return (
    <div
      className="fixed pointer-events-none"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
    >
      <div className="relative bg-white" style={{ width: rect.width }}>
        <TwoDChessboard
          arePiecesClickable={false}
          arePiecesDraggable={false}
          boardWidth={rect.width}
          orientation="white"
          position={current.fen}
          onPromotionPieceSelect={() => false}
          promotionToSquare={null}
          showPromotionDialog={false}
          customSquareStyles={squareStyles}
          customArrows={[]}
          areArrowsAllowed={false}
          customArrowColor=""
        />
        {showHint && (
          <CustomChessArrows
            arrows={[arrow("h5", "f7", GOOD_ARROW)]}
            boardSize={rect.width}
            orientation="white"
          />
        )}
      </div>
    </div>
  );
}

/* ----------------- analysis demo (mirrors GameAnalysis) ----------------- */

const DEMO_MISTAKES = [
  {
    type: "Inaccuracy",
    moveNumber: 1,
    move: "e5",
    keyEvaluation: -0.3,
    fen: fenAfter(["e4"]),
    badMove: "e5",
    goodArrow: ["c7", "c5"] as const,
    analysis:
      "A solid reply, but it commits your center early against an aggressive setup.",
    solution: "c5 keeps the position flexible against early queen attacks.",
  },
  {
    type: "Mistake",
    moveNumber: 2,
    move: "Nc6",
    keyEvaluation: -1.2,
    fen: fenAfter(["e4", "e5", "Qh5"]),
    badMove: "Nc6",
    goodArrow: ["d8", "e7"] as const,
    analysis:
      "Developing the knight is natural, but it ignores White's early queen raid aiming at f7.",
    solution: "Qe7 defends f7 and prepares to chase the queen away.",
  },
  {
    type: "Blunder",
    moveNumber: 3,
    move: "Nf6",
    keyEvaluation: -9.8,
    fen: fenAfter(["e4", "e5", "Qh5", "Nc6", "Bc4"]),
    badMove: "Nf6",
    goodArrow: ["g7", "g6"] as const,
    analysis:
      "This attacks the queen but walks into checkmate - both the queen and bishop are aiming at f7.",
    solution: "g6 blocks the queen's path and keeps your king safe.",
  },
];

// One slide's board: shows the position, then animates the bad move being
// played while the red (bad) and green (better) arrows stay visible.
function DemoSlideBoard({
  mistake,
  active,
  boardWidth,
}: {
  mistake: (typeof DEMO_MISTAKES)[number];
  active: boolean;
  boardWidth: number;
}) {
  const [fen, setFen] = useState(mistake.fen);
  const [squareStyles, setSquareStyles] = useState<Record<string, React.CSSProperties>>({});
  const [badFromTo, setBadFromTo] = useState<[string, string] | null>(null);

  useEffect(() => {
    setFen(mistake.fen);
    setSquareStyles({});
    const chess = new Chess(mistake.fen);
    const preview = chess.move(mistake.badMove);
    if (preview) setBadFromTo([preview.from, preview.to]);
    if (!active || !preview) return;
    const t = setTimeout(() => {
      setFen(chess.fen());
      setSquareStyles({
        [preview.from]: { background: "#F5F682" },
        [preview.to]: { background: "rgba(239, 68, 68, 0.35)" },
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [mistake, active]);

  const arrows = [
    ...(badFromTo ? [arrow(badFromTo[0], badFromTo[1], BAD_ARROW)] : []),
    arrow(mistake.goodArrow[0], mistake.goodArrow[1], GOOD_ARROW),
  ];

  return (
    <div className="relative" style={{ width: boardWidth }}>
      <TwoDChessboard
        arePiecesClickable={false}
        arePiecesDraggable={false}
        boardWidth={boardWidth}
        orientation="black"
        position={fen}
        onPromotionPieceSelect={() => false}
        promotionToSquare={null}
        showPromotionDialog={false}
        customSquareStyles={squareStyles}
        customArrows={[]}
        areArrowsAllowed={false}
        customArrowColor=""
      />
      <CustomChessArrows arrows={arrows} boardSize={boardWidth} orientation="black" />
    </div>
  );
}

// Mini replica of the real Game Analysis modal (GameAnalysis.tsx): same card
// deck swipe (Swiper cards effect), same slide layout, auto-playing.
function DemoAnalyzeCard() {
  const swiperRef = useRef<SwiperType>();
  const [activeIndex, setActiveIndex] = useState(0);
  const BOARD_W = 225;

  useEffect(() => {
    const t = setInterval(() => {
      const swiper = swiperRef.current;
      if (!swiper) return;
      if (swiper.activeIndex >= DEMO_MISTAKES.length - 1) swiper.slideTo(0);
      else swiper.slideNext();
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] p-[16px] select-none pointer-events-none">
      <h3 className="text-[16px] text-center font-bold text-[#121212] mb-[10px]">
        Game Analysis
      </h3>

      <Swiper
        modules={[EffectCards, Pagination]}
        effect="cards"
        autoHeight
        cardsEffect={{ slideShadows: false, rotate: true, perSlideRotate: 2, perSlideOffset: 8 }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full"
      >
        {DEMO_MISTAKES.map((mistake, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white border border-[#221AE9] rounded-[8px] p-[12px] shadow-[0px_4px_10px_0px_rgba(23,28,183,.25)]">
              <div className="w-full flex flex-col gap-[6px] items-center justify-center mb-[10px]">
                <div
                  style={{ width: BOARD_W }}
                  className="flex flex-row justify-end items-center gap-3"
                >
                  <Image
                    src="/images/play-vs-ai/switch.png"
                    alt="switch"
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px] rounded-full object-contain"
                  />
                  <Settings size={16} className="text-[#221AE9]" />
                </div>
                <DemoSlideBoard
                  mistake={mistake}
                  active={index === activeIndex}
                  boardWidth={BOARD_W}
                />
              </div>

              <div className="w-full border border-[#221AE9] rounded-[8px]">
                <div className="flex items-center justify-between py-[4px] rounded-t-[7px] px-[10px] bg-gradient-to-tr from-[#2327EB] to-[#25CADC]">
                  <div className="flex items-center gap-[6px] min-w-0">
                    <div className="flex items-center gap-[4px] px-[6px] py-[2px] bg-white border border-[#FF7769] text-[#FF7769] rounded-[4px] shrink-0">
                      <Image
                        src="/images/analysis/icon_miss.png"
                        alt="miss"
                        width={14}
                        height={14}
                        className="w-[14px] h-[14px] object-contain"
                      />
                      <span className="font-semibold text-[11px]">{mistake.type}</span>
                    </div>
                    <span className="font-bold text-white text-[12px] truncate">
                      Move {mistake.moveNumber}: {mistake.move}
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center shrink-0">
                    <span className="text-[#E22B32] border-[#E22B32] border font-medium text-[11px] bg-white rounded-full py-[1px] px-[8px]">
                      {mistake.keyEvaluation}
                    </span>
                    <span className="w-[24px] h-[24px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] rounded-[6px]">
                      <Bookmark className="w-[12px] h-[12px]" color="#221AE9" />
                    </span>
                  </div>
                </div>
                {/* fixed height keeps every card identical so the swiper
                    doesn't reserve extra room under the shorter slides */}
                <div className="p-[8px] h-[136px] overflow-hidden">
                  <h3 className="flex items-center gap-[6px] mb-[2px]">
                    <Image
                      src="/images/analysis/icon_analysis.svg"
                      alt="analysis"
                      width={20}
                      height={20}
                      className="w-[20px] h-[20px] object-contain"
                    />
                    <span className="font-bold text-[14px] text-[#040404]">Analysis</span>
                  </h3>
                  <p className="text-[12px] leading-[130%] text-[#585858] mb-[6px] min-h-[32px]">
                    {mistake.analysis}
                  </p>
                  <div className="flex w-full items-center bg-[#1C17A6] gap-[10px] p-[6px] rounded-[8px]">
                    <Image
                      src="/images/analysis/icon_union.svg"
                      alt="analysis"
                      width={30}
                      height={30}
                      className="w-[30px] h-[30px] object-contain"
                    />
                    <div className="relative leading-[120%] flex items-center min-h-[34px] w-full rounded-[8px] text-[11px] text-white px-[8px] py-[6px] bg-gradient-to-br from-[#2327EB] to-[#25CADC] before:content-[''] before:w-[12px] before:h-[12px] before:absolute before:top-[50%] before:left-[-12px] before:-translate-y-[50%] before:bg-[url(/images/analysis/tail.svg)] before:bg-cover before:bg-no-repeat before:bg-center">
                      {mistake.solution}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative z-10 mt-[8px] flex items-center justify-center gap-[40px]">
        <span className="w-[28px] h-[28px] flex justify-center items-center text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)]">
          <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
            <path d="M15 7H0.899022" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.20312 0.875L0.903125 7L7.20312 13.125" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold text-[12px]">
            - {activeIndex + 1} of {DEMO_MISTAKES.length} -
          </span>
          <div className="flex items-center mt-[2px]">
            {DEMO_MISTAKES.map((_, i) => (
              <div
                key={i}
                className={`swiper-pagination-bullet mx-[3px] ${
                  activeIndex === i ? "swiper-pagination-bullet-active" : ""
                }`}
              />
            ))}
          </div>
        </div>
        <span className="w-[28px] h-[28px] flex justify-center items-center text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)]">
          <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
            <path d="M1 7L15.101 7" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.80469 13.125L15.1047 7L8.80469 0.875" stroke="#E6F7FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function FinaleCard({ onPrev, onDone }: { onPrev: () => void; onDone: () => void }) {
  return (
    <div className="relative w-full bg-white rounded-2xl shadow-2xl pt-[26px] pb-[20px] px-[24px] pointer-events-auto">
      <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-[#34C759] text-white text-[13px] font-bold px-[18px] py-[6px] rounded-full whitespace-nowrap shadow-md">
        You&apos;re All Set!
      </div>
      <Image
        src={BOARD_IMG}
        alt="Ready to play"
        width={525}
        height={525}
        className="w-[64%] mx-auto h-auto rounded-[8px] mt-[6px]"
      />
      <p className="text-center font-bold text-[17px] text-[#111827] mt-[14px]">
        Everything&apos;s ready!
      </p>
      <p className="text-center text-[12px] text-gray-500 mt-[2px]">
        Your chess journey starts now.
      </p>
      <div className="flex items-center justify-center gap-[10px] mt-[16px]">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 max-w-[140px] py-[9px] rounded-full bg-[#AEE0FB] text-[#0B3B66] font-semibold text-[13px] hover:bg-[#9ad7fa] transition-colors"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 max-w-[140px] py-[9px] rounded-full bg-[#221AE9] text-white font-semibold text-[13px] hover:bg-[#2d25ea] transition-colors"
        >
          Play Now
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- tour --------------------------------- */

export function PlaygroundTour({
  autoStart = true,
  forceStart = false,
}: {
  autoStart?: boolean;
  /** open immediately on mount — set by the gate when the lazy chunk was
      loaded because of a manual trigger that already fired */
  forceStart?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null); // primary anchor (tooltip)
  const [spot, setSpot] = useState<Rect | null>(null); // spotlight union (hole)
  // gameplay interlude between step 2 and step 3, played on the page's board
  const [interlude, setInterlude] = useState(false);
  const [boardImgRect, setBoardImgRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ vw: 0, vh: 0 });
  const rectRef = useRef<Rect | null>(null);
  const spotRef = useRef<Rect | null>(null);
  const boardImgRef = useRef<Rect | null>(null);

  const step = interlude ? undefined : (STEPS[index] as TourStep | undefined); // undefined on finale/interlude
  const anchored = !!step?.anchors;

  useEffect(() => setMounted(true), []);

  // Auto-start once per user; ?tour=playground forces a replay.
  useEffect(() => {
    if (!mounted) return;
    let forced = false;
    try {
      forced = new URLSearchParams(window.location.search).get("tour") === "playground";
      if (!forced && (!autoStart || localStorage.getItem(DONE_KEY))) {
        // eslint-disable-next-line no-console
        console.info(
          "[PlaygroundTour] not auto-playing (already seen). Replay with __startPlaygroundTour() or ?tour=playground"
        );
        return;
      }
    } catch {
      return;
    }
    const t = setTimeout(() => {
      setIndex(0);
      setOpen(true);
      preloadLottie(WIN_LOTTIE);
      preloadLottie(LOSE_LOTTIE);
    }, 700);
    return () => clearTimeout(t);
  }, [mounted, autoStart]);

  // The gate mounts this chunk in response to a manual trigger that already
  // fired — open right away instead of re-checking auto-start conditions.
  useEffect(() => {
    if (!mounted || !forceStart) return;
    setIndex(0);
    setOpen(true);
    preloadLottie(WIN_LOTTIE);
    preloadLottie(LOSE_LOTTIE);
  }, [mounted, forceStart]);

  // Manual trigger hook (window event + console helper).
  useEffect(() => {
    if (!mounted) return;
    const start = () => {
      setIndex(0);
      setOpen(true);
      preloadLottie(WIN_LOTTIE);
      preloadLottie(LOSE_LOTTIE);
    };
    window.addEventListener(PLAYGROUND_TOUR_EVENT, start);
    window.__startPlaygroundTour = start;
    return () => {
      window.removeEventListener(PLAYGROUND_TOUR_EVENT, start);
      if (window.__startPlaygroundTour === start) delete window.__startPlaygroundTour;
    };
  }, [mounted]);

  const finish = () => {
    setOpen(false);
    setInterlude(false);
    let firstCompletion = false;
    try {
      firstCompletion = !localStorage.getItem(DONE_KEY);
      localStorage.setItem(DONE_KEY, "1");
    } catch {}
    // First-ever tutorial close: greet the new user with their day-streak
    // status (streak 0, unlit flame) — static image, no lottie. Replays
    // (Escape, ?tour=playground, manual trigger) skip it.
    if (firstCompletion) {
      const streakStore = useStreakStore.getState();
      openDayStreakModal({
        variant: "celebration",
        streak: streakStore.currentStreak,
        staticFlame:
          streakStore.lastPlayDate === getLocalDateStamp() ? "on" : "off",
      });
    }
  };

  const findBoardImage = () =>
    document.querySelector<HTMLElement>(
      '[data-tour-anchor="board-preview"] img[alt="Chessboard preview"]'
    );

  const next = () => {
    if (interlude) {
      setInterlude(false);
      setIndex(2);
      return;
    }
    // Leaving step 2: play the demo game on the board before the win step.
    if (index === 1) {
      const img = findBoardImage();
      if (img && img.getBoundingClientRect().width > 0) {
        setInterlude(true);
        return;
      }
    }
    setIndex((i) => Math.min(i + 1, FINALE_INDEX));
  };
  const prev = () => {
    if (interlude) {
      setInterlude(false);
      return;
    }
    setIndex((i) => Math.max(i - 1, 0));
  };

  // Bring the spotlighted element into view when an anchored step starts.
  // The scroll margin keeps the element's top clear of the fixed navbar (and
  // leaves room above it when the step's tooltip sits above the target).
  useEffect(() => {
    if (!open) return;
    const el = interlude
      ? findAnchor(["board-preview"])
      : step?.anchors
        ? findAnchor(
            step.scrollAnchor ? [step.scrollAnchor, ...step.anchors] : step.anchors
          )
        : null;
    if (!el) return;
    el.style.scrollMarginTop = `${(!interlude && step?.scrollMargin) || 110}px`;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, interlude]);

  // Step-2 showcase: gently auto-scroll the opponent list (categories +
  // players) like the tutorial video does. Pure DOM scrolling on the list
  // element — no component state is touched — and the original scroll
  // position is restored when the step ends.
  useEffect(() => {
    const showcaseStep = STEPS[index];
    if (!open || interlude || !showcaseStep?.scrollShowcase) return;
    const panel = findAnchor(showcaseStep.anchors);
    const list = panel?.querySelector<HTMLElement>(".overflow-y-auto");
    if (!list || list.scrollHeight <= list.clientHeight) return;
    // The category tab strip scrolls along with the list, so the visible
    // categories track the tier the list is currently sweeping through.
    const tabs = panel?.querySelector<HTMLElement>(".overflow-x-auto");
    const initial = list.scrollTop;
    const initialTabs = tabs?.scrollLeft ?? 0;
    const range = list.scrollHeight - list.clientHeight;
    let raf = 0;
    let start: number | null = null;
    const CYCLE_MS = 9000; // down and back up
    const tick = (now: number) => {
      if (start === null) start = now + 900; // brief pause before moving
      const t = Math.max(0, now - start) % CYCLE_MS;
      // eased there-and-back sweep: 0 -> 1 -> 0
      const phase = (1 - Math.cos((t / CYCLE_MS) * Math.PI * 2)) / 2;
      list.scrollTop = phase * range;
      if (tabs) {
        const tabsRange = tabs.scrollWidth - tabs.clientWidth;
        if (tabsRange > 0) tabs.scrollLeft = phase * tabsRange;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      list.scrollTop = initial;
      if (tabs) tabs.scrollLeft = initialTabs;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, interlude]);

  // Track the anchor's on-screen rect every frame while the tour is open so
  // the spotlight stays glued through scrolling, resizes, and layout shifts.
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = () => {
      const current = interlude ? { anchors: ["board-preview"] } : STEPS[index];
      const el = findAnchor(current?.anchors);
      let nextRect: Rect | null = null;
      let nextSpot: Rect | null = null;
      if (el) {
        nextRect = toRect(el.getBoundingClientRect());
        nextSpot = nextRect;
        for (const extra of (current as TourStep | undefined)?.include ?? []) {
          const extraEl = findAnchor([extra]);
          if (extraEl) {
            nextSpot = unionRects(nextSpot, toRect(extraEl.getBoundingClientRect()));
          }
        }
      }
      if (!sameRect(nextRect, rectRef.current)) {
        rectRef.current = nextRect;
        setRect(nextRect);
      }
      if (!sameRect(nextSpot, spotRef.current)) {
        spotRef.current = nextSpot;
        setSpot(nextSpot);
      }
      // the inner board image, tracked for the interlude's live board overlay
      const img = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] img[alt="Chessboard preview"]'
          )
        : null;
      const nextImg = img ? toRect(img.getBoundingClientRect()) : null;
      if (!sameRect(nextImg, boardImgRef.current)) {
        boardImgRef.current = nextImg;
        setBoardImgRect(nextImg);
      }
      setViewport((v) =>
        v.vw === window.innerWidth && v.vh === window.innerHeight
          ? v
          : { vw: window.innerWidth, vh: window.innerHeight }
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, index, interlude]);

  // Keyboard: Esc skips, arrows navigate.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight" && index < FINALE_INDEX) next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, interlude]);

  if (!mounted || !open) return null;

  // Spotlight geometry: pads the union of anchor rects; collapses to a point
  // when a step has no anchor so the 200vmax shadow dims the whole screen.
  const PAD = 8;
  const spotRect = spot ?? rect;
  const hole: Rect =
    (anchored || interlude) && spotRect
      ? {
          top: spotRect.top - PAD,
          left: spotRect.left - PAD,
          width: spotRect.width + PAD * 2,
          height: spotRect.height + PAD * 2,
        }
      : { top: viewport.vh / 2, left: viewport.vw / 2, width: 0, height: 0 };

  // Anchored tooltip: a step can pin its bottom edge relative to the primary
  // anchor's top (tooltipBottomAt); otherwise it goes above the target when
  // there's room, below when there's room underneath, or pinned over the
  // target's top edge (tall targets like the chessboard card). Always inside
  // the viewport, so it can never hide behind the fixed navbar.
  const TOOLTIP_W = Math.min(430, viewport.vw - 24);
  const EST_TOOLTIP_H = 180;
  const MARGIN = 12;
  let mode: "edge" | "above" | "below" | "over" = "over";
  if (
    step?.tooltipBottomAt !== undefined &&
    rect &&
    rect.top + step.tooltipBottomAt - EST_TOOLTIP_H >= MARGIN
  ) {
    mode = "edge";
  } else if (hole.top - 14 - EST_TOOLTIP_H >= MARGIN) mode = "above";
  else if (hole.top + hole.height + 14 + EST_TOOLTIP_H <= viewport.vh - MARGIN)
    mode = "below";
  const tooltipTop =
    mode === "edge" && rect && step?.tooltipBottomAt !== undefined
      ? rect.top + step.tooltipBottomAt
      : mode === "above"
        ? hole.top - 14
        : mode === "below"
          ? hole.top + hole.height + 14
          : Math.max(hole.top + 14, MARGIN);
  const anchorCenterX = rect
    ? rect.left + rect.width / 2
    : hole.left + hole.width / 2;
  const tooltipLeft = Math.min(
    Math.max(anchorCenterX - TOOLTIP_W / 2, 12),
    Math.max(viewport.vw - TOOLTIP_W - 12, 12)
  );

  return createPortal(
    <div className="fixed inset-0 z-[700] overscroll-contain" role="dialog" aria-modal="true" aria-label="Playground tutorial">
      {/* Spotlight (the huge shadow doubles as the backdrop) */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: hole.top,
          left: hole.left,
          width: hole.width,
          height: hole.height,
          borderRadius: 18,
          boxShadow:
            (anchored || interlude) && spotRect
              ? "0 0 0 2px rgba(124,192,242,0.95), 0 0 0 200vmax rgba(9,14,40,0.62)"
              : "0 0 0 200vmax rgba(9,14,40,0.62)",
          transition: "all 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      <AnimatePresence mode="wait">
        {step && anchored && (
          <motion.div
            key={`anchored-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="fixed"
            style={rect ? { top: tooltipTop, left: tooltipLeft } : { top: "20%", left: "50%" }}
          >
            {/* framer-motion owns the outer transform, so the placement
                translate lives on this inner wrapper */}
            <div
              style={{
                transform: !rect
                  ? "translateX(-50%)"
                  : mode === "above" || mode === "edge"
                    ? "translateY(-100%)"
                    : undefined,
              }}
            >
              <TourTooltip
                step={step}
                index={index}
                onSkip={next}
                onPrev={prev}
                onNext={next}
                caret={rect ? (mode === "below" ? "top" : "bottom") : undefined}
              />
            </div>
          </motion.div>
        )}

        {step && step.demo && (
          <motion.div
            key={`demo-${index}`}
            initial={{ opacity: 0, y: 180 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 180 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 flex flex-col items-center justify-center p-4"
          >
            <TourTooltip
              step={step}
              index={index}
              onSkip={next}
              onPrev={prev}
              onNext={next}
              caret="bottom"
            />
            {/* the analyze demo keeps overflow visible so the swiper card
                deck can rotate outside its own bounds, like the real modal */}
            <div
              className={`w-[min(400px,92vw)] mt-[14px] rounded-2xl ${
                step.demo === "analyze" ? "" : "max-h-[62vh] overflow-y-auto"
              }`}
            >
              {step.demo === "win" && <DemoWinCard />}
              {step.demo === "lose" && <DemoLoseCard />}
              {step.demo === "analyze" && <DemoAnalyzeCard />}
            </div>
          </motion.div>
        )}

        {interlude && boardImgRect && (
          <motion.div
            key="interlude"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InterludeBoard rect={boardImgRect} onDone={next} />
          </motion.div>
        )}

        {!step && !interlude && (
          <motion.div
            key="finale"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            <div className="w-[min(400px,92vw)]">
              <FinaleCard onPrev={prev} onDone={finish} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export default PlaygroundTour;
