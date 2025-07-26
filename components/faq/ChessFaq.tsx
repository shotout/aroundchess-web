"use client";
import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useApiClient } from "@/functions/api-client";
import { searchFAQs } from "./search";
import ChessFAQSkeleton from "./ChessFaqSkeleton";

export default function ChessFAQ() {
  const { getFAQ, isLoading } = useApiClient();
  const [activeTab, setActiveTab] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [question, setQuestion] = useState<any[]>([]);
  const [openQuestion, setOpenQuestion] = useState<number>(0);
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

  const toggleQuestion = (index: any) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

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
          className="font-normal text-[12px] w-full h-full bg-[#F8F9FC] focus:border-0 focus:outline-none"
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
                  className={`sm:text-[12px] lg:text-[20px] font-medium text-center ${
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

      <div className="md:hidden flex flex-row mx-[16px] gap-2">
        {filteredData.map((tab, index) => (
          <button
            key={tab.id}
            className={`relative flex flex-col items-center justify-center px-[12px] h-[42px] rounded-[12px] overflow-hidden ${
              tab.label.includes("General") ? "w-[40%]" : "w-[60%]"
            } ${
              activeTab === tab.label
                ? "text-[#221AE9] border border-[#221AE9] bg-blue-50"
                : "bg-white border border-gray-300"
            }`}
            onClick={() => {
              setQuestion(tab.questions);
              setActiveTab(tab.label);
            }}
          >

            {/* Mobile text wrapper */}
            <div className="flex flex-col items-start">
              <span className="block text-[11px] font-medium text-start">
                {tab.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <h2 className="text-[16px] md:text-[24px] text-center font-bold mx-4 mt-8">
        {activeTab}
      </h2>

      <div className="space-y-3 mx-4 mb-[32px] z-[2]">
        {question != null &&
          question.length > 0 &&
          question.map((faq: any, index: number) => (
            <div key={index} className="bg-white rounded-md shadow">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-[20px] py-2 text-left flex justify-between items-center"
              >
                <span className="font-semibold text-[12px] md:text-[16px]">
                  {faq.question}
                </span>
                {openQuestion === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {openQuestion === index && (
                <div className="px-[20px] py-[5px] md:py-[10px] border-t bg-[#F2FBFE]">
                  {Array.isArray(faq.answer) && faq.answer.length > 0 ? (
                    <div className="space-y-1">
                      {faq.answer.map((line: any, i: number) => (
                        <span
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html: line.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                          }}
                          className="font-normal text-[12px] md:text-[14px] text-[#585858]"
                        ></span>
                      ))}
                    </div>
                  ) : (
                    <span
                      className="font-normal text-[12px] md:text-[14px] text-[#585858]"
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
