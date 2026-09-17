import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentAccountScope } from "@/app/store/account-scope";

/** One finished game that never reached the backend, held until it can be. */
export interface PendingGameSave {
  id: string;
  createdAt: number;
  /** The account that played it, as an account scope key.
   *
   *  The replay sends the game with whatever bearer token is signed in at the
   *  time, and the queue outlives a sign-out — so without this, a game played
   *  offline by one account and flushed after somebody else signed in on the
   *  same browser landed on *their* record: their Recent Games, their rating,
   *  and a day streak they never played for. Stamped here, at the moment the
   *  game is queued, because that is the only moment the owner is known for
   *  certain. */
  owner: string;
  /** Exactly the body postVSAILogs takes, captured at the moment the game
   *  ended. Stored whole rather than rebuilt later: by the time this is
   *  replayed the board has usually moved on to another game. */
  body: {
    enemyTag: string;
    eloRating: string;
    totalMoves: number;
    totalTime: string;
    status: string;
    pgn: string;
  };
  usedHint: boolean;
  isTutorial: boolean;
  /** Failed replays so far. Caps how long a game the backend will never accept
   *  can keep coming back — see MAX_ATTEMPTS. */
  attempts: number;
}

/** After this many failed replays the entry is dropped. Without a cap, one
 *  game the server refuses on its own terms (a malformed PGN, a deleted
 *  account) would be retried on every reconnect for the life of the browser
 *  profile, and would block every game queued behind it. */
export const MAX_ATTEMPTS = 5;

interface PendingGameSavesState {
  queue: PendingGameSave[];
  /** Adds a game, or returns the existing id if this exact game is already
   *  queued. The dedupe is the backstop against double-logging: the save path
   *  can be entered more than once for one game (the status effect, then a
   *  retry), and two rows for one game is the worst outcome here. */
  enqueue: (
    save: Omit<PendingGameSave, "id" | "createdAt" | "attempts" | "owner">
  ) => string;
  remove: (id: string) => void;
  /** Records a failed replay, dropping the entry once it is out of attempts. */
  noteFailure: (id: string) => void;
}

/**
 * Games finished while offline, waiting to be sent.
 *
 * Persisted, and deliberately outside the board: the retry used to live in
 * PlayingPage's own state, so leaving the page — which the player is free to
 * do the moment the game ends — threw the game away. Everything the replay
 * needs is in here, so it survives navigation and a reload, and a session that
 * plays several games offline queues all of them.
 */
export const usePendingGameSaves = create<PendingGameSavesState>()(
  persist(
    (set, get) => ({
      queue: [],
      enqueue: (save) => {
        // Empty only if the profile has not loaded, which cannot happen on a
        // board that has just finished a game. It would never match a real
        // owner, so such an entry is held rather than misdelivered.
        const owner = currentAccountScope() ?? "";

        const existing = get().queue.find(
          (entry) =>
            entry.owner === owner &&
            entry.body.pgn === save.body.pgn &&
            entry.body.status === save.body.status
        );
        if (existing) return existing.id;

        const id = `pending-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`;
        set((state) => ({
          queue: [
            ...state.queue,
            { ...save, id, owner, createdAt: Date.now(), attempts: 0 },
          ],
        }));
        return id;
      },
      remove: (id) =>
        set((state) => ({
          queue: state.queue.filter((entry) => entry.id !== id),
        })),
      noteFailure: (id) =>
        set((state) => ({
          queue: state.queue.flatMap((entry) => {
            if (entry.id !== id) return [entry];
            const attempts = entry.attempts + 1;
            return attempts >= MAX_ATTEMPTS
              ? []
              : [{ ...entry, attempts }];
          }),
        })),
    }),
    {
      name: "aroundchess:pending-game-saves",
      version: 1,
      /** v0 entries carry no owner, and there is no way to work out after the
       *  fact whose they were. Replaying one is a coin toss that can write a
       *  game, a rating change and a day streak onto the wrong account, so
       *  they are dropped. Only games queued before this shipped are affected
       *  — a window of hours on a feature still in testing — and dropping them
       *  is the same outcome as the outage never ending. */
      migrate: (persisted: any) => ({ ...(persisted ?? {}), queue: [] }),
    }
  )
);

/**
 * Entries the open board is handling itself.
 *
 * In memory only, and never persisted — a claim means "a mounted PlayingPage
 * is retrying this one", which cannot outlive the page that made it. It stops
 * the two retry paths from both sending the same game: the board keeps its own
 * flow (it needs the response to show the rating change), and the background
 * flush takes over the moment the board unmounts or starts another game.
 */
const claimed = new Set<string>();

export function claimPendingSave(id: string): void {
  claimed.add(id);
}

export function releasePendingSave(id: string): void {
  claimed.delete(id);
}

export function isPendingSaveClaimed(id: string): boolean {
  return claimed.has(id);
}
