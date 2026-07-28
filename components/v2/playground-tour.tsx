"use client";

import Image from "next/image";
import { ArrowLeft, Bookmark, RotateCw, Settings, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
import { preloadLottie } from "@/components/v2/hooks/useLottieData";
import { WinModalCard } from "@/components/v2/play-vs-ai-win-modal";
import { LoseModalCard } from "@/components/v2/play-vs-ai-lose-modal";
import { openDayStreakModal } from "@/components/v2/hooks/useDayStreakModal";
import { setPlaygroundTourActive } from "@/components/v2/playground-tour-active";
import { getLocalDateStamp, useStreakStore } from "@/app/store/streak";
import { useChessBoardThemeStore } from "@/app/store/chessBoardTheme";

// Interactive remake of the playground tutorial video (tutorial.json).
// Fully self-contained: renders in a portal above everything (win/lose
// modals sit at z-[500]), never mutates page state, and only reads the
// two data-tour-anchor attributes on the play hero to draw its spotlight.

const WIN_LOTTIE = "/images/v2/play-vs-ai/WON.min.json";
const LOSE_LOTTIE = "/images/v2/play-vs-ai/LOSE.min.json";
const FINALE_IMG = "/images/v2/tutorial/chessboard.png";

// Set by sign-up onboarding (queuePlaygroundTour); the tour only auto-runs
// while it's present and consumes it on start.
const PENDING_KEY = "ac_playground_tour_pending_v1";

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
  /** fields replaced below 640px, where the design spotlights tighter targets */
  mobile?: Omit<TourStep, "title" | "content" | "demo" | "mobile">;
};

const MOBILE_BP = 640;
const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BP;

function resolveStep(step: TourStep, mobile: boolean): TourStep {
  return mobile && step.mobile ? { ...step, ...step.mobile } : step;
}

const STEPS: TourStep[] = [
  {
    title: "Tutorial: Welcome to The Playground",
    content: "Start your Game against one of our many AI opponents.",
    anchors: ["board-preview", "opponent-panel"],
    include: ["play-top-bar"],
    scrollAnchor: "play-top-bar",
    tooltipBottomAt: 96,
    // Mobile spotlights the Play VS AI card alone (no leaderboard) and parks it
    // low enough for the tooltip to clear the navbar and sit entirely above the
    // card — so the card's "Play VS AI" heading stays visible above Choose Your
    // Color, with the caret pointing down at the card's top edge. No
    // tooltipBottomAt: that would pin the tooltip over the heading instead.
    mobile: {
      anchors: ["opponent-panel"],
      include: [],
      scrollAnchor: undefined,
      scrollMargin: 330,
      tooltipBottomAt: undefined,
    },
  },
  {
    title: "Tutorial: Choose your opponent",
    content:
      "Select an Opponent with an ELO score close to yours. The Recommended tab shows the best match automatically. Hit Start Game - and the match begins.",
    anchors: ["opponent-panel"],
    scrollMargin: 224,
    tooltipBottomAt: -14,
    scrollShowcase: true,
    // Mobile narrows the spotlight to the opponent section + Start Game, so
    // "Choose Your Color" stays dimmed.
    mobile: {
      anchors: ["opponent-list"],
      include: ["start-game"],
      scrollMargin: 300,
      tooltipBottomAt: undefined,
      scrollShowcase: true,
    },
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
  widthPx,
}: {
  step: TourStep;
  index: number;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  caret?: "top" | "bottom";
  /** Overrides the default width — demo steps match the scaled card below. */
  widthPx?: number;
  }) {
  const isLast = index === STEPS.length - 1;
  return (
    <div
      style={widthPx ? { width: widthPx } : undefined}
      className="relative w-[min(430px,calc(100vw-24px))] rounded-[16px] sm:rounded-[14px] bg-white shadow-2xl ring-2 ring-[#221AE9] sm:ring-[#7CC0F2] p-4 sm:p-[16px] pointer-events-auto"
    >
      {caret && (
        <>
          {/* mobile: speech-bubble tail with the card's blue outline */}
          <span
            className={`sm:hidden absolute left-1/2 -translate-x-1/2 ${
              caret === "bottom" ? "top-full" : "bottom-full"
            }`}
          >
            <span
              className={`block w-0 h-0 border-x-[15px] border-x-transparent ${
                caret === "bottom"
                  ? "border-t-[17px] border-t-[#221AE9]"
                  : "border-b-[17px] border-b-[#221AE9]"
              }`}
            />
            <span
              className={`block absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-[12px] border-x-transparent ${
                caret === "bottom"
                  ? "-top-[3px] border-t-[14px] border-t-white"
                  : "-bottom-[3px] border-b-[14px] border-b-white"
              }`}
            />
          </span>
          <div
            className={`hidden sm:block absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 ${
              caret === "bottom" ? "-bottom-[7px] shadow-md" : "-top-[7px]"
            }`}
          />
        </>
      )}
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold text-[17px] sm:text-[14px] text-[#040404] sm:text-[#221AE9] leading-snug">
          {step.title}
        </p>
        <span className="text-[13px] sm:text-[12px] text-gray-500 sm:text-gray-400 font-medium shrink-0 pt-[3px] sm:pt-[1px]">
          {index + 1}/{STEPS.length}
        </span>
      </div>
      <p className="text-[15px] sm:text-[13px] text-gray-600 mt-[8px] sm:mt-[6px] leading-relaxed">
        {step.content}
      </p>
      <div className="flex items-center justify-between mt-[16px] sm:mt-[12px]">
        <button
          type="button"
          onClick={onSkip}
          className="px-5 h-9 rounded-full border border-[#7CC0F2] bg-[#D9F1FF] text-[#221AE9] text-[15px] font-semibold hover:bg-[#c4e9ff] transition-colors sm:px-4 sm:h-auto sm:py-[6px] sm:rounded-[8px] sm:border-0 sm:text-[13px]"
        >
          Skip
        </button>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="px-5 h-9 rounded-full border border-[#7CC0F2] bg-[#D9F1FF] text-[#221AE9] text-[15px] font-semibold hover:bg-[#c4e9ff] transition-colors sm:px-4 sm:h-auto sm:py-[6px] sm:rounded-[8px] sm:border-0 sm:text-[13px]"
            >
              Prev
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="px-5 h-9 rounded-full bg-[#221AE9] text-white text-[15px] font-semibold hover:bg-[#2d25ea] transition-colors sm:px-4 sm:h-auto sm:py-[6px] sm:rounded-[8px] sm:text-[13px]"
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- demo result cards ---------------------------- */
// The tour reuses the real win/lose modal cards (WinModalCard / LoseModalCard,
// variant="tour"). Those render at the modal's full proportions — including
// the celebration animation at its natural aspect, so it's never cropped
// short. This wrapper measures the card and, only when the viewport is too
// short to show it at full size, scales the whole card down uniformly so it
// stays fully in view under the tour tooltip (animation included).
function ScaleToFit({
  children,
  reserve = 210,
  referenceHeight,
  onMeasure,
  onScale,
}: {
  children: React.ReactNode;
  /** px kept clear for the tooltip + gaps above the card */
  reserve?: number;
  /**
   * When set, the scale is computed from this height instead of the card's
   * own — used so the win and lose demo cards share one scale factor and
   * therefore render at exactly the same width. The box still sizes to the
   * card's own scaled height.
   */
  referenceHeight?: number;
  /** reports this card's natural (untransformed) height once measured */
  onMeasure?: (height: number) => void;
  /** reports the applied scale, so the tooltip above can match the card's
      visual width (a CSS scale shrinks width as well as height) */
  onScale?: (scale: number) => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [boxHeight, setBoxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      const natural = el.offsetHeight; // untransformed layout height
      if (!natural) return;
      onMeasure?.(natural);
      // Mobile never scales: the transform shrinks width as well as height, so
      // any scale < 1 would make the card narrower than the tooltip above it.
      // It renders at full container width and the column scrolls instead.
      if (window.innerWidth < MOBILE_BP) {
        setScale(1);
        onScale?.(1);
        setBoxHeight(undefined);
        return;
      }
      const basis = referenceHeight && referenceHeight > 0 ? referenceHeight : natural;
      const avail = window.innerHeight - reserve;
      const next = Math.min(1, avail / basis);
      setScale(next);
      onScale?.(next);
      setBoxHeight(natural * next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reserve, referenceHeight, onMeasure, onScale]);

  return (
    <div style={{ height: boxHeight, width: "100%" }}>
      <div
        ref={innerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------------- demo positions (chess.js) ----------------------- */

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

/* -------------------- won-board interlude (step 2 -> 3) ----------------- */
// Shows a decisive winning position on the spotlighted page board for a
// moment before the You Won step — White's queen dominating with Black
// reduced to bare pawns.

const WON_FEN = "8/p7/5Q2/2p5/1p6/1P6/2P5/4K3 w - - 0 1";
const INTERLUDE_HOLD_MS = 1000;

// Captured rows matching WON_FEN: Black is down to three pawns, White gave up
// both rooks, bishops, knights and six pawns on the way to the win.
const CAPTURED_BLACK = ["bK", "bQ", "bB", "bB", "bN", "bN", "bR", "bR", "bP", "bP", "bP", "bP", "bP"];
const CAPTURED_WHITE = ["wB", "wB", "wN", "wN", "wR", "wR", "wP", "wP", "wP", "wP", "wP", "wP"];

// Win/lose player bars drawn over the preview card's own bars during the
// interlude — same colors and captured-piece treatment as the real game's
// BlackPlayer/WhitePlayer rows, with the pieces popping in one by one.
function InterludeCaptureBar({ rect, variant }: { rect: Rect; variant: "lost" | "won" }) {
  const { PieceChoosed } = useChessBoardThemeStore();
  const lost = variant === "lost";
  const icons = lost ? CAPTURED_BLACK : CAPTURED_WHITE;
  const pieceH = Math.max(18, Math.min(34, Math.round(rect.height * 0.52)));
  const avatarS = Math.max(28, Math.min(48, Math.round(rect.height * 0.72)));
  return (
    <div
      className="fixed pointer-events-none"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
    >
      <div
        className={`w-full h-full flex items-center justify-between gap-2 rounded-[8px] border px-[12px] ${
          lost ? "border-[#FD0000] bg-[#FFDFDF]" : "border-[#00B427] bg-[#E9F8EC]"
        }`}
      >
        <div className="flex items-center gap-[10px] min-w-0">
          <Image
            src={lost ? "/images/v2/AI avatar/Beginner/Number11.png" : "/images/homepage/v2/homepage_board_asset_4.png"}
            alt={lost ? "Lisa" : "You"}
            width={96}
            height={96}
            className="rounded-full object-cover shrink-0"
            style={{ width: avatarS, height: avatarS }}
          />
          <div className="flex flex-col leading-tight min-w-0">
            <span
              className={`font-bold text-[14px] sm:text-[16px] truncate ${
                lost ? "text-[#FD0000]" : "text-[#040404]"
              }`}
            >
              {lost ? "Lisa" : "You"}
            </span>
            <span className="text-[11px] sm:text-[13px] text-[#6B7280]">
              {lost ? "ELO 250" : "ELO 400"}
            </span>
          </div>
        </div>
        <div className="flex items-center shrink-0">
          {icons.map((icon, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.18 }}
              className={icon === icons[i + 1] ? "-mr-2" : ""}
            >
              <Image
                src={`/pieces/${PieceChoosed}/${icon}.png`}
                alt={icon}
                width={40}
                height={52}
                className="object-contain inline-block"
                style={{ width: "auto", height: pieceH }}
              />
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function InterludeBoard({ rect, onDone }: { rect: Rect; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, INTERLUDE_HOLD_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          position={WON_FEN}
          onPromotionPieceSelect={() => false}
          promotionToSquare={null}
          showPromotionDialog={false}
          customSquareStyles={{}}
          customArrows={[]}
          areArrowsAllowed={false}
          customArrowColor=""
        />
      </div>
    </div>
  );
}

// Mock move list shown over the opponent panel during the interlude so the
// right column reads like the real vs-AI game screen (Movement Details + a
// won-game banner). Purely decorative — a plausible white checkmate.
const INTERLUDE_MOVES: [string, string][] = [
  ["e4", "e5"],
  ["Bc4", "Nc6"],
  ["Qh5", "g6"],
  ["Qf3", "Nf6"],
  ["d3", "Bc5"],
  ["Qb3", "Qe7"],
  ["Ng5", "Nd8"],
  ["Bxf7+", "Nxf7"],
  ["Nxf7", "Qxf7"],
  ["Qxf7#", ""],
];

function InterludeMoveList({ rect }: { rect: Rect }) {
  return (
    <div
      className="fixed pointer-events-none"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
    >
      <div className="w-full h-full bg-white rounded-2xl border-2 border-[#81CFF3] shadow-lg p-3 sm:p-4 flex flex-col overflow-hidden">
        {/* header */}
        <div className="flex items-center gap-3 rounded-[8px] bg-[#FAFDFF] border border-[#DEDEDE] p-3 mb-3 shrink-0">
          <ArrowLeft size={20} className="text-black" />
          <div className="flex items-center gap-2">
            <Image
              src="/images/play-vs-ai/icon-play-vs-ai.png"
              alt="You vs AI"
              width={22}
              height={21}
              className="w-[20px] h-[19px] object-contain"
            />
            <span className="font-semibold text-[16px]">You vs AI</span>
          </div>
        </div>

        {/* tabs */}
        <div className="grid grid-cols-2 gap-2 rounded-[8px] bg-[#FAFDFF] border border-[#DEDEDE] p-2 mb-3 shrink-0">
          <div className="flex items-center justify-center py-2 rounded-[6px] bg-white shadow-md border border-[#DEDEDE]">
            <span className="text-[14px] font-semibold text-[#221AE9]">Current Game</span>
          </div>
          <div className="flex items-center justify-center py-2 rounded-[6px]">
            <span className="text-[14px] font-semibold text-black">Past Games</span>
          </div>
        </div>

        {/* movement details */}
        <div className="flex-1 min-h-0 rounded-[16px] border border-[#DEDEDE] p-3 flex flex-col overflow-hidden">
          <span className="font-semibold text-center text-[14px] mb-2 shrink-0">
            Movement Details
          </span>
          <div className="overflow-y-auto min-h-0">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#D7E3FB]">
                  <th className="p-1.5 border border-[#BDD0F9] font-normal text-[12px]">#</th>
                  <th className="p-1.5 border border-[#BDD0F9] font-normal text-[12px]">You (White)</th>
                  <th className="p-1.5 border border-[#BDD0F9] font-normal text-[12px]">Computer (Black)</th>
                </tr>
              </thead>
              <tbody>
                {INTERLUDE_MOVES.map(([white, black], i) => (
                  <tr key={i} className="text-center">
                    <td className="p-1.5 border border-[#BDD0F9] text-[12px]">{i + 1}</td>
                    <td className="p-1.5 border border-[#BDD0F9] text-[12px]">{white}</td>
                    <td className="p-1.5 border border-[#BDD0F9] text-[12px]">{black}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-3 mt-3 shrink-0">
            <div className="rounded-[4px] w-1/2 h-[32px] flex items-center justify-center bg-[rgba(34,26,233,0.2)] border border-[#221AE9]">
              <ArrowLeft size={18} className="text-black" />
            </div>
            <div className="rounded-[4px] w-1/2 h-[32px] flex items-center justify-center bg-[rgba(34,26,233,0.2)] border border-[#221AE9]">
              <RotateCw size={18} className="text-black" />
            </div>
          </div>
        </div>

        {/* won-game banner + analyze */}
        <div className="mt-3 flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2 rounded-[8px] px-3 py-2 bg-gradient-to-r from-[#34C759] to-[#2FB350] text-white">
            <Trophy size={16} className="shrink-0" />
            <span className="text-[13px] font-semibold">
              Congratulations! You have won this Game!
            </span>
          </div>
          <div className="w-full py-2 rounded-full bg-[#34C759] text-white font-semibold text-[13px] text-center">
            Analyze Now
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- analysis demo (mirrors GameAnalysis) ----------------- */

// Three mistakes from the design (all "Mistake"). Each FEN is written out so
// the played move (badMove, drawn as the red arrow) is legal in it and the
// coached alternative (goodArrow) points at the squares the copy names.
const DEMO_MISTAKES = [
  {
    type: "Mistake",
    moveNumber: 11,
    move: "e4",
    keyEvaluation: -2.26,
    fen: "r2qkbn1/pp1bp2p/6p1/4pP2/1n6/8/PPPPP1PP/RNBQKB1R w KQq - 0 11",
    badMove: "e4",
    goodArrow: ["e7", "d8"] as const,
    analysis:
      "A noticeable step back - you had a good position, but this move let a lot of it slip away.",
    solution: "e7d8r keeps your pieces coordinated better in this position",
  },
  {
    type: "Mistake",
    moveNumber: 17,
    move: "exf5",
    keyEvaluation: 9.32,
    fen: "3r1knr/p2b4/3B3p/5p2/4P3/8/PPP2PPP/R1NQK2R w KQ - 0 17",
    badMove: "exf5",
    goodArrow: ["d1", "h5"] as const,
    analysis:
      "A costly move: you were ahead, but this hands back a lot of what you built up.",
    solution: "Coaches agree - d1 to h5 is a move they'd also consider!",
  },
  {
    type: "Mistake",
    moveNumber: 27,
    move: "Rf1",
    keyEvaluation: 11.29,
    fen: "2k5/8/p1b5/5Q2/8/3N4/PPP2PPP/4K2R w K - 0 27",
    badMove: "Rf1",
    goodArrow: ["f6", "f7"] as const,
    analysis:
      "A real setback - your position is still playable, but much weaker than before.",
    solution: "Even strong players sometimes go for f6 to f7 in this spot!",
  },
];

// One slide's board: shows the position, then animates the bad move being
// played while the red (bad) and green (better) arrows stay visible.
function DemoSlideBoard({
  mistake,
  boardWidth,
}: {
  mistake: (typeof DEMO_MISTAKES)[number];
  boardWidth: number;
}) {
  // Static position with the bad-move (red) and better-move (green) arrows.
  // The pieces never move — only the arrows illustrate the mistake.
  const [badFromTo, setBadFromTo] = useState<[string, string] | null>(null);

  useEffect(() => {
    try {
      const chess = new Chess(mistake.fen);
      const preview = chess.move(mistake.badMove);
      setBadFromTo(preview ? [preview.from, preview.to] : null);
    } catch {
      // chess.js throws on an illegal SAN; the slide still renders, just
      // without the red arrow, rather than taking the whole tour down.
      setBadFromTo(null);
    }
  }, [mistake]);

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
        orientation="white"
        position={mistake.fen}
        onPromotionPieceSelect={() => false}
        promotionToSquare={null}
        showPromotionDialog={false}
        customSquareStyles={{}}
        customArrows={[]}
        areArrowsAllowed={false}
        customArrowColor=""
      />
      <CustomChessArrows arrows={arrows} boardSize={boardWidth} orientation="white" />
    </div>
  );
}

// Matches short viewports (14" laptops) so the demo cards can compact
// themselves; 24"/27" screens never match and keep the original layout.
function useShortViewport() {
  const [short, setShort] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-height: 920px)");
    const update = () => setShort(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return short;
}

// Mini replica of the real Game Analysis modal (GameAnalysis.tsx): same card
// deck swipe (Swiper cards effect), same slide layout, auto-playing.
function DemoAnalyzeCard() {
  const swiperRef = useRef<SwiperType>();
  const [activeIndex, setActiveIndex] = useState(0);
  const shortViewport = useShortViewport();
  // Mobile fills the card with the board (QA: "make the card full"); desktop
  // keeps its fixed sizes.
  const cardRef = useRef<HTMLDivElement>(null);
  const [mobileBoardW, setMobileBoardW] = useState(0);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      // card padding (10 x2) + slide padding (12 x2) + slide border
      const inner = el.clientWidth - 48;
      setMobileBoardW(window.innerWidth < MOBILE_BP && inner > 0 ? inner : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const BOARD_W = mobileBoardW || (shortViewport ? 190 : 225);

  // Auto-advance staged as a fake finger drag: translate frames are fed to
  // the swiper by hand (the cards effect rotates the top card exactly like a
  // real drag), then slideNext() releases it with momentum. activeIndex only
  // flips on release, same as a genuine swipe.
  useEffect(() => {
    let raf = 0;
    const DRAG_MS = 450;
    const dragAway = (swiper: SwiperType) => {
      const from = swiper.translate;
      const dist = swiper.width * 0.5;
      let t0: number | null = null;
      // present at runtime, missing from swiper v12's public typings
      (swiper as unknown as { setTransition(ms: number): void }).setTransition(0);
      const step = (now: number) => {
        if (swiper.destroyed) return;
        if (t0 === null) t0 = now;
        const p = Math.min(1, (now - t0) / DRAG_MS);
        // easeInOutQuad: the "finger" starts gently, pulls, then slows
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        swiper.setTranslate(from - dist * eased);
        if (p < 1) raf = requestAnimationFrame(step);
        else swiper.slideNext(340);
      };
      raf = requestAnimationFrame(step);
    };

    const t = setInterval(() => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.destroyed) return;
      if (swiper.activeIndex >= DEMO_MISTAKES.length - 1) swiper.slideTo(0, 650);
      else dragAway(swiper);
    }, 3000);
    return () => {
      clearInterval(t);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-full bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] p-[10px] sm:p-[16px] select-none pointer-events-none"
    >
      <h3 className="hidden sm:block text-[16px] text-center font-bold text-[#121212] mb-[10px]">
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
                <DemoSlideBoard mistake={mistake} boardWidth={BOARD_W} />
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
      <div className="absolute -top-[16px] sm:-top-[14px] left-1/2 -translate-x-1/2 bg-[#34C759] text-white text-[16px] sm:text-[13px] font-bold px-[20px] sm:px-[18px] py-[7px] sm:py-[6px] rounded-full whitespace-nowrap shadow-md">
        You&apos;re All Set!
      </div>
      <Image
        src={FINALE_IMG}
        alt="Ready to play"
        width={991}
        height={640}
        className="w-[80%] mx-auto h-auto rounded-[8px] mt-[6px]"
      />
      <p className="text-center font-bold text-[22px] sm:text-[17px] text-[#111827] mt-[16px] sm:mt-[14px]">
        Everything&apos;s ready!
      </p>
      <p className="text-center text-[15px] sm:text-[12px] text-gray-500 mt-[4px] sm:mt-[2px]">
        Your chess journey starts now.
      </p>
      <div className="flex items-center justify-center gap-[12px] sm:gap-[10px] mt-[20px] sm:mt-[16px]">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 max-w-[150px] sm:max-w-[140px] py-[11px] sm:py-[9px] rounded-full bg-[#AEE0FB] text-[#0B3B66] font-semibold text-[16px] sm:text-[13px] hover:bg-[#9ad7fa] transition-colors"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 max-w-[150px] sm:max-w-[140px] py-[11px] sm:py-[9px] rounded-full bg-[#221AE9] text-white font-semibold text-[16px] sm:text-[13px] hover:bg-[#2d25ea] transition-colors"
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
  // won-board interlude between step 2 and step 3, shown on the page's board
  const [interlude, setInterlude] = useState(false);
  const [boardImgRect, setBoardImgRect] = useState<Rect | null>(null);
  const [topBarRect, setTopBarRect] = useState<Rect | null>(null);
  const [bottomBarRect, setBottomBarRect] = useState<Rect | null>(null);
  // the opponent panel on the right, covered by a mock move list during the
  // interlude so the whole hero reads like a finished vs-AI game
  const [panelRect, setPanelRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ vw: 0, vh: 0 });
  const rectRef = useRef<Rect | null>(null);
  const spotRef = useRef<Rect | null>(null);
  const boardImgRef = useRef<Rect | null>(null);
  const topBarRef = useRef<Rect | null>(null);
  const bottomBarRef = useRef<Rect | null>(null);
  const panelRef = useRef<Rect | null>(null);
  // true when this open is the browser's first-ever tour run (drives the
  // one-time day-streak greeting on close)
  const firstRunRef = useRef(false);
  // Natural height of the (taller) win demo card, measured on step 3, so the
  // lose card on step 4 can scale by the same factor and match its width.
  const winCardHeightRef = useRef(0);
  const reportWinCardHeight = useRef((h: number) => {
    winCardHeightRef.current = h;
  }).current;

  // ScaleToFit shrinks the demo card to fit short viewports, and a CSS scale
  // narrows it as well as shortening it. Track that factor so the tooltip
  // above can be narrowed to the same visual width.
  const [demoScale, setDemoScale] = useState(1);
  const reportDemoScale = useRef((value: number) => setDemoScale(value)).current;

  // viewport.vw is 0 until the first rAF tick, so fall back to a live read.
  const isMobile = viewport.vw > 0 ? viewport.vw < MOBILE_BP : isMobileViewport();
  const rawStep = interlude ? undefined : (STEPS[index] as TourStep | undefined);
  const step = rawStep ? resolveStep(rawStep, isMobile) : undefined; // undefined on finale/interlude
  const anchored = !!step?.anchors;

  useEffect(() => setMounted(true), []);

  // Never leave the "tour on screen" flag stuck true if the tour unmounts
  // (navigation) without finish() running — otherwise queued modals would
  // stay suppressed forever.
  useEffect(() => () => setPlaygroundTourActive(false), []);

  // Opens the tour. The pending flag is consumed immediately — not on finish
  // — so a mid-tour refresh doesn't restart it: the tour auto-runs exactly
  // once per new user (sign-up onboarding queues it), and replays happen
  // only via ?tour=playground or the manual trigger.
  const begin = () => {
    try {
      if (localStorage.getItem(PENDING_KEY)) firstRunRef.current = true;
      localStorage.removeItem(PENDING_KEY);
    } catch {}
    setIndex(0);
    setOpen(true);
    setPlaygroundTourActive(true);
    preloadLottie(WIN_LOTTIE);
    preloadLottie(LOSE_LOTTIE);
  };

  // Auto-start only when onboarding queued a run; ?tour=playground forces a replay.
  useEffect(() => {
    if (!mounted) return;
    let forced = false;
    try {
      forced = new URLSearchParams(window.location.search).get("tour") === "playground";
      if (!forced && (!autoStart || !localStorage.getItem(PENDING_KEY))) {
        // eslint-disable-next-line no-console
        console.info(
          "[PlaygroundTour] not auto-playing (no onboarding run queued). Replay with __startPlaygroundTour() or ?tour=playground"
        );
        return;
      }
    } catch {
      return;
    }
    const t = setTimeout(begin, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, autoStart]);

  // The gate mounts this chunk in response to a manual trigger that already
  // fired — open right away instead of re-checking auto-start conditions.
  useEffect(() => {
    if (!mounted || !forceStart) return;
    begin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, forceStart]);

  // Manual trigger hook (window event + console helper).
  useEffect(() => {
    if (!mounted) return;
    const start = () => begin();
    window.addEventListener(PLAYGROUND_TOUR_EVENT, start);
    window.__startPlaygroundTour = start;
    return () => {
      window.removeEventListener(PLAYGROUND_TOUR_EVENT, start);
      if (window.__startPlaygroundTour === start) delete window.__startPlaygroundTour;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const finish = () => {
    setOpen(false);
    setInterlude(false);
    setPlaygroundTourActive(false);
    const firstCompletion = firstRunRef.current;
    firstRunRef.current = false;
    try {
      localStorage.removeItem(PENDING_KEY);
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
      '[data-tour-anchor="board-preview"] [data-preview-board]'
    );

  const next = () => {
    if (interlude) {
      setInterlude(false);
      setIndex(2);
      return;
    }
    // Leaving step 2: play the demo game on the board before the win step.
    // Desktop plays it on the page's own board preview; mobile has no board on
    // this page, so it gets a free-floating one over a dim backdrop.
    if (index === 1) {
      const img = findBoardImage();
      if ((img && img.getBoundingClientRect().width > 0) || isMobileViewport()) {
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

  // A scale measured on the win/lose card must not leak into the next step
  // (the analyze demo sizes itself and never scales).
  useEffect(() => {
    setDemoScale(1);
  }, [index]);

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
    const raw = STEPS[index];
    const showcaseStep = raw ? resolveStep(raw, isMobileViewport()) : undefined;
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
    const SWEEP_MS = 4500; // single downward sweep, then stop at the end
    const tick = (now: number) => {
      if (start === null) start = now + 900; // brief pause before moving
      const p = Math.min(1, Math.max(0, now - start) / SWEEP_MS);
      // easeInOut one-way sweep: 0 -> 1 (no return trip)
      const phase = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      list.scrollTop = phase * range;
      if (tabs) {
        const tabsRange = tabs.scrollWidth - tabs.clientWidth;
        if (tabsRange > 0) tabs.scrollLeft = phase * tabsRange;
      }
      // Stop once the bottom of the list is reached — stay there.
      if (p < 1) raf = requestAnimationFrame(tick);
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
      const current = interlude
        ? { anchors: ["board-preview"] }
        : STEPS[index] && resolveStep(STEPS[index], isMobileViewport());
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
      // the inner board image and the two player bars, tracked for the
      // interlude's won-board + capture-bar overlays
      const img = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-board]'
          )
        : null;
      const nextImg = img ? toRect(img.getBoundingClientRect()) : null;
      if (!sameRect(nextImg, boardImgRef.current)) {
        boardImgRef.current = nextImg;
        setBoardImgRect(nextImg);
      }
      const topBar = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-bar="opponent"]'
          )
        : null;
      const nextTop = topBar ? toRect(topBar.getBoundingClientRect()) : null;
      if (!sameRect(nextTop, topBarRef.current)) {
        topBarRef.current = nextTop;
        setTopBarRect(nextTop);
      }
      const bottomBar = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-bar="player"]'
          )
        : null;
      const nextBottom = bottomBar ? toRect(bottomBar.getBoundingClientRect()) : null;
      if (!sameRect(nextBottom, bottomBarRef.current)) {
        bottomBarRef.current = nextBottom;
        setBottomBarRect(nextBottom);
      }
      const panel = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="opponent-panel"]'
          )
        : null;
      const nextPanel = panel ? toRect(panel.getBoundingClientRect()) : null;
      if (!sameRect(nextPanel, panelRef.current)) {
        panelRef.current = nextPanel;
        setPanelRect(nextPanel);
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

  // Mobile has no board on the play page, so the won-board interlude is laid
  // out free-floating and centred instead of tracked onto page elements.
  const mobileInterlude = interlude && !boardImgRect && isMobile && viewport.vw > 0;
  const mBoardW = Math.min(viewport.vw - 24, 420);
  const M_BAR_H = 56;
  const M_GAP = 8;
  const mLeft = Math.round((viewport.vw - mBoardW) / 2);
  const mTop = Math.max(
    12,
    Math.round((viewport.vh - (mBoardW + M_BAR_H * 2 + M_GAP * 2)) / 2)
  );
  const mTopBar: Rect = { top: mTop, left: mLeft, width: mBoardW, height: M_BAR_H };
  const mBoard: Rect = {
    top: mTop + M_BAR_H + M_GAP,
    left: mLeft,
    width: mBoardW,
    height: mBoardW,
  };
  const mBottomBar: Rect = {
    top: mBoard.top + mBoardW + M_GAP,
    left: mLeft,
    width: mBoardW,
    height: M_BAR_H,
  };

  // Spotlight geometry: pads the union of anchor rects; collapses to a point
  // when a step has no anchor so the 200vmax shadow dims the whole screen.
  const PAD = 8;
  const spotRect = spot ?? rect;
  // The step 2 -> 3 interlude no longer spotlights the board: it plays with a
  // plain dim backdrop (no cutout, no ring) so nothing jumps to the board.
  const showSpotlight = anchored && !!spotRect;
  const hole: Rect =
    showSpotlight && spotRect
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

  // Steps 3 and 4: match the tooltip to the demo card's on-screen width. The
  // column below is w-[min(430px, 92vw)] (min(430px, 100vw-24px) on mobile),
  // then ScaleToFit may scale it down — so multiply by that same factor.
  const demoColumnWidth =
    viewport.vw <= 0
      ? 0
      : viewport.vw >= MOBILE_BP
        ? Math.min(430, viewport.vw * 0.92)
        : Math.min(430, viewport.vw - 24);
  const demoTooltipWidth =
    demoColumnWidth > 0 && (step?.demo === "win" || step?.demo === "lose")
      ? Math.round(demoColumnWidth * demoScale)
      : undefined;
  // The mobile tooltip runs larger type and pill buttons, so it needs a
  // taller estimate than the desktop card for the placement math below.
  const EST_TOOLTIP_H = viewport.vw > 0 && viewport.vw < 640 ? 235 : 180;
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
      {/* Spotlight (the huge shadow doubles as the backdrop). The step 2 -> 3
          interlude shows the live page layout instead, with no dim and no
          highlight, so the backdrop is skipped entirely during it. */}
      {!interlude && (
        <div
          className="fixed pointer-events-none"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            borderRadius: 18,
            boxShadow: showSpotlight
              ? "0 0 0 2px rgba(124,192,242,0.95), 0 0 0 200vmax rgba(9,14,40,0.62)"
              : "0 0 0 200vmax rgba(9,14,40,0.62)",
            transition: "all 350ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      )}

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
            className="fixed inset-0 flex flex-col items-center overflow-y-auto overscroll-contain p-4"
          >
            {/* m-auto centers the column when it fits (same as the old
                justify-center) and top-aligns + scrolls when the viewport is
                too short (14" laptops), instead of clipping both edges */}
            <div className="m-auto flex flex-col items-center">
              <TourTooltip
                step={step}
                index={index}
                onSkip={next}
                onPrev={prev}
                onNext={next}
                caret="bottom"
                widthPx={demoTooltipWidth}
              />
              {/* the analyze demo keeps overflow visible so the swiper card
                  deck can rotate outside its own bounds, like the real modal */}
              {/* same width as the tooltip above it on mobile */}
              <div className="w-[min(430px,calc(100vw-24px))] sm:w-[min(430px,92vw)] mt-[14px] rounded-2xl">

                {step.demo === "win" && (
                  <ScaleToFit onMeasure={reportWinCardHeight} onScale={reportDemoScale}>
                    <WinModalCard
                      variant="tour"
                      oldElo={375}
                      newElo={400}
                      delta={25}
                      opponentName="Lisa"
                      opponentElo={250}
                    />
                  </ScaleToFit>
                )}
                {step.demo === "lose" && (
                  <ScaleToFit
                    referenceHeight={winCardHeightRef.current || undefined}
                    onScale={reportDemoScale}
                  >
                    <LoseModalCard
                      variant="tour"
                      oldElo={400}
                      newElo={375}
                      delta={-25}
                      opponentName="Lisa"
                      opponentElo={250}
                    />
                  </ScaleToFit>
                )}
                {step.demo === "analyze" && <DemoAnalyzeCard />}
              </div>
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
            {topBarRect && <InterludeCaptureBar rect={topBarRect} variant="lost" />}
            {bottomBarRect && <InterludeCaptureBar rect={bottomBarRect} variant="won" />}
            {panelRect && <InterludeMoveList rect={panelRect} />}
          </motion.div>
        )}

        {mobileInterlude && (
          <motion.div
            key="interlude-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="fixed inset-0 bg-[rgba(9,14,40,0.62)] pointer-events-none" />
            <InterludeCaptureBar rect={mTopBar} variant="lost" />
            <InterludeBoard rect={mBoard} onDone={next} />
            <InterludeCaptureBar rect={mBottomBar} variant="won" />
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
