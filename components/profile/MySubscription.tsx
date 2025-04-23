import { FC } from "react";
import { PremiumSubsContent } from "../analysis/onboarding/PremiumSubscription";

const MySubscription = () => {
  return (
    <div className={`flex flex-col gap-4`}>
      <div className="flex flex-row items-center justify-between border-0 border-b-2 border-b-[#C0CED4] pb-1">
        <span className="text-[18px] font-semibold">My Subscription</span>
      </div>
      <PremiumSubsContent />
    </div>
  );
};

export default MySubscription;
