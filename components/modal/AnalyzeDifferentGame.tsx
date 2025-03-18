"use client";

import { useRef, useState, useEffect, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, UploadCloud, Check, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { usePgnStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const getDataUsername = process.env.BASE_URL + "/games/get-data/";
const AnalysisUrl = process.env.BASE_URL! + "/analyze";
const mockData = {
  success: true,
  message: "Game options retrieved successfully",
  data: [
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.09 newbiepisan vs hharo70",
      color: "White",
      result: "1-0",
      opponent: "hharo70",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.12 newbiepisan vs timmytim3",
      color: "White",
      result: "1-0",
      opponent: "timmytim3",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.12 honvan04 vs newbiepisan",
      color: "Black",
      result: "0-1",
      opponent: "honvan04",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.12 newbiepisan vs jayjays66",
      color: "White",
      result: "1-0",
      opponent: "jayjays66",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.13 sertkaya500 vs newbiepisan",
      color: "Black",
      result: "0-1",
      opponent: "sertkaya500",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.13 1a2ii vs newbiepisan",
      color: "Black",
      result: "1-0",
      opponent: "1a2ii",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.14 newbiepisan vs socrateskaiser",
      color: "White",
      result: "1-0",
      opponent: "socrateskaiser",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.14 newbiepisan vs shuchi4203",
      color: "White",
      result: "1-0",
      opponent: "shuchi4203",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.14 Rodi_00 vs newbiepisan",
      color: "Black",
      result: "1-0",
      opponent: "Rodi_00",
    },
    {
      value: '[Event "Live Chess"]...',
      text: "2024.08.15 tf2011 vs newbiepisan",
      color: "Black",
      result: "1-0",
      opponent: "tf2011",
    },
  ],
};
export function AnalyzeDifferentGame() {
  const router = useRouter();

  const {
    setPgn,
    setIsLoading,
    setError,
    isLoading,
    dataAnalysis,
    setDataAnalysis,
    setDataGames,
    dataGames,
  } = usePgnStore();
  const depths = [
    {
      image: "/icons/board-small-analysis.png",
      value: "basic",
      title: "Basic Analysis",
      description:
        "Our AI quickly analyzes your chess game with a low-depth search, providing fast insights without long processing times.",
    },
    {
      image: "/icons/board-medium-analysis.png",
      value: "standard",
      title: "Standard Analysi",
      description:
        "Our AI analyzes your chess game with a middle-depth search, offering balanced insights with moderate processing time.",
    },
    {
      image: "/icons/board-large-analysis.png",
      value: "deep",
      title: "Deep Analysis",
      description:
        "Our AI analyzes your chess game with a high-depth search, providing deep insights with a longer processing time.",
    },
  ];

  const [username, setUsername] = useState("");
  const [pgnText, setPgnText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [depthChoosed, setDepthChoosed] = useState("");
  const [open, setOpen] = useState(false);

  // New states for username validation
  const [usernameStatus, setUsernameStatus] = useState("idle"); // "idle", "loading", "found", "not-found"
  interface GameOption {
    value: string;
    text: string;
    color: string;
    result: string;
    opponent: string;
  }

  const [availableGames, setAvailableGames] = useState<GameOption[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | undefined>(
    undefined
  );
  const [debouncedQuery, setDebouncedQuery] = useState(username);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(username), 500);
    return () => clearTimeout(timer); // Cleanup
  }, [username]);

  useEffect(() => {
    if (debouncedQuery) {
      setUsernameStatus("loading");
      getByUsername();
    }
  }, [debouncedQuery]);

  const getByUsername = async () => {
    const url = getDataUsername + username;
    const response = await axios.get(url, { headers: {} });
    if (response.status == 200) {
      setUsernameStatus("found");
      setAvailableGames(response.data.data);
      setSelectedGame(response.data.data[0].value);
      setPgn(response.data.data[0].value);
      setDataGames(response.data.data[0].data_games);
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
    if (selectedGame) {
      console.log("Selected game:", selectedGame);
      processAnalyze(selectedGame);
    } else if (pgnText) {
      console.log("PGN text provided");
      processAnalyze(selectedGame);
    } else if (fileName) {
      console.log("File uploaded:", fileName);
    }
  };
  const processAnalyze = async (pgn: string | any) => {
    try {
      setDataAnalysis(null);
      setIsLoading(true);

      const body = { username: username, pgn: pgn, depth: depthChoosed };
      console.log("body", body);
      const responseAnalysis = await axios.post(AnalysisUrl, body, {
        headers: {},
      });
      setDataAnalysis(responseAnalysis.data.data);
      setIsLoading(false);

      console.log("responseAnalysis:", responseAnalysis);
      console.log("Analysis depth:", depthChoosed || "Not selected");

      // Close the dialog
      setOpen(false);
    } catch (err) {
      console.log("error", err);
      toast.error(err + "");
      router.push("/");
      setIsLoading(false)

      setError(err instanceof Error ? err : new Error("Failed to fetch PGN"));
    } finally {
      checkIfSuccess();
    }
  };
  const checkIfSuccess = () => {
    if (dataAnalysis != null) {
      router.push("/analysis");
    } else {
      //show error message
      setIsLoading(false)
      // router.push("/");
    }
  };
  const handleGameSelect = (value: string) => {
    setSelectedGame(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-fill px-5 py-2 btn-primary rounded-full">
          Analyze a different game
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-sm md:max-w-xl">
        <DialogHeader className="gap-2 mb-2">
          <DialogTitle>Analyze your games</DialogTitle>
          <DialogDescription className="text-black">
            Select your Games from Chess.com or upload your previous Game's{" "}
            <span className="font-bold">PGN </span>
            for a detailed Game Analysis.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="overflow-auto md:max-w-lg max-h-[480px] md:max-h-screen ">
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
              <div className="space-y-2 grid grid-cols-1 md:grid-cols-3 md:gap-3 items-center">
                {depths.map((depth, index) => {
                  return (
                    <div
                      onClick={() => setDepthChoosed(depth.value)}
                      key={index}
                      className={`flex flex-col relative px-3 py-3 md:h-[230px] gap-2 items-center shadow-md border ${
                        depthChoosed == depth.value
                          ? `border-[#221AE9]`
                          : `border-input`
                      } rounded-md`}
                    >
                      <Image
                        src={depth.image}
                        alt={depth.title}
                        width={1000}
                        height={1000}
                        className="w-[80px] h-[80px] object-contain relative z-10"
                        priority
                      />
                      <div
                        className={`absolute top-4 right-4 w-4 h-4 rounded-full ${
                          depthChoosed == depth.value
                            ? `bg-[#221AE9] shadow-[#3871EC] shadow-md`
                            : `border-input border-2`
                        } `}
                      />
                      <span className="font-normal text-sm">{depth.title}</span>
                      <span className="font-light text-center text-[11px] px-2">
                        {depth.description}
                      </span>
                    </div>
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
                usernameStatus !== "found" &&
                !selectedGame &&
                !pgnText &&
                !fileName
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                usernameStatus !== "found" &&
                !selectedGame &&
                !pgnText &&
                !fileName
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
