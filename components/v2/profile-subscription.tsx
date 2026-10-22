"use client";

import { useContactUs } from "@/app/store/contactUs";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useCancelSubscription } from "@/app/store/cancelSubscription";
import DotSpinner from "@/components/game-history/Spinner";
import { formatDateSubscription } from "@/functions/format-date";
import {
  MARCH_OFFER_MONTHLY_PRICE,
  MARCH_OFFER_YEARLY_PRICE,
} from "@/constants/marchOffer";
import { CANCEL_OFFER_WINDOW_MS } from "@/constants/cancelOffer";
import { CancelOfferBanner } from "@/components/v2/cancel-offer-banner";
import { PremiumPackageBadge } from "@/components/v2/premium-package-badge";
import { useCancellationOffer, useLapsedPlan } from "@/hooks/useCancellationOffer";
import { useMembershipCheckout } from "@/hooks/useMembershipCheckout";
import { usePromoActive, usePromoEndDateLabel } from "@/hooks/usePromo";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

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

/** A cancelled plan's card while the cancellation offer runs: when Premium
 *  ends (or ended), and the way back. */
const SubscriptionEndsBox = ({
  endsText,
  onReactivate,
  isReactivating,
}: {
  endsText: string;
  onReactivate?: () => void;
  isReactivating?: boolean;
}) => (
  <div className="mt-4 rounded-[12px] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF3F3_45%,#F8C4C4_100%)] px-[10px] py-[12px] text-center lg:px-[16px] lg:py-[16px]">
    <p className="text-[11px] font-medium leading-[130%] text-[#1E1E1E] lg:text-[14px]">
      {endsText}
    </p>
    {onReactivate && (
      <button
        type="button"
        onClick={onReactivate}
        disabled={isReactivating}
        className="mt-[10px] flex h-[32px] w-full items-center justify-center rounded-full border border-[#BFE6FB] bg-[linear-gradient(180deg,#FFFFFF_0%,#E6F7FE_100%)] text-[13px] font-semibold text-[#221AE9] shadow-[0_4px_12px_rgba(34,26,233,0.15)] transition-colors hover:bg-white disabled:cursor-not-allowed lg:mt-[12px] lg:h-[40px] lg:text-[15px]"
      >
        {isReactivating ? <DotSpinner size={8} /> : "Reactivate"}
      </button>
    )}
  </div>
);

interface PremiumPlanCardProps {
  billedLabel: string;
  /** Phones: a smaller pill for a label longer than "Billed Monthly", which
   *  would otherwise overflow the half-width card. */
  compactBilledLabel?: boolean;
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
  showCancel: boolean;
  onCancel: () => void;
  /** Set on the cancelled plan inside the offer window, running or already
   *  ended: "Your subscription ends/ended on …" takes the place of the "You
   *  are on this Package" badge. */
  endsText?: string;
  /** The offer's checkout; left out while the offer isn't for sale. */
  onReactivate?: () => void;
  isReactivating?: boolean;
}

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({
  billedLabel,
  compactBilledLabel,
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
  showCancel,
  onCancel,
  endsText,
  onReactivate,
  isReactivating,
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
        <div
          className={`bg-[#FFC933] text-[#1E1E1E] lg:text-[15px] font-bold lg:px-3 py-[2px] rounded-full whitespace-nowrap ${
            compactBilledLabel ? "text-[10px] px-[6px]" : "text-[11px] px-2"
          }`}
        >
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

    {endsText ? (
      <SubscriptionEndsBox
        endsText={endsText}
        onReactivate={onReactivate}
        isReactivating={isReactivating}
      />
    ) : (
      isCurrentPlan && (
        <div className="mt-4">
          <PremiumPackageBadge />
          {showCancel && (
            <button type="button" className="mt-3 w-full" onClick={onCancel}>
              <span className="font-medium text-[14px] lg:text-[16px] text-white underline underline-offset-2 hover:opacity-80">
                Cancel Subscription
              </span>
            </button>
          )}
        </div>
      ))}
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

  // Only a renewing Stripe plan can be cancelled from the web: store rows
  // (App Store / Google Play) keep autoRenew false, so they never see it.
  const canCancel = Boolean(activeMembership?.autoRenew && !isCancelled);

  // For 7 days from a cancel the cancelled plan's card shows when Premium
  // ends, the plans are on sale again and the offer banner goes up; after
  // that the cards are back to normal.
  const inOfferWindow =
    isCancelled &&
    new Date(activeMembership.cancellationDate).getTime() + CANCEL_OFFER_WINDOW_MS >
      Date.now();
  const plansOnSale = !isPremium || inOfferWindow;

  // A cancellation-offer pass (GET /membership/active is_cancel_offer) is
  // Monthly Premium sold as one block of months, so the monthly card shows
  // the pass's terms instead of the subscription's.
  const isOnPass = Boolean(activeMembership?.is_cancel_offer);

  // A cancelled plan inside its window, or a free account that may have
  // lapsed inside it; the backend has the final say on the offer. A pass
  // holder only needs the terms.
  const { offer, terms, startCheckout: startOfferCheckout, isCheckingOut } =
    useCancellationOffer(
      sessionId.length > 0 &&
        (isOnPass || (isCancelled ? inOfferWindow : !isPremium)),
      activeMembership?.cancellationDate ?? ""
    );

  const passTerms = isOnPass ? terms : null;
  const monthsLabel = (months: number) =>
    months === 1 ? "month" : `${months} months`;
  const monthlyCard = passTerms
    ? {
        billedLabel: `Billed per ${monthsLabel(passTerms.durationInMonths)}`,
        analyses:
          passTerms.tokens > 0 ? passTerms.tokens : 80 * passTerms.durationInMonths,
        statUnit: `per ${monthsLabel(passTerms.durationInMonths)}`,
        hasDiscount: true,
        fullPrice: 9.99 * passTerms.durationInMonths,
        price: passTerms.price,
        period: monthsLabel(passTerms.durationInMonths),
      }
    : {
        billedLabel: "Billed Monthly",
        analyses: 80,
        statUnit: "per month",
        hasDiscount: Boolean(showMarchDiscount || hasLegacyMonthlyDiscount),
        fullPrice: 9.99,
        price: monthlyPrice,
        period: "month",
      };
  // Reactivate and the banner's Get Offer sell the same pass; this keeps the
  // spinner on the button that was pressed.
  const [offerCheckoutFrom, setOfferCheckoutFrom] = useState<"card" | "banner">();
  const handleOfferCheckout = (from: "card" | "banner") => {
    setOfferCheckoutFrom(from);
    startOfferCheckout();
  };
  // Reactivate is the pass's checkout, so it shows only while the pass is for
  // sale; otherwise the card just says when Premium ends.
  const handleReactivate = offer ? () => handleOfferCheckout("card") : undefined;
  const isReactivating = isCheckingOut && offerCheckoutFrom === "card";

  // The cancelled plan's card says when Premium ends. Still running: its own
  // end date. Already ran out inside the window (store sandbox plans end in
  // minutes): looked up by the cancellation that opened the offer, since the
  // account is back on FREE and has no current plan card.
  const lapsedPlan = useLapsedPlan(
    !isPremium && offer ? offer.cancellationDate : null
  );
  const endsTextFor = (plan: "MONTHLY" | "YEARLY") => {
    if (inOfferWindow && (plan === "MONTHLY" ? isMemberMonthly : isMember)) {
      return `Your subscription ends on ${formatDateSubscription(
        activeMembership.endDate
      )}.`;
    }
    if (lapsedPlan?.type === plan) {
      return `Your subscription ended on ${formatDateSubscription(
        lapsedPlan.endDate
      )}.`;
    }
    return undefined;
  };
  const monthlyEndsText = endsTextFor("MONTHLY");
  const yearlyEndsText = endsTextFor("YEARLY");

  const handleGetPlan = (type: "monthly" | "yearly") => {
    // The backend refuses a checkout while a paid plan still runs, cancelled
    // or not, so don't send them to Stripe for an error.
    if (isPremium) {
      toast.info(
        `Your Premium plan is active until ${formatDateSubscription(
          activeMembership?.endDate
        )}. You can switch plans once it ends.`
      );
      return;
    }
    handleGetPremium(type);
  };

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

      {plansOnSale && (
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

        {/* Premium monthly — or the pass, for a pass holder */}
        <PremiumPlanCard
          billedLabel={monthlyCard.billedLabel}
          compactBilledLabel={Boolean(passTerms)}
          gradientClass="bg-gradient-to-br from-[#130F83] to-[#00FFBB]"
          statNumber={monthlyCard.analyses.toLocaleString("en-US")}
          statUnit={monthlyCard.statUnit}
          analysisFeature="Analyze the mistakes of 80 Games per month"
          hasDiscount={monthlyCard.hasDiscount}
          fullPrice={monthlyCard.fullPrice}
          price={monthlyCard.price}
          period={monthlyCard.period}
          perAnalysis={(monthlyCard.price / monthlyCard.analyses).toFixed(2)}
          offerEndsLabel={showMarchDiscount && !passTerms ? promoEndLabel : ""}
          isCurrentPlan={Boolean(isMemberMonthly)}
          canPurchase={plansOnSale && !isMemberMonthly && !monthlyEndsText}
          isLoadingPay={isLoading && paySelected == "monthly"}
          onGetPremium={() => handleGetPlan("monthly")}
          showCancel={Boolean(isMemberMonthly && canCancel)}
          onCancel={handleCancelSubscription}
          endsText={monthlyEndsText}
          onReactivate={monthlyEndsText ? handleReactivate : undefined}
          isReactivating={isReactivating}
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
          canPurchase={plansOnSale && !isMember && !yearlyEndsText}
          isLoadingPay={isLoading && paySelected == "yearly"}
          onGetPremium={() => handleGetPlan("yearly")}
          showCancel={Boolean(isMember && canCancel)}
          onCancel={handleCancelSubscription}
          endsText={yearlyEndsText}
          onReactivate={yearlyEndsText ? handleReactivate : undefined}
          isReactivating={isReactivating}
        />

        {/* Phones: between the paid cards and the free one. lg: under all three. */}
        {offer && (
          <div className="order-1 col-span-2 lg:order-last lg:col-span-3">
            <CancelOfferBanner
              price={offer.price}
              fullPrice={9.99 * offer.durationInMonths}
              months={offer.durationInMonths}
              analyses={offer.tokens > 0 ? offer.tokens : 80 * offer.durationInMonths}
              validUntil={offer.validUntil}
              onGetOffer={() => handleOfferCheckout("banner")}
              isLoading={isCheckingOut && offerCheckoutFrom === "banner"}
            />
          </div>
        )}
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
