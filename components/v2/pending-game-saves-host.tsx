"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import {
  getLocalDateStamp,
  recordStreakPlayOnce,
  useStreakStore,
} from "@/app/store/streak";
import { invalidateRatingCaches } from "@/app/training-plan/store";
import {
  isPendingSaveClaimed,
  usePendingGameSaves,
} from "@/app/store/pendingGameSaves";
import { isOfflineError } from "./offline-status";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

/**
 * Sends games that were finished while offline, once there is a connection.
 *
 * Mounted globally (app/layout.tsx) rather than on the board, because that is
 * the whole point: the player is free to leave the page the moment a game
 * ends, and the queue has to outlive it. From here a game saved on the board
 * lands even if the player has walked off to the Leaderboard, closed the tab
 * and come back tomorrow, or played three more games in the meantime.
 *
 * It replays only the durable half of PlayingPage's handleSaveLog — the calls
 * that put data on the server. The rest of that function is board UI (the
 * result modal's rating change, the analysis PGN, the move log) and has no
 * meaning on whatever page the player is actually looking at.
 */
export function PendingGameSavesHost() {
  const queue = usePendingGameSaves((state) => state.queue);
  const remove = usePendingGameSaves((state) => state.remove);
  const noteFailure = usePendingGameSaves((state) => state.noteFailure);
  const isOnline = useOnlineStatus();
  const { sessionId } = useProfileStore();
  const { setLeaderboard, setLeaderboardMe } = usePlayPageStore();
  const {
    postVSAILogs,
    postLeaderboardGameResult,
    recordStreakPlay,
    getLeaderboardData,
    getLeaderboardMe,
  } = useApiClient();

  const flushingRef = useRef(false);

  // Everything the flush reads, held so the effect can depend on the queue and
  // the connection alone. useApiClient hands back new function identities on
  // most renders, and listing them would restart the flush mid-run.
  const depsRef = useRef({
    postVSAILogs,
    postLeaderboardGameResult,
    recordStreakPlay,
    getLeaderboardData,
    getLeaderboardMe,
    setLeaderboard,
    setLeaderboardMe,
    remove,
    noteFailure,
  });
  depsRef.current = {
    postVSAILogs,
    postLeaderboardGameResult,
    recordStreakPlay,
    getLeaderboardData,
    getLeaderboardMe,
    setLeaderboard,
    setLeaderboardMe,
    remove,
    noteFailure,
  };

  useEffect(() => {
    if (!isOnline || !sessionId || flushingRef.current) return;

    // Claimed entries belong to an open board that is retrying them itself.
    const due = queue.filter((entry) => !isPendingSaveClaimed(entry.id));
    if (due.length === 0) return;

    flushingRef.current = true;

    const run = async () => {
      const api = depsRef.current;
      let saved = 0;

      // One at a time and in order, so the games land in the order they were
      // played and a dead connection is discovered once rather than per game.
      for (const entry of due) {
        try {
          const res: any = await api.postVSAILogs(entry.body);

          if (!entry.isTutorial) {
            const gameId = res?.data?.game_id ?? res?.data?.id ?? null;
            if (gameId) {
              // The call that actually moves the rating. A failure here is not
              // worth re-sending the game log for — that would duplicate the
              // game to fix a missing rating change — so it is swallowed.
              await api
                .postLeaderboardGameResult({
                  game_id: String(gameId),
                  used_hint: entry.usedHint,
                })
                .catch(() => null);
            }
          }

          api.remove(entry.id);
          saved += 1;
        } catch (error) {
          if (isOfflineError(error)) {
            // Still nothing out there. Leave this and everything behind it
            // untouched, attempts included: an outage is not the entry's
            // fault and must not count against its budget.
            break;
          }
          // A real refusal from the server. Count it, and stop rather than
          // marching the rest of the queue into the same wall.
          api.noteFailure(entry.id);
          break;
        }
      }

      if (saved === 0) return;

      // Below here is the "and now the rest of the app is stale" work, done
      // once for the whole batch rather than per game.
      invalidateRatingCaches();

      const today = getLocalDateStamp();
      if (useStreakStore.getState().lastPlayDate !== today) {
        try {
          const res: any = await recordStreakPlayOnce(() =>
            api.recordStreakPlay()
          );
          if (res?.success) {
            const store = useStreakStore.getState();
            store.setLastPlayDate(today);
            store.setStatus(res.data);
            const newStreak = res.data?.currentStreak ?? 0;
            // Marked as already seen deliberately: the celebration belongs to
            // the end of a game, and firing it here would drop a modal on
            // whatever unrelated page the player happens to be reading.
            store.setLastSeenStreak(newStreak);
            usePlayPageStore.getState().setStreak(newStreak);
          }
        } catch {
          // lastPlayDate stays unset, so the next finished game claims the day.
        }
      }

      const [lb, me]: any[] = await Promise.all([
        api.getLeaderboardData().catch(() => null),
        api.getLeaderboardMe().catch(() => null),
      ]);
      if (lb?.success && lb.data) api.setLeaderboard(lb.data);
      if (me?.data) api.setLeaderboardMe(me.data);

      toast.success(
        saved === 1
          ? "Your offline game has been saved."
          : `${saved} offline games have been saved.`
      );
    };

    run()
      .catch(() => {})
      .finally(() => {
        flushingRef.current = false;
      });
  }, [isOnline, queue, sessionId]);

  return null;
}
