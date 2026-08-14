"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useStatusPurchaseTokens } from "@/app/store/statusPurchaseTokens";
import { trackCustomEvent } from "@/app/utils/facebookPixel";
import DotSpinner from "@/components/game-history/Spinner";
import { SubscriptionPlans } from "@/components/v2/profile-subscription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiClient } from "@/functions/api-client";
import { trackPaywallInteraction } from "@/functions/tracking";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

// Fixed token packages shown in the purchase grid (in display order), matching
// the approved design. Prices/ids are resolved from the live token data.
const FEATURED_QUANTITIES = [1, 5, 10, 25, 50, 100];

/**
 * The paywall body: the two tabs plus their contents. Shared by the desktop
 * dialog (PricingOffer) and the mobile /premium page, so both stay in sync.
 * The heading above the tabs belongs to the caller — the dialog needs Radix's
 * DialogTitle for a11y, while the page gets its title from the app header.
 */
export const PaywallContent: React.FC<{
  source?: "pricing_dialog" | "user_settings";
}> = ({ source = "pricing_dialog" }) => {
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState("tokens");
  const [loading, setLoading] = useState(false);

  const { setOpen, tabType, setParamsPayment } = usePricingOffer();
  const { isLoading, getTokenPackage, checkoutSessions } = useApiClient();
  const {
    tokenPackage,
    profile,
    setTokenPackage,
    setTokenData,
    tokenData,
    sessionId,
  } = useProfileStore();
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

  const fetchTokenPackageLocal = async () => {
    const resTokenPackage = await fetch("/local-data/token-package.json");
    const response = await resTokenPackage.json();
    setTokenPackage(response);

    // Fallback: if API data is missing, derive display packages from local data.
    const featuredPackages = Array.isArray(response)
      ? response.filter((pkg: any) => FEATURED_QUANTITIES.includes(pkg.quantity))
      : [];

    if (featuredPackages.length > 0) {
      setTokenData(featuredPackages);
    }
  };

  useEffect(() => {
    trackCustomEvent("ViewPricing");
    getTokenPackage({})
      .then((response) => {
        if (
          response?.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setTokenData(response.data);
        } else {
          fetchTokenPackageLocal();
        }
      })
      .catch(() => {
        fetchTokenPackageLocal();
      });
    // Also load local data as a fallback source for pricing
    fetchTokenPackageLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The store seeds tabType with "analyses", which matches neither tab — adopt
  // it only when a call site has set a real tab, otherwise keep the default.
  // Without this a direct visit to the paywall route renders no tab content.
  useEffect(() => {
    if (tabType === "tokens" || tabType === "subscription") setActiveTab(tabType);
  }, [tabType]);

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

  // min-w-0: inside the dialog the parent is a grid, whose items default to
  // min-width:auto and would size the column to max-content — that stops inner
  // overflow-x containers (the feature tiles row) from ever scrolling.
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-0">
      {/* Mobile (max-sm) is a flat, full-bleed underline tab bar per the mockup;
          sm+ keeps the boxed pill list. */}
      <TabsList className="flex h-[62px] md:min-w-[326px] lg:w-full sm:h-[52px] border border-[#C0CED4] rounded-[12px] p-[8px] bg-[#F2FBFE] max-sm:h-[48px] max-sm:p-0 max-sm:-mx-4 max-sm:bg-transparent max-sm:rounded-none max-sm:border-0 max-sm:border-b">
        <TabsTrigger
          value="tokens"
          className={`flex-1 md:min-w-[296px] lg:w-full py-2 text-[14px] --10px lg:text-[16px] rounded-[6px] max-sm:h-full max-sm:py-0 max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0 max-sm:border-b-[3px] ${
            activeTab == "tokens"
              ? "font-semibold border border-[#C0CED4] max-sm:border-b-[#221AE9] max-sm:data-[state=active]:text-[#221AE9] max-sm:data-[state=active]:bg-transparent max-sm:data-[state=active]:shadow-none"
              : "font-normal max-sm:border-b-transparent max-sm:text-[#2E2E2E]"
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
          className={`flex-1 w-[155px] sm:min-w-[296px] lg:w-full py-2 text-[14px] --10px lg:text-[16px] rounded-[6px] max-sm:h-full max-sm:py-0 max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0 max-sm:border-b-[3px] ${
            activeTab == "subscription"
              ? "font-semibold border border-[#C0CED4] max-sm:border-b-[#221AE9] max-sm:data-[state=active]:text-[#221AE9] max-sm:data-[state=active]:bg-transparent max-sm:data-[state=active]:shadow-none"
              : "font-normal max-sm:border-b-transparent max-sm:text-[#2E2E2E]"
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
            <span className="block leading-tight text-center sm:hidden whitespace-nowrap">
              Get a Subscription
            </span>
            <span className="sm:block leading-tight text-center hidden">
              <span className="block">Go Unlimited with a Subscription</span>
            </span>
          </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tokens">
        <div className="gap-[16px] flex flex-col">
          <span className="text-center text-[18px] xl:text-[32px] font-semibold text-[#17119b]">
            Purchase Tokens to unlock more Analyses.
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

          {/* The mockup insets the card grid and the CTA well inside the modal,
              further than the tab bar above them. */}
          <div className="sm:px-[32px] xl:px-[80px] flex flex-col gap-[16px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {featuredTokens.map((option: any, index: number) => {
              const isSelected = selectedToken === index;
              return (
                <button
                  key={option.id ?? index}
                  type="button"
                  onClick={() => setSelectedToken(index)}
                  className={`relative rounded-[16px] overflow-hidden p-[16px] text-white text-center transition-all ${
                    isSelected ? "ring-4 ring-[#221AE9]" : "ring-0"
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
                        isSelected ? "bg-white" : "border-2 border-white/80"
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
                disabled={isLoading || loading || selectedToken == null}
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

          {/* Legal links — mobile only, per mockup */}
          <div className="flex sm:hidden items-center justify-center gap-[24px] pb-2">
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
        </div>
      </TabsContent>

      <TabsContent value="subscription" className={`pt-[10px]`}>
        <SubscriptionPlans source={source} />
      </TabsContent>
    </Tabs>
  );
};

export default PaywallContent;
