"use client";

import { formatEloDelta, formatNumber } from "@/components/v2/format-number";

const WIDTH = 1080;

const FAMILY = {
  regular: '"AloeveraDisplay-Regular", system-ui, sans-serif',
  medium: '"AloeveraDisplay-Medium", system-ui, sans-serif',
  semibold: '"AloeveraDisplay-SemiBold", system-ui, sans-serif',
  bold: '"AloeveraDisplay-Bold", system-ui, sans-serif',
  extrabold: '"AloeveraDisplay-ExtraBold", system-ui, sans-serif',
};

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

export type GameResult = "win" | "lose" | "draw";

export interface ResultShareSpec {
  kind: "result";
  result: GameResult;
  elo: number;
  delta: number;
  opponentName?: string;
  opponentElo?: number;
}

export interface LeaderboardShareSpec {
  kind: "leaderboard";
  username: string;
  elo: number;
  rank: number;
  totalPlayers: number | null;
  avatarUrl?: string | null;
}

export type ShareCardSpec = ResultShareSpec | LeaderboardShareSpec;

const imageCache = new Map<string, Promise<HTMLImageElement | null>>();

function loadImage(src: string, crossOrigin = false): Promise<HTMLImageElement | null> {
  const key = `${crossOrigin ? "x:" : ""}${src}`;
  const cached = imageCache.get(key);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new window.Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  imageCache.set(key, promise);
  return promise;
}

async function ensureFonts() {
  const fonts = (document as any).fonts;
  if (!fonts?.load) return;
  await Promise.all(
    Object.values(FAMILY).map((family) =>
      fonts.load(`64px ${family}`).catch(() => undefined)
    )
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

interface TextStyle {
  size: number;
  family?: string;
  color?: string;
  align?: CanvasTextAlign;
  maxWidth?: number;
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  style: TextStyle
): number {
  ctx.font = `${style.size}px ${style.family ?? FAMILY.regular}`;
  ctx.fillStyle = style.color ?? COLOR.ink;
  ctx.textAlign = style.align ?? "left";
  ctx.textBaseline = "middle";

  let out = value;
  if (style.maxWidth) {
    while (out.length > 1 && ctx.measureText(out).width > style.maxWidth) {
      out = out.slice(0, -1);
    }
    if (out !== value) out = `${out.slice(0, -1)}…`;
  }
  ctx.fillText(out, x, y);
  return ctx.measureText(out).width;
}

function measure(
  ctx: CanvasRenderingContext2D,
  value: string,
  size: number,
  family = FAMILY.regular
): number {
  ctx.font = `${size}px ${family}`;
  return ctx.measureText(value).width;
}

function ordinalSuffix(n: number): string {
  return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
}

function drawOrdinal(
  ctx: CanvasRenderingContext2D,
  n: number,
  x: number,
  y: number,
  size: number,
  family: string,
  color: string
): number {
  if (n <= 0) return text(ctx, "—", x, y, { size, family, color });
  const value = formatNumber(n);
  const valueWidth = text(ctx, value, x, y, { size, family, color });
  const suffix = ordinalSuffix(n);
  const suffixWidth = text(ctx, suffix, x + valueWidth, y - size * 0.26, {
    size: size * 0.6,
    family,
    color,
  });
  return valueWidth + suffixWidth;
}

function fit(w: number, h: number, boxW: number, boxH: number) {
  const scale = Math.min(boxW / w, boxH / h);
  return { w: w * scale, h: h * scale };
}

const ARROW_BODY = "M10 18L3 10H7V5H13V10H17L10 18Z";
const ARROW_BAR = { x: 7, y: 1.7, w: 6, h: 1.8, r: 0.9 };

function drawEloArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  up: boolean
) {
  const scale = size / 20;
  ctx.save();
  ctx.fillStyle = COLOR.white;
  if (up) {
    ctx.translate(x, y + size);
    ctx.scale(scale, -scale);
  } else {
    ctx.translate(x, y);
    ctx.scale(scale, scale);
  }
  ctx.fill(new Path2D(ARROW_BODY));
  roundRect(ctx, ARROW_BAR.x, ARROW_BAR.y, ARROW_BAR.w, ARROW_BAR.h, ARROW_BAR.r);
  ctx.fill();
  ctx.restore();
}

const RESULT_ART: Record<GameResult, string> = {
  win: "/images/v2/share/result-win.png",
  lose: "/images/v2/share/result-lose.png",
  draw: "/images/v2/share/result-draw.png",
};

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
const RESULT_RIBBON = "/images/v2/play-vs-ai/flag-exported.png";

const BACKGROUND_ALPHA = 0.34;

const RESULT_RIBBON_LINE = "Challenge more than 70 AI Opponents";
const RESULT_RIBBON_LEAD = "now on ";
const RIBBON_SITE = "AroundChess.com";

const RIBBON_BAND_TOP = 34 / 124;
const RIBBON_BAND_BOTTOM = 1;
const RIBBON_LINE_GAP = 48;

function drawFeathered(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const off = document.createElement("canvas");
  off.width = Math.round(w);
  off.height = Math.round(h);
  const octx = off.getContext("2d");
  if (!octx) {
    ctx.drawImage(img, x, y, w, h);
    return;
  }
  const W = off.width;
  const H = off.height;
  octx.drawImage(img, 0, 0, W, H);

  const pad = Math.round(Math.min(W, H) * 0.06);
  octx.globalCompositeOperation = "destination-out";
  const fade = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    rx: number,
    ry: number,
    rw: number,
    rh: number
  ) => {
    const gradient = octx.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    octx.fillStyle = gradient;
    octx.fillRect(rx, ry, rw, rh);
  };
  fade(0, 0, pad, 0, 0, 0, pad, H);
  fade(W, 0, W - pad, 0, W - pad, 0, pad, H);
  fade(0, 0, 0, pad, 0, 0, W, pad);
  fade(0, H, 0, H - pad, 0, H - pad, W, pad);

  ctx.drawImage(off, x, y, w, h);
}

async function drawResultBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const bg = await loadImage(RESULT_BACKGROUND);
  if (!bg) return;
  ctx.save();
  ctx.globalAlpha = BACKGROUND_ALPHA;
  ctx.drawImage(bg, 0, 0, width, height);
  ctx.restore();
}

async function drawRibbon(
  ctx: CanvasRenderingContext2D,
  y: number,
  firstLine: string,
  leadIn: string,
  width = 946
): Promise<number> {
  const ribbon = await loadImage(RESULT_RIBBON);
  if (!ribbon) return 0;

  const h = (width * ribbon.height) / ribbon.width;
  ctx.drawImage(ribbon, (WIDTH - width) / 2, y, width, h);

  const mid = y + h * ((RIBBON_BAND_TOP + RIBBON_BAND_BOTTOM) / 2);
  const half = RIBBON_LINE_GAP / 2;
  const size = 36;
  text(ctx, firstLine, WIDTH / 2, mid - half, {
    size,
    family: FAMILY.semibold,
    color: COLOR.white,
    align: "center",
  });
  const leadW = measure(ctx, leadIn, size, FAMILY.semibold);
  const siteW = measure(ctx, RIBBON_SITE, size, FAMILY.bold);
  const startX = (WIDTH - (leadW + siteW)) / 2;
  text(ctx, leadIn, startX, mid + half, {
    size,
    family: FAMILY.semibold,
    color: COLOR.white,
  });
  text(ctx, RIBBON_SITE, startX + leadW, mid + half, {
    size,
    family: FAMILY.bold,
    color: COLOR.yellow,
  });

  return h;
}

async function drawResultCard(
  ctx: CanvasRenderingContext2D,
  spec: ResultShareSpec
): Promise<number> {
  const PAD = 64;
  let y = 46;

  const logo = await loadImage(BRAND_LOGO);
  if (logo) {
    const box = fit(logo.width, logo.height, 268, 110);
    ctx.drawImage(logo, (WIDTH - box.w) / 2, y, box.w, box.h);
    y += box.h + 22;
  }

  const art = await loadImage(RESULT_ART[spec.result]);
  if (art) {
    const box = fit(art.width, art.height, 700, 560);
    drawFeathered(ctx, art, (WIDTH - box.w) / 2, y, box.w, box.h);
    y += box.h + 30;
  }

  text(ctx, RESULT_TITLE[spec.result], WIDTH / 2, y + 41, {
    size: 82,
    family: FAMILY.bold,
    color: RESULT_COLOR[spec.result],
    align: "center",
  });
  y += 82 + 18;

  if (spec.opponentName) {
    const against =
      spec.opponentElo != null
        ? `Against ${spec.opponentName} (ELO ${spec.opponentElo})`
        : `Against ${spec.opponentName}`;
    text(ctx, against, WIDTH / 2, y + 21, {
      size: 40,
      color: COLOR.body,
      align: "center",
      maxWidth: WIDTH - PAD * 2,
    });
    y += 42 + 26;
  }

  const label = "Your Current ELO";
  const value = String(Math.round(spec.elo));
  const delta = formatEloDelta(spec.delta);
  const gained = spec.delta >= 0;

  const labelSize = 42;
  const valueSize = 68;
  const deltaSize = 54;
  const arrowSize = 44;
  const padX = 38;
  const labelW = measure(ctx, label, labelSize, FAMILY.semibold);
  const valueW = measure(ctx, value, valueSize, FAMILY.bold);
  const deltaW = measure(ctx, delta, deltaSize, FAMILY.bold);

  const pillH = 108;
  const pillW = padX * 2 + labelW + 22 + arrowSize + 14 + valueW;
  const groupW = pillW + 22 + deltaW;
  const pillX = (WIDTH - groupW) / 2;
  const pillMid = y + pillH / 2;

  const accent =
    spec.result === "win" ? COLOR.green : spec.result === "lose" ? COLOR.red : gained ? COLOR.green : COLOR.red;

  ctx.fillStyle = accent;
  roundRect(ctx, pillX, y, pillW, pillH, 24);
  ctx.fill();

  text(ctx, label, pillX + padX, pillMid, {
    size: labelSize,
    family: FAMILY.semibold,
    color: COLOR.white,
  });
  drawEloArrow(
    ctx,
    pillX + padX + labelW + 22,
    pillMid - arrowSize / 2,
    arrowSize,
    gained
  );
  text(ctx, value, pillX + padX + labelW + 22 + arrowSize + 14, pillMid, {
    size: valueSize,
    family: FAMILY.bold,
    color: COLOR.white,
  });
  text(ctx, delta, pillX + pillW + 22, pillMid, {
    size: deltaSize,
    family: FAMILY.bold,
    color: spec.delta === 0 ? COLOR.muted : gained ? COLOR.green : COLOR.red,
  });
  y += pillH + 92;

  y += await drawRibbon(ctx, y, RESULT_RIBBON_LINE, RESULT_RIBBON_LEAD);

  return y + PAD;
}

const MY_FALLBACK_AVATAR = "/images/homepage/v2/homepage_board_asset_4.png";

const LEADERBOARD_BACKGROUND = "/images/v2/leaderboard/background.png";
const LEADERBOARD_CONFETTI = "/images/v2/play-vs-ai/confetti-stars-exported.png";

const LEADERBOARD_RIBBON_LINE = "Play chess and climb the";
const LEADERBOARD_RIBBON_LEAD = "leaderboard on ";

async function drawLeaderboardBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const scene = await loadImage(LEADERBOARD_BACKGROUND);
  if (scene) ctx.drawImage(scene, 0, 0, width, height);
  const confetti = await loadImage(LEADERBOARD_CONFETTI);
  if (confetti) {
    ctx.drawImage(
      confetti,
      0,
      0,
      width,
      (width * confetti.height) / confetti.width
    );
  }
}

async function drawRoundAvatar(
  ctx: CanvasRenderingContext2D,
  avatarUrl: string | null | undefined,
  cx: number,
  cy: number,
  size: number
) {
  const photo =
    (avatarUrl ? await loadImage(avatarUrl, true) : null) ??
    (await loadImage(MY_FALLBACK_AVATAR));
  if (!photo) return;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.clip();
  const scale = Math.max(size / photo.width, size / photo.height);
  const w = photo.width * scale;
  const h = photo.height * scale;
  ctx.drawImage(photo, cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
}

function drawCenteredRun(
  ctx: CanvasRenderingContext2D,
  parts: { value: string; size: number; family: string; color: string }[],
  y: number
) {
  const widths = parts.map((p) => measure(ctx, p.value, p.size, p.family));
  let x = (WIDTH - widths.reduce((a, b) => a + b, 0)) / 2;
  parts.forEach((part, i) => {
    text(ctx, part.value, x, y, {
      size: part.size,
      family: part.family,
      color: part.color,
    });
    x += widths[i];
  });
}

async function drawLeaderboardCard(
  ctx: CanvasRenderingContext2D,
  spec: LeaderboardShareSpec
): Promise<number> {
  const PAD = 64;
  let y = 42;

  const logo = await loadImage(BRAND_LOGO);
  if (logo) {
    const box = fit(logo.width, logo.height, 300, 120);
    ctx.drawImage(logo, (WIDTH - box.w) / 2, y, box.w, box.h);
    y += box.h + 80;
  }

  const avatarSize = 268;
  await drawRoundAvatar(
    ctx,
    spec.avatarUrl,
    WIDTH / 2,
    y + avatarSize / 2,
    avatarSize
  );
  y += avatarSize + 56;

  const nameSize = 68;
  text(ctx, spec.username, WIDTH / 2, y + nameSize / 2, {
    size: nameSize,
    family: FAMILY.bold,
    color: COLOR.ink,
    align: "center",
    maxWidth: WIDTH - PAD * 2,
  });
  y += nameSize + 14;

  text(ctx, `ELO ${spec.elo || "—"}`, WIDTH / 2, y + 21, {
    size: 42,
    color: COLOR.body,
    align: "center",
  });
  y += 42 + 76;

  text(ctx, "Current Rank:", WIDTH / 2, y + 26, {
    size: 52,
    family: FAMILY.bold,
    color: COLOR.ink,
    align: "center",
  });
  y += 52 + 18;

  const rankSize = 104;
  const rankW =
    spec.rank > 0
      ? measure(ctx, formatNumber(spec.rank), rankSize, FAMILY.bold) +
        measure(ctx, ordinalSuffix(spec.rank), rankSize * 0.6, FAMILY.bold)
      : measure(ctx, "—", rankSize, FAMILY.bold);
  drawOrdinal(
    ctx,
    spec.rank,
    (WIDTH - rankW) / 2,
    y + rankSize / 2,
    rankSize,
    FAMILY.bold,
    COLOR.blue
  );
  y += rankSize + 24;

  drawCenteredRun(
    ctx,
    [
      { value: "out of ", size: 42, family: FAMILY.regular, color: COLOR.body },
      {
        value: spec.totalPlayers != null ? formatNumber(spec.totalPlayers) : "—",
        size: 42,
        family: FAMILY.bold,
        color: COLOR.ink,
      },
      { value: " players", size: 42, family: FAMILY.regular, color: COLOR.body },
    ],
    y + 21
  );
  y += 44 + 120;

  y += await drawRibbon(
    ctx,
    y,
    LEADERBOARD_RIBBON_LINE,
    LEADERBOARD_RIBBON_LEAD,
    1010
  );

  return y + 110;
}

export async function renderShareCard(spec: ShareCardSpec): Promise<Blob> {
  await ensureFonts();

  const scratch = document.createElement("canvas");
  scratch.width = WIDTH;
  scratch.height = 2600;
  const ctx = scratch.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");

  const used =
    spec.kind === "result"
      ? await drawResultCard(ctx, spec)
      : await drawLeaderboardCard(ctx, spec);

  const out = document.createElement("canvas");
  out.width = WIDTH;
  out.height = Math.min(scratch.height, Math.ceil(used));
  const octx = out.getContext("2d");
  if (!octx) throw new Error("Canvas is not available");
  octx.fillStyle = COLOR.white;
  octx.fillRect(0, 0, out.width, out.height);
  if (spec.kind === "result") {
    await drawResultBackground(octx, out.width, out.height);
  } else {
    await drawLeaderboardBackground(octx, out.width, out.height);
  }
  octx.drawImage(scratch, 0, 0);

  return await new Promise<Blob>((resolve, reject) => {
    out.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export the image"))),
      "image/png"
    );
  });
}

export function shareCardMeta(spec: ShareCardSpec): {
  fileName: string;
  title: string;
  text: string;
} {
  if (spec.kind === "result") {
    const outcome =
      spec.result === "win" ? "won" : spec.result === "lose" ? "lost" : "drew";
    const against = spec.opponentName ? ` against ${spec.opponentName}` : "";
    return {
      fileName: `aroundchess-${spec.result}.png`,
      title: `I ${outcome} on AroundChess`,
      text: `I just ${outcome}${against} on AroundChess — my ELO is now ${Math.round(
        spec.elo
      )} (${formatEloDelta(spec.delta)}).`,
    };
  }
  return {
    fileName: "aroundchess-leaderboard.png",
    title: "My AroundChess leaderboard standing",
    text: `I'm ${formatNumber(spec.rank)}${ordinalSuffix(
      spec.rank
    )} on the AroundChess leaderboard with an ELO of ${spec.elo}.`,
  };
}
