"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navigation from "@/components/navigator/navigation";
import { LeaderboardTopStats } from "@/components/v2/leaderboard-top-stats";
import { LeaderboardList, type LeaderboardEntry } from "@/components/v2/leaderboard-list";
import { LeaderboardNextGame } from "@/components/v2/leaderboard-next-game";
import { LeaderboardJoinModal } from "@/components/v2/leaderboard-join-modal";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { useApiClient } from "@/functions/api-client";

const PLACEHOLDER_SCORES = [2710, 2680, 2680, 2680, 2680, 2710, 2680, 2680, 2680, 2680];

// Leaderboard rows are fetched in pages of this size and appended as the
// user scrolls (infinite scroll) instead of loading the whole list at once.
const PAGE_SIZE = 20;

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
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageRef = useRef(1);
  // Single-flight guard so a fast scroll can't fire overlapping page fetches.
  const fetchingMoreRef = useRef(false);

  const mapEntries = useCallback(
    (list: any[], myRank: number | null, offset: number) =>
      list.map((item: any, i: number) => {
        const isMe =
          item.is_me ?? item.isMe ?? (myRank !== null && item.rank === myRank);
        return {
          rank: item.rank ?? offset + i + 1,
          username: item.username ?? item.name ?? "[Username]",
          score: item.score ?? item.elo ?? 0,
          rankChange: item.rank_change ?? item.rankChange ?? null,
          isMe,
          avatarUrl:
            item.image_url ??
            item.imageUrl ??
            item.avatar_url ??
            item.avatar ??
            item.profile_picture ??
            (isMe ? profile?.imageUrl ?? null : null),
        };
      }),
    [profile?.imageUrl]
  );

  const extractList = (data: any): any[] | null => {
    const list =
      data?.entries ?? data?.leaderboard ?? data?.players ?? data?.list ?? null;
    return Array.isArray(list) ? list : null;
  };

  useEffect(() => {
    if (!sessionId) return;

    getLeaderboardData({ page: 1, limit: PAGE_SIZE })
      .then((data: any) => {
        if (!data?.success) return;
        if (data.data) setLeaderboard(data.data);

        const list = extractList(data.data);
        const myRank = data.data?.my_rank ?? null;
        if (list && list.length > 0) {
          setLeaderboardEntries(mapEntries(list, myRank, 0));
          pageRef.current = 1;
          // A short first page means there's nothing further to fetch.
          setHasMore(list.length >= PAGE_SIZE);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    getLeaderboardMe()
      .then((res: any) => { if (res?.data) setLeaderboardMe(res.data); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadMore = useCallback(() => {
    if (fetchingMoreRef.current || !hasMore || isLoading) return;
    fetchingMoreRef.current = true;
    setIsLoadingMore(true);

    const nextPage = pageRef.current + 1;
    getLeaderboardData({ page: nextPage, limit: PAGE_SIZE })
      .then((data: any) => {
        if (!data?.success) {
          setHasMore(false);
          return;
        }
        const list = extractList(data.data);
        if (!list || list.length === 0) {
          setHasMore(false);
          return;
        }
        const current = usePlayPageStore.getState().leaderboardEntries ?? [];
        const myRank = data.data?.my_rank ?? null;
        const mapped = mapEntries(list, myRank, current.length);
        // Dedupe by rank — also stops the scroll if the backend ignores the
        // page param and keeps returning the same rows.
        const seen = new Set(current.map((e) => e.rank));
        const fresh = mapped.filter((e) => !seen.has(e.rank));
        if (fresh.length === 0) {
          setHasMore(false);
          return;
        }
        setLeaderboardEntries([...current, ...fresh]);
        pageRef.current = nextPage;
        if (list.length < PAGE_SIZE) setHasMore(false);
      })
      .catch(() => {})
      .finally(() => {
        fetchingMoreRef.current = false;
        setIsLoadingMore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading, mapEntries]);

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
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMore}
              />

              <div className="pt-4"><LeaderboardNextGame userElo={myElo} /></div>
            </div>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
