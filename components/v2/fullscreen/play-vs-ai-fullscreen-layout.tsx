"use client";

import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useIsPresent, Variants } from "framer-motion";
import { ChevronDown, Minimize2 } from "lucide-react";
import { CommentarGame } from "@/components/playground/play-vs-ai/CommentaryGame";

type MoveItem = { san: string; capturedTheme: string | null };

export interface FullscreenPlayer {
  label: string;
  captured: { capturedTheme: string | null }[];
  result: "win" | "loss" | "draw" | null;
}

interface PlayVsAiFullscreenLayoutProps {
  board: ReactNode;
  boardSlotRef: RefObject<HTMLDivElement>;
  topPlayer: FullscreenPlayer;
  bottomPlayer: FullscreenPlayer;
  whiteMoves: MoveItem[];
  blackMoves: MoveItem[];
  pieceTheme: string;
  statusGame: string;
  lossReason: "checkmate" | "resign" | null;
  menu: ReactNode;
  mobileMenu: ReactNode;
  showPostGame: boolean;
  isAnalyzing: boolean;
  onDismissPostGame: () => void;
  onAnalyze: () => void;
  onStartNewGame: () => void;
  onExit: () => void;
}

const panelClass =
  "rounded-[16px] border border-[#3D5BFF]/60 bg-[linear-gradient(180deg,rgba(28,32,190,0.55),rgba(30,110,230,0.75))] backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,40,0.4)]";

const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: "easeOut" },
};

const ease = [0.22, 1, 0.36, 1] as const;

// Root only orchestrates; the board itself stays opaque so its morph reads clearly.
const rootVariants: Variants = {
  hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  show: { transition: { delayChildren: 0.05, staggerChildren: 0.06 } },
};
const bgVariants: Variants = {
  hidden: { opacity: 0, scale: 1.06, transition: { duration: 0.45, ease } },
  show: { opacity: 1, scale: 1, transition: { duration: 1.2, ease } },
};
const borderIn = (color: string): Variants => ({
  hidden: { borderColor: "rgba(124,192,242,0)", transition: { duration: 0.3, ease } },
  show: { borderColor: color, transition: { duration: 0.8, ease } },
});
const frameVariants = borderIn("rgba(124,192,242,0.8)");
const cardVariants = borderIn("rgba(255,255,255,0.4)");
const slide = (x: number, y: number): Variants => ({
  hidden: { opacity: 0, x, y, transition: { duration: 0.3, ease } },
  show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease } },
});
const fromLeft = slide(-24, 0);
const fromRight = slide(24, 0);
const fromTop = slide(0, -14);
const fromBottom = slide(0, 14);

// Dark-navy menu button used by the fullscreen "Show menu" panel.
export const fsMenuBtn =
  "h-[36px] rounded-[6px] bg-[#0D1586] border border-[#2B3CD6]/70 text-white text-[13px] font-medium flex items-center justify-center gap-2 px-2 whitespace-nowrap hover:bg-[#1622B0] active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0D1586] disabled:active:scale-100";

const pieceSrc = (theme: string, icon: string) => `/pieces/${theme}/${icon}.png`;

// Dark-blue name pill with captured pieces, as in the fullscreen mockup.
function PlayerBar({ player, pieceTheme, variants }: { player: FullscreenPlayer; pieceTheme: string; variants: Variants }) {
  const ring =
    player.result === "win"
      ? "ring-2 ring-[#00B427]"
      : player.result === "loss"
      ? "ring-2 ring-[#FD0000]"
      : "";
  const captured = player.captured.filter((c) => c.capturedTheme?.length === 2);
  return (
    <motion.div
      variants={variants}
      className={`flex items-center justify-between gap-3 min-h-[44px] sm:min-h-[52px] lg:min-h-[60px] px-4 sm:px-5 rounded-full border border-[#3D5BFF] bg-[linear-gradient(90deg,#0B1A8C_0%,#1A3CC8_55%,#2F8BE8_100%)] shadow-[0_4px_16px_rgba(0,0,40,0.35)] ${ring}`}
    >
      <span className="text-white text-[13px] sm:text-[15px] lg:text-[17px] font-medium truncate">{player.label}</span>
      <div className="flex items-center shrink-0">
        {captured.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.4, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className={captured[i + 1]?.capturedTheme === c.capturedTheme ? "-mr-2" : ""}
          >
            <Image
              src={pieceSrc(pieceTheme, c.capturedTheme as string)}
              alt="captured"
              width={64}
              height={64}
              className="w-[16px] h-[22px] sm:w-[20px] sm:h-[26px] lg:w-[24px] lg:h-[30px] object-contain"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Collapsible move list styled as numbered white pills.
function MoveHistoryPanel({ whiteMoves, blackMoves, pieceTheme }: { whiteMoves: MoveItem[]; blackMoves: MoveItem[]; pieceTheme: string }) {
  const [open, setOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const totalMoves = whiteMoves.length + blackMoves.length;
  // Keep the newest move in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [totalMoves, open]);
  const renderMove = (move?: MoveItem) =>
    move ? (
      <>
        {move.capturedTheme?.length === 2 && (
          <Image src={pieceSrc(pieceTheme, move.capturedTheme)} alt="" width={32} height={32} className="w-[14px] h-[16px] object-contain inline-block" />
        )}
        <span>{move.san}</span>
      </>
    ) : null;

  return (
    <div className={`${panelClass} flex flex-col min-h-0 shrink`}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-4 py-3 text-white text-[14px] font-medium">
        {open ? "Hide Move History" : "Show Move History"}
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div {...collapse} className="flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-[44px_1fr_1fr] gap-2 px-4 pb-2 text-white text-[14px] text-center">
              <span />
              <span>White</span>
              <span>Black</span>
            </div>
            <div ref={listRef} className="min-h-0 max-h-[60vh] sm:max-h-none overflow-y-auto px-4 pb-4 flex flex-col gap-2 [scrollbar-width:thin]">
              {whiteMoves.length === 0 && <span className="text-white/80 text-[13px] text-center py-4">No moves yet.</span>}
              {whiteMoves.map((move, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="grid grid-cols-[44px_1fr_1fr] gap-2"
                >
                  <span className="h-[34px] rounded-[8px] bg-[#E6F7FE] flex items-center justify-center text-[13px] font-semibold text-[#0B1A4A]">{i + 1}</span>
                  <span className="h-[34px] rounded-[8px] bg-white flex items-center justify-center gap-1 text-[14px] text-[#111]">{renderMove(move)}</span>
                  <span className="h-[34px] rounded-[8px] bg-white flex items-center justify-center gap-1 text-[14px] text-[#111]">{renderMove(blackMoves[i])}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Collapsed-by-default "Show menu" holding the regular game controls.
function MenuPanel({ menu }: { menu: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="shrink-0 rounded-[16px] border border-[#2F48FF]/70 bg-[linear-gradient(180deg,#0A1180_0%,#050A4D_100%)] shadow-[0_8px_32px_rgba(0,0,40,0.45)]">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 px-4 py-3 text-white text-[14px] font-medium">
        {open ? "Hide menu" : "Show menu"}
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div {...collapse} className="overflow-hidden">
            <div className="px-4 pb-4">{menu}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile move list: horizontal strip of move columns, newest scrolled into view.
function MobileMoveStrip({ whiteMoves, blackMoves, pieceTheme }: { whiteMoves: MoveItem[]; blackMoves: MoveItem[]; pieceTheme: string }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const totalMoves = whiteMoves.length + blackMoves.length;
  useEffect(() => {
    const el = stripRef.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  }, [totalMoves]);
  const label = "h-[34px] px-2 rounded-[8px] bg-[#E6F7FE] flex items-center justify-center text-[13px] font-bold text-[#0B1A4A]";
  const value = "h-[34px] min-w-[52px] px-2 rounded-[8px] bg-white flex items-center justify-center gap-1 text-[14px] text-[#111]";
  const cell = (move?: MoveItem) => (
    <span className={value}>
      {move?.capturedTheme?.length === 2 && (
        <Image src={pieceSrc(pieceTheme, move.capturedTheme)} alt="" width={32} height={32} className="w-[12px] h-[14px] object-contain" />
      )}
      {move?.san ?? ""}
    </span>
  );
  return (
    <div className={`${panelClass} p-4`}>
      <div ref={stripRef} className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
        <div className="flex flex-col gap-2 shrink-0 pt-[26px]">
          <span className={label}>White</span>
          <span className={label}>Black</span>
        </div>
        {whiteMoves.length === 0 ? (
          <span className="text-white/80 text-[13px] self-center pt-[26px]">No moves yet.</span>
        ) : (
          whiteMoves.map((move, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease }}
              className="flex flex-col gap-2 shrink-0"
            >
              <span className="h-[18px] text-white text-[13px] font-medium text-center">Move {i + 1}</span>
              {cell(move)}
              {cell(blackMoves[i])}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// Mobile "Show menu": plain toggle with buttons laid directly on the background.
function MobileMenu({ menu, exitButton }: { menu: ReactNode; exitButton: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fromTop} className="sm:hidden flex flex-col">
      <div className="flex items-center justify-between py-2">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-white text-[14px] font-medium">
          {open ? "Hide menu" : "Show menu"}
          <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        {exitButton}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div {...collapse} className="overflow-hidden">
            <div className="pt-3">{menu}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PlayVsAiFullscreenLayout({
  board,
  boardSlotRef,
  topPlayer,
  bottomPlayer,
  whiteMoves,
  blackMoves,
  pieceTheme,
  statusGame,
  lossReason,
  menu,
  mobileMenu,
  showPostGame,
  isAnalyzing,
  onDismissPostGame,
  onAnalyze,
  onStartNewGame,
  onExit,
}: PlayVsAiFullscreenLayoutProps) {
  const isPresent = useIsPresent();
  const finished = statusGame !== "Ongoing";

  const logo = (
    <Image
      src="/images/v2/profile/Logo AroundChess - White 1.png"
      alt="Around Chess"
      width={400}
      height={120}
      priority
      className="h-[36px] sm:h-[44px] xl:h-[52px] w-auto object-contain object-left"
    />
  );

  const exitButton = (
    <motion.button
      onClick={onExit}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group flex items-center gap-2 text-white/80 hover:text-white text-[14px] transition-colors"
      aria-label="Exit fullscreen"
    >
      <Minimize2 size={22} className="transition-transform duration-300 group-hover:rotate-90" />
    </motion.button>
  );

  const resultBanner = finished ? (
    <div className="[&>div]:w-full [&>div]:mt-0">
      <CommentarGame statusGame={statusGame} lossReason={lossReason} />
    </div>
  ) : null;

  return (
    <motion.div
      key="vsai-fullscreen"
      variants={rootVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      className={`fixed inset-0 z-[400] h-[100dvh] w-screen overflow-hidden ${isPresent ? "" : "pointer-events-none"}`}
    >
      <motion.div variants={bgVariants} className="absolute inset-0 pointer-events-none bg-[#000A3D]">
        <Image src="/images/v2/play-vs-ai/fullscreen-bg.png" alt="" fill priority sizes="100vw" className="object-cover select-none" />
      </motion.div>

      <div className="relative h-full w-full p-0 sm:p-4 xl:p-6 2xl:p-8">
        <motion.div layoutScroll variants={frameVariants} className="h-full w-full sm:rounded-[28px] xl:rounded-[40px] sm:border overflow-y-auto sm:overflow-hidden overscroll-contain">
          <div className="min-h-full sm:h-full grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] xl:grid-cols-[minmax(240px,320px)_minmax(0,1fr)_minmax(240px,320px)] gap-4 xl:gap-6 p-3 sm:p-4 xl:p-6">
            {/* Left column (xl only) */}
            <motion.div variants={fromLeft} className="hidden xl:flex flex-col gap-4 min-h-0">
              {logo}
              <MoveHistoryPanel whiteMoves={whiteMoves} blackMoves={blackMoves} pieceTheme={pieceTheme} />
              {resultBanner}
            </motion.div>

            {/* Centre column */}
            <div className="flex flex-col min-h-0 gap-3 sm:gap-4">
              <MobileMenu menu={mobileMenu} exitButton={exitButton} />
              <motion.div variants={cardVariants} className="flex flex-col flex-1 min-h-0 gap-3 sm:gap-4 sm:rounded-[24px] sm:border sm:p-4 xl:p-5">
                <PlayerBar player={topPlayer} pieceTheme={pieceTheme} variants={fromTop} />
                <div ref={boardSlotRef} className="-mx-3 sm:mx-0 flex-none sm:flex-1 min-h-0 min-w-0 flex items-center justify-center overflow-hidden">
                  <div className="relative">
                  {isPresent && board}
                  <AnimatePresence>
                    {showPostGame && (
                      <motion.div
                        key="post-game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onDismissPostGame}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 rounded-[8px]"
                      >
                        <motion.div
                          initial={{ y: 24, opacity: 0, scale: 0.94 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ y: 16, opacity: 0, scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 320, damping: 26 }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex flex-col items-center text-center gap-3 px-4 w-full max-w-[340px]"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -12 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.1 }}
                            className="w-[64px] h-[64px] sm:w-[88px] sm:h-[88px] rounded-[18px] bg-white/95 flex items-center justify-center shadow-lg"
                          >
                            <Image src="/images/v2/profile/icon-_Analyze Games 1.png" alt="" width={64} height={64} className="w-[44px] h-[44px] sm:w-[60px] sm:h-[60px] object-contain" />
                          </motion.div>
                          <p className="text-white font-bold text-[16px] sm:text-[20px]">Want to improve your next games?</p>
                          <p className="text-white/90 text-[12px] sm:text-[14px] -mt-1">Analyze your game with AI and see what you missed.</p>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onAnalyze}
                            disabled={isAnalyzing}
                            className="w-full h-[48px] rounded-full bg-[#00B427] border-[3px] border-[#19A23C] text-white font-bold text-[15px] uppercase sm:normal-case sm:font-semibold hover:brightness-110 transition disabled:opacity-70"
                          >
                            {isAnalyzing ? "Starting..." : "Analyze Mistakes"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onStartNewGame}
                            className="w-full text-white font-semibold text-[15px] underline underline-offset-4 py-2 sm:no-underline sm:py-0 sm:h-[48px] sm:rounded-full sm:bg-[#221AE9] sm:border-[3px] sm:border-[#1B14CC] sm:hover:bg-[#2d25ea] transition-colors"
                          >
                            Start new Game
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                </div>
                <PlayerBar player={bottomPlayer} pieceTheme={pieceTheme} variants={fromBottom} />
              </motion.div>
              <motion.div variants={fromBottom} className="sm:hidden flex flex-col gap-3 pb-4">
                {resultBanner}
                <MobileMoveStrip whiteMoves={whiteMoves} blackMoves={blackMoves} pieceTheme={pieceTheme} />
              </motion.div>
            </div>

            {/* Right column: on <xl it also carries the logo and move history */}
            <motion.div variants={fromRight} className="hidden sm:flex flex-col gap-4 min-h-0">
              <div className="hidden sm:flex items-center justify-between xl:justify-end">
                <div className="xl:hidden">{logo}</div>
                {exitButton}
              </div>
              <div className="xl:hidden flex flex-col gap-4 min-h-0 shrink">
                {resultBanner}
                <MoveHistoryPanel whiteMoves={whiteMoves} blackMoves={blackMoves} pieceTheme={pieceTheme} />
              </div>
              <MenuPanel menu={menu} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
