"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Wand,
  Settings,
  Search,
  Plus,
  Clipboard,
  FileText,
  Upload,
  UploadCloud,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

export function AnalyzeDifferentGame() {
  const depths = [
    {
      image: "/icons/board-small-analysis.png",
      value: "low",
      title: "Low Analysis",
      description:
        "Our AI quickly analyzes your chess game with a low-depth search, providing fast insights without long processing times.",
    },
    {
      image: "/icons/board-medium-analysis.png",
      value: "middle",
      title: "Middle Analysis",
      description:
        "Our AI analyzes your chess game with a middle-depth search, offering balanced insights with moderate processing time.",
    },
    {
      image: "/icons/board-large-analysis.png",
      value: "high",
      title: "High Analysis",
      description:
        "Our AI analyzes your chess game with a high-depth search, providing deep insights with a longer processing time.",
    },
  ];
  const [username, setUsername] = useState<string>("");
  const [pgnText, setPgnText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [depthChoosed, setDepthChoosed] = useState("");

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
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

  const handleFile = (file: File): void => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-fill px-5 py-2 btn-primary rounded-full">
          Analyze a different game
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-sm md:max-w-xl">
        <DialogHeader className="gap-2 mb-2">
          <DialogTitle>Analyze your games</DialogTitle>
          <DialogDescription className="text-black">
            Select your Games from Chess.com or upload your previous Game’s{" "}
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
                <div className="flex flex-row items-center w-full p-3 rounded-sm border border-gray-300 bg-[#2E507708] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    placeholder="Enter your Chess.com Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent h-[24px]"
                  />
                  <span className="text-xs">{"message"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="block text-base sm:text-sm text-black">
                  Select Game
                </p>
                <Select name="subject">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your game" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {subjectForm.map((item, index) => {
                    return (
                      <SelectItem key={item.value} value={item.label}>
                        {item.label}
                      </SelectItem>
                    );
                  })} */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 grid grid-cols-1 md:grid-cols-3 md:gap-4 items-center">
                {depths.map((depth: any, index: number) => {
                  return (
                    <div
                      onClick={() => setDepthChoosed(depth.value)}
                      key={index}
                      className={`flex flex-col relative px-2 py-2 md:min-h-[210px] gap-2 items-center shadow-md border ${
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
                      <span className="font-light text-center text-[11px]">
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
            <button className="btn-primary w-full text-sm rounded-full py-2 my-4">
              Analyze Game
            </button>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
