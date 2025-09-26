"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useProfileStore } from "@/app/store/profile";

const getTimeRemaining = (endTime: number) => {
  const total = endTime - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  return { total, hours, minutes, seconds };
};

const DigitFlip = ({ value }: { value: number }) => {
  return (
    <div className="relative w-[40px] h-[36px] md:w-[32px] md:h-[22px] xl:w-[42px] xl:h-[32px] rounded-[4px] shadow-lg bg-black overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            alt="timer"
            src={"/images/pricing/timer.png"}
            width={1000}
            height={1000}
            className="w-full h-full absolute object-cover -z-0"
          />
          <span className="md:text-[20px] xl:text-[26px] text-white font-semibold z-10">
            {value.toString().padStart(2, "0")}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TimeBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center space-y-1">
    <DigitFlip value={value} />
    <span className="text-[10px] md:text-[10px] xl:text-[12px] text-[#2E3133] font-normal">
      {label}
    </span>
  </div>
);

export default function CountdownTimerDiscount() {
  const { profile } = useProfileStore();
  const [nextDiscountTime, setNextDiscountTime] = useState<number>(() => {
    const saved = localStorage.getItem("nextDiscountTime");
    const deadline = new Date(profile.createdAt).getTime() + 24 * 60 * 60 * 1000;
    if (saved && parseInt(saved, 10) > deadline) {
      return parseInt(saved, 10);
    } else {
      const next = deadline;
      localStorage.setItem("nextDiscountTime", next.toString());
      return next;
    }
  });

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(nextDiscountTime));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(nextDiscountTime);
      // console.log("remaining", remaining);
      if (remaining.total <= 0) {
        const newTime = Date.now();
        localStorage.setItem("nextDiscountTime", newTime.toString());
        setNextDiscountTime(newTime);
        setTimeLeft(getTimeRemaining(newTime));
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextDiscountTime]);

  return (
    <div className="relative flex flex-col sm:w-[466px] sm:h-[126px] items-center space-y-3 bg-gradient-to-r from-[#66FEB7] via-[#00FE87] to-[#66FEB7] border-2 border-[#e6f7f3] border-dashed rounded-[8px] p-[8px]">
      <p className="text-[14px] sm:text-[12px] lg:text-[14px] font-medium text-center text-black block">
        Get <span className="text-[#221AE9] font-bold">Special Discount </span>now
        on our 12 Months Premium Subscription.
        <span className="text-[10px] sm:text-[12px] lg:text-[14px] font-medium text-center text-black block">
          Offer expires in...
        </span>
      </p>
      <Image
        alt="sparks"
        src={"/images/pricing/sparks.png"}
        width={1000}
        height={1000}
        className="w-[80px] h-[54px] absolute object-cover -z-0 left-0 xl:left-16 bottom-3"
      />
      <div className="flex space-x-1">
        <TimeBox label="Hours" value={timeLeft.hours} />
        <TimeBox label="Minutes" value={timeLeft.minutes} />
        <TimeBox label="Seconds" value={timeLeft.seconds} />
      </div>
    </div>
  );
}
