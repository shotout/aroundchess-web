"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

/** Bold here is a font-family swap, not a weight — `font-bold` does nothing. */
const ALOEVERA_BOLD = { fontFamily: '"AloeveraDisplay-Bold", system-ui, sans-serif' };

/** The design's swatches, 0 → 10. */
const SCORE_COLORS = [
  "#E14B3D", // 0
  "#E15A3D", // 1
  "#E37A3A", // 2
  "#E69B38", // 3
  "#E6B936", // 4
  "#D5D399", // 5
  "#B9C73A", // 6
  "#9BC63E", // 7
  "#7EC245", // 8
  "#5CB85C", // 9
  "#3FA53A", // 10
];

/** The design's per-swatch opacity; 5 is marked 100% because it is palest. */
const SCORE_REST_ALPHA = [0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 0.5];

/** Selected is the same swatch at full strength, so the hue never changes. */
function swatchColor(score: number, selected: boolean): string {
  const hex = SCORE_COLORS[score];
  const alpha = selected ? 1 : SCORE_REST_ALPHA[score];
  if (alpha >= 1) return hex;
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Matches the backend's cap, so the field stops before the request rejects. */
const COMMENT_MAX = 2000;

interface NpsFeedbackModalProps {
  onSubmit: (score: number, comment: string) => void;
  onClose: () => void;
  submitting?: boolean;
}

function ScoreCircle({
  score,
  selected,
  onSelect,
}: {
  score: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Score ${score}`}
      aria-pressed={selected}
      className={`nps-score flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[18px] leading-none text-white outline-none sm:h-[62px] sm:w-[62px] sm:text-[24px] ${
        selected ? "nps-score--selected ring-[3px] ring-[#0F172A]" : ""
      }`}
      style={{
        ...ALOEVERA_BOLD,
        backgroundColor: swatchColor(score, selected),
      }}
    >
      {score}
    </button>
  );
}

export function NpsFeedbackModal({
  onSubmit,
  onClose,
  submitting = false,
}: NpsFeedbackModalProps) {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  useEffect(() => {
    // Restored, not cleared: some pages set their own overflow.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /** `fixed inset-0` does not shrink for the on-screen keyboard; this does. */
  const [visible, setVisible] = useState<{ height: number; top: number } | null>(
    null
  );

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const sync = () =>
      setVisible({ height: viewport.height, top: viewport.offsetTop });
    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  const commentRef = useRef<HTMLTextAreaElement | null>(null);

  const handleCommentFocus = () => {
    const field = commentRef.current;
    if (!field) return;
    // Delayed: at focus time the keyboard has not resized the viewport yet.
    window.setTimeout(() => {
      field.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-[500] overflow-y-auto bg-black/40"
      style={
        visible
          ? { top: visible.top, height: visible.height, bottom: "auto" }
          : undefined
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="nps-feedback-title"
    >
      {/* min-h-full so a card taller than the screen scrolls from its top. */}
      <div className="flex min-h-full items-center justify-center p-[16px]">
        <div className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] bg-[#DDE9FC] shadow-2xl">
          <Image
            src="/images/v2/nps/background_modal.png"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 560px"
            className="object-cover"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-[14px] top-[14px] z-10 flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-black/5 sm:right-[20px] sm:top-[20px]"
          >
            <svg
              className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L22 22M22 2L2 22"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* relative, so it paints over the fill image above it. */}
          <div className="relative flex flex-col items-center px-[20px] pb-[22px] pt-[26px] sm:px-[36px] sm:pb-[32px] sm:pt-[30px]">
            <Image
              src="/images/v2/nps/feedback-icon.png"
              alt=""
              width={240}
              height={240}
              className="h-[64px] w-auto object-contain sm:h-[104px]"
              aria-hidden="true"
            />

            <h2
              id="nps-feedback-title"
              className="mt-[6px] text-center text-[22px] leading-[125%] text-[#221AE9] sm:mt-[10px] sm:text-[38px]"
              style={ALOEVERA_BOLD}
            >
              Share your feedback
            </h2>

            <p
              className="mt-[8px] max-w-[440px] text-center text-[18px] leading-[135%] text-[#111827] sm:mt-[12px] sm:text-[22px]"
            >
              How likely are you to recommend AroundChess to a friend or
              colleague?
            </p>

            <div className="mt-[16px] w-full sm:mt-[20px]">
              <span className="block text-[14px] leading-none text-[#111827] sm:text-[16px]">
                Not at all likely
              </span>

              {/* Two fixed rows: wrapping would split 7/4 at some widths. */}
              <div className="mt-[10px] flex justify-center gap-[6px] sm:gap-[12px]">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <ScoreCircle
                    key={value}
                    score={value}
                    selected={score === value}
                    onSelect={() => setScore(value)}
                  />
                ))}
              </div>
              <div className="mt-[8px] flex justify-center gap-[6px] sm:mt-[12px] sm:gap-[12px]">
                {[6, 7, 8, 9, 10].map((value) => (
                  <ScoreCircle
                    key={value}
                    score={value}
                    selected={score === value}
                    onSelect={() => setScore(value)}
                  />
                ))}
              </div>

              <span className="mt-[10px] block text-right text-[14px] leading-none text-[#111827] sm:text-[16px]">
                Extremely likely
              </span>
            </div>

            {score !== null && (
              <div className="mt-[14px] w-full sm:mt-[18px]">
                <label
                  htmlFor="nps-feedback-comment"
                  className="block text-[14px] leading-none text-[#111827] sm:text-[16px]"
                >
                  Optional:
                </label>
                {/* 16px minimum: iOS zooms the page in on smaller fields. */}
                <textarea
                  id="nps-feedback-comment"
                  ref={commentRef}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  onFocus={handleCommentFocus}
                  maxLength={COMMENT_MAX}
                  rows={3}
                  placeholder="What's the reason for your score, and what could we improve?"
                  className="mt-[8px] w-full resize-none rounded-[16px] bg-white/85 px-[16px] py-[12px] text-[16px] leading-[140%] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#221AE9]/30"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => score !== null && onSubmit(score, comment)}
              disabled={score === null || submitting}
              className="mt-[16px] w-full rounded-full bg-[#221AE9] py-[13px] text-[16px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-[20px] sm:py-[15px] sm:text-[18px]"
              style={ALOEVERA_BOLD}
            >
              {submitting ? (
                <span className="inline-flex items-center justify-center gap-[8px]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
