"use client";

import PgnPlayer from "@/components/analysis-loading/LoadingChess";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import Image from "next/image";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from "react";
import { useV3BackgroundAnalysisStore } from "@/app/store/v3BackgroundAnalysis";
import { usePgnStore } from "@/app/store/zustandStore";
import { useV3PollingManager } from "../hooks/useV3PollingManager";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game?: any;
  onOpenGameAnalysis?: (v3Result?: any) => void;
}

/** Measured average time for an analysis to come back. */
const AVERAGE_ANALYSIS_MS = 11_000;
/** The ramp stops here; the last percent belongs to the job actually finishing. */
const PROGRESS_CEILING = 99;
/** Fine enough that the ring reads as continuous motion rather than steps. */
const TICK_MS = 100;

export default function ProcessingAnalysisMode({
    open,
    onOpenChange,
    game,
    onOpenGameAnalysis
}: Props) {
    const { getJobByGameId } = useV3BackgroundAnalysisStore();
    const { startV3BackgroundPolling } = useV3PollingManager();
    const { setPgn } = usePgnStore();
    const [progress, setProgress] = useState(0);
    // Left edge of the overlay: the desktop sidebar is `fixed left-0` with this
    // width (navigation.tsx, same >=1280 breakpoint), and the overlay starts
    // where it ends so the sidebar stays clear. 0 below 1280, where there is no
    // docked sidebar.
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        if (typeof window === "undefined") return 0;
        return window.innerWidth >= 1280 ? window.innerWidth / 6 : 0;
    });

    useEffect(() => {
        const handleResize = () => {
            if (typeof window === "undefined") return;
            setSidebarWidth(window.innerWidth >= 1280 ? window.innerWidth / 6 : 0);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    // Keyed on the id, not the object: a re-created `game` prop would otherwise
    // restart the ramp from 0 partway through an analysis.
    const gameId = game?.id;
    // 99 is only reachable by outrunning the average — completion jumps to 100.
    const isTakingLonger = progress >= PROGRESS_CEILING && progress < 100;
    // Blank once the analysis is done — nothing is being waited on any more.
    const statusText =
        progress >= 100
            ? ""
            : isTakingLonger
              ? "Just one more moment..."
              : "AI Analyzing Now...";

    useEffect(() => {
        if (open && game?.pgn) {
            setPgn(game.pgn);
        }
    }, [open, game?.pgn, setPgn]);

    useEffect(() => {
        if (!game || !open) return;

        const v3Job = getJobByGameId(game.id);

        if (v3Job && ["pending", "processing", "waiting", "finalizing"].includes(v3Job.status)) {
            if (v3Job.statusUrl && (v3Job.gamePgn || game.pgn)) {
                startV3BackgroundPolling(
                    game.id,
                    v3Job.statusUrl,
                    v3Job.jobId,
                    v3Job.gamePgn || game.pgn,
                    game,
                    false
                );
            }
        }
    }, [game, open, getJobByGameId, startV3BackgroundPolling]);

    // Progress is driven by elapsed time, not by job.progress: the backend
    // reports in coarse, unevenly-spaced jumps, so the ring used to sit still
    // and then leap. It ramps linearly to 99% across the average analysis time
    // and waits there — only the job completing takes it to 100%.
    useEffect(() => {
        if (gameId == null || !open) {
            setProgress(0);
            return;
        }

        const startedAt = Date.now();

        const tick = () => {
            if (getJobByGameId(gameId)?.status === "completed") {
                setProgress(100);
                return;
            }
            const elapsed = Date.now() - startedAt;
            const ramped = Math.floor((elapsed / AVERAGE_ANALYSIS_MS) * PROGRESS_CEILING);
            setProgress(Math.min(PROGRESS_CEILING, ramped));
        };

        tick();
        const interval = setInterval(tick, TICK_MS);

        return () => {
            clearInterval(interval);
        };
    }, [gameId, open, getJobByGameId]);

    useEffect(() => {
        if (progress === 100 && open && game) {
            const v3Job = getJobByGameId(game.id);
            
            if (v3Job?.result) {
                setTimeout(() => {
                    onOpenChange(false);
                    
                    if (onOpenGameAnalysis) {
                        onOpenGameAnalysis({
                            ...v3Job.result,
                            analysisId: v3Job.analysisId
                        });
                    }
                }, 2000);
            }
        }
    }, [progress, open, game, onOpenChange, onOpenGameAnalysis, getJobByGameId]);

    if (!open) return null;

    return (
        /* Full height (top-0 bottom-0), inset only on the left. The top used to
           be a hardcoded 72/96px meant to clear the header, which knows nothing
           about the promo banner pushing that header down — with the banner up
           it left an unblurred band across the top of the screen. Nothing needs
           measuring vertically, so nothing is measured.

           The left inset stays: the sidebar is deliberately left uncovered.

           z-[70], not z-50: at 50 the overlay tied with the header (z-50) it
           now runs up behind. */
        <div
            className="fixed top-0 right-0 bottom-0 bg-[rgba(0,0,0,.5)] backdrop-blur-sm z-[70] flex items-center justify-center p-4 md:p-0"
            style={{ left: sidebarWidth }}
            onClick={() => onOpenChange(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full lg:w-[450px] xl:w-[546px] bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] lg:rounded-[24px] p-[16px] lg:p-[32px]">
                <button type="button" onClick={() => onOpenChange(false)} className="absolute top-[16px] right-[16px]">
                    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 10L10 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 10L30 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <h3 className="text-[18px] text-center font-bold text-[#121212] mb-[16px]">Analyzing your Game</h3>

                <div className="flex flex-col items-center justify-center mb-[8px]">
                    <div className="w-[100px] h-[100px]">
                        <CircularProgressbar
                            value={progress}
                            text={`${progress}%`}
                            styles={{
                                root: {},
                                text: {
                                    fill: "#364152",
                                    fontSize: "22px",
                                    fontWeight: 600,
                                },
                                path: {
                                    stroke: "#221AE9",
                                    strokeLinecap: "butt",
                                },
                                trail: {
                                    stroke: "#DEDEDE",
                                }
                            }} />
                    </div>
                    {/* A non-breaking space holds the line box when the text is
                        blank. An empty heading collapses to zero height, and the
                        board would jump up for the two seconds the modal stays
                        open after hitting 100%. */}
                    <h4 className="text-[24px] lg:text-[30px] mb-[24px] font-semibold text-center">
                        {statusText || " "}
                    </h4>
                    <div className="w-full max-w-full overflow-visible flex justify-center">
                        <div className="flex justify-center w-full max-w-[calc(100vw-64px)] lg:max-w-[386px] xl:max-w-[482px]">
                            <PgnPlayer maxBoardSize={380} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
