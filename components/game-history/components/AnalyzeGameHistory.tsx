"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { usePgnStore } from "@/app/store/zustandStore";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import { useProfileStore } from "@/app/store/profile";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { useBackgroundAnalysisStore } from "@/app/store/backgroundAnaysis";
import { Input } from "@/components/ui/input";

interface AnalyzeGameHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game?: any;
}

export function AnalyzeGameHistory({
  open,
  onOpenChange,
  game,
}: AnalyzeGameHistoryProps) {
  const router = useRouter();
  const { pgnToFenList } = useStockfishAnalysis();
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();
  const { isMember, token, sessionId } = useProfileStore();
  const { setEstimateMinute, setEstimateSecond } = useLoadingAPI();
  const { addJob, updateJob, getJobByGameId, startPolling, forceStopPolling } =
    useBackgroundAnalysisStore();
  const { setPgn, setError, setDataAnalysis, setDataGamesImport } =
    usePgnStore();

  const depths = [
    {
      image: "/icons/board-small-analysis.png",
      value: 12,
      title: "Basic Analysis",
      description:
        "Our AI quickly analyzes your chess game with a low-depth search, " +
        "providing fast insights without long processing times.",
      mustMember: false,
    },
    {
      image: "/icons/board-medium-analysis.png",
      value: 16,
      title: "Standard Analysis",
      description:
        "Our AI analyzes your chess game with a middle-depth search, " +
        "offering balanced insights with moderate processing time.",
      mustMember: true,
    },
    {
      image: "/icons/board-large-analysis.png",
      value: 18,
      title: "Deep Analysis",
      description:
        "Our AI analyzes your chess game with a high-depth search, " +
        "providing deep insights with a longer processing time.",
      mustMember: true,
    },
  ];

  const [activeTab] = useState("auto");
  const [pgnText] = useState("");
  const [depthChoosed, setDepthChoosed] = useState(12);
  const [estimateBasic, setEstimateBasic] = useState("");
  const [estimateStandard, setEstimateStandard] = useState("");
  const [estimateDeep, setEstimateDeep] = useState("");
  const [timeBasic, setTimeBasic] = useState({ minute: 0, second: 0 });
  const [timeStandard, setTimeStandard] = useState({
    minute: 0,
    second: 0,
  });
  const [timeDeep, setTimeDeep] = useState({ minute: 0, second: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const pgn = pgnToFenList(game.pgn);
    const durations = [5, 23, 51];
    const estimates = durations.map((d) => {
      const total = pgn ? pgn.length * d : 0;
      return { estimate: formatTime(total), time: getTime(total) };
    });
    setEstimateBasic(estimates[0].estimate);
    setEstimateStandard(estimates[1].estimate);
    setEstimateDeep(estimates[2].estimate);
    setTimeBasic(estimates[0].time);
    setTimeStandard(estimates[1].time);
    setTimeDeep(estimates[2].time);
  }, [game.pgn, pgnToFenList]);

  const formatTime = (seconds: number): string => {
    const rounded = Math.round(seconds / 5) * 5;
    const m = Math.floor(rounded / 60);
    const s = rounded % 60;
    if (m > 0) {
      return `${m} minute${m !== 1 ? "s" : ""} ${s} second${s !== 1 ? "s" : ""}`;
    }
    return `${s} second${s !== 1 ? "s" : ""}`;
  };

  const getTime = (seconds: number) => {
    const s = Math.round(seconds / 5) * 5;
    return { minute: Math.floor(s / 60), second: s % 60 };
  };

  const handleAnalyzeGame = async () => {
    if (token.balance < 1) {
      setOpenPricing(true);
      setTabType("tokens");
      return;
    }
    const gameToAnalyze = game.pgn || pgnText;
    if (!gameToAnalyze) return;

    const existing = getJobByGameId(game.id);
    if (
      existing &&
      ["pending", "processing", "finalizing"].includes(existing.status)
    ) {
      toast.info("Analysis already in progress for this game.", {
        description: `Current status: ${existing.status}`,
        duration: 5000,
      });
      return;
    }
    if (existing && existing.status === "completed" && existing.result) {
      setPgn(game.pgn);
      setDataGamesImport(game);
      setDataAnalysis(existing.result);
      onOpenChange(false);
      router.push("/analysis");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { default: axios } = await import("axios");
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
      let endpoint = "";

      if (depthChoosed === 12) {
        endpoint = `${baseUrl}/v2/analyze/basic-analyze`;
      } else if (depthChoosed === 16) {
        endpoint = `${baseUrl}/v2/analyze/standard-analyze`;
      } else {
        endpoint = `${baseUrl}/v2/analyze/deep-analyze`;
      }

      const res = await axios.post(
        endpoint,
        { pgn: gameToAnalyze, username: game.username || "", depth: depthChoosed },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      const data = res.data.data;
      if (data?.processingMode === "async") {
        if (!getJobByGameId(game.id) || getJobByGameId(game.id)?.jobId !== data.jobId) {
          addJob(game.id, data.jobId);
        }
        onOpenChange(false);

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
        startBackgroundPolling(game.id, data.statusUrl, data.jobId, gameToAnalyze);
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
        err.response?.data?.message || err.message || "Failed to start analysis";
      toast.error(msg);
      setError(err instanceof Error ? err : new Error(msg));
      updateJob(game.id, { status: "failed", error: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startBackgroundPolling = async (
    gameId: string | number,
    statusUrl: string,
    jobId: string,
    gamePgn: string
  ) => {
    const existing = getJobByGameId(gameId);
    if (existing?.status === "completed") return;

    const storeState = useBackgroundAnalysisStore.getState();
    const existingInterval = storeState.pollingIntervals.get(String(gameId));
    if (existingInterval) clearInterval(existingInterval);

    forceStopPolling(gameId);
    if (!startPolling(gameId)) return;

    const gameSize = (gamePgn.match(/\d+\./g) || []).length;
    const isSmall = gameSize <= 15;
    const pollInterval = isSmall ? 2000 : 3000;
    const maxAttempts = isSmall ? 30 : 100;

    let attempts = 0;
    let active = true;
    let lastTime = 0;
    const minInterval = 2000;

    const poll = setInterval(async () => {
      if (!active) {
        clearInterval(poll);
        return;
      }

      const store = useBackgroundAnalysisStore.getState();
      if (!store.activePollingJobs.has(String(gameId))) {
        active = false;
        clearInterval(poll);
        return;
      }

      const current = getJobByGameId(gameId);
      if (current?.status === "completed") {
        active = false;
        clearInterval(poll);
        forceStopPolling(gameId);
        return;
      }

      const now = Date.now();
      if (now - lastTime < minInterval) return;
      lastTime = now;

      attempts++;
      if (attempts > maxAttempts) {
        active = false;
        clearInterval(poll);
        forceStopPolling(gameId);
        updateJob(gameId, { status: "failed", error: "Polling timeout" });
        toast.error("Analysis polling timed out. Please try again.");
        return;
      }

      try {
        const { default: axios } = await import("axios");
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
        const response = await axios.get(`${baseUrl}${statusUrl}`, {
          headers: { Authorization: `Bearer ${sessionId}` },
        });
        const d = response.data.data;

        if (["processing", "pending"].includes(d.status)) {
          updateJob(gameId, { status: "processing", progress: d.progress || 0 });
        } else if (["completed", "ready"].includes(d.status)) {
          clearInterval(poll);
          const valid = d.result && d.result.id && d.result.userId && d.result.pgn;
          if (!valid) {
            forceStopPolling(gameId);
            updateJob(gameId, {
              status: "failed",
              error: "Analysis completed but result is incomplete",
            });
            toast.error(
              "Analysis completed but result is incomplete. Please try again."
            );
            return;
          }
          if (isSmall) await new Promise((r) => setTimeout(r, 2000));

          forceStopPolling(gameId);
          updateJob(gameId, {
            status: "completed",
            progress: 100,
            result: d.result || d,
          });
          setPgn(gamePgn);
          setDataGamesImport(game);
          setDataAnalysis(d.result || d);
          toast.success(
            isSmall
              ? "Analysis complete! (Small games process quickly)"
              : "Analysis complete!",
            {
              description: "Click 'View Results' to see your analysis.",
              duration: 5000,
            }
          );
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          active = false;
          clearInterval(poll);
          forceStopPolling(gameId);
          updateJob(gameId, {
            status: "failed",
            error: error.message || "Unknown error",
          });
          toast.error("Analysis failed. Please try again.");
        }
      }
    }, pollInterval);

    useBackgroundAnalysisStore
      .getState()
      .pollingIntervals.set(String(gameId), poll);
  };

  if (!open) return null;

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 1280;
  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = 72;
  const headerHeightLg = 96;

  return (
    <div
      className="fixed bg-black/25 z-50 flex items-center justify-center p-4 md:p-0"
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
        className="w-full mx-auto rounded-lg max-w-sm md:max-w-xl bg-white overflow-y-auto max-h-[95%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Analyze your games</h2>
          <p className="text-sm text-black mt-2">
            Select your Games from Chess.com or upload your previous Game's{" "}
            <span className="font-bold">PGN</span> for a detailed Game Analysis.
          </p>
        </div>
        <div className="p-4">
          {activeTab === "auto" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-row items-center">
                  <Image
                    src="/icons/hero-section.png"
                    alt="chess"
                    width={100}
                    height={100}
                    className="w-3 h-4 relative z-10"
                    priority
                  />
                  <p className="block ml-1 text-base sm:text-sm text-black">
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
                <p className="block text-base sm:text-sm text-black">Select Game</p>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                {depths.map((depth, idx) => {
                  const estimate =
                    idx === 0
                      ? estimateBasic
                      : idx === 1
                      ? estimateStandard
                      : estimateDeep;
                  const time =
                    idx === 0
                      ? timeBasic
                      : idx === 1
                      ? timeStandard
                      : timeDeep;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setEstimateMinute(time.minute);
                        setEstimateSecond(time.second);
                        setDepthChoosed(depth.value);
                      }}
                      disabled={depth.mustMember && !isMember}
                      className={`relative flex flex-col justify-around px-2 py-2 md:h-[300px] gap-2 items-center shadow-md ${
                        depth.mustMember && !isMember
                          ? "bg-[#C0CED4]"
                          : "bg-white"
                      } border ${
                        depthChoosed === depth.value
                          ? "border-[#221AE9]"
                          : isMember
                          ? "border-[#DEDEDE]"
                          : "border-[#99A5A9]"
                      } rounded-md`}
                    >
                      <Image
                        src={depth.image}
                        alt={depth.title}
                        width={1000}
                        height={1000}
                        className="w-[80px] h-[80px] object-contain relative"
                        priority
                      />
                      {depth.mustMember && !isMember && (
                        <Image
                          src="/icons/premium-info.png"
                          alt="premium-info"
                          width={1000}
                          height={1000}
                          className="w-[72px] h-[23px] object-cover absolute left-2 top-2"
                          priority
                        />
                      )}
                      <div
                        className={`absolute top-4 right-4 w-4 h-4 rounded-full ${
                          depth.mustMember && !isMember
                            ? "bg-[#99A5A9] border-1 border-[#737C7F]"
                            : depthChoosed === depth.value
                            ? "bg-[#221AE9] shadow-[#3871EC] shadow-md"
                            : "border-gray-300 border-2"
                        }`}
                      />
                      <span className="font-normal text-sm">{depth.title}</span>
                      <span className="font-light text-[#364152] text-center text-[11px]">
                        {depth.description}
                      </span>
                      <div className="flex flex-col gap-1 items-center">
                        <span className="font-medium text-[11px]">
                          Analysis can take up to:
                        </span>
                        <span className="font-medium text-[11px]">{estimate}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <button
            onClick={handleAnalyzeGame}
            disabled={isSubmitting}
            className={`btn-primary w-full text-sm rounded-full py-2 my-4 ${
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 0 5.373 0\
  12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135\
  5.824 3 7.938l3-2.647z"
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