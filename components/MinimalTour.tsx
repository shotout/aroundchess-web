"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTutorial } from "./TutorialProvider";
import { usePgnStore } from "@/app/store/zustandStore";
import { useTutorialStore } from "@/app/store/tutorialStore";
import { useProfileStore } from "@/app/store/profile";
import { ChessApiService } from "@/components/analysis/onboarding/store/APIService";
import { toast } from "sonner";

export type MinimalStep = {
  target: string; // CSS selector
  content: React.ReactNode;
  title?: string;
  stepText?: string;
  placement?: "top" | "bottom" | "left" | "right";
};

export default function MinimalTour({
  steps,
  run,
  onClose,
}: {
  steps: MinimalStep[];
  run: boolean;
  onClose?: () => void;
}) {
  const { setIsOpenTutorial, setIsFromGameHistory } = usePgnStore();
  const { stepFocused, stopTutorial, setStepFocused, allSteps, allStepsPlayVsAI } = useTutorial();
  const { tutorialType, setHasCompletedTutorial } = useTutorialStore();
  const { sessionId } = useProfileStore();
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [arrowLeft, setArrowLeft] = useState<number | null>(null);
  const [arrowTop, setArrowTop] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const step = steps[index];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    // console.log("MinimalTour stepFocused", stepFocused);
    // console.log("MinimalTour pathname", pathname);
    // console.log("MinimalTour index", index, steps);
    // if (pathname.includes("/my-game-history") && stepFocused == 2) {
    //   setIndex(0);
    // } else if (pathname.includes("/analysis") && stepFocused == 0) {
    //   setIndex(0);
    // } else if (pathname.includes("/analysis") && stepFocused == 3) {
    //   setIndex(2);
    // } else if (pathname.includes("/analysis") && stepFocused == 5) {
    //   setIndex(3);
    // } else if (pathname.includes("/my-game-history") && stepFocused == 6) {
    //   setIndex(2);
    // }
  }, [pathname, stepFocused]);
  // keep rect updated on scroll/resize and observe layout changes
  useEffect(() => {
    if (!run) return;
    const handle = () => {
      const s = steps[index];
      if (!s) return;
      const el = document.querySelector(s.target) as HTMLElement | null;
      console.log(`🔍 Looking for target: ${s.target}`, { found: !!el });

      if (el) {
        const boundingRect = el.getBoundingClientRect();
        console.log(`📏 Element rect:`, {
          width: boundingRect.width,
          height: boundingRect.height,
          top: boundingRect.top,
          left: boundingRect.left,
        });

        // Only set rect if element has valid dimensions (fully rendered)
        // This prevents using elements that exist in DOM but haven't laid out yet
        if (boundingRect.width > 0 && boundingRect.height > 0) {
          console.log("✅ Element has valid dimensions, setting rect");
          setRect(boundingRect);
        } else {
          console.log("⏳ Element found but dimensions are 0, waiting for layout...");
          setRect(null);
        }
      } else {
        console.log("❌ Element not found, setting rect to null");
        setRect(null);
      }
    };

    handle();

    // Add retry logic with multiple attempts for page navigation
    const retry1 = setTimeout(handle, 100);
    const retry2 = setTimeout(handle, 300);
    const retry3 = setTimeout(handle, 600);
    const retry4 = setTimeout(handle, 1000);

    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);

    // try to observe size/position changes on the target if available
    let ro: ResizeObserver | null = null;
    const s = steps[index];
    const el = s
      ? (document.querySelector(s.target) as HTMLElement | null)
      : null;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(handle);
      ro.observe(el);
    }

    const id = window.setInterval(handle, 600);
    return () => {
      clearTimeout(retry1);
      clearTimeout(retry2);
      clearTimeout(retry3);
      clearTimeout(retry4);
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
      if (ro && el) ro.unobserve(el);
      clearInterval(id);
    };
  }, [run, index, steps]);

  // compute arrow position inside tooltip whenever rect or tooltip position changes
  useEffect(() => {
    if (!rect || !tooltipRef.current) {
      setArrowLeft(null);
      setArrowTop(null);
      return;
    }
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // For horizontal placements (top/bottom) - calculate left position
    const targetCenter = rect.left + window.scrollX + rect.width / 2;
    const leftInsideTooltip = targetCenter - tooltipRect.left;
    // ensure arrow not too close to edges
    const clampedLeft = Math.max(
      12,
      Math.min(leftInsideTooltip, tooltipRect.width - 12)
    );
    setArrowLeft(clampedLeft);

    // For vertical placements (left/right) - calculate top position
    const targetVerticalCenter = rect.top + window.scrollY + rect.height / 2;
    const topInsideTooltip = targetVerticalCenter - tooltipRect.top;
    // ensure arrow not too close to edges
    const clampedTop = Math.max(
      12,
      Math.min(topInsideTooltip, tooltipRect.height - 12)
    );
    setArrowTop(clampedTop);
  }, [rect, index, run]);

  useEffect(() => {
    if (!run) return;
    const s = steps[index];
    if (!s) return;
    const el = document.querySelector(s.target) as HTMLElement | null;

    if (el) {
      console.log("🎯 [scrollIntoView useEffect] Element found, scrolling into view first...");

      // FIRST: Try multiple scroll methods to ensure element is visible

      // Method 1: Native scrollIntoView with instant behavior
      el.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });

      // Method 2: Manual scroll calculation as fallback
      const scrollToElement = () => {
        const rect = el.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const middle = absoluteTop - (window.innerHeight / 2) + (rect.height / 2);

        console.log("📜 Manual scroll to:", {
          elementTop: absoluteTop,
          scrollTo: middle,
          currentScroll: window.pageYOffset,
        });

        window.scrollTo({
          top: middle,
          behavior: "smooth"
        });
      };

      scrollToElement();

      // THEN: Wait for scroll animation to complete, then check dimensions
      const checkAfterScroll = () => {
        const boundingRect = el.getBoundingClientRect();
        console.log("📏 [After scroll] Checking dimensions:", {
          width: boundingRect.width,
          height: boundingRect.height,
          top: boundingRect.top,
          left: boundingRect.left,
          isInViewport: boundingRect.top >= 0 && boundingRect.top <= window.innerHeight,
        });

        // Check if element is in viewport
        const isInViewport = boundingRect.top >= 0 &&
                            boundingRect.top <= window.innerHeight &&
                            boundingRect.left >= 0 &&
                            boundingRect.left <= window.innerWidth;

        // Only set rect if element has valid dimensions AND is in viewport
        if (boundingRect.width > 0 && boundingRect.height > 0 && isInViewport) {
          console.log("✅ [scrollIntoView useEffect] Element has valid dimensions and is in viewport");
          setRect(boundingRect);
        } else if (boundingRect.width > 0 && boundingRect.height > 0 && !isInViewport) {
          console.log("⚠️ [scrollIntoView useEffect] Element has valid dimensions but NOT in viewport, scrolling again...");
          scrollToElement();
          // Check again after another scroll attempt
          setTimeout(checkAfterScroll, 400);
        } else {
          console.log("⏳ [scrollIntoView useEffect] Element found but dimensions are 0");
          setRect(null);
        }
      };

      // Wait for scroll animation (smooth scroll takes ~300-500ms)
      setTimeout(checkAfterScroll, 600);
    } else {
      console.log("❌ [scrollIntoView useEffect] Element not found");
      setRect(null);
    }
  }, [run, index, steps]);

  useEffect(() => {
    if (!run) {
      setIndex(0);
      setStepFocused(0);
      setRect(null);
    }
  }, [run]);

  useEffect(() => {
    if (!run || typeof document === "undefined") return;
    const prev = document.body.style.pointerEvents;
    let changed = false;
    if (prev === "none") {
      document.body.style.pointerEvents = "auto";
      changed = true;
    }
    return () => {
      if (changed) {
        document.body.style.pointerEvents = prev;
      }
    };
  }, [run]);

  useEffect(() => {
    if (!step) return;

    if (pathname.includes("/my-game-history")) {
      const focusedIndex = allSteps.findIndex(
        (st) => st.stepText == step.stepText
      );
      if (focusedIndex !== -1 && focusedIndex !== stepFocused) {
        setStepFocused(focusedIndex);
      }
    } else if (pathname.includes("/playground/play-vs-ai/playing")) {
      const focusedIndex = allStepsPlayVsAI.findIndex(
        (st) => st.stepText == step.stepText
      );
      if (focusedIndex !== -1 && focusedIndex !== stepFocused) {
        setStepFocused(focusedIndex);
      }
    } else if (pathname.includes("/playground/play-vs-ai")) {
      const focusedIndex = allStepsPlayVsAI.findIndex(
        (st) => st.stepText == step.stepText
      );
      if (focusedIndex !== -1 && focusedIndex !== stepFocused) {
        setStepFocused(focusedIndex);
      }
    }
  }, [index, pathname]);

  // Sync index when stepFocused changes (e.g., from prev/next button)
  useEffect(() => {
    if (!run || !steps || steps.length === 0) return;

    // Find the correct index in current steps array based on stepFocused
    const targetStepText = pathname.includes("/my-game-history")
      ? allSteps[stepFocused]?.stepText
      : allStepsPlayVsAI[stepFocused]?.stepText;

    if (targetStepText) {
      const newIndex = steps.findIndex((st) => st.stepText === targetStepText);
      if (newIndex !== -1 && newIndex !== index) {
        setIndex(newIndex);
      }
    }
  }, [stepFocused, pathname, steps]);

  if (!run || !steps || steps.length === 0 || !mounted) return null;

  const next = () => {
    console.log("index", steps.length, stepFocused, pathname, index);
    if (stepFocused == 1 && pathname.includes("/playground/play-vs-ai")) {
      // setIndex((i) => i + 1);
      router.replace("/playground/play-vs-ai/playing");
      setTimeout(() => {
        setStepFocused(2);
      }, 300)
    } else {
      setIndex((i) => i + 1);
    }

    // if (stepFocused == 2 && pathname.includes("/analysis")) {
    //   router.replace("/my-game-history");
    //   //   setIndex((i) => i + 1);
    // } else if (stepFocused == 5 && pathname.includes("/my-game-history")) {
    //   setIsFromGameHistory(true);
    //   router.replace("/analysis");
    //   //   setIndex((i) => i + 1);
    // } else {
    //   setIndex((i) => i + 1);
    // }
  };
  const prev = () => {
    console.log("index", stepFocused, pathname, index);

    if (stepFocused == 2 && pathname.includes("/playground/play-vs-ai/playing")) {
      setStepFocused(1); // Go back to step 2/7
      router.replace("/playground/play-vs-ai");
    } else  {
      setIndex((i) => Math.max(0, i - 1));
    }
    // if (stepFocused == 3 && pathname.includes("/my-game-history")) {
    //   router.replace("/analysis");
    //   //   setIndex((i) => Math.max(0, i - 1));
    // } else if (stepFocused == 6 && pathname.includes("/analysis")) {
    //   router.replace("/my-game-history");
    //   //   setIndex((i) => Math.max(0, i - 1));
    // } else {
    //   setIndex((i) => Math.max(0, i - 1));
    // }
  };
  const skip = () => {
    handleStartGameAnalysis();
  };

  // compute left/top values (kept inline for dynamic coords)
  // NOTE: We first compute the raw left with step-specific offsets, then clamp
  // the final value inside the viewport. This prevents the tooltip from
  // overflowing on the left edge (observed on step 5/7) while the arrow keeps
  // pointing at the same target (arrow position is recomputed from the final
  // tooltip rect in useEffect).
  const left = rect
    ? (() => {
        const base = rect.left + window.scrollX;
        let raw = base;
        if (stepFocused == 5 && window.innerWidth > 1024) {
          raw = base - 300;
        } else if (
          stepFocused == 5 &&
          (window.innerWidth == 1024 || window.innerWidth > 768)
        ) {
          raw = base - 360;
        } else if (stepFocused == 4 && window.innerWidth >= 425) {
          raw = base - 180;
        } else if (stepFocused == 4 && window.innerWidth < 425) {
          raw = base - 160;
        } else if (
          stepFocused == 4 &&
          (window.innerWidth == 1024 || window.innerWidth <= 1280)
        ) {
          raw = base - 300;
        } else if (stepFocused == 4 && window.innerWidth < 1024) {
          raw = base - 300;
        }

        // Clamp to viewport: >= 8px from left, and <= right margin so the box
        // stays fully visible. Width uses current tooltip width if available,
        // otherwise falls back to the minWidth used in styles below.
        const tooltipWidth =
          tooltipRef.current?.getBoundingClientRect().width ??
          (window.innerWidth < 425 ? 300 : 500);
        const minLeft = 8;
        const maxLeft = Math.max(minLeft, window.innerWidth - tooltipWidth - 8);
        return Math.min(Math.max(raw, minLeft), maxLeft);
      })()
    : undefined;
  const top = rect ? Math.max(8, rect.bottom + window.scrollY + 8) : undefined;
  const bottom = rect ? Math.max(8, rect.top + window.scrollY + 8) : undefined;
  console.log("top", top, rect);
  // overlay dims the page with a transparent hole over the target rect
  const overlay = rect ? (
    <svg
      aria-hidden
      // overlay receives pointer events so clicks can be handled
      className="fixed inset-0"
      style={{ width: "100%", height: "100%" }}
      onClick={(e) => {
        // if click happened inside the transparent hole, forward to underlying element
        const cx = (e as React.MouseEvent).clientX + window.scrollX;
        const cy = (e as React.MouseEvent).clientY + window.scrollY;
        const holeLeft = rect.left + window.scrollX - 8;
        const holeTop = rect.top + window.scrollY - 8;
        const holeRight = holeLeft + rect.width + 16;
        const holeBottom = holeTop + rect.height + 16;

        if (
          cx >= holeLeft &&
          cx <= holeRight &&
          cy >= holeTop &&
          cy <= holeBottom
        ) {
          // forward the click to the element inside the hole
          const el = document.elementFromPoint(
            (e as React.MouseEvent).clientX,
            (e as React.MouseEvent).clientY
          ) as HTMLElement | null;
          if (el) {
            // create a new MouseEvent and dispatch it on the found element
            const ev = new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            });
            el.dispatchEvent(ev);
            return;
          }
        }

        // otherwise trigger shake animation on the tooltip box
        setShaking(true);
        window.setTimeout(() => setShaking(false), 600);
      }}
    >
      {/* make the svg catch pointer events but let the hole area be transparent visually */}
      <defs>
        <mask id="tour-hole-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect
            x={rect.left + window.scrollX - 8}
            y={rect.top + window.scrollY - 8}
            width={rect.width + 16}
            height={rect.height + 16}
            rx={8}
            ry={8}
            fill="black"
          />
        </mask>
      </defs>
      <defs>
        <mask id="tour-hole-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <rect
            x={rect.left + window.scrollX - 8}
            y={rect.top + window.scrollY - 8}
            width={rect.width + 16}
            height={rect.height + 16}
            rx={8}
            ry={8}
            fill="black"
          />
        </mask>
      </defs>

      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0.2)"
        mask="url(#tour-hole-mask)"
      />
    </svg>
  ) : (
    <svg
      aria-hidden
      // overlay receives pointer events so clicks can be handled
      className="fixed inset-0"
      style={{ width: "100%", height: "100%" }}
    >
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0.2)"
        mask="url(#tour-hole-mask)"
      />
    </svg>
  );

  // highlight element positioned over the target rect (above overlay)
  const highlight = rect ? (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: rect.left + window.scrollX - 8,
        top: rect.top + window.scrollY - 8,
        width: rect.width + 16,
        height: rect.height + 16,
        // borderRadius: 8,
        // boxShadow: "0 0 0 3px rgba(255,255,255,0.6), 0 6px 24px rgba(0,0,0,0.25)",
        // border: "2px solid rgba(255,255,255,0.85)",
        pointerEvents: "none",
        zIndex: 999998,
      }}
    />
  ) : null;

  const handleStartGameAnalysis = async () => {
    // Post tutorial completion to API
    if (tutorialType && sessionId) {
      setIsSubmitting(true);
      try {
        await ChessApiService.setTutorialStatus(tutorialType, true, sessionId);
        setHasCompletedTutorial(true);
        console.log(`✅ Tutorial ${tutorialType} marked as completed`);
        toast.success("Tutorial completed!");
      } catch (error) {
        console.error("Error saving tutorial status:", error);
        // Don't block user from continuing even if API fails
        toast.error("Failed to save tutorial progress");
      } finally {
        setIsSubmitting(false);
      }
    }

    stopTutorial();
    setIsFromGameHistory(false);
    setIsOpenTutorial(false);

    if (pathname.includes("/my-game-history")) {
      window.location.href = "/my-game-history";
    } else {
      window.location.href = "/playground/play-vs-ai";
    }
  };
  // Portal content wrapped so it receives pointer events even when some
  // ancestors (like <body>) may have pointer-events disabled by the app.
  const content = (
    <div
      aria-hidden={false}
      // prevent clicks inside the tour wrapper from bubbling to underlying
      // modal/backdrop click handlers which may close the dialog
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "auto",
        zIndex: 999999,
      }}
    >
      {overlay}
      {highlight}

      <div
        id="box-tutorial"
        ref={tooltipRef}
        role="dialog"
        data-placement={step?.placement || "bottom"}
        className={`block w-full sm:max-w-[375px] md:min-w-[420px] mt-2 bg-white text-gray-900 p-3 rounded-lg shadow-lg relative ${
          rect ? "" : "fixed right-3 bottom-1"
        } ${shaking ? "ac-shake" : ""}`}
        style={
          rect
            ? {
                minWidth: window.innerWidth < 425 ? 300 : 500,
                maxWidth: window.innerWidth < 768 ? window.innerWidth - 32 : 480,
                overflow: "visible",
                position: "fixed",
                left: (() => {
                  const isMobile = window.innerWidth < 768;
                  const tooltipWidth = tooltipRef.current?.getBoundingClientRect().width ?? (window.innerWidth < 425 ? 300 : 480);
                  const isStep4 = step.stepText === "4/5";

                  // For mobile step 4, use top placement (centered)
                  if (isMobile && isStep4) {
                    return `${Math.max(16, (window.innerWidth - tooltipWidth) / 2)}px`;
                  }

                  // For mobile, override left/right placement to use bottom placement
                  if (isMobile && (step.placement === "left" || step.placement === "right")) {
                    // Center horizontally on mobile
                    return `${Math.max(16, (window.innerWidth - tooltipWidth) / 2)}px`;
                  }

                  // Desktop placement logic
                  const SPACING = 24; // Fixed spacing between tooltip and target

                  if (step.placement === "right") {
                    const calculatedLeft = rect.right + window.scrollX + SPACING;
                    // Ensure it doesn't overflow right edge
                    return `${Math.min(calculatedLeft, window.innerWidth - tooltipWidth - 16)}px`;
                  } else if (step.placement === "left") {
                    const calculatedLeft = rect.left + window.scrollX - tooltipWidth - SPACING;
                    // Ensure it doesn't overflow left edge
                    return `${Math.max(16, calculatedLeft)}px`;
                  } else if (step.placement === "top" || step.placement === "bottom") {
                    // Center horizontally for top/bottom placements
                    const centeredLeft = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
                    // Ensure it doesn't overflow viewport
                    const minLeft = 16;
                    const maxLeft = Math.max(minLeft, window.innerWidth - tooltipWidth - 16);
                    return `${Math.min(Math.max(centeredLeft, minLeft), maxLeft)}px`;
                  }

                  return `${left}px`;
                })(),
                top: (() => {
                  const isMobile = window.innerWidth < 768;
                  const isStep4 = step.stepText === "4/5";
                  const tooltipHeight = tooltipRef.current?.getBoundingClientRect().height ?? 200;
                  const SPACING = 20; // Fixed spacing between tooltip and target

                  // For mobile step 4, use top placement
                  if (isMobile && isStep4) {
                    return `${Math.max(8, rect.top + window.scrollY - tooltipHeight - SPACING)}px`;
                  }

                  // For mobile with left/right placement, use bottom placement instead
                  if (isMobile && (step.placement === "left" || step.placement === "right")) {
                    return `${Math.max(8, rect.bottom + window.scrollY + SPACING)}px`;
                  }

                  // Desktop placement logic
                  if (step.placement === "bottom") {
                    return `${Math.max(8, rect.bottom + window.scrollY + SPACING)}px`;
                  } else if (step.placement === "top") {
                    return `${Math.max(8, rect.top + window.scrollY - tooltipHeight - SPACING)}px`;
                  } else if (step.placement === "left" || step.placement === "right") {
                    // Center vertically for left/right placements
                    const centeredTop = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
                    // Ensure it doesn't overflow viewport
                    const minTop = 8;
                    const maxTop = Math.max(minTop, window.innerHeight - tooltipHeight - 8);
                    return `${Math.min(Math.max(centeredTop, minTop), maxTop)}px`;
                  }

                  return `${Math.max(8, rect.bottom + window.scrollY + SPACING)}px`;
                })(),
                zIndex: 1000000,
              }
            : {
                minWidth: window.innerWidth < 425 ? 300 : 400,
                maxWidth: window.innerWidth < 768 ? window.innerWidth - 32 : 400,
                position: "fixed",
                left: window.innerWidth < 768 ? "16px" : undefined,
                right: window.innerWidth < 768
                  ? "16px"
                  : window.innerWidth > 1024
                    ? window.innerWidth / 3
                    : window.innerWidth < 425
                    ? window.innerWidth / 8
                    : window.innerWidth / 4,
                bottom: window.innerWidth / 3,
                zIndex: 1000000,
              }
        }
      >
        <style jsx>{`
          @keyframes acShake {
            0% {
              transform: translateX(0);
            }
            10% {
              transform: translateX(-8px);
            }
            20% {
              transform: translateX(8px);
            }
            30% {
              transform: translateX(-6px);
            }
            40% {
              transform: translateX(6px);
            }
            50% {
              transform: translateX(-4px);
            }
            60% {
              transform: translateX(4px);
            }
            70% {
              transform: translateX(-2px);
            }
            80% {
              transform: translateX(2px);
            }
            100% {
              transform: translateX(0);
            }
          }
          .ac-shake {
            animation: acShake 600ms ease-in-out;
          }

          /* Arrow for bottom placement */
          #box-tutorial[data-placement="bottom"]::before {
            ${rect && arrowLeft != null ? `
              content: '';
              position: absolute;
              top: -10px;
              left: ${arrowLeft - 10}px;
              width: 20px;
              height: 20px;
              background: white;
              transform: rotate(45deg);
              z-index: 0;
            ` : ''}
          }

          /* Arrow for top placement */
          #box-tutorial[data-placement="top"]::before {
            ${rect && arrowLeft != null ? `
              content: '';
              position: absolute;
              bottom: -10px;
              left: ${arrowLeft - 10}px;
              width: 20px;
              height: 20px;
              background: white;
              transform: rotate(45deg);
              z-index: 0;
            ` : ''}
          }

          /* Arrow for left placement */
          #box-tutorial[data-placement="left"]::before {
            ${rect && arrowTop != null ? `
              content: '';
              position: absolute;
              right: -10px;
              top: ${arrowTop - 10}px;
              width: 20px;
              height: 20px;
              background: white;
              transform: rotate(45deg);
              z-index: 0;
            ` : ''}
          }

          /* Arrow for right placement */
          #box-tutorial[data-placement="right"]::before {
            ${rect && arrowTop != null ? `
              content: '';
              position: absolute;
              left: -10px;
              top: ${arrowTop - 10}px;
              width: 20px;
              height: 20px;
              background: white;
              transform: rotate(45deg);
              z-index: 0;
            ` : ''}
          }
        `}</style>
        <div
          style={{
            maxHeight: rect ? (window.innerWidth < 768 ? "calc(100vh - 100px)" : "80vh") : "auto",
            overflowY: rect ? "auto" : "visible"
          }}
        >
          <div className="flex flex-row justify-between items-center mb-4">
            <span className="font-semibold text-[14px]">{step?.title}</span>
            <span className="text-[11px] font-normal text-gray-500">
              {step?.stepText}
            </span>
          </div>
          <div className="text-[#4D5255] font-normal text-[14px] -- mb-4">
            {step?.content}
          </div>
        {stepFocused == 6 && (
          <div className="flex flex-row justify-between items-center mt-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="cursor-pointer bg-[#81CFF3] min-w-[48%] py-[8px] px-[16px] flex justify-center rounded-full items-center"
            >
              <span className="text-[#221AE9] font-semibold text-[14px] --">
                Prev
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartGameAnalysis();
              }}
              disabled={isSubmitting}
              className="cursor-pointer bg-[#221AE9] min-w-[48%] py-[8px] px-[16px] rounded-full flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white font-semibold text-[14px] --10px sm:text-[14px] --">
                {isSubmitting ? "Saving..." : "Start Game Analysis"}
              </span>
            </button>
          </div>
        )}
        {stepFocused < 6 && (
          <div className="flex flex-row justify-between items-center mt-2">
            {index < (steps.length - 1) && (
              <button
                onClick={(e) => {
                  skip();
                }}
                className="bg-[#E6F7FE] min-w-[80px] py-[5px] px-[16px] rounded-full items-center"
              >
                <span className="text-[#221AE9] font-semibold text-[14px] --">
                  Skip
                </span>
              </button>
            )}
            <div className="flex w-full gap-2 justify-end mt-2">
              {stepFocused > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className={`${index + 1 >= steps.length ? "flex-1" : ""} bg-[#81CFF3] min-w-[80px] py-[5px] px-[16px] rounded-full items-center`}
                >
                  <span className="text-[#221AE9] font-semibold text-[14px] --">
                    Prev
                  </span>
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (index + 1 >= steps.length) {
                    handleStartGameAnalysis();
                  } else {
                    next();
                  }
                }}
                disabled={isSubmitting && index + 1 >= steps.length}
                className={`${index + 1 >= steps.length ? "flex-1" : ""} cursor-pointer bg-[#221AE9] min-w-[80px] py-[5px] px-[16px] rounded-full items-center disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-white font-semibold text-[14px] --">
                  {index + 1 >= steps.length
                    ? (isSubmitting ? "Saving..." : "Start Game Analysis")
                    : "Next"}
                </span>
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );

  // Render into document.body so the tour UI sits above modals/dialogs and their overlays
  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
