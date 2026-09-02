"use client";

import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { useEffectiveElo } from "@/components/v2/hooks/useEffectiveElo";
import type { LeaderboardShareSpec } from "@/components/v2/share-image-canvas";

export interface MappedLeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  rankChange: number | null;
  isMe: boolean;
  avatarUrl: string | null;
}

const PLACEHOLDER_SCORES = [
  2710, 2680, 2680, 2680, 2680, 2710, 2680, 2680, 2680, 2680,
];

export function buildPlaceholderEntries(
  myRank: number,
  myElo: number,
  myUsername: string
): MappedLeaderboardEntry[] {
  return PLACEHOLDER_SCORES.map((score, i) => {
    const rank = i + 1;
    const isMe = rank === myRank;
    return {
      rank,
      username: isMe ? myUsername : "[Username]",
      score: isMe && myElo ? myElo : score,
      rankChange:
        rank === 2 ? -1 : rank === 4 ? 2 : rank === 6 ? 1 : rank === 9 ? -3 : null,
      isMe,
      avatarUrl: null,
    };
  });
}

export function extractLeaderboardList(data: any): any[] | null {
  const list =
    data?.entries ?? data?.leaderboard ?? data?.players ?? data?.list ?? null;
  return Array.isArray(list) ? list : null;
}

interface MyIdentity {
  id?: string | number | null;
  username?: string | null;
  imageUrl?: string | null;
}

export function mapLeaderboardEntries(
  list: any[],
  myRank: number | null,
  offset: number,
  me: MyIdentity
): MappedLeaderboardEntry[] {
  return list.map((item: any, i: number) => {
    const rank = item.rank ?? offset + i + 1;
    const apiIsMe = item.is_me ?? item.isMe;
    const isMe =
      typeof apiIsMe === "boolean"
        ? apiIsMe
        : (me.id != null && (item.id === me.id || item.user_id === me.id)) ||
          (!!me.username && item.username === me.username) ||
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
        (isMe ? me.imageUrl ?? null : null),
    };
  });
}

export function useLeaderboardShareSpec(): LeaderboardShareSpec {
  const { profile } = useProfileStore();
  const { leaderboard } = usePlayPageStore();
  const effectiveElo = useEffectiveElo();

  return {
    kind: "leaderboard",
    username: profile?.username || profile?.name || "You",
    elo: leaderboard?.my_elo || effectiveElo,
    rank: leaderboard?.my_rank ?? 0,
    totalPlayers: leaderboard?.total ?? null,
    avatarUrl: profile?.imageUrl ?? null,
  };
}
