import Image from "next/image";
import React from "react";

const FinishedBanner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-[#1BC08C]/30 from-0% via-[#1BC08C] via-50% to-[#1BC08C]/30 to-100% border rounded-lg p-4 pl-10 flex items-center gap-2">
      <Image
        width={20}
        height={20}
        alt="check icon"
        src={"/handbooks/check.png"}
        className="h-5 w-5 text-green-500"
      />
      <h1 className="text-black font-medium">
        Great, you finished this exercise! Make sure you use your Learnings in
        your next Game.
      </h1>

      <Image
        width={200}
        height={200}
        alt="sparks"
        src={"/handbooks/sparks.png"}
        className="absolute top-0 right-12"
      />
    </div>
  );
};

export default FinishedBanner;
