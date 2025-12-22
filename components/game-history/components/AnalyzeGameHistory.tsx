"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { usePgnStore } from "@/app/store/zustandStore";
import { useProfileStore } from "@/app/store/profile";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { usePollingManager } from "../hooks/usePollingManager";
import { useV3PollingManager } from "../hooks/useV3PollingManager";
import { checkAnalysisCapacity } from "@/lib/services/capacity";
import { useV3BackgroundAnalysisStore } from "@/app/store/v3BackgroundAnalysis";
import { createPgnHash } from "@/utils/crypto-utils";

interface AnalyzeGameHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game?: any;
  autoStart?: boolean;
  onAutoStartComplete?: () => void;
  onAnalysisStarted?: () => void;
  onShortAnalysisReceived?: (data: any) => void;
}

export function AnalyzeGameHistory({
  open,
  onOpenChange,
  game,
  autoStart = false,
  onAutoStartComplete,
  onAnalysisStarted,
  onShortAnalysisReceived,
}: AnalyzeGameHistoryProps) {
  const router = useRouter();
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();
  const { isMember,isMemberMonthly, token, sessionId } = useProfileStore();
  const { addJob, updateJob, getJobByGameId } = useBackgroundAnalysisStore();
  const {
    setPgn,
    setError,
    setDataAnalysis,
    setDataGamesImport,
    depth,
    setDepth,
  } = usePgnStore();
  const { setIsFromAnalyzeDifferentGame } = usePgnStore();
  const { startBackgroundPolling } = usePollingManager();
  const { startV3BackgroundPolling } = useV3PollingManager();
  const { addJob: addV3Job } = useV3BackgroundAnalysisStore();
  const autoStartedRef = useRef(false);

  const depths = [
    {
      image: "/icons/board-small-analysis.svg",
      value: 12,
      title: "Standard Analysis",
      description: "Our AI quickly analyzes your chess game with a low-depth search, providing fast insights without long processing times.",
      mustMember: false,
    },
    {
      image: "/icons/board-medium-analysis.svg",
      value: 16,
      title: "Full Analysis",
      description: "Our AI analyzes your chess game with a middle-depth search, offering balanced insights with moderate processing time.",
      mustMember: true,
    },
    {
      image: "/icons/board-large-analysis.svg",
      value: 18,
      title: "Deep Analysis",
      description: "Our AI analyzes your chess game with a high-depth search, providing deep insights with a longer processing time.",
      mustMember: true,
    },
  ];

  const [activeTab] = useState("auto");
  const [pgnText] = useState("");
  const [depthChoosed, setDepthChoosed] = useState(depth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLastAnalysisV3 = async (pgnHash: string): Promise<any> => {
    try {
      const endpoint = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
      const response = await fetch(
        `${endpoint}/v3/analyze/last-analysis/${pgnHash}?t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch v3 analysis: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching v3 last analysis:", error);
      return null;
    }
  };

  const handleAnalyzeGame = async () => {
    // Disable button immediately to prevent double-click
    setIsSubmitting(true);

    try {
      const capacityCheck = await checkAnalysisCapacity(sessionId);

      if (!capacityCheck.success || !capacityCheck.data.canStart) {
        const reason = capacityCheck.data.reason || "Cannot start analysis";

        toast.error("Analysis Capacity Limit", {
          description: reason,
          duration: 5000,
        });

        if (
          reason.toLowerCase().includes("token") ||
          reason.toLowerCase().includes("balance")
        ) {
          onOpenChange(false);
          setOpenPricing(true);
          setTabType("tokens");
        }
        setIsSubmitting(false); // Re-enable button on error
        return;
      }

      toast.info(`Analysis Capacity Check`, {
        description: `Available tokens: ${capacityCheck.data.availableTokens}, Active jobs: ${capacityCheck.data.activeJobs}`,
        duration: 3000,
      });
    } catch (error: any) {
      toast.error("Capacity Check Failed", {
        description: error.message || "Failed to check analysis capacity",
        duration: 5000,
      });
      setIsSubmitting(false); // Re-enable button on error
      return;
    }

    if (token.balance < 1) {
      setOpenPricing(true);
      setTabType("tokens");
      setIsSubmitting(false); // Re-enable button
      return;
    }
    let gameToAnalyze = game.pgn || pgnText;
    if (!gameToAnalyze) {
      setIsSubmitting(false); // Re-enable button
      return;
    }

    // Check for existing job BEFORE adding new one
    const existing = getJobByGameId(game.id);
    if (
      existing &&
      ["pending", "processing", "finalizing"].includes(existing.status)
    ) {
      // If job already exists and is in progress, open ChooseAnalysisMode to show progress
      toast.info("Analysis already in progress for this game.", {
        description: `Current status: ${existing.status}`,
        duration: 5000,
      });

      // Open ChooseAnalysisMode to view progress
      if (onAnalysisStarted) {
        onAnalysisStarted();
      }

      // Close AnalyzeGameHistory
      onOpenChange(false);
      setIsSubmitting(false); // Re-enable button
      return;
    }
    if (existing && existing.status === "completed" && existing.result) {
      console.log("📦 [AnalyzeGameHistory] Existing completed job found, fetching v3 analysis");

      try {
        // Fetch v3 analysis to get Quick Summary data
        const pgnHash = createPgnHash(game.pgn);
        const v3Analysis = await fetchLastAnalysisV3(pgnHash);

        console.log("📥 [AnalyzeGameHistory] V3 Analysis response:", v3Analysis);

        // Send v3 analysis to parent if available
        if (v3Analysis && onShortAnalysisReceived) {
          onShortAnalysisReceived(v3Analysis);
          console.log("📤 [AnalyzeGameHistory] V3 analysis data sent to parent component");
        }

        // Open ChooseAnalysisMode to show both analysis options
        if (onAnalysisStarted) {
          onAnalysisStarted();
        }

        // Close AnalyzeGameHistory
        onOpenChange(false);
        setIsSubmitting(false);
        return;
      } catch (error) {
        console.error("❌ [AnalyzeGameHistory] Error fetching v3 analysis:", error);
        // Fallback: if v3 fetch fails, just open ChooseAnalysisMode anyway
        if (onAnalysisStarted) {
          onAnalysisStarted();
        }
        onOpenChange(false);
        setIsSubmitting(false);
        return;
      }
    }

    // Add job to store immediately to update UI (button changes to "View Analysis")
    const tempJobId = `temp-${Date.now()}`;
    addJob(
      game.id,
      tempJobId,
      undefined, // statusUrl will be updated after API response
      game.pgn,
      depthChoosed
    );

    try {
      const { default: axios } = await import("axios");
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
      let endpoint = "";

      if (depthChoosed === 12) {
        endpoint = `${baseUrl}/v2/analyze/basic-analyze?t=${Date.now()}`;
      } else if (depthChoosed === 16) {
        endpoint = `${baseUrl}/v2/analyze/standard-analyze?t=${Date.now()}`;
      } else {
        endpoint = `${baseUrl}/v2/analyze/deep-analyze?t=${Date.now()}`;
      }

      gameToAnalyze = gameToAnalyze.replace("*", "1-0");
      const res = await axios.post(
        endpoint,
        {
          pgn: gameToAnalyze,
          username: game.username || "",
          depth: depthChoosed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      const data = res.data.data;
      if (data?.processingMode === "async") {
        // Update the existing job with actual jobId and statusUrl from API response
        updateJob(game.id, {
          jobId: data.jobId,
          statusUrl: data.statusUrl,
          gamePgn: gameToAnalyze,
          status: data.status === "completed" ? "completed" : "pending",
        });

        // Open ChooseAnalysisMode FIRST, then close AnalyzeGameHistory
        // This ensures smooth transition without gap between dialogs
        if (onAnalysisStarted) {
          onAnalysisStarted();
        }

        // Close AnalyzeGameHistory after ChooseAnalysisMode is triggered
        // Small delay ensures ChooseAnalysisMode is rendered before this closes
        setTimeout(() => {
          onOpenChange(false);
        }, 50);

        if (["completed", "ready"].includes(data.status)) {
          updateJob(game.id, {
            status: "completed",
            progress: 100,
            result: data.result || data,
          });
          setPgn(gameToAnalyze);
          setDataGamesImport(game);
          setDataAnalysis(data.result || data);
          toast.success("Analysis complete!", {
            description: "Using cached analysis result.",
            duration: 5000,
          });
          return;
        }

        if (["pending", "processing", "finalizing"].includes(data.status)) {
          toast.info("Analysis already in progress for this game.", {
            description: `Current progress: ${data.progress || 0}%`,
            duration: 5000,
          });
        } else {
          toast.success(
            "Analysis started! You'll be notified when it's complete.",
            {
              description: "You can continue browsing while it runs.",
              duration: 5000,
            }
          );
        }

        startBackgroundPolling(
          game.id,
          data.statusUrl,
          data.jobId,
          gameToAnalyze,
          game
        );
      } else if (res.status === 200 && data && !data.processingMode) {
        if (existing && ["pending", "processing"].includes(existing.status)) {
          onOpenChange(false);
          toast.info("Analysis already in progress for this game.", {
            description: "Please wait for the current analysis to complete.",
            duration: 5000,
          });
        } else {
          setPgn(gameToAnalyze);
          setDataGamesImport(game.pgn);
          setDataAnalysis(data);
          onOpenChange(false);
          router.push("/analysis");
        }
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to start analysis";
      toast.error(msg);
      setError(err instanceof Error ? err : new Error(msg));
      updateJob(game.id, { status: "failed", error: msg });
    } finally {
      setIsSubmitting(false);
    }

    // Call to new short-analyze endpoint
    try {
      const { default: axios } = await import("axios");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";

      const shortAnalyzeRes = await axios.post(
        `${baseUrl}/v3/analyze/short-analyze?t=${Date.now()}`,
        {
          pgn: gameToAnalyze,
          username: game.username || "",
          depth: depthChoosed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      if (shortAnalyzeRes.data?.data) {
        const v3Data = shortAnalyzeRes.data.data;

        if (v3Data.statusUrl && v3Data.jobId) {
          addV3Job(
            game.id,
            v3Data.jobId,
            v3Data.statusUrl,
            gameToAnalyze,
            depthChoosed
          );

          // START POLLING IMMEDIATELY after getting statusUrl
          startV3BackgroundPolling(
            game.id,
            v3Data.statusUrl,
            v3Data.jobId,
            gameToAnalyze,
            game,
            false
          );
        }
      }

      if (shortAnalyzeRes.data && onShortAnalysisReceived) {
        onShortAnalysisReceived(shortAnalyzeRes.data);
      }
    } catch (shortAnalyzeError: any) {
      // Silent error handling
    }
  };

  // When opened with autoStart flag, or when autoStart is true even if dialog is hidden,
  // trigger analysis once without showing the dialog.
  useEffect(() => {
    // allow autoStart to trigger even if open is false
    if (!autoStart) return;
    let mounted = true;

    const run = async () => {
      if (autoStartedRef.current) return;
      autoStartedRef.current = true;
      try {
        setDepthChoosed(depth);
        setDepth(depth);
        await handleAnalyzeGame();
        // notify caller that auto-start completed so they can clear any local state
        try {
          onAutoStartComplete && onAutoStartComplete();
        } catch (e) {}
        // clear the trigger flag in the global store so it doesn't re-run
        try {
          setIsFromAnalyzeDifferentGame(false);
        } catch (e) {
          // ignore
        }
      } catch (e) {
        // swallow - handleAnalyzeGame already shows toasts
      }
    };

    if (mounted) run();

    return () => {
      mounted = false;
      // allow future auto-starts when modal re-opens
      autoStartedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoStart]);

  if (!open) return null;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = 72;
  const headerHeightLg = 96;

  return (
    <div
      className="fixed bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0"
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
        className="relative w-full mx-auto rounded-lg max-w-sm md:max-w-[800px] bg-white overflow-y-auto max-h-[95%]"
        onClick={(e) => e.stopPropagation()}
        data-tutorial="2"
      >
        <div className="p-[16px] lg:p-[32px] pb-[6px] lg:pb-[12px]">
          <h2 className="text-[20px] text-center lg:text-start lg:text-[24px] font-semibold">Analyze your games</h2>
          {/* <p className="text-[14px] --sm text-black mt-2">
            Select your Games from Chess.com or upload your previous Game's <span className="font-bold">PGN</span> for a detailed Game Analysis.
          </p> */}

          <button type="button" onClick={() => onOpenChange(false)} className="absolute top-4 right-4">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 10L10 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 10L30 30" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="p-[16px] lg:p-[32px] pt-[6px] lg:pt-[12px]">
          {activeTab === "auto" && (
            <div className="space-y-4">

              {/* <div className="space-y-2">
                <div className="flex flex-row items-center">
                  <Image
                    src="/icons/hero-section.png"
                    alt="chess"
                    width={100}
                    height={100}
                    className="w-3 h-4 relative z-10"
                    priority
                  />
                  <p className="block ml-1 text-base sm:text-[14px] --sm text-black">
                    Chess.com Username
                  </p>
                </div>
                <Input
                  disabled
                  id="username"
                  name="defaultUsername"
                  type="text"
                  placeholder="Type here..."
                  className="w-full shadow-sm min-h-[44px] bg-[#C0CED4] border border-[#737c7f] px-[16px] py-[12px]"
                  value={game.username}
                />
              </div>
              <div className="space-y-2">
                <p className="block text-base sm:text-[14px] --sm text-black">
                  Select Game
                </p>
                <div className="relative">
                  <select
                    disabled
                    value=""
                    className="w-full shadow-sm min-h-[44px] bg-[#C0CED4] border border-[#737c7f] px-[16px] py-[12px] rounded-md appearance-none"
                  >
                    <option>
                      {game.date} {game.username} vs {game.opponent}
                    </option>
                  </select>
                </div>
              </div> */}

              <div className="font-medium text-[16px] lg:text-[18px] -mb-[8px]">Choose your Analysis Depth</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center " data-tutorial="2">
                {depths.map((depth, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setDepth(depth.value);
                        setDepthChoosed(depth.value);
                      }}
                      disabled={depth.mustMember && (!isMember&&!isMemberMonthly)}
                      className={`relative min-h-[140px] lg:min-h-[250px] flex flex-col justify-around px-[8px] py-[12px] items-center shadow-md ${
                        depth.mustMember && (!isMember&&!isMemberMonthly)
                          ? "bg-[#C0CED4]"
                          : "bg-white"
                      } border ${
                        depthChoosed === depth.value
                          ? "border-[#221AE9]"
                          : isMember || isMemberMonthly
                          ? "border-[#DEDEDE]"
                          : "border-[#99A5A9]"
                      } rounded-md`}
                    >
                      <Image
                        src={depth.image}
                        alt={depth.title}
                        width={80}
                        height={80}
                        className="w-[40px] lg:w-[80px] h-[40px] lg:h-[80px] object-contain relative mb-[16px]"
                        priority
                      />
                      {depth.mustMember && (!isMember&&!isMemberMonthly) && (
                        <Image
                          src="/icons/premium-info.png"
                          alt="premium-info"
                          width={100}
                          height={100}
                          className="w-[72px] h-[23px] object-cover absolute left-2 top-2"
                          priority
                        />
                      )}
                      <div
                        className={`absolute top-4 right-4 w-4 h-4 rounded-full ${
                          depth.mustMember && (!isMember&&!isMemberMonthly)
                            ? "bg-[#99A5A9] border-1 border-[#737C7F]"
                            : depthChoosed === depth.value
                            ? "bg-[#221AE9] shadow-[#3871EC] shadow-md"
                            : "border-gray-300 border-2"
                        }`}
                      />
                      <span className="font-bold text-[16px] lg:text-[18px] --sm mb-[4px] lg:mb-[8px]">{depth.title}</span>
                      <span className="text-[#364152] leading-[130%] text-center text-[13.8px]">
                        {depth.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyzeGame}
            disabled={isSubmitting}
            className={`btn-primary w-full text-[14px] --sm rounded-full py-[8px] my-4 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Analyze Game"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
