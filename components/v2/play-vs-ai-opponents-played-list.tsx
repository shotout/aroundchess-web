"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { OpponentSummary, OpponentsPlayedPagination } from "@/app/store/playVsAiStats";
import { MiniDonutChart } from "@/components/v2/mini-donut-chart";
import { findRosterOpponentByName, stripAiSuffix } from "@/components/v2/play-vs-ai-roster-data";

interface PlayVsAiOpponentsPlayedListProps {
  opponents: OpponentSummary[];
  isLoading: boolean;
  error: Error | null;
  handleRetryFetch: () => void;
  loadMore: () => void;
  pagination: OpponentsPlayedPagination | null;
}

export function PlayVsAiOpponentsPlayedList({
  opponents,
  isLoading,
  error,
  handleRetryFetch,
  loadMore,
  pagination,
}: PlayVsAiOpponentsPlayedListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const canLoadMore = !!pagination && pagination.page < pagination.totalPages;

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white px-[8px] py-[16px] md:p-[20px]">
      <h3 className="flex items-center gap-[8px] text-[16px] md:text-[18px] font-bold text-[#111827] mb-[12px]">
        <Image
          src="/images/v2/leaderboard/sword.png"
          alt=""
          width={20}
          height={20}
          className="w-[20px] h-[20px] object-contain shrink-0"
        />
        Opponents you have played against
      </h3>

      {isLoading && opponents.length === 0 && (
        <div className="py-[24px] text-center text-[14px] text-[#6B7280]">Loading…</div>
      )}

      {error && opponents.length === 0 && (
        <div className="py-[24px] text-center flex flex-col items-center gap-[8px]">
          <span className="text-[14px] text-[#6B7280]">Couldn&apos;t load your opponents.</span>
          <button
            type="button"
            onClick={handleRetryFetch}
            className="text-[14px] font-semibold text-[#221AE9] underline"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && opponents.length === 0 && (
        <div className="py-[24px] text-center text-[14px] text-[#6B7280]">
          You haven&apos;t played any games against the AI yet.
        </div>
      )}

      {opponents.length > 0 && (
        <div className="leaderboard-scrollbar max-h-[400px] overflow-y-auto flex flex-col gap-[10px] pl-[2px] pr-[4px] md:pr-[10px] py-[2px]">
          {opponents.map((opponent) => {
            const rosterEntry = findRosterOpponentByName(opponent.opponentUsername);
            const avatarSrc =
              rosterEntry?.img || opponent.opponentAvatar || "/images/avatar.svg";
            const displayName = stripAiSuffix(opponent.opponentUsername);
            const displayElo = opponent.opponentElo ?? rosterEntry?.elo ?? null;

            const goToDetail = () =>
              router.push(`${pathname}?opponent=${encodeURIComponent(opponent.opponentUsername)}`);

            return (
              <div
                key={opponent.opponentUsername}
                className="rounded-2xl border border-[#F1F3F9] bg-white shadow-[0_2px_10px_rgba(17,24,39,0.06)] px-[8px] md:px-[16px] py-[10px] md:py-[12px]"
              >
                {/* Mobile — one line: avatar, name/ELO, donut, games + win/draw/lost. Row is tappable. */}
                <button
                  type="button"
                  onClick={goToDetail}
                  className="flex sm:hidden items-center gap-[8px] w-full text-left active:bg-[#F9FAFB]"
                >
                  <Image
                    src={avatarSrc}
                    alt={displayName}
                    width={40}
                    height={40}
                    className="w-[40px] h-[40px] rounded-full object-cover shrink-0 bg-[#F1F3F9]"
                  />
                  <div className="flex-1 min-w-0 leading-tight">
                    <div className="font-bold text-[14px] text-[#111827] truncate">{displayName}</div>
                    {displayElo !== null && (
                      <div className="text-[11px] text-[#6B7280]">ELO {displayElo}</div>
                    )}
                  </div>
                  <MiniDonutChart
                    win={opponent.wins}
                    draw={opponent.draws}
                    loss={opponent.losses}
                    size={36}
                  />
                  <div className="shrink-0 leading-tight flex flex-col gap-[3px]">
                    <span className="font-bold text-[14px] text-[#111827] whitespace-nowrap">
                      {opponent.totalGames} Games
                    </span>
                    <span className="flex items-center gap-[6px] text-[11px] text-[#4B5563] whitespace-nowrap">
                      <span className="flex items-center gap-[3px]">
                        <span className="w-[7px] h-[7px] rounded-full bg-[#19B67A] shrink-0" />
                        Win: {opponent.wins}
                      </span>
                      <span className="flex items-center gap-[3px]">
                        <span className="w-[7px] h-[7px] rounded-full bg-[#F1A83A] shrink-0" />
                        Draw: {opponent.draws}
                      </span>
                      <span className="flex items-center gap-[3px]">
                        <span className="w-[7px] h-[7px] rounded-full bg-[#E2547A] shrink-0" />
                        Lost: {opponent.losses}
                      </span>
                    </span>
                  </div>
                </button>

                {/* Desktop — 4 evenly spaced groups */}
                <div className="hidden sm:flex flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px]">
                {/* AI opponent detail */}
                <div className="flex items-center gap-[12px] min-w-0 w-full sm:w-[170px] md:w-[190px] sm:shrink-0">
                  <Image
                    src={avatarSrc}
                    alt={displayName}
                    width={44}
                    height={44}
                    className="w-[44px] h-[44px] rounded-full object-cover shrink-0 bg-[#F1F3F9]"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-[14px] md:text-[16px] text-[#111827] truncate">
                      {displayName}
                    </div>
                    {displayElo !== null && (
                      <div className="text-[12px] md:text-[13px] text-[#6B7280]">
                        ELO {displayElo}
                      </div>
                    )}
                  </div>
                </div>

                {/* Donut chart + total games */}
                <div className="flex items-center gap-[10px] shrink-0">
                  <MiniDonutChart
                    win={opponent.wins}
                    draw={opponent.draws}
                    loss={opponent.losses}
                    size={44}
                  />
                  <span className="text-[14px] md:text-[15px] font-bold text-[#111827] whitespace-nowrap">
                    {opponent.totalGames} Games
                  </span>
                </div>

                {/* Game detail */}
                <div className="flex items-center gap-[14px] md:gap-[20px] text-md text-[#4B5563]">
                  <span className="flex items-center gap-[6px] whitespace-nowrap">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#19B67A] shrink-0" />
                    Win: {opponent.wins}
                  </span>
                  <span className="flex items-center gap-[6px] whitespace-nowrap">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#F1A83A] shrink-0" />
                    Draw: {opponent.draws}
                  </span>
                  <span className="flex items-center gap-[6px] whitespace-nowrap">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#E2547A] shrink-0" />
                    Lost: {opponent.losses}
                  </span>
                </div>

                {/* See details */}
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={goToDetail}
                    className="h-[36px] px-[16px] rounded-full bg-[#221AE9] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-[6px]"
                  >
                    See details <ChevronRight className="w-[14px] h-[14px] shrink-0" strokeWidth={2.5} />
                  </button>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {canLoadMore && (
        <div className="pt-[12px] text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="text-[14px] font-semibold text-[#221AE9] disabled:opacity-50"
          >
            {isLoading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
