"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import { AnalysisResult, usePgnStore } from "@/app/store/zustandStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Check, Clipboard, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import { useProfileStore } from "@/app/store/profile";
import { useLoadingAPI } from "@/app/store/loadingApi";
import useLocalStorage from "@/hooks/useLocalStorage";

const getDataUsername = process.env.BASE_URL + "/games/get-data/";

interface AnalyzeDifferentGameProps {
  openPopup?: boolean;
}

export function AnalyzeDifferentGame({ openPopup }: AnalyzeDifferentGameProps) {
  const router = useRouter();
  const { proceedAnalysis, pgnToFenList } = useStockfishAnalysis();
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();
  const { isMember, token } = useProfileStore();

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
      value: 10,
      title: "Basic Analysis",
      description:
        "Our AI quickly analyzes your chess game with a low-depth search, providing fast insights without long processing times.",
      mustMember: false,
    },
    {
      image: "/icons/board-medium-analysis.png",
      value: 20,
      title: "Standard Analysis",
      description:
        "Our AI analyzes your chess game with a middle-depth search, offering balanced insights with moderate processing time.",
      mustMember: true,
    },
    {
      image: "/icons/board-large-analysis.png",
      value: 30,
      title: "Deep Analysis",
      description:
        "Our AI analyzes your chess game with a high-depth search, providing deep insights with a longer processing time.",
      mustMember: true,
    },
  ];

  const [username, setUsername] = useState("");
  const [pgnText, setPgnText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [timeBasic, setTimeBasic] = useState<any>({});
  const [timeStandard, setTimeStandard] = useState<any>({});
  const [timeDeep, setTimeDeep] = useState<any>({});
  const [estimateBasic, setEstimateBasic] = useState<string>("");
  const [estimateStandard, setEstimateStandard] = useState<string>("");
  const [estimateDeep, setEstimateDeep] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<any>(null);
  const [fileSize, setFileSize] = useState(0);
  const [depthChoosed, setDepthChoosed] = useState(10);
  const [open, setOpen] = useState(false);
   const { sessionId } = useProfileStore();

  // New states for username validation
  const [usernameStatus, setUsernameStatus] = useState("idle"); // "idle", "loading", "found", "not-found"
  interface GameOption {
    value: string;
    text: string;
    color: string;
    result: string;
    opponent: string;
  }

  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | undefined>(
    undefined
  );
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
      getByUsername();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const getByUsername = async () => {
    const url = getDataUsername + username;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: `Bearer ${sessionId}`,
      },
    });
    if (response.status == 200) {
      setUsernameStatus("found");
      setAvailableGames(response.data.data);
      setSelectedGame(response.data.data[0].value);
      setDepthChoosed(0);
    } else {
      setUsernameStatus("idle");
      setAvailableGames([]);
      setSelectedGame(undefined);
    }
    console.log("response", url, response);
  };

  const handleDrag = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    type: string;
  }) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("PGN file:", file);

      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const pgnText = e.target.result;
        setPgnText(pgnText);
        console.log("PGN loaded:", pgnText);
      };
      reader.readAsText(file);

      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: { name: string; size: number }) => {
    // Check file type (simple check for .pgn extension)
    if (!file.name.toLowerCase().endsWith(".pgn")) {
      alert("Please upload a PGN file.");
      return;
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    setFile(file);
    setFileName(file.name);
    setFileSize(file.size);
  };

  const handleButtonClick = () => {
    if (!fileName && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // Handle import logic
      setIsSubmitted(true);
    }
  };

  const handleAnalyzeGame = async () => {
    console.log("Analyzing game with the following data:");
    if (token.balance >= 1) {
      if (selectedGame) {
        console.log("Selected game:", selectedGame);
        setDataGamesImport(availableGames[0]?.data_games);
        processAnalyze(selectedGame);
        setPgn(selectedGame);
      } else if (pgnText) {
        console.log("PGN text provided", pgnText);
        processAnalyze(pgnText);
        setPgn(pgnText);
        setDataGamesImport(null);
      }
    } else {
      setOpenPricing(true);
      setTabType("tokens");
    }
    // else if (fileName) {
    //   console.log("File uploaded:", file);
    //   setDataGamesImport(null);
    //   processAnalyze(file);
    // }
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

      // Close the dialog
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
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }, 2000);
    }
  };
  const handleGameSelect = (value: string) => {
    setSelectedGame(value);
    setDepthChoosed(0);
  };
  useEffect(() => {
    let pgn = selectedGame && pgnToFenList(selectedGame);
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
  }, [selectedGame]);
  const formatTimeToMinutesSeconds = (seconds: number): string => {
    // Calculate minutes and remaining seconds
    let second = Math.round(seconds / 5) * 5;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(second % 60);
    // Format as "xx minutes xx seconds"
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
        <button className="w-fill px-5 py-2 btn-primary rounded-full">
          Analyze a different game
        </button>
      </DialogTrigger>
      {/* <DialogContent className="rounded-lg max-w-sm md:max-w-xl overflow-y-auto max-h-[95%]"> */}
      <DialogContent className="rounded-lg max-w-sm md:max-w-xl overflow-y-auto max-h-[95%]">
        <DialogHeader className="gap-2 mb-2">
          <DialogTitle>Analyze your games</DialogTitle>
          <DialogDescription className="text-black">
            Select your Games from Chess.com or upload your previous Game's{" "}
            <span className="font-bold">PGN </span>
            for a detailed Game Analysis.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="overflow-auto md:max-w-[640px] max-h-[480px] md:max-h-screen ">
          <Tabs defaultValue="auto" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#DEDEDE] p-1">
              <TabsTrigger value="auto">
                <span className="text-xs">From Chess.com</span>
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Clipboard className="mr-2 h-4 w-4" />
                <span className="text-xs">Paste or Upload PGN</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="auto" className="space-y-4">
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
                <div className="flex flex-row items-center w-full p-3 bg-[#2E507708] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    placeholder="Enter your Chess.com Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent h-[24px] focus:outline-none"
                  />
                  <div className="flex items-center">
                    {usernameStatus === "loading" && (
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    )}
                    {usernameStatus === "found" && (
                      <div className="flex items-center text-green-500 whitespace-nowrap">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Username found</span>
                      </div>
                    )}
                    {usernameStatus === "not-found" && (
                      <div className="flex items-center text-red-500 whitespace-nowrap">
                        <X className="h-4 w-4 mr-1" />
                        <span className="text-xs">Username not found</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 mx-1">
                <p className="block text-base sm:text-sm text-black">
                  Select Game
                </p>
                <Select
                  name="game"
                  disabled={usernameStatus !== "found"}
                  value={selectedGame}
                  onValueChange={handleGameSelect}
                >
                  <SelectTrigger
                    className={`w-full ${
                      usernameStatus !== "found"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select your game" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGames.map((game, index) => (
                      <SelectItem key={index} value={game.value}>
                        {game.text} ({game.result})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-3 items-center">
                {depths.map((depth, index) => {
                  let estimate =
                    index == 0
                      ? estimateBasic
                      : index == 1
                      ? estimateStandard
                      : estimateDeep;

                  let time =
                    index == 0
                      ? timeBasic
                      : index == 1
                      ? timeStandard
                      : timeDeep;
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
                            : `border-input border-2`
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
                          {/* <span className="font-medium text-[11px] text-[#221AE9] border border-[#221AE9] rounded-[4px] p-[4px]"> */}
                          {estimate}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-6">
                <div className="mt-5 border-2 border-input rounded-lg bg-gray-50 p-2">
                  <textarea
                    className="w-full h-40 lg:h-48 bg-[#f8f9fc] p-2 resize-none outline-none text-gray-700 placeholder-gray-400"
                    placeholder="Paste your PGN here..."
                    value={pgnText}
                    onChange={(e) => setPgnText(e.target.value)}
                  />
                </div>
                <span className="flex items-center justify-center text-black text-xs text-center font-bold">
                  Or upload a .PGN file below:
                </span>
                <div
                  className={`mt-5 border-2 border-dashed ${
                    dragActive
                      ? "border-[#3871EC] bg--blue-100"
                      : "border-[#3871EC] bg-blue-50"
                  } rounded-lg p-8 flex flex-col items-center justify-center`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pgn"
                    onChange={handleFileInput}
                  />

                  {fileName ? (
                    <div className="text-center lg:h-48 flex flex-col items-center justify-center">
                      <UploadCloud className="h-16 w-16 mx-auto text-blue-600 mb-2" />
                      <p className="text-gray-800 font-medium mb-1">
                        {fileName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {(fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center lg:h-48 flex flex-col items-center justify-center">
                      <UploadCloud className="h-10 w-10 mx-auto text-blue-600 mb-2" />
                      <p className="block text-sm text-black-700 mb-1">
                        Drag & drop or click to
                        <span
                          className="underline text-blue-600 font-bold cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {" "}
                          select
                        </span>{" "}
                        a file
                      </p>
                      <p className="block text-[10px] text-black-700 mb-1">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <button
              onClick={handleAnalyzeGame}
              className={`btn-primary w-full text-sm rounded-full py-2 my-4 ${
                (usernameStatus !== "found" &&
                  !selectedGame &&
                  !pgnText &&
                  !fileName) ||
                depthChoosed == 0
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                (usernameStatus !== "found" &&
                  !selectedGame &&
                  !pgnText &&
                  !fileName) ||
                depthChoosed == 0
              }
            >
              Analyze Game
            </button>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
