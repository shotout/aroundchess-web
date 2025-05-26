"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import { usePgnStore } from "@/app/store/zustandStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import { useProfileStore } from "@/app/store/profile";
import { useLoadingAPI } from "@/app/store/loadingApi";
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
  const { proceedAnalysis, pgnToFenList } = useStockfishAnalysis();
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();
  const { isMember, token } = useProfileStore();
  const { setEstimateMinute, setEstimateSecond } = useLoadingAPI();

  const {
    username,
    setPgn,
    setIsLoading,
    setError,
    setDataAnalysis,
    setDataGamesImport,
  } = usePgnStore();

  const depths = [
    {
      image: "/icons/board-small-analysis.png",
      value: 14,
      title: "Basic Analysis",
      description:
        "Our AI quickly analyzes your chess game with a low-depth search, providing fast insights without long processing times.",
      mustMember: false,
    },
    {
      image: "/icons/board-medium-analysis.png",
      value: 17,
      title: "Standard Analysis",
      description:
        "Our AI analyzes your chess game with a middle-depth search, offering balanced insights with moderate processing time.",
      mustMember: true,
    },
    {
      image: "/icons/board-large-analysis.png",
      value: 20,
      title: "Deep Analysis",
      description:
        "Our AI analyzes your chess game with a high-depth search, providing deep insights with a longer processing time.",
      mustMember: true,
    },
  ];

  const [activeTab, setActiveTab] = useState("auto");
  const [pgnText, setPgnText] = useState("");
  const [depthChoosed, setDepthChoosed] = useState(10);

  const [estimateBasic, setEstimateBasic] = useState<string>("");
  const [estimateStandard, setEstimateStandard] = useState<string>("");
  const [estimateDeep, setEstimateDeep] = useState<string>("");
  const [timeBasic, setTimeBasic] = useState<any>({});
  const [timeStandard, setTimeStandard] = useState<any>({});
  const [timeDeep, setTimeDeep] = useState<any>({});

  useEffect(() => {
    const pgn = pgnToFenList(game.pgn);
    const durations = [5, 23, 51];

    const estimates = durations.map((duration) => {
      const total = pgn ? pgn.length * duration : 0;
      return {
        estimate: formatTimeToMinutesSeconds(total),
        time: getTime(total),
      };
    });

    setEstimateBasic(estimates[0].estimate);
    setEstimateStandard(estimates[1].estimate);
    setEstimateDeep(estimates[2].estimate);

    setTimeBasic(estimates[0].time);
    setTimeStandard(estimates[1].time);
    setTimeDeep(estimates[2].time);
  }, [game.pgn, pgnToFenList]);

  const formatTimeToMinutesSeconds = (seconds: number): string => {
    const rounded = Math.round(seconds / 5) * 5;
    const minutes = Math.floor(rounded / 60);
    const remainingSeconds = rounded % 60;
    return minutes > 0
      ? `${minutes} minute${
          minutes !== 1 ? "s" : ""
        } ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
      : `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
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

    setPgn(gameToAnalyze);
    setDataGamesImport(game.pgn);
    setIsLoading(true);
    setDataAnalysis(null);

    try {
      const res = await proceedAnalysis(gameToAnalyze, "", depthChoosed, 60000);
      setDataAnalysis(res.data);
      onOpenChange(false);
      router.push("/analysis");
    } catch (err) {
      toast.error(String(err));
      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1280;
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
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Analyze your games</h2>
          <p className="text-sm text-black mt-2">
            Select your Games from Chess.com or upload your previous Game's{" "}
            <span className="font-bold">PGN </span>
            for a detailed Game Analysis.
          </p>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Tab Content */}
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
                  disabled={true}
                  id="username"
                  name="defaultUsername"
                  type="text"
                  placeholder="Type here..."
                  className={`w-full shadow-sm min-h-[44px] bg-[#C0CED4] border border-[#737c7f] px-[16px] py-[12px]`}
                  value={username}
                />
              </div>

              <div className="space-y-2">
                <p className="block text-base sm:text-sm text-black">
                  Select Game
                </p>
                <div className="relative">
                  <select
                    disabled
                    value={""}
                    className={`w-full shadow-sm min-h-[44px] bg-[#C0CED4] border border-[#737c7f] px-[16px] py-[12px] rounded-md appearance-none `}
                  >
                    <option>
                      {game.date} {username} vs {game.opponent}
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3  gap-3 items-center">
                {depths.map((depth, index) => {
                  const estimate =
                    index == 0
                      ? estimateBasic
                      : index == 1
                      ? estimateStandard
                      : estimateDeep;

                  const time =
                    index == 0
                      ? timeBasic
                      : index == 1
                      ? timeStandard
                      : timeDeep;

                  console.log("d", estimate);

                  return (
                    <button
                      onClick={() => {
                        setEstimateMinute(time.minute);
                        setEstimateSecond(time.second);
                        setDepthChoosed(depth.value);
                      }}
                      key={index}
                      disabled={depth.mustMember && !isMember}
                      className={`relative flex flex-col justify-around px-2 py-2 md:h-[300px] gap-2 items-center shadow-md  ${
                        depth.mustMember && !isMember
                          ? `bg-[#C0CED4]`
                          : `bg-white`
                      } border ${
                        depthChoosed == depth.value
                          ? `border-[#221AE9]`
                          : isMember
                          ? `border-[#DEDEDE]`
                          : `border-[#99A5A9]`
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
                          src={`/icons/premium-info.png`}
                          alt={"premium-info"}
                          width={1000}
                          height={1000}
                          className="w-[72px] h-[23px] object-cover absolute left-2 top-2"
                          priority
                        />
                      )}
                      <div
                        className={`absolute top-4 right-4 w-4 h-4 rounded-full ${
                          depth.mustMember && !isMember
                            ? `bg-[#99A5A9] border-1 border-[#737C7F]`
                            : depthChoosed == depth.value
                            ? `bg-[#221AE9] shadow-[#3871EC] shadow-md`
                            : `border-gray-300 border-2`
                        } `}
                      />
                      <span className="font-normal text-sm">{depth.title}</span>
                      <span className="font-light text-[#364152] text-center text-[11px]">
                        {depth.description}
                      </span>
                      <div className="flex flex-col gap-1 items-center">
                        <span className="font-medium text-[11px]">
                          Analysis can take up to:
                        </span>
                        <span className="font-medium text-[11px]  ">
                          {estimate}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyzeGame}
            className={`btn-primary w-full text-sm rounded-full py-2 my-4 `}
          >
            Analyze Game
          </button>
        </div>
      </div>
    </div>
  );
}
