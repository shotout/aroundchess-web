/**
 * The default-avatar palette, shared by everything that has to draw a user
 * without a profile picture: the React <PieceAvatar>, the share card's canvas
 * renderer, and the satori-rendered OG card.
 *
 * Two representations of one palette. Tailwind's JIT only generates classes it
 * can see as literal strings, so `piece-avatar.tsx` keeps its own
 * `bg-[#RRGGBB]` array; the hex list below is what the two image renderers
 * need. They are index-for-index the same colors — change one, change both.
 */
export const PIECE_AVATAR_HEX = [
  "#F5A623",
  "#56CCF2",
  "#E0507A",
  "#5B6CF0",
  "#2FAE60",
  "#F2C94C",
  "#B5651D",
  "#9CA3AF",
];

/** Stable per-user palette slot: hashed from the seed (the username), so it
 *  looks arbitrary across users but never changes for one of them. */
export function pieceAvatarIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % PIECE_AVATAR_HEX.length;
}

export function pieceAvatarHex(seed: string): string {
  return PIECE_AVATAR_HEX[pieceAvatarIndex(seed)];
}

/** The pawn silhouette that sits on the coloured circle. */
export const PIECE_AVATAR_PIECE_SRC = "/images/v2/profile/pieces.png";

/**
 * Pawn height as a fraction of the circle's diameter. <PieceAvatar>'s callers
 * all land between 18/32 and 26/48 of the circle; 18/32 is the one the profile
 * and leaderboard rows use.
 */
export const PIECE_AVATAR_PIECE_HEIGHT_RATIO = 18 / 32;

/**
 * The pawn art's true aspect ratio (pieces.png is 33x43). <PieceAvatar> passes
 * next/image a nominal 28x36 and then sizes the element with object-contain, so
 * the rendered pawn is height-driven at this ratio — the renderers here size it
 * the same way rather than from the nominal numbers.
 */
export const PIECE_AVATAR_PIECE_ASPECT = 33 / 43;
