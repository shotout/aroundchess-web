"use client";
import { ChangePassword } from "@/components/modal/ChangePassword";
import Navigation from "@/components/navigator/navigation";
import MyAccount from "@/components/profile/MyAccount";
import MyRemainingAnalysisTokens from "@/components/profile/MyRemainingAnalysisTokens";
import MyRemainingPuzzle from "@/components/profile/MyRemainingPuzzle";
import MySubscription from "@/components/profile/MySubscription";
export default function Profile() {
  return (
    <Navigation>
        <ChangePassword/>
      <div className="flex flex-col p-[32px] gap-4">
        <MyAccount />
        <MySubscription />
        <MyRemainingAnalysisTokens />
        <MyRemainingPuzzle/>
      </div>
    </Navigation>
  );
}
