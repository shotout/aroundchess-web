import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { useStatusPurchaseTokens } from "@/app/store/statusPurchaseTokens";
import { useSuccessSubscription } from "@/app/store/successSubscription";
import { useApiClient } from "@/functions/api-client";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { PremiumSubsContent } from "../analysis/onboarding/PremiumSubscription";
import DotSpinner from "../game-history/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { loadStripe } from "@stripe/stripe-js";
import CountdownTimerToken from "../CountdownTimer/CountdownTimerToken";
import { useRouter } from "next/navigation";
import { useConfirmLogin } from "@/app/store/confirmLogin";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface TokenOption {
  amount: number;
  price: number;
  pricePerToken: number;
}

export const PricingOffer: React.FC = () => {
  const { setOpen: setOpenConfirmLogin } = useConfirmLogin();

  const router = useRouter();
  const arrNumber = [12, 78, 50, 99, 15];

  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("0");
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [pricePerToken, setPricePerToken] = useState<string>("0.99");
  const [totalPrice, setTotalPrice] = useState<string>("0.99");
  const [activeTab, setActiveTab] = useState("tokens");
  const { open, setOpen, tabType } = usePricingOffer();
  const { postPurchaseToken, isLoading } = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    tokenPackage,
    profile,
    isMember,
    token,
    activeMembership,
    setTokenPackage,
  } = useProfileStore();
  const { open: openSuccessSubscription, setOpen: setOpenSuccessSubscription } =
    useSuccessSubscription();
  const deadlineToken =
    activeMembership?.lastAnalysisDate != null
      ? new Date(activeMembership?.lastAnalysisDate).getTime() +
        3 * 24 * 60 * 60 * 1000
      : Date.now() + 24 * 60 * 60 * 1000;
  const deadlineDiscount =
    new Date(profile.createdAt).getTime() + 24 * 60 * 60 * 1000;
  const isPassToken = deadlineToken - Date.now();
  const isPassDiscount = deadlineDiscount - Date.now();
  const {
    setOpen: setOpenStatusPurchase,
    status,
    setStatus,
    setQuantity,
  } = useStatusPurchaseTokens();
  const { sessionId } = useProfileStore();
  const [widthC, setWidthC] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  const tokenOptions: TokenOption[] = [
    { amount: 1, price: 0.99, pricePerToken: 0.99 },
    { amount: 5, price: 4.45, pricePerToken: 0.89 },
    { amount: 10, price: 7.9, pricePerToken: 0.79 },
    { amount: 25, price: 16.25, pricePerToken: 0.65 },
    { amount: 50, price: 30.0, pricePerToken: 0.6 },
  ];
  const fetchTokenPackageLocal = async () => {
    const resTokenPackage = await fetch("/local-data/token-package.json");
    const response = await resTokenPackage.json();

    setTokenPackage(response);
  };
  useEffect(() => {
    setWidthC(window?.innerWidth);
    fetchTokenPackageLocal();

    setOpen(open);
  }, [open]);
  useEffect(() => {
    setActiveTab(tabType);
  }, [tabType]);
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);
  const handleResize = () => {
    const width = window?.innerWidth;
    console.log("width", width);
    setWidthC(width);
  };
  const handleGetPremium = () => {
    if (sessionId.length == 0) {
      setOpenConfirmLogin(true);
      setOpen(false);
    } else {
      handleStop();
      setOpen(false);
      setOpenSuccessSubscription(true);
    }
  };
  const handlePurchaseToken = async () => {
    if (sessionId.length == 0) {
      setOpenConfirmLogin(true);
    } else {
      setLoading(true);
      const tokenAmount =
        selectedToken != null && selectedToken != 5
          ? tokenOptions[selectedToken].amount
          : customAmount;
      const price =
        selectedToken != null && selectedToken != 5
          ? tokenOptions[selectedToken].pricePerToken * 100
          : parseFloat(pricePerToken) * 100;
      console.log("totalPrice", parseFloat(totalPrice));
      console.log("body", selectedToken, {
        productName: tokenAmount + " tokens",
        price: parseFloat(price.toFixed(2)),
        quantity: parseInt(tokenAmount.toString()),
        type: "token",
        idUser: profile.id,
      });
      const res = await fetch("/api/stripe/checkout_sessions", {
        method: "POST",
        body: JSON.stringify({
          productName: tokenAmount + " tokens",
          price: parseFloat(price.toFixed(2)),
          quantity: parseInt(tokenAmount.toString()),
          type: "token",
          idUser: profile.id,
        }),
      });

      const data = await res.json();

      // if (data.url) {
      //   window.open(data.url, "_blank"); // Opens in a new tab
      // }
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: data.id });
      // send to backend
      setLoading(false);
      setQuantity(parseInt(tokenAmount.toString()));
      setStatus("waiting");
      setOpenStatusPurchase(true);
      setOpen(false);
      handleStop();
    }
  };
  const startInterval = (): void => {
    if (tokenPackage.length > 0 && intervalRef.current == null) {
      intervalRef.current = setInterval(() => {
        setIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % arrNumber.length;
          return nextIndex;
        });
      }, 1000);
    }
    setIsRunning(true);
    // Cleanup function is not needed here, so just return void
  };
  const handleStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  // Store index in a ref so setInterval always gets the latest value
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
    setCustomAmount(arrNumber[index] + "");
    handleOnChangePrice(arrNumber[index]);
    if (tokenPackage.length > 0) {
      startInterval();
    }
  }, [tokenPackage, index]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  const handleOnChange = (e: any) => {
    const value = parseInt(e.target.value);
    handleOnChangePrice(value);
  };
  const handleOnChangePrice = (value: number) => {
    const conditionedValue =
      value > 100 ? 100 : isNaN(value) ? 0 : value < 0 ? 0 : value;
    setCustomAmount(conditionedValue.toString());
    if (conditionedValue > 0 && tokenPackage.length > 0) {
      const dataPrice = tokenPackage.find(
        (price: any) => price.quantity == conditionedValue
      );
      const perToken = dataPrice.pricePerToken;
      const totalPrice = dataPrice.totalPrice;
      setPricePerToken(perToken);
      setTotalPrice(totalPrice);
    } else {
      setPricePerToken("0.00");
      setTotalPrice("0.00");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        {/* <DialogOverlay className="fixed inset-0 bg-black/50" /> */}
        <DialogContent
          style={{
            backgroundImage: `url(/images/pricing/${
              widthC < 768 ? `bg-mobile` : `bg-laptop`
            }.png)`,

            backgroundSize: "cover",
            backgroundPosition: "center",
            height: activeTab == "tokens" ? "100vh" : "100vh",
            width: "100%",
          }}
          className={`fixed top-1/2 overflow-x-hidden left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[358px] sm:max-w-[640px] xl:max-w-[1141px] max-h-[97%] rounded-lg p-4 shadow-xl overflow-y-auto z-[1000]`}
        >
          <div className="text-center py-2 z-2 px-8">
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
          {activeTab == "tokens" && !isMember && token.balance == 0 && (
            <CountdownTimerToken />
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div
            // className={`${
            //   activeTab == "tokens"
            //     ? isPassToken > 0
            //       ? `h-[82%] sm:h-[100%] lg:h-[98%] xl:h-[90%] overflow-y-auto`
            //       : ``
            //     : isPassDiscount > 0
            //     ? `h-[36%] sm:h-[62%] lg:h-[58%] xl:h-[77%] overflow-y-auto`
            //     : `h-[48%] sm:h-[75%] lg:h-[71%] xl:h-[90%] overflow-y-auto`
            // } }`}
            >
              <TabsList className="flex-1 h-[62px] min-w-[326px] sm:min-w-[608px] lg:w-full sm:h-[52px] border border-[#C0CED4] rounded-[12px] p-[8px] bg-[#F2FBFE]">
                <TabsTrigger
                  value="tokens"
                  className={`flex-1 w-[155px] sm:min-w-[296px] lg:w-full py-2 text-[10px] lg:text-[16px] rounded-[6px] ${
                    activeTab == "token"
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
                      <span className="block sm:inline">Unlock More</span>
                      <span className="block sm:inline sm:ml-1">Analyses</span>
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className={`flex-1 w-[155px] sm:min-w-[296px] lg:w-full py-2 text-[10px] lg:text-[16px] rounded-[6px] ${
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
                    <span className="block leading-tight text-center">
                      <span className="block">Go Unlimited</span>
                      <span className="block">with a Subscription</span>
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tokens">
                <div className="gap-[16px] flex flex-col">
                  <span className="text-center text-[18px] xl:text-[32px] font-semibold text-[#17119b]">
                    Purchase Tokens to unlock more Analyses right now!
                  </span>
                  <div className="flex items-center justify-center gap-2 ">
                    <CheckCircle
                      className="w-[16px] h-[16px] xl:w-[24px] xl:h-[24px]"
                      color="#221AE9"
                    />
                    <span className="text-[12px] xl:text-[18px] font-normal">
                      Spend 1 Analysis Token for each Analysis
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4">
                    {tokenOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`w-[154px] sm:w-[185px] sm:h-[120px] xl:h-[160px] xl:w-[348px] rounded-[16px] p-[16px] cursor-pointer relative ${
                          selectedToken === index
                            ? "border-4 border-[#221AE9]"
                            : " "
                        }`}
                        onClick={() => {
                          startInterval();
                          setSelectedToken(index);
                        }}
                      >
                        {selectedToken != index && (
                          <div
                            className={`h-[96%] w-[99%] mx-[8px] fixed absolute rounded-[10px] inset-0`}
                            style={{
                              boxShadow:
                                "inset 2px 0px 40px 2px rgba(247, 242, 242, 0.9)",
                            }}
                          />
                        )}

                        <Image
                          src={`/images/pricing/${
                            widthC <= 1024
                              ? option.amount + `-token-mobile`
                              : option.amount + `-token`
                          }.png`}
                          alt="icon"
                          width={1000}
                          height={1000}
                          priority
                          className="w-full h-full fixed absolute inset-0 object-cover rounded-[14px] -z-10 "
                          style={
                            selectedToken != index
                              ? {
                                  backgroundImage: `
                            linear-gradient(to bottom, #EEF8FB 0%, #D5F2FD 57%, #E7F3F7 100%),
                            linear-gradient(230deg, #FFFFFF, #9FDEFE)
                          `,
                                  backgroundClip: "padding-box, border-box",
                                  backgroundOrigin: "padding-box, border-box",
                                  borderLeft: "8px solid transparent",
                                  borderBottom: "8px solid transparent",
                                  borderTop: "2px solid transparent",
                                  borderRight: "2px solid transparent",
                                }
                              : {
                                  background: `
                            radial-gradient(circle at center, #ABE3FF 10%,#ABE3FF 57%,#ABE3FF 100%) 
                          `,
                                }
                          }
                        />
                        <div className="absolute top-3 right-3 z-2">
                          <div className="w-[16px] h-[16px] bg-[#EDFAFF] border-2 border-[#1246B676] rounded-full flex items-center justify-center">
                            {selectedToken === index && (
                              <div className="w-[10px] h-[10px] bg-[#221AE9] rounded-full" />
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col justify-center items-center text-center mt-2 z-10 gap-1 ">
                          <span className="font-semibold text-[18px] xl:text-[28px] text-[#221AE9]">
                            {option.amount === 1
                              ? "1 Token"
                              : `${option.amount} Tokens`}
                          </span>
                          <span className="font-medium text-[20px] xl:text-[24px] text-[#221AE9]">
                            ${option.price.toFixed(2)}
                          </span>
                          {option.amount != 1 && (
                            <span className="font-normal text-[14px] text-[#221AE9]">
                              ${option.pricePerToken.toFixed(2)}/Token
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Custom Amount Input */}
                    <div
                      className={`w-[154px] sm:w-[185px] sm:h-[120px] xl:h-[160px] xl:w-[348px] rounded-[16px] p-[16px] cursor-pointer relative ${
                        selectedToken === 5 ? "border-4 border-[#221AE9]" : " "
                      }`}
                      style={
                        selectedToken != 5
                          ? {
                              backgroundImage: `
                            linear-gradient(to bottom, #EEF8FB 0%, #D5F2FD 57%, #E7F3F7 100%),
                            linear-gradient(230deg, #FFFFFF, #9FDEFE)
                          `,
                              backgroundClip: "padding-box, border-box",
                              backgroundOrigin: "padding-box, border-box",
                              borderLeft: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderTop: "2px solid transparent",
                              borderRight: "2px solid transparent",
                            }
                          : {
                              background: `
                            linear-gradient(to bottom, #ABE3FF 0%,#C8F1FF 20%,#C8F1FF 57%,#ABE3FF 100%) 
                          `,
                            }
                      }
                      onClick={() => {
                        setSelectedToken(5);
                        handleStop();
                        setCustomAmount("0");
                      }}
                    >
                      <div className="absolute top-3 right-3 z-2">
                        <div className="w-[16px] h-[16px] bg-[#EDFAFF] border-2 border-[#1246B676] rounded-full flex items-center justify-center">
                          {selectedToken === 5 && (
                            <div className="w-[10px] h-[10px] bg-[#221AE9] rounded-full" />
                          )}
                        </div>
                      </div>

                      <div className="text-center gap-1">
                        <div className="font-normal text-[12px] xl:text-[14px]">
                          Enter Amount
                        </div>
                        <div
                          onClick={
                            !isRunning
                              ? () => null
                              : () => {
                                  setSelectedToken(5);
                                  handleStop();
                                  setCustomAmount("0");
                                }
                          }
                          className="flex items-center justify-center gap-2"
                        >
                          <input
                            type="number"
                            max={100}
                            className={`font-medium text-center w-[29px] xl:w-[48px] sm:h-[22px] xl:h-[40px] text-center border-b border-gray-300 focus:outline-none ${
                              selectedToken == 5
                                ? `text-black`
                                : `text-[#ABABAB]`
                            }`}
                            value={customAmount}
                            onChange={handleOnChange}
                            onClick={(e) => {
                              setSelectedToken(5);
                              e.stopPropagation();
                              handleStop();
                              setCustomAmount("0");
                            }}
                          />
                          <span className="font-semibold text-[18px] xl:text-[28px] text-[#221AE9]">
                            Token
                          </span>
                        </div>
                        <div className="font-medium text-[20px] xl:text-[24px]">
                          ${totalPrice}
                        </div>
                        <div className="text-[14px] font-normal text-[#221AE9]">
                          ${pricePerToken}/Token
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {isLoading || loading ? (
                      <DotSpinner />
                    ) : (
                      <button
                        disabled={
                          isLoading ||
                          loading ||
                          (customAmount == "0" && selectedToken == null)
                        }
                        onClick={handlePurchaseToken}
                        className={`${
                          isLoading ||
                          (customAmount == "0" && selectedToken == null)
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

              <TabsContent value="subscription" className="-pt-[10px]">
                <PremiumSubsContent onGetPremium={handleGetPremium} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

// Example usage in a Next.js page
export default function TokenPurchasePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PricingOffer />
    </div>
  );
}
