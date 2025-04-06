"use client";
import EndgamePage from "@/components/endgame-mastery/EndgamePage";
import Navigation from "@/components/navigator/navigation";

export default function Page() {
  return (
    <div className="flex overflow-hidden bg-primary-white">
      <div className="flex flex-col overflow-y-auto w-full">
        <Navigation>
          <div className="w-full mt-16">
            <EndgamePage />
          </div>
        </Navigation>
      </div>
    </div>
  );
}
