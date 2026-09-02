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
import { HeroPlayVSAIPreview } from "@/components/v2/hero-play-vs-ai-preview";

const WIN_LOTTIE = "/images/v2/play-vs-ai/WON.min.json";
const LOSE_LOTTIE = "/images/v2/play-vs-ai/LOSE.min.json";
const FINALE_IMG = "/images/v2/tutorial/chessboard.png";

const PENDING_KEY = "ac_playground_tour_pending_v1";

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
  anchors?: string[];
  include?: string[];
  scrollAnchor?: string;
  scrollMargin?: number;
  tooltipUnderHeader?: boolean;
  tooltipBottomAt?: number;
  scrollShowcase?: boolean;
  panelTuck?: number;
  cardTuck?: number;
  tooltipAfterLottie?: boolean;
  panelFull?: boolean;
  cardFill?: boolean;
  matchPanel?: boolean;
  demo?: "win" | "lose" | "analyze";
  mobile?: Omit<TourStep, "title" | "content" | "demo" | "mobile">;
};

const MOBILE_BP = 640;
const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BP;

const visibleHeight = (): number => {
  if (typeof window === "undefined") return 0;
  if (!isMobileViewport()) return window.innerHeight;
  const visual = window.visualViewport?.height;
  return Math.round(visual && visual > 0 ? visual : window.innerHeight);
};

const MIN_CARD_SCALE = 0.45;

const MOBILE_SCALE = 1.0;

const COMPACT_VH = 560;

const SPOT_FOLLOW = 0.22;
const SPOT_SNAP = 0.6;

const PAD = 8;

const SPOTLIGHT_EDGE = 8;
const HEADER_GAP = 12;

const CARET_GAP = 14;

const HERO_CARET_GAP = 20;
const VIEWPORT_MARGIN = 12;

const HERO_COPY_TOOLTIP_RESERVE = 150;
const HERO_PANEL_TUCK = 16;
const DEMO_COLUMN_PAD = 32;
const LOTTIE_FALLBACK_MS = 4000;

const TUCK_REFERENCE_VH = 700;
const TUCK_SHORTFALL_RATIO = 0.5;
const TUCK_MAX_BOOST = 96;

function headerBottom(): number {
  const el = document.querySelector<HTMLElement>("header");
  if (el) {
    const position = getComputedStyle(el).position;
    const bottom = el.getBoundingClientRect().bottom;
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
    anchors: ["board-preview", "opponent-panel"],
    include: ["opponent-panel"],
    scrollAnchor: "play-top-bar",
    mobile: {
      anchors: ["opponent-panel"],
      include: [],
      scrollAnchor: undefined,
      scrollMargin: 270,
      tooltipUnderHeader: true,
      tooltipBottomAt: undefined,
      panelFull: true,
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
    mobile: {
      anchors: ["opponent-panel"],
      include: [],
      scrollMargin: 240,
      tooltipUnderHeader: true,
      tooltipBottomAt: undefined,
      scrollShowcase: true,
      panelTuck: 86,
      panelFull: true,
    },
  },
  {
    title: "Tutorial: Rise up when you win",
    content:
      "Winning games can increase your ELO score. Every match affects your ELO score based on the skill level of your opponent.",
    demo: "win",
    panelTuck: 5,
    tooltipAfterLottie: true,
    panelFull: true,
    matchPanel: true,
    cardFill: true,
  },
  {
    title: "Tutorial: When you lose a game, your ELO decreases.",
    content:
      "But don't worry – tap Discover Mistakes to review where the game went wrong and learn how to play better next time.",
    demo: "lose",
    panelTuck: 0,
    tooltipAfterLottie: true,
    panelFull: true,
    matchPanel: true,
    cardFill: true,
  },
  {
    title: "Tutorial: Analyze Game",
    content:
      "Here you can discover your biggest mistakes and get a suggestion how to avoid them in the future.",
    demo: "analyze",
    panelTuck: 0,
    cardTuck: 999,
    panelFull: true,
  },
];

const FINALE_INDEX = STEPS.length;

type Rect = { top: number; left: number; width: number; height: number };
type Viewport = { vw: number; vh: number };

function findAnchor(
  anchors: string[] | undefined,
  root?: HTMLElement | null
): HTMLElement | null {
  const scope: ParentNode = root ?? document;
  for (const anchor of anchors ?? []) {
    const el = scope.querySelector<HTMLElement>(`[data-tour-anchor="${anchor}"]`);
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

function followRect(from: Rect | null, to: Rect, amount: number): Rect {
  if (!from) return to;
  const ease = (a: number, b: number) =>
    Math.abs(b - a) < SPOT_SNAP ? b : a + (b - a) * amount;
  return {
    top: ease(from.top, to.top),
    left: ease(from.left, to.left),
    width: ease(from.width, to.width),
    height: ease(from.height, to.height),
  };
}

function roundRect(r: Rect): Rect {
  return {
    top: Math.round(r.top),
    left: Math.round(r.left),
    width: Math.round(r.width),
    height: Math.round(r.height),
  };
}

function sameRect(a: Rect | null, b: Rect | null): boolean {
  if (a === null || b === null) return a === b;
  return (
    a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height
  );
}

function TourTooltip({
  step,
  index,
  onSkip,
  onPrev,
  onNext,
  caret,
  widthPx,
  compact,
  scale = 1,
  stretch = false,
  onHeight,
}: {
  step: TourStep;
  index: number;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  caret?: "top" | "bottom";
  widthPx?: number;
  compact?: boolean;
  scale?: number;
  stretch?: boolean;
  onHeight?: (height: number) => void;
  }) {
  const isLast = index === STEPS.length - 1;
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxHeight, setBoxHeight] = useState(0);
  const button =
    "font-semibold transition-colors rounded-full sm:px-4 sm:h-auto sm:py-[6px] sm:rounded-[8px] sm:text-[13px] " +
    (compact ? "px-3 h-7 text-[12px]" : "px-4 h-8 text-[13px]");

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const report = () => {
      const height = Math.round(el.offsetHeight * scale);
      setBoxHeight((current) => (current === height ? current : height));
      onHeight?.(height);
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeight, scale]);

  return (
    <div
      className="relative w-[min(430px,calc(100vw-24px))]"
      style={{ width: widthPx, height: boxHeight || undefined }}
    >
      <div
        ref={boxRef}
        style={
          scale === 1
            ? undefined
            : {
                width: stretch ? `${100 / scale}%` : undefined,
                transform: `scale(${scale})`,
                transformOrigin: stretch ? "top left" : "top center",
              }
        }
        className={`relative w-full rounded-[14px] bg-white shadow-2xl ring-2 ring-[#221AE9] sm:ring-[#7CC0F2] sm:p-[16px] pointer-events-auto ${
          compact ? "p-[10px]" : "p-3"
        }`}
      >
      {caret && (
        <>
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
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-start justify-between gap-3">
          <p
            className={`font-bold sm:text-[14px] text-[#040404] sm:text-[#221AE9] leading-snug ${
              compact ? "text-[13px]" : "text-[14px]"
            }`}
          >
            {step.title}
          </p>
          <span
            className={`sm:text-[12px] text-gray-500 sm:text-gray-400 font-medium shrink-0 pt-[2px] sm:pt-[1px] ${
              compact ? "text-[11px]" : "text-[12px]"
            }`}
          >
            {index + 1}/{STEPS.length}
          </span>
        </div>
        <p
          className={`sm:text-[13px] text-gray-600 mt-[6px] leading-[1.4] sm:leading-relaxed ${
            compact ? "text-[12px]" : "text-[13px]"
          }`}
        >
          {step.content}
        </p>
      </motion.div>
      <div
        className={`flex items-center justify-between sm:mt-[12px] ${
          compact ? "mt-[8px]" : "mt-[10px]"
        }`}
      >
        <button
          type="button"
          onClick={onSkip}
          className={`${button} border border-[#7CC0F2] bg-[#D9F1FF] text-[#221AE9] hover:bg-[#c4e9ff] sm:border-0`}
        >
          Skip
        </button>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className={`${button} border border-[#7CC0F2] bg-[#D9F1FF] text-[#221AE9] hover:bg-[#c4e9ff] sm:border-0`}
            >
              Prev
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className={`${button} bg-[#221AE9] text-white hover:bg-[#2d25ea]`}
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

function TourHeroCopy({
  innerRef,
  width,
  left,
  top,
  fill,
  hidden,
}: {
  innerRef: React.RefObject<HTMLDivElement>;
  width: number;
  left: number;
  top: number;
  fill?: boolean;
  hidden: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      ref={innerRef}
      className={`fixed pointer-events-none flex ${
        fill ? "items-stretch" : "items-start"
      }`}
      style={{
        left,
        width,
        top,
        bottom: fill ? 0 : VIEWPORT_MARGIN,
        transition:
          "top 220ms cubic-bezier(0.22, 1, 0.36, 1), bottom 220ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        data-tour-anchor="opponent-panel"
        className="w-full max-h-full bg-white rounded-2xl shadow-lg border-2 border-[#81CFF3] p-2 flex flex-col"
      >
        <h1 className="text-center font-bold text-[22px] text-[#221AE9] mb-[6px]">
          Play VS AI
        </h1>
        <HeroPlayVSAIPreview tour />
      </div>
    </motion.div>
  );
}

const MAX_STRETCH = 1.35;

function ScaleToFit({
  children,
  reserve = 210,
  referenceHeight,
  maxScale = 1,
  fill = false,
  onMeasure,
}: {
  children: React.ReactNode;
  reserve?: number;
  maxScale?: number;
  referenceHeight?: number;
  fill?: boolean;
  onMeasure?: (height: number) => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [boxHeight, setBoxHeight] = useState<number | undefined>(undefined);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      const natural = el.offsetHeight;
      if (!natural) return;
      onMeasure?.(natural);
      const basis = referenceHeight && referenceHeight > 0 ? referenceHeight : natural;
      const avail = visibleHeight() - reserve;
      if (fill) {
        const target =
          referenceHeight && referenceHeight > 0
            ? Math.round(referenceHeight)
            : Math.max(0, Math.round(avail / (maxScale || 1)));
        setMinHeight((current) =>
          current !== undefined && Math.abs(current - target) < 1 ? current : target
        );
      }
      const floor = isMobileViewport() ? MIN_CARD_SCALE : 0;
      const next = Math.max(floor, Math.min(maxScale, avail / basis));
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
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [reserve, referenceHeight, maxScale, fill, onMeasure]);

  const widthPct = Math.min(MAX_STRETCH, maxScale / scale) * 100;

  return (
    <div style={{ height: boxHeight, width: "100%" }}>
      <div
        ref={innerRef}
        style={{
          width: `${widthPct}%`,
          marginLeft: `${(100 - widthPct) / 2}%`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          ...(fill ? { display: "grid", minHeight } : null),
        }}
      >
        {children}
      </div>
    </div>
  );
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

const INTERLUDE_HOLD_MS = 1000;

const INTERLUDE_SAN = [
  "e4", "e5", "Nf3", "d6", "d4", "Bg4", "dxe5", "Bxf3", "Qxf3", "dxe5",
  "Bc4", "Nf6", "Qb3", "Qe7", "Nc3", "c6", "Bg5", "b5", "Nxb5", "cxb5",
  "Bxb5+", "Nbd7", "O-O-O", "Rd8", "Rxd7", "Rxd7", "Rd1", "Qe6", "Bxd7+",
  "Nxd7", "Qb8+", "Nxb8", "Rd8#",
];

const LOSE_SAN = [
  "e4", "e5", "Nf3", "Nc6", "Bc4", "Nd4", "Nxe5", "Qg5", "Nxf7", "Qxg2",
  "Rf1", "Qxe4+", "Be2", "Nf3#",
];

type DemoGame = {
  fen: string;
  whiteCaptures: string[];
  blackCaptures: string[];
  moves: [string, string][];
  lastMove: [string, string] | null;
};

function buildDemoGame(sanList: string[]): DemoGame {
  const chess = new Chess();
  const whiteCaptures: string[] = [];
  const blackCaptures: string[] = [];
  const moves: [string, string][] = [];
  let lastMove: [string, string] | null = null;

  for (const san of sanList) {
    let move;
    try {
      move = chess.move(san);
    } catch {
      break;
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

const INTERLUDE_GAME = buildDemoGame(INTERLUDE_SAN);
const LOSE_GAME = buildDemoGame(LOSE_SAN);

const WON_FEN = INTERLUDE_GAME.fen;
const LOST_FEN = LOSE_GAME.fen;
const CAPTURED_BY_WHITE = INTERLUDE_GAME.whiteCaptures;
const CAPTURED_BY_BLACK = INTERLUDE_GAME.blackCaptures;

type DemoOutcome = "win" | "lose";

const demoGame = (outcome: DemoOutcome) =>
  outcome === "win" ? INTERLUDE_GAME : LOSE_GAME;

function InterludeCaptureBar({
  rect,
  row,
  outcome = "win",
  animateIcons = true,
}: {
  rect: Rect;
  row: "opponent" | "player";
  outcome?: DemoOutcome;
  animateIcons?: boolean;
}) {
  const { PieceChoosed } = useChessBoardThemeStore();
  const game = demoGame(outcome);
  const opponent = row === "opponent";
  const lost = outcome === "win" ? opponent : !opponent;
  const icons = opponent ? game.blackCaptures : game.whiteCaptures;
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
            src={opponent ? "/images/v2/AI avatar/Beginner/Lisa.png" : "/images/homepage/v2/homepage_board_asset_4.png"}
            alt={opponent ? "Lisa" : "You"}
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
              {opponent ? "Lisa" : "You"}
            </span>
            <span className="text-[11px] sm:text-[13px] text-[#6B7280]">
              {opponent ? "ELO 250" : "ELO 400"}
            </span>
          </div>
        </div>
        <div className="flex items-center shrink-0">
          {icons.map((icon, i) => (
            <motion.span
              key={i}
              initial={animateIcons ? { opacity: 0, scale: 0.4 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: animateIcons ? 0.1 + i * 0.03 : 0, duration: 0.18 }}
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

function InterludeBoard({
  rect,
  outcome = "win",
  onDone,
}: {
  rect: Rect;
  outcome?: DemoOutcome;
  onDone?: () => void;
}) {
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (!doneRef.current) return;
    const t = setTimeout(() => doneRef.current?.(), INTERLUDE_HOLD_MS);
    return () => clearTimeout(t);
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
          position={outcome === "win" ? WON_FEN : LOST_FEN}
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

const INTERLUDE_MOVES: [string, string][] = INTERLUDE_GAME.moves;

function InterludeMoveList({
  rect,
  outcome = "win",
}: {
  rect: Rect;
  outcome?: DemoOutcome;
}) {
  const won = outcome === "win";
  const rows = demoGame(outcome).moves;
  return (
    <div
      className="fixed pointer-events-none"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
    >
      <div className="w-full h-full bg-white rounded-2xl border-2 border-[#81CFF3] shadow-lg p-3 sm:p-4 flex flex-col overflow-hidden">
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

        <div className="grid grid-cols-2 gap-2 rounded-[8px] bg-[#FAFDFF] border border-[#DEDEDE] p-2 mb-3 shrink-0">
          <div className="flex items-center justify-center py-2 rounded-[6px] bg-white shadow-md border border-[#DEDEDE]">
            <span className="text-[14px] font-semibold text-[#221AE9]">Current Game</span>
          </div>
          <div className="flex items-center justify-center py-2 rounded-[6px]">
            <span className="text-[14px] font-semibold text-black">Past Games</span>
          </div>
        </div>

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
                {rows.map(([white, black], i) => (
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

        <div className="mt-3 flex flex-col gap-2 shrink-0">
          <div
            className={`flex items-center gap-2 rounded-[8px] px-3 py-2 text-white ${
              won
                ? "bg-gradient-to-r from-[#34C759] to-[#2FB350]"
                : "bg-gradient-to-r from-[#C01B1B] to-[#8F1414]"
            }`}
          >
            {won ? (
              <Trophy size={16} className="shrink-0" />
            ) : (
              <Image
                src="/images/play-vs-ai/you-loss.png"
                alt=""
                width={40}
                height={40}
                className="w-[16px] h-[16px] object-contain shrink-0"
              />
            )}
            <span className="text-[13px] font-semibold">
              {won
                ? "Congratulations! You have won this Game!"
                : "Unfortunately, you have lost this Game!"}
            </span>
          </div>
          <div
            className={`w-full py-2 rounded-full text-white font-semibold text-[13px] text-center ${
              won ? "bg-[#34C759]" : "bg-[#221AE9]"
            }`}
          >
            {won ? "Analyze Now" : "Discover Mistakes"}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 py-2 rounded-full bg-white border border-[#C0CED4] text-[#221AE9] font-medium text-[12px] text-center">
              Share PGN/FEN
            </div>
            <div className="flex-1 py-2 rounded-full bg-[#C6EEFE] border border-[#7CC0F2] text-[#221AE9] font-medium text-[12px] text-center">
              + New Game
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const WON_SQUARE_STYLES: Record<string, { backgroundColor: string }> =
  INTERLUDE_GAME.lastMove
    ? {
        [INTERLUDE_GAME.lastMove[0]]: { backgroundColor: "#B9CA43" },
        [INTERLUDE_GAME.lastMove[1]]: { backgroundColor: "#F5F682" },
      }
    : {};

const M_SHEET_CHROME = 362;

const M_SHEET_HEIGHT_RATIO = 1;

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
          className={`w-[18px] h-[18px] object-contain ${i > 0 ? "-ml-2.5" : ""}`}
          style={{ zIndex: icons.length - i }}
        />
      ))}
    </div>
  );
}

function MobileWonGameSheet({ box, onDone }: { box: Rect; onDone: () => void }) {
  const { PieceChoosed } = useChessBoardThemeStore();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [boardW, setBoardW] = useState(0);

  useEffect(() => {
    const t = setTimeout(onDone, INTERLUDE_HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const measure = () => {
      const byWidth = el.clientWidth - 24;
      const byHeight = el.clientHeight - M_SHEET_CHROME;
      setBoardW(Math.max(140, Math.min(byWidth, byHeight, 420)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  const tailMoves = INTERLUDE_MOVES.slice(-6);
  const firstTailNumber = INTERLUDE_MOVES.length - tailMoves.length + 1;

  return (
    <div
      ref={sheetRef}
      className="fixed bg-white overflow-hidden pointer-events-none flex flex-col"
      style={{
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
      }}
    >
      <div className="w-full flex justify-between items-center px-[13px] pt-[10px]">
        <div className="flex items-center gap-[6px] min-w-0">
          <ArrowLeft color="black" size={18} className="shrink-0" />
          <span className="text-[12px] truncate">You (White) VS Lisa (250)</span>
        </div>
        <div className="flex items-center gap-[8px] shrink-0">
          <Image
            src="/images/play-vs-ai/switch.png"
            alt=""
            width={20}
            height={20}
            className="w-[16px] h-[16px] object-contain"
          />
          <Settings size={15} className="text-[#221AE9]" />
        </div>
      </div>

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

        <div className="flex flex-row flex-wrap items-center justify-center gap-1.5">
          <div className="flex items-center gap-1">
            <div className="w-[11px] h-[11px] bg-[#B9CA43]" />
            <span className="text-[9px]">Previous Position</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-[11px] h-[11px] bg-[#F5F682]" />
            <span className="text-[9px]">Current Position</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-[11px] h-[11px] rounded-full bg-[#1C16C2]" />
            <span className="text-[9px]">Possible Move</span>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-[8px] border border-[#00B427] bg-[linear-gradient(to_right,#E9F8EC,#CFF3D9)] h-[35px] flex items-center gap-[8px] px-[10px]">
          <Image
            src="/images/play-vs-ai/trophy-win.png"
            alt=""
            width={40}
            height={40}
            className="w-[19px] h-[19px] object-contain shrink-0"
          />
          <span className="font-semibold text-[10px] text-[#0A6D23]">
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

        <div className="w-full flex flex-col gap-[6px]">
          <div className="w-full h-[32px] rounded-full border-[2px] border-[#19A23C] bg-[#34C759] flex items-center justify-center gap-[6px] font-medium text-[12px]">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M12 13.3327V6.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 13.3327V2.66602" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 13.332V9.33203" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Analyze Now
          </div>
          <div className="flex w-full gap-2">
            <div className="bg-white w-full rounded-full h-[32px] border border-[#C0CED4] flex items-center justify-center gap-1.5">
              <Image
                src="/images/play-vs-ai/clipboard.png"
                alt=""
                width={40}
                height={40}
                className="h-[14px] w-[14px] object-contain"
              />
              <span className="font-medium text-[11px] text-[#221AE9]">Share PGN/FEN</span>
            </div>
            <div className="w-full rounded-full h-[32px] bg-[#C6EEFE] border border-[#7CC0F2] flex items-center justify-center gap-2">
              <span className="text-[#221AE9] font-medium text-[11px]">+ New Game</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[8px] flex bg-[#F7FCFF] border-b border-gray-200">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-[8px] relative">
          <Image
            src="/images/play-vs-ai/chess-king-rook-active.png"
            alt=""
            width={19}
            height={19}
            className="w-[15px] h-[15px] object-contain"
          />
          <span className="text-[11px] font-semibold text-[#221AE9]">Current Game</span>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#221AE9]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-[8px]">
          <Image
            src="/images/play-vs-ai/past-games.png"
            alt=""
            width={18}
            height={18}
            className="w-[15px] h-[15px] object-contain"
          />
          <span className="text-[11px] font-semibold text-black">Past Games</span>
        </div>
      </div>

      <div className="px-4 pt-[8px] overflow-hidden">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 min-w-[48px] shrink-0">
            <div className="h-[18px]" />
            <div className="bg-[#E6F7FE] border border-[#C6EEFE] rounded-lg px-2 py-1.5 min-h-[29px] flex items-center justify-center">
              <span className="text-[11px] font-medium">White</span>
            </div>
            <div className="bg-[#E6F7FE] border border-[#C6EEFE] rounded-lg px-2 py-1.5 min-h-[29px] flex items-center justify-center">
              <span className="text-[11px] font-medium">Black</span>
            </div>
          </div>

          {tailMoves.map(([white, black], i) => (
            <div key={i} className="flex flex-col gap-1 min-w-[48px]">
              <div className="text-center text-[10px] font-medium text-gray-600 h-[18px] flex items-center justify-center">
                Move {firstTailNumber + i}
              </div>
              <div className="bg-white border border-[#DEDEDE] rounded-lg px-2 py-1.5 min-h-[29px] flex items-center justify-center">
                <span className="text-[11px] font-medium">{white}</span>
              </div>
              <div className="bg-white border border-[#DEDEDE] rounded-lg px-2 py-1.5 min-h-[29px] flex items-center justify-center">
                <span className="text-[11px] font-medium">{black}</span>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1 min-w-[48px]">
            <div className="h-[18px]" />
            <div className="bg-white border border-[#DEDEDE] rounded-lg px-2 py-1.5 min-h-[29px] flex items-center justify-center">
              <span className="text-[11px] font-bold text-green-500">WIN</span>
            </div>
            <div className="min-h-[29px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const DEMO_MISTAKES = [
  {
    type: "Mistake",
    moveNumber: 11,
    move: "e4",
    keyEvaluation: -2.26,
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
    fen: "3k4/8/p1b2P2/5Q2/8/3N4/PPP2PPP/R3K2R w KQ - 0 27",
    badMove: "Rf1",
    goodArrow: ["f6", "f7"] as const,
    analysis:
      "A real setback - your position is still playable, but much weaker than before.",
    solution: "Even strong players sometimes go for f6 to f7 in this spot!",
  },
];

function DemoSlideBoard({
  mistake,
  boardWidth,
}: {
  mistake: (typeof DEMO_MISTAKES)[number];
  boardWidth: number;
}) {
  const [badFromTo, setBadFromTo] = useState<[string, string] | null>(null);

  useEffect(() => {
    try {
      const chess = new Chess(mistake.fen);
      const preview = chess.move(mistake.badMove);
      setBadFromTo(preview ? [preview.from, preview.to] : null);
    } catch {
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

const ANALYZE_CHROME = 410;
const ANALYZE_BOARD_MIN = 200;

function DemoAnalyzeCard({ maxHeight }: { maxHeight?: number }) {
  const swiperRef = useRef<SwiperType>();
  const [activeIndex, setActiveIndex] = useState(0);
  const shortViewport = useShortViewport();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mobileBoardW, setMobileBoardW] = useState(0);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
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

  useEffect(() => {
    let raf = 0;
    const DRAG_MS = 450;
    const dragAway = (swiper: SwiperType) => {
      const from = swiper.translate;
      const dist = swiper.width * 0.5;
      let t0: number | null = null;
      (swiper as unknown as { setTransition(ms: number): void }).setTransition(0);
      const step = (now: number) => {
        if (swiper.destroyed) return;
        if (t0 === null) t0 = now;
        const p = Math.min(1, (now - t0) / DRAG_MS);
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
    <div className="relative w-full bg-white rounded-2xl shadow-2xl pt-[22px] pb-[16px] px-[18px] sm:pt-[26px] sm:pb-[20px] sm:px-[24px] pointer-events-auto">
      <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-[#34C759] text-white text-[13px] font-bold px-[18px] py-[6px] rounded-full whitespace-nowrap shadow-md">
        You&apos;re All Set!
      </div>
      <Image
        src={FINALE_IMG}
        alt="Ready to play"
        width={991}
        height={640}
        className="w-[68%] sm:w-[80%] mx-auto h-auto rounded-[8px] mt-[6px]"
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

export function PlaygroundTour({
  autoStart = true,
  forceStart = false,
}: {
  autoStart?: boolean;
  forceStart?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [spot, setSpot] = useState<Rect | null>(null);
  const [spotTarget, setSpotTarget] = useState<Rect | null>(null);
  const [interlude, setInterlude] = useState(false);
  const [boardImgRect, setBoardImgRect] = useState<Rect | null>(null);
  const [topBarRect, setTopBarRect] = useState<Rect | null>(null);
  const [bottomBarRect, setBottomBarRect] = useState<Rect | null>(null);
  const [panelRect, setPanelRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ vw: 0, vh: 0 });
  const rectRef = useRef<Rect | null>(null);
  const spotRef = useRef<Rect | null>(null);
  const spotTargetRef = useRef<Rect | null>(null);
  const spotAnimRef = useRef<Rect | null>(null);
  const boardImgRef = useRef<Rect | null>(null);
  const topBarRef = useRef<Rect | null>(null);
  const bottomBarRef = useRef<Rect | null>(null);
  const panelRef = useRef<Rect | null>(null);
  const scrollPassRef = useRef("");
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const firstRunRef = useRef(false);
  const winCardHeightRef = useRef(0);
  const reportWinCardHeight = useRef((h: number) => {
    winCardHeightRef.current = h;
  }).current;

  const [tooltipH, setTooltipH] = useState(0);
  const reportTooltipHeight = useRef((height: number) =>
    setTooltipH((current) => (current === height ? current : height))
  ).current;

  const [lottieDone, setLottieDone] = useState(false);
  const reportLottieDone = useRef(() => setLottieDone(true)).current;

  const [headerH, setHeaderH] = useState(0);

  const isMobile = viewport.vw > 0 ? viewport.vw < MOBILE_BP : isMobileViewport();
  const useHeroCopy = isMobile;
  const anchorRoot = () => (useHeroCopy ? heroCopyRef.current : null);
  const compact = isMobile && viewport.vh > 0 && viewport.vh < COMPACT_VH;
  const scale = isMobile ? MOBILE_SCALE : 1;
  const rawStep = interlude ? undefined : (STEPS[index] as TourStep | undefined);
  const step = rawStep ? resolveStep(rawStep, isMobile) : undefined;
  const anchored = !!step?.anchors;
  const tooltipHeld = !!step?.tooltipAfterLottie && !lottieDone;
  const tuckBoost = isMobile
    ? Math.min(
        TUCK_MAX_BOOST,
        Math.max(
          0,
          Math.round((TUCK_REFERENCE_VH - viewport.vh) * TUCK_SHORTFALL_RATIO)
        )
      )
    : 0;
  const requestedCardTuck =
    isMobile && step?.cardTuck ? step.cardTuck + tuckBoost : 0;
  const cardFill = isMobile && !!step?.cardFill;
  const matchPanel = isMobile && !!step?.matchPanel && !!step?.demo;
  const panelFull = isMobile && !!step?.panelFull;
  const demoFull = panelFull && !!step?.demo;

  useEffect(() => setMounted(true), []);

  useEffect(() => () => setPlaygroundTourActive(false), []);

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

  useEffect(() => {
    if (!mounted) return;
    let forced = false;
    try {
      forced = new URLSearchParams(window.location.search).get("tour") === "playground";
      if (!forced && (!autoStart || !localStorage.getItem(PENDING_KEY))) {
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
  }, [mounted, autoStart]);

  useEffect(() => {
    if (!mounted || !forceStart) return;
    begin();
  }, [mounted, forceStart]);

  useEffect(() => {
    if (!mounted) return;
    const start = () => begin();
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
    setPlaygroundTourActive(false);
    const firstCompletion = firstRunRef.current;
    firstRunRef.current = false;
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch {}
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
  const skip = () => {
    setInterlude(false);
    setIndex(FINALE_INDEX);
  };

  useEffect(() => {
    if (!open) return;
    const measure = () =>
      setHeaderH((current) => {
        const next = headerBottom();
        return current === next ? current : next;
      });
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [open, interlude]);

  useEffect(() => {
    if (!open) return;
    if (interlude || !STEPS[index]?.tooltipAfterLottie) {
      setLottieDone(true);
      return;
    }
    setLottieDone(false);
    const t = setTimeout(() => setLottieDone(true), LOTTIE_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [open, index, interlude]);

  useEffect(() => {
    if (!interlude) return;
    const t = setTimeout(() => {
      setInterlude(false);
      setIndex(2);
    }, INTERLUDE_HOLD_MS + 1500);
    return () => clearTimeout(t);
  }, [interlude]);

  useEffect(() => {
    if (!open) return;
    if (useHeroCopy) return;

    const pass = `${index}:${interlude}:${tooltipH > 0 ? "measured" : "raw"}`;
    if (scrollPassRef.current === pass) return;
    scrollPassRef.current = pass;

    const el = interlude
      ? findAnchor(["board-preview"])
      : step?.anchors
        ? findAnchor(
            step.scrollAnchor ? [step.scrollAnchor, ...step.anchors] : step.anchors
          )
        : null;
    if (!el) return;
    let margin = (!interlude && step?.scrollMargin) || 110;
    if (!interlude && step?.tooltipUnderHeader && tooltipH) {
      const above = tooltipH + CARET_GAP + PAD;
      const underHeader = headerBottom() + HEADER_GAP + above;
      const wholeTargetFits =
        visibleHeight() - VIEWPORT_MARGIN - el.offsetHeight - PAD;
      margin = Math.max(VIEWPORT_MARGIN + above, Math.min(underHeader, wholeTargetFits));
    }
    el.style.scrollMarginTop = `${Math.round(margin)}px`;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open, index, interlude, tooltipH]);

  useEffect(() => {
    const raw = STEPS[index];
    const showcaseStep = raw ? resolveStep(raw, isMobileViewport()) : undefined;
    if (!open || interlude || !showcaseStep?.scrollShowcase) return;
    const panel = findAnchor(showcaseStep.anchors, anchorRoot());
    const list = panel?.querySelector<HTMLElement>(".overflow-y-auto");
    if (!list || list.scrollHeight <= list.clientHeight) return;
    const tabs = panel?.querySelector<HTMLElement>(".overflow-x-auto");
    const initial = list.scrollTop;
    const initialTabs = tabs?.scrollLeft ?? 0;
    const range = list.scrollHeight - list.clientHeight;
    let raf = 0;
    let start: number | null = null;
    const SWEEP_MS = 4500;
    const tick = (now: number) => {
      if (start === null) start = now + 900;
      const p = Math.min(1, Math.max(0, now - start) / SWEEP_MS);
      const phase = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      list.scrollTop = phase * range;
      if (tabs) {
        const tabsRange = tabs.scrollWidth - tabs.clientWidth;
        if (tabsRange > 0) tabs.scrollLeft = phase * tabsRange;
      }
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      list.scrollTop = initial;
      if (tabs) tabs.scrollLeft = initialTabs;
    };
  }, [open, index, interlude]);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = () => {
      const current = interlude
        ? { anchors: ["board-preview"] }
        : STEPS[index] && resolveStep(STEPS[index], isMobileViewport());
      const root = anchorRoot();
      const el = findAnchor(current?.anchors, root);
      let nextRect: Rect | null = null;
      let nextSpot: Rect | null = null;
      if (el) {
        nextRect = toRect(el.getBoundingClientRect());
        nextSpot = nextRect;
        for (const extra of (current as TourStep | undefined)?.include ?? []) {
          const extraEl = findAnchor([extra], root);
          if (extraEl) {
            nextSpot = unionRects(nextSpot, toRect(extraEl.getBoundingClientRect()));
          }
        }
      }
      if (!sameRect(nextRect, rectRef.current)) {
        rectRef.current = nextRect;
        setRect(nextRect);
      }
      if (!sameRect(nextSpot, spotTargetRef.current)) {
        spotTargetRef.current = nextSpot;
        setSpotTarget(nextSpot);
      }
      if (!nextSpot) {
        spotAnimRef.current = null;
        if (spotRef.current !== null) {
          spotRef.current = null;
          setSpot(null);
        }
      } else {
        const eased = followRect(spotAnimRef.current, nextSpot, SPOT_FOLLOW);
        spotAnimRef.current = eased;
        const rounded = roundRect(eased);
        if (!sameRect(rounded, spotRef.current)) {
          spotRef.current = rounded;
          setSpot(rounded);
        }
      }
      const demoNow = (current as TourStep | undefined)?.demo;
      const gameScreen =
        interlude ||
        (!isMobileViewport() && (demoNow === "win" || demoNow === "lose"));
      const img = gameScreen
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-board]'
          )
        : null;
      const nextImg = visibleRect(img);
      if (!sameRect(nextImg, boardImgRef.current)) {
        boardImgRef.current = nextImg;
        setBoardImgRect(nextImg);
      }
      const topBar = gameScreen
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-bar="opponent"]'
          )
        : null;
      const nextTop = visibleRect(topBar);
      if (!sameRect(nextTop, topBarRef.current)) {
        topBarRef.current = nextTop;
        setTopBarRect(nextTop);
      }
      const bottomBar = gameScreen
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="board-preview"] [data-preview-bar="player"]'
          )
        : null;
      const nextBottom = visibleRect(bottomBar);
      if (!sameRect(nextBottom, bottomBarRef.current)) {
        bottomBarRef.current = nextBottom;
        setBottomBarRect(nextBottom);
      }
      const panel = gameScreen
        ? document.querySelector<HTMLElement>(
            '[data-tour-anchor="opponent-panel"]'
          )
        : null;
      const nextPanel = visibleRect(panel);
      if (!sameRect(nextPanel, panelRef.current)) {
        panelRef.current = nextPanel;
        setPanelRect(nextPanel);
      }
      const vh = visibleHeight();
      setViewport((v) =>
        v.vw === window.innerWidth && v.vh === vh
          ? v
          : { vw: window.innerWidth, vh }
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, index, interlude]);

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight" && index < FINALE_INDEX) next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, interlude]);

  if (!mounted || !open) return null;

  const mobileInterlude = interlude && !boardImgRect && isMobile && viewport.vw > 0;

  const demoOutcome: DemoOutcome | null =
    !isMobile && (step?.demo === "win" || step?.demo === "lose")
      ? step.demo
      : null;

  const BASE_TOOLTIP_W = Math.min(430, Math.max(viewport.vw - 24, 0));
  const tourCardWidth = Math.round(BASE_TOOLTIP_W * scale);

  const tourCardW = tourCardWidth;
  const tourCardLeft = Math.round((viewport.vw - tourCardW) / 2);

  const heroTooltipBottom = VIEWPORT_MARGIN + HERO_COPY_TOOLTIP_RESERVE;
  const heroPanelTop =
    heroTooltipBottom +
    HERO_CARET_GAP -
    ((step?.panelTuck ?? HERO_PANEL_TUCK) + tuckBoost);
  const interludeTop = isMobile ? headerH : 0;
  const interludeH = Math.max(
    300,
    Math.round((viewport.vh - interludeTop) * M_SHEET_HEIGHT_RATIO)
  );
  const interludeCard: Rect = {
    width: viewport.vw,
    height: interludeH,
    left: 0,
    top: interludeTop,
  };

  const spotRect = spot ?? rect;
  const showSpotlight = mobileInterlude || (anchored && !!spotRect);

  const spotPad = useHeroCopy ? 0 : PAD;

  const holeFor = (r: Rect | null): Rect => {
    if (mobileInterlude) {
      return {
        top: interludeCard.top - spotPad,
        left: interludeCard.left - spotPad,
        width: interludeCard.width + spotPad * 2,
        height: interludeCard.height + spotPad * 2,
      };
    }
    if (!showSpotlight || !r) {
      return { top: viewport.vh / 2, left: viewport.vw / 2, width: 0, height: 0 };
    }
    const padX = Math.max(
      0,
      Math.min(
        spotPad,
        Math.round((viewport.vw - SPOTLIGHT_EDGE * 2 - r.width) / 2)
      )
    );
    return {
      top: r.top - spotPad,
      left: r.left - padX,
      width: r.width + padX * 2,
      height: r.height + spotPad * 2,
    };
  };

  const hole = holeFor(spotRect);
  const targetHole = holeFor(spotTarget ?? rect);

  const minTooltipW = Math.round(BASE_TOOLTIP_W * scale);
  const heroPinned = useHeroCopy && anchored;
  const anchoredTooltipW = heroPinned
    ? tourCardW
    : isMobile && anchored && spotTarget
      ? Math.round(
          Math.min(
            Math.max(targetHole.width, minTooltipW),
            Math.max(viewport.vw - SPOTLIGHT_EDGE * 2, minTooltipW)
          )
        )
      : undefined;
  const TOOLTIP_W = anchoredTooltipW ?? BASE_TOOLTIP_W;

  const TOOLTIP_H = tooltipH || (isMobile ? 130 : 180);
  let mode: "edge" | "above" | "below" | "over" = "over";
  if (heroPinned) mode = "over";
  else if (
    step?.tooltipBottomAt !== undefined &&
    rect &&
    rect.top + step.tooltipBottomAt - TOOLTIP_H >= VIEWPORT_MARGIN
  ) {
    mode = "edge";
  } else if (targetHole.top - CARET_GAP - TOOLTIP_H >= VIEWPORT_MARGIN)
    mode = "above";
  else if (
    targetHole.top + targetHole.height + CARET_GAP + TOOLTIP_H <=
    viewport.vh - VIEWPORT_MARGIN
  )
    mode = "below";
  const rawTooltipTop = heroPinned
    ? VIEWPORT_MARGIN
    : mode === "edge" && rect && step?.tooltipBottomAt !== undefined
      ? rect.top + step.tooltipBottomAt
      : mode === "above"
        ? targetHole.top - CARET_GAP
        : mode === "below"
          ? targetHole.top + targetHole.height + CARET_GAP
          : Math.max(targetHole.top + CARET_GAP, VIEWPORT_MARGIN);
  const bottomAnchored = mode === "above" || mode === "edge";
  const tooltipTop = bottomAnchored
    ? Math.min(
        Math.max(rawTooltipTop, VIEWPORT_MARGIN + TOOLTIP_H),
        Math.max(viewport.vh - VIEWPORT_MARGIN, VIEWPORT_MARGIN + TOOLTIP_H)
      )
    : Math.min(
        Math.max(rawTooltipTop, VIEWPORT_MARGIN),
        Math.max(viewport.vh - VIEWPORT_MARGIN - TOOLTIP_H, VIEWPORT_MARGIN)
      );

  const cardTuck = Math.min(
    matchPanel ? HERO_PANEL_TUCK + tuckBoost : requestedCardTuck,
    TOOLTIP_H
  );
  const demoGap = cardTuck ? -cardTuck : CARET_GAP;
  const demoReserve = matchPanel
    ? VIEWPORT_MARGIN + TOOLTIP_H - cardTuck
    : tooltipH
      ? tooltipH +
        demoGap +
        (demoFull ? VIEWPORT_MARGIN * 2 : DEMO_COLUMN_PAD) +
        VIEWPORT_MARGIN
      : 210;
  const demoMaxScale = demoFull ? 1 : scale;
  const anchorCenterX = rect
    ? rect.left + rect.width / 2
    : targetHole.left + targetHole.width / 2;
  const edgeGap = Math.max(
    0,
    Math.min(VIEWPORT_MARGIN, Math.round((viewport.vw - TOOLTIP_W) / 2))
  );
  const tooltipLeft = heroPinned
    ? tourCardLeft
    : Math.min(
        Math.max(anchorCenterX - TOOLTIP_W / 2, edgeGap),
        Math.max(viewport.vw - TOOLTIP_W - edgeGap, edgeGap)
      );

  return createPortal(
    <div className="fixed inset-0 z-[700] overscroll-contain" role="dialog" aria-modal="true" aria-label="Playground tutorial">
      {useHeroCopy && (
        <TourHeroCopy
          innerRef={heroCopyRef}
          width={tourCardW}
          left={tourCardLeft}
          top={heroPanelTop}
          fill={panelFull}
          hidden={interlude || !anchored}
        />
      )}

      {demoOutcome && boardImgRect && (
        <>
          <InterludeBoard rect={boardImgRect} outcome={demoOutcome} />
          {topBarRect && (
            <InterludeCaptureBar
              rect={topBarRect}
              row="opponent"
              outcome={demoOutcome}
              animateIcons={false}
            />
          )}
          {bottomBarRect && (
            <InterludeCaptureBar
              rect={bottomBarRect}
              row="player"
              outcome={demoOutcome}
              animateIcons={false}
            />
          )}
          {panelRect && <InterludeMoveList rect={panelRect} outcome={demoOutcome} />}
        </>
      )}

      {(!interlude || mobileInterlude) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed pointer-events-none"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            borderRadius: mobileInterlude ? 0 : useHeroCopy ? 16 : 18,
            boxShadow: `${
              showSpotlight
                ? useHeroCopy
                  ? "0 0 0 3px rgba(124,192,242,1), "
                  : "0 0 0 2px rgba(124,192,242,0.95), "
                : ""
            }0 0 0 200vmax rgba(9,14,40,${useHeroCopy ? 0.8 : 0.62})`,
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {step && anchored && (
          <motion.div
            key="anchored"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="fixed"
            style={
              rect
                ? {
                    top: tooltipTop,
                    left: tooltipLeft,
                    transition: "top 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }
                : { top: "20%", left: "50%" }
            }
          >
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
                compact={compact}
                scale={scale}
                stretch
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
            className={`fixed inset-0 flex flex-col items-center overscroll-contain ${
              demoFull ? "" : "py-4"
            }`}
            style={
              demoFull
                ? { paddingTop: VIEWPORT_MARGIN, paddingBottom: VIEWPORT_MARGIN }
                : undefined
            }
          >

            <div
              className={`${
                demoFull ? "mb-auto" : "m-auto"
              } flex flex-col items-center`}
              style={
                step.panelTuck
                  ? { transform: `translateY(${-step.panelTuck}px)` }
                  : undefined
              }
            >
              <motion.div
                className="relative z-10"
                animate={{ opacity: tooltipHeld ? 0 : 1 }}
                initial={false}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <TourTooltip
                  step={step}
                  index={index}
                  onSkip={skip}
                  onPrev={prev}
                  onNext={next}
                  caret="bottom"
                  compact={compact}
                  scale={scale}
                  widthPx={demoFull ? BASE_TOOLTIP_W : undefined}
                  stretch={demoFull}
                  onHeight={reportTooltipHeight}
                />
              </motion.div>
              <div
                className="w-[min(430px,calc(100vw-24px))] sm:w-[min(430px,92vw)] rounded-2xl"
                style={{ marginTop: cardTuck ? -cardTuck : 14 }}
              >

                {step.demo === "win" && (
                  <ScaleToFit
                    reserve={demoReserve}
                    maxScale={demoMaxScale}
                    fill={cardFill}
                    onMeasure={reportWinCardHeight}
                  >
                    <WinModalCard
                      variant="tour"
                      oldElo={375}
                      newElo={400}
                      delta={25}
                      opponentName="Lisa"
                      opponentElo={250}
                      onAnimationComplete={reportLottieDone}
                    />
                  </ScaleToFit>
                )}
                {step.demo === "lose" && (
                  <ScaleToFit
                    reserve={demoReserve}
                    maxScale={demoMaxScale}
                    fill={cardFill}
                    referenceHeight={
                      cardFill ? undefined : winCardHeightRef.current || undefined
                    }
                  >
                    <LoseModalCard
                      variant="tour"
                      oldElo={400}
                      newElo={375}
                      delta={-25}
                      opponentName="Lisa"
                      opponentElo={250}
                      onAnimationComplete={reportLottieDone}
                    />
                  </ScaleToFit>
                )}
                {step.demo === "analyze" && (
                  <ScaleToFit reserve={demoReserve} maxScale={demoMaxScale}>
                    <DemoAnalyzeCard
                      maxHeight={Math.max(360, (viewport.vh - demoReserve) / demoMaxScale)}
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
            {topBarRect && <InterludeCaptureBar rect={topBarRect} row="opponent" />}
            {bottomBarRect && <InterludeCaptureBar rect={bottomBarRect} row="player" />}
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
            <MobileWonGameSheet box={interludeCard} onDone={next} />
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
              <div
                style={
                  scale === 1
                    ? undefined
                    : { transform: `scale(${scale})`, transformOrigin: "center center" }
                }
              >
                <FinaleCard onPrev={prev} onDone={finish} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export default PlaygroundTour;
