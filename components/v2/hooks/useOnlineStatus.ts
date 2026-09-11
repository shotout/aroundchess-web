"use client";

import { useEffect, useState } from "react";
import { isBrowserOnline } from "../offline-simulation";

/** Whether the browser currently believes it has a connection.
 *
 *  Seeded optimistically rather than from navigator.onLine, which does not
 *  exist on the server: reading it during the first render would make the
 *  client's markup disagree with what React hydrates against. The effect
 *  corrects it on mount, which is a tick later than the first paint and long
 *  before anything reads it in anger.
 *
 *  Reads through isBrowserOnline rather than navigator.onLine directly, so
 *  the offline simulation used for testing is seen here too — see
 *  offline-simulation.ts.
 *
 *  navigator.onLine only reports whether the device has *a* network, so it
 *  can read true behind a captive portal or a dead uplink. Treat it as the
 *  cheap signal and isOfflineError as the authoritative one — see
 *  offline-status.ts.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const sync = () => setIsOnline(isBrowserOnline());
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return isOnline;
}
