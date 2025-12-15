"use client";

import PgnPlayer from "@/components/analysis-loading/LoadingChess";
import LoadingPage from "@/components/analysis-loading/LoadingPage";
import Image from "next/image";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from "react";
import { useV3BackgroundAnalysisStore } from "@/app/store/v3BackgroundAnalysis";
import { usePgnStore } from "@/app/store/zustandStore";
import { useProfileStore } from "@/app/store/profile";
import { createPgnHash } from "@/utils/crypto-utils";
import { useV3PollingManager } from "../hooks/useV3PollingManager";

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
    const { startV3BackgroundPolling } = useV3PollingManager();
    const { setPgn } = usePgnStore();
    const { sessionId } = useProfileStore();
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

    // Restart V3 polling when dialog is opened
    useEffect(() => {
        if (!game || !open) return;

        const v3Job = getJobByGameId(game.id);

        console.log("🔍 [ProcessingAnalysisMode] Dialog opened, checking V3 job:", {
            hasJob: !!v3Job,
            status: v3Job?.status,
            progress: v3Job?.progress,
            hasStatusUrl: !!v3Job?.statusUrl,
            hasGamePgn: !!(v3Job?.gamePgn || game?.pgn),
            jobId: v3Job?.jobId,
            isPolling: v3Job?.isPolling
        });

        // If job exists and is in progress, restart polling to ensure progress continues
        if (v3Job && ["pending", "processing", "waiting", "finalizing"].includes(v3Job.status)) {
            console.log("🔄 [V3] ProcessingAnalysisMode opened - Need to restart V3 polling for job:", v3Job.jobId);

            // Restart polling if job has statusUrl - use gamePgn from job OR fallback to game.pgn
            if (v3Job.statusUrl && (v3Job.gamePgn || game.pgn)) {
                console.log("🚀 [ProcessingAnalysisMode] Starting V3 polling with:", {
                    gameId: game.id,
                    statusUrl: v3Job.statusUrl,
                    jobId: v3Job.jobId,
                    usingJobPgn: !!v3Job.gamePgn,
                    currentIsPolling: v3Job.isPolling
                });

                // IMPORTANT: Always call startV3BackgroundPolling
                // It will handle clearing existing interval and restarting
                startV3BackgroundPolling(
                    game.id,
                    v3Job.statusUrl,
                    v3Job.jobId,
                    v3Job.gamePgn || game.pgn,
                    game,
                    false // isRestore = false to show toast when complete
                );
                console.log("✅ [ProcessingAnalysisMode] V3 polling restart request sent");
            } else {
                console.warn("⚠️ [ProcessingAnalysisMode] Cannot restart polling - missing required data:", {
                    hasStatusUrl: !!v3Job.statusUrl,
                    hasPgn: !!(v3Job.gamePgn || game.pgn)
                });
            }
        } else {
            console.log("ℹ️ [ProcessingAnalysisMode] Not restarting polling:", {
                reason: !v3Job ? "No job found" : `Job status is ${v3Job.status}`
            });
        }
    }, [game, open, getJobByGameId, startV3BackgroundPolling]);

    // Monitor job progress with polling
    useEffect(() => {
        console.log(`🔍 [ProcessingAnalysisMode Monitor] useEffect triggered:`, {
            hasGame: !!game,
            gameId: game?.id,
            open
        });

        if (!game || !open) {
            console.log(`🛑 [ProcessingAnalysisMode Monitor] Resetting progress - dialog closed or no game`);
            setProgress(0);
            return;
        }

        const checkJobStatus = () => {
            const job = getJobByGameId(game.id);
            
            console.log(`[V3 Progress Monitor] Checking job for game ${game.id}:`, {
                exists: !!job,
                status: job?.status,
                progress: job?.progress,
                currentStateProgress: progress
            });

            if (job) {
                console.log(`[V3 Progress Monitor] Job found! Status: ${job.status}, Progress: ${job.progress}%`);
                
                // Monitor all in-progress statuses
                if (job.status === "pending" || job.status === "processing" || job.status === "waiting" || job.status === "finalizing") {
                    const newProgress = job.progress || 0;
                    console.log(`⏳ [V3 Quick Summary] Job in progress - updating progress from ${progress} to ${newProgress}`);
                    setProgress(newProgress);
                } else if (job.status === "completed") {
                    console.log(`✅ [V3 Quick Summary] Job COMPLETED! Setting progress to 100`);
                    setProgress(100);
                } else {
                    console.log(`⚠️ [V3 Progress Monitor] Unknown status: ${job.status}`);
                }
            } else {
                console.log(`❌ [V3 Progress Monitor] No job found for game ${game.id}`);
                setProgress(0);
            }
        };

        // Initial check
        console.log(`🏁 [ProcessingAnalysisMode Monitor] Running initial job status check`);
        checkJobStatus();

        // Poll every second while dialog is open
        console.log(`⏰ [ProcessingAnalysisMode Monitor] Setting up interval to poll every 1000ms`);
        const interval = setInterval(checkJobStatus, 1000);

        return () => {
            console.log(`🧹 [ProcessingAnalysisMode Monitor] Cleaning up interval`);
            clearInterval(interval);
        };
    }, [game, open, getJobByGameId, progress]);

    // Handle completion: fetch last-analysis and open GameAnalysis
    useEffect(() => {
        if (progress === 100 && open && game?.pgn) {
            console.log("✅ Analysis completed! Fetching last-analysis data...");

            const fetchLastAnalysisAndOpen = async () => {
                try {
                    // Create PGN hash
                    const pgnHash = createPgnHash(game.pgn);
                    console.log("🔑 PGN Hash:", pgnHash);

                    // Fetch last-analysis
                    const endpoint = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
                    const response = await fetch(
                        `${endpoint}/v3/analyze/last-analysis/${pgnHash}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${sessionId}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Failed to fetch last-analysis: ${response.statusText}`);
                    }

                    const analysisData = await response.json();
                    console.log("📥 Last-analysis response:", analysisData);
                    console.log("📋 Analysis ID:", analysisData.data?.analysisId);

                    // Wait 2 seconds before opening
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    console.log("🎉 Opening GameAnalysis dialog");
                    onOpenChange(false); // Close ProcessingAnalysisMode

                    if (onOpenGameAnalysis && analysisData.data) {
                        // Pass the complete analysis data with analysisId
                        onOpenGameAnalysis({
                            ...analysisData.data,
                            analysisId: analysisData.data.analysisId
                        });
                    }
                } catch (error) {
                    console.error("❌ Error fetching last-analysis:", error);

                    // Fallback: use job result if fetch fails
                    const job = getJobByGameId(game.id);
                    if (job?.result) {
                        console.log("⚠️ Using fallback job result");
                        onOpenChange(false);
                        if (onOpenGameAnalysis) {
                            onOpenGameAnalysis({
                                ...job.result,
                                analysisId: job.analysisId
                            });
                        }
                    }
                }
            };

            fetchLastAnalysisAndOpen();
        }
    }, [progress, open, game, onOpenChange, onOpenGameAnalysis, getJobByGameId, sessionId]);

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
                className="relative w-full lg:w-[450px] xl:w-[546px] bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] lg:rounded-[24px] p-[16px] lg:p-[32px]">
                <button type="button" onClick={() => onOpenChange(false)} className="absolute top-[16px] right-[16px]">
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
                    <h4 className="text-[24px] lg:text-[30px] mb-[24px] font-semibold">AI Analyzing Now...</h4>
                    <div className="mb-[-56px]">
                        <PgnPlayer />
                    </div>
                </div>
            </div>
        </div>
    );
}