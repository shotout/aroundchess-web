"use client";

import { useEffect, useState } from "react";
import {
  installOfflineSimulation,
  isOfflineSimulationAvailable,
  isSimulatedOffline,
  setSimulatedOffline,
  subscribeToOfflineSimulation,
} from "./offline-simulation";

/** Installs the offline simulation and shows a badge while it is on.
 *
 *  The badge is the important half. A simulation you have forgotten about
 *  looks exactly like a bug — every request failing, panels everywhere — and
 *  the badge is what stops an hour going into chasing it. It sits above every
 *  dialog layer in the app for the same reason, and clicking it switches the
 *  simulation off.
 *
 *  Renders nothing at all in production (see isOfflineSimulationAvailable).
 */
export function OfflineSimulationHost() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    // Subscribe BEFORE installing. install may switch the simulation on
    // straight away (from ?simulateOffline=1, or a reload with it still set in
    // sessionStorage), and that notification is dropped on the floor if the
    // listener is not registered yet — leaving the simulation running with no
    // badge to say so, which is the one state this component exists to
    // prevent.
    const unsubscribe = subscribeToOfflineSimulation(() =>
      forceRender((n) => n + 1)
    );
    installOfflineSimulation();
    return unsubscribe;
  }, []);

  if (!isOfflineSimulationAvailable() || !isSimulatedOffline()) return null;

  return (
    <button
      type="button"
      onClick={() => setSimulatedOffline(false)}
      title="Offline is being simulated. Click to restore the connection."
      className="fixed z-[10000] bottom-[12px] left-[12px] flex items-center gap-[6px] rounded-full bg-[#B91C1C] px-[12px] py-[6px] text-[11px] font-bold uppercase tracking-wide text-white shadow-lg hover:bg-[#991B1B]"
    >
      <span className="inline-block w-[8px] h-[8px] rounded-full bg-white animate-pulse" />
      Offline simulated — click to restore
    </button>
  );
}
