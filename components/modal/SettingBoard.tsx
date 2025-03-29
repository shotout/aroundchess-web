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
import { Clipboard, UploadCloud, Check, X, Edit, Settings } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { usePgnStore } from "@/app/store/zustandStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { proceedAnalysis } from "@/utils/stockfish-utils";
import { Chess } from "chess.js";

export function SettingBoard() {
  const router = useRouter();

  const {
    setPgn,
    setIsLoading,
    setError,
    isLoading,
    dataAnalysis,
    setDataAnalysis,
    setDataGamesImport,
  } = usePgnStore();
  const [open, setOpen] = useState<boolean>(true);
  const [tabSelected, setTabSelected] = useState<string>("2d");
  useEffect(() => {}, []);

  const handleSave = () => {};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Settings color="#2B3036" fill="#2B3036" size={20} />
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-sm md:max-w-xl">
        <DialogHeader className="gap-2 mb-2">
          <DialogTitle>Game Settings</DialogTitle>
          <DialogDescription className="text-black font-normal text-[20px]">
            Customize your game experience and preferences
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="overflow-auto md:max-w-lg max-h-[480px] md:max-h-screen ">
          <div className="w-full flex flex-row items-center justify-center gap-2 bg-[#F9FAFC] border border-[#F4F4F4] rounded-[12px] p-[8px]">
            <Edit className="text-[#221AE9]" size={16} />
            <span className="text-[#221AE9] font-bold text-[14px]">Theme</span>
          </div>
          <Tabs defaultValue="auto" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1">
              <TabsTrigger
                value="2d"
                className={`rounded-[8px] border ${
                  tabSelected == "2d"
                    ? `bg-[#D7E3FB] border-[#221AE9]`
                    : `border-[#D8DCE0]`
                }`}
              >
                <span className={`font-medium text-[18px]`}>2D Style</span>
              </TabsTrigger>
              <TabsTrigger
                value="3d"
                className={`rounded-[8px] border ${
                  tabSelected == "3d"
                    ? `bg-[#D7E3FB] border-[#221AE9]`
                    : `border-[#D8DCE0]`
                }`}
              >
                <Clipboard className="mr-2 h-4 w-4" />
                <span className="text-xs">3D Style</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="auto" className="space-y-4">
              <div className="space-y-2">
                
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-6"></div>
            </TabsContent>
            <button
              onClick={handleSave}
              className={`btn-primary w-full text-sm rounded-full py-2 my-4  `}
            >
              Save
            </button>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
