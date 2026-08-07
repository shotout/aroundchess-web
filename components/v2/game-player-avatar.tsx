"use client";

import { useState } from "react";
import { PieceAvatar } from "@/components/v2/piece-avatar";

export function GamePlayerAvatar({
  imageUrl,
  seed,
}: {
  imageUrl?: string | null;
  seed: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = imageUrl && !failed ? imageUrl : null;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Profile picture"
        className="w-[48px] h-[48px] rounded-full object-cover shrink-0"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <PieceAvatar
      seed={seed}
      className="w-[48px] h-[48px]"
      pieceClassName="w-[20px] h-[26px]"
    />
  );
}

export default GamePlayerAvatar;
