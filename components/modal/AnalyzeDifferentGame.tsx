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
import {
  Check,
  Clipboard,
  Info,
  Loader,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useStockfishAnalysis } from "@/utils/stockfish-utils";
import { useProfileStore } from "@/app/store/profile";
import { useLoadingAPI } from "@/app/store/loadingApi";
import { gameHistoryApi } from "../game-history/services/api";
import { useTutorial } from "../TutorialProvider";
import { useConfirmLogin } from "@/app/store/confirmLogin";

const getDataUsername = process.env.BASE_URL + "/games/get-data/";

interface AnalyzeDifferentGameProps {
  openPopup?: boolean;
  label?: string;
  style?: string;
}

export function AnalyzeDifferentGame({
  openPopup,
  label,
  style,
}: AnalyzeDifferentGameProps) {
  const router = useRouter();
  const { isTutorialPlay, dataTutorial, stepFocused } = useTutorial();
  const { proceedAnalysis, pgnToFenList } = useStockfishAnalysis();
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();
  const { isMember, token, isMemberMonthly } = useProfileStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    estimateMinute,
    estimateSecond,
    setEstimateMinute,
    setEstimateSecond,
  } = useLoadingAPI();
  const {
    setPgn,
    username: globalUsername,
    setIsLoading,
    setError,
    isOpenTutorial,
    setDataGamesImport,
    setIsFromAnalyzeDifferentGame,
    addOtherImportedGame,
    addImportedGame,
    setActiveUser,
    depth,
    setDepth,
  } = usePgnStore();
  const { startTutorial } = useTutorial();
  const depths = [
    {
      image: "/icons/board-small-analysis.png",
      value: 12,
      title: "Basic Analysis",
      description:
        "Our AI quickly analyzes your chess game with a low-depth search, providing fast insights without long processing times.",
      mustMember: false,
    },
    {
      image: "/icons/board-medium-analysis.png",
      value: 16,
      title: "Standard Analysis",
      description:
        "Our AI analyzes your chess game with a middle-depth search, offering balanced insights with moderate processing time.",
      mustMember: true,
    },
    {
      image: "/icons/board-large-analysis.png",
      value: 18,
      title: "Deep Analysis",
      description:
        "Our AI analyzes your chess game with a high-depth search, providing deep insights with a longer processing time.",
      mustMember: true,
    },
  ];

  const [username, setUsername] = useState(globalUsername || "");
  const [pgnText, setPgnText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [timeBasic, setTimeBasic] = useState<any>({});
  const [timeStandard, setTimeStandard] = useState<any>({});
  const [timeDeep, setTimeDeep] = useState<any>({});
  const [estimateBasic, setEstimateBasic] = useState<string>("");
  const [estimateStandard, setEstimateStandard] = useState<string>("");
  const [estimateDeep, setEstimateDeep] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [depthChoosed, setDepthChoosed] = useState(depth);
  const [open, setOpen] = useState(false);
  const { sessionId } = useProfileStore();
  const [tabSelected, setTabSelected] = useState("auto");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | undefined>(
    undefined
  );
  const [debouncedQuery, setDebouncedQuery] = useState(globalUsername || "");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();

  // Update local username when globalUsername changes
  useEffect(() => {
    if (globalUsername && globalUsername !== username) {
      setUsername(globalUsername);
      setDebouncedQuery(globalUsername);
    }
  }, [globalUsername]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(username), 500);
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    openTutorial();
    if (openPopup != null && open != true) {
      setOpen(openPopup);
    }
  }, [openPopup]);

  useEffect(() => {
    if (debouncedQuery) {
      setUsernameStatus("loading");
      getByUsername();
    }
  }, [debouncedQuery]);

  const openTutorial = () => {
    if (!isOpenTutorial) return;
    startTutorial();
  };

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
      // setSelectedGame(response.data.data[0].value);
      let time = timeBasic;

      setEstimateMinute(time.minute);
      setEstimateSecond(time.second);
      setDepthChoosed(12);
      setDepth(12);
    } else {
      setUsernameStatus("idle");
      setAvailableGames([]);
      setSelectedGame(undefined);
    }
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

      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const pgnText = e.target.result;
        setPgnText(pgnText);
      };
      reader.readAsText(file);

      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: { name: string; size: number }) => {
    if (!file.name.toLowerCase().endsWith(".pgn")) {
      alert("Please upload a PGN file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
  };

  const handleAnalyzeGame = async () => {
    if (token.balance >= 1) {
      if (tabSelected == "auto" && selectedGame) {
        setDataGamesImport(availableGames[0]?.data_games);
        processAnalyze(selectedGame);
        setPgn(selectedGame);
      } else if (pgnText) {
        console.log("Other game process");
        processAnalyzeOtherGame(pgnText);
        setPgn(pgnText);
        setDataGamesImport(null);
      }
    } else {
      setOpenPricing(true);
      setTabType("tokens");
    }
  };
  const processAnalyzeOtherGame = async (pgn: string | any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const currentPgn = pgn;

      console.log("save", currentPgn);
      formData.append("pgn", currentPgn);
      // formData.append("totalMoves", totalMoves.toString());
      const response = await gameHistoryApi.importGame(
        "analysis",
        formData,
        sessionId ?? null
      );
      if (!response?.data) {
        setLoading(false);
        toast.error("Save Failed !", response.data.message);
        throw new Error("Invalid response from server");
      }
      const gameData = { ...response.data, pgn: currentPgn };
      addOtherImportedGame(gameData);
      setActiveUser("other");
      setOpen(false);
      setLoading(false);
      //use handleAnalyzeGame here

      setIsFromAnalyzeDifferentGame(true);
      router.push("/my-game-history");
    } catch (err: any) {
      console.error(err);
    } finally {
    }
  };
  const processAnalyze = async (pgn: string | any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const currentPgn = pgn;

      console.log("save", currentPgn);
      formData.append("pgn", currentPgn);
      // formData.append("totalMoves", totalMoves.toString());
      const response = await gameHistoryApi.importGame(
        "analysis",
        formData,
        sessionId ?? null
      );
      if (!response?.data) {
        setLoading(false);
        toast.error("Save Failed !", response.data.message);
        throw new Error("Invalid response from server");
      }
      const gameData = { ...response.data, pgn: currentPgn };
      addImportedGame(gameData);
      setActiveUser("user");
      setOpen(false);
      setLoading(false);
      //use handleAnalyzeGame here
      setIsFromAnalyzeDifferentGame(true);
      router.push("/my-game-history");
    } catch (err: any) {
      console.error(err);
    } finally {
    }
  };

  const handleGameSelect = (value: string) => {
    setSelectedGame(value);
    setDepthChoosed(12);
    setDepth(12);

    let time = timeBasic;

    setEstimateMinute(time.minute);
    setEstimateSecond(time.second);
  };

  useEffect(() => {
    let selectedPgn = selectedGame && pgnToFenList(selectedGame);
    let textCopyPgn = pgnText && pgnToFenList(pgnText);
    let pgn = tabSelected == "auto" ? selectedPgn : textCopyPgn;
    let basic = 5;
    let standard = 23;
    let deep = 51;

    let basicResult = pgn && pgn?.length * basic;
    let standardResult = pgn && pgn?.length * standard;
    let deepResult = pgn && pgn?.length * deep;

    let basicString = formatTimeToMinutesSeconds(basicResult || 0);
    let standardString = formatTimeToMinutesSeconds(standardResult || 0);
    let deepString = formatTimeToMinutesSeconds(deepResult || 0);

    setTimeBasic(getTime(basicResult || 0));
    setTimeStandard(getTime(standardResult || 0));
    setTimeDeep(getTime(deepResult || 0));

    setEstimateBasic(basicString);
    setEstimateStandard(standardString);
    setEstimateDeep(deepString);
    let basicTime = getTime(basicResult || 0);
    setEstimateMinute(basicTime.minute);
    setEstimateSecond(basicTime.second);
  }, [selectedGame, pgnText]);

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
      <div className="gap-1 md:gap-2">
        <span className="text-[14px] md:text-[18px] font-medium text-[#121212]">
          Choose your Analysis Depth
        </span>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 items-center mt-2"
          data-tutorial="2"
        >
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
                  setDepth(depth.value);
                }}
                key={index}
                disabled={depth.mustMember && !isMember && !isMemberMonthly}
                className={`relative flex flex-col justify-around px-2 py-2 h-[110px] md:h-[240px] gap-1 sm:gap-2 items-center shadow-md  ${
                  depth.mustMember && !isMember ? `bg-[#C0CED4]` : `bg-white`
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
                  className="w-[40px] h-[40px] md:w-[80px] md:h-[80px] object-contain relative"
                  priority
                />
                {depth.mustMember && !isMember && !isMemberMonthly && (
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
                    depth.mustMember && !isMember && !isMemberMonthly
                      ? `bg-[#99A5A9] border-1 border-[#737C7F]`
                      : depthChoosed == depth.value
                      ? `bg-[#221AE9] shadow-[#3871EC] shadow-md`
                      : `border-input border-2`
                  } `}
                />
                <span className="font-normal text-[14px] -- md:text-[14px]">
                  {depth.title}
                </span>
                <span className="font-light text-[#364152] text-center text-[14px] --10px md:text-[11px]">
                  {depth.description}
                </span>
                {/* <div className="flex flex-col gap-1 items-center">
                  <span className="font-medium text-[14px] --10px">
                    Analysis can take up to:
                  </span>
                  <span className="font-medium text-[14px] --10px  ">{estimate}</span>
                </div> */}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // useEffect(() => {
  //   if (stepFocused == 0 || stepFocused == 1) {
  //     scrollToStart();
  //   } else {
  //     scrollToEnd();
  //   }
  // }, [stepFocused]);

  const scrollToStart = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      viewport?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToEnd = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }
  };

  const scrollToPosition = (position: number) => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      viewport?.scrollTo({ top: position, behavior: "smooth" });
    }
  };

  return (
    <>
      <button 
        onClick={() => { 
          if (sessionId) {
            // setOpen(!open);
            router.push("/my-game-history");
          } else {
            setOpenConfirmLogin(true);
          }
        }} 
        className={`w-[280px] px-3 items-center justify-center md:py-2 btn-primary rounded-full ${style}`}>
        {label && label.length > 0 ? label : "Analyze a different game"}
      </button>

      <Dialog
        open={open}
        onOpenChange={() => {
          if (loading) return;
          if (!open) {
            setOpen(true);
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        <DialogContent className="py-1 sm:py-1 rounded-lg max-w-full md:max-w-xl overflow-y-auto flex flex-col max-h-full sm:max-h-[95%]">
          <DialogHeader className="md:gap-2 md:mb-2">
            <DialogTitle className="text-[14px] md:text-[24px] font-semibold text-start">
              Analyze your games
            </DialogTitle>
            <DialogDescription className="text-black text-[14px] -- md:text-[18px] text-start">
              Select your Games from Chess.com or upload your previous Game's{" "}
              <span className="font-bold">PGN </span>
              for a detailed Game Analysis.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea
            ref={scrollAreaRef}
            className="overflow-auto max-h-full md:max-w-[640px] md:max-h-screen"
          >
            <Tabs
              className="w-full"
              value={tabSelected}
              onValueChange={setTabSelected}
            >
              <TabsList className="grid w-full grid-cols-2 bg-[#DEDEDE] p-1">
                <TabsTrigger value="auto">
                  <span className="text-[14px] -- md:text-[14px] --xs">From Chess.com</span>
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <Clipboard className="mr-2 h-4 w-4" />
                  <span className="text-[14px] -- md:text-[14px] --xs">
                    Paste or Upload PGN
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="auto" className="space-y-2 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <div className="hidden md:flex flex-row items-center">
                    <Image
                      src="/icons/hero-section.png"
                      alt="chess"
                      width={100}
                      height={100}
                      className="w-3 h-4 relative z-10"
                      priority
                    />
                    <p className="block ml-1 text-[14px] -- md:text-[14px] --sm text-black">
                      Chess.com Username
                    </p>
                  </div>
                  <div className="flex flex-row items-center w-full p-3 bg-[#2E507708] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <input
                      disabled={true}
                      type="text"
                      id="username"
                      value={isTutorialPlay ? dataTutorial.username : username}
                      placeholder="Enter your Chess.com Username"
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-transparent text-[14px] -- sm:text-[14px] --sm h-[24px] focus:outline-none"
                    />
                    <div className="flex items-center">
                      {!isTutorialPlay && usernameStatus === "loading" && (
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      )}
                      {(isTutorialPlay || usernameStatus === "found") && (
                        <div className="flex items-center text-green-500 whitespace-nowrap">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-[14px] -- md:text-[14px] --xs">
                            Username found
                          </span>
                        </div>
                      )}
                      {usernameStatus === "not-found" && (
                        <div className="flex items-center text-red-500 whitespace-nowrap">
                          <X className="h-4 w-4 mr-1" />
                          <span className="text-[14px] -- md:text-[14px] --xs">
                            Username not found
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mx-1" data-tutorial="1">
                  <p className="hidden md:block text-[14px] -- md:text-[14px] --sm text-black">
                    Select Game
                  </p>
                  {isTutorialPlay ? (
                    <div className={"p-3 rounded-md border border-gray-200"}>
                      <span className="text-[14px] -- md:text-[14px] line-clamp-1">
                        {stepFocused > 1
                          ? dataTutorial.dateSelectedGame +
                            " " +
                            dataTutorial.gameTitle
                          : "Select your Game"}
                      </span>
                    </div>
                  ) : (
                    <Select
                      name="game"
                      disabled={usernameStatus !== "found"}
                      value={selectedGame}
                      onValueChange={handleGameSelect}
                      onOpenChange={setIsSelectOpen}
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
                          <SelectItem
                            key={index}
                            value={game.value}
                            className={
                              index !== availableGames.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }
                          >
                            {game.text} ({game.result})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {renderDepthChoose()}
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-6">
                  <div className="mt-5 border-2 border-input rounded-lg bg-gray-50 p-2">
                    <textarea
                      className="w-full h-[120px] lg:h-[160px] bg-[#f8f9fc] p-2 resize-none outline-none text-gray-700 placeholder-gray-400"
                      placeholder="Paste your PGN here..."
                      value={pgnText}
                      onChange={(e) => setPgnText(e.target.value)}
                    />
                  </div>
                  <span className="flex items-center justify-center text-black text-[14px] --10px md:text-[14px] --xs text-center font-bold">
                    Or upload a .PGN file below:
                  </span>
                  <div
                    className={`mt-4 border-2 border-dashed h-[120px] lg:h-[160px] ${
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
                        <p className="text-gray-500 text-[14px] --10px md:text-[14px] --sm">
                          {(fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center lg:h-48 flex flex-col items-center justify-center">
                        <UploadCloud className="h-10 w-10 mx-auto text-blue-600 mb-2" />
                        <p className="block text-[14px] --10px md:text-[14px] --sm text-black-700 mb-1">
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
                        <p className="block text-[14px] font-normal mb-1">
                          Maximum file size: 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  {renderDepthChoose()}
                </div>
              </TabsContent>
              {/* Show info text only when user is actively selecting games */}
              {tabSelected === "auto" &&
              usernameStatus === "found" &&
              availableGames.length > 0 &&
              isSelectOpen ? (
                <div className="flex items-center gap-2 p-3 bg-blue-base/5 border border-blue-base rounded-md my-4">
                  <div className="flex-shrink-0 w-5 h-5 bg-transparent rounded-full flex items-center justify-center">
                    <Info className="text-blue-base" />
                  </div>
                  <p className="text-[14px] --10px md:text-[14px] --sm text-blue-base">
                    If you want to analyse more, check the My Game History page
                  </p>
                </div>
              ) : (
                <div data-tutorial="3">
                  <button
                    onClick={handleAnalyzeGame}
                    className={`btn-primary flex flex-row justify-center items-center gap-2 w-full text-[14px] -- md:text-[14px] --sm rounded-full py-2 my-4 ${
                      (usernameStatus !== "found" &&
                        !selectedGame &&
                        !pgnText &&
                        !fileName &&
                        depthChoosed == 0) ||
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      (usernameStatus !== "found" &&
                        !selectedGame &&
                        !pgnText &&
                        !fileName) ||
                      depthChoosed == 0 ||
                      loading
                    }
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Analyze Game
                  </button>
                </div>
              )}
            </Tabs>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
