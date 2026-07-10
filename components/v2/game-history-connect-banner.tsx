"use client";

interface Props {
  /** Opens the Chess.com connect flow (ChessAccountSetup dialog). */
  onClick: () => void;
}

/**
 * Light-lavender "Your Chess.com account is not connected" banner used on the
 * revamped Game History page. Kept separate from the shared AccountNotConnected
 * component (which is also used by /profile) so nothing else is affected.
 */
export default function GameHistoryConnectBanner({ onClick }: Props) {
  return (
    <div className="w-full my-[16px] flex items-center gap-[12px] rounded-2xl border border-[#DAD8FB] bg-[#EDECFD] px-[16px] py-[16px] md:px-[24px]">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="#221AE9"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M19 22H5v-2h14v2zm-2.5-3H7.5c-.28 0-.5-.22-.5-.5 0-2.5 1.4-4.2 2.9-5.2-.9-.7-1.4-1.6-1.4-2.8 0-.7.2-1.3.5-1.9-.6-.4-1-1-1-1.8C7.5 5.8 8.3 5 9.3 5c.5 0 1 .2 1.3.6C11.1 4.6 11.5 4 12 4c1.7 0 3 2.5 3.5 4.5.3 1.2.5 2.7.5 4.3 0 2.6-1.1 4.2-2.5 5.2.9.4 1.5.9 1.5 1.5 0-.28-.22-.5-.5-.5z" />
      </svg>

      <p className="text-[14px] md:text-[16px] leading-[140%] text-[#1E1E1E] font-medium">
        Your Chess.com account is not connected.{" "}
        <button
          type="button"
          onClick={onClick}
          className="text-[#221AE9] font-semibold underline underline-offset-2 hover:opacity-80"
        >
          Connect now.
        </button>
      </p>
    </div>
  );
}
