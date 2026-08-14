"use client";

import { useLoadingAPI } from "@/app/store/loadingApi";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { AnalysisResult, usePgnStore } from "@/app/store/zustandStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import axios from "axios";
import { BarChart2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const getDataUsername = process.env.BASE_URL + "/games/get-data/";

interface ChooseDepthAnalyzeProps {
  openPopup?: boolean;
  label?: string;
  style?: string;
  pgnParam: string;
}

export function ChooseDepthAnalyze({
  openPopup,
  label,
  style,
  pgnParam,
}: ChooseDepthAnalyzeProps) {
  const router = useRouter();
  const { proceedAnalysis, pgnToFenList } = useStockfishAnalysis();
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();
  const { isMember, isMemberMonthly, token } = useProfileStore();

  const {
    estimateMinute,
    estimateSecond,
    setEstimateMinute,
    setEstimateSecond,
  } = useLoadingAPI();
  const {
    setPgn,
    setIsLoading,
    setError,
    setDataAnalysis,
    setDataGamesImport,
  } = usePgnStore();
  const depths = [
    {
      image: "/icons/board-small-analysis.png",
      value: 12,
      title: "Basic Analysis",
      description:
        "Our AI quickly analyzes your chess game with a low-depth search, providing fast insights without long processing times.",
      mustMember: false,
    },
    {
      image: "/icons/board-medium-analysis.png",
      value: 16,
      title: "Standard Analysis",
      description:
        "Our AI analyzes your chess game with a middle-depth search, offering balanced insights with moderate processing time.",
      mustMember: true,
    },
    {
      image: "/icons/board-large-analysis.png",
      value: 18,
      title: "Deep Analysis",
      description:
        "Our AI analyzes your chess game with a high-depth search, providing deep insights with a longer processing time.",
      mustMember: true,
    },
  ];

  const [username, setUsername] = useState("");
  const [pgnText, setPgnText] = useState<string>("");
  const [timeBasic, setTimeBasic] = useState<any>({});
  const [timeStandard, setTimeStandard] = useState<any>({});
  const [timeDeep, setTimeDeep] = useState<any>({});
  const [estimateBasic, setEstimateBasic] = useState<string>("");
  const [estimateStandard, setEstimateStandard] = useState<string>("");
  const [estimateDeep, setEstimateDeep] = useState<string>("");
  const [depthChoosed, setDepthChoosed] = useState(0);
  const [open, setOpen] = useState(false);
  const { sessionId } = useProfileStore();

  const [usernameStatus, setUsernameStatus] = useState("idle");

  const [debouncedQuery, setDebouncedQuery] = useState(username);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(username), 500);
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    if (openPopup != null && open != true) {
      setOpen(openPopup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPopup]);

  useEffect(() => {
    if (debouncedQuery) {
      setUsernameStatus("loading");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleAnalyzeGame = async () => {
    console.log("Analyzing game with the following data:");
    if (token.balance >= 1) {
      if (pgnText) {
        console.log("PGN text provided", pgnText);
        processAnalyze(pgnText);
        setPgn(pgnText);
        setDataGamesImport(null);
      }
    } else {
      setOpenPricing(true);
      setTabType("tokens");
    }
  };
  const processAnalyze = async (pgn: string | any) => {
    let arr: AnalysisResult | null = null;
    try {
      setIsLoading(true);
      setDataAnalysis(arr);

      const responseAnalysis = await proceedAnalysis(
        pgn,
        username,
        depthChoosed,
        60000
      );
      setDataAnalysis(responseAnalysis.data);

      setOpen(false);

      console.log("responseAnalysis:", responseAnalysis);
      console.log("Analysis depth:", depthChoosed || "Not selected");
      arr = responseAnalysis.data;
    } catch (err) {
      console.log("error", err);
      toast.error(err + "");
      setIsLoading(false);

      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      setTimeout(() => {
        if (arr != null) {
          router.push("/analysis");
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }, 2000);
    }
  };
  useEffect(() => {
    setPgnText(pgnParam);
    let pgn = pgnParam && pgnToFenList(pgnParam);
    let basic = 5;
    let standard = 23;
    let deep = 51;

    let basicResult = pgn && pgn?.length * basic;
    let standardResult = pgn && pgn?.length * standard;
    let deepResult = pgn && pgn?.length * deep;

    let basicString = formatTimeToMinutesSeconds(basicResult || 0);
    let standardString = formatTimeToMinutesSeconds(standardResult || 0);
    let deepString = formatTimeToMinutesSeconds(deepResult || 0);

    console.log("pgn?.length", pgn?.length);
    console.log("basic", basicString);
    console.log("standard", standardString);
    console.log("deep", deepString);

    setTimeBasic(getTime(basicResult || 0));
    setTimeStandard(getTime(standardResult || 0));
    setTimeDeep(getTime(deepResult || 0));

    setEstimateBasic(basicString);
    setEstimateStandard(standardString);
    setEstimateDeep(deepString);
    let basicTime = getTime(basicResult || 0);
    setEstimateMinute(basicTime.minute);
    setEstimateSecond(basicTime.second);
  }, [pgnParam]);
  const formatTimeToMinutesSeconds = (seconds: number): string => {
    let second = Math.round(seconds / 5) * 5;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(second % 60);
    if (minutes > 0) {
      return `${minutes} minute${
        minutes !== 1 ? "s" : ""
      } ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
    } else {
      return `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
    }
  };
  const getTime = (seconds: number): any => {
    let s = Math.round(seconds / 5) * 5;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(s % 60);
    let time = { minute: minutes, second: remainingSeconds };
    return time;
  };
  const renderDepthChoose = () => {
    return (
      <div className="gap-2">
        <span className="text-[18px] font-medium text-[#121212]">
          Choose your Analysis Depth
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-3 items-center mt-2">
          {depths.map((depth, index) => {
            let estimate =
              index == 0
                ? estimateBasic
                : index == 1
                ? estimateStandard
                : estimateDeep;

            let time =
              index == 0 ? timeBasic : index == 1 ? timeStandard : timeDeep;
            return (
              <button
                onClick={() => {
                  setEstimateMinute(time.minute);
                  setEstimateSecond(time.second);
                  setDepthChoosed(depth.value);
                }}
                key={index}
                disabled={depth.mustMember && (!isMember&&!isMemberMonthly)}
                className={`relative flex flex-col justify-around px-2 py-2 md:h-[280px] gap-2 items-center shadow-md  ${
                  depth.mustMember && (!isMember&&!isMemberMonthly) ? `bg-[#C0CED4]` : `bg-white`
                } border ${
                  depthChoosed == depth.value
                    ? `border-[#221AE9]`
                    : isMember || isMemberMonthly
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
                {depth.mustMember && (!isMember&&!isMemberMonthly) && (
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
                    depth.mustMember && (!isMember&&!isMemberMonthly)
                      ? `bg-[#99A5A9] border-1 border-[#737C7F]`
                      : depthChoosed == depth.value
                      ? `bg-[#221AE9] shadow-[#3871EC] shadow-md`
                      : `border-input border-2`
                  } `}
                />
                <span className="font-normal text-[14px]">{depth.title}</span>
                <span className="font-light text-[#364152] text-center text-[11px]">
                  {depth.description}
                </span>
                <div className="flex flex-col gap-1 items-center">
                  <span className="font-medium text-[14px] --10px">
                    Analysis can take up to:
                  </span>
                  <span className="font-medium text-[14px] --10px  ">
                    {estimate}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!open) {
          setOpen(true);
          setOpen(true);
        } else {
          setOpen(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          className={`w-fill px-5 py-2 btn-primary rounded-full ${style}`}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <BarChart2 color="white" className="w-[20px] h-[20px]" size={20} />
            <span>Analyze Game</span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-sm md:max-w-xl overflow-y-auto max-h-[95%]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle className="text-[24px] font-semibold">
            Analyze your games
          </DialogTitle>
          <DialogDescription className="text-black text-[18px]">
            Select depth Game's <span className="font-bold">PGN </span>
            for a detailed Game Analysis.
          </DialogDescription>
        </DialogHeader>

        {renderDepthChoose()}
        <button
          onClick={handleAnalyzeGame}
          className={`btn-primary w-full text-[14px] --sm rounded-full py-2 my-4 ${
            depthChoosed == 0 ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={depthChoosed == 0}
        >
          Analyze Game
        </button>
      </DialogContent>
    </Dialog>
  );
}
