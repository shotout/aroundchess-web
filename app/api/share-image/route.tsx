import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { formatEloDelta, formatNumber } from "@/components/v2/format-number";
import {
  ordinalSuffix,
  parseShareCardSpec,
  type GameResult,
  type LeaderboardShareSpec,
  type ResultShareSpec,
} from "@/components/v2/share-link";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

/* The leaderboard card is rendered PORTRAIT so the link preview shows the same
   artwork the share sheet puts on the clipboard (share-image-canvas.ts, which
   outputs exactly 1080x1399). Every offset below is lifted from
   drawLeaderboardCard() so the two stay in step — change one, change both.
   The result card is still landscape; it needs the same treatment. */
const LB_W = 1080;
const LB_H = 1399;
const RIBBON_ART = "/images/v2/play-vs-ai/flag-exported.png";
/* The backdrop is BAKED, not composed here. drawLeaderboardBackground() in
   share-image-canvas.ts layers a cover-crop with feathered left/right slices of
   the wide source, then blurs and veils it — satori has neither filters nor
   feathered masks, so it cannot reproduce that. This file is the real canvas
   output at 1080x1399, so the preview card and the clipboard card are identical
   by construction rather than by imitation.

   To regenerate after changing the canvas backdrop or LB_W/LB_H: call the
   exported drawLeaderboardBackground(ctx, LB_W, LB_H) on a canvas of that size
   in the browser, export toDataURL("image/png"), then convert to JPEG q88. */
/* JPEG, not PNG: the backdrop is full-bleed with no transparency, and at q88 it
   is 65KB against 891KB as a PNG — worth it because satori fetches and decodes
   it on every cold render, and a crawler that times out shows no preview. */
const LB_BACKDROP = "/images/v2/share/leaderboard-backdrop.jpg";

const COLOR = {
  ink: "#111827",
  body: "#374151",
  muted: "#6B7280",
  blue: "#221AE9",
  green: "#34C759",
  red: "#DC2626",
  white: "#FFFFFF",
  yellow: "#FFD400",
};

const RESULT_ART: Record<GameResult, string> = {
  win: "/images/v2/share/result-win.png",
  lose: "/images/v2/share/result-lose.png",
  draw: "/images/v2/share/result-draw.png",
};

const RESULT_ART_SIZE: Record<GameResult, { w: number; h: number }> = {
  win: { w: 448, h: 376 },
  lose: { w: 370, h: 308 },
  draw: { w: 413, h: 456 },
};

const ART_BOX = 380;

const RESULT_TITLE: Record<GameResult, string> = {
  win: "You Won",
  lose: "You Lost",
  draw: "It's a Draw!",
};

const RESULT_COLOR: Record<GameResult, string> = {
  win: COLOR.green,
  lose: COLOR.red,
  draw: COLOR.blue,
};

const BRAND_LOGO = "/icons/logo.png";
const RESULT_BACKGROUND = "/images/v2/play-vs-ai/background-exported.png";
const CONFETTI = "/images/v2/play-vs-ai/confetti-stars-exported.png";
const FALLBACK_AVATAR = "/images/homepage/v2/homepage_board_asset_4.png";
const BACKGROUND_ALPHA = 0.34;

const FONTS = [
  { file: "AloeveraDisplay-Regular.ttf", weight: 400 as const },
  { file: "AloeveraDisplay-SemiBold.ttf", weight: 600 as const },
  { file: "AloeveraDisplay-Bold.ttf", weight: 700 as const },
];

async function loadFonts(origin: string) {
  const loaded = await Promise.all(
    FONTS.map(async ({ file, weight }) => {
      const res = await fetch(new URL(`/fonts/${file}`, origin));
      if (!res.ok) throw new Error(`Missing font ${file}`);
      return {
        name: "Aloevera",
        data: await res.arrayBuffer(),
        weight,
        style: "normal" as const,
      };
    })
  );
  return loaded;
}

async function inlineAvatar(url: string | null | undefined, origin: string) {
  const fallback = new URL(FALLBACK_AVATAR, origin).toString();
  if (!url) return fallback;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return fallback;
    const type = res.headers.get("content-type") ?? "image/png";
    if (!type.startsWith("image/")) return fallback;
    const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${type};base64,${base64}`;
  } catch {
    return fallback;
  }
}

function Ribbon({ lead }: { lead: string }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: WIDTH,
        height: 84,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLOR.blue,
        fontSize: 30,
        fontWeight: 600,
        color: COLOR.white,
      }}
    >
      <span>{lead}</span>
      <span style={{ fontWeight: 700, color: COLOR.yellow, marginLeft: 10 }}>
        AroundChess.com
      </span>
    </div>
  );
}

function EloArrow({ up }: { up: boolean }) {
  return (
    <svg width={34} height={34} viewBox="0 0 20 20">
      {up ? (
        <path d="M10 2L17 10H13V15H7V10H3L10 2Z M7 16.5H13V18.3H7Z" fill={COLOR.white} />
      ) : (
        <path d="M10 18L3 10H7V5H13V10H17L10 18Z M7 1.7H13V3.5H7Z" fill={COLOR.white} />
      )}
    </svg>
  );
}

function EloPill({
  elo,
  delta,
  accent,
}: {
  elo: number;
  delta: number;
  accent: string;
}) {
  const gained = delta >= 0;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: accent,
          borderRadius: 24,
          padding: "14px 30px",
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 600, color: COLOR.white }}>
          Your Current ELO
        </span>
        <div style={{ display: "flex", marginLeft: 18 }}>
          <EloArrow up={gained} />
        </div>
        <span
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: COLOR.white,
            marginLeft: 10,
          }}
        >
          {Math.round(elo)}
        </span>
      </div>
      <span
        style={{
          fontSize: 38,
          fontWeight: 700,
          marginLeft: 18,
          color: delta === 0 ? COLOR.muted : gained ? COLOR.green : COLOR.red,
        }}
      >
        {formatEloDelta(delta)}
      </span>
    </div>
  );
}

function ResultCard({
  spec,
  asset,
}: {
  spec: ResultShareSpec;
  asset: (path: string) => string;
}) {
  const accent =
    spec.result === "win"
      ? COLOR.green
      : spec.result === "lose"
        ? COLOR.red
        : spec.delta >= 0
          ? COLOR.green
          : COLOR.red;

  const intrinsic = RESULT_ART_SIZE[spec.result];
  const scale = Math.min(ART_BOX / intrinsic.w, ART_BOX / intrinsic.h);
  const art = {
    w: Math.round(intrinsic.w * scale),
    h: Math.round(intrinsic.h * scale),
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: COLOR.white,
        fontFamily: "Aloevera",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(RESULT_BACKGROUND)}
        alt=""
        width={WIDTH}
        height={HEIGHT}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          objectFit: "cover",
          opacity: BACKGROUND_ALPHA,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: WIDTH,
          height: HEIGHT,
          padding: "0 64px 84px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(RESULT_ART[spec.result])}
          alt=""
          width={art.w}
          height={art.h}
          style={{ width: art.w, height: art.h, borderRadius: 28 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginLeft: 48,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(BRAND_LOGO)}
            alt=""
            width={214}
            height={69}
            style={{ width: 214, height: 69, objectFit: "contain" }}
          />

          <span
            style={{
              fontSize: 78,
              fontWeight: 700,
              color: RESULT_COLOR[spec.result],
              marginTop: 16,
            }}
          >
            {RESULT_TITLE[spec.result]}
          </span>

          {spec.opponentName ? (
            <span style={{ fontSize: 30, color: COLOR.body, marginTop: 8 }}>
              {spec.opponentElo != null
                ? `Against ${spec.opponentName} (ELO ${spec.opponentElo})`
                : `Against ${spec.opponentName}`}
            </span>
          ) : null}

          <div style={{ display: "flex", marginTop: 30 }}>
            <EloPill elo={spec.elo} delta={spec.delta} accent={accent} />
          </div>
        </div>
      </div>

      <Ribbon lead="Challenge more than 70 AI Opponents now on" />
    </div>
  );
}

/** Absolutely-positioned text row. Canvas draws text centred on `top + size/2`,
 *  so a box of exactly `size` tall with the glyphs centred reproduces it. */
function Row({
  top,
  size,
  children,
  weight = 400,
  color = COLOR.body,
}: {
  top: number;
  size: number;
  children: React.ReactNode;
  weight?: 400 | 600 | 700;
  color?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: LB_W,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

function LeaderboardCard({
  spec,
  asset,
  avatar,
}: {
  spec: LeaderboardShareSpec;
  asset: (path: string) => string;
  avatar: string;
}) {
  // Offsets mirror drawLeaderboardCard() one for one.
  const LOGO_W = 300;
  const LOGO_H = Math.round((LOGO_W * 513) / 1592); // 97
  const AVATAR = 268;
  const yLogo = 42;
  const yAvatar = yLogo + LOGO_H + 80; // 219
  const yName = yAvatar + AVATAR + 56; // 543
  const yElo = yName + 68 + 14; // 625
  const yRankLabel = yElo + 42 + 76; // 743
  const yRank = yRankLabel + 52 + 18; // 813
  const yOutOf = yRank + 104 + 24; // 941
  const yRibbon = yOutOf + 44 + 120; // 1105
  const RIBBON_W = 1010;
  const RIBBON_H = Math.round((RIBBON_W * 124) / 680); // 184

  const rank = spec.rank > 0 ? formatNumber(spec.rank) : "—";
  const suffix = spec.rank > 0 ? ordinalSuffix(spec.rank) : "";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: LB_W,
        height: LB_H,
        backgroundColor: COLOR.white,
        fontFamily: "Aloevera",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(LB_BACKDROP)}
        alt=""
        width={LB_W}
        height={LB_H}
        style={{ position: "absolute", top: 0, left: 0 }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(BRAND_LOGO)}
        alt=""
        width={LOGO_W}
        height={LOGO_H}
        style={{ position: "absolute", top: yLogo, left: (LB_W - LOGO_W) / 2 }}
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatar || asset(FALLBACK_AVATAR)}
        alt=""
        width={AVATAR}
        height={AVATAR}
        style={{
          position: "absolute",
          top: yAvatar,
          left: (LB_W - AVATAR) / 2,
          width: AVATAR,
          height: AVATAR,
          borderRadius: AVATAR / 2,
          objectFit: "cover",
        }}
      />

      <Row top={yName} size={68} weight={700} color={COLOR.ink}>
        {spec.username}
      </Row>
      <Row top={yElo} size={42}>
        {`ELO ${spec.elo || "—"}`}
      </Row>
      <Row top={yRankLabel} size={52} weight={700} color={COLOR.ink}>
        Current Rank:
      </Row>

      {/* Ordinal rides high and small, as drawOrdinal() does on the canvas. */}
      <div
        style={{
          position: "absolute",
          top: yRank,
          left: 0,
          width: LB_W,
          height: 104,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: 104, fontWeight: 700, color: COLOR.blue }}>
          {rank}
        </span>
        {suffix ? (
          <span style={{ fontSize: 62, fontWeight: 700, color: COLOR.blue }}>
            {suffix}
          </span>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          top: yOutOf,
          left: 0,
          width: LB_W,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 42,
          lineHeight: 1,
        }}
      >
        <span style={{ color: COLOR.body }}>out of&nbsp;</span>
        <span style={{ fontWeight: 700, color: COLOR.ink }}>
          {spec.totalPlayers != null ? formatNumber(spec.totalPlayers) : "—"}
        </span>
        <span style={{ color: COLOR.body }}>&nbsp;players</span>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(RIBBON_ART)}
        alt=""
        width={RIBBON_W}
        height={RIBBON_H}
        style={{
          position: "absolute",
          top: yRibbon,
          left: (LB_W - RIBBON_W) / 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: yRibbon,
          left: 0,
          width: LB_W,
          height: RIBBON_H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 600,
          color: COLOR.white,
          lineHeight: 1.35,
        }}
      >
        <span>Play chess and climb the</span>
        <div style={{ display: "flex" }}>
          <span>leaderboard on&nbsp;</span>
          <span style={{ fontWeight: 700, color: COLOR.yellow }}>
            AroundChess.com
          </span>
        </div>
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const spec = parseShareCardSpec(Object.fromEntries(searchParams));
  if (!spec) {
    return new Response("Unknown share card", { status: 400 });
  }

  const asset = (path: string) => new URL(path, origin).toString();

  try {
    const [fonts, avatar] = await Promise.all([
      loadFonts(origin),
      spec.kind === "leaderboard"
        ? inlineAvatar(spec.avatarUrl, origin)
        : Promise.resolve(""),
    ]);

    return new ImageResponse(
      spec.kind === "result" ? (
        <ResultCard spec={spec} asset={asset} />
      ) : (
        <LeaderboardCard spec={spec} asset={asset} avatar={avatar} />
      ),
      {
        // Portrait for the leaderboard card so it matches the clipboard image.
        width: spec.kind === "leaderboard" ? LB_W : WIDTH,
        height: spec.kind === "leaderboard" ? LB_H : HEIGHT,
        fonts,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
        },
      }
    );
  } catch (error) {
    console.error("share-image render failed", error);
    return new Response("Could not render the share card", { status: 500 });
  }
}
