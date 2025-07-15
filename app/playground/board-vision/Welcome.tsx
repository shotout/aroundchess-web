"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Welcome: React.FC = () => {
  const route = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleStartClick = () => {
    route.push("/playground/board-vision/default");
  };

  return (
    <main className="w-full h-full xl:p-8">
      <div className="relative mx-auto w-full h-full flex items-center justify-center rounded-xl overflow-hidden border">
        {isMobile ? (
          <div className="absolute inset-0 z-0">
            <Image
              src="/board-vision/board.png"
              alt="Background"
              priority
              fill
              sizes="100vw"
              className="object-cover object-bottom"
              style={{ objectPosition: "50% 100%" }}
              quality={100}
            />
          </div>
        ) : (
          <div className="absolute z-0 bottom-0 left-0 min-w-full">
            <Image
              src="/board-vision/board.png"
              alt="Background"
              priority
              width={6000}
              height={1000}
              className="object-cover"
              quality={100}
            />
          </div>
        )}

        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center m-4">
            <div className="w-full p-8 xl:max-w-[643px] 2xl:max-w-[700px] z-10 sm:mx-7 bg-white/70 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-64 border-2 border-[#fff] rounded-md flex flex-col gap-2 items-center justify-center">
              <Image
                src={"/board-vision/eye.png"}
                alt="background"
                width={1000}
                height={1000}
                className="w-[188px] xl:w-[376px] h-auto"
              />
              <span className="font-medium text-lg xl:text-xl">
                Board Vision
              </span>
              <span className="font-normal text-md xl:mx-20 text-center">
                Answer technical Chess Questions from positions of your previous
                Games to improve your Board Vision.
              </span>
              <button
                className="btn-primary w-full p-2 rounded-full"
                onClick={handleStartClick}
              >
                Start Board Vision
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Welcome;
