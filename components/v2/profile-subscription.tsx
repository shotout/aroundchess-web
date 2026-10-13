"use client";

import { useContactUs } from "@/app/store/contactUs";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useCancelSubscription } from "@/app/store/cancelSubscription";
import DotSpinner from "@/components/game-history/Spinner";
import { formatDateHistory } from "@/functions/format-date";
import {
  MARCH_OFFER_MONTHLY_PRICE,
  MARCH_OFFER_YEARLY_PRICE,
} from "@/constants/marchOffer";
import { useMembershipCheckout } from "@/hooks/useMembershipCheckout";
import { usePromoActive, usePromoEndDateLabel } from "@/hooks/usePromo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FEATURE_TILES = [
  { icon: "/images/v2/profile/icon-_Analyze Games 1.png", top: "Analyze", bottom: "Games" },
  { icon: "/images/v2/profile/icon-_Puzzles 1.png", top: "Practice:", bottom: "Chess Puzzles" },
  { icon: "/images/v2/profile/icon-_Board Vision 1.png", top: "Practice:", bottom: "Board Vision" },
  { icon: "/images/v2/profile/icon-_Endgame Training 1.png", top: "Practice:", bottom: "Endgame Training" },
  { icon: "/images/v2/profile/icon-_My training plan 1.png", top: "Learn:", bottom: "Training Plan" },
  { icon: "/images/v2/profile/icon-_Handbook- Chess Theory 1.png", top: "Learn: Handbook:", bottom: "Chess Theory" },
];

const PREMIUM_FEATURES = [
  "Practice: Chess Puzzles",
  "Practice: Board Vision",
  "Practice: Endgame Training",
  "Learn: Training Plan",
  "Learn: Handbook: Chess Theory",
  "Early Feature Update",
  "Discord VIP Access",
];

const GreenCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 mt-[2px] hidden lg:block"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="8" fill="#22C55E" />
    <path
      d="M4.5 8.2 6.9 10.6 11.5 5.9"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BlueCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0 mt-[2px]"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="8" fill="#221AE9" />
    <path
      d="M4.5 8.2 6.9 10.6 11.5 5.9"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PremiumBenefit = ({ text }: { text: string }) => (
  <div className="flex items-start lg:gap-2 rounded-[8px] bg-white/10 px-[10px] py-[8px] lg:px-[12px]">
    <GreenCheck />
    <p className="text-[11px] lg:text-[13px] leading-[140%] text-white">{text}</p>
  </div>
);

const FreeBenefit = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2 rounded-[8px] bg-[#EDECFD] px-[12px] py-[10px]">
    <BlueCheck />
    <p className="text-[13px] leading-[140%] text-[#1E1E1E]">{text}</p>
  </div>
);

const CurrentPackageBox = ({ note }: { note?: string }) => (
  <div className="relative mt-auto w-full rounded-[12px] border border-dashed border-[#7A8699] bg-gradient-to-r from-white via-[#E6F7FE] to-white px-[12px] py-[10px] flex items-center justify-center gap-2 overflow-hidden">
    <Image
      src="/images/v2/profile/remaining_token.png"
      alt=""
      width={40}
      height={40}
      className="object-contain shrink-0"
    />
    <p className="text-[12px] font-medium text-black">
      You are on this Package.{note ? ` ${note}` : ""}
    </p>
  </div>
);

/** The premium cards' "You are on this Package" badge — the cyan, crowned
 *  style the header's "Premium package active!" pill uses. */
const PremiumCurrentPackageBox = ({ note }: { note?: string }) => (
  <div className="relative w-full overflow-hidden rounded-[12px] border border-dashed border-white bg-[linear-gradient(to_right,#25CEDA,#25CEDA_55%,#B2E8F9)] px-[10px] py-[8px] lg:px-[12px] flex items-center gap-2 min-h-[48px]">
    <Image
      src="/icons/onboarding-popup.png"
      alt=""
      width={36}
      height={36}
      className="relative z-10 object-contain shrink-0 w-[28px] h-[28px] lg:w-[36px] lg:h-[36px]"
    />
    <p className="relative z-10 text-[11px] lg:text-[14px] font-medium leading-[130%] text-black text-left">
      You are on this Package.{note ? ` ${note}` : ""}
    </p>
    <Image
      src="/icons/sparks-member.png"
      alt=""
      aria-hidden
      width={56}
      height={56}
      className="pointer-events-none absolute right-0 top-0 h-full w-[56px] object-cover"
    />
  </div>
);

interface PremiumPlanCardProps {
  billedLabel: string;
  gradientClass: string;
  statNumber: string;
  statUnit: string;
  analysisFeature: string;
  showSaveBadge?: boolean;
  hasDiscount: boolean;
  fullPrice: number;
  price: number;
  period: string;
  perAnalysis: string;
  /** Backend `promo_end` label; empty hides the "Offer ends" note. */
  offerEndsLabel: string;
  isCurrentPlan: boolean;
  canPurchase: boolean;
  isLoadingPay: boolean;
  onGetPremium: () => void;
  memberNote?: string;
  showCancel: boolean;
  onCancel: () => void;
}

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({
  billedLabel,
  gradientClass,
  statNumber,
  statUnit,
  analysisFeature,
  showSaveBadge,
  hasDiscount,
  fullPrice,
  price,
  period,
  perAnalysis,
  offerEndsLabel,
  isCurrentPlan,
  canPurchase,
  isLoadingPay,
  onGetPremium,
  memberNote,
  showCancel,
  onCancel,
}) => (
  <div
    className={`relative flex flex-col rounded-[16px] p-[12px] lg:p-[16px] text-white ${gradientClass} ${
      isCurrentPlan
        ? "ring-[3px] ring-[#7FF5F0] shadow-[0_0_24px_rgba(37,206,218,0.55)]"
        : "shadow-md"
    }`}
  >
    {showSaveBadge && (
      <div className="absolute -top-3 left-0 right-0 flex justify-center">
        <div className="bg-[#A855F7] px-3 lg:px-4 py-1 rounded-full text-[11px] lg:text-[13px] font-semibold">
          Save 50%
        </div>
      </div>
    )}

    <div className="flex items-center gap-2 lg:gap-3 mb-3 pt-1">
      <Image
        src="/images/v2/profile/premium_package.png"
        alt="Premium Plan"
        width={56}
        height={56}
        className="object-contain shrink-0 w-[40px] h-[40px] lg:w-[56px] lg:h-[56px]"
      />
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-[15px] lg:text-[20px] font-semibold leading-[130%]">Premium Plan</h3>
        <div className="bg-[#FFC933] text-[#1E1E1E] text-[11px] lg:text-[15px] font-bold px-2 lg:px-3 py-[2px] rounded-full">
          {billedLabel}
        </div>
      </div>
    </div>

    <div className="rounded-[12px] bg-[#0B2B57]/60 p-[10px] lg:p-[12px] flex flex-col gap-2">
      <div className="flex items-center justify-center gap-1 lg:gap-2 py-1">
        <span className="text-[26px] lg:text-[40px] font-bold leading-none">{statNumber}</span>
        <span className="text-[11px] lg:text-[15px] font-semibold leading-[120%]">
          Analyses <br /> {statUnit}
        </span>
      </div>
      <PremiumBenefit text={analysisFeature} />
      {PREMIUM_FEATURES.map((feature) => (
        <PremiumBenefit key={feature} text={feature} />
      ))}
    </div>

    <div className="mt-4 text-center">
      {hasDiscount ? (
        <div className="flex flex-wrap items-end justify-center gap-1 lg:gap-2">
          <span className="relative text-[12px] lg:text-[15px] text-white/70">
            ${fullPrice.toFixed(2)}
            {/* Diagonal strike running up-right to down-left. text-decoration
                can only draw a horizontal rule, so this is a rotated bar. */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-[-2px] right-[-2px] top-1/2 h-[2px] -translate-y-1/2 -rotate-12 rounded-full bg-red-500"
            />
          </span>
          <span className="text-[18px] lg:text-[22px] font-bold leading-none">
            ${price.toFixed(2)}
            <span className="text-[12px] lg:text-[14px] font-normal"> /{period}</span>
          </span>
        </div>
      ) : (
        <span className="text-[18px] lg:text-[22px] font-bold leading-none">
          ${price.toFixed(2)}
          <span className="text-[12px] lg:text-[14px] font-normal"> /{period}</span>
        </span>
      )}
      <p className="text-[11px] lg:text-[13px] mt-1">
        (<span className="font-semibold">${perAnalysis}</span> per Analysis)
      </p>
    </div>

    {canPurchase && (
      <>
        <button
          disabled={isLoadingPay}
          onClick={onGetPremium}
          className="mt-4 w-full py-[10px] bg-[#F3FBFF] rounded-full text-[#221AE9] font-semibold hover:bg-white transition-colors text-[13px] lg:text-[15px]"
        >
          {isLoadingPay ? <DotSpinner size={8} /> : "Get Premium"}
        </button>
        {offerEndsLabel && (
          <p className="mt-3 text-center text-[11px] lg:text-[13px] text-white">
            Offer ends {offerEndsLabel}
          </p>
        )}
      </>
    )}

    {isCurrentPlan && (
      <div className="mt-4">
        <PremiumCurrentPackageBox note={memberNote} />
        {showCancel && (
          <button type="button" className="mt-3 w-full" onClick={onCancel}>
            <span className="font-medium text-[14px] lg:text-[16px] text-white underline underline-offset-2 hover:opacity-80">
              Cancel Subscription
            </span>
          </button>
        )}
      </div>
    )}
  </div>
);

interface SubscriptionPlansProps {
  /** The "My Subscription" section heading — profile page only. */
  showTitle?: boolean;
  /** Paywall analytics bucket for the Get Premium clicks. */
  source?: "user_settings" | "pricing_dialog";
}

/**
 * Revamped plan picker: feature tiles, the Free/Monthly/Yearly cards and the
 * Chess Club note. Rendered on /profile and inside the pricing dialog's
 * "Go Unlimited with a Subscription" tab, so both stay on the same design.
 */
export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  showTitle = false,
  source = "user_settings",
}) => {
  const { activeMembership, isMember, isMemberMonthly, profile, sessionId } =
    useProfileStore();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const {
    startCheckout: handleGetPremium,
    paySelected,
    isLoading,
  } = useMembershipCheckout(source);
  const { setOpen: setOpenCancel } = useCancelSubscription();
  const { setOpen: setOpenContactUs } = useContactUs();

  const isPremium = Boolean(isMember || isMemberMonthly);

  const deadline =
    new Date(profile?.discountInfo?.startDate).getTime() + 7 * 24 * 60 * 60 * 1000;
  const isPass = deadline - Date.now();

  const marchActive = usePromoActive();
  const promoEndLabel = usePromoEndDateLabel();
  const showMarchDiscount = marchActive && !isPremium;
  const hasLegacyMonthlyDiscount =
    !isMemberMonthly && profile?.discountInfo?.hasActiveDiscount && isPass > 0;

  const monthlyPrice = showMarchDiscount
    ? MARCH_OFFER_MONTHLY_PRICE
    : hasLegacyMonthlyDiscount
    ? 6.99
    : 9.99;
  const yearlyPrice = showMarchDiscount ? MARCH_OFFER_YEARLY_PRICE : 79.99;

  const handleOpenContactUs = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenPricing(false);
    setOpenContactUs(true);
  };

  const handleCancelSubscription = () => {
    setOpenCancel(true);
  };

  const handleSignUp = () => {
    window.location.href = "/register";
  };

  // `isCancelled` (GET /membership/active) is the cancelled-but-still-paid
  // flag; autoRenew alone can't tell, store rows keep it false while renewing.
  const isCancelled = Boolean(activeMembership?.isCancelled);

  const memberNote = isCancelled
    ? `Your Premium access ends on ${formatDateHistory(activeMembership.endDate)}.`
    : activeMembership?.autoRenew
    ? `The Subscription automatically renews on ${formatDateHistory(
        activeMembership.endDate
      )}.`
    : undefined;

  // Only a renewing Stripe plan can be cancelled from the web: store rows
  // (App Store / Google Play) keep autoRenew false, so they never see it.
  const canCancel = Boolean(activeMembership?.autoRenew && !isCancelled);

  return (
    <div className="flex flex-col gap-4">
      {/* Centered plain title on mobile, left-aligned with divider on desktop */}
      {showTitle && (
        <div className="flex flex-row items-center justify-center md:justify-between border-0 border-b-0 md:border-b-2 border-b-[#C0CED4] pb-1">
          <span className="text-[18px] font-semibold">My Subscription</span>
        </div>
      )}

      <div className="text-center">
        <p className="text-[14px] text-black mb-3">
          Discover our Suite of Powerful Features with the AroundChess{" "}
          <span className="text-[#221AE9] font-semibold">Premium Subscription</span>:
        </p>

        <div className="flex justify-center">
          {/* Mobile: one horizontally scrollable row (mockup). md+: wrapped rows. */}
          <div
            className="flex w-full min-w-0 gap-3 overflow-x-auto pb-2 md:w-auto md:min-w-min md:overflow-visible md:flex-wrap md:justify-center md:pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {FEATURE_TILES.map((tile) => (
              <div
                key={tile.bottom}
                className="bg-[#EDECFD] border border-[#221AE9] rounded-[8px] flex flex-col justify-center items-center gap-2 w-[104px] md:min-w-[110px] md:w-[110px] h-[110px] px-1 shrink-0"
              >
                <Image
                  alt={`${tile.top} ${tile.bottom}`}
                  src={tile.icon}
                  width={64}
                  height={64}
                  className="max-w-[36px] h-[34px] object-contain"
                />
                <p className="text-[11px] font-normal text-gray-900 leading-tight text-center">
                  {tile.top}
                  <br />
                  {tile.bottom}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isPremium && (
        <h2 className="text-center text-[16px] md:text-[24px] font-bold text-[#221AE9] whitespace-nowrap md:whitespace-normal">
          Go Premium Now for unlimited Access
        </h2>
      )}

      {/* Mobile: monthly + yearly side by side, free package full-width below */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 pt-3">
        {/* Free package */}
        <div className="flex flex-col rounded-[16px] border border-gray-200 bg-white p-[16px] shadow-sm order-last lg:order-none col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="/images/v2/profile/free_package.png"
              alt="Free Package"
              width={56}
              height={56}
              className="object-contain shrink-0"
            />
            <div>
              <h3 className="text-[20px] font-semibold text-black leading-[130%]">
                Free Package
              </h3>
              {/* The mockup's mobile card is title-only — price is desktop-only. */}
              <div className="hidden lg:block text-[22px] font-bold text-black">
                $0
              </div>
            </div>
          </div>

          <p className="text-[14px] text-gray-700 mb-4">
            Our free package with limited Access
          </p>

          <div className="space-y-2">
            <FreeBenefit text="Analyze the Mistakes of your first game for free" />
            <FreeBenefit text="Play against AI" />
          </div>

          <div className="flex-grow" />

          {sessionId.length == 0 ? (
            <button
              onClick={handleSignUp}
              className="mt-4 w-full py-[10px] bg-[#221AE9] rounded-full text-white font-medium text-[14px]"
            >
              Sign up for free
            </button>
          ) : (
            !isPremium && (
              <div className="mt-4">
                <CurrentPackageBox />
              </div>
            )
          )}
        </div>

        {/* Premium monthly */}
        <PremiumPlanCard
          billedLabel="Billed Monthly"
          gradientClass="bg-gradient-to-br from-[#130F83] to-[#00FFBB]"
          statNumber="80"
          statUnit="per month"
          analysisFeature="Analyze the mistakes of 80 Games per month"
          hasDiscount={showMarchDiscount || hasLegacyMonthlyDiscount}
          fullPrice={9.99}
          price={monthlyPrice}
          period="month"
          perAnalysis={(monthlyPrice / 80).toFixed(2)}
          offerEndsLabel={showMarchDiscount ? promoEndLabel : ""}
          isCurrentPlan={Boolean(isMemberMonthly)}
          canPurchase={!isPremium}
          isLoadingPay={isLoading && paySelected == "monthly"}
          onGetPremium={() => handleGetPremium("monthly")}
          memberNote={isMemberMonthly ? memberNote : undefined}
          showCancel={Boolean(isMemberMonthly && canCancel)}
          onCancel={handleCancelSubscription}
        />

        {/* Premium yearly */}
        <PremiumPlanCard
          billedLabel="Billed Yearly"
          gradientClass="bg-gradient-to-br from-[#221AE9] to-[#25CEDA]"
          statNumber="1,000"
          statUnit="per year"
          analysisFeature="Analyze the mistakes of 1,000 Games per year"
          showSaveBadge={showMarchDiscount}
          hasDiscount={showMarchDiscount}
          fullPrice={79.99}
          price={yearlyPrice}
          period="year"
          perAnalysis={(yearlyPrice / 1000).toFixed(2)}
          offerEndsLabel={showMarchDiscount ? promoEndLabel : ""}
          isCurrentPlan={Boolean(isMember)}
          canPurchase={!isPremium}
          isLoadingPay={isLoading && paySelected == "yearly"}
          onGetPremium={() => handleGetPremium("yearly")}
          memberNote={isMember ? memberNote : undefined}
          showCancel={Boolean(isMember && canCancel)}
          onCancel={handleCancelSubscription}
        />
      </div>

      {/* Legal links — mobile only, per mockup */}
      <div className="flex md:hidden items-center justify-center gap-[24px]">
        <Link
          href="/terms-of-service"
          className="text-[13px] text-black underline underline-offset-2"
        >
          Terms of Use
        </Link>
        <Link
          href="/privacy-policy"
          className="text-[13px] text-black underline underline-offset-2"
        >
          Privacy Policy
        </Link>
      </div>

      <div className="bg-[#F3FBFF] p-[16px] rounded-[12px] border border-gray-200 flex items-center gap-3">
        <Image
          src="/images/v2/profile/icon-_badge club 2.png"
          alt=""
          width={40}
          height={40}
          className="object-contain shrink-0"
        />
        <p className="text-[14px] text-gray-700">
          Are you interested in getting an AroundChess Subscription for your Chess
          Club?{" "}
          <a
            href="#"
            onClick={handleOpenContactUs}
            className="text-[#221AE9] hover:opacity-80 font-medium underline underline-offset-2"
          >
            Click here
          </a>{" "}
          to contact us now for an individual offer.
        </p>
      </div>
    </div>
  );
};

/** "My Subscription" section on /profile. */
const ProfileSubscription = () => <SubscriptionPlans showTitle source="user_settings" />;

export default ProfileSubscription;
