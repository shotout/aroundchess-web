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

function LeaderboardCard({
  spec,
  asset,
  avatar,
}: {
  spec: LeaderboardShareSpec;
  asset: (path: string) => string;
  avatar: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#EEF2FF",
        fontFamily: "Aloevera",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(CONFETTI)}
        alt=""
        width={WIDTH}
        height={Math.round((WIDTH * 614) / 702)}
        style={{ position: "absolute", top: 0, left: 0, width: WIDTH }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: WIDTH,
          height: HEIGHT,
          padding: "0 74px 84px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          width={300}
          height={300}
          style={{
            width: 300,
            height: 300,
            borderRadius: 150,
            objectFit: "cover",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginLeft: 56,
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
              fontSize: 60,
              fontWeight: 700,
              color: COLOR.ink,
              marginTop: 14,
            }}
          >
            {spec.username}
          </span>
          <span style={{ fontSize: 32, color: COLOR.body, marginTop: 4 }}>
            {`ELO ${spec.elo || "—"}`}
          </span>

          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 26 }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: COLOR.ink }}>
              Current Rank:
            </span>
            <span
              style={{
                fontSize: 74,
                fontWeight: 700,
                color: COLOR.blue,
                marginLeft: 16,
              }}
            >
              {spec.rank > 0 ? `${formatNumber(spec.rank)}${ordinalSuffix(spec.rank)}` : "—"}
            </span>
          </div>

          {spec.totalPlayers != null ? (
            <span style={{ fontSize: 30, color: COLOR.body, marginTop: 8 }}>
              {`out of ${formatNumber(spec.totalPlayers)} players`}
            </span>
          ) : null}
        </div>
      </div>

      <Ribbon lead="Play chess and climb the leaderboard on" />
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
        width: WIDTH,
        height: HEIGHT,
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
