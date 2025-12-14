"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { useV3BackgroundAnalysisStore } from "@/app/store/v3BackgroundAnalysis";
import { usePgnStore } from "@/app/store/zustandStore";
import { usePollingManager } from "../hooks/usePollingManager";
import { useTutorial } from "@/components/TutorialProvider";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game?: any;
  onStartQuickSummary?: () => void;
  shortAnalysisData?: any;
  v2AnalysisData?: any;
  onOpenProcessingMode?: () => void;
  onOpenGameAnalysis?: (v3Result?: any) => void;
}

export default function ChooseAnalysisMode({
    open,
    onOpenChange,
    game,
    onStartQuickSummary,
    shortAnalysisData,
    v2AnalysisData,
    onOpenProcessingMode,
    onOpenGameAnalysis
}: Props) {
    const router = useRouter();
    const { getJobByGameId } = useBackgroundAnalysisStore();
    const { getJobByGameId: getV3JobByGameId } = useV3BackgroundAnalysisStore();
    const { setPgn, setDataAnalysis, setDataGamesImport, setIsFromGameHistory } = usePgnStore();
    const { startBackgroundPolling } = usePollingManager();
    const { isTutorialPlay, stepFocused } = useTutorial();

    const [progress, setProgress] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // V3 Quick Summary job monitoring
    const [v3Progress, setV3Progress] = useState(0);
    const [isV3Analyzing, setIsV3Analyzing] = useState(false);
    const [isV3Completed, setIsV3Completed] = useState(false);

    // For tutorial mode, show Chess Master as analyzing with 45% progress
    const isTutorialStep3 = isTutorialPlay && stepFocused === 2;
    const chessMasterProgress = isTutorialStep3 ? 45 : progress;

    // Chess Master is analyzing if: tutorial step 3, OR job is analyzing AND no v2 data available
    // If v2AnalysisData is available (from View Analysis), button should be enabled
    const isChessMasterAnalyzing = isTutorialStep3 || (isAnalyzing && !v2AnalysisData?.success);

    // Log analysis data ketika diterima
    useEffect(() => {
        if (open) {
            console.log("📊 ChooseAnalysisMode props:");
            console.log("  - v2AnalysisData:", v2AnalysisData);
            console.log("  - shortAnalysisData:", shortAnalysisData);
            console.log("  - v2 has data:", !!v2AnalysisData?.data);
            console.log("  - v3 has data:", !!shortAnalysisData?.data);
            console.log("  - isChessMasterAnalyzing:", isChessMasterAnalyzing);
        }
    }, [open, v2AnalysisData, shortAnalysisData, isChessMasterAnalyzing]);

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
    const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
    const headerHeight = 72;
    const headerHeightLg = 96;

    // Restart background polling when dialog is reopened
    useEffect(() => {
        if (!game || !open) return;

        const job = getJobByGameId(game.id);

        // If job exists and is in progress, restart polling to ensure progress continues
        if (job && ["pending", "processing", "finalizing", "waiting"].includes(job.status)) {
            console.log("🔄 ChooseAnalysisMode opened - Restarting polling for job:", job.jobId);

            // Restart polling if job has statusUrl
            if (job.statusUrl && job.gamePgn) {
                startBackgroundPolling(
                    game.id,
                    job.statusUrl,
                    job.jobId,
                    job.gamePgn,
                    game,
                    true // isRestore = true to avoid showing toast
                );
            }
        }
    }, [game, open, getJobByGameId, startBackgroundPolling]);

    // Monitor job progress with polling
    useEffect(() => {
        if (!game || !open) {
            setIsAnalyzing(false);
            setProgress(0);
            setIsCompleted(false);
            return;
        }

        const checkJobStatus = () => {
            const job = getJobByGameId(game.id);

            if (job) {
                if (job.status === "pending" || job.status === "processing") {
                    setIsAnalyzing(true);
                    setProgress(job.progress || 0);
                    setIsCompleted(false);
                } else if (job.status === "completed") {
                    setIsAnalyzing(false);
                    setProgress(100);
                    setIsCompleted(true);
                }
            } else {
                setIsAnalyzing(false);
                setProgress(0);
                setIsCompleted(false);
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

    // Monitor V3 Quick Summary job progress
    useEffect(() => {
        console.log("🔄 [V3 Monitor] useEffect triggered - open:", open, "game:", game?.id);

        if (!game || !open) {
            console.log("⏸️ [V3 Monitor] Resetting state (dialog closed or no game)");
            setIsV3Analyzing(false);
            setV3Progress(0);
            setIsV3Completed(false);
            return;
        }

        const checkV3JobStatus = () => {
            const v3Job = getV3JobByGameId(game.id);
            console.log(`📊 [V3 Monitor] Checking V3 Job for game ${game.id}:`, {
                exists: !!v3Job,
                status: v3Job?.status,
                progress: v3Job?.progress,
                hasResult: !!v3Job?.result
            });

            if (v3Job) {
                if (v3Job.status === "pending" || v3Job.status === "processing") {
                    setIsV3Analyzing(true);
                    setV3Progress(v3Job.progress || 0);
                    setIsV3Completed(false);
                    console.log(`⏳ [V3 Monitor] V3 Job in progress: ${v3Job.progress}%`);
                } else if (v3Job.status === "completed") {
                    setIsV3Analyzing(false);
                    setV3Progress(100);
                    setIsV3Completed(true);
                    console.log(`✅ [V3 Monitor] V3 Job COMPLETED! Has result:`, !!v3Job.result);
                } else {
                    console.log(`⚠️ [V3 Monitor] Unknown status: ${v3Job.status}`);
                }
            } else {
                console.log(`❌ [V3 Monitor] No V3 Job found for game ${game.id}`);
                setIsV3Analyzing(false);
                setV3Progress(0);
                setIsV3Completed(false);
            }
        };

        // Initial check
        console.log("🚀 [V3 Monitor] Starting initial check and polling");
        checkV3JobStatus();

        // Poll every second while dialog is open
        const interval = setInterval(checkV3JobStatus, 1000);

        return () => {
            console.log("🛑 [V3 Monitor] Cleaning up interval");
            clearInterval(interval);
        };
    }, [game, open, getV3JobByGameId]);

    const handleChessMasterClick = async () => {
        if (!game) return;

        console.log("📤 [Chess Master] Click detected");
        console.log("📊 v2AnalysisData:", v2AnalysisData);
        console.log("📊 isCompleted:", isCompleted);

        // Check if v2 data is available from fetch (View Analysis flow)
        if (v2AnalysisData?.success && v2AnalysisData.data) {
            console.log("✅ [Chess Master] Opening /analysis page with v2AnalysisData");
            setPgn(game.pgn);
            setDataGamesImport(game);
            setDataAnalysis(v2AnalysisData.data);
            setIsFromGameHistory(true);
            onOpenChange(false);
            router.push("/analysis");
            return;
        }

        // Fallback: check if job is completed (Analyze Game History flow)
        if (isCompleted) {
            const job = getJobByGameId(game.id);
            console.log("📦 [Chess Master] Job found:", job);
            if (job && job.result) {
                console.log("✅ [Chess Master] Opening /analysis page with job result");
                setPgn(game.pgn);
                setDataGamesImport(game);
                setDataAnalysis(job.result);
                setIsFromGameHistory(true);
                onOpenChange(false);
                router.push("/analysis");
                return;
            }
        }

        console.error("❌ [Chess Master] No analysis data available");
    };

    const handleQuickSummaryClick = async () => {
        console.log("🎯 ============ Quick Summary button clicked ============");
        console.log("📊 Game ID:", game?.id);
        console.log("📊 shortAnalysisData:", shortAnalysisData);
        console.log("📊 isV3Completed:", isV3Completed);

        // Check if v3 data is available from fetch (View Analysis flow)
        // Must have summary property to be complete analysis data
        if (shortAnalysisData?.success && shortAnalysisData.data?.summary) {
            console.log("✅ [Quick Summary] Opening GameAnalysis with shortAnalysisData");
            console.log("📦 Short analysis data:", shortAnalysisData.data);

            // Close ChooseAnalysisMode
            onOpenChange(false);

            // Open GameAnalysis directly with the data
            if (onOpenGameAnalysis) {
                onOpenGameAnalysis({
                    ...shortAnalysisData.data,
                    analysisId: shortAnalysisData.data.analysisId || shortAnalysisData.data.id
                });
                console.log("📂 GameAnalysis opened with fetched data");
            } else {
                console.error("❌ onOpenGameAnalysis callback not provided!");
            }

            // Call old callback if exists
            if (onStartQuickSummary) {
                onStartQuickSummary();
            }

            console.log("🎯 ============ Quick Summary handler end ============");
            return;
        }

        // Fallback: check if v3 job is completed (Analyze Game History flow)
        const v3Job = getV3JobByGameId(game.id);
        console.log("📦 V3 Job from store:", v3Job);
        console.log("📦 V3 Job status:", v3Job?.status);
        console.log("📦 V3 Job has result:", !!v3Job?.result);

        if (isV3Completed && v3Job?.result) {
            console.log("✅ [Quick Summary] Opening GameAnalysis with v3 job result");
            console.log("📦 V3 Result structure:", JSON.stringify(v3Job.result, null, 2));

            // Close ChooseAnalysisMode
            onOpenChange(false);

            // Open GameAnalysis directly with the result
            if (onOpenGameAnalysis) {
                onOpenGameAnalysis({
                    ...v3Job.result,
                    analysisId: v3Job.analysisId
                });
                console.log("📂 GameAnalysis opened with job result");
            } else {
                console.error("❌ onOpenGameAnalysis callback not provided!");
            }
        } else {
            console.log("⏳ [Quick Summary] Job not completed yet, opening ProcessingAnalysisMode");
            console.log("⏳ Current progress:", v3Job?.progress || 0);

            // Close ChooseAnalysisMode
            onOpenChange(false);

            // Open ProcessingAnalysisMode to show progress
            if (onOpenProcessingMode) {
                onOpenProcessingMode();
                console.log("📂 ProcessingAnalysisMode opened");
            } else {
                console.error("❌ onOpenProcessingMode callback not provided!");
            }
        }

        // Call old callback if exists
        if (onStartQuickSummary) {
            onStartQuickSummary();
        }

        console.log("🎯 ============ Quick Summary handler end ============");
    };

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
            <div onClick={(e) => e.stopPropagation()} data-tutorial="3" className="relative w-full lg:w-[560px] bg-gradient-to-b from-white to-[#D0EFFF] rounded-[16px] lg:rounded-[24px] p-[16px] lg:p-[32px]">
                <button type="button" onClick={() => onOpenChange(false)} className="absolute top-[16px] lg:top-[32px] right-[16px] lg:right-[32px]">
                    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 10L10 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 10L30 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <h3 className="text-[18px] text-center font-bold text-[#121212] mb-[32px]">Choose Analysis Mode</h3>

                <div className="flex flex-col gap-[16px]">
                    <button type="button" onClick={handleQuickSummaryClick} className="relative w-full rounded-[24px] p-[12px] border border-b-[5px] border-[#16A6E9] bg-gradient-to-b from-[#DAF1FB] to-[#81CFF3] overflow-hidden">
                        <Image src={"/images/analysis/bg.svg"} alt="..." width={240} height={240} className="bg-image absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
                        <div className="flex flex-col justify-center items-center">
                            <Image src={"/images/analysis/icon_quick-summary.svg"} alt="..." width={60} height={60} className="" />
                            <p className="text-[24px] font-semibold text-[#040404] leading-[150%] mb-[4px]">Quick Summary</p>
                            <p className="text-[16px] text-[#585858] mb-[16px]">(Easy hints to improve your game)</p>
                            <span className="flex items-center gap-[4px] text-[16px] leading-[20px] font-bold">
                                Open Game Analysis
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_494_127255)">
                                        <path d="M1 7H15.101" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8.79688 0.875L15.0969 7L8.79688 13.125" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_494_127255">
                                            <rect width="16" height="14" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                        </div>
                    </button>

                    <button
                        type="button"
                        disabled={isChessMasterAnalyzing}
                        onClick={handleChessMasterClick}
                        className={`relative w-full rounded-[24px] p-[12px] border border-b-[5px] overflow-hidden ${
                            isChessMasterAnalyzing
                                ? "border-[#666666] bg-gradient-to-b from-[#DEDEDE] to-[#99A5A9]"
                                : "border-[#16A6E9] bg-gradient-to-b from-[#DAF1FB] to-[#81CFF3]"
                        }`}
                    >
                        <Image
                            src={"/images/analysis/bg.svg"}
                            alt="..."
                            width={240}
                            height={240}
                            className={`bg-image absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${isChessMasterAnalyzing ? "grayscale" : ""}`}
                        />
                        <div className="flex flex-col justify-center items-center">
                            <Image src={"/images/analysis/icon_chess-master.svg"} alt="..." width={60} height={60} className="" />
                            <p className="text-[24px] font-semibold text-[#040404] leading-[150%] mb-[4px]">Chess Master Analysis</p>
                            <p className="text-[16px] text-[#585858] mb-[4px]">(In-depth Analysis - understand it all)</p>
                            {isChessMasterAnalyzing ? (
                                <div className="relative w-[300px] flex items-center justify-center h-[45px] text-[#666666] bg-white border border-[#666666] rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-tr from-[rgba(102,102,102,.8)] to-[rgba(157,157,157,.5)] transition-all duration-300 ease-out"
                                        style={{ width: `${chessMasterProgress}%` }}
                                    />
                                    <span className="relative z-10">On Progress: <strong className="font-semibold">{chessMasterProgress}%</strong></span>
                                </div>
                            ) : (
                                <span className="flex items-center gap-[4px] text-[16px] leading-[20px] font-bold">
                                    Open Chess Master Analysis
                                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_494_127255)">
                                            <path d="M1 7H15.101" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.79688 0.875L15.0969 7L8.79688 13.125" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_494_127255">
                                                <rect width="16" height="14" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}