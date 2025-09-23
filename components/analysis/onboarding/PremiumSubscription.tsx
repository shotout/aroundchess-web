"use client";

import { useContactUs } from "@/app/store/contactUs";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import CountdownTimerDiscount from "@/components/CountdownTimer/CountdownTimerDiscount";
import DotSpinner from "@/components/game-history/Spinner";
import { useApiClient } from "@/functions/api-client";
import { formatDateHistory } from "@/functions/format-date";
import { fadeInUp, motion } from "@/utils/motion";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, Users, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PriceDiscount from "./PriceDiscount";
import { useCancelSubscription } from "@/app/store/cancelSubscription";
import { useConfirmLogin } from "@/app/store/confirmLogin";

export interface PremiumSubscriptionProps {
  visible: boolean;
  onClose: () => void;
  onGetPremium: () => void;
}

interface FeatureImageProps {
  imageUrl: string;
  label: string;
}

interface BenefitItemProps {
  text: string;
  light?: boolean;
}

export const PremiumSubscription: React.FC<PremiumSubscriptionProps> = ({
  visible,
  onClose,
  onGetPremium,
}: PremiumSubscriptionProps) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const { allMembershipPackages, activeMembership, isMember } =
    useProfileStore();

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, [activeMembership]);

  if (!visible) return null;

  const sidebarWidth = isDesktop ? window.innerWidth / 6 : 0;
  const headerHeight = window.innerWidth >= 1024 ? 96 : 72;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        paddingLeft: isDesktop ? sidebarWidth + 16 : 16,
        paddingTop: headerHeight + 16,
        paddingBottom: 16,
        paddingRight: 16,
      }}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-6xl mx-auto z-10 h-full flex flex-col">
        <div className="relative bg-blue-50 border border-blue-100 rounded-xl shadow-lg flex-1 min-h-0 flex flex-col">
          <div className="absolute inset-0 z-0 opacity-55">
            <Image
              src="/my-game-history/pattern.png"
              alt=""
              fill
              className="object-cover"
              priority
              aria-hidden="true"
            />
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 transition-colors z-20"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold text-black">
                Go Premium now
              </h2>
              <p className="text-xl text-black font-semibold">
                for unlimited access and become a Chess Master
              </p>
            </div>

            <PremiumSubsContent onGetPremium={onGetPremium} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PremiumSubsContent: React.FC<{
  onGetPremium?: () => void;
}> = ({ onGetPremium }) => {
  const {
    allMembershipPackages,
    activeMembership,
    isMember,
    profile,
    sessionId,
  } = useProfileStore();
  const { setOpen: setOpenLogin } = useConfirmLogin();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const { checkoutSessions, isLoading } = useApiClient();
  const { setOpen: setOpenCancel } = useCancelSubscription();
  const { setOpen } = useContactUs();

  const handleOpenContactUs = () => {
    setOpenPricing(false);
    setOpen(true);
  };

  const handleCancelSubscription = () => {
    setOpenCancel(true);
  };

  const free = allMembershipPackages[0];
  const premium = allMembershipPackages[1];
  const deadline = new Date(profile.createdAt).getTime() + 24 * 60 * 60 * 1000;
  const isPass = deadline - Date.now();

  const handleGetPremium = async () => {
    if (sessionId.length == 0) setOpenLogin(true);

    type BodyType = {
      productName: any;
      price: number;
      quantity: number;
      description: any;
      type: string;
      idUser: any;
      membershipId: any;
      stripeProductId: any;
      couponId?: any;
    };
    const body: BodyType = {
      productName: premium.name,
      price:
        !isMember && profile?.discountInfo?.hasActiveDiscount && isPass > 0
          ? 7999
          : premium.price * 100,
      quantity: 1,
      description: premium.description,
      type: "membership",
      idUser: profile.id,
      membershipId: premium.id,
      stripeProductId: premium.stripeProductId,
    };
    if (profile.discountInfo?.discountCode) {
      body.couponId = profile.discountInfo?.discountCode;
    }
    const res = await checkoutSessions(body);
    console.log("Checkout session response:", res);
    window.location.href = res.data.url;
    // const data = await res.json();
    // const stripe = await stripePromise;
    // await stripe?.redirectToCheckout({ sessionId: data.id });
  };
  const handleSignUp = () => {
    window.location.href = "/register";
  };
  return (
    <div className={`${sessionId.length > 0 ? `space-y-4` : `space-y-4 max-w-[358px] sm:max-w-[640px] xl:max-w-[1141px] `}`}>
      <div className="text-center space-y-2">
        <p className="text-sm text-black">
          Discover our Suite of Powerful Features with the AroundChess{" "}
          <span className="text-blue-base font-medium">
            Premium Subscription:
          </span>
        </p>

        <div className="flex items-center justify-center ">
          <div className="flex overflow-x-scroll gap-2 xl:overflow-x-hidden xl:space-x-4 xl:grid xl:grid-cols-3 xl:grid-cols-6 xl:gap-4 ">
            <FeatureImage
              imageUrl={"/icons/sidebar-analyze-icon-active.png"}
              label="Analyze Games"
            />
            <FeatureImage
              imageUrl={"/icons/sidebar-theory-icon-active.png"}
              label="Handbook: Chess Theory"
            />
            <FeatureImage
              imageUrl={"/icons/sidebar-play-vs-ai-icon-active.png"}
              label="Playground: Play VS AI"
            />
            <FeatureImage
              imageUrl={"/icons/sidebar-puzzle-icon-active.png"}
              label="Playground: Chess Puzzles"
            />
            <FeatureImage
              imageUrl={"/icons/sidebar-board-vision-icon-active.png"}
              label="Playground: Board Vision"
            />
            <FeatureImage
              imageUrl={"/icons/sidebar-endgame-training-icon-active.png"}
              label="Playground: Endgame Training"
            />
          </div>
        </div>
      </div>

      <div className={`flex max-w-full overflow-x-scroll gap-4 space-x-1 pt-[8px] lg:overflow-x-hidden sm:grid sm:gap-4 sm:grid-cols-2`}>
        <div className="min-w-[320px] lg:min-w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:order-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <Image
                src="/onboarding/free.png"
                alt="Free Icon"
                width={48}
                height={48}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Free Package</h3>
              <div className="text-xl font-semibold text-black">${0}</div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-3">
            Our Basic Package for free limited Access!
          </p>

          <div className="space-y-2 flex-grow">
            <BenefitItem text="1 Game Analysis every 72h" />
            <BenefitItem text="Basic Game Analysis" />
            <BenefitItem text="Limited Access to the Feedback Log and Game History" />
            <BenefitItem text="20 Puzzles per month" />
            <BenefitItem text="Play vs. AI" />
            <BenefitItem text="Board Vision Training" />
            <BenefitItem text="Endgame Training" />
            <BenefitItem text="Chess Handbook" />
          </div>

          {isLoading && <DotSpinner />}
          {sessionId.length == 0 && (
            <div
              onClick={handleSignUp}
              className="cursor-pointer mt-3 relative w-full py-2 bg-[#221AE9] rounded-full flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="text-white font-medium text-sm">
                Sign up for free
              </span>
            </div>
          )}
          {!isMember && !isLoading && sessionId.length > 0 && (
            <div className="mt-3 relative w-full py-2 bg-gradient-to-r from-white via-[#E6F7FE] to-white rounded-md border border-dashed border-primary-gray flex items-center justify-center gap-2 overflow-hidden">
              <Image
                src="/onboarding/currentPackage.png"
                alt="Free Icon"
                className=""
                width={40}
                height={40}
              />
              <p className="text-sm font-medium text-black">
                You are on this Package
              </p>

              <Image
                width={160}
                height={160}
                alt="member"
                src={"/onboarding/member.png"}
                className="absolute top-0 right-8"
              />
            </div>
          )}
        </div>

        <div className="min-w-[320px] lg:min-w-full bg-gradient-to-br from-[#221AE9] to-[#25CEDA] text-white p-4 md:order-none rounded-xl shadow-md relative flex flex-col">
          <div className="absolute -top-2 left-0 right-0 flex justify-center">
            <div className="bg-[#A855F7] px-3 py-1 rounded-full text-xs font-medium">
              For frequent Chess Players
            </div>
          </div>

          {!isMember &&
            profile?.discountInfo?.hasActiveDiscount &&
            isPass > 0 && (
              <div className="flex justify-center items-center my-2">
                <CountdownTimerDiscount />
              </div>
            )}

          <div className="flex items-center gap-3 mb-3 pt-1">
            <div className="p-1 rounded-full">
              <Image
                src="/onboarding/premium.png"
                alt="Premium Icon"
                width={48}
                height={48}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Premium Package (Yearly)
              </h3>
              {!(
                !isMember &&
                profile?.discountInfo?.hasActiveDiscount &&
                isPass > 0
              ) ? (
                <div className="text-xl font-semibold">
                  $99.99 <span className="text-sm font-normal">/year</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <PriceDiscount price={99.99} />
                  <div className="text-xl font-semibold">
                    $79.99 <span className="text-sm font-normal">/year</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm mb-3">
            Our Unlimited Package for frequent Chess Players!
          </p>

          <div className="space-y-2 flex-grow">
            <BenefitItem
              text="1,000 Analyses per year (meaning 0.10 Cent per Analysis)"
              light
            />
            <BenefitItem
              text="Choose between Basic, Standard and Deep Analysis"
              light
            />
            <BenefitItem
              text="Full Access to the Feedback Log and Game History"
              light
            />
            <BenefitItem text="Unlimited Puzzles" light />
            <BenefitItem text="Play vs. AI" light />
            <BenefitItem text="Board Vision Training" light />
            <BenefitItem text="Endgame Training" light />
            <BenefitItem text="Chess Handbook" light />
            <BenefitItem text="Early Feature Update" light />
            <BenefitItem text="Discord VIP Access" light />
          </div>

          {isLoading && <DotSpinner />}
          {!isMember && !isLoading && (
            <button
              onClick={handleGetPremium}
              className="mt-3 w-full py-2 bg-white rounded-full text-blue-base font-semibold hover:bg-blue-50 transition-colors text-sm"
            >
              Get Premium
            </button>
          )}

          {isMember && (
            <>
              <motion.div
                variants={fadeInUp}
                className="mt-3 relative w-full rounded-lg bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]"
              >
                <div className="flex h-12 flex-row items-center rounded-lg gap-2">
                  <Image
                    src="/icons/onboarding-popup.png"
                    alt="icon"
                    width={32}
                    height={32}
                    className="object-contain m-3 mr-0"
                  />
                  <span className="font-medium text-xs text-black z-10">
                    {`You are on this Package. ${
                      activeMembership.autoRenew
                        ? ` The Subscription automatically renews on ` +
                          formatDateHistory(activeMembership.endDate) +
                          "."
                        : ``
                    }`}
                  </span>
                  <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-center">
                    <Image
                      src="/icons/sparks-member.png"
                      alt="icon"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
              {activeMembership.autoRenew && (
                <button className="mt-3" onClick={handleCancelSubscription}>
                  <span className="font-medium text-sm text-white">
                    Cancel Subscription
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 text-sm">
        <Users className="w-4 h-4 text-blue-base flex-shrink-0" />
        <p className="text-gray-700">
          Are you interested in getting an AroundChess Subscription for your
          Chess Club?{" "}
          <a
            href="#"
            onClick={handleOpenContactUs}
            className="text-blue-base hover:underline font-medium"
          >
            Click here{" "}
          </a>
          to contact us now for an individual offer.
        </p>
      </div>
    </div>
  );
};

const FeatureImage: React.FC<FeatureImageProps> = ({ imageUrl, label }) => {
  const hasColon = label.includes(":");
  const [firstPart, secondPart] = hasColon
    ? [label.split(":")[0], label.split(":")[1]]
    : [label, null];

  return (
    <div className="bg-blue-base/10 border border-blue-base gap-1 rounded-lg flex flex-col justify-center items-center min-w-[110px] h-[110px]">
      <Image
        alt="-"
        src={imageUrl}
        width={1000}
        height={1000}
        className="max-w-[34px] h-[32px] object-contain"
      />
      <div className="text-center flex flex-col justify-end px-1">
        {firstPart == "Analyze Games" ? (
          <p className="text-[10px] font-normal text-gray-900 leading-tight">
            Analyze <br /> Games
          </p>
        ) : (
          <p className="text-[10px] font-normal text-gray-900 leading-tight">
            {firstPart}
            {hasColon ? ":" : ""}
          </p>
        )}
        {secondPart ? (
          <p className="text-[10px] font-medium text-gray-900 leading-tight">
            {secondPart}
          </p>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const BenefitItem: React.FC<BenefitItemProps> = ({ text, light = false }) => (
  <div className="flex items-start gap-2">
    <CheckCircle
      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
        light ? "text-white" : "text-blue-base"
      }`}
    />
    <p className="text-sm leading-relaxed">{text}</p>
  </div>
);
