import { usePlayPageStore } from "@/app/store/playPage";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { transformApiDataToComponentFormat } from "@/components/game-history/hooks/useGameData";

/** How many rows the Recent Games card on /play shows. */
export const RECENT_GAMES_LIMIT = 5;

/**
 * Reload the Recent Games rows straight into the play-page store.
 *
 * Shared rather than living in PlayPage because the page is not the only thing
 * that invalidates the list. Games finished offline are queued and sent later
 * by PendingGameSavesHost, from whatever page the player happens to be on, and
 * until this ran there the card kept showing the pre-outage five — the newly
 * saved games missing from the one place the player goes to look for them.
 *
 * Never rejects: a failed refresh leaves the previous rows in place, which is
 * where the page was before.
 */
export async function refreshRecentGames(
  sessionId: string | null
): Promise<void> {
  if (!sessionId) return;

  try {
    const res: any = await gameHistoryApi.getUserGames(sessionId, {
      sources: ["chesscom", "vs_ai", "pgn_upload"],
      limit: RECENT_GAMES_LIMIT,
      page: 1,
    });
    if (!res?.data) return;
    usePlayPageStore
      .getState()
      .setRecentGames(
        transformApiDataToComponentFormat(
          Array.isArray(res.data) ? res.data.slice(0, RECENT_GAMES_LIMIT) : []
        )
      );
  } catch {
    // Offline, or the server said no. The rows already on screen stay.
  }
}
