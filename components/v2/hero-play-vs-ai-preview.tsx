"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { usePlayPageStore } from "@/app/store/playPage";
import { AI_OPPONENT_ROSTER, AiRosterOpponent } from "./play-vs-ai-roster-data";
import { useEffectiveElo } from "@/components/v2/hooks/useEffectiveElo";

type Opponent = { name: string; elo: number; img: string };

const pick = (tour: boolean) => (tourCls: string, pageCls: string) =>
  tour ? tourCls : pageCls;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const buildTier = (min: number, max: number): Opponent[] =>
  AI_OPPONENT_ROSTER.filter((o) => o.elo >= min && o.elo <= max).map(
    ({ name, elo, img }) => ({ name, elo, img })
  );

const RECOMMENDED_ELO_OFFSETS = [-50, 0, 50, 100];
const DEFAULT_USER_ELO = 300;

const buildRecommended = (roster: AiRosterOpponent[], userElo: number): Opponent[] => {
  const base = Math.ceil(userElo / 50) * 50;
  const used = new Set<number>();
  const picks = RECOMMENDED_ELO_OFFSETS.map((offset) => {
    const target = base + offset;
    let best: AiRosterOpponent | null = null;
    for (const o of roster) {
      if (used.has(o.id)) continue;
      if (!best || Math.abs(o.elo - target) < Math.abs(best.elo - target)) best = o;
    }
    used.add(best!.id);
    return best!;
  });
  return picks
    .sort((a, b) => a.elo - b.elo)
    .map(({ name, elo, img }) => ({ name, elo, img }));
};

const DEFAULT_RECOMMENDED_ELOS = [250, 400, 500, 600];

const buildDefaultRecommended = (roster: AiRosterOpponent[]): Opponent[] => {
  const used = new Set<number>();
  const picks = DEFAULT_RECOMMENDED_ELOS.map((target) => {
    let best: AiRosterOpponent | null = null;
    for (const o of roster) {
      if (used.has(o.id)) continue;
      const exact = o.elo === target;
      const bestExact = best?.elo === target;
      if (
        !best ||
        (exact && !bestExact) ||
        (exact === bestExact &&
          Math.abs(o.elo - target) < Math.abs((best as AiRosterOpponent).elo - target))
      ) {
        best = o;
      }
    }
    used.add(best!.id);
    return best!;
  });
  return picks
    .sort((a, b) => a.elo - b.elo)
    .map(({ name, elo, img }) => ({ name, elo, img }));
};

const opponentsByTab: Record<string, Opponent[]> = {
  beginner: buildTier(250, 850),
  intermediate: buildTier(900, 1350),
  advanced: buildTier(1500, 1950),
  master: buildTier(2200, 2700),
};

const tabs = [
  { key: "recommended", label: "Recommended", sub: "Based on your ELO" },
  { key: "beginner", label: "Beginner", sub: "250 - 850 ELO" },
  { key: "intermediate", label: "Intermediate", sub: "900 - 1350 ELO" },
  { key: "advanced", label: "Advanced", sub: "1500 - 1950 ELO" },
  { key: "master", label: "Master", sub: "2200 - 2700 ELO" },
];

function OpponentCard({
  opponent,
  selected,
  onClick,
  tour,
}: {
  opponent: Opponent;
  selected: boolean;
  onClick: () => void;
  tour: boolean;
}) {
  const p = pick(tour);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center ${p(
        "gap-0.5 p-1",
        "gap-1 p-1.5"
      )} sm:gap-1 sm:p-1.5 rounded-lg border transition-colors ${
        selected ? "border-blue-base bg-blue-base/5" : "border-transparent"
      }`}
    >
      <Image
        src={opponent.img}
        alt={opponent.name}
        width={76}
        height={76}
        className={`${p(
          "w-11 h-11",
          "w-14 h-14"
        )} sm:w-[68px] sm:h-[68px] rounded-full object-cover`}
      />
      <div className="text-center">
        <div
          className={`${p("text-[11px] max-sm:leading-tight", "text-[12px]")} sm:text-[14px] font-medium ${
            selected ? "text-blue-base" : "text-gray-900"
          }`}
        >
          {opponent.name}
        </div>
        <div
          className={`${p("text-[9px] max-sm:leading-tight", "text-[10px]")} sm:text-[12px] text-gray-500`}
        >
          ELO {opponent.elo}
        </div>
      </div>
    </button>
  );
}

export function HeroPlayVSAIPreview({
  recommendedListHeightClass = "h-[350px]",
  tour = false,
}: {
  recommendedListHeightClass?: string;
  tour?: boolean;
}) {
  const router = useRouter();
  const { setAIChoosed, setSelectedOpponent: setStoreOpponent, setSelectedColor: setStoreColor } = usePlayVSAIStore();
  const effectiveElo = useEffectiveElo();
  const hasUserElo = effectiveElo > 0;
  const userElo = effectiveElo || DEFAULT_USER_ELO;

  const p = pick(tour);

  const [rosterOrder, setRosterOrder] = useState<AiRosterOpponent[]>(AI_OPPONENT_ROSTER);
  useEffect(() => {
    setRosterOrder([...AI_OPPONENT_ROSTER].sort(() => Math.random() - 0.5));
  }, []);

  const recommendedOpponents = useMemo(
    () =>
      hasUserElo
        ? buildRecommended(rosterOrder, userElo)
        : buildDefaultRecommended(rosterOrder),
    [rosterOrder, userElo, hasUserElo]
  );

  const opponentsFor = (key: string) =>
    key === "recommended" ? recommendedOpponents : opponentsByTab[key] ?? recommendedOpponents;

  const [selectedColor, setSelectedColor] = useState<"white" | "black">("white");
  const [selectedTab, setSelectedTab] = useState("recommended");
  const [selectedOpponent, setSelectedOpponent] = useState(() => buildRecommended(AI_OPPONENT_ROSTER, DEFAULT_USER_ELO)[0]);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const listRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeSection, setActiveSection] = useState("recommended");

  const handleListScroll = () => {
    const container = listRef.current;
    if (!container) return;
    const contTop = container.getBoundingClientRect().top;
    const keys = ["recommended", ...tabs.slice(1).map((t) => t.key)];
    let current = "recommended";
    for (const key of keys) {
      const el = sectionRefs.current[key];
      if (!el) continue;
      if (el.getBoundingClientRect().top - contTop <= 48) current = key;
    }
    setActiveSection(current);
  };

  useEffect(() => {
    setStoreOpponent(selectedOpponent);
  }, [selectedOpponent, setStoreOpponent]);

  useEffect(() => {
    setStoreColor(selectedColor);
  }, [selectedColor, setStoreColor]);

  useEffect(() => {
    setSelectedOpponent((prev) => {
      if (selectedTab !== "recommended") return prev;
      const stillThere = recommendedOpponents.find((o) => o.name === prev.name && o.elo === prev.elo);
      return stillThere ?? recommendedOpponents[0];
    });
  }, [recommendedOpponents, selectedTab]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragState.current.isDragging = true;
    dragState.current.startX = e.clientX;
    dragState.current.scrollLeft = tabsScrollRef.current?.scrollLeft ?? 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging || !tabsScrollRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    tabsScrollRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const stopDrag = () => { dragState.current.isDragging = false; };

  const currentOpponents = opponentsFor(selectedTab);
  const highlightKey = selectedTab === "recommended" ? activeSection : selectedTab;

  useEffect(() => {
    const container = tabsScrollRef.current;
    const el = tabRefs.current[highlightKey];
    if (!container || !el) return;
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;
    if (elLeft < viewLeft) {
      container.scrollTo({ left: Math.max(0, elLeft - 8), behavior: "smooth" });
    } else if (elRight > viewRight) {
      container.scrollTo({ left: elRight - container.clientWidth + 8, behavior: "smooth" });
    }
  }, [highlightKey]);

  const handlePlayNow = () => {
    setAIChoosed({
      color: selectedColor,
      difficulty: selectedTab,
      opponent: selectedOpponent,
    });
    router.push("/playground/play-vs-ai/playing");
  };

  return (
    <div className={`flex flex-col flex-1 min-h-0 ${p("gap-2", "gap-3")} sm:gap-3`}>
      <h2 className={`${p("text-[13px]", "text-base")} sm:text-lg font-semibold text-gray-900 text-center`}>
        Choose Your Color
      </h2>

      <div className="flex bg-gray-100 rounded-full p-1 max-sm:bg-white max-sm:shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
        {(["white", "black"] as const).map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`flex-1 flex items-center justify-center gap-1.5 ${p(
              "py-1.5 text-[12px]",
              "py-2 text-[13px]"
            )} sm:py-2 rounded-full sm:text-sm font-medium transition-colors ${
              selectedColor === color
                ? "bg-white shadow text-gray-900 max-sm:bg-[#DED9F8] max-sm:shadow-none"
                : "text-gray-500 max-sm:text-gray-900"
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
              className={`${p("w-3.5 h-3.5", "w-4 h-4")} sm:w-4 sm:h-4`}
            />
            {capitalize(color)}
          </button>
        ))}
      </div>

      <div
        data-tour-anchor="opponent-list"
        className={`flex flex-col ${p("gap-2 max-sm:p-2", "gap-3 max-sm:p-3")} sm:gap-3 grow min-h-0 max-sm:bg-white max-sm:rounded-2xl max-sm:shadow-[0_2px_12px_rgba(0,0,0,0.10)]`}
      >
      <h2 className={`${p("text-[13px] pt-0.5", "text-base pt-1")} sm:text-lg font-semibold text-gray-900 text-center sm:pt-1`}>
        Choose Your Opponent
      </h2>

      <div className="relative">
        <div
          ref={tabsScrollRef}
          className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide pr-8 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              onClick={() => {
                setSelectedTab(tab.key);
                setActiveSection(tab.key);
                setSelectedOpponent(opponentsFor(tab.key)[0]);
              }}
              className={`flex-shrink-0 ${p(
                "min-w-[88px] px-2 py-1.5",
                "min-w-[110px] px-3 py-2"
              )} sm:min-w-[110px] sm:px-3 sm:py-2 rounded-lg border text-center transition-colors ${
                highlightKey === tab.key
                  ? "border-blue-base text-blue-base"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              <div className={`${p("text-[11px]", "text-[12px]")} sm:text-[13px] font-semibold leading-tight`}>
                {tab.label}
              </div>
              <div className={`${p("text-[9px]", "text-[10px]")} sm:text-[11px] text-gray-500 leading-tight`}>
                {tab.sub}
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const i = tabs.findIndex((t) => t.key === selectedTab);
            const next = tabs[(i + 1) % tabs.length];
            setSelectedTab(next.key);
            setSelectedOpponent(opponentsFor(next.key)[0]);
            if (tabsScrollRef.current) {
              const tabWidth = tabsScrollRef.current.scrollWidth / tabs.length;
              tabsScrollRef.current.scrollTo({ left: (i + 1) * tabWidth, behavior: "smooth" });
            }
          }}
          aria-label="Next difficulty"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-base text-white flex items-center justify-center animate-bounce hover:opacity-80 transition-opacity"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {selectedTab === "recommended" ? (
        <div
          ref={listRef}
          onScroll={handleListScroll}
          className={`${recommendedListHeightClass} ${p(
            "max-sm:h-[198px] mb-1",
            "max-sm:h-[248px] mb-2"
          )} sm:mb-2 grow overflow-y-auto overflow-x-hidden space-y-2 pr-0.5`}
        >
          <div
            ref={(el) => {
              sectionRefs.current["recommended"] = el;
            }}
            className={`grid grid-cols-4 ${p("gap-1.5", "gap-2")} sm:gap-2`}
          >
            {recommendedOpponents.map((opponent) => (
              <OpponentCard
                key={`rec-${opponent.name}-${opponent.elo}`}
                opponent={opponent}
                tour={tour}
                selected={selectedOpponent.name === opponent.name && selectedOpponent.elo === opponent.elo}
                onClick={() => setSelectedOpponent(opponent)}
              />
            ))}
          </div>
          <div className="space-y-2">
          {tabs.slice(1).map((tab) => (
            <div
              key={tab.key}
              ref={(el) => {
                sectionRefs.current[tab.key] = el;
              }}
            >
              <div className={`flex items-center gap-3 ${p("py-0.5", "py-1")} sm:py-1`}>
                <div className="h-px flex-1 bg-gray-200" />
                <span className={`${p("text-[10px]", "text-[12px]")} sm:text-sm text-gray-500`}>{tab.label}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className={`grid grid-cols-4 ${p("gap-1.5", "gap-2")} sm:gap-2`}>
                {opponentsByTab[tab.key].map((opponent) => (
                  <OpponentCard
                    key={`${tab.key}-${opponent.name}-${opponent.elo}`}
                    opponent={opponent}
                    tour={tour}
                    selected={selectedOpponent.name === opponent.name && selectedOpponent.elo === opponent.elo}
                    onClick={() => setSelectedOpponent(opponent)}
                  />
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      ) : (
        <div className={`${recommendedListHeightClass} ${p(
          "max-sm:h-[224px] mb-1",
          "max-sm:h-[280px] mb-2"
        )} sm:mb-2 grow overflow-y-auto overflow-x-hidden pr-0.5`}>
          <div className={`flex items-center gap-3 ${p("pb-0.5", "pb-1")} sm:pb-1`}>
            <div className="h-px flex-1 bg-gray-200" />
            <span className={`${p("text-[10px]", "text-[12px]")} sm:text-sm text-gray-500`}>
              {tabs.find((t) => t.key === selectedTab)?.label}
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className={`grid grid-cols-4 ${p("gap-1.5", "gap-2")} sm:gap-2 content-start`}>
            {currentOpponents.map((opponent) => (
              <OpponentCard
                key={`${selectedTab}-${opponent.name}-${opponent.elo}`}
                opponent={opponent}
                tour={tour}
                selected={selectedOpponent.name === opponent.name && selectedOpponent.elo === opponent.elo}
                onClick={() => setSelectedOpponent(opponent)}
              />
            ))}
          </div>
        </div>
      )}
      </div>

      <button
        type="button"
        onClick={handlePlayNow}
        data-tutorial="play-vs-ai-step-2"
        data-tour-anchor="start-game"
        className={`mt-auto w-full py-1 ${p(
          "px-4 text-[13px]",
          "px-5 text-base"
        )} sm:px-5 sm:text-base btn-primary text-white font-semibold rounded-full flex items-center justify-between`}
      >
        Start Game
        <span className={` rounded-full w-5 h-5 sm:w-5 sm:h-5 ${p("py-3", "py-4")} sm:py-4 flex items-center justify-center flex-shrink-0`}>
          <ChevronRight size={19} className="text-white " />
        </span>
      </button>
    </div>
  );
}
