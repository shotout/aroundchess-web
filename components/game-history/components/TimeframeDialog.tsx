"use client";

import { useState, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";

import "react-day-picker/style.css";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSave: (startDate: string, endDate: string) => void;
}

export default function TimeframeDialog({ open, setOpen, onSave }: Props) {
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
    const [activeButton, setActiveButton] = useState<string>("all");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 920);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleQuickSelect = (type: string) => {
        const today = new Date();
        let newRange: DateRange | undefined;

        switch (type) {
            case "all":
                newRange = undefined;
                break;
            case "yesterday":
                const yesterday = subDays(today, 1);
                newRange = { from: yesterday, to: yesterday };
                break;
            case "last7":
                newRange = { from: subDays(today, 6), to: today };
                break;
            case "last30":
                newRange = { from: subDays(today, 29), to: today };
                break;
            case "thisMonth":
                newRange = { from: startOfMonth(today), to: endOfMonth(today) };
                break;
            case "lastMonth":
                const lastMonth = subMonths(today, 1);
                newRange = { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
                break;
        }

        setSelectedRange(newRange);
        setActiveButton(type);
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setSelectedRange(range);
        setActiveButton("");
    };

    const formatDateValue = (date: Date | undefined) => {
        return date ? format(date, "yyyy-MM-dd") : "";
    };

    const handleSave = () => {
        const startDate = formatDateValue(selectedRange?.from);
        const endDate = formatDateValue(selectedRange?.to);
        onSave(startDate, endDate);
        setOpen(false);
    };

    if (!open) {
        return null;
    }

    return (
        <div onClick={() => setOpen(false)} className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
            <div className="relative w-[calc(100%-32px)] lg:w-[800px] bg-[#FAFDFF] rounded-[16px]" onClick={(e) => e.stopPropagation()}>
                <div className="relative p-[16px]">
                    <h3 className="w-full text-[18px] font-semibold text-center">Choose Timeframe</h3>
                    <button onClick={() => setOpen(false)} className="absolute border border-[#DEDEDE] bg-white rounded-[4px] top-[13px] right-[16px] py-[6px] px-[10px]">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L5 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 5L15 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="relative py-[8px] lg:py-[16px] px-[12px] lg:px-[32px]">
                    <div className="flex gap-[16px] lg:gap-[32px] mb-[16px]">
                        <div className="w-full">
                            <label htmlFor="start_date" className="text-[15px] mb-[4px] font-semibold">Start Date</label>
                            <input
                                type="text"
                                id="start_date"
                                placeholder="All Time"
                                value={formatDateValue(selectedRange?.from)}
                                readOnly
                                className="w-full border border-black bg-white rounded-[8px] px-[12px] py-[4px]"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="end_date" className="text-[15px] mb-[4px] font-semibold">End Date</label>
                            <input
                                type="text"
                                id="end_date"
                                placeholder="All Time"
                                value={formatDateValue(selectedRange?.to)}
                                readOnly
                                className="w-full border border-black bg-white rounded-[8px] px-[12px] py-[4px]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center py-[8px] lg:py-[16px] -mx-4px">
                        <div className="w-1/3 px-[4px] mb-[8px]">
                            <button type="button" onClick={() => handleQuickSelect("all")} className="w-full bg-[#EEF3F5] text-[14px] rounded-[6px] p-[8px] disabled:bg-white disabled:border disabled:border-[#221AE9]" disabled={activeButton === "all"}>All Time</button>
                        </div>
                        <div className="w-1/3 px-[4px] mb-[8px]">
                            <button type="button" onClick={() => handleQuickSelect("yesterday")} className="w-full bg-[#EEF3F5] text-[14px] rounded-[6px] p-[8px] disabled:bg-white disabled:border disabled:border-[#221AE9]" disabled={activeButton === "yesterday"}>Yesterday</button>
                        </div>
                        <div className="w-1/3 px-[4px] mb-[8px]">
                            <button type="button" onClick={() => handleQuickSelect("last7")} className="w-full bg-[#EEF3F5] text-[14px] rounded-[6px] p-[8px] disabled:bg-white disabled:border disabled:border-[#221AE9]" disabled={activeButton === "last7"}>Last 7 days</button>
                        </div>
                        <div className="w-1/3 px-[4px] mb-[8px]">
                            <button type="button" onClick={() => handleQuickSelect("last30")} className="w-full bg-[#EEF3F5] text-[14px] rounded-[6px] p-[8px] disabled:bg-white disabled:border disabled:border-[#221AE9]" disabled={activeButton === "last30"}>Last 30 days</button>
                        </div>
                        <div className="w-1/3 px-[4px] mb-[8px]">
                            <button type="button" onClick={() => handleQuickSelect("thisMonth")} className="w-full bg-[#EEF3F5] text-[14px] rounded-[6px] p-[8px] disabled:bg-white disabled:border disabled:border-[#221AE9]" disabled={activeButton === "thisMonth"}>This Month</button>
                        </div>
                        <div className="w-1/3 px-[4px] mb-[8px]">
                            <button type="button" onClick={() => handleQuickSelect("lastMonth")} className="w-full bg-[#EEF3F5] text-[14px] rounded-[6px] p-[8px] disabled:bg-white disabled:border disabled:border-[#221AE9]" disabled={activeButton === "lastMonth"}>Last Month</button>
                        </div>
                    </div>

                    {!isMobile && (
                        <div className="flex justify-between text-[14px] font-medium">
                            <div className="border-b border-[#DEDEDE] pb-[8px]">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="w-[50px]">SUN</th>
                                            <th className="w-[50px]">MON</th>
                                            <th className="w-[50px]">TUE</th>
                                            <th className="w-[50px]">WED</th>
                                            <th className="w-[50px]">THU</th>
                                            <th className="w-[50px]">FRI</th>
                                            <th className="w-[50px]">SAT</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            <div className="border-b border-[#DEDEDE] pb-[8px]">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="w-[50px]">SUN</th>
                                            <th className="w-[50px]">MON</th>
                                            <th className="w-[50px]">TUE</th>
                                            <th className="w-[50px]">WED</th>
                                            <th className="w-[50px]">THU</th>
                                            <th className="w-[50px]">FRI</th>
                                            <th className="w-[50px]">SAT</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    )}
                    <div className={isMobile ? "max-h-[400px] overflow-y-auto scrollbar-thin" : ""}>
                        <DayPicker
                            navLayout="around"
                            numberOfMonths={isMobile ? 1 : 2}
                            hideWeekdays={true}
                            mode="range"
                            selected={selectedRange}
                            onSelect={handleDateRangeChange}
                            defaultMonth={isMobile ? subMonths(new Date(), 0) : subMonths(new Date(), 1)}
                            classNames={{
                                month: "text-[16px]",
                                weekday: "uppercase text-[14px] font-medium pb-[8px] w-[50px]",
                                weekdays: "border-b border-[#DEDEDE]",
                                day: 'w-[50px]'
                            }}
                        />
                    </div>
                </div>
                
                <div className="relative py-[16px] pb-[24px] px-[16px] lg:px-[32px]">
                    <button type="button" onClick={handleSave} className="flex relative justify-center items-center w-full gap-[4px] p-[10px] text-[14px] font-medium leading-[20px] text-[#E6F7FE] bg-[#221AE9] rounded-full border border-[#1B14CC] shadow-[0px_0px_1px_2px_rgba(34,26,233,.2)] after:content-[''] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:rounded-full after:shadow-inset after:shadow-[0px_0px_0px_2px_rgba(78,71,255,1)] before:content-[''] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:rounded-full before:shadow-inset before:shadow-[0px_2px_2px_0px_rgba(28,23,166,1)] before:z-10 hover:bg-[#2d25ea] hover:after:hidden hover:before:hidden">Save</button>
                </div>
            </div>
        </div>
    )
}
