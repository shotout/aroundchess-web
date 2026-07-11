"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/navigator/navigation";
import { LeaderboardTopStats } from "@/components/v2/leaderboard-top-stats";
import { LeaderboardList, type LeaderboardEntry } from "@/components/v2/leaderboard-list";
import { LeaderboardNextGame } from "@/components/v2/leaderboard-next-game";
import { LeaderboardJoinModal } from "@/components/v2/leaderboard-join-modal";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { useApiClient } from "@/functions/api-client";

const PLACEHOLDER_SCORES = [2710, 2680, 2680, 2680, 2680, 2710, 2680, 2680, 2680, 2680];

function buildPlaceholderEntries(myRank: number, myElo: number, myUsername: string): LeaderboardEntry[] {
  return PLACEHOLDER_SCORES.map((score, i) => {
    const rank = i + 1;
    const isMe = rank === myRank;
    return {
      rank,
      username: isMe ? myUsername : "[Username]",
      score: isMe && myElo ? myElo : score,
      rankChange: rank === 2 ? -1 : rank === 4 ? 2 : rank === 6 ? 1 : rank === 9 ? -3 : null,
      isMe,
    };
  });
}

export function LeaderboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previewModal = searchParams.get("previewModal");
  const { sessionId, profile } = useProfileStore();
  const { getLeaderboardData, getLeaderboardMe } = useApiClient();
  const {
    leaderboard, setLeaderboard,
    leaderboardMe, setLeaderboardMe,
    leaderboardEntries, setLeaderboardEntries,
  } = usePlayPageStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    getLeaderboardData()
      .then((data: any) => {
        if (!data?.success) return;
        if (data.data) setLeaderboard(data.data);

        const list =
          data.data?.entries ?? data.data?.leaderboard ?? data.data?.players ?? data.data?.list ?? null;
        const myRank = data.data?.my_rank ?? null;
        if (Array.isArray(list) && list.length > 0) {
          setLeaderboardEntries(
            list.map((item: any, i: number) => ({
              rank: item.rank ?? i + 1,
              username: item.username ?? item.name ?? "[Username]",
              score: item.score ?? item.elo ?? 0,
              rankChange: item.rank_change ?? item.rankChange ?? null,
              isMe: item.is_me ?? item.isMe ?? (myRank !== null && item.rank === myRank),
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    getLeaderboardMe()
      .then((res: any) => { if (res?.data) setLeaderboardMe(res.data); })
      .catch(() => {});
  }, [sessionId]);

  const username = profile?.username || profile?.name || "You";
  const myElo = leaderboard?.my_elo ?? 0;
  const myRank = leaderboard?.my_rank ?? 0;

  const displayedEntries = useMemo(
    () =>
      leaderboardEntries && leaderboardEntries.length > 0
        ? leaderboardEntries
        : buildPlaceholderEntries(myRank, myElo, username),
    [leaderboardEntries, myRank, myElo, username]
  );

  const needsMoreGames =
    previewModal === "join" || (previewModal !== "inactive" && leaderboardMe !== null && leaderboardMe.can_join === false);
  const isInactive =
    previewModal === "inactive" ||
    (previewModal !== "join" && leaderboardMe !== null && leaderboardMe.can_join !== false && leaderboardMe.is_inactive === true);

  const joinModalContent = needsMoreGames
    ? {
        title: `Play ${leaderboardMe?.games_remaining ?? 3} more ${
          (leaderboardMe?.games_remaining ?? 3) === 1 ? "game" : "games"
        } to join the Leaderboard.`,
        description:
          "Your ELO score is still being calculated. Complete 5 games to unlock your rating and claim your spot on the leaderboard.",
      }
    : isInactive
    ? {
        title: "Join the Leaderboard again!",
        description:
          "You haven't played in the past 7 days. Start playing again and be back in the game. Don't worry - your previous results are still there!",
      }
    : null;

  return (
    <div className="flex overflow-hidden bg-primary-white">
      {joinModalContent && showJoinModal && (
        <LeaderboardJoinModal
          title={joinModalContent.title}
          description={joinModalContent.description}
          onBack={() => {
            setShowJoinModal(false);
            router.back();
          }}
          onPlayNow={() => {
            setShowJoinModal(false);
            router.push("/play");
          }}
        />
      )}

      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="p-[10px] sm:p-[24px] flex flex-col gap-[10px] max-w-[1200px] min-[1600px]:max-w-[1400px] mx-auto w-full">
            <div className="sm:hidden flex items-center gap-[10px]">
              <Image
                src="/images/v2/play/leaderboard.png"
                alt=""
                width={36}
                height={36}
                className="w-[36px] h-[36px] object-contain shrink-0"
              />
              <h1 className="font-extrabold text-[22px] text-[#111827]">Leaderboard</h1>
            </div>

            <div className="bg-white sm:bg-[#E6F7FE] sm:bg-[url('/images/v2/leaderboard/background.png')] bg-no-repeat bg-cover bg-center p-3 sm:p-7 rounded-3xl">

            <div className="pb-3">
               <LeaderboardTopStats elo={myElo} rank={myRank} movedUp={leaderboard?.moved_up ?? null} />
            </div>
              <LeaderboardList
                entries={displayedEntries}
                myRank={myRank}
                isLoading={isLoading && (!leaderboardEntries || leaderboardEntries.length === 0)}
              />

              <div className="pt-4"><LeaderboardNextGame userElo={myElo} /></div>
            </div>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
