"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTutorial } from "./TutorialProvider";
import { usePgnStore } from "@/app/store/zustandStore";

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
  const { stepFocused, stopTutorial, setStepFocused, allSteps } = useTutorial();
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [arrowLeft, setArrowLeft] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const step = steps[index];
  const width = window.innerWidth;
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
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
      }
    };

    handle();
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
      return;
    }
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const targetCenter = rect.left + window.scrollX + rect.width / 2;
    const leftInsideTooltip = targetCenter - tooltipRect.left;
    // ensure arrow not too close to edges
    const clamped = Math.max(
      12,
      Math.min(leftInsideTooltip, tooltipRect.width - 12)
    );
    setArrowLeft(clamped);
  }, [rect, index, run]);

  useEffect(() => {
    if (!run) return;
    const s = steps[index];
    if (!s) return;
    const el = document.querySelector(s.target) as HTMLElement | null;
    if (el) {
      setRect(el.getBoundingClientRect());
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
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
    if (step != null) {
      let focusedIndex = allSteps.findIndex(
        (st) => st.stepText == step.stepText
      );
      // console.log("focused step", focusedIndex);
      setStepFocused(focusedIndex);
    }
  }, [index]);

  if (!run || !steps || steps.length === 0) return null;

  const next = () => {
    console.log("index", steps.length, stepFocused, pathname, index);
    setIndex((i) => i + 1);
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
    setIndex((i) => Math.max(0, i - 1));
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
        borderRadius: 8,
        boxShadow:
          "0 0 0 3px rgba(255,255,255,0.6), 0 6px 24px rgba(0,0,0,0.25)",
        border: "2px solid rgba(255,255,255,0.85)",
        pointerEvents: "none",
        zIndex: 999998,
      }}
    />
  ) : null;

  const handleStartGameAnalysis = () => {
    stopTutorial();
    setIsFromGameHistory(false);
    setIsOpenTutorial(false);
    window.location.href = "/my-game-history";
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
        className={`block max-w-[375px] sm:min-w-[420px] mt-2 bg-white text-gray-900 p-3 rounded-lg shadow-lg ${
          rect ? "" : "fixed right-3 bottom-1"
        } ${shaking ? "ac-shake" : ""}`}
        style={
          rect
            ? {
                minWidth: window.innerWidth < 425 ? 300 : 500,
                position: "fixed",
                left:
                  step.placement === "right"
                    ? `${rect.right + window.scrollX + 16}px`
                    : step.placement === "left"
                    ? `${rect.left + window.scrollX - (window.innerWidth < 425 ? 300 : 500) - 16}px`
                    : `${left}px`,
                top:
                  step.placement === "bottom"
                    ? `${top}px`
                    : step.placement === "top"
                    ? `${top && top - (rect.height + 200)}px`
                    : step.placement === "left" || step.placement === "right"
                    ? `${rect.top + window.scrollY}px`
                    : `${top && top - (rect.height + 200)}px`,
                zIndex: 1000000,
              }
            : {
                minWidth: window.innerWidth < 425 ? 300 : 400,
                position: "fixed",
                right:
                  window.innerWidth > 1024
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
        `}</style>
        <div className="flex flex-row justify-between items-center mb-4">
          <span className="font-semibold text-[14px]">{step?.title}</span>
          <span className="text-[11px] font-normal text-gray-500">
            {step?.stepText}
          </span>
        </div>
        {rect && arrowLeft != null && step.placement === "bottom" && (
          <svg
            aria-hidden
            width={24}
            height={12}
            viewBox="0 0 24 12"
            style={{
              position: "absolute",
              top: window.innerWidth > 425 ? -8 : -10,
              left: arrowLeft - 12,
              overflow: "visible",
              pointerEvents: "none",
              zIndex: 61,
            }}
          >
            <defs>
              <filter width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodOpacity="0.12"
                />
              </filter>
            </defs>
            <path d="M0,12 L12,0 L24,12 Z" fill="white" filter="url(#shadow)" />
          </svg>
        )}

        {rect && arrowLeft != null && step.placement === "top" && (
          <svg
            aria-hidden
            width={24}
            height={12}
            viewBox="0 0 24 12"
            style={{
              position: "absolute",
              bottom: window.innerWidth > 425 ? -8 : -10,
              left: arrowLeft - 16,
              overflow: "visible",
              pointerEvents: "none",
              zIndex: 61,
            }}
          >
            <defs>
              <filter id="shadow" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodOpacity="0.12"
                />
              </filter>
            </defs>
            {/* flipped triangle to point downward */}
            <path d="M0,0 L12,12 L24,0 Z" fill="white" filter="url(#shadow)" />
          </svg>
        )}

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

            <div
              onClick={(e) => {
                handleStartGameAnalysis();
              }}
              className="cursor-pointer bg-[#221AE9] min-w-[48%] py-[8px] px-[16px] rounded-full flex justify-center items-center"
            >
              <span className="text-white font-semibold text-[14px] --10px sm:text-[14px] --">
                Start Game Analysis
              </span>
            </div>
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
                className={`${index + 1 >= steps.length ? "flex-1" : ""} cursor-pointer bg-[#221AE9] min-w-[80px] py-[5px] px-[16px] rounded-full items-center`}
              >
                <span className="text-white font-semibold text-[14px] --">
                  {index + 1 >= steps.length ? "Start Game Analysis" : "Next"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render into document.body so the tour UI sits above modals/dialogs and their overlays
  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
}
