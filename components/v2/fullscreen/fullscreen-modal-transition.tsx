"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FullscreenModalTransitionProps {
  show: boolean;
  enabled: boolean;
  children: () => ReactNode;
}

// Fades a conditionally-rendered modal in and out; opacity only so fixed children keep their position.
export function FullscreenModalTransition({ show, enabled, children }: FullscreenModalTransitionProps) {
  if (!enabled) return show ? <>{children()}</> : null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="fs-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
