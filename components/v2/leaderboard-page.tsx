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
  const [isJumping, setIsJumping] = useState(false);
  // Ticks once the initial page-1 fetch settles. The list arms its automatic
  // "jump to my rank" off this rather than off isLoading: persisted entries
  // make isLoading false on the very first render, so the jump used to run
  // against last session's rows and get overwritten by the fresh page 1.
  const [initialLoadNonce, setInitialLoadNonce] = useState(0);
  const pageRef = useRef(1);
  // Single-flight guard so a fast scroll can't fire overlapping page fetches.
  const fetchingMoreRef = useRef(false);

  const mapEntries = useCallback(
    (list: any[], myRank: number | null, offset: number) =>
      list.map((item: any, i: number) => {
        const rank = item.rank ?? offset + i + 1;
        // Prefer the backend's own flag; otherwise identify "me" by id or
        // username. Rank is only a last resort — my_rank can drift from where
        // the row actually lands and highlight the wrong player.
        const apiIsMe = item.is_me ?? item.isMe;
        const myId = profile?.id;
        const myUsername = profile?.username;
        const isMe =
          typeof apiIsMe === "boolean"
            ? apiIsMe
            : (myId != null && (item.id === myId || item.user_id === myId)) ||
              (!!myUsername && item.username === myUsername) ||
              (myRank !== null && rank === myRank);
        return {
          rank,
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
    [profile?.imageUrl, profile?.id, profile?.username]
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

  // "My Rank" jump. The list is paged, so a deep rank (e.g. 9996) is never in
  // the first pages — fetch the page that contains the user (plus the one
  // above it for context) and replace the list with that neighborhood so the
  // list can center the highlighted row.
  const jumpToMyRank = useCallback(async (): Promise<boolean> => {
    const state = usePlayPageStore.getState();
    const rank = state.leaderboard?.my_rank ?? 0;
    if (!rank) return false;

    // Already loaded — let the list scroll straight to it, no fetch needed.
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

      // The user's own row must be in the fetched neighborhood — otherwise the
      // page param was ignored or my_rank is stale, so bail rather than swap in
      // rows we can't scroll to.
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

  // Scroll-to-top from a "jumped" neighborhood: reload the first page so the
  // list starts at rank #1 again instead of the top of the loaded slice.
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
  // See useEffectiveElo: new accounts have no leaderboard ELO yet.
  const effectiveElo = useEffectiveElo();
  const myRank = leaderboard?.my_rank ?? 0;
  const totalPlayers = leaderboard?.total ?? null;

  const displayedEntries = useMemo(
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
            // the hash makes the play page scroll straight to the Play VS AI card
            router.push("/play#play-vs-ai");
          }}
        />
      )}

      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="p-[10px] sm:p-[24px] flex flex-col gap-[10px] max-w-[1200px] min-[1600px]:max-w-[1400px] mx-auto w-full">
            <div className="sm:hidden flex items-center gap-[10px]">
              {/* Back to the previous screen — mobile has no sidebar to navigate with. */}
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
