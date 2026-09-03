"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ChesscomPromoModalProps {
  /** Dismiss without connecting (X, backdrop or Esc). */
  onClose: () => void;
  /** "Connect Chess.com Account" — dismisses and opens the real connect flow. */
  onConnect: () => void;
}

/** The two selling points, each a gradient pill with its icon overhanging the
 *  left edge. Copy is split into explicit lines rather than left to wrap: the
 *  mockup breaks after "your" on both rows, which natural wrapping wouldn't do
 *  at this width. */
const FEATURES = [
  {
    icon: "/images/v2/profile/icon-cup.png",
    alt: "",
    lines: ["Import your", "Chess.com ELO-Rating"],
  },
  {
    icon: "/images/v2/profile/icon-chessboard-pieces.png",
    alt: "",
    lines: ["Analyze your", "Chess.com Games"],
  },
];

/**
 * "Connect your Chess.com Account now" promo. Shown once a day, at most five
 * times, to signed-in users who haven't linked a Chess.com account — see
 * ChesscomPromoModalHost for the gating and the shown-count bookkeeping.
 */
export function ChesscomPromoModal({
  onClose,
  onConnect,
}: ChesscomPromoModalProps) {
  // Esc closes, and the page behind can't scroll while the promo is up.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    /* z-[500] matches DayStreakModal — clears the z-50 header/sidebar and the
       z-[70] connect dialog, and stays under the playground tour's z-[700]. */
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Connect your Chess.com Account"
    >
      <div
        className="relative w-full max-w-[352px] overflow-hidden rounded-[24px] bg-[#EBF2FE] shadow-[0_18px_50px_rgba(16,34,153,.28)] sm:max-w-[550px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Art direction, not one image scaled two ways: the landscape export
            is 1100x914 (aspect 1.20 — the desktop card's own aspect, so it
            lands essentially un-cropped) and the portrait one is 720x954
            (0.755 against the mobile card's 0.68, so cover trims only ~10% a
            side and every piece survives). A single landscape file cropped to
            the mobile card loses ~22% each side, which is exactly where all the
            art lives, and rendered flat.

            <picture> rather than two next/image elements toggled with
            sm:hidden: a display:none <img> is still fetched, so that would pull
            both files down on every open. A <source media> fetches only the one
            that matches. bg-[#B9CDFB] is the art's base tone, so there's no
            transparent flash before it decodes. */}
        <picture>
          <source
            media="(min-width: 640px)"
            srcSet="/images/v2/profile/background-chesscom.png"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image
              has no art-direction support; see the note above. */}
          <img
            src="/images/v2/profile/background-mobile-chesscom.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
          />
        </picture>
        {/* White scrim over the art. Both exports' bare field measures ~#CDDDFC
            (sampled off-canvas), which reads far more saturated than the
            mockup's near-white card. 60% white lands both on ~#EBF2FE — it
            keeps the mockup's faint blue tint and leaves the pieces readable as
            ghosts, where 70% washed them out noticeably further than the
            mockup. One value covers both breakpoints because the two files'
            field tones are within a unit of each other. The card's own bg is
            that resulting tone, so nothing flashes before the image decodes. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-white/60"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[14px] top-[14px] z-10 flex h-[28px] w-[28px] items-center justify-center rounded-full text-[#0F1533] transition-colors hover:bg-black/5 sm:right-[18px] sm:top-[16px] sm:h-[32px] sm:w-[32px]"
        >
          <svg
            className="h-[17px] w-[17px] sm:h-[21px] sm:w-[21px]"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 1.5L15.5 15.5M15.5 1.5L1.5 15.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="relative px-[18px] pb-[28px] pt-[46px] sm:px-[62px] sm:pb-[24px] sm:pt-[26px]">
          <Image
            src="/images/v2/profile/connect_icon2.png"
            alt=""
            width={144}
            height={116}
            className="mx-auto h-[86px] w-auto object-contain sm:h-[100px]"
            priority
          />

          <p className="mt-[26px] text-center text-[14px] font-semibold leading-[130%] text-[#0F1533] sm:mt-[30px] sm:text-[20px]">
            Enable even more features:
          </p>
          <h2 className="mt-[6px] text-center text-[20px] font-bold leading-[130%] text-[#221AE9] sm:mt-[4px]">
            Connect your <span className="font-extrabold">Chess.com</span>{" "}
            Account now.
          </h2>

          <div className="mt-[24px] flex flex-col gap-[12px] sm:mt-[24px] sm:gap-[19px]">
            {FEATURES.map((feature) => (
              <div
                key={feature.lines[1]}
                className="relative flex min-h-[72px] items-center rounded-[14px] bg-[linear-gradient(90deg,#3CC8DF_0%,#2A38E8_100%)] py-[10px] pl-[62px] pr-[14px] sm:min-h-[47px] sm:rounded-[10px] sm:py-[6px] sm:pl-[64px]"
              >
                <Image
                  src={feature.icon}
                  alt={feature.alt}
                  width={132}
                  height={154}
                  className="absolute left-[-8px] top-1/2 w-[62px] -translate-y-1/2 object-contain drop-shadow-[0_4px_8px_rgba(16,34,153,.35)] sm:left-[-10px] sm:w-[66px]"
                />
                <p className="text-[15px] font-bold leading-[130%] text-white sm:text-[20px]">
                  {feature.lines[0]}{" "}
                  {/* font-bold again on the span: bold in this app is a
                      font-FAMILY swap, and globals.css has a bare
                      `span { font-family: AloeveraDisplay-Regular }` element
                      rule that beats inheritance — without the class this half
                      renders in the Regular face inside a bold <p>. */}
                  <span className="block font-bold sm:inline">
                    {feature.lines[1]}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onConnect}
            className="mx-[20px] mt-[30px] flex h-[48px] w-[calc(100%-40px)] items-center justify-center rounded-full bg-[#221AE9] text-[15px] font-semibold text-white transition-colors hover:bg-[#2d25ea] sm:mx-auto sm:mt-[35px] sm:h-[46px] sm:w-auto sm:px-[24px]"
          >
            Connect Chess.com Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChesscomPromoModal;
