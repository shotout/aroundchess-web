"use client";

import { useContactUs } from "@/app/store/contactUs";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useCancelSubscription } from "@/app/store/cancelSubscription";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import DotSpinner from "@/components/game-history/Spinner";
import { useApiClient } from "@/functions/api-client";
import { formatDateHistory } from "@/functions/format-date";
import { trackPaywallInteraction } from "@/functions/tracking";
import {
  isMarchCampaignActive,
  MARCH_OFFER_END_DATE_LABEL,
  MARCH_OFFER_MONTHLY_PRICE,
  MARCH_OFFER_YEARLY_PRICE,
} from "@/constants/marchOffer";
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
    <p className="text-[13px] font-medium text-black">
      You are on this Package.{note ? ` ${note}` : ""}
    </p>
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
  showOfferEnds: boolean;
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
  showOfferEnds,
  isCurrentPlan,
  canPurchase,
  isLoadingPay,
  onGetPremium,
  memberNote,
  showCancel,
  onCancel,
}) => (
  <div className={`relative flex flex-col rounded-[16px] p-[12px] lg:p-[16px] text-white shadow-md ${gradientClass}`}>
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
          <span className="relative text-[12px] lg:text-[15px] text-white/70 line-through decoration-red-500 decoration-2">
            ${fullPrice.toFixed(2)}
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
        {showOfferEnds && (
          <p className="mt-3 text-center text-[11px] lg:text-[13px] text-white">
            Offer ends {MARCH_OFFER_END_DATE_LABEL}
          </p>
        )}
      </>
    )}

    {isCurrentPlan && (
      <div className="mt-4">
        <CurrentPackageBox note={memberNote} />
        {showCancel && (
          <button className="mt-3 w-full" onClick={onCancel}>
            <span className="font-medium text-[14px] text-white underline underline-offset-2">
              Cancel Subscription
            </span>
          </button>
        )}
      </div>
    )}
  </div>
);

/**
 * Revamped "My Subscription" section for the /profile page.
 * The pricing dialog elsewhere still uses PremiumSubsContent — kept separate on purpose.
 */
const ProfileSubscription = () => {
  const {
    allMembershipPackages,
    activeMembership,
    isMember,
    isMemberMonthly,
    profile,
    sessionId,
    setAllMembershipPackages,
  } = useProfileStore();
  const { setOpen: setOpenLogin } = useConfirmLogin();
  const { setOpen: setOpenPricing, setParamsPayment } = usePricingOffer();
  const { checkoutSessions, isLoading, getAllMembershipPackage } = useApiClient();
  const { setOpen: setOpenCancel } = useCancelSubscription();
  const { setOpen: setOpenContactUs } = useContactUs();
  const [paySelected, setPaySelected] = useState("");

  const isPremium = Boolean(isMember || isMemberMonthly);

  const deadline =
    new Date(profile?.discountInfo?.startDate).getTime() + 7 * 24 * 60 * 60 * 1000;
  const isPass = deadline - Date.now();

  const marchActive = isMarchCampaignActive();
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

  // Ensure we have membership packages loaded (fallback to API if needed)
  const resolveMembershipPackages = async () => {
    let packagesArray: any[] = [];

    if (Array.isArray(allMembershipPackages)) {
      packagesArray = allMembershipPackages;
    } else if (allMembershipPackages && typeof allMembershipPackages === "object") {
      packagesArray = Object.values(allMembershipPackages);
    }

    if (!packagesArray.length) {
      try {
        const response = await getAllMembershipPackage({});
        if (response?.data && Array.isArray(response.data)) {
          packagesArray = response.data;
          setAllMembershipPackages(response.data);
        }
      } catch (e) {
        console.error("Failed to load membership packages", e);
      }
    }

    if (!packagesArray.length) {
      return { premium: null as any, monthlyPremium: null as any };
    }

    const premium = packagesArray.find((pkg: any) => pkg?.type === "YEARLY") ?? null;
    const monthlyPremium =
      packagesArray.find((pkg: any) => pkg?.type === "MONTHLY") ?? null;

    return { premium, monthlyPremium };
  };

  const handleGetPremium = async (type: "monthly" | "yearly") => {
    setPaySelected(type);

    trackPaywallInteraction(sessionId, {
      buttonName: "get_premium",
      planType: type,
      source: "user_settings",
    });

    if (sessionId.length == 0) {
      setOpenLogin(true);
      return;
    }

    const { premium, monthlyPremium } = await resolveMembershipPackages();

    const isMonthly = type == "monthly";
    const selectedPackage = isMonthly ? monthlyPremium : premium;

    if (!selectedPackage) {
      console.error(
        `Membership package not found for type ${isMonthly ? "MONTHLY" : "YEARLY"}`
      );
      setPaySelected("");
      return;
    }

    type BodyType = {
      productName: any;
      price: number;
      quantity: number;
      description: any;
      type: string;
      idUser: any;
      membershipId: any;
      stripeProductId: any;
      totalPrice: any;
      couponId?: any;
    };

    const yearlyCheckoutPrice = (premium?.price ?? 79.99) * 100;
    const monthlyCheckoutPrice =
      profile?.discountInfo?.hasActiveDiscount && isPass > 0
        ? 699
        : (monthlyPremium?.price ?? 9.99) * 100;
    const body: BodyType = {
      productName: selectedPackage.name,
      price: isMonthly ? monthlyCheckoutPrice : yearlyCheckoutPrice,
      quantity: 1,
      description: selectedPackage.description,
      type: "membership",
      idUser: profile.id,
      membershipId: selectedPackage.id,
      stripeProductId: selectedPackage.stripeProductId,
      totalPrice: isMonthly ? monthlyCheckoutPrice : yearlyCheckoutPrice,
    };
    if (profile.discountInfo?.discountCode) {
      body.couponId = profile.discountInfo?.discountCode;
    }
    setParamsPayment(body);
    trackCustomEvent("InitiateCheckoutSubscription", body);
    try {
      const res = await checkoutSessions(body);
      if (res?.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      console.error("Checkout session response without url:", res);
      toast.error(
        res?.message || "Could not start the checkout. Please try again."
      );
    } catch (error: any) {
      toast.error(
        error?.message || "Could not start the checkout. Please try again."
      );
    } finally {
      setPaySelected("");
    }
  };

  const memberNote = activeMembership?.autoRenew
    ? `The Subscription automatically renews on ${formatDateHistory(
        activeMembership.endDate
      )}.`
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Centered plain title on mobile, left-aligned with divider on desktop */}
      <div className="flex flex-row items-center justify-center md:justify-between border-0 border-b-0 md:border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">My Subscription</span>
      </div>

      <div className="text-center">
        <p className="text-[14px] text-black mb-3">
          Discover our Suite of Powerful Features with the AroundChess{" "}
          <span className="text-[#221AE9] font-semibold">Premium Subscription</span>:
        </p>

        <div className="flex justify-center">
          <div className="grid grid-cols-3 w-full gap-3 pb-1 md:w-auto md:flex md:overflow-visible md:flex-wrap md:justify-center">
            {FEATURE_TILES.map((tile) => (
              <div
                key={tile.bottom}
                className="bg-[#EDECFD] border border-[#221AE9] rounded-[8px] flex flex-col justify-center items-center gap-2 w-full min-w-0 md:min-w-[110px] md:w-[110px] h-[110px] px-1 shrink-0"
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
              <div className="text-[22px] font-bold text-black">$0</div>
            </div>
          </div>

          <p className="text-[14px] text-gray-700 mb-4">
            Our Basic Package for free limited Access!
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
          showOfferEnds={showMarchDiscount}
          isCurrentPlan={Boolean(isMemberMonthly)}
          canPurchase={!isPremium}
          isLoadingPay={isLoading && paySelected == "monthly"}
          onGetPremium={() => handleGetPremium("monthly")}
          memberNote={isMemberMonthly ? memberNote : undefined}
          showCancel={Boolean(isMemberMonthly && activeMembership?.autoRenew)}
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
          showOfferEnds={showMarchDiscount}
          isCurrentPlan={Boolean(isMember)}
          canPurchase={!isPremium}
          isLoadingPay={isLoading && paySelected == "yearly"}
          onGetPremium={() => handleGetPremium("yearly")}
          memberNote={isMember ? memberNote : undefined}
          showCancel={Boolean(isMember && activeMembership?.autoRenew)}
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

export default ProfileSubscription;
