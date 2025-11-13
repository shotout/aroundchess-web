"use client";

import { useBlackFridayModal } from "@/app/store/blackFridayModal";
import { usePricingOffer } from "@/app/store/pricingOffer";
import Image from "next/image";
import { X } from "lucide-react";

export function BlackFridayPromo() {
  const { open, setOpen } = useBlackFridayModal();
  const { setOpen: setOpenPricingOffer, setTabType, setSubscriptionFilter } = usePricingOffer();

  const handleGetOffer = () => {
    // Close Black Friday modal
    setOpen(false);
    
    // Open pricing modal with yearly subscription pre-selected
    setTabType("subscription");
    setSubscriptionFilter("yearly");
    setOpenPricingOffer(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay with light grey background - matching the reference image */}
      <div 
        className="absolute inset-0 bg-gray-400/40 backdrop-blur-sm" 
        onClick={() => setOpen(false)} 
      />
      
      {/* Modal Content - Wider and shorter */}
      <div className="relative z-10 w-full max-w-[580px] rounded-[20px] overflow-hidden shadow-2xl">
        {/* Container with background */}
        <div className="relative bg-gradient-to-b from-[#0A0066] via-[#1A1A8E] to-[#00A3A3]">
          {/* Background Image Layer */}
          <div className="absolute inset-0">
            <Image
              src="/images/black-friday/Slicing - Desktop Banner/background.png"
              alt="Black Friday Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Container - Reduced padding */}
          <div className="relative z-10 flex flex-col items-center px-8 py-7">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 rounded-full p-1.5 bg-white/90 hover:bg-white transition-colors z-20"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            {/* Special Offer Badge & Graphic - positioned at top */}
            <div className="relative w-full max-w-[460px] mb-4">
              <Image
                src="/images/black-friday/Slicing - Desktop Banner/graphic with text.png"
                alt="Black Friday Special Offer"
                width={340}
                height={150}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Premium Subscription Text */}
            <div className="text-center mb-2">

            </div>

            {/* Price Image */}
            <div className="relative w-full max-w-[460px] mb-4">
              <Image
                src="/images/black-friday/Slicing - Desktop Banner/text_price.png"
                alt="Price $29.99/year"
                width={280}
                height={60}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Call to Action Box with BLACK50 code overlay */}
            <div className="relative w-full max-w-[500px] mb-4">
              {/* Background: Call to action box image */}
              <Image
                src="/images/black-friday/Slicing - Desktop Banner/call to action box.png"
                alt="Get $50 Discount"
                width={500}
                height={120}
                className="w-full h-auto"
                priority
              />
              
              {/* Overlay: BLACK50 code text centered on top - fills the box */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/black-friday/Slicing - Desktop Banner/text_code.png"
                    alt="BLACK50"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Get Offer Button */}
            <button
              onClick={handleGetOffer}
              className="w-full max-w-[480px] bg-[#221AE9] hover:bg-[#1810C7] text-white font-bold text-[18px] py-4 px-10 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-4"
            >
              Get Offer
            </button>

            {/* Fine Print */}
            <p className="text-white/90 text-[10px] text-center px-4 leading-tight max-w-[480px]">
              Valid until November 30, 2025. Subscription Purchase must be made on a desktop device to claim the discount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
