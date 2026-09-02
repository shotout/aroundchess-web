"use client";

import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { useApiClient } from "@/functions/api-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import DotSpinner from "../game-history/Spinner";
import { useTutorial } from "@/components/TutorialProvider";

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
  const { isTutorialPlay } = useTutorial();

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  if (!visible || isTutorialPlay) return null;

  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = window.innerWidth >= 1024 ? 96 : 72;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-1 sm:p-4"
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

      <div className="relative w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl mx-auto z-10 h-full flex items-center justify-center">
        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="relative z-10 p-[16px] sm:p-4 overflow-y-auto min-h-fit">
            <button className="absolute right-[16px] top-[10px] sm:top-[24px] sm:right-[24px] border md:border-0 px-3 py-1 rounded-[4px]" onClick={onClose}>
              <X className="w-[16px] md:w-[24px] h-[16px] md:h-[24px] text-[#666] hover:text-[#333]" />
            </button>


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
  const { setAIChoosed } = usePlayVSAIStore();
  const { isLoading } = useApiClient();
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
      range: "900 - 1350 ELO",
      key: "intermediate",
    },
    {
      icon: "/images/play-vs-ai/advanced.png",
      iconActive: "/images/play-vs-ai/advanced-active.png",
      label: "Advanced",
      range: "1500 - 1950 ELO",
      key: "advanced",
    },
    {
      icon: "/images/play-vs-ai/master.png",
      iconActive: "/images/play-vs-ai/master-active.png",
      label: "Master",
      range: "2200 - 2700 ELO",
      key: "master",
    },
  ];

  const opponentsByDifficulty: Record<string, { id: number; name: string; elo: number; img: string }[]> = {
    beginner: [
      { id: 0, name: "Thomas", elo: 250, img: "/images/v2/AI avatar/Beginner/Thomas.png" },
      { id: 1, name: "Sofia", elo: 250, img: "/images/v2/AI avatar/Beginner/Sofia.png" },
      { id: 2, name: "Pierre", elo: 400, img: "/images/v2/AI avatar/Beginner/Pierre.png" },
      { id: 30, name: "Lieke", elo: 400, img: "/images/v2/AI avatar/Beginner/Lieke.png" },
      { id: 3, name: "Ana", elo: 400, img: "/images/v2/AI avatar/Beginner/Ana.png" },
      { id: 4, name: "Carlos", elo: 500, img: "/images/v2/AI avatar/Beginner/Carlos.png" },
      { id: 5, name: "Lana", elo: 500, img: "/images/v2/AI avatar/Beginner/Lana.png" },
      { id: 6, name: "Dimitri", elo: 500, img: "/images/v2/AI avatar/Beginner/Dimitri.png" },
      { id: 7, name: "Marco", elo: 600, img: "/images/v2/AI avatar/Beginner/Marco.png" },
      { id: 8, name: "Marie", elo: 600, img: "/images/v2/AI avatar/Beginner/Marie.png" },
      { id: 9, name: "Elena", elo: 600, img: "/images/v2/AI avatar/Beginner/Elena.png" },
      { id: 10, name: "Viktor", elo: 700, img: "/images/v2/AI avatar/Beginner/Victor.png" },
      { id: 11, name: "Delia", elo: 700, img: "/images/v2/AI avatar/Beginner/Delia.png" },
      { id: 12, name: "Hans", elo: 700, img: "/images/v2/AI avatar/Beginner/Hans.png" },
      { id: 13, name: "Igor", elo: 800, img: "/images/v2/AI avatar/Beginner/Igor.png" },
      { id: 14, name: "Amel", elo: 800, img: "/images/v2/AI avatar/Beginner/Amel.png" },
      { id: 15, name: "Lisa", elo: 800, img: "/images/v2/AI avatar/Beginner/Lisa.png" },
      { id: 16, name: "Andreas", elo: 850, img: "/images/v2/AI avatar/Beginner/Andreas.png" },
      { id: 17, name: "Astrid", elo: 850, img: "/images/v2/AI avatar/Beginner/Astrid.png" },
      { id: 18, name: "Ingrid", elo: 850, img: "/images/v2/AI avatar/Beginner/Ingrid.png" },
    ],
    intermediate: [
      { id: 100, name: "Naomi", elo: 900, img: "/images/v2/AI avatar/Intermediate/Naomi.png" },
      { id: 101, name: "Tobias", elo: 900, img: "/images/v2/AI avatar/Intermediate/Tobias.png" },
      { id: 102, name: "Mei Lin", elo: 950, img: "/images/v2/AI avatar/Intermediate/Mei Lin.png" },
      { id: 103, name: "Aleksandr", elo: 950, img: "/images/v2/AI avatar/Intermediate/Aleksandr.png" },
      { id: 104, name: "Priya", elo: 1000, img: "/images/v2/AI avatar/Intermediate/Priya.png" },
      { id: 105, name: "Oscar", elo: 1000, img: "/images/v2/AI avatar/Intermediate/Oscar.png" },
      { id: 106, name: "Linnea", elo: 1050, img: "/images/v2/AI avatar/Intermediate/Linnea.png" },
      { id: 107, name: "Kwame", elo: 1050, img: "/images/v2/AI avatar/Intermediate/Kwame.png" },
      { id: 108, name: "Yuki", elo: 1100, img: "/images/v2/AI avatar/Intermediate/Yuki.png" },
      { id: 109, name: "Henrik", elo: 1100, img: "/images/v2/AI avatar/Intermediate/Henrik.png" },
      { id: 110, name: "Fatima", elo: 1150, img: "/images/v2/AI avatar/Intermediate/Fatima.png" },
      { id: 111, name: "Lukas", elo: 1150, img: "/images/v2/AI avatar/Intermediate/Lukas.png" },
      { id: 112, name: "Anya", elo: 1200, img: "/images/v2/AI avatar/Intermediate/Anya.png" },
      { id: 113, name: "Rashid", elo: 1200, img: "/images/v2/AI avatar/Intermediate/Rashid.png" },
      { id: 114, name: "Camille", elo: 1250, img: "/images/v2/AI avatar/Intermediate/Camille.png" },
      { id: 115, name: "Jin", elo: 1250, img: "/images/v2/AI avatar/Intermediate/Jin.png" },
      { id: 116, name: "Zara", elo: 1300, img: "/images/v2/AI avatar/Intermediate/Zara.png" },
      { id: 117, name: "Mateo", elo: 1300, img: "/images/v2/AI avatar/Intermediate/Mateo.png" },
      { id: 118, name: "Ingeborg", elo: 1350, img: "/images/v2/AI avatar/Intermediate/Ingebong.png" },
      { id: 119, name: "Chen Wei", elo: 1350, img: "/images/v2/AI avatar/Intermediate/Chen Wei.png" },
    ],
    advanced: [
      { id: 200, name: "Katarina", elo: 1500, img: "/images/v2/AI avatar/Advanced/Katarina.png" },
      { id: 201, name: "Magnuson", elo: 1500, img: "/images/v2/AI avatar/Advanced/Magnuson.png" },
      { id: 202, name: "Adaeze", elo: 1550, img: "/images/v2/AI avatar/Advanced/Adaeze.png" },
      { id: 203, name: "Vladimir", elo: 1550, img: "/images/v2/AI avatar/Advanced/Vladimir.png" },
      { id: 204, name: "Sakura", elo: 1600, img: "/images/v2/AI avatar/Advanced/Sakura.png" },
      { id: 205, name: "Erik", elo: 1600, img: "/images/v2/AI avatar/Advanced/Erik.png" },
      { id: 206, name: "Isabella", elo: 1650, img: "/images/v2/AI avatar/Advanced/Isabella.png" },
      { id: 207, name: "Bjorn", elo: 1650, img: "/images/v2/AI avatar/Advanced/Bjorn.png" },
      { id: 208, name: "Amara", elo: 1700, img: "/images/v2/AI avatar/Advanced/Amara.png" },
      { id: 209, name: "Sergei", elo: 1700, img: "/images/v2/AI avatar/Advanced/Sergei.png" },
      { id: 210, name: "Lucia", elo: 1750, img: "/images/v2/AI avatar/Advanced/Lucia.png" },
      { id: 211, name: "Nikolai", elo: 1750, img: "/images/v2/AI avatar/Advanced/Nikolai.png" },
      { id: 212, name: "Sun-Hee", elo: 1800, img: "/images/v2/AI avatar/Advanced/Sun-Hee.png" },
      { id: 213, name: "Dominik", elo: 1800, img: "/images/v2/AI avatar/Advanced/Dominik.png" },
      { id: 214, name: "Nadia", elo: 1850, img: "/images/v2/AI avatar/Advanced/Nadia.png" },
      { id: 215, name: "Andrei", elo: 1850, img: "/images/v2/AI avatar/Advanced/Andrei.png" },
      { id: 216, name: "Olivia", elo: 1900, img: "/images/v2/AI avatar/Advanced/Olivia.png" },
      { id: 217, name: "Hassan", elo: 1900, img: "/images/v2/AI avatar/Advanced/Hassan.png" },
      { id: 218, name: "Elise", elo: 1950, img: "/images/v2/AI avatar/Advanced/Elise.png" },
      { id: 219, name: "Sven", elo: 1950, img: "/images/v2/AI avatar/Advanced/Sven.png" },
    ],
    master: [
      { id: 300, name: "Anastasia", elo: 2200, img: "/images/v2/AI avatar/Master/Anastasia.png" },
      { id: 301, name: "Maxim", elo: 2200, img: "/images/v2/AI avatar/Master/Maxim.png" },
      { id: 302, name: "Ximena", elo: 2250, img: "/images/v2/AI avatar/Master/Ximena.png" },
      { id: 303, name: "Gari", elo: 2250, img: "/images/v2/AI avatar/Master/Gari.png" },
      { id: 304, name: "Hiroshi", elo: 2300, img: "/images/v2/AI avatar/Master/Hiroshi.png" },
      { id: 305, name: "Svetlana", elo: 2300, img: "/images/v2/AI avatar/Master/Svetlana.png" },
      { id: 306, name: "Friedrich", elo: 2350, img: "/images/v2/AI avatar/Master/Friedrich.png" },
      { id: 307, name: "Miriam", elo: 2350, img: "/images/v2/AI avatar/Master/Miriam.png" },
      { id: 308, name: "Rajiv", elo: 2400, img: "/images/v2/AI avatar/Master/Rajiv.png" },
      { id: 309, name: "Natasha", elo: 2400, img: "/images/v2/AI avatar/Master/Natasha.png" },
      { id: 310, name: "Boris", elo: 2450, img: "/images/v2/AI avatar/Master/Boris.png" },
      { id: 311, name: "Lei", elo: 2450, img: "/images/v2/AI avatar/Master/Lei.png" },
      { id: 312, name: "Mikhail", elo: 2500, img: "/images/v2/AI avatar/Master/Mikhail.png" },
      { id: 313, name: "Valentina", elo: 2500, img: "/images/v2/AI avatar/Master/Valentina.png" },
      { id: 314, name: "Karlson", elo: 2550, img: "/images/v2/AI avatar/Master/Karlson.png" },
      { id: 315, name: "Diana", elo: 2550, img: "/images/v2/AI avatar/Master/Diana.png" },
      { id: 316, name: "Tigran", elo: 2600, img: "/images/v2/AI avatar/Master/Tigran.png" },
      { id: 317, name: "Aleksandra", elo: 2600, img: "/images/v2/AI avatar/Master/Aleksandra.png" },
      { id: 318, name: "Ivan", elo: 2650, img: "/images/v2/AI avatar/Master/Ivan.png" },
      { id: 319, name: "Grandmaster", elo: 2700, img: "/images/v2/AI avatar/Master/Grandmaster.png" },
    ],
  };

  const currentOpponents = opponentsByDifficulty[difficulty] ?? opponentsByDifficulty.beginner;

  useEffect(() => {
    if (!currentOpponents.find((opponent) => opponent.id === selectedOpponent)) {
      setSelectedOpponent(currentOpponents[0]?.id ?? 0);
    }
  }, [currentOpponents, selectedOpponent]);

  const handlePlayNow = () => {
    const selected = currentOpponents.find((o) => o.id === selectedOpponent);
    if (!selected) return;

    const body = {
      color: selectedColor,
      difficulty: difficulty,
      opponent: selected,
    };
    setAIChoosed(body);
    router.push("/playground/play-vs-ai/playing");
    onClose();
  };

  return (
    <div className="space-y-1 sm:space-y-3">
      <div className="text-center">
        <h1 className="text-base sm:text-xl lg:text-2xl font-semibold text-gray-900">
          Choose Your Color
        </h1>
        <p className="mb-[16px] text-[14px] --xs sm:text-[14px] --sm lg:text-base text-gray-600">
          Select which color you want to play as. The computer will play as the
          opposite color.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-4">
        {[
          {
            color: "white",
            icon: "/images/play-vs-ai/white-king.svg",
            label: "White",
          },
          {
            color: "black",
            icon: "/images/play-vs-ai/black-king.svg",
            label: "Black",
          },
        ].map(({ color, icon, label }) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`relative p-1 sm:p-2 md:p-2 lg:p-3 border-2 rounded-md sm:rounded-lg md:rounded-lg lg:rounded-xl transition-all hover:shadow-md ${
              selectedColor === color
                ? "border-blue-base"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 lg:space-y-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-14 md:h-14 flex items-center justify-center">
                <Image
                  src={icon}
                  alt={color}
                  width={80}
                  height={80}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex flex-col items-center !mt-[8px]">
                <span className="text-[14px] --xs sm:text-[14px] --sm md:text-base lg:text-lg font-medium text-gray-900">
                  {label}
                </span>
              </div>
            </div>
            {selectedColor === color && (
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-4 lg:right-4 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full bg-blue-base"></div>
            )}
          </button>
        ))}
      </div>
      <div className="w-full h-0.5 bg-gray-200 mt-1 rounded-full"></div>

      <div className="hidden lg:block space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Choose your Opponent
        </h2>

        <div className="grid grid-cols-4 gap-3">
          {difficulties.map((diff) => (
            <button
              key={diff.key}
              onClick={() => setDifficulty(diff.key)}
              className={`p-2 rounded-lg border transition-all text-center ${
                difficulty === diff.key
                  ? "shadow-lg text-blue-base"
                  : "bg-white border-none text-gray-700"
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
                    className={`text-[14px] --sm font-semibold ${
                      difficulty === diff.key
                        ? "text-blue-700"
                        : "text-gray-900"
                    }`}
                  >
                    {diff.label}
                  </div>
                </div>
                <div className="text-[14px] --xs text-gray-500">{diff.range}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:hidden">
        <div
          className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {difficulties.map((diff) => (
            <button
              key={diff.key}
              onClick={() => setDifficulty(diff.key)}
              className={`flex-shrink-0 p-1 rounded-sm border transition-all text-center min-w-[120px] sm:min-w-[140px] ${
                difficulty === diff.key
                  ? "shadow-lg text-blue-base"
                  : "bg-white border-none text-gray-700"
              }`}
            >
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-3 sm:w-6 sm:h-4 flex items-center justify-center">
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
                    className={`text-[14px] --xs sm:text-[14px] --sm font-semibold ${
                      difficulty === diff.key
                        ? "text-blue-700"
                        : "text-gray-900"
                    }`}
                  >
                    {diff.label}
                  </div>
                </div>
                <div className="text-[14px] --10px sm:text-[14px] --xs text-gray-500">{diff.range}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg sm:rounded-xl p-2 sm:p-4">
        <div
          className="grid gap-[6px] sm:gap-[8px] max-h-[36vh] md:max-h-[15vh] xxl:max-h-[21vh] 2xl:max-h-[18vw] overflow-y-auto justify-center"
          style={{ 
            gridTemplateColumns: window.innerWidth >= 1024 
              ? "repeat(auto-fit, 92px)"
              : "repeat(auto-fit, 72px)" 
          }}
        >
          {currentOpponents.map((opponent) => (
              <button
                key={opponent.id}
                onClick={() => setSelectedOpponent(opponent.id)}
                className={`p-1 rounded-md lg:rounded-lg border transition-all w-full sm:w-16 md:w-16 lg:w-24 lg:h-auto ${
                  selectedOpponent === opponent.id
                    ? "border-blue-base bg-blue-base/5 text-blue-base"
                    : "border-transparent hover:border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex flex-col items-center space-y-1 sm:space-y-2 lg:space-y-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                    <Image
                      src={opponent.img}
                      alt={opponent.name}
                      width={48}
                      height={48}
                      className="max-w-full max-h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="text-center">
                    {/* The mobile sizes here used to be written as "--10px" /
                        "--xs", which aren't Tailwind classes and so did nothing
                        — every breakpoint fell back to 14px, and a long name
                        like "Grandmaster" overflowed the 72px mobile cell.
                        lg: keeps the 14px it has always effectively rendered. */}
                    <div
                      className={`text-[10px] sm:text-[11px] lg:text-[14px] leading-tight break-words font-medium ${
                        selectedOpponent === opponent.id
                          ? "text-blue-base"
                          : "text-gray-900"
                      }`}
                    >
                      {opponent.name}
                    </div>
                    <div className="text-[9px] sm:text-[10px] lg:text-[14px] leading-tight text-gray-500">
                      ELO {opponent.elo}
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
      <div className="w-full h-0.5 bg-gray-200 mt-1 rounded-full"></div>

      <div className="pt-2 sm:pt-4 lg:pt-4">
        {isLoading ? (
          <div className="flex justify-center">
            <DotSpinner />
          </div>
        ) : (
          <button
            onClick={handlePlayNow}
            className="w-full py-2 sm:py-3 lg:py-3 btn-primary text-[14px] --xs sm:text-base lg:text-base text-white font-semibold rounded-full transition-colors"
          >
            Play Now
          </button>
        )}
      </div>
    </div>
  );
};
