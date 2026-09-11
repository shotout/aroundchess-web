"use client";

import { useEffect, useState } from "react";
import { OfflineBanner } from "./offline-banner";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

/** Mounts the offline banner site-wide (see app/layout.tsx).
 *
 *  Dismissal lasts for the current outage only — coming back online clears it,
 *  so a later disconnect is announced again rather than silently swallowed by
 *  an X the user tapped an hour ago.
 */
export function OfflineBannerHost() {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isOnline) setDismissed(false);
  }, [isOnline]);

  if (isOnline || dismissed) return null;

  return <OfflineBanner onDismiss={() => setDismissed(true)} />;
}
