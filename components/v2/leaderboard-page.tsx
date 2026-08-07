"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navigation from "@/components/navigator/navigation";
import { LeaderboardTopStats } from "@/components/v2/leaderboard-top-stats";
import { LeaderboardList, type LeaderboardEntry } from "@/components/v2/leaderboard-list";
import { LeaderboardNextGame } from "@/components/v2/leaderboard-next-game";
import { useEffectiveElo } from "@/components/v2/hooks/useEffectiveElo";
import { LeaderboardJoinModal } from "@/components/v2/leaderboard-join-modal";
import { ShareRankButton } from "@/components/v2/share-rank-button";
import {
  buildPlaceholderEntries,
  extractLeaderboardList,
  mapLeaderboardEntries,
} from "@/components/v2/leaderboard-share";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { useApiClient } from "@/functions/api-client";

const PAGE_SIZE = 20;

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
  const [isJumping, setIsJumping] = useState(false);
  const [initialLoadNonce, setInitialLoadNonce] = useState(0);
  const pageRef = useRef(1);
  const fetchingMoreRef = useRef(false);

  const mapEntries = useCallback(
    (list: any[], myRank: number | null, offset: number) =>
      mapLeaderboardEntries(list, myRank, offset, {
        id: profile?.id,
        username: profile?.username,
        imageUrl: profile?.imageUrl,
      }),
    [profile?.imageUrl, profile?.id, profile?.username]
  );

  const extractList = extractLeaderboardList;

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
          setHasMore(list.length >= PAGE_SIZE);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
        setInitialLoadNonce((n) => n + 1);
      });

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

  const jumpToMyRank = useCallback(async (): Promise<boolean> => {
    const state = usePlayPageStore.getState();
    const rank = state.leaderboard?.my_rank ?? 0;
    if (!rank) return false;

    if ((state.leaderboardEntries ?? []).some((e) => e.isMe || e.rank === rank)) {
      return true;
    }

    setIsJumping(true);
    try {
      const targetPage = Math.max(1, Math.ceil(rank / PAGE_SIZE));
      const startPage = Math.max(1, targetPage - 1);
      const pages: number[] = [];
      for (let p = startPage; p <= targetPage; p++) pages.push(p);

      const results = await Promise.all(
        pages.map((p) => getLeaderboardData({ page: p, limit: PAGE_SIZE }).catch(() => null))
      );

      const merged: ReturnType<typeof mapEntries> = [];
      const seen = new Set<number>();
      let lastPageFull = false;
      for (const data of results) {
        if (!data?.success) continue;
        const list = extractList(data.data);
        if (!list) continue;
        lastPageFull = list.length >= PAGE_SIZE;
        for (const entry of mapEntries(list, rank, 0)) {
          if (!seen.has(entry.rank)) {
            seen.add(entry.rank);
            merged.push(entry);
          }
        }
      }

      if (!merged.some((e) => e.isMe)) return false;

      merged.sort((a, b) => a.rank - b.rank);
      setLeaderboardEntries(merged);
      pageRef.current = targetPage;
      setHasMore(lastPageFull);
      return true;
    } catch {
      return false;
    } finally {
      setIsJumping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLeaderboardData, mapEntries]);

  const resetToTop = useCallback(async (): Promise<boolean> => {
    try {
      const data = await getLeaderboardData({ page: 1, limit: PAGE_SIZE });
      if (!data?.success) return false;
      const list = extractList(data.data);
      if (!list || list.length === 0) return false;
      const rank = data.data?.my_rank ?? null;
      setLeaderboardEntries(mapEntries(list, rank, 0));
      pageRef.current = 1;
      setHasMore(list.length >= PAGE_SIZE);
      return true;
    } catch {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLeaderboardData, mapEntries]);

  const username = profile?.username || profile?.name || "You";
  const myElo = leaderboard?.my_elo ?? 0;
  const effectiveElo = useEffectiveElo();
  const myRank = leaderboard?.my_rank ?? 0;
  const totalPlayers = leaderboard?.total ?? null;

  const displayedEntries = useMemo<LeaderboardEntry[]>(
    () =>
      leaderboardEntries && leaderboardEntries.length > 0
        ? leaderboardEntries
        : buildPlaceholderEntries(myRank, myElo, username),
    [leaderboardEntries, myRank, myElo, username]
  );

  const isInactive =
    previewModal === "inactive" ||
    (previewModal !== "join" &&
      leaderboardMe !== null &&
      leaderboardMe.can_join === false &&
      leaderboardMe.is_inactive === true);
  const needsMoreGames =
    previewModal === "join" ||
    (previewModal !== "inactive" &&
      !isInactive &&
      leaderboardMe !== null &&
      leaderboardMe.can_join === false &&
      (leaderboardMe.games_remaining ?? 0) <= 5);

  const joinModalContent = isInactive
    ? {
        title: "Join the Leaderboard again!",
        description:
          "You haven't played in the past 7 days. Start playing again and be back in the game. Don't worry - your previous results are still there!",
        image: "/images/v2/leaderboard/leaderboard_join_again.png",
      }
    : needsMoreGames
    ? {
        title: `Play ${leaderboardMe?.games_remaining ?? 3} more ${
          (leaderboardMe?.games_remaining ?? 3) === 1 ? "game" : "games"
        } to join the Leaderboard.`,
        description:
          "Your ELO score is still being calculated. Complete 5 games to unlock your rating and claim your spot on the leaderboard.",
        image: "/images/v2/leaderboard/leaderboard_search.png",
      }
    : null;

  return (
    <div className="flex overflow-hidden bg-primary-white">
      {joinModalContent && showJoinModal && (
        <LeaderboardJoinModal
          title={joinModalContent.title}
          description={joinModalContent.description}
          image={joinModalContent.image}
          onBack={() => {
            setShowJoinModal(false);
            router.back();
          }}
          onPlayNow={() => {
            setShowJoinModal(false);
            router.push("/play#play-vs-ai");
          }}
        />
      )}

      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="p-[10px] sm:p-[24px] flex flex-col gap-[10px] max-w-[1200px] min-[1600px]:max-w-[1400px] mx-auto w-full">
            <div className="sm:hidden flex items-center gap-[10px]">
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Go back"
                className="shrink-0 -ml-[2px] p-[2px] text-[#111827]"
              >
                <ArrowLeft size={24} strokeWidth={2.5} />
              </button>
              <Image
                src="/images/v2/play/leaderboard.png"
                alt=""
                width={36}
                height={36}
                className="w-[36px] h-[36px] object-contain shrink-0"
              />
              <h1 className="font-extrabold text-[22px] text-[#111827]">Leaderboard</h1>
              <ShareRankButton className="ml-auto" />
            </div>

            <div className="bg-white sm:bg-[#E6F7FE] sm:bg-[url('/images/v2/leaderboard/background.png')] bg-no-repeat bg-cover bg-center p-3 sm:p-7 rounded-3xl">

            <div className="pb-3">
               <LeaderboardTopStats elo={myElo} rank={myRank} movedUp={leaderboard?.moved_up ?? null} />
            </div>
              <LeaderboardList
                entries={displayedEntries}
                myRank={myRank}
                totalPlayers={totalPlayers}
                isLoading={isLoading && (!leaderboardEntries || leaderboardEntries.length === 0)}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMore}
                onJumpToMyRank={jumpToMyRank}
                isJumpingToMyRank={isJumping}
                onResetToTop={resetToTop}
                autoJumpNonce={initialLoadNonce}
              />

              <div className="pt-4"><LeaderboardNextGame userElo={effectiveElo} /></div>
            </div>
          </div>
        </Navigation>
      </div>
    </div>
  );
}
