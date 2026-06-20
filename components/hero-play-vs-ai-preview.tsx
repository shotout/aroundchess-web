"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { usePlayVSAIStore } from "@/app/store/playVSAI";

type Opponent = { name: string; elo: number; img: string };

const AVATAR_POOL = [
  "lisa",
  "andreas",
  "pierre",
  "amel",
  "marco",
  "marie",
  "elena",
  "viktor",
  "lana",
  "hans",
  "igor",
  "svetlana",
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const buildTier = (eloStart: number, eloStep: number): Opponent[] =>
  AVATAR_POOL.map((file, i) => ({
    name: capitalize(file),
    elo: eloStart + i * eloStep,
    img: `/play-vs-ai/${file}.png`,
  }));

const opponentsByTab: Record<string, Opponent[]> = {
  recommended: [
    { name: "Lisa", elo: 250, img: "/play-vs-ai/lisa.png" },
    { name: "Andreas", elo: 260, img: "/play-vs-ai/andreas.png" },
    { name: "Pierre", elo: 280, img: "/play-vs-ai/pierre.png" },
    { name: "Amel", elo: 300, img: "/play-vs-ai/amel.png" },
  ],
  beginner: [
    { name: "Marco", elo: 700, img: "/play-vs-ai/marco.png" },
    { name: "Marie", elo: 750, img: "/play-vs-ai/marie.png" },
    { name: "Elena", elo: 800, img: "/play-vs-ai/elena.png" },
    { name: "Viktor", elo: 850, img: "/play-vs-ai/viktor.png" },
    { name: "Lana", elo: 700, img: "/play-vs-ai/lana.png" },
    { name: "Hans", elo: 700, img: "/play-vs-ai/hans.png" },
    { name: "Igor", elo: 800, img: "/play-vs-ai/igor.png" },
    { name: "Amel", elo: 800, img: "/play-vs-ai/amel.png" },
    { name: "Svetlana", elo: 850, img: "/play-vs-ai/svetlana.png" },
  ],
  intermediate: buildTier(900, 40),
  advanced: buildTier(1500, 40),
  master: buildTier(2200, 40),
};

const tabs = [
  { key: "recommended", label: "Recommended", sub: "Based on your ELO" },
  { key: "beginner", label: "Beginner", sub: "250 - 850 ELO" },
  { key: "intermediate", label: "Intermediate", sub: "900 - 1350 ELO" },
  { key: "advanced", label: "Advanced", sub: "1500 - 1950 ELO" },
  { key: "master", label: "Master", sub: "2200 - 2700 ELO" },
];

export function HeroPlayVSAIPreview() {
  const router = useRouter();
  const { setAIChoosed } = usePlayVSAIStore();

  const [selectedColor, setSelectedColor] = useState<"white" | "black">("white");
  const [selectedTab, setSelectedTab] = useState("recommended");
  const [selectedOpponent, setSelectedOpponent] = useState(opponentsByTab.recommended[0]);

  const currentOpponents = opponentsByTab[selectedTab] ?? opponentsByTab.recommended;

  const handlePlayNow = () => {
    setAIChoosed({
      color: selectedColor,
      difficulty: selectedTab,
      opponent: selectedOpponent,
    });
    router.push("/playground/play-vs-ai/playing");
  };

  return (
    <div className="space-y-3">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-center">
        Choose Your Color
      </h2>

      <div className="flex bg-gray-100 rounded-full p-1">
        {(["white", "black"] as const).map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[13px] sm:text-sm font-medium transition-colors ${
              selectedColor === color
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
          >
            <Image
              src={
                color === "white"
                  ? "/images/play-vs-ai/white-king.svg"
                  : "/images/play-vs-ai/black-king.svg"
              }
              alt={color}
              width={16}
              height={16}
              className="w-4 h-4"
            />
            {capitalize(color)}
          </button>
        ))}
      </div>

      <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-center pt-1">
        Choose Your Opponent
      </h2>

      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setSelectedTab(tab.key);
              setSelectedOpponent(opponentsByTab[tab.key][0]);
            }}
            className={`flex-shrink-0 min-w-[110px] px-3 py-2 rounded-lg border text-center transition-colors ${
              selectedTab === tab.key
                ? "border-blue-base text-blue-base"
                : "border-gray-200 text-gray-700"
            }`}
          >
            <div className="text-[12px] sm:text-[13px] font-semibold leading-tight">
              {tab.label}
            </div>
            <div className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">
              {tab.sub}
            </div>
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const i = tabs.findIndex((t) => t.key === selectedTab);
            const next = tabs[(i + 1) % tabs.length];
            setSelectedTab(next.key);
            setSelectedOpponent(opponentsByTab[next.key][0]);
          }}
          aria-label="Next difficulty"
          className="flex-shrink-0 self-center w-6 h-6 rounded-full bg-blue-base text-white flex items-center justify-center"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {selectedTab !== "recommended" && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[12px] sm:text-sm text-gray-500">
            {tabs.find((t) => t.key === selectedTab)?.label}
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 max-h-[220px] overflow-y-auto">
        {currentOpponents.map((opponent) => (
          <button
            key={opponent.name}
            type="button"
            onClick={() => setSelectedOpponent(opponent)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-colors ${
              selectedOpponent.name === opponent.name
                ? "border-blue-base bg-blue-base/5"
                : "border-transparent"
            }`}
          >
            <Image
              src={opponent.img}
              alt={opponent.name}
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
            <div className="text-center">
              <div
                className={`text-[11px] sm:text-[12px] font-medium ${
                  selectedOpponent.name === opponent.name
                    ? "text-blue-base"
                    : "text-gray-900"
                }`}
              >
                {opponent.name}
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-500">
                ELO {opponent.elo}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handlePlayNow}
        className="w-full py-3 btn-primary text-white font-semibold rounded-full flex items-center justify-center gap-1"
      >
        Start Game
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
