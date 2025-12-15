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

    useEffect(() => {
        if (!game || !open) {
            setProgress(0);
            return;
        }

        const checkJobStatus = () => {
            const job = getJobByGameId(game.id);

            if (job) {
                if (job.status === "pending" || job.status === "processing" || job.status === "waiting" || job.status === "finalizing") {
                    setProgress(job.progress || 0);
                } else if (job.status === "completed") {
                    setProgress(100);
                }
            } else {
                setProgress(0);
            }
        };

        checkJobStatus();
        const interval = setInterval(checkJobStatus, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [game, open, getJobByGameId]);

    useEffect(() => {
        if (progress === 100 && open && game?.pgn) {
            const fetchLastAnalysisAndOpen = async () => {
                try {
                    const pgnHash = createPgnHash(game.pgn);

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

                    await new Promise(resolve => setTimeout(resolve, 2000));

                    onOpenChange(false);

                    if (onOpenGameAnalysis && analysisData.data) {
                        onOpenGameAnalysis({
                            ...analysisData.data,
                            analysisId: analysisData.data.analysisId
                        });
                    }
                } catch (error) {
                    const job = getJobByGameId(game.id);
                    if (job?.result) {
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