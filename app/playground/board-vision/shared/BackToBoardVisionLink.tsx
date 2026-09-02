import React from "react";
import Link from "next/link";

/**
 * Back arrow to the Board Vision landing page, sitting at the top-left of the
 * screen above the board.
 *
 * The question header (QuestionPanel) has carried its own arrow all along, but
 * the end-of-quiz header builds a separate bar without one, leaving the last
 * screen of the flow with no way out. Mobile only.
 */
const BackToBoardVisionLink: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <Link
    href="/playground/board-vision"
    aria-label="Back to Board Vision"
    className={`xl:hidden inline-flex items-center shrink-0 ${className}`}
  >
    <svg
      width="23"
      height="18"
      viewBox="0 0 23 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.1788 9H1.36719"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.03385 16.636L1.36719 8.99965L9.03385 1.36328"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Link>
);

export default BackToBoardVisionLink;
