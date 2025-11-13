"use client";

import { useEffect } from "react";
import { useBlackFridayModal } from "@/app/store/blackFridayModal";
import { BlackFridayPromo } from "./BlackFridayPromo";

/**
 * Component that checks for the login flag and shows the Black Friday modal
 * after the page has fully loaded. Uses a smart delay that:
 * 1. Waits for document to be fully loaded (readyState === 'complete')
 * 2. Adds a 1.5 second buffer after load completes
 * 3. Has a maximum timeout of 6 seconds if page takes too long to load
 * 
 * Should be included in pages where users land after login (my-game-history, analysis, etc.)
 */
export function BlackFridayPromoTrigger() {
  const { setOpen } = useBlackFridayModal();

  useEffect(() => {
    // Check if we should show the modal after login
    const shouldShowModal = sessionStorage.getItem("showBlackFridayModal");
    
    if (shouldShowModal === "true") {
      let loadTimer: NodeJS.Timeout | null = null;
      let maxTimer: NodeJS.Timeout | null = null;
      let isModalShown = false;

      const showModal = () => {
        if (!isModalShown) {
          isModalShown = true;
          setOpen(true);
          // Clear the flag so modal doesn't show again on page refresh
          sessionStorage.removeItem("showBlackFridayModal");
          
          // Clear any remaining timers
          if (loadTimer) clearTimeout(loadTimer);
          if (maxTimer) clearTimeout(maxTimer);
        }
      };

      const waitForLoadThenShow = () => {
        if (document.readyState === 'complete') {
          // Page is fully loaded, wait 1.5 seconds more as buffer
          loadTimer = setTimeout(() => {
            showModal();
          }, 1500);
        } else {
          // Page not loaded yet, wait for load event
          const handleLoad = () => {
            // Wait 1.5 seconds after page loads
            loadTimer = setTimeout(() => {
              showModal();
            }, 1500);
          };

          window.addEventListener('load', handleLoad);

          // Cleanup
          return () => {
            window.removeEventListener('load', handleLoad);
            if (loadTimer) clearTimeout(loadTimer);
          };
        }
      };

      // Start the smart delay
      const cleanup = waitForLoadThenShow();

      // Maximum timeout - show modal after 6 seconds regardless of load state
      // This ensures modal shows even on very slow connections
      maxTimer = setTimeout(() => {
        showModal();
      }, 6000);

      // Cleanup function
      return () => {
        if (loadTimer) clearTimeout(loadTimer);
        if (maxTimer) clearTimeout(maxTimer);
        if (cleanup) cleanup();
      };
    }
  }, [setOpen]);

  return <BlackFridayPromo />;
}
