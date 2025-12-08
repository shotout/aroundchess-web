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
import React, { useEffect, useState, useRef } from "react";
import PriceDiscount from "./PriceDiscount";
import { useCancelSubscription } from "@/app/store/cancelSubscription";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import CountdownTimerDiscountMonthly from "@/components/CountdownTimer/CountdownTimerDiscountMonthly";

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
  initialFilter?: "monthly" | "yearly";
}> = ({ onGetPremium, initialFilter = "monthly" }) => {
  const {
    allMembershipPackages,
    activeMembership,
    isMember,
    profile,
    sessionId,
    isMemberMonthly,
    setAllMembershipPackages,
  } = useProfileStore();
  const { setOpen: setOpenLogin } = useConfirmLogin();
  const { setOpen: setOpenPricing, setParamsPayment } = usePricingOffer();
  const { checkoutSessions, isLoading, getAllMembershipPackage } =
    useApiClient();
  const { setOpen: setOpenCancel } = useCancelSubscription();
  const { setOpen } = useContactUs();
  const [packageFilter, setPackageFilter] = useState(initialFilter); // monthly, yearly
  const [paySelected, setPaySelected] = useState(""); // monthly, yearly
  const [isMobile, setIsMobile] = useState(false);
  const handleOpenContactUs = () => {
    setOpenPricing(false);
    setOpen(true);
  };

  const handleCancelSubscription = () => {
    setOpenCancel(true);
  };
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  useEffect(() => {
    if (isMember) {
      scrollToAndSet(yearlyCardRef, "yearly");
    } else if (isMemberMonthly) {
      scrollToAndSet(monthlyCardRef, "monthly");
    } else if (initialFilter === "yearly") {
      scrollToAndSet(yearlyCardRef, "yearly");
    } else if (initialFilter === "monthly") {
      scrollToAndSet(monthlyCardRef, "monthly");
    }
  }, []);

  const deadline =
    new Date(profile?.discountInfo?.startDate).getTime() +
    7 * 24 * 60 * 60 * 1000;
  const isPass = deadline - Date.now();

  // Ensure we have membership packages loaded (fallback to API if needed)
  const resolveMembershipPackages = async () => {
    let packagesArray: any[] = [];

    if (Array.isArray(allMembershipPackages)) {
      packagesArray = allMembershipPackages;
    } else if (
      allMembershipPackages &&
      typeof allMembershipPackages === "object"
    ) {
      packagesArray = Object.values(allMembershipPackages);
    }

    // If nothing in store, fetch from backend
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
      return { free: null as any, premium: null as any, monthlyPremium: null as any };
    }

    const free = packagesArray.find((pkg: any) => pkg?.type === "FREE") ?? null;
    const premium =
      packagesArray.find((pkg: any) => pkg?.type === "YEARLY") ?? null;
    const monthlyPremium =
      packagesArray.find((pkg: any) => pkg?.type === "MONTHLY") ?? null;

    return { free, premium, monthlyPremium };
  };

  const handleGetPremium = async (type: string) => {
    setPaySelected(type);

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

    const yearlyPrice = (premium?.price ?? 79.99) * 100;
    const monthlyPrice =
      profile?.discountInfo?.hasActiveDiscount && isPass > 0
        ? 699
        : (monthlyPremium?.price ?? 9.99) * 100;
    const body: BodyType = {
      productName: selectedPackage.name,
      price: isMonthly ? monthlyPrice : yearlyPrice,
      quantity: 1,
      description: selectedPackage.description,
      type: "membership",
      idUser: profile.id,
      membershipId: selectedPackage.id,
      stripeProductId: selectedPackage.stripeProductId,
      totalPrice: isMonthly ? monthlyPrice : yearlyPrice,
    };
    if (profile.discountInfo?.discountCode) {
      body.couponId = profile.discountInfo?.discountCode;
    }
    setParamsPayment(body);
    trackCustomEvent("InitiateCheckoutSubscription", body);
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

  // refs to detect which package card is centered in the horizontal scroll
  const containerRef = useRef<HTMLDivElement | null>(null);
  const monthlyCardRef = useRef<HTMLDivElement | null>(null);
  const freeCardRef = useRef<HTMLDivElement | null>(null);
  const yearlyCardRef = useRef<HTMLDivElement | null>(null);

  // on scroll detect which card is nearest to the container center and set the filter
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isMobile) return;

    let raf = 0;

    const handleScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        const candidates: Array<{
          ref: React.RefObject<HTMLDivElement>;
          key: string;
        }> = [
          { ref: freeCardRef, key: "" },
          { ref: monthlyCardRef, key: "monthly" },
          { ref: yearlyCardRef, key: "yearly" },
        ];

        let closestKey: string | null = null;
        let minDist = Infinity;

        candidates.forEach((c) => {
          const node = c.ref.current;
          if (!node) return;
          const r = node.getBoundingClientRect();
          const nodeCenter = r.left + r.width / 2;
          const dist = Math.abs(nodeCenter - centerX);
          if (dist < minDist) {
            minDist = dist;
            closestKey = c.key;
          }
        });

        // Only update filter if it's different - this helps with button highlighting
        // but doesn't affect which cards are shown on mobile
        if (closestKey !== null && closestKey !== packageFilter) {
          setPackageFilter(closestKey);
        }
      });
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll as EventListener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [packageFilter, isMobile]);

  // helper to scroll a card into center of the container and set the packageFilter
  const scrollToAndSet = (
    ref: React.RefObject<HTMLDivElement>,
    key: "monthly" | "yearly"
  ) => {
    const container = containerRef.current;
    const node = ref.current;
    if (!container || !node) {
      setPackageFilter(key);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const offset =
      nodeRect.left -
      containerRect.left -
      (containerRect.width / 2 - nodeRect.width / 2);

    // animate scroll
    container.scrollTo({
      left: container.scrollLeft + offset,
      behavior: "smooth",
    });
    setPackageFilter(key);
  };

  return (
    <div
      className={`${`space-y-4 w-full`}`}
    >
      <div className="hidden md:block text-center space-y-2">
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
      <div className="flex flex-row items-center justify-between">
        <div
          className={`${
            packageFilter === "monthly"
              ? "bg-[#81CFF3] border border-primary"
              : "bg-white border border-gray-300"
          } flex justify-center items-center cursor-pointer w-[48%] rounded-full py-1`}
          onClick={() => {
            scrollToAndSet(monthlyCardRef, "monthly");
          }}
        >
          <span
            className={`${
              packageFilter === "monthly"
                ? "font-semibold text-[#221AE9] "
                : " font-normal"
            } cursor-pointer`}
          >
            Monthly
          </span>
        </div>
        <div
          className={`${
            packageFilter === "yearly"
              ? "bg-[#81CFF3] border border-primary"
              : "bg-white border border-gray-300"
          } flex justify-center items-center cursor-pointer w-[48%] rounded-full py-1`}
          onClick={() => {
            scrollToAndSet(yearlyCardRef, "yearly");
          }}
        >
          <span
            className={`${
              packageFilter === "yearly"
                ? "font-semibold text-[#221AE9] "
                : " font-normal"
            } cursor-pointer`}
          >
            Yearly
          </span>
        </div>
      </div>
      <div
        ref={containerRef}
        className={`flex max-w-full overflow-x-auto gap-4 pt-[8px] lg:overflow-x-hidden sm:grid sm:gap-4 sm:grid-cols-2 snap-x snap-mandatory scroll-smooth`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* free */}
        {(isMobile || packageFilter === "monthly") && (
          <div
            ref={freeCardRef}
            className="min-w-[320px] lg:min-w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:order-none snap-center flex-shrink-0"
          >
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
                <h3 className="text-lg font-semibold text-black">
                  Free Package
                </h3>
                <div className="text-xl font-semibold text-black">${0}</div>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-3">
              Our Basic Package for free limited Access!
            </p>

            <div className="space-y-2 flex-grow">
              <BenefitItem text="10 free Game Analyses. Purchase more Analyses on demand." />
              <BenefitItem text="Basic Game Analysis" />
              <BenefitItem text="Limited Access to the Feedback Log and Game History" />
              <BenefitItem text="20 Puzzles per month" />
              <BenefitItem text="Play vs. AI" />
              <BenefitItem text="Board Vision Training" />
              <BenefitItem text="Endgame Training" />
              <BenefitItem text="Chess Handbook" />
            </div>

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
            {!isMember && !isMemberMonthly && sessionId.length > 0 && (
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
        )}
        {/* monthly */}
        {(isMobile ||
          packageFilter === "monthly" ||
          packageFilter === "yearly") && (
          <div
            ref={monthlyCardRef}
            className="min-w-[320px] lg:min-w-full bg-gradient-to-br from-[#130F83] to-[#00FFBB] text-white p-4 md:order-none rounded-xl shadow-md relative flex flex-col snap-center flex-shrink-0"
          >
            {/* <div className="absolute -top-2 left-0 right-0 flex justify-center">
              <div className="bg-[#A855F7] px-3 py-1 rounded-full text-xs font-medium">
                For frequent Chess Players
              </div>
            </div> */}

            {!isMemberMonthly &&
              profile?.discountInfo?.hasActiveDiscount &&
              isPass > 0 && (
                <div className="flex justify-center items-center my-2">
                  <CountdownTimerDiscountMonthly />
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
                  Premium Package (Monthly)
                </h3>
                {!(
                  !isMemberMonthly &&
                  profile?.discountInfo?.hasActiveDiscount &&
                  isPass > 0
                ) ? (
                  <div className="text-xl font-semibold">
                    $9.99 <span className="text-sm font-normal">/month</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <PriceDiscount price={9.99} />
                    <div className="text-xl font-semibold">
                      $6.99 <span className="text-sm font-normal">/month</span>
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
                text={
                  profile?.discountInfo &&
                  profile?.discountInfo?.hasActiveDiscount &&
                  isPass > 0
                    ? "80 Analyses per year (meaning $0.09 per Analysis)"
                    : "80 Analyses per year (meaning $0.13 per Analysis)"
                }
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

            {!isMember && !isMemberMonthly && (
              <button
                disabled={isLoading}
                onClick={() => handleGetPremium("monthly")}
                className="mt-3 w-full py-2 bg-white rounded-full text-blue-base font-semibold hover:bg-blue-50 transition-colors text-sm"
              >
                {isLoading && paySelected == "monthly" ? (
                  <DotSpinner size={8} />
                ) : (
                  "Get Premium"
                )}
              </button>
            )}

            {isMemberMonthly && (
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
        )}

        {/* yearly */}
        {(isMobile || packageFilter === "yearly") && (
          <div
            ref={yearlyCardRef}
            className="min-w-[320px] lg:min-w-full bg-gradient-to-br from-[#221AE9] to-[#25CEDA] text-white p-4 md:order-none rounded-xl shadow-md relative flex flex-col snap-center flex-shrink-0"
          >
            <div className="absolute -top-2 left-0 right-0 flex justify-center">
              <div className="bg-[#A855F7] px-3 py-1 rounded-full text-xs font-medium">
                For frequent Chess Players
              </div>
            </div>

            {/* {!isMember &&
              profile?.discountInfo?.hasActiveDiscount &&
              isPass > 0 && (
                <div className="flex justify-center items-center my-2">
                  <CountdownTimerDiscount />
                </div>
              )} */}

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
                <div className="text-xl font-semibold">
                  $79.99 <span className="text-sm font-normal">/year</span>
                </div>
              </div>
            </div>

            <p className="text-sm mb-3">
              Our Unlimited Package for frequent Chess Players!
            </p>

            <div className="space-y-2 flex-grow">
              <BenefitItem
                text="1,000 Analyses per year (meaning $0.08 per Analysis)"
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

            {!isMember && !isMemberMonthly && (
              <button
                disabled={isLoading}
                onClick={() => handleGetPremium("yearly")}
                className="mt-3 w-full py-2 bg-white rounded-full text-blue-base font-semibold hover:bg-blue-50 transition-colors text-sm"
              >
                {isLoading && paySelected == "yearly" ? (
                  <DotSpinner size={8} />
                ) : (
                  "Get Premium"
                )}
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
        )}
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
