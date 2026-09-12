"use client";

import { useEffect, useMemo, useState } from "react";
import { ShareImageSheet } from "@/components/v2/share-image-sheet";
import { useLeaderboardShareSpec } from "@/components/v2/leaderboard-share";
import { useProfileStore } from "@/app/store/profile";
import { usePlayPageStore } from "@/app/store/playPage";
import { useApiClient } from "@/functions/api-client";
import { gameHistoryApi } from "@/components/game-history/services/api";
import { transformApiDataToComponentFormat } from "@/components/game-history/hooks/useGameData";
import {
  shareCardMeta,
  shareCardUrl,
  type GameResult,
  type ShareCardSpec,
} from "@/components/v2/share-link";

/**
 * QA hook for the share flow, at /share-preview.
 *
 * Every row opens the REAL ShareImageSheet, so the card render and the
 * WhatsApp / X / Facebook buttons behave exactly as they do after a game —
 * nothing here is a mock, and anything opened from this page can be sent to a
 * real chat.
 *
 * Two groups:
 *  - "Your real games" is built from the signed-in account: the leaderboard
 *    card comes from useLeaderboardShareSpec() (the same hook the Share button
 *    on /play uses), and each result card comes from a real finished vs-AI
 *    game — real opponent, real ELO change, real outcome.
 *  - "Fixed scenarios" covers the copy for win / lose / draw regardless of what
 *    is in the account, so all three captions can be checked even when the
 *    history has no draw in it.
 *
 * Not linked from anywhere and needs a signed-in session (it is not in the
 * middleware's public route list, deliberately — it stays off the public
 * surface in production).
 */

/** The API spells a loss "loss"; the share card calls it "lose". */
const toGameResult = (raw: unknown): GameResult => {
  const value = String(raw ?? "").toLowerCase();
  if (value === "win") return "win";
  if (value === "loss" || value === "lose") return "lose";
  return "draw";
};

const FIXED: { label: string; note: string; spec: ShareCardSpec }[] = [
  {
    label: "Win",
    note: "named opponent, ELO up",
    spec: { kind: "result", result: "win", elo: 412, delta: 12, opponentName: "Lisa", opponentElo: 400 },
  },
  {
    label: "Loss",
    note: "named opponent, ELO down",
    spec: { kind: "result", result: "lose", elo: 388, delta: -9, opponentName: "Igor", opponentElo: 800 },
  },
  {
    label: "Draw",
    note: "ELO unchanged",
    spec: { kind: "result", result: "draw", elo: 400, delta: 0, opponentName: "Naomi", opponentElo: 900 },
  },
  {
    label: "Win, no opponent named",
    note: "shorter card — exercises the 1281px height variant",
    spec: { kind: "result", result: "win", elo: 250, delta: 7 },
  },
];

function Row({
  label,
  note,
  spec,
  onOpen,
}: {
  label: string;
  note: string;
  spec: ShareCardSpec;
  onOpen: (spec: ShareCardSpec) => void;
}) {
  const meta = shareCardMeta(spec);
  // window is not available while this renders on the server.
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const url = shareCardUrl(spec, origin);

  return (
    <section className="mt-[20px] rounded-2xl border border-[#E5E7EB] p-[16px]">
      <div className="flex flex-wrap items-baseline gap-x-[10px]">
        <h3 className="text-[16px] font-bold text-[#111827]">{label}</h3>
        <span className="text-[13px] text-[#9CA3AF]">{note}</span>
      </div>

      <div className="mt-[12px] flex flex-col gap-[14px] sm:flex-row">
        <div className="min-w-0 flex-1">
          <p className="mb-[6px] text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">
            WhatsApp / X / native share
          </p>
          {/* pre-wrap so the blank lines in the copy show as written */}
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#F9FAFB] p-[12px] text-[13px] leading-[1.5] text-[#111827]">
            {`${meta.text}\n\n\u{1F449} ${url}`}
          </pre>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-[6px] text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF]">
            Facebook (link goes in its own u= param)
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#F9FAFB] p-[12px] text-[13px] leading-[1.5] text-[#111827]">
            {meta.text}
          </pre>
        </div>
      </div>

      <div className="mt-[14px] flex flex-wrap items-center gap-[10px]">
        <button
          type="button"
          onClick={() => onOpen(spec)}
          className="rounded-full bg-[#221AE9] px-[20px] py-[9px] text-[14px] font-semibold text-white"
        >
          Open share sheet
        </button>
        <a
          href={url || "#"}
          className="rounded-full border border-[#221AE9] px-[20px] py-[9px] text-[14px] font-semibold text-[#221AE9]"
        >
          Open /s link (should redirect home)
        </a>
      </div>
    </section>
  );
}

export default function SharePreviewPage() {
  const [open, setOpen] = useState<ShareCardSpec | null>(null);
  const { sessionId, profile } = useProfileStore();
  const { leaderboard, setLeaderboard } = usePlayPageStore();
  const { getLeaderboardData } = useApiClient();
  const leaderboardSpec = useLeaderboardShareSpec();

  const [games, setGames] = useState<any[] | null>(null);
  const [gamesError, setGamesError] = useState<string | null>(null);

  // Same two reads /play does, so the cards carry the same numbers the app
  // would put on them. Both are no-ops when the stores are already warm.
  useEffect(() => {
    if (!sessionId) return;

    if (!leaderboard) {
      getLeaderboardData()
        .then((data: any) => {
          if (data?.success) setLeaderboard(data.data);
        })
        .catch(() => {});
    }

    gameHistoryApi
      .getUserGames(sessionId, { sources: ["vs_ai"], limit: 10, page: 1 })
      .then((res: any) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setGames(transformApiDataToComponentFormat(list));
      })
      .catch((error: unknown) => {
        setGamesError(error instanceof Error ? error.message : "Could not load your games");
        setGames([]);
      });
    // getLeaderboardData/setLeaderboard are stable enough here; re-running on
    // them would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  /** One result card per real finished game. */
  const realResults = useMemo(() => {
    if (!games) return [];
    // The card's `elo` is "your rating after this game". History doesn't carry
    // that per row, so the live rating is used — right for the newest game,
    // approximate for older ones. Called out in the UI rather than hidden.
    const myElo = leaderboard?.my_elo || leaderboardSpec.elo || 0;

    return games.slice(0, 6).map((game: any) => {
      const result = toGameResult(game.result);
      const delta = Number(String(game.eloChange ?? "0").replace("+", "")) || 0;
      const opponentElo = Number(game.rating) || undefined;
      return {
        label: `${result === "win" ? "Win" : result === "lose" ? "Loss" : "Draw"} vs ${game.opponent || "Unknown"}`,
        note: `real game · ${game.date ?? ""} · ELO change ${delta > 0 ? `+${delta}` : delta}`,
        spec: {
          kind: "result",
          result,
          elo: myElo,
          delta,
          opponentName: game.opponent || undefined,
          opponentElo,
        } as ShareCardSpec,
      };
    });
  }, [games, leaderboard, leaderboardSpec.elo]);

  const signedOut = !sessionId;

  return (
    <main className="mx-auto max-w-[900px] px-[20px] py-[40px]">
      <h1 className="text-[24px] font-bold text-[#111827]">Share preview</h1>
      <p className="mt-[6px] text-[14px] text-[#6B7280]">
        QA page. Every row uses the real share sheet and the real caption
        builder, so anything you open here can be sent to a real chat.
      </p>

      {signedOut && (
        <p className="mt-[16px] rounded-xl bg-[#FEF3C7] p-[12px] text-[14px] text-[#92400E]">
          Not signed in — only the fixed scenarios below will work. Sign in to
          see cards built from your own rank and games.
        </p>
      )}

      {!signedOut && (
        <>
          <h2 className="mt-[32px] text-[19px] font-bold text-[#111827]">
            Your real games
          </h2>
          <p className="mt-[4px] text-[13px] text-[#6B7280]">
            Signed in as {profile?.username || profile?.name || "—"} · rank{" "}
            {leaderboardSpec.rank || "—"} · ELO {leaderboardSpec.elo || "—"}.
            Result cards show your live rating, which is exact for your latest
            game and approximate for older ones.
          </p>

          <Row
            label="Leaderboard — your standing"
            note="the same spec the Share button on /play sends"
            spec={leaderboardSpec}
            onOpen={setOpen}
          />

          {games === null && (
            <p className="mt-[16px] text-[14px] text-[#6B7280]">Loading your games…</p>
          )}
          {gamesError && (
            <p className="mt-[16px] rounded-xl bg-[#FEE2E2] p-[12px] text-[14px] text-[#991B1B]">
              {gamesError}
            </p>
          )}
          {games !== null && !gamesError && realResults.length === 0 && (
            <p className="mt-[16px] text-[14px] text-[#6B7280]">
              No finished vs-AI games on this account yet — play one, or use the
              fixed scenarios below.
            </p>
          )}

          {realResults.map((r, i) => (
            <Row key={`${r.label}-${i}`} {...r} onOpen={setOpen} />
          ))}
        </>
      )}

      <h2 className="mt-[40px] text-[19px] font-bold text-[#111827]">
        Fixed scenarios
      </h2>
      <p className="mt-[4px] text-[13px] text-[#6B7280]">
        Invented data, so every caption can be checked even if your history has
        no draw in it.
      </p>
      {FIXED.map((s) => (
        <Row key={s.label} {...s} onOpen={setOpen} />
      ))}

      {open && <ShareImageSheet spec={open} onClose={() => setOpen(null)} />}
    </main>
  );
}
