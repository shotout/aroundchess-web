"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useProfileStore } from "@/app/store/profile";

const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

const getTimeRemaining = (endTime: number) => {
  const total = endTime - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

const DigitFlip = ({ value }: { value: number }) => {
  return (
    <div className="relative w-[40px] h-[36px] md:w-[80px] md:h-[72px] xl:w-[145px] xl:h-[113px] h-20 rounded-sm md:rounded-md xl:rounded-xl shadow-lg bg-black overflow-hidden">
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
          <span className="md:text-[50px] xl:text-[95px] text-white font-semibold z-10">
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
    <span className="text-[14px] --10px md:text-[16px] xl:text-[25px] text-[#2E3133] font-normal">
      {label}
    </span>
  </div>
);

export default function CountdownTimerToken() {
  const { activeMembership } = useProfileStore();
  const [nextTokenTime, setNextTokenTime] = useState<number>(() => {
    const saved = localStorage.getItem("nextTokenTime");
    const deadline =
      activeMembership?.lastAnalysisDate != null
        ? new Date(activeMembership?.lastAnalysisDate).getTime() +
          3 * 24 * 60 * 60 * 1000
        : Date.now();
    if (saved && parseInt(saved, 10) > deadline) {
      return parseInt(saved, 10);
    } else {
      const next = deadline + THREE_DAYS;
      localStorage.setItem("nextTokenTime", next.toString());
      return next;
    }
  });

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(nextTokenTime));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(nextTokenTime);
      if (remaining.total <= 0) {
        const newTime = Date.now() + THREE_DAYS;
        localStorage.setItem("nextTokenTime", newTime.toString());
        setNextTokenTime(newTime);
        setTimeLeft(getTimeRemaining(newTime));
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextTokenTime]);

  return (
    <div className="flex flex-col items-center space-y-3 bg-gradient-to-b from-[#E7F3F7] via-[#DAF2FB] to-[#C8F1FF] border-2 border-[white] rounded-[16px] p-[16px]">
      <p className="text-[14px] -- md:text-[17px] text-[#221AE9] font-medium">
        You will get one Free Analysis Token in...
      </p>
      <div className="flex space-x-4">
        <TimeBox label="Days" value={timeLeft.days} />
        <TimeBox label="Hours" value={timeLeft.hours} />
        <TimeBox label="Minutes" value={timeLeft.minutes} />
        <TimeBox label="Seconds" value={timeLeft.seconds} />
      </div>
    </div>
  );
}
