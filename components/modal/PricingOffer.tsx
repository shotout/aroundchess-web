import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useStatusPurchaseTokens } from "@/app/store/statusPurchaseTokens";
import { useSuccessSubscription } from "@/app/store/successSubscription";
import { useConfirmLogin } from "@/app/store/confirmLogin";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PremiumSubsContent } from "../analysis/onboarding/PremiumSubscription";
import DotSpinner from "../game-history/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { loadStripe } from "@stripe/stripe-js";
import CountdownTimerToken from "../CountdownTimer/CountdownTimerToken";
import { useApiClient } from "@/functions/api-client";
import { useRouter } from "next/navigation";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import { trackPaywallInteraction } from "@/functions/tracking";

// Fixed token packages shown in the purchase grid (in display order), matching
// the approved design. Prices/ids are resolved from the live token data.
const FEATURED_QUANTITIES = [1, 5, 10, 25, 50, 100];

interface TokenOption {
  amount: number;
  price: number;
  pricePerToken: number;
}
export const PricingOffer: React.FC = () => {
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState("tokens");
  const [loading, setLoading] = useState<boolean>(false);
  const [widthC, setWidthC] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  const { open, setOpen, tabType, setParamsPayment, subscriptionFilter } = usePricingOffer();
  const { isLoading, getTokenPackage, checkoutSessions } = useApiClient();
  const {
    tokenPackage,
    profile,
    isMember,
    isMemberMonthly,
    token,
    activeMembership,
    setTokenPackage,
    setTokenData,
    tokenData,
    sessionId,
  } = useProfileStore();
  const { open: openSuccessSubscription, setOpen: setOpenSuccessSubscription } =
    useSuccessSubscription();
  const {
    setOpen: setOpenStatusPurchase,
    setStatus,
    setQuantity,
  } = useStatusPurchaseTokens();

  // Resolve the featured packages from live data (falling back to the local
  // package list), keeping the fixed 1/5/10/25/50/100 display order.
  const featuredTokens = useMemo(() => {
    const source =
      Array.isArray(tokenData) && tokenData.length > 0
        ? tokenData
        : Array.isArray(tokenPackage)
        ? tokenPackage
        : [];
    return FEATURED_QUANTITIES.map((q: number) =>
      source.find((p: any) => p?.quantity === q)
    ).filter(Boolean);
  }, [tokenData, tokenPackage]);

  const deadlineToken =
    activeMembership?.lastAnalysisDate != null
      ? new Date(activeMembership?.lastAnalysisDate).getTime() +
        3 * 24 * 60 * 60 * 1000
      : Date.now() + 24 * 60 * 60 * 1000;

  const fetchTokenPackageLocal = async () => {
    const resTokenPackage = await fetch("/local-data/token-package.json");
    const response = await resTokenPackage.json();
    setTokenPackage(response);

    // Fallback: if API data is missing, derive display packages from local data
    // We only want the main SKUs shown in the grid: 1, 5, 10, 25, 50, 100
    const featuredPackages = Array.isArray(response)
      ? response.filter((pkg: any) => FEATURED_QUANTITIES.includes(pkg.quantity))
      : [];

    if (featuredPackages.length > 0) {
      setTokenData(featuredPackages);
    }
  };
  useEffect(() => {
    if (open) {
      trackCustomEvent("ViewPricing");
    }
    setMounted(true);
    setWidthC(window?.innerWidth);
    getTokenPackage({})
      .then((response) => {
        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          setTokenData(response.data);
        } else {
          // If backend doesn't return token packages, fall back to local JSON
          fetchTokenPackageLocal();
        }
      })
      .catch(() => {
        // On any error, fall back to local JSON so the UI still shows packages
        fetchTokenPackageLocal();
      });
    // Also load local data as a fallback source for pricing
    fetchTokenPackageLocal();
    setOpen(open);
  }, [open]);

  useEffect(() => {
    setActiveTab(tabType);
  }, [tabType]);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  const handleResize = () => {
    const width = window?.innerWidth;
    setWidthC(width);
  };

  const handleGetPremium = () => {
    if (sessionId.length == 0) {
      router.push("login");
      setOpen(false);
    } else {
      setOpen(false);
      setOpenSuccessSubscription(true);
    }
  };

  const handlePurchaseToken = async () => {
    if (sessionId.length == 0) {
      router.push("login");
      setOpen(false);
      return;
    }

    const pkg = selectedToken != null ? featuredTokens[selectedToken] : null;
    if (!pkg) return;

    trackPaywallInteraction(sessionId, {
      buttonName: "purchase_tokens",
      source: "token_purchase",
    });
    setLoading(true);
    const tokenAmount = pkg.quantity;
    const body = {
      totalPrice: pkg.totalPrice,
      productName: tokenAmount + " tokens",
      price: parseFloat(pkg.pricePerToken),
      quantity: parseInt(tokenAmount.toString()),
      type: "token",
      idUser: profile.id,
    };
    try {
      trackCustomEvent("InitiateCheckoutToken", body);
      setParamsPayment(body);
      const res = await checkoutSessions(body);
      setLoading(false);
      setQuantity(parseInt(tokenAmount.toString()));
      setStatus("waiting");
      setOpenStatusPurchase(true);
      setOpen(false);
      window.location.href = res.data.url;
    } catch (error) {
      setLoading(false);
      console.log("Checkout session error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogContent
          style={{
            backgroundImage: `url(/images/pricing/${
              widthC < 768 ? `bg-mobile` : `bg-laptop`
            }.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: activeTab == "tokens" ? "auto" : "auto",
          }}
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:max-w-[680px] xl:max-w-[1141px] max-h-[97%] rounded-lg p-4 shadow-xl overflow-y-auto z-[1000]`}
        >
          <div className="text-center py-2 z-2 md:px-8">
            <DialogTitle className=" text-[18px] lg:text-[32px] font-medium">
              Become a Chess Master
            </DialogTitle>
            <DialogDescription className="font-normal text-[14px] lg:text-[20px] text-[#2e2e2e]">
              <span className="text-[#221AE9]">
                Go Premium for Unlimited Access{" "}
              </span>
              or buy Analysis Tokens for access to more Analyses
            </DialogDescription>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex h-[62px] md:min-w-[326px] lg:w-full sm:h-[52px] border border-[#C0CED4] rounded-[12px] p-[8px] bg-[#F2FBFE]">
                <TabsTrigger
                  value="tokens"
                  className={`flex-1 md:min-w-[296px] lg:w-full py-2 text-[14px] --10px lg:text-[16px] rounded-[6px] ${
                    activeTab == "tokens"
                      ? "font-semibold border border-[#C0CED4]"
                      : "font-normal"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-2 w-full">
                    <Image
                      src={`/images/pricing/token-icon.png`}
                      alt="Logo"
                      width={1000}
                      height={1000}
                      className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                      priority
                    />
                    <span className="block leading-tight text-center">
                      Buy Analysis Tokens
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className={`flex-1 w-[155px] sm:min-w-[296px] lg:w-full py-2 text-[14px] --10px lg:text-[16px] rounded-[6px] ${
                    activeTab == "subscription"
                      ? "font-semibold border border-[#C0CED4]"
                      : "font-normal"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-2 w-full">
                    <Image
                      src={`/images/pricing/unlimited-icon.png`}
                      alt="Logo"
                      width={1000}
                      height={1000}
                      className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                      priority
                    />
                    <span className="block leading-tight text-center sm:hidden">
                      <span className="block">Go Unlimited</span>
                      <span className="block">with a Subscription</span>
                    </span>
                    <span className="sm:block leading-tight text-center hidden">
                      <span className="block">
                        Go Unlimited with a Subscription
                      </span>
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tokens">
                  <div className="gap-[16px] flex flex-col">
                    <span className="text-center text-[18px] xl:text-[32px] font-semibold text-[#17119b]">
                      Purchase Tokens for more Ad-Free Analyses.
                    </span>
                    <div className="flex items-center justify-center gap-2 ">
                      <CheckCircle
                        className="w-[16px] h-[16px] xl:w-[24px] xl:h-[24px]"
                        color="#221AE9"
                      />
                      <span className="text-[14px] -- xl:text-[18px] font-normal">
                        1 Analysis Token unlocks 1 Game Analysis
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      {featuredTokens.map((option: any, index: number) => {
                        const isSelected = selectedToken === index;
                        return (
                          <button
                            key={option.id ?? index}
                            type="button"
                            onClick={() => setSelectedToken(index)}
                            className={`relative rounded-[16px] overflow-hidden p-[16px] text-white text-center transition-all ${
                              isSelected
                                ? "ring-4 ring-[#221AE9]"
                                : "ring-0"
                            }`}
                            style={{
                              backgroundImage:
                                "url(/images/v2/learn/token-background.png)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {/* radio */}
                            <span className="absolute top-3 right-3 z-10">
                              <span
                                className={`flex w-[18px] h-[18px] rounded-full items-center justify-center ${
                                  isSelected
                                    ? "bg-white"
                                    : "border-2 border-white/80"
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-[10px] h-[10px] rounded-full bg-[#0A1E5E]" />
                                )}
                              </span>
                            </span>

                            <div className="flex flex-col items-center justify-center gap-1 min-h-[104px] sm:min-h-[110px] xl:min-h-[150px]">
                              <span className="text-[16px] sm:text-[18px] xl:text-[24px] font-medium">
                                {option.quantity === 1
                                  ? "1 Token"
                                  : `${option.quantity} Tokens`}
                              </span>
                              <span className="text-[22px] sm:text-[26px] xl:text-[40px] font-bold leading-none">
                                ${option.totalPrice.toFixed(2)}
                              </span>
                              {option.quantity !== 1 && (
                                <span className="text-[12px] sm:text-[13px] xl:text-[16px] text-white/85">
                                  ${option.pricePerToken.toFixed(2)}/Token
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-center">
                      {isLoading || loading ? (
                        <DotSpinner />
                      ) : (
                        <button
                          disabled={
                            isLoading || loading || selectedToken == null
                          }
                          onClick={handlePurchaseToken}
                          className={`${
                            isLoading || selectedToken == null
                              ? `bg-[#C0CED4]`
                              : `btn-primary`
                          } w-full xl:w-1/2 h-[48px] rounded-full`}
                        >
                          Purchase Now
                        </button>
                      )}
                    </div>
                  </div>
              </TabsContent>

              <TabsContent
                value="subscription"
                className={`pt-[10px]`}
              >
                <PremiumSubsContent onGetPremium={handleGetPremium} initialFilter={subscriptionFilter} source="pricing_dialog" />
              </TabsContent>
          </Tabs>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
