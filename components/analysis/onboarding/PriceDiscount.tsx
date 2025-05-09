import React from "react";

export default function PriceDiscount({ price = 99.99, currency = "$" }) {
  // Split the price into dollars and cents
  const [dollars, cents] = price.toFixed(2).split(".");

  return (
    <div className="flex items-center">
      <div className="flex items-start relative">
        {/* Red strike-through line */}
        <div className="absolute w-full h-[3px] bg-[#FD0000] top-1/2 transform -translate-y-1/2 rotate-12"></div>

        <span className="text-[32px] font-normal text-[#FAFDFF60]">
          {currency}
          {dollars}.{cents}
        </span>
      </div>
    </div>
  );
}
