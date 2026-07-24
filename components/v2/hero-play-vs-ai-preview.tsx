"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { usePlayVSAIStore } from "@/app/store/playVSAI";
import { usePlayPageStore } from "@/app/store/playPage";
import { AI_OPPONENT_ROSTER, AiRosterOpponent } from "./play-vs-ai-roster-data";

type Opponent = { name: string; elo: number; img: string };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Difficulty tabs list the real roster bots inside the tier's ELO range,
// with their true ELOs. Only the Recommended tab adapts to the user's ELO.
const buildTier = (min: number, max: number): Opponent[] =>
  AI_OPPONENT_ROSTER.filter((o) => o.elo >= min && o.elo <= max).map(
    ({ name, elo, img }) => ({ name, elo, img })
  );

// Recommended opponents are picked from the existing AI roster around the
// user's ELO rounded UP to the nearest 50 (629 -> 650): targets are
// rounded -50 / +0 / +50 / +100, each slot taking the nearest listed AI.
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

// Default Recommended list for visitors with no ELO yet (not logged in): a
// fixed beginner spread of 250 / 400 / 500 / 600, one bot per step.
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
}: {
  opponent: Opponent;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-colors ${
        selected ? "border-blue-base bg-blue-base/5" : "border-transparent"
      }`}
    >
      <Image
        src={opponent.img}
        alt={opponent.name}
        width={76}
        height={76}
        className="w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full object-cover"
      />
      <div className="text-center">
        <div className={`text-[12px] sm:text-[14px] font-medium ${selected ? "text-blue-base" : "text-gray-900"}`}>
          {opponent.name}
        </div>
        <div className="text-[10px] sm:text-[12px] text-gray-500">ELO {opponent.elo}</div>
      </div>
    </button>
  );
}

export function HeroPlayVSAIPreview({ recommendedListHeightClass = "h-[350px]" }: { recommendedListHeightClass?: string }) {
  const router = useRouter();
  const { setAIChoosed, setSelectedOpponent: setStoreOpponent, setSelectedColor: setStoreColor } = usePlayVSAIStore();
  const { leaderboard } = usePlayPageStore();
  const hasUserElo = !!leaderboard?.my_elo;
  const userElo = leaderboard?.my_elo || DEFAULT_USER_ELO;

  // Deterministic on first render (SSR-safe), shuffled after mount so ties
  // between same-ELO bots resolve to a random pick.
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

  // Scroll-spy for the Recommended tab's combined list: as the user scrolls
  // past each tier's section, the matching tab highlights (without switching
  // the rendered content — selectedTab is unchanged).
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
      // A section counts as "current" once its top has scrolled up to near
      // the container's top edge.
      if (el.getBoundingClientRect().top - contTop <= 48) current = key;
    }
    setActiveSection(current);
  };

  // Mirror the live selection into the shared store so the opponent bar over
  // the board preview (a sibling component) tracks whoever is highlighted here.
  useEffect(() => {
    setStoreOpponent(selectedOpponent);
  }, [selectedOpponent, setStoreOpponent]);

  // Mirror the chosen color so the board preview (sibling) can flip orientation.
  useEffect(() => {
    setStoreColor(selectedColor);
  }, [selectedColor, setStoreColor]);

  // Keep the selection valid when the recommended list changes (shuffle or ELO load).
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
  // On the Recommended tab the highlight follows the scrolled-to section;
  // on a single-tier tab it just follows the selected tab.
  const highlightKey = selectedTab === "recommended" ? activeSection : selectedTab;

  // Keep the highlighted tab in view: scroll the (horizontally scrollable) tab
  // bar so the active tab is revealed as scroll-spy moves the highlight.
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
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-center">
        Choose Your Color
      </h2>

      <div className="flex bg-gray-100 rounded-full p-1 max-sm:bg-white max-sm:shadow-[0_2px_10px_rgba(0,0,0,0.10)]">
        {(["white", "black"] as const).map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-[13px] sm:text-sm font-medium transition-colors ${
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
              className="w-4 h-4"
            />
            {capitalize(color)}
          </button>
        ))}
      </div>

      {/* On mobile this section renders as its own white shadow card (mockup);
          on desktop the wrapper is invisible and keeps the same column gap. */}
      <div className="flex flex-col gap-3 grow min-h-0 max-sm:bg-white max-sm:rounded-2xl max-sm:shadow-[0_2px_12px_rgba(0,0,0,0.10)] max-sm:p-3">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-center pt-1">
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
              className={`flex-shrink-0 min-w-[110px] px-3 py-2 rounded-lg border text-center transition-colors ${
                highlightKey === tab.key
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
        </div>

        {/* Arrow pinned at right edge — always visible on mobile */}
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
          className={`${recommendedListHeightClass} max-sm:h-auto grow mb-2 overflow-y-auto overflow-x-hidden space-y-2 pr-0.5`}
        >
          <div
            ref={(el) => {
              sectionRefs.current["recommended"] = el;
            }}
            className="grid grid-cols-4 gap-2"
          >
            {recommendedOpponents.map((opponent) => (
              <OpponentCard
                key={`rec-${opponent.name}-${opponent.elo}`}
                opponent={opponent}
                selected={selectedOpponent.name === opponent.name && selectedOpponent.elo === opponent.elo}
                onClick={() => setSelectedOpponent(opponent)}
              />
            ))}
          </div>
          {/* Other tiers below the recommended row — desktop only; mobile shows just the 4 picks */}
          <div className="space-y-2 max-sm:hidden">
          {tabs.slice(1).map((tab) => (
            <div
              key={tab.key}
              ref={(el) => {
                sectionRefs.current[tab.key] = el;
              }}
            >
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[12px] sm:text-sm text-gray-500">{tab.label}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {opponentsByTab[tab.key].map((opponent) => (
                  <OpponentCard
                    key={`${tab.key}-${opponent.name}-${opponent.elo}`}
                    opponent={opponent}
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
        <div className={`${recommendedListHeightClass} max-sm:h-[280px] grow mb-2 overflow-y-auto overflow-x-hidden pr-0.5`}>
          <div className="flex items-center gap-3 pb-1">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[12px] sm:text-sm text-gray-500">
              {tabs.find((t) => t.key === selectedTab)?.label}
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-4 gap-2 content-start">
            {currentOpponents.map((opponent) => (
              <OpponentCard
                key={`${selectedTab}-${opponent.name}-${opponent.elo}`}
                opponent={opponent}
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
        className="mt-auto w-full py-1 px-5 btn-primary text-white font-semibold rounded-full flex items-center justify-between text-base"
      >
        Start Game
        <span className=" rounded-full w-5 h-5 sm:w-5 sm:h-5 py-4 flex items-center justify-center flex-shrink-0">
          <ChevronRight size={19} className="text-white " />
        </span>
      </button>
    </div>
  );
}
