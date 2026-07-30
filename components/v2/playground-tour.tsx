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
   * Parks the tooltip right under the app header and scrolls the anchor to sit
   * just below it, so no dead space is left between the two. Computed from the
   * measured header and tooltip, which beats hand-tuning scrollMargin per step.
   */
  tooltipUnderHeader?: boolean;
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

/** px of padding the spotlight leaves around the anchor it cuts out */
const PAD = 8;
/** px the spotlight keeps clear of the screen edges (its horizontal padding
 *  gives way rather than running off-screen) */
const SPOTLIGHT_EDGE = 8;
/** px kept clear between the app header and a tooltip parked under it */
const HEADER_GAP = 12;
/** px between a tooltip and the anchor its caret points at */
const CARET_GAP = 14;
/** px kept clear of the viewport edges */
const VIEWPORT_MARGIN = 12;
/** the demo column's own padding (p-4), top + bottom */
const DEMO_COLUMN_PAD = 32;

/** Bottom edge of the app's fixed header (banner included) — where a tooltip
 *  parked at the top of the screen has to start. Falls back to the mobile
 *  navbar height if the header can't be found. */
function headerBottom(): number {
  const el = document.querySelector<HTMLElement>("header");
  if (el) {
    const position = getComputedStyle(el).position;
    const bottom = el.getBoundingClientRect().bottom;
    // in-page <header> elements scroll away and must not be mistaken for it
    if ((position === "fixed" || position === "sticky") && bottom > 0 && bottom < 240) {
      return Math.round(bottom);
    }
  }
  return 72;
}

function resolveStep(step: TourStep, mobile: boolean): TourStep {
  return mobile && step.mobile ? { ...step, ...step.mobile } : step;
}

const STEPS: TourStep[] = [
  {
    title: "Tutorial: Welcome to The Playground",
    content: "Start your Game against one of our many AI opponents.",
    // Desktop cuts out the two hero cards and nothing else, so the highlight
    // starts at the top edge of the chessboard card. It used to merge in the top
    // bar (include: ["play-top-bar"]), and that union reached from the top bar
    // down past the board — up under the fixed navbar — lighting both. The board
    // card stays the primary anchor, so the tooltip keeps its position over it.
    anchors: ["board-preview", "opponent-panel"],
    include: ["opponent-panel"],
    scrollAnchor: "play-top-bar",
    // No tooltipBottomAt: that pinned the tooltip 96px *into* the board card, so
    // it sat over the pieces. Without it the placement math puts it wholly above
    // the cutout with the caret pointing down at the card's top edge (it lands
    // over the dimmed top bar, which is the only room there is at the top of the
    // page). A viewport too short for that still falls back to over-the-target.
    // Mobile spotlights the Play VS AI card alone (no leaderboard), with the
    // tooltip entirely above it and the caret pointing down at the card's top
    // edge — so the card's "Play VS AI" heading stays visible above Choose Your
    // Color. tooltipUnderHeader pulls the pair as high as the navbar allows
    // instead of leaving dead space above the tooltip; scrollMargin is only the
    // first-frame fallback, used until the tooltip has been measured. No
    // tooltipBottomAt: that would pin the tooltip over the heading instead.
    mobile: {
      anchors: ["opponent-panel"],
      include: [],
      scrollAnchor: undefined,
      scrollMargin: 330,
      tooltipUnderHeader: true,
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

/** Rect of an element only when it actually occupies space. A hidden element
 *  (the play page's board preview below 640px) still answers querySelector and
 *  still returns a DOMRect, just a 0x0 one — treating that as "present" is what
 *  made mobile take the desktop interlude path and draw its overlays at
 *  nonsense positions. */
function visibleRect(el: HTMLElement | null): Rect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return toRect(r);
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
  onHeight,
}: {
  step: TourStep;
  index: number;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  caret?: "top" | "bottom";
  /** overrides the default width — mobile matches the spotlight below it */
  widthPx?: number;
  /** reports the rendered height, which drives the placement math above */
  onHeight?: (height: number) => void;
  }) {
  const isLast = index === STEPS.length - 1;
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !onHeight) return;
    const report = () => onHeight(el.offsetHeight);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeight]);

  return (
    <div
      ref={boxRef}
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
// variant="tour") and its own analyze card. This wrapper measures a card and,
// when the viewport is too short to show it at full size, scales it down so it
// stays fully in view under the tour tooltip — the tour never scrolls.
//
// A CSS scale shrinks width along with height, which would leave the card
// narrower than the tooltip above it. So the card is laid out *wider* by the
// same factor it's scaled down by: 100%/scale in, scale out, and the visual
// width lands back on the column's — the tooltip's — width. Cards whose height
// is capped (the mobile animation) settle in one pass; ones that grow with
// width (the analyze board) would need an unbounded stretch, so it's capped at
// MAX_STRETCH and they end up a couple of percent narrow instead.
const MAX_STRETCH = 1.35;

function ScaleToFit({
  children,
  reserve = 210,
  referenceHeight,
  onMeasure,
}: {
  children: React.ReactNode;
  /** px kept clear for the tooltip + gaps above the card (measured by the tour
      once its tooltip has rendered; the default only covers that first frame) */
  reserve?: number;
  /**
   * When set, the scale is computed from this height instead of the card's
   * own — used so the win and lose demo cards share one scale factor and
   * therefore render their contents at exactly the same size. The box still
   * sizes to the card's own scaled height.
   */
  referenceHeight?: number;
  /** reports this card's natural (untransformed) height once measured */
  onMeasure?: (height: number) => void;
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
      const basis = referenceHeight && referenceHeight > 0 ? referenceHeight : natural;
      const avail = window.innerHeight - reserve;
      const next = Math.min(1, avail / basis);
      // The counter-stretch below feeds the new layout width back into this
      // measurement, so ignore hair-thin changes: they'd keep the observer
      // firing without moving anything.
      setScale((current) => (Math.abs(current - next) < 0.004 ? current : next));
      setBoxHeight((current) => {
        const height = Math.round(natural * next);
        return current !== undefined && Math.abs(current - height) < 1 ? current : height;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reserve, referenceHeight, onMeasure]);

  // The stretched box is wider than the container, so it's pulled back by half
  // the excess and scaled about its own centre. That keeps it centred whatever
  // the scale — including when MAX_STRETCH caps the compensation and the card
  // ends up a shade narrower than the column.
  const widthPct = Math.min(MAX_STRETCH, 1 / scale) * 100;

  return (
    <div style={{ height: boxHeight, width: "100%" }}>
      <div
        ref={innerRef}
        style={{
          width: `${widthPct}%`,
          marginLeft: `${(100 - widthPct) / 2}%`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
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
// Shows a decisive winning position for a moment before the You Won step.

const INTERLUDE_HOLD_MS = 1000;

// One real game drives everything the interlude shows — the final position, the
// move list, both captured rows and the last-move highlight — so the piece
// counts, colors and squares can never contradict each other (the old
// hand-written lists even included a captured king). Morphy's Opera Game, 1858:
// White mates on move 17 after a queen sacrifice.
const INTERLUDE_SAN = [
  "e4", "e5", "Nf3", "d6", "d4", "Bg4", "dxe5", "Bxf3", "Qxf3", "dxe5",
  "Bc4", "Nf6", "Qb3", "Qe7", "Nc3", "c6", "Bg5", "b5", "Nxb5", "cxb5",
  "Bxb5+", "Nbd7", "O-O-O", "Rd8", "Rxd7", "Rxd7", "Rd1", "Qe6", "Bxd7+",
  "Nxd7", "Qb8+", "Nxb8", "Rd8#",
];

function buildInterludeGame() {
  const chess = new Chess();
  // Each side's row lists the pieces it took, so the icon color is the
  // opponent's — same convention as the real game screen's capture rows.
  const whiteCaptures: string[] = [];
  const blackCaptures: string[] = [];
  const moves: [string, string][] = [];
  let lastMove: [string, string] | null = null;

  for (const san of INTERLUDE_SAN) {
    let move;
    try {
      move = chess.move(san);
    } catch {
      break; // a bad SAN shortens the demo game rather than taking the tour down
    }
    if (!move) break;
    if (move.captured) {
      const icon = (move.color === "w" ? "b" : "w") + move.captured.toUpperCase();
      (move.color === "w" ? whiteCaptures : blackCaptures).push(icon);
    }
    if (move.color === "w") moves.push([move.san, ""]);
    else if (moves.length) moves[moves.length - 1][1] = move.san;
    lastMove = [move.from, move.to];
  }

  return { fen: chess.fen(), whiteCaptures, blackCaptures, moves, lastMove };
}

const INTERLUDE_GAME = buildInterludeGame();

const WON_FEN = INTERLUDE_GAME.fen;
/** Black pieces White captured — shown on White's (the winner's) row. */
const CAPTURED_BY_WHITE = INTERLUDE_GAME.whiteCaptures;
/** White pieces Black captured — shown on Black's row. */
const CAPTURED_BY_BLACK = INTERLUDE_GAME.blackCaptures;

// Win/lose player bars drawn over the preview card's own bars during the
// interlude — same colors and captured-piece treatment as the real game's
// BlackPlayer/WhitePlayer rows, with the pieces popping in one by one.
function InterludeCaptureBar({ rect, variant }: { rect: Rect; variant: "lost" | "won" }) {
  const { PieceChoosed } = useChessBoardThemeStore();
  const lost = variant === "lost";
  // Each row shows that player's own captures, not their losses.
  const icons = lost ? CAPTURED_BY_BLACK : CAPTURED_BY_WHITE;
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

// Move list shown over the opponent panel during the interlude so the right
// column reads like the real vs-AI game screen (Movement Details + a won-game
// banner). Same replay as the board, so the moves match the position.
const INTERLUDE_MOVES: [string, string][] = INTERLUDE_GAME.moves;

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

/* -------------- mobile interlude: the won game screen (step 2 -> 3) ------ */
// Mobile has no board on the play page, so rather than floating a board over a
// dim backdrop this replicates the vs-AI game screen in its won state, per
// design: captured rows, board, legend, win banner, the finish buttons, the
// tabs and the move boxes. It starts below the real navbar so the app frame
// still shows through.

// The mating move, highlighted with the board's own previous/current colors.
const WON_SQUARE_STYLES: Record<string, { backgroundColor: string }> =
  INTERLUDE_GAME.lastMove
    ? {
        [INTERLUDE_GAME.lastMove[0]]: { backgroundColor: "#B9CA43" },
        [INTERLUDE_GAME.lastMove[1]]: { backgroundColor: "#F5F682" },
      }
    : {};

// Everything above and below the board inside the sheet. Used to pick a board
// size that lets the whole screen fit without scrolling, like the design.
const M_SHEET_CHROME = 452;

function MobileCapturedRow({
  icons,
  align,
  pieceTheme,
}: {
  icons: string[];
  align: "start" | "end";
  pieceTheme: string;
}) {
  return (
    <div
      className={`flex items-center flex-1 ${
        align === "end" ? "justify-end" : ""
      }`}
    >
      {icons.map((icon, i) => (
        <Image
          key={`${icon}-${i}`}
          src={`/pieces/${pieceTheme}/${icon}.png`}
          alt=""
          width={50}
          height={50}
          className={`w-[22px] h-[22px] object-contain ${i > 0 ? "-ml-3" : ""}`}
          style={{ zIndex: icons.length - i }}
        />
      ))}
    </div>
  );
}

function MobileWonGameSheet({ onDone }: { onDone: () => void }) {
  const { PieceChoosed } = useChessBoardThemeStore();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [boardW, setBoardW] = useState(0);

  useEffect(() => {
    const t = setTimeout(onDone, INTERLUDE_HOLD_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const measure = () => {
      const byWidth = el.clientWidth - 32;
      const byHeight = el.clientHeight - M_SHEET_CHROME;
      setBoardW(Math.max(180, Math.min(byWidth, byHeight, 420)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The final moves only — the design shows the tail of the game with the WIN
  // marker, and a narrow screen can't hold all ten columns anyway.
  const tailMoves = INTERLUDE_MOVES.slice(-6);
  const firstTailNumber = INTERLUDE_MOVES.length - tailMoves.length + 1;

  return (
    <div
      ref={sheetRef}
      className="fixed inset-x-0 bottom-0 bg-white overflow-hidden pointer-events-none flex flex-col"
      style={{
        top: "calc(var(--banner-height, 0px) + var(--current-header-height, 0px))",
      }}
    >
      {/* header: back + "You (White) VS Lisa (250)" + board controls */}
      <div className="w-full flex justify-between items-center px-[16px] pt-[12px]">
        <div className="flex items-center gap-[8px] min-w-0">
          <ArrowLeft color="black" size={22} className="shrink-0" />
          <span className="text-[15px] truncate">You (White) VS Lisa (250)</span>
        </div>
        <div className="flex items-center gap-[10px] shrink-0">
          <Image
            src="/images/play-vs-ai/switch.png"
            alt=""
            width={20}
            height={20}
            className="w-[20px] h-[20px] object-contain"
          />
          <Settings size={18} className="text-[#221AE9]" />
        </div>
      </div>

      {/* Captured rows exactly as the game screen builds them: the left row is
          what White took (black pieces), the right what Black took. */}
      <div className="flex justify-between items-center w-full px-4 py-[6px]">
        <MobileCapturedRow icons={CAPTURED_BY_WHITE} align="start" pieceTheme={PieceChoosed} />
        <div className="w-px mx-2" />
        <MobileCapturedRow icons={CAPTURED_BY_BLACK} align="end" pieceTheme={PieceChoosed} />
      </div>

      <div className="flex flex-col items-center gap-[8px] px-[16px]">
        {boardW > 0 && (
          <div className="relative" style={{ width: boardW }}>
            <TwoDChessboard
              arePiecesClickable={false}
              arePiecesDraggable={false}
              boardWidth={boardW}
              orientation="white"
              position={WON_FEN}
              onPromotionPieceSelect={() => false}
              promotionToSquare={null}
              showPromotionDialog={false}
              customSquareStyles={WON_SQUARE_STYLES}
              customArrows={[]}
              areArrowsAllowed={false}
              customArrowColor=""
            />
          </div>
        )}

        {/* board legend */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-[14px] h-[14px] bg-[#B9CA43]" />
            <span className="text-[11px]">Previous Position</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-[14px] h-[14px] bg-[#F5F682]" />
            <span className="text-[11px]">Current Position</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-[14px] h-[14px] rounded-full bg-[#1C16C2]" />
            <span className="text-[11px]">Possible Move</span>
          </div>
        </div>

        {/* win banner */}
        <div className="relative w-full overflow-hidden rounded-[8px] border border-[#00B427] bg-[linear-gradient(to_right,#E9F8EC,#CFF3D9)] h-[44px] flex items-center gap-[10px] px-[12px]">
          <Image
            src="/images/play-vs-ai/trophy-win.png"
            alt=""
            width={40}
            height={40}
            className="w-[24px] h-[24px] object-contain shrink-0"
          />
          <span className="font-semibold text-[13px] text-[#0A6D23]">
            Congratulations! You have won this Game!
          </span>
          <Image
            src="/images/play-vs-ai/sparks-win.png"
            alt=""
            width={200}
            height={56}
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-70"
          />
        </div>

        {/* finish buttons */}
        <div className="w-full flex flex-col gap-[8px]">
          <div className="w-full h-[40px] rounded-full border-[3px] border-[#19A23C] bg-[#34C759] flex items-center justify-center gap-[8px] font-medium text-[15px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 13.3327V6.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 13.3327V2.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 13.332V9.33203" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Analyze Now
          </div>
          <div className="flex w-full gap-2">
            <div className="bg-white w-full rounded-full h-[40px] border border-[#C0CED4] flex items-center justify-center gap-2">
              <Image
                src="/images/play-vs-ai/clipboard.png"
                alt=""
                width={40}
                height={40}
                className="h-[18px] w-[18px] object-contain"
              />
              <span className="font-medium text-[14px] text-[#221AE9]">Share PGN/FEN</span>
            </div>
            <div className="w-full rounded-full h-[40px] bg-[#C6EEFE] border border-[#7CC0F2] flex items-center justify-center gap-2">
              <span className="text-[#221AE9] font-medium text-[14px]">+ New Game</span>
            </div>
          </div>
        </div>
      </div>

      {/* tabs + move boxes */}
      <div className="mt-[10px] flex bg-[#F7FCFF] border-b border-gray-200">
        <div className="flex-1 flex items-center justify-center gap-2 py-[10px] relative">
          <Image
            src="/images/play-vs-ai/chess-king-rook-active.png"
            alt=""
            width={19}
            height={19}
            className="w-[19px] h-[19px] object-contain"
          />
          <span className="text-[14px] font-semibold text-[#221AE9]">Current Game</span>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#221AE9]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 py-[10px]">
          <Image
            src="/images/play-vs-ai/past-games.png"
            alt=""
            width={18}
            height={18}
            className="w-[18px] h-[18px] object-contain"
          />
          <span className="text-[14px] font-semibold text-black">Past Games</span>
        </div>
      </div>

      <div className="px-4 pt-[8px] overflow-hidden">
        <div className="flex gap-1">
          {/* sticky White/Black labels, as on the real screen */}
          <div className="flex flex-col gap-1 min-w-[60px] shrink-0">
            <div className="h-[22px]" />
            <div className="bg-[#E6F7FE] border border-[#C6EEFE] rounded-lg px-3 py-2 min-h-[36px] flex items-center justify-center">
              <span className="text-[14px] font-medium">White</span>
            </div>
            <div className="bg-[#E6F7FE] border border-[#C6EEFE] rounded-lg px-3 py-2 min-h-[36px] flex items-center justify-center">
              <span className="text-[14px] font-medium">Black</span>
            </div>
          </div>

          {tailMoves.map(([white, black], i) => (
            <div key={i} className="flex flex-col gap-1 min-w-[60px]">
              <div className="text-center text-[13px] font-medium text-gray-600 h-[22px] flex items-center justify-center">
                Move {firstTailNumber + i}
              </div>
              <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 min-h-[36px] flex items-center justify-center">
                <span className="text-[14px] font-medium">{white}</span>
              </div>
              <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 min-h-[36px] flex items-center justify-center">
                <span className="text-[14px] font-medium">{black}</span>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1 min-w-[60px]">
            <div className="h-[22px]" />
            <div className="bg-white border border-[#DEDEDE] rounded-lg px-3 py-2 min-h-[36px] flex items-center justify-center">
              <span className="text-[14px] font-bold text-green-500">WIN</span>
            </div>
            <div className="min-h-[36px]" />
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
    // Black rook on h7 (not h8), pawns on f5/g5, black pawn on h6, no d2 pawn —
    // and e7 holds a WHITE pawn, since the coached move "e7d8r" is a promotion
    // that takes the queen on d8.
    fen: "r2qkbn1/pp1bP2r/7p/5pP1/1n6/8/PPP1P1PP/RNBQKB1R w KQq - 0 11",
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
    // Same f5/g5 pawn pair as card 1 (the white pawn sits on g5, not e5), and
    // the black king is on e8 — on f8 it stood in check from the d6 bishop
    // while it was White's move, which can't happen.
    fen: "3rk1nr/p2b4/3B3p/5pP1/4P3/8/PPP2PPP/R1NQK2R w KQk - 0 17",
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
    // "f6 to f7" is a pawn push, so f6 holds a white PAWN and the queen stays on
    // f5. The black king is on d8: from c8 it stood in check from that queen
    // while it was White's move. Rf1 is unambiguous — the king blocks the a1
    // rook from reaching f1.
    fen: "3k4/8/p1b2P2/5Q2/8/3N4/PPP2PPP/R3K2R w KQ - 0 27",
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

// Height of everything in the card except the board — title, slide chrome,
// board controls, the detail box and the pager. The mobile board is sized from
// what's left of the card's height budget, so the card fits at full width
// instead of scaling down and ending up narrower than the tooltip.
const ANALYZE_CHROME = 410;
const ANALYZE_BOARD_MIN = 200;

// Mini replica of the real Game Analysis modal (GameAnalysis.tsx): same card
// deck swipe (Swiper cards effect), same slide layout, auto-playing.
function DemoAnalyzeCard({ maxHeight }: { maxHeight?: number }) {
  const swiperRef = useRef<SwiperType>();
  const [activeIndex, setActiveIndex] = useState(0);
  const shortViewport = useShortViewport();
  // Mobile fills the card with the board (design), capped by the height it has
  // to play with; desktop keeps the compact fixed sizes the tour has always
  // used there — a full-width board would push the card past the fold.
  const cardRef = useRef<HTMLDivElement>(null);
  const [mobileBoardW, setMobileBoardW] = useState(0);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      // card padding (16 x2) + slide padding (16 x2) + slide border
      const inner = el.clientWidth - 66;
      if (window.innerWidth >= MOBILE_BP || inner <= 0) {
        setMobileBoardW(0);
        return;
      }
      const byHeight = maxHeight ? maxHeight - ANALYZE_CHROME : inner;
      setMobileBoardW(Math.min(inner, Math.max(ANALYZE_BOARD_MIN, byHeight)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [maxHeight]);
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
      className="relative w-full bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] p-[16px] sm:p-[10px] select-none pointer-events-none"
    >
      {/* Modal chrome from the real Game Analysis dialog — the close button is
          decorative here; the tour's own controls drive the step. */}
      <span className="absolute top-[16px] right-[16px] sm:top-[10px] sm:right-[10px]">
        <svg width="24" height="24" viewBox="0 0 40 40" fill="none" className="sm:w-[18px] sm:h-[18px]">
          <path d="M30 10L10 30" stroke="black" strokeWidth="4" strokeLinecap="round" />
          <path d="M10 10L30 30" stroke="black" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </span>

      <h3 className="text-[18px] sm:text-[16px] text-center font-bold text-[#121212] mb-[16px] sm:mb-[10px]">
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
            <div className="bg-white border border-[#221AE9] rounded-[8px] p-[16px] sm:p-[12px] shadow-[0px_4px_10px_0px_rgba(23,28,183,.25)]">
              <div className="w-full flex flex-col gap-[10px] sm:gap-[6px] items-center justify-center mb-[16px] sm:mb-[10px]">
                <div
                  style={{ width: BOARD_W }}
                  className="flex flex-row justify-end items-center gap-3"
                >
                  <Image
                    src="/images/play-vs-ai/switch.png"
                    alt="switch"
                    width={20}
                    height={20}
                    className="w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] rounded-full object-contain"
                  />
                  <Settings size={18} className="text-[#221AE9] sm:w-[16px] sm:h-[16px]" />
                </div>
                <DemoSlideBoard mistake={mistake} boardWidth={BOARD_W} />
              </div>

              <div className="w-full border border-[#221AE9] rounded-[8px]">
                <div className="flex items-center justify-between py-[4px] rounded-t-[7px] px-[10px] bg-gradient-to-tr from-[#2327EB] to-[#25CADC]">
                  <div className="flex items-center gap-[8px] sm:gap-[6px] min-w-0">
                    <div className="flex items-center gap-[6px] sm:gap-[4px] px-[8px] py-[3px] sm:px-[6px] sm:py-[2px] bg-white border border-[#FF7769] text-[#FF7769] rounded-[4px] shrink-0">
                      <Image
                        src="/images/analysis/icon_miss.png"
                        alt="miss"
                        width={18}
                        height={18}
                        className="w-[18px] h-[18px] sm:w-[14px] sm:h-[14px] object-contain"
                      />
                      <span className="font-semibold text-[13px] sm:text-[11px]">{mistake.type}</span>
                    </div>
                    <span className="font-bold text-white text-[14px] sm:text-[12px] truncate">
                      Move {mistake.moveNumber}: {mistake.move}
                    </span>
                  </div>
                  <div className="flex gap-[8px] sm:gap-[6px] items-center shrink-0">
                    {/* same sign rule as the real modal: losses red, gains green */}
                    <span
                      className={`${
                        mistake.keyEvaluation < 0
                          ? "text-[#E22B32] border-[#E22B32]"
                          : "text-[#00B427] border-[#00B427]"
                      } border font-medium text-[14px] sm:text-[11px] bg-white rounded-full py-[2px] px-[10px] sm:py-[1px] sm:px-[8px]`}
                    >
                      {mistake.keyEvaluation}
                    </span>
                    <span className="w-[32px] h-[32px] sm:w-[24px] sm:h-[24px] flex items-center justify-center bg-[#E6F7FE] border border-[#C6EEFE] rounded-[8px] sm:rounded-[6px]">
                      <Bookmark className="w-[14px] h-[14px] sm:w-[12px] sm:h-[12px]" color="#221AE9" />
                    </span>
                  </div>
                </div>
                {/* fixed height keeps every card identical so the swiper
                    doesn't reserve extra room under the shorter slides */}
                <div className="p-[10px] pt-[8px] h-[178px] sm:p-[8px] sm:h-[136px] overflow-hidden">
                  <h3 className="flex items-center gap-[8px] sm:gap-[6px] mb-[4px] sm:mb-[2px]">
                    <Image
                      src="/images/analysis/icon_analysis.svg"
                      alt="analysis"
                      width={28}
                      height={28}
                      className="w-[28px] h-[28px] sm:w-[20px] sm:h-[20px] object-contain"
                    />
                    <span className="font-bold text-[18px] sm:text-[14px] text-[#040404]">Analysis</span>
                  </h3>
                  <p className="text-[15px] sm:text-[12px] leading-[130%] text-[#585858] mb-[8px] sm:mb-[6px] min-h-[40px] sm:min-h-[32px]">
                    {mistake.analysis}
                  </p>
                  <div className="flex w-full items-center bg-[#1C17A6] gap-[16px] sm:gap-[10px] p-[8px] sm:p-[6px] rounded-[8px]">
                    <Image
                      src="/images/analysis/icon_union.svg"
                      alt="analysis"
                      width={44}
                      height={44}
                      className="w-[44px] h-[44px] sm:w-[30px] sm:h-[30px] object-contain"
                    />
                    <div className="relative leading-[120%] flex items-center min-h-[44px] sm:min-h-[34px] w-full rounded-[8px] text-[14px] sm:text-[11px] text-white px-[10px] py-[8px] sm:px-[8px] sm:py-[6px] bg-gradient-to-br from-[#2327EB] to-[#25CADC] before:content-[''] before:w-[16px] before:h-[16px] before:absolute before:top-[50%] before:left-[-16px] before:-translate-y-[50%] sm:before:w-[12px] sm:before:h-[12px] sm:before:left-[-12px] before:bg-[url(/images/analysis/tail.svg)] before:bg-cover before:bg-no-repeat before:bg-center">
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

  // Rendered tooltip height, reported by TourTooltip. The placement math needs
  // it to know whether a step's tooltip fits above its target and where its
  // bottom edge lands, and mobile step 1 sizes its scroll margin from it.
  const [tooltipH, setTooltipH] = useState(0);
  const reportTooltipHeight = useRef((height: number) =>
    setTooltipH((current) => (current === height ? current : height))
  ).current;

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
  // Skip doesn't step forward — it jumps to the closing "You're All Set" card,
  // so one tap ends the walkthrough on the screen that hands the user the page.
  const skip = () => {
    setInterlude(false);
    setIndex(FINALE_INDEX);
  };

  // The interlude is advanced by whichever overlay renders (the tracked board on
  // desktop, the won-game sheet on mobile). If neither can — no visible board
  // and not a mobile layout — this keeps the tour from getting stuck on it.
  useEffect(() => {
    if (!interlude) return;
    const t = setTimeout(() => {
      setInterlude(false);
      setIndex(2);
    }, INTERLUDE_HOLD_MS + 1500);
    return () => clearTimeout(t);
  }, [interlude]);

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
    // tooltipUnderHeader steps derive their margin instead of hard-coding one.
    // Ideally the tooltip parks just below the navbar, but a target taller than
    // the room that leaves (the Play VS AI card on a phone) would have its
    // bottom cut off, so the pair rides higher — up to the viewport edge, over
    // the dimmed navbar — until the whole target fits. On the first frame the
    // tooltip isn't measured yet and the step's static scrollMargin stands in
    // until it is (this effect re-runs then).
    let margin = (!interlude && step?.scrollMargin) || 110;
    if (!interlude && step?.tooltipUnderHeader && tooltipH) {
      const above = tooltipH + CARET_GAP + PAD; // room the tooltip needs
      const underHeader = headerBottom() + HEADER_GAP + above;
      const wholeTargetFits =
        window.innerHeight - VIEWPORT_MARGIN - el.offsetHeight - PAD;
      margin = Math.max(VIEWPORT_MARGIN + above, Math.min(underHeader, wholeTargetFits));
    }
    el.style.scrollMarginTop = `${Math.round(margin)}px`;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, interlude, tooltipH]);

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
      const nextImg = visibleRect(img);
      if (!sameRect(nextImg, boardImgRef.current)) {
        boardImgRef.current = nextImg;
        setBoardImgRect(nextImg);
      }
      const topBar = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-bar="opponent"]'
          )
        : null;
      const nextTop = visibleRect(topBar);
      if (!sameRect(nextTop, topBarRef.current)) {
        topBarRef.current = nextTop;
        setTopBarRect(nextTop);
      }
      const bottomBar = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-bar="player"]'
          )
        : null;
      const nextBottom = visibleRect(bottomBar);
      if (!sameRect(nextBottom, bottomBarRef.current)) {
        bottomBarRef.current = nextBottom;
        setBottomBarRect(nextBottom);
      }
      const panel = interlude
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="opponent-panel"]'
          )
        : null;
      const nextPanel = visibleRect(panel);
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

  // Nothing scrolls while the tour is on screen — not the page behind it (the
  // tooltip and spotlight are pinned to live element rects, so a stray wheel or
  // swipe would slide the target out from under them) and not the demo column,
  // whose cards scale themselves down to fit instead. Only user-initiated
  // scrolling is blocked: the tour's own scrollIntoView and the step-2 showcase
  // sweep still run.
  useEffect(() => {
    if (!open) return;
    const block = (e: Event) => {
      e.preventDefault();
    };
    const SCROLL_KEYS = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
      "Spacebar",
    ]);
    const blockKeys = (e: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(e.key)) return;
      // Space still has to press a focused tour button (Skip/Prev/Next), which
      // a cancelled keydown would swallow.
      const target = e.target;
      if (
        (e.key === " " || e.key === "Spacebar") &&
        target instanceof Element &&
        target.closest("button, a, input, textarea, select")
      ) {
        return;
      }
      e.preventDefault();
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys);
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
    };
  }, [open]);

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

  // Mobile has no board on the play page, so the interlude renders the whole
  // won game screen (MobileWonGameSheet) instead of tracking page elements.
  const mobileInterlude = interlude && !boardImgRect && isMobile && viewport.vw > 0;

  // Spotlight geometry: pads the union of anchor rects; collapses to a point
  // when a step has no anchor so the 200vmax shadow dims the whole screen.
  const spotRect = spot ?? rect;
  // The step 2 -> 3 interlude no longer spotlights the board: it plays with a
  // plain dim backdrop (no cutout, no ring) so nothing jumps to the board.
  const showSpotlight = anchored && !!spotRect;
  // Sideways the padding gives way once the target already reaches the screen
  // edges — the mobile Play VS AI card sits 8px off them, so a full 8px pad put
  // the ring past the viewport and made the card look wider than the tooltip
  // above it. Vertically there's always room, so that pad never changes.
  const padX = spotRect
    ? Math.max(
        0,
        Math.min(
          PAD,
          Math.round((viewport.vw - SPOTLIGHT_EDGE * 2 - spotRect.width) / 2)
        )
      )
    : PAD;
  const hole: Rect =
    showSpotlight && spotRect
      ? {
          top: spotRect.top - PAD,
          left: spotRect.left - padX,
          width: spotRect.width + padX * 2,
          height: spotRect.height + PAD * 2,
        }
      : { top: viewport.vh / 2, left: viewport.vw / 2, width: 0, height: 0 };

  // Anchored tooltip: a step can pin its bottom edge relative to the primary
  // anchor's top (tooltipBottomAt); otherwise it goes above the target when
  // there's room, below when there's room underneath, or pinned over the
  // target's top edge (tall targets like the chessboard card). Always inside
  // the viewport, so it can never hide behind the fixed navbar.
  const BASE_TOOLTIP_W = Math.min(430, Math.max(viewport.vw - 24, 0));

  // On mobile the tooltip stretches out to the spotlight ring when the card it
  // points at is wider than the default — sitting a few px inside the ring made
  // it read as narrow for the screen. Never narrower than the demo steps' width,
  // so all five steps stay the same size. Desktop keeps the default: its step-1
  // spotlight spans the whole hero, which would blow the tooltip up.
  const anchoredTooltipW =
    isMobile && anchored && spotRect
      ? Math.round(
          Math.min(
            Math.max(hole.width, BASE_TOOLTIP_W),
            Math.max(viewport.vw - SPOTLIGHT_EDGE * 2, BASE_TOOLTIP_W)
          )
        )
      : undefined;
  const TOOLTIP_W = anchoredTooltipW ?? BASE_TOOLTIP_W;

  // Real rendered height once TourTooltip has reported it; the estimate only
  // covers the very first frame of a step (mobile runs larger type and pill
  // buttons, so its card is the taller of the two).
  const TOOLTIP_H = tooltipH || (isMobile ? 235 : 180);
  let mode: "edge" | "above" | "below" | "over" = "over";
  if (
    step?.tooltipBottomAt !== undefined &&
    rect &&
    rect.top + step.tooltipBottomAt - TOOLTIP_H >= VIEWPORT_MARGIN
  ) {
    mode = "edge";
  } else if (hole.top - CARET_GAP - TOOLTIP_H >= VIEWPORT_MARGIN) mode = "above";
  else if (
    hole.top + hole.height + CARET_GAP + TOOLTIP_H <=
    viewport.vh - VIEWPORT_MARGIN
  )
    mode = "below";
  const tooltipTop =
    mode === "edge" && rect && step?.tooltipBottomAt !== undefined
      ? rect.top + step.tooltipBottomAt
      : mode === "above"
        ? hole.top - CARET_GAP
        : mode === "below"
          ? hole.top + hole.height + CARET_GAP
          : Math.max(hole.top + CARET_GAP, VIEWPORT_MARGIN);

  // Demo steps (3-5): the card gets whatever the tooltip, its gap and the
  // column's padding leave, and scales itself into it — the column can't be
  // scrolled, so anything that doesn't fit would be lost.
  const demoReserve = tooltipH
    ? tooltipH + CARET_GAP + DEMO_COLUMN_PAD + VIEWPORT_MARGIN
    : 210;
  const anchorCenterX = rect
    ? rect.left + rect.width / 2
    : hole.left + hole.width / 2;
  // Edge clamp: normally 12px, but a tooltip matched to a near-full-width
  // spotlight has less room than that, and clamping it to 12 would knock it out
  // of line with the highlight it belongs to.
  const edgeGap = Math.max(
    0,
    Math.min(VIEWPORT_MARGIN, Math.round((viewport.vw - TOOLTIP_W) / 2))
  );
  const tooltipLeft = Math.min(
    Math.max(anchorCenterX - TOOLTIP_W / 2, edgeGap),
    Math.max(viewport.vw - TOOLTIP_W - edgeGap, edgeGap)
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
                onSkip={skip}
                onPrev={prev}
                onNext={next}
                caret={rect ? (mode === "below" ? "top" : "bottom") : undefined}
                widthPx={anchoredTooltipW}
                onHeight={reportTooltipHeight}
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
            /* py only: the tooltip and card are already inset from the screen
               edges by their own width (100vw-24px), and horizontal padding on
               top of that made them wider than this box's content area, so they
               overflowed it and stopped centring evenly */
            className="fixed inset-0 flex flex-col items-center overscroll-contain py-4"
          >
            {/* m-auto centers the column; every card inside scales to the room
                the tooltip leaves, so the column never overflows (it can't be
                scrolled) */}
            <div className="m-auto flex flex-col items-center">
              <TourTooltip
                step={step}
                index={index}
                onSkip={skip}
                onPrev={prev}
                onNext={next}
                caret="bottom"
                onHeight={reportTooltipHeight}
              />
              {/* the analyze demo keeps overflow visible so the swiper card
                  deck can rotate outside its own bounds, like the real modal */}
              {/* same width as the tooltip above it on mobile */}
              <div className="w-[min(430px,calc(100vw-24px))] sm:w-[min(430px,92vw)] mt-[14px] rounded-2xl">

                {step.demo === "win" && (
                  <ScaleToFit reserve={demoReserve} onMeasure={reportWinCardHeight}>
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
                    reserve={demoReserve}
                    referenceHeight={winCardHeightRef.current || undefined}
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
                {step.demo === "analyze" && (
                  <ScaleToFit reserve={demoReserve}>
                    <DemoAnalyzeCard
                      maxHeight={Math.max(360, viewport.vh - demoReserve)}
                    />
                  </ScaleToFit>
                )}
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
            <MobileWonGameSheet onDone={next} />
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
