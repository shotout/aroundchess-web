"use client";

import PgnPlayer from "@/components/analysis-loading/LoadingChess";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import Image from "next/image";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from "react";
import { useV3BackgroundAnalysisStore } from "@/app/store/v3BackgroundAnalysis";
import { usePgnStore } from "@/app/store/zustandStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game?: any;
  onOpenGameAnalysis?: (v3Result?: any) => void;
}

export default function ProcessingAnalysisMode({
    open,
    onOpenChange,
    game,
    onOpenGameAnalysis
}: Props) {
    const { getJobByGameId } = useV3BackgroundAnalysisStore();
    const { setPgn } = usePgnStore();
    const [progress, setProgress] = useState(0);

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
    const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
    const headerHeight = 72;
    const headerHeightLg = 96;

    // Set PGN to store when modal opens to enable animation
    useEffect(() => {
        if (open && game?.pgn) {
            console.log("🎬 ProcessingAnalysisMode: Setting PGN to store for animation");
            setPgn(game.pgn);
        }
    }, [open, game?.pgn, setPgn]);

    // Monitor job progress with polling
    useEffect(() => {
        if (!game || !open) {
            setProgress(0);
            return;
        }

        const checkJobStatus = () => {
            const job = getJobByGameId(game.id);
            console.log(`[ProcessingAnalysisMode] Checking job for game ${game.id}:`, job);

            if (job) {
                console.log(`[ProcessingAnalysisMode] Job status: ${job.status}, Progress: ${job.progress}`);
                if (job.status === "pending" || job.status === "processing") {
                    setProgress(job.progress || 0);
                } else if (job.status === "completed") {
                    setProgress(100);
                }
            } else {
                console.log(`[ProcessingAnalysisMode] No job found for game ${game.id}`);
                setProgress(0);
            }
        };

        // Initial check
        checkJobStatus();

        // Poll every second while dialog is open
        const interval = setInterval(checkJobStatus, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [game, open, getJobByGameId]);

    // Handle completion: close ProcessingAnalysisMode and open GameAnalysis after 2 seconds
    useEffect(() => {
        if (progress === 100 && open) {
            console.log("✅ Analysis completed! Waiting 2 seconds before opening GameAnalysis...");

            const timer = setTimeout(() => {
                console.log("🎉 Opening GameAnalysis dialog");

                // Get the completed job result from v3 store
                const job = getJobByGameId(game.id);
                console.log("📦 V3 Job result:", job?.result);
                console.log("📦 V3 Job analysisId:", job?.analysisId);
                console.log("📦 V3 Job full data:", JSON.stringify(job, null, 2));

                onOpenChange(false); // Close ProcessingAnalysisMode

                if (onOpenGameAnalysis) {
                    // Pass the v3 result with analysisId to GameAnalysis
                    onOpenGameAnalysis({
                        ...job?.result,
                        analysisId: job?.analysisId
                    });
                }
            }, 2000); // 2 seconds delay

            return () => clearTimeout(timer);
        }
    }, [progress, open, onOpenChange, onOpenGameAnalysis, game, getJobByGameId]);

    if (!open) return null;

    return (
        <div
            className="fixed bg-[rgba(0,0,0,.5)] backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0"
            style={{
                top:
                typeof window !== "undefined" && window.innerWidth >= 1024
                    ? headerHeightLg
                    : headerHeight,
                left: sidebarWidth,
                right: 0,
                bottom: 0,
            }}
            onClick={() => onOpenChange(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full lg:w-[650px] bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] lg:rounded-[24px] p-[16px] lg:p-[32px]">
                <button type="button" onClick={() => onOpenChange(false)} className="absolute top-[16px] lg:top-[32px] right-[16px] lg:right-[32px]">
                    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 10L10 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 10L30 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <h3 className="text-[18px] text-center font-bold text-[#121212] mb-[16px]">Choose Analysis Mode</h3>

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
                    <h4 className="text-[24px] lg:text-[36px] mb-[24px] font-semibold">AI Analyzing Now...</h4>
                    <div className="mb-[-56px]">
                        <PgnPlayer />
                    </div>
                </div>
            </div>
        </div>
    );
}