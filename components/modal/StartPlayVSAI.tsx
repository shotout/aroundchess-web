"use client";

import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { useApiClient } from "@/functions/api-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import DotSpinner from "../game-history/Spinner";

export interface StartPlayVSAIProps {
  visible: boolean;
  onClose: () => void;
  onLimit?: (isLimit: boolean) => void;
}

export function StartPlayVSAI({
  visible,
  onClose,
  onLimit,
}: StartPlayVSAIProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  if (!visible) return null;

  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = window.innerWidth >= 1024 ? 96 : 72;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        paddingLeft: isDesktop ? sidebarWidth + 16 : 16,
        paddingTop: headerHeight + 16,
        paddingBottom: 16,
        paddingRight: 16,
      }}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-7xl mx-auto z-10 h-full flex flex-col">
        <div className="relative bg-white rounded-2xl shadow-xl flex-1 min-h-0 flex flex-col overflow-hidden">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative z-10 p-4 overflow-y-auto flex-1 min-h-0">
            <StartPlayVSAIContent onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const StartPlayVSAIContent: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { AIChoosed, setAIChoosed } = usePlayVSAIStore();
  const { getVSAILogs, isLoading } = useApiClient();
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState<string>("white");
  const [selectedOpponent, setSelectedOpponent] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("beginner");

  const difficulties = [
    {
      icon: "/images/play-vs-ai/beginner.png",
      iconActive: "/images/play-vs-ai/beginner-active.png",
      label: "Beginner",
      range: "250 - 850 ELO",
      key: "beginner",
    },
    {
      icon: "/images/play-vs-ai/intermediate.png",
      iconActive: "/images/play-vs-ai/intermediate-active.png",
      label: "Intermediate",
      range: "900 - 1400 ELO",
      key: "intermediate",
    },
    {
      icon: "/images/play-vs-ai/advanced.png",
      iconActive: "/images/play-vs-ai/advanced-active.png",
      label: "Advanced",
      range: "1500 - 2100 ELO",
      key: "advanced",
    },
    {
      icon: "/images/play-vs-ai/master.png",
      iconActive: "/images/play-vs-ai/master-active.png",
      label: "Master",
      range: "2200 - 2450 ELO",
      key: "master",
    },
  ];

  const opponents = [
    {
      id: 0,
      name: "Thomas",
      elo: 250,
      img: "/images/play-vs-ai/thomas.png",
    },
    { id: 1, name: "Sofia", elo: 250, img: "/images/play-vs-ai/sofia.png" },
    { id: 2, name: "Pierre", elo: 400, img: "/images/play-vs-ai/pierre.png" },
    { id: 30, name: "Lieke", elo: 400, img: "/images/play-vs-ai/lieke.png" },
    { id: 3, name: "Ana", elo: 400, img: "/images/play-vs-ai/ana.png" },
    { id: 4, name: "Carlos", elo: 500, img: "/images/play-vs-ai/carlos.png" },
    { id: 5, name: "Lana", elo: 500, img: "/images/play-vs-ai/lana.png" },
    { id: 6, name: "Dimitri", elo: 500, img: "/images/play-vs-ai/dimitri.png" },
    { id: 7, name: "Marco", elo: 600, img: "/images/play-vs-ai/marco.png" },
    { id: 8, name: "Marie", elo: 600, img: "/images/play-vs-ai/marie.png" },
    { id: 9, name: "Elena", elo: 600, img: "/images/play-vs-ai/elena.png" },
    { id: 10, name: "Viktor", elo: 700, img: "/images/play-vs-ai/viktor.png" },
    { id: 11, name: "Delia", elo: 700, img: "/images/play-vs-ai/delia.png" },
    { id: 12, name: "Hans", elo: 700, img: "/images/play-vs-ai/hans.png" },
    { id: 13, name: "Igor", elo: 800, img: "/images/play-vs-ai/igor.png" },
    { id: 14, name: "Amel", elo: 800, img: "/images/play-vs-ai/amel.png" },
    { id: 15, name: "Lisa", elo: 800, img: "/images/play-vs-ai/lisa.png" },
    {
      id: 16,
      name: "Andreas",
      elo: 850,
      img: "/images/play-vs-ai/andreas.png",
    },
    { id: 17, name: "Astrid", elo: 850, img: "/images/play-vs-ai/astrid.png" },
    { id: 18, name: "Ingrid", elo: 850, img: "/images/play-vs-ai/ingrid.png" },
  ];

  const handlePlayNow = () => {
    const index = opponents.findIndex((o) => o.id == selectedOpponent);
    const ELO =
      opponents[index].elo +
      difficulties.findIndex((d) => d.key == difficulty) * 650;
    const opponentData = opponents[index];
    opponentData.elo = ELO;
    const body = {
      color: selectedColor,
      difficulty: difficulty,
      opponent: opponentData,
    };
    console.log("body", body);
    setAIChoosed(body);
    router.push("/playground/play-vs-ai/playing");
    onClose();
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Choose Your Color
        </h1>
        <p className="text-gray-600">
          Select which color you want to play as. The computer will play as the
          opposite color.
        </p>
      </div>

      {/* Color Selection */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            color: "white",
            icon: "/images/play-vs-ai/white-king.png",
            label: "White",
          },
          {
            color: "black",
            icon: "/images/play-vs-ai/black-king.png",
            label: "Black",
          },
        ].map(({ color, icon, label }) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`relative p-3 border-2 rounded-xl transition-all hover:shadow-md ${
              selectedColor === color
                ? "border-blue-base "
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <Image
                  src={icon}
                  alt={color}
                  width={80}
                  height={80}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-medium text-gray-900">
                  {label}
                </span>
              </div>
            </div>
            {selectedColor === color && (
              <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-blue-base"></div>
            )}
          </button>
        ))}
      </div>
      <div className="w-full h-0.5 bg-gray-200 mt-1 rounded-full"></div>

      {/* Opponent Selection */}
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Choose your Opponent
        </h2>

        {/* Difficulty Selection */}
        <div className="md:grid md:grid-cols-4 md:gap-3 hidden">
          {difficulties.map((diff) => (
            <button
              key={diff.key}
              onClick={() => setDifficulty(diff.key)}
              className={`p-2 rounded-lg border transition-all text-center ${
                difficulty === diff.key
                  ? "shadow-lg text-blue-base"
                  : "bg-white border-none  text-gray-700"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-4 flex items-center justify-center">
                    <Image
                      src={
                        difficulty === diff.key ? diff.iconActive : diff.icon
                      }
                      alt={diff.label}
                      width={24}
                      height={16}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      difficulty === diff.key
                        ? "text-blue-700"
                        : "text-gray-900"
                    }`}
                  >
                    {diff.label}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{diff.range}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Difficulty Selection - Horizontal Scroll */}
        <div className="md:hidden">
          <div
            className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {difficulties.map((diff) => (
              <button
                key={diff.key}
                onClick={() => setDifficulty(diff.key)}
                className={`flex-shrink-0 p-1 rounded-sm border transition-all text-center min-w-[140px] ${
                  difficulty === diff.key
                    ? "shadow-lg text-blue-base"
                    : "bg-white border-none  text-gray-700"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-4 flex items-center justify-center">
                      <Image
                        src={
                          difficulty === diff.key ? diff.iconActive : diff.icon
                        }
                        alt={diff.label}
                        width={24}
                        height={16}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        difficulty === diff.key
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      {diff.label}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{diff.range}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Opponents Grid */}
        <div className="border border-gray-200 rounded-xl p-4">
          <div
            className="grid gap-3 max-h-80 overflow-y-auto justify-center"
            style={{ gridTemplateColumns: "repeat(auto-fit, 120px)" }}
          >
            {opponents.map((opponent) => {
              const ELO =
                opponent.elo +
                difficulties.findIndex((d) => d.key == difficulty) * 650;
              return (
                <button
                  key={opponent.id}
                  onClick={() => setSelectedOpponent(opponent.id)}
                  className={`p-1 rounded-lg border transition-all w-24 ${
                    selectedOpponent === opponent.id
                      ? "border-blue-base bg-blue-base/5 text-blue-base"
                      : "border-transparent hover:border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Image
                        src={opponent.img}
                        alt={opponent.name}
                        width={48}
                        height={48}
                        className="max-w-full max-h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xs font-medium ${
                          selectedOpponent === opponent.id
                            ? "text-blue-base"
                            : "text-gray-900"
                        }`}
                      >
                        {opponent.name}
                      </div>
                      <div className="text-xs text-gray-500">ELO {ELO}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="pt-4">
        {isLoading ? (
          <div className="flex justify-center">
            <DotSpinner />
          </div>
        ) : (
          <button
            onClick={handlePlayNow}
            className="w-full py-3 btn-primary text-white font-semibold rounded-full transition-colors"
          >
            Play Now
          </button>
        )}
      </div>
    </div>
  );
};
