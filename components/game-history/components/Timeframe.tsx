"use client";

import { useState } from "react";
import TimeframeDialog from "./TimeframeDialog";

interface TimeframeProps {
    onDateChange?: (startDate: string, endDate: string) => void;
}

export default function Timeframe({ onDateChange }: TimeframeProps) {
    const [open, setOpen] = useState(false);
    const [dateRange, setDateRange] = useState<string>("All Time");

    const handleSave = (startDate: string, endDate: string) => {
        if (startDate && endDate) {
            setDateRange(`${startDate} ~ ${endDate}`);
        } else {
            setDateRange("All Time");
        }

        // Call parent callback
        if (onDateChange) {
            onDateChange(startDate, endDate);
        }
    };

    return (
        <>
            <button onClick={() => setOpen(true)} type="button" className="flex w-full items-center gap-[6px] text-[#717375] border border-[#D8DCE0] bg-[#F8F9FC] rounded-[8px] px-[12px] h-[42px] md:h-[32px] text-[16px] md:text-[14px]">
                <svg width="15" height="16" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.832 7.50065H0.832031M11.6654 0.833984V4.16732M4.9987 0.833984V4.16732M4.83203 17.5007H11.832C13.2322 17.5007 13.9322 17.5007 14.467 17.2282C14.9374 16.9885 15.3199 16.606 15.5595 16.1356C15.832 15.6008 15.832 14.9008 15.832 13.5007V6.50065C15.832 5.10052 15.832 4.40045 15.5595 3.86567C15.3199 3.39527 14.9374 3.01282 14.467 2.77313C13.9322 2.50065 13.2322 2.50065 11.832 2.50065H4.83203C3.4319 2.50065 2.73183 2.50065 2.19705 2.77313C1.72665 3.01282 1.3442 3.39527 1.10451 3.86567C0.832031 4.40045 0.832031 5.10052 0.832031 6.50065V13.5007C0.832031 14.9008 0.832031 15.6008 1.10451 16.1356C1.3442 16.606 1.72665 16.9885 2.19705 17.2282C2.73183 17.5007 3.4319 17.5007 4.83203 17.5007Z" stroke="#181D27" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{dateRange}</span>
            </button>

            <TimeframeDialog open={open} setOpen={setOpen} onSave={handleSave} />
        </>
    )
}
