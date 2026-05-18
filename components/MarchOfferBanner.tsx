"use client";

import { usePricingOffer } from "@/app/store/pricingOffer";
import { isMarchCampaignActive, MARCH_OFFER_END_DATE_LABEL } from "@/constants/marchOffer";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const MARCH_BANNER_STORAGE_KEY = "marchOfferBannerDismissed";
const MARCH_BANNER_RESET_EVENT = "marchOfferBanner:reset";
const BANNER_NO_DATE_BG_SRC =
  "/special-offer/20260306/Sticky%20Bar%20-%20Header%20Banner/Banner%20Main%20Bar%20-%20Without%20End%20Date.svg";
const BANNER_MAIN_CONTENT_SRC =
  "/special-offer/20260306/Sticky%20Bar%20-%20Header%20Banner/Banner%20Main%20Content.png";
const BANNER_MAIN_TEXT_SRC =
  "/special-offer/20260306/Sticky%20Bar%20-%20Header%20Banner/Main%20text.png";
const BANNER_BUTTON_SRC =
  "/special-offer/20260306/Sticky%20Bar%20-%20Header%20Banner/Button.png";

const getLocalDateStamp = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const readDismissedState = () => {
  try {
    const storedValue = window.localStorage.getItem(MARCH_BANNER_STORAGE_KEY);
    if (!storedValue) {
      return false;
    }

    const todayStamp = getLocalDateStamp();

    // Migrate the previous boolean-based dismissal to today's date-only behavior.
    if (storedValue === "true") {
      window.localStorage.setItem(MARCH_BANNER_STORAGE_KEY, todayStamp);
      return true;
    }

    return storedValue === todayStamp;
  } catch {
    return false;
  }
};

const writeDismissedState = (dismissed: boolean) => {
  try {
    if (dismissed) {
      window.localStorage.setItem(MARCH_BANNER_STORAGE_KEY, getLocalDateStamp());
      return;
    }

    window.localStorage.removeItem(MARCH_BANNER_STORAGE_KEY);
  } catch {
    // Ignore storage failures so the banner still works.
  }
};

const resetBannerHeight = () => {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--banner-height", "0px");
  }
};

export function MarchOfferBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const { setOpen: setOpenPricing, setTabType } = usePricingOffer();

  const syncBannerHeight = useCallback(() => {
    if (!bannerRef.current || typeof document === "undefined") {
      return;
    }

    document.documentElement.style.setProperty(
      "--banner-height",
      `${bannerRef.current.offsetHeight}px`
    );
  }, []);

  useEffect(() => {
    if (!isMarchCampaignActive() || readDismissedState()) {
      resetBannerHeight();
      return;
    }

    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleReset = () => {
      if (!isMarchCampaignActive()) {
        setIsVisible(false);
        resetBannerHeight();
        return;
      }

      writeDismissedState(false);
      setIsVisible(true);
      requestAnimationFrame(syncBannerHeight);
    };

    window.addEventListener(MARCH_BANNER_RESET_EVENT, handleReset);

    return () => {
      window.removeEventListener(MARCH_BANNER_RESET_EVENT, handleReset);
    };
  }, [syncBannerHeight]);

  useEffect(() => {
    if (!isVisible) {
      resetBannerHeight();
      return;
    }

    requestAnimationFrame(syncBannerHeight);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && bannerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(syncBannerHeight);
      });
      resizeObserver.observe(bannerRef.current);
    }

    window.addEventListener("resize", syncBannerHeight);
    window.addEventListener("orientationchange", syncBannerHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncBannerHeight);
      window.removeEventListener("orientationchange", syncBannerHeight);
      resetBannerHeight();
    };
  }, [isVisible, syncBannerHeight]);

  useEffect(() => {
    if (isVisible || !isMarchCampaignActive() || !readDismissedState()) {
      return;
    }

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    const timeoutId = window.setTimeout(() => {
      if (!isMarchCampaignActive()) {
        return;
      }

      writeDismissedState(false);
      setIsVisible(true);
      requestAnimationFrame(syncBannerHeight);
    }, nextMidnight.getTime() - now.getTime());

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isVisible, syncBannerHeight]);

  const handleOpenOffer = () => {
    setTabType("subscription");
    setOpenPricing(true);
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    writeDismissedState(true);
    setIsVisible(false);
    resetBannerHeight();
  };

  const handleBannerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleOpenOffer();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div ref={bannerRef} className="fixed inset-x-0 top-0 z-[500] hidden lg:block">
      <div
        role="button"
        tabIndex={0}
        aria-label="Open March special offer"
        onClick={handleOpenOffer}
        onKeyDown={handleBannerKeyDown}
        className="group relative isolate w-full cursor-pointer overflow-hidden border-b border-[#0C0A62] bg-[#130F83] shadow-[0_10px_30px_rgba(19,15,131,0.28)] transition-opacity hover:opacity-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEEA02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#130F83]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)] opacity-80" />

        <div className="relative h-[60px]">
          <div className="absolute inset-0">
            <Image
              src={BANNER_NO_DATE_BG_SRC}
              alt=""
              fill
              priority
              aria-hidden
              className="object-cover object-center"
            />
          </div>

          <div className="relative h-full px-6 pr-12 md:px-8 md:pr-14 lg:px-10 lg:pr-16">
            <div className="absolute left-6 top-1/2 w-[142px] -translate-y-1/2 md:left-8 md:w-[180px] lg:left-10 lg:w-[220px] xl:w-[252px]">
              <Image
                src={BANNER_MAIN_CONTENT_SRC}
                alt="Special offer graphic"
                width={928}
                height={258}
                priority
                draggable={false}
                className="h-auto w-full drop-shadow-[0_8px_14px_rgba(0,0,0,0.24)]"
              />
            </div>

            <div className="absolute left-1/2 top-1/2 min-w-0 w-full max-w-[360px] -translate-x-1/2 -translate-y-1/2 md:max-w-[480px] lg:max-w-[calc(100vw-700px)] xl:max-w-[calc(100vw-912px)] 2xl:max-w-[calc(100vw-1048px)] min-[1760px]:max-w-[720px]">
              <Image
                src={BANNER_MAIN_TEXT_SRC}
                alt="Up to 55 percent discount. Get 1000 analyses at 3 dollars 33 per month."
                width={812}
                height={69}
                priority
                draggable={false}
                className="h-auto w-full"
              />
            </div>

            <div className="absolute right-[7rem] top-1/2 flex -translate-y-1/2 items-center justify-end md:right-[9rem] lg:right-[12rem] xl:right-[18rem] 2xl:right-[22rem] min-[3000px]:right-[55rem]">
              <div className="relative w-[114px] transition-transform duration-200 group-hover:scale-[1.02] md:w-[132px] lg:w-[150px] xl:w-[160px] 2xl:w-[164px] min-[1760px]:w-[174px]">
                <Image
                  src={BANNER_BUTTON_SRC}
                  alt="Get Offer"
                  width={472}
                  height={158}
                  priority
                  draggable={false}
                  className="h-auto w-full drop-shadow-[0_6px_16px_rgba(19,15,131,0.28)]"
                />
              </div>
            </div>

            <div className="absolute right-[3rem] top-1/2 hidden w-[126px] -translate-y-1/2 md:flex md:justify-center lg:w-[140px] xl:w-[154px] 2xl:w-[164px]">
              <span className="pointer-events-none whitespace-nowrap text-center text-[9px] font-semibold leading-none tracking-[-0.01em] text-white/85 lg:text-[10px] xl:text-[11px]">
                Offer ends {MARCH_OFFER_END_DATE_LABEL.replace(/\./g, "/")}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Dismiss March special offer banner"
          className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white transition-all hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#130F83]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
