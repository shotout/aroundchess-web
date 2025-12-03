"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { usePricingOffer } from "@/app/store/pricingOffer";

export function BlackFridayBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const { setOpen: setOpenPricing, setTabType, setSubscriptionFilter } = usePricingOffer();

  useEffect(() => {
    const bannerClosed = localStorage.getItem("blackFridayBannerClosed");
    if (!bannerClosed) {
      setIsVisible(true);
    }
  }, []);

  // Listen for a global reset event so we can show the banner again immediately
  // after login, without requiring a full page refresh.
  useEffect(() => {
    const handleReset = () => {
      // Only show again if it was previously closed
      setIsVisible(true);
      document.documentElement.style.setProperty("--banner-height", "0px");
    };

    window.addEventListener("blackFridayBanner:reset", handleReset);

    return () => {
      window.removeEventListener("blackFridayBanner:reset", handleReset);
    };
  }, []);

  // Measure actual banner height (desktop/mobile) and push to CSS var
  useEffect(() => {
    if (!isVisible) {
      document.documentElement.style.setProperty("--banner-height", "0px");
      return;
    }

    const setHeightFromRef = () => {
      if (!bannerRef.current) return;
      const height = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty("--banner-height", `${height}px`);
      console.log("Banner height set to:", height);
    };

    // Use requestAnimationFrame to ensure DOM is painted
    requestAnimationFrame(() => {
      setHeightFromRef();
    });

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        setHeightFromRef();
      });
    });

    if (bannerRef.current) {
      resizeObserver.observe(bannerRef.current);
    }
    
    window.addEventListener("resize", setHeightFromRef);
    window.addEventListener("orientationchange", setHeightFromRef);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", setHeightFromRef);
      window.removeEventListener("orientationchange", setHeightFromRef);
      document.documentElement.style.setProperty("--banner-height", "0px");
    };
  }, [isVisible]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem("blackFridayBannerClosed", "true");
    document.documentElement.style.setProperty("--banner-height", "0px");
  };

  const handleBannerClick = () => {
    setTabType("subscription");
    setSubscriptionFilter("yearly");
    setOpenPricing(true);
  };

  if (!isVisible) return null;

  return (
    <div ref={bannerRef} className="fixed top-0 left-0 right-0 z-[500] w-full">
      {/* Desktop Banner */}
      <div
        onClick={handleBannerClick}
        className="hidden md:flex relative w-full h-[80px] items-center justify-center overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
        style={{
          backgroundImage: "url('/images/black-friday/Slicing - Desktop Bar/Background can be code.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat-x",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors z-10"
          aria-label="Close banner"
        >
          <X size={24} />
        </button>

        {/* Banner content container */}
        <div className="flex items-center justify-between w-full h-full px-4 md:px-6 lg:px-12 relative">
          {/* Left side - Black Friday graphic with text */}
          <div className="flex items-center h-full flex-shrink-0">
            <img
              src="/images/black-friday/Slicing - Desktop Bar/graphic_with_text/graphic_with_text_4x.png"
              alt="Black Friday Special Offer $50 OFF"
              className="h-[58px] md:h-[64px] lg:h-[72px] w-auto object-contain"
            />
          </div>

          {/* Center content - $50 OFF and BLACK50 code */}
          <div className="flex items-center justify-center flex-1 mx-2 md:mx-4">
            <img
              src="/images/black-friday/Slicing - Desktop Bar/all_content/all_content_4x.png"
              alt="Get $50 OFF - Code: BLACK50"
              className="h-auto w-auto max-h-[68px] md:max-h-[74px] lg:max-h-[78px] object-contain"
            />
          </div>

          {/* Right side - Valid until text */}
          <div className="flex items-center h-full flex-shrink-0">
            <p className="text-white text-[14px] --xs md:text-[14px] --sm lg:text-base font-normal whitespace-nowrap">
              Valid until November 30.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Banner */}
      <div
        onClick={handleBannerClick}
        className="md:hidden w-full min-h-[100px] flex items-center justify-center py-3 px-4 cursor-pointer active:opacity-95 transition-opacity"
        style={{
          backgroundImage: "url('/images/black-friday/Slicing - Desktop Banner/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/black-friday/Slicing - Mobile Bar/version_1/pattern/pattern_4x.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors z-20"
          aria-label="Close banner"
        >
          <X size={20} />
        </button>

        {/* Mobile content */}
        <div className="flex items-center justify-center gap-6 w-full -ml-4 relative z-10">
          <div className="flex items-center justify-center">
            <img
              src="/images/black-friday/Slicing - Mobile Bar/version_1/graphic_with_text/graphic_with_text_4x.png"
              alt="Black Friday Special Offer $50 OFF"
              className="h-[110px] sm:h-[120px] w-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/images/black-friday/Slicing - Mobile Bar/version_1/all_content/all_content_4x.png"
              alt="Get $50 OFF - Code: BLACK50"
              className="h-[110px] sm:h-[120px] w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

