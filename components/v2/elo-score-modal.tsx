"use client";

/**
 * "What is an ELO Score?" explainer — shared by the /play top bar and the
 * Play VS AI stats leaderboard card so both open identical copy.
 */
export function EloScoreModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl px-[32px] py-[28px] max-w-[460px] w-full mx-4 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[14px] right-[18px] text-[#9CA3AF] hover:text-[#374151] text-[20px] leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="font-bold text-[18px] text-[#111827] mb-[16px]">
          What is an ELO Score?
        </h2>

        <p className="text-[14px] text-[#374151] mb-[12px]">
          Your ELO score is a number that represents your current chess skill level.
          Every time you play a rated game, your ELO changes based on the result
          and the strength of your opponent.
        </p>
        <p className="text-[14px] text-[#374151] mb-[12px]">
          Winning against stronger opponents will increase your rating more, while
          losing to lower-rated opponents may cause a larger decrease.
        </p>
        <p className="text-[14px] text-[#374151] mb-[24px]">
          Your ELO helps match you with players of similar strength and determines
          your position on the leaderboard.*
        </p>

        <button
          onClick={onClose}
          className="w-full bg-[#221AE9] text-white py-[13px] rounded-full font-semibold text-[15px] hover:opacity-90 transition-opacity"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default EloScoreModal;
