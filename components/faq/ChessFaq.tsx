"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useApiClient } from "@/functions/api-client";
import { searchFAQs } from "./search";
import ChessFAQSkeleton from "./ChessFaqSkeleton";

// Preferred display order for FAQ questions (matched by keyword), so the list
// renders in the approved design order regardless of the API's own ordering.
// Questions that match none of these keep their original order, after the rest.
const QUESTION_ORDER = [
  // General Questions
  "ai analysis",
  "training programs",
  "track my progress",
  "suitable for players",
  "opening preparation",
  // Pricing, Tokens and Subscriptions
  "pricing model",
  "difference between the token",
  "free package",
  "unused analysis tokens",
];

function orderQuestions(questions: any[]): any[] {
  const rank = (q: any) => {
    const text = (q?.question || "").toLowerCase();
    const i = QUESTION_ORDER.findIndex((kw) => text.includes(kw));
    return i === -1 ? QUESTION_ORDER.length : i;
  };
  return [...questions].sort((a, b) => rank(a) - rank(b));
}

export default function ChessFAQ() {
  const { getFAQ, isLoading } = useApiClient();
  const [activeTab, setActiveTab] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [question, setQuestion] = useState<any[]>([]);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [widthContainer, setWidthContainer] = useState<number>(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetchFAQ();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  const handleResize = () => {
    const widthC = window?.innerWidth;
    setWidthContainer(widthC);
  };

  const fetchFAQ = () => {
    getFAQ({})
      .then((response) => {
        const data = response.data;
        data.sort((a: { label: string }, b: { label: any }) =>
          a.label.localeCompare(b.label)
        );
        setData(data);
        setFilteredData(data);
        setQuestion(response.data[0].questions);
        setActiveTab(response.data[0].label);
      })
      .finally(() => {});
  };

  // Multiple items can be open at once — items start collapsed and each toggle
  // just flips whether that one index is open.
  const toggleQuestion = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Reset to "all collapsed" whenever the visible question set changes
  // (switching tabs or running a search).
  useEffect(() => {
    setOpenItems(new Set());
  }, [question]);

  // Render questions in the approved design order (see QUESTION_ORDER).
  const orderedQuestions = useMemo(() => orderQuestions(question), [question]);

  useEffect(() => {
    if (data.length > 0) {
      if (query.length >= 3) {
        const timer = setTimeout(() => {
          const results = searchFAQs(data, query);
          results.sort((a, b) => a.label.localeCompare(b.label));
          setActiveTab(results[0].label);
          setQuestion(results[0].questions);
          setFilteredData(results);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        data.sort((a, b) => a.label.localeCompare(b.label));
        setQuestion(data[0].questions);
        setActiveTab(data[0].label);
        setFilteredData(data);
      }
    }
  }, [query, data]);

  const handleOnSearch = (e: any) => {
    setQuery(e.target.value);
  };

  if (isLoading) return <ChessFAQSkeleton />;

  return (
    <div className="flex flex-col w-full bg-gradient-to-b from-[#BDD5FF] via-[#FCFCFD] to-[#FCFCFD] gap-3">
      <div className="relative flex justify-center p-[16px] md:mt-[72px]">
        <Image
          src={`/images/faq/background-${
            widthContainer < 1024 ? `mobile` : `laptop`
          }.png`}
          alt="background"
          width={1000}
          height={1000}
          quality={100}
          className="w-full absolute inset-0 object-contain"
        />
        <div className="flex items-center">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={1000}
            height={1000}
            className="w-[155.75px] h-[50px] object-contain"
          />
        </div>
      </div>

      <h1 className="text-[18px] font-semibold text-center px-[16px] md:text-[33.47px]">
        Frequently Asked Questions
      </h1>

      <div className="relative flex flex-row items-center md:w-[445px] md:self-center mx-[16px] p-3 gap-2 bg-[#F8F9FC] rounded-md border border-[#DEDEDE]">
        <Search size={20} color="#73778B" className="pl-1" />
        <input
          value={query}
          type="text"
          placeholder="Search"
          className="font-normal text-[14px] -- w-full h-full bg-[#F8F9FC] focus:border-0 focus:outline-none"
          onChange={handleOnSearch}
        />
      </div>

      <div className="hidden md:flex w-[95%] z-[2] self-center flex-row items-center justify-center xl:justify-around gap-8 mx-[16px] z-1 mt-[100px] rounded-[8px]">
        {filteredData.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => {
              setQuestion(tab.questions);
              setActiveTab(tab.label);
            }}
            className="relative flex flex-row items-center justify-center bg-[#FFF] sm:min-w-[300px] lg:min-w-[400px] xl:min-w-[522px] py-[24px] pr-[9px] h-[92px] border border-[#DEDEDE] rounded-[8px] overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="relative w-[80px] sm:w-[90px] lg:w-[100px] xl:w-[120px] h-[40px] sm:h-[48px] lg:h-[52px] xl:h-[60px]">
                <Image
                  src={
                    tab.label.includes("General")
                      ? "/images/faq/question-mark.png"
                      : "/images/faq/analysis-mark.png"
                  }
                  alt={
                    tab.label.includes("General")
                      ? "question mark"
                      : "analysis mark"
                  }
                  width={120}
                  height={88}
                  quality={100}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center ml-[100px] sm:ml-[110px] lg:ml-[120px] xl:ml-[140px] mr-4">
              <div className="bg-[#ffffff90] backdrop-blur-sm w-full p-[12px] min-h-[44px] max-h-[71px] rounded-[12px] flex items-center justify-center">
                <span
                  className={`sm:text-[14px] -- lg:text-[20px] font-medium text-center ${
                    activeTab === tab.label
                      ? "text-[#221AE9] font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="md:hidden flex flex-row mx-[16px] border-b border-gray-200">
        {filteredData.map((tab, index) => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center justify-center text-center px-[8px] py-[10px] text-[13px] leading-tight border-b-2 -mb-px transition-colors ${
              activeTab === tab.label
                ? "text-[#221AE9] font-bold border-[#221AE9]"
                : "text-gray-600 font-medium border-transparent"
            }`}
            onClick={() => {
              setQuestion(tab.questions);
              setActiveTab(tab.label);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <h2 className="text-[16px] md:text-[24px] text-center font-bold mx-4 mt-8">
        {activeTab}
      </h2>

      <div className="space-y-3 mx-4 mb-[32px] z-[2]">
        {orderedQuestions != null &&
          orderedQuestions.length > 0 &&
          orderedQuestions.map((faq: any, index: number) => (
            <div key={index} className="bg-white rounded-md shadow">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-[20px] py-2 text-left flex justify-between items-center"
              >
                <span className="font-semibold text-[14px] -- md:text-[16px]">
                  {faq.question}
                </span>
                {openItems.has(index) ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {openItems.has(index) && (
                <div className="faq-answer px-[20px] py-[5px] md:py-[10px] border-t bg-[#F2FBFE]">
                  {Array.isArray(faq.answer) && faq.answer.length > 0 ? (
                    <div className="space-y-1">
                      {faq.answer.map((line: any, i: number) => (
                        <span
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html: line.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                          }}
                          className="font-normal text-[14px] -- md:text-[14px] text-[#585858]"
                        ></span>
                      ))}
                    </div>
                  ) : (
                    <span
                      className="font-normal text-[14px] -- md:text-[14px] text-[#585858]"
                      dangerouslySetInnerHTML={{
                        __html: faq.answer.replace(
                          /\*\*(.*?)\*\*/g,
                          "<b>$1</b>"
                        ),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
