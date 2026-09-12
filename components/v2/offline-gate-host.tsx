"use client";

import { useEffect, useState } from "react";
import { OfflineModal } from "./offline-modal";
import { useOfflineGate } from "@/app/store/offlineGate";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { probeConnection } from "./offline-status";

/** Renders the one offline modal for blocked actions (see app/layout.tsx).
 *
 *  Distinct from the modal PlayingPage renders for a pending game save: that
 *  one has a real job to finish and its own retry, while this one is only
 *  waiting for the network before letting an action through.
 */
export function OfflineGateHost() {
  const open = useOfflineGate((state) => state.open);
  const dismiss = useOfflineGate((state) => state.dismiss);
  const resume = useOfflineGate((state) => state.resume);
  const isOnline = useOnlineStatus();
  const [isProbing, setIsProbing] = useState(false);

  // The connection coming back carries out what the player originally asked
  // for, rather than closing the modal and leaving them to click again.
  useEffect(() => {
    if (open && isOnline) resume();
  }, [open, isOnline, resume]);

  if (!open) return null;

  const handleRetry = async () => {
    if (isProbing) return;
    setIsProbing(true);
    const reachable = await probeConnection();
    setIsProbing(false);
    // Staying open on a failed probe is the point: the countdown restarts and
    // the player is not told the connection is fine when it is not.
    if (reachable) resume();
  };

  return (
    <OfflineModal
      variant="blocked"
      isRetrying={isProbing}
      onRetry={handleRetry}
      onClose={dismiss}
    />
  );
}
