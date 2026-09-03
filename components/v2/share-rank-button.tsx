"use client";

import { useState } from "react";
import { ShareButton } from "@/components/v2/share-button";
import { ShareImageSheet } from "@/components/v2/share-image-sheet";
import { useLeaderboardShareSpec } from "@/components/v2/leaderboard-share";
import { useHasFinishedCalibration } from "@/components/v2/hooks/useHasFinishedCalibration";

interface ShareRankButtonProps {
  label?: string;
  className?: string;
}

export function ShareRankButton({
  label = "Share",
  className = "",
}: ShareRankButtonProps) {
  const [sharing, setSharing] = useState(false);
  const spec = useLeaderboardShareSpec();
  const hasFinishedCalibration = useHasFinishedCalibration();

  if (!hasFinishedCalibration) return null;

  return (
    <>
      {sharing && (
        <ShareImageSheet spec={spec} onClose={() => setSharing(false)} />
      )}
      <ShareButton
        variant="pill"
        label={label}
        onClick={() => setSharing(true)}
        className={className}
      />
    </>
  );
}
