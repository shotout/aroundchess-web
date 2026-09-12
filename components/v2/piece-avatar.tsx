import Image from "next/image";
import { pieceAvatarIndex } from "@/components/v2/piece-avatar-color";

// Fallback avatar for users without a profile picture: the pawn silhouette
// on a "random" background color. The color is hashed from the seed
// (username) so it looks random across users but stays stable for a given
// user between renders and visits.
//
// Written out as literal classes because Tailwind's JIT only generates what it
// can see as a static string. PIECE_AVATAR_HEX holds the same colors in the
// same order for the canvas and OG renderers, which cannot use classes at all.
const PIECE_AVATAR_COLORS = [
  "bg-[#F5A623]",
  "bg-[#56CCF2]",
  "bg-[#E0507A]",
  "bg-[#5B6CF0]",
  "bg-[#2FAE60]",
  "bg-[#F2C94C]",
  "bg-[#B5651D]",
  "bg-[#9CA3AF]",
];

export function pieceAvatarColor(seed: string): string {
  return PIECE_AVATAR_COLORS[pieceAvatarIndex(seed)];
}

export function PieceAvatar({
  seed,
  className = "w-[32px] h-[32px]",
  pieceClassName = "w-[14px] h-[18px]",
}: {
  seed: string;
  /** circle sizing classes */
  className?: string;
  /** pawn sizing classes */
  pieceClassName?: string;
}) {
  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center ${pieceAvatarColor(
        seed
      )} ${className}`}
    >
      <Image
        src="/images/v2/profile/pieces.png"
        alt=""
        width={28}
        height={36}
        className={`object-contain ${pieceClassName}`}
      />
    </div>
  );
}

export default PieceAvatar;
