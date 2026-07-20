import Image from "next/image";

// Fallback avatar for users without a profile picture: the pawn silhouette
// on a "random" background color. The color is hashed from the seed
// (username) so it looks random across users but stays stable for a given
// user between renders and visits.
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
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PIECE_AVATAR_COLORS[hash % PIECE_AVATAR_COLORS.length];
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
