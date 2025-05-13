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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-24 lg:pt-32 xl:pt-[110px] 2xl:pt-[120px] ${
        isDesktop ? "xl:pl-64" : ""
      }`}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-[1200px] mx-4 z-10">
        <div className="relative bg-blue-50 border border-blue-100 rounded-xl overflow-hidden shadow-lg">
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

          <div className="relative z-10 p-4 md:p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-black">
                Go Premium now
              </h2>
              <p className="text-2xl md:text-3xl text-black font-semibold mt-1">
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
  const { allMembershipPackages, activeMembership, isMember, profile } =
    useProfileStore();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const { postPurchaseMembership, isLoading } = useApiClient();
  const { setOpen: setOpenCancel } = useCancelSubscription();
  const { setOpen } = useContactUs();
  const handleOpenContactUs = () => {
    setOpenPricing(false);
    setOpen(true);
  };
  const handleCancelSubscription = () => {
    setOpenCancel(true);
  };
  let free = allMembershipPackages[0];
  let premium = allMembershipPackages[1];
  const deadline = new Date(profile.createdAt).getTime() + 24 * 60 * 60 * 1000;
  const isPass = deadline - Date.now();

  const handleGetPremium = async () => {
    const res = await fetch("/api/stripe/checkout_sessions", {
      method: "POST",
      body: JSON.stringify({
        productName: premium.name,
        price: isPass > 0 ? 7999 : premium.price * 100,
        quantity: 1,
        description: premium.description,
        type: "membership",
        idUser: profile.id,
        membershipId: premium.id,
      }),
    });

    const data = await res.json();
    // if (data.url) {
    //   window.open(data.url, "_blank"); // Opens in a new tab
    // }
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.id });
  };
  return (
    <div className="mb-4">
      <p className="text-sm text-black mb-2 text-center">
        Discover our Suite of Powerful Features with the AroundChess{" "}
        <span className="text-blue-base font-medium">
          Premium Subscription:
        </span>
      </p>

      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 w-full xl:w-[70%] 2xl:w-[70%]">
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col order-2 md:order-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <Image
                src="/onboarding/free.png"
                alt="Free Icon"
                width={64}
                height={64}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Free Package</h3>
              <div className="text-2xl font-semibold text-black">${0}</div>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-4">
            Our Basic Package for free limited Access!
          </p>

          <div className="space-y-3 flex-grow">
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
          {!isMember && !isLoading && (
            <div className="mt-4 relative w-full py-3 bg-gradient-to-r from-white via-[#E6F7FE] to-white rounded-md border border-dashed border-primary-gray flex items-center justify-center gap-2 overflow-hidden">
              <Image
                src="/onboarding/currentPackage.png"
                alt="Free Icon"
                className=""
                width={50}
                height={50}
              />
              <p className="text-sm font-medium text-black">
                You are on this Package
              </p>

              <Image
                width={200}
                height={200}
                alt="member"
                src={"/onboarding/member.png"}
                className="absolute top-0 right-12"
              />
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#221AE9] to-[#25CEDA] text-white p-5 order-1 md:order-none rounded-xl shadow-md relative flex flex-col">
          <div className="absolute -top-3 left-0 right-0 flex justify-center">
            <div className="bg-[#A855F7] px-4 py-1 xl:px-8 xl:py-2 rounded-full text-xs font-medium">
              For frequent Chess Players
            </div>
          </div>
          {isPass > 0 && (
            <div className="flex justify-center items-center my-[12px]">
              <CountdownTimerDiscount />
            </div>
          )}

          <div className="flex items-center gap-4 mb-4 pt-2">
            <div className="p-2 rounded-full">
              <Image
                src="/onboarding/premium.png"
                alt="Premium Icon"
                width={64}
                height={64}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Premium Package (Yearly)
              </h3>
              {isPass < 0 ? (
                <div className="text-2xl font-semibold">
                  $99.99 <span className="text-sm font-normal">/year</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <PriceDiscount price={99.99} />
                  <div className="text-2xl font-semibold">
                    $79.99 <span className="text-sm font-normal">/year</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm mb-4">
            Our Unlimited Package for frequent Chess Players!
          </p>

          <div className="space-y-3 flex-grow">
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
              className="mt-4 w-full py-3 bg-white rounded-full text-blue-base font-semibold hover:bg-blue-50 transition-colors text-sm"
            >
              Get Premium
            </button>
          )}
          {isMember && (
            <>
              <motion.div
                variants={fadeInUp}
                className={`mt-[12px] relative w-full rounded-[8px] bg-[linear-gradient(to_right,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#25CEDA,_#B2E8F9)] border border-dashed border-white p-[1px]`}
              >
                <div
                  className={`flex h-[56px] flex-row items-center rounded-[8px] gap-2`}
                >
                  <Image
                    src={`/icons/onboarding-popup.png`}
                    alt="icon"
                    width={1000}
                    height={1000}
                    className="w-[42px] h-[44px] object-contain m-4 mr-0"
                  />
                  <span className="font-medium text-[11px] xl:text-[14px] z-10 text-black">
                    {"You are on this Package. The Subscription automatically renews on " +
                      formatDateHistory(activeMembership.endDate) +
                      "."}
                  </span>
                  <div className="absolute right-0 top-0 bottom-1 h-full flex items-center justify-center">
                    <Image
                      src={`/icons/sparks-member.png`}
                      alt="icon"
                      width={1000}
                      height={1000}
                      className="w-full h-[56px] object-cover"
                    />
                  </div>
                </div>
              </motion.div>
              <button className="mt-4" onClick={handleCancelSubscription}>
                <span className="font-medium text-[16px] text-white">
                  Cancel Subscription
                </span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mt-6 bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 text-sm">
        <Users className="w-5 h-5 text-blue-base flex-shrink-0" />
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
    <div className="bg-blue-base/10 border border-blue-base gap-1 rounded-[8px] flex flex-col justify-center items-center w-[90px] h-[90px] xl:w-[100px] xl:h-[100px]">
      <Image
        alt="-"
        src={imageUrl}
        width={1000}
        height={1000}
        className="w-[34px] h-[32px]"
      />
      <div className="text-center flex flex-col justify-end">
        <p className="text-[11px] font-normal text-gray-900">
          {firstPart}
          {hasColon ? ":" : ""}
        </p>
        {secondPart ? (
          <p className="text-[11px] font-medium text-gray-900">{secondPart}</p>
        ) : (
          // Empty placeholder div to maintain height consistency
          <div className="h-4"></div>
        )}
      </div>
    </div>
  );
};

const BenefitItem: React.FC<BenefitItemProps> = ({ text, light = false }) => (
  <div className="flex items-start gap-2">
    <CheckCircle
      className={`w-5 h-5 flex-shrink-0 ${
        light ? "text-white" : "text-blue-base"
      }`}
    />
    <p className="text-sm">{text}</p>
  </div>
);
